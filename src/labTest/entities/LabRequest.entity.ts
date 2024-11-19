import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { MedicalRecord } from 'src/patient/entities/MedicalRecord.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { LabTest } from './LabTest.entity';
import { TestResult } from './TestResult.entity';

export class LabRequest extends BaseClassProperties {
  @Column()
  date: Date;
  @JoinColumn({
    name: 'doctor_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Doctor, (doctor) => doctor.id)
  doctor: Doctor;
  @JoinColumn({
    name: 'patient_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Patient, (patient) => patient.id)
  patient: Patient;
  @JoinColumn({
    name: 'medical_record_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.id)
  medicalRecord: MedicalRecord;
  @JoinColumn({
    name: 'lab_test_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => LabTest, (labTest) => labTest.id)
  labTest: LabTest;
  @JoinColumn({
    name: 'test_result_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => TestResult, (testResult) => testResult.id)
  testResult: TestResult;
}
