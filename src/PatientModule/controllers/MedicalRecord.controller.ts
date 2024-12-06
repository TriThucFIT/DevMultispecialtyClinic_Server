import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MedicalRecordService } from '../services/MedicalRecod.service';
import {
  MedicalRecordCreation,
  MedicalRecordEntryCreation,
  MedicalRecordEntryResponseDto,
  MedicalRecordEntryUpdate,
  MedicalRecordResponseDto,
} from '../dto/patient.dto';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';
import { InsertValuesMissingError } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Controller('medical-record')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Get()
  async getMedicalRecordByPatient(
    @Query('patientId') patientId: string,
    @Query('recordId') recordId: number,
  ): Promise<ApiResponseDto<MedicalRecordResponseDto>> {
    if (recordId) {
      const record = await this.medicalRecordService.findOne(recordId);
      if (!record) {
        throw new NotFoundException('Không tìm thấy hồ sơ y tế');
      }

      return {
        data: plainToClass(
          MedicalRecordResponseDto,
          {
            ...record,
            entries: record.entries.reverse(),
          },
          {
            excludeExtraneousValues: true,
          },
        ),
        message: 'Success',
        statusCode: 200,
      };
    } else if (patientId) {
      const record = await this.medicalRecordService.findByPatientId(patientId);
      if (!record) {
        throw new NotFoundException('Không tìm thấy hồ sơ y tế');
      }
      return {
        data: plainToClass(
          MedicalRecordResponseDto,
          {
            ...record,
            entries: record.entries.reverse(),
          },
          {
            excludeExtraneousValues: true,
          },
        ),
        message: 'Success',
        statusCode: 200,
      };
    } else {
      throw new InsertValuesMissingError();
    }
  }

  @Get('/medical-record-entry/:entryId')
  async getMedicalRecordEntry(
    @Param('entryId') entryId: number,
  ): Promise<ApiResponseDto<MedicalRecordEntryResponseDto>> {
    const recordEntry =
      await this.medicalRecordService.findRecordEntry(entryId);
    return {
      data: plainToClass(MedicalRecordEntryResponseDto, recordEntry, {
        excludeExtraneousValues: true,
      }),
      message: 'Success',
      statusCode: 200,
    };
  }

  @Post()
  async createMedicalRecord(
    @Body() recorddto: MedicalRecordCreation,
  ): Promise<ApiResponseDto<MedicalRecordResponseDto>> {
    const record =
      await this.medicalRecordService.createMedicalRecord(recorddto);
    return {
      data: plainToClass(MedicalRecordResponseDto, record, {
        excludeExtraneousValues: true,
      }),
      message: 'Success',
      statusCode: 200,
    };
  }

  @Post('entry/:recordId')
  async addRecordEntryToMedicalRecord(
    @Body() record: MedicalRecordEntryCreation,
    @Param('recordId') recordId: number,
  ): Promise<ApiResponseDto<MedicalRecordResponseDto>> {
    const recordEntry = await this.medicalRecordService.addRecordEntryToRecord(
      recordId,
      record,
    );
    return {
      data: plainToClass(MedicalRecordResponseDto, recordEntry, {
        excludeExtraneousValues: true,
      }),
      message: 'Success',
      statusCode: 200,
    };
  }

  @Post('entry')
  async updateRecordEntry(
    @Body() record: MedicalRecordEntryUpdate,
  ): Promise<ApiResponseDto<MedicalRecordResponseDto>> {
    const recordEntry =
      await this.medicalRecordService.updateRecordEntry(record);
    return {
      data: plainToClass(MedicalRecordResponseDto, recordEntry, {
        excludeExtraneousValues: true,
      }),
      message: 'Success',
      statusCode: 200,
    };
  }
}
