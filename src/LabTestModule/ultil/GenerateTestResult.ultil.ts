import { LabTestService } from '../labTest.service';
import { PatientService } from 'src/PatientModule/services/patient.service';
import { MedicalRecordService } from 'src/PatientModule/services/MedicalRecod.service';
import path from 'path';
import { readFileSync } from 'fs';

export class GenerateTestResult {
  private labTests: any[];
  constructor(
    private readonly labTestService: LabTestService,
    private readonly medicalRecordService: MedicalRecordService,
    private readonly patientService: PatientService,
  ) {}

  async generateTestResult(request: string) {
    // read data json from file TestResult.data.json
    const data = this.loadLabTests();
    const labTest = data.find((item) => item.id === request);
}
    // find lab test by id
  private loadLabTests() {
    const filePath = path.resolve(__dirname, '../data/labTests.json');
    const data = readFileSync(filePath, 'utf8');
    return this.labTests = JSON.parse(data);
  }
}
