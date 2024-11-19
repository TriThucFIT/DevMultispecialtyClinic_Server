import { BaseClassProperties } from 'src/Common/BaseClassProperties';
<<<<<<< HEAD:src/labTest/entities/LabRequest.entity.ts
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { MedicalRecord } from 'src/patient/entities/MedicalRecord.entity';
import { Patient } from 'src/patient/entities/patient.entity';
=======
import { Doctor } from 'src/DoctorModule/entities/doctor.entity';
import { MedicalRecord } from 'src/PatientModule/entities/MedicalRecord.entity';
import { Patient } from 'src/PatientModule/entities/patient.entity';
>>>>>>> 2ed803faf176af1a2b6ef2f3117e0ff22b1c3a92:src/LabTestModule/entities/LabRequest.entity.ts
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
