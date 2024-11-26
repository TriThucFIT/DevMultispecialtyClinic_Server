import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceItem } from '../entities/invoiceItem.entity';
import {
  InvoiceCreationDTO,
  InvoiceResponseDTO,
  InvoiceUpdateItemsRequest,
  PayInvoiceRequest,
} from '../types/invoice';
import { PatientService } from 'src/PatientModule/services/patient.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { InvoiceStatus } from '../enums/InvoiceStatus.enum';
import { log, error } from 'console';
import { CasherService } from '../casher.service';
import { ActiveMqService } from 'src/ActiveMQModule/activeMQ.service';
import { PatientSendToQueue } from 'src/AdmissionModule/dto/Admission.dto';
import { MedicalRecordService } from 'src/PatientModule/services/MedicalRecod.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    private readonly patientService: PatientService,
    private readonly casherService: CasherService,
    private readonly activeMqService: ActiveMqService,
    private readonly medicalRecordService: MedicalRecordService,
  ) {}

  async findAll() {
    return this.invoiceRepository.find();
  }

  async findOne(id: number) {
    return this.invoiceRepository.findOne({ where: { id } });
  }

  async findByPatientInfo(
    phone?: string,
    fullName?: string,
    email?: string,
    patientId?: string,
  ): Promise<InvoiceResponseDTO[]> {
    const patients = await this.patientService.findAll(
      phone,
      fullName,
      email,
      patientId,
    );

    const invoices = await Promise.all(
      patients.map((p) => {
        return this.invoiceRepository.find({
          where: {
            patient: {
              patientId: p.patientId,
            },
          },
          relations: ['invoiceItems', 'patient'],
        });
      }),
    ).then((invoices) => invoices.flat());

    const data = invoices.map((invoice) => {
      return plainToClass(InvoiceResponseDTO, invoice, {
        excludeExtraneousValues: true,
      });
    });

    if (!data.length) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    return data;
  }

  async create(invoice: InvoiceCreationDTO) {
    const newInvoice = this.invoiceRepository.create({
      ...invoice,
      date: new Date(),
    });
    const invoiceItems = await Promise.all(
      invoice.items.map(async (item) => {
        const newItem = this.invoiceItemRepository.create({
          ...item,
          invoice: newInvoice,
        });
        return await this.invoiceItemRepository.save(newItem);
      }),
    );

    newInvoice.invoiceItems = invoiceItems;
    await this.invoiceRepository.save(newInvoice);
    return newInvoice;
  }

  async payInvoice(payInvoice: PayInvoiceRequest) {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id: payInvoice.invoice_id },
        relations: ['invoiceItems', 'patient'],
      });
      if (!invoice) {
        throw new NotFoundException('Không tìm thấy hóa đơn');
      }

      const validItemIds = invoice.invoiceItems.map((item) => item.id);
      const invalidItems = payInvoice.items_to_pay.filter(
        (itemId) => !validItemIds.includes(itemId),
      );
      const paidItems = invoice.invoiceItems.filter(
        (item) =>
          item.status === InvoiceStatus.PAID &&
          payInvoice.items_to_pay.includes(item.id),
      );

      if (paidItems.length > 0) {
        throw new BadRequestException(
          `Các mục hóa đơn đã được thanh toán: ${paidItems
            .map((item) => item.name)
            .join(', ')}`,
        );
      }

      if (invalidItems.length > 0) {
        throw new BadRequestException(
          `Các mục hóa đơn không hợp lệ: ${invalidItems.join(', ')}`,
        );
      }

      const totalPaidNeeded = invoice.invoiceItems
        .filter((item) => payInvoice.items_to_pay.includes(item.id))
        .reduce((total, item) => total + Number(item.amount), 0);

      if (Number(totalPaidNeeded) > Number(payInvoice.total_paid)) {
        throw new BadRequestException('Số tiền thanh toán không đủ');
      }

      invoice.invoiceItems.map((item) => {
        if (payInvoice.items_to_pay.includes(item.id)) {
          item.status = InvoiceStatus.PAID;
          this.invoiceItemRepository.update(item.id, item);
        }
      });

      invoice.casher = await this.casherService.findByAccount(
        undefined,
        payInvoice.casher_username,
      );
      invoice.payment_method = payInvoice.payment_method;
      invoice.payment_date = new Date(payInvoice.payment_date);
      invoice.payment_person_name = payInvoice.payment_person_name;
      invoice.payment_person_phone = payInvoice.payment_person_phone;

      invoice.calculateTotalPaid();
      invoice.calculateStatus();
      invoice.checkStatus();

      await this.invoiceRepository.save(invoice);

      log('invoice after pay', invoice);

      let medical_record = await this.medicalRecordService.findByPatientId(
        invoice.patient?.patientId,
      );

      if (!medical_record) {
        const record = {
          patient: invoice.patient,
          notes: payInvoice.patient.symptoms,
          entries: [
            {
              record: medical_record,
              symptoms: payInvoice.patient.symptoms,
              doctorId: payInvoice.patient.admission.doctor_id,
            },
          ],
        };
        log('create new medical_record', record);

        medical_record =
          await this.medicalRecordService.createMedicalRecord(record);
      }

      const recordEntry = {
        record: medical_record,
        symptoms: payInvoice.patient.symptoms,
        doctorId: payInvoice.patient.admission.doctor_id,
      };
      log('add new entry medical_record', recordEntry);

      this.medicalRecordService.createRecordEntry(recordEntry);

      const sendData: PatientSendToQueue = {
        id: payInvoice.patient.id,
        fullName: payInvoice.patient.fullName,
        phone: payInvoice.patient.phone,
        dob: payInvoice.patient.dob.toString(),
        age:
          new Date().getFullYear() -
          new Date(payInvoice.patient.dob).getFullYear(),
        condition: payInvoice.patient.symptoms,
        priority: payInvoice.patient.priority,
        status: payInvoice.patient.status,
        gender: payInvoice.patient.gender,
        symptoms: payInvoice.patient.symptoms,
        address: payInvoice.patient.address,
      };
      let queueName: string;

      if (payInvoice.patient.admission.service === 'EMERGENCY') {
        queueName = 'emergency';
      } else {
        queueName =
          payInvoice.patient.admission.specialization + '_specialization';
      }

      this.activeMqService.sendMessage(
        queueName,
        JSON.stringify(sendData),
        payInvoice.patient?.admission?.doctor_id,
      );
      return invoice;
    } catch (e) {
      error(e);
      throw e;
    }
  }

  async addInvoiceItem(
    invoiceUpdate: InvoiceUpdateItemsRequest,
  ): Promise<InvoiceResponseDTO> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceUpdate.invoice_id },
      relations: ['invoiceItems'],
    });

    if (!invoice) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    log(
      'invoiceUpdate.items previous',
      invoice.invoiceItems.map((i) => {
        return {
          name: i.name,
          itemType: i.itemType,
        };
      }),
    );

    const newItems = await Promise.all(
      invoiceUpdate.items.map(async (item) => {
        const newItem = this.invoiceItemRepository.create({
          ...item,
          invoice,
        });
        const existingItem = invoice.invoiceItems.find(
          (i) => i.itemType === item.itemType && i.name === item.name,
        );
        if (existingItem) {
          return existingItem;
        }
        return await this.invoiceItemRepository.save(newItem);
      }),
    );

    invoice.invoiceItems = [...invoice.invoiceItems, ...newItems];

    log(
      'invoice.invoiceItems after update',
      invoice.invoiceItems.map((i) => {
        return {
          name: i.name,
          itemType: i.itemType,
        };
      }),
    );

    invoice.calculateTotalAmount();
    invoice.calculateTotalPaid();
    invoice.calculateStatus();
    invoice.checkStatus();

    const updateInvoice = await this.invoiceRepository.save(invoice);

    return plainToClass(InvoiceResponseDTO, updateInvoice, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, invoice: Invoice) {
    return this.invoiceRepository.update(id, invoice);
  }

  async delete(id: number) {
    return this.invoiceRepository.delete(id);
  }

  async deleteAll() {
    return this.invoiceRepository.clear();
  }
}
