import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { LabTest } from './entities/LabTest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientService } from 'src/PatientModule/services/patient.service';
import { DoctorService } from 'src/DoctorModule/doctor.service';
import { LabRequest } from './entities/LabRequest.entity';
import { TestResult } from './entities/TestResult.entity';
import { LabTestCategoryCreationDTO, LabTestCreationDTO } from './types';
import { LabRequestCreation } from './types/labRequest.type';
import { MedicalRecordService } from 'src/PatientModule/services/MedicalRecod.service';
import { LabTestStatus } from './enums';
import { TestResultCreationDto } from 'src/PatientModule/dto/patient.dto';
import { LabTestCategory } from './entities/LabTestCategory.entity';
import { log } from 'console';

@Injectable()
export class LabTestService {
  constructor(
    @InjectRepository(LabTest)
    private readonly labTestRepository: Repository<LabTest>,
    @InjectRepository(LabRequest)
    private readonly labRequestRepository: Repository<LabRequest>,
    @InjectRepository(TestResult)
    private readonly testResultRepository: Repository<TestResult>,
    @InjectRepository(LabTestCategory)
    private readonly labTestCategoryRepository: Repository<LabTestCategory>,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    private readonly medicalRecordService: MedicalRecordService,
  ) {}
  async createLabTest(LabTestCreation: LabTestCreationDTO): Promise<LabTest> {
    const doctor = await this.doctorService.findByEmployeeId(
      LabTestCreation.doctorId,
    );
    if (!doctor) {
      throw new NotFoundException('Không tìm thấy bác sĩ');
    }
    let category: LabTestCategory;
    if (
      LabTestCreation.category &&
      typeof LabTestCreation.category === 'object'
    ) {
      category = await this.labTestCategoryRepository.findOne({
        where: { name: LabTestCreation.category.name },
        relations: ['labtests'],
      });
      if (!category) {
        category = new LabTestCategory();
        category.name = LabTestCreation.category.name;
        category.description = LabTestCreation.category?.description;
        category.labtests = [];
      }
    } else if (
      LabTestCreation.category &&
      typeof LabTestCreation.category === 'number'
    ) {
      category = await this.labTestCategoryRepository.findOne({
        where: { id: LabTestCreation.category },
        relations: ['labtests'],
      });
      if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục xét nghiệm');
      }
    } else {
      log('Invalid category', LabTestCreation.category);
      throw new BadRequestException('Danh mục xét nghiệm không hợp lệ');
    }

    const labTest = new LabTest();
    labTest.name = LabTestCreation.name;
    labTest.price = LabTestCreation.price;
    labTest.doctor = doctor;
    labTest.category = category;
    category.labtests.push(labTest);
    await this.labTestCategoryRepository.save(category);
    return this.labTestRepository.save(labTest);
  }

  async findAll(): Promise<LabTest[]> {
    return this.labTestRepository.find();
  }

  async findLabTestByCategory(): Promise<LabTestCategory[]> {
    return this.labTestCategoryRepository.find({ relations: ['labtests'] });
  }

  async findOne(id: number): Promise<LabTest> {
    const lab = await this.labTestRepository.findOne({ where: { id } });
    if (!lab) {
      throw new NotFoundException('Không tìm thấy xét nghiệm');
    }
    return lab;
  }

  async createLabRequest(request: LabRequestCreation): Promise<LabRequest> {
    let medicalRecordEntry = await this.medicalRecordService.findRecordEntry(
      request.medicalRecordEntryId,
    );

    if (!medicalRecordEntry) {
      throw new NotFoundException('Không tìm thấy hồ sơ bệnh án');
    }

    if (medicalRecordEntry.labRequests.length) {
      throw new Error('Đã yêu cầu xét nghiệm cho bệnh án này');
    }
    if (
      medicalRecordEntry.labRequests.some(
        (labRequest) => labRequest.labTest.id === request.labTestId,
      )
    ) {
      throw new Error('Đã yêu cầu xét nghiệm này cho bệnh án này');
    }

    const labTest = await this.findOne(request.labTestId);
    if (!labTest) {
      throw new NotFoundException('Không tìm thấy xét nghiệm');
    }

    if (medicalRecordEntry.doctor?.employeeId !== request.doctorId) {
      const doctor = await this.doctorService.findByEmployeeId(
        request.doctorId,
      );
      if (!doctor) {
        throw new NotFoundException('Không tìm thấy bác sĩ');
      }
      medicalRecordEntry.doctor = doctor;
      medicalRecordEntry =
        await this.medicalRecordService.saveRecordEntry(medicalRecordEntry);
    }

    const labRequest = new LabRequest();
    labRequest.labTest = labTest;
    labRequest.requestDate = new Date();
    labRequest.status = LabTestStatus.PENDING;
    labRequest.medicalRecordEntry = medicalRecordEntry;
    return this.labRequestRepository.save(labRequest);
  }

  async createTestResult(result: TestResultCreationDto): Promise<TestResult> {
    const labRequest = await this.labRequestRepository.findOne({
      where: { id: result.labRequestId },
      relations: ['testResult'],
    });
    if (!labRequest) {
      throw new NotFoundException('Không tìm thấy yêu cầu xét nghiệm');
    }
    if (labRequest.testResult) {
      throw new Error('Đã có kết quả xét nghiệm cho yêu cầu này');
    }
    const testResult = new TestResult();
    testResult.result = result.result;
    testResult.detail = result.detail;
    testResult.notes = result.notes;
    testResult.images = result.images;
    labRequest.testResult = testResult;
    await this.labRequestRepository.save(labRequest);
    return this.testResultRepository.save(testResult);
  }
}
