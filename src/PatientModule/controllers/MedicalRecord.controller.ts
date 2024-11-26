import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MedicalRecordService } from '../services/MedicalRecod.service';
import {
  MedicalRecordCreation,
  MedicalRecordEntryCreation,
  MedicalRecordResponseDto,
} from '../dto/patient.dto';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';
import { InsertValuesMissingError } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { log } from 'console';

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
      return {
        data: plainToClass(MedicalRecordResponseDto, record, {
          excludeExtraneousValues: true,
        }),
        message: 'Success',
        statusCode: 200,
      };
    } else if (patientId) {
      const record = await this.medicalRecordService.findByPatientId(patientId);
      return {
        data: plainToClass(MedicalRecordResponseDto, record, {
          excludeExtraneousValues: true,
        }),
        message: 'Success',
        statusCode: 200,
      };
    } else {
      throw new InsertValuesMissingError();
    }
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
}
