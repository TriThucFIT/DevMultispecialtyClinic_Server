import { Injectable } from '@nestjs/common';
import { ActiveMqService } from 'src/activeMQ/activeMQ.service';
import { PatientRegistration } from './Admission.types';

@Injectable()
export class AdmissionService {
  constructor(private readonly activeMqService: ActiveMqService) {}

  async getAdmission() {
    return 'Admission';
  }

  async createPatientRegistration(patientRegistration: PatientRegistration) {
    const queue = patientRegistration.specialist + '_specialist';
    const sendData = {
      ...patientRegistration,
      id: Math.random().toString(36).substring(7),
      age:
        new Date().getFullYear() -
        new Date(patientRegistration.dob).getFullYear(),
      priority: patientRegistration.priority
        ? patientRegistration.priority
        : this.calculatePriority(patientRegistration),
    };
    this.activeMqService.sendMessage(queue, JSON.stringify(sendData));
  }

  private calculatePriority(patient: PatientRegistration): number {
    if (patient.seviceType === 'EMERGENCY') {
      return 0;
    }

    if (patient.seviceType === 'OVERTIME') {
      return 1;
    }

    const currentYear = new Date().getFullYear();
    const birthYear = new Date(patient.dob).getFullYear();
    const age = currentYear - birthYear;

    if (age >= 80) {
      return 2;
    }

    return 3;
  }
}
