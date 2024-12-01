import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { PatientSendToQueue } from 'src/AdmissionModule/dto/Admission.dto';
import { InvoiceItem } from 'src/CasherModule/entities/invoiceItem.entity';
import { InvoiceStatus } from 'src/CasherModule/enums/InvoiceStatus.enum';
import { PaymentMethod } from 'src/CasherModule/enums/itemType.enum';
import { BaseDTO } from 'src/Common/BaseDTO';
import { PatientResponseDto } from 'src/PatientModule/dto/patient.dto';
import { Patient } from 'src/PatientModule/entities/patient.entity';

export type InvoiceCreationDTO = {
  items: Partial<InvoiceItem>[];
  patient: Partial<Patient>;
};

export class InvoiceUpdateItemsRequest {
  @IsNotEmpty()
  invoice_id: number;
  @IsNotEmpty()
  items: Partial<InvoiceItem>[];
}

export class PayInvoiceRequest  {
  @IsNotEmpty()
  invoice_id: number;
  casher_username: string;
  @IsNotEmpty()
  @ArrayNotEmpty()
  items_to_pay: number[];
  total_paid: number;
  payment_method: PaymentMethod;
  payment_date: Date;
  payment_person_name: string;
  payment_person_phone: string;
  patient: Partial<PatientSendToQueue>;
};

export class InvoiceResponseDTO extends BaseDTO {
  @Expose()
  date: Date;
  @Expose()
  total_amount: number;
  @Expose()
  total_paid: number;
  @Expose()
  status: InvoiceStatus;
  @Expose()
  payment_method: PaymentMethod;
  @Expose()
  payment_date: Date;
  @Expose()
  payment_person_phone: string;
  @Expose()
  payment_person_name: string;
  @Expose()
  @Type(() => InvoiceItemResponseDTO)
  invoiceItems: InvoiceItemResponseDTO[];
  @Expose()
  @Type(() => PatientResponseDto)
  patient: PatientResponseDto;
}

export class InvoiceItemResponseDTO extends BaseDTO {
  @Expose()
  itemType: string;
  @Expose()
  name: string;
  @Expose()
  status: InvoiceStatus;
  @Expose()
  amount: number;
}
