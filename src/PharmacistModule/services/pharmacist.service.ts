import { Injectable, NotFoundException } from '@nestjs/common';
import { Prescription } from '../entities/prescription.entity';
import { Repository } from 'typeorm';
import { PrescriptionMedication } from '../entities/prescriptionMedication.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientService } from 'src/PatientModule/services/patient.service';
import { DoctorService } from 'src/DoctorModule/doctor.service';
import { Pharmacist } from '../entities/pharmacist.entity';
import { PharmacistCreationDTO } from '../types/Pharmacist.type';

@Injectable()
export class PharmacistService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(PrescriptionMedication)
    private readonly prescriptionMedicationRepository: Repository<PrescriptionMedication>,
    @InjectRepository(Pharmacist)
    private readonly pharmacistRepository: Repository<Pharmacist>,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
  ) {}

  async createPharmacist(
    pharmacist: PharmacistCreationDTO,
  ): Promise<Pharmacist> {
    return this.pharmacistRepository.save(pharmacist);
  }

  async findByAccount(accountId: number): Promise<Pharmacist> {
    return this.pharmacistRepository.findOne({
      where: { account: { id: accountId } },
    });
  }
}
