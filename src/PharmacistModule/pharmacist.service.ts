import { Injectable, NotFoundException } from '@nestjs/common';
import { Prescription } from './entities/prescription.entity';
import { Repository } from 'typeorm';
import { PrescriptionMedication } from './entities/prescriptionMedication.entity';
import { InvoiceService } from 'src/CasherModule/services/Invoice.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientService } from 'src/PatientModule/services/patient.service';
import { DoctorService } from 'src/DoctorModule/doctor.service';

@Injectable()
export class PharmacistService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(PrescriptionMedication)
    private readonly prescriptionMedicationRepository: Repository<PrescriptionMedication>,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly invoiceService: InvoiceService,
  ) {}

    async createPrescription(prescription: Prescription) {
        
    }
}
