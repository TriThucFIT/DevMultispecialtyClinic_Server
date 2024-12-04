import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { MedicationService } from '../services/Medication.service';
import {
  MedicationCreateDto,
  MedicationResponseDto,
  PrescriptionDto,
  PrescriptionResponseDto,
} from '../types';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';
import { plainToClass } from 'class-transformer';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  async createMedication(
    @Body() medication: MedicationCreateDto,
  ): Promise<ApiResponseDto<MedicationResponseDto>> {
    const med = await this.medicationService.createMedication(medication);
    return {
      data: plainToClass(MedicationResponseDto, med, {
        excludeExtraneousValues: true,
      }),
      message: 'Medication created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post('bulk')
  async createMedications(
    @Body() medications: MedicationCreateDto[],
  ): Promise<ApiResponseDto<MedicationResponseDto[]>> {
    const meds = await this.medicationService.createMedications(medications);
    return {
      data: plainToClass(MedicationResponseDto, meds, {
        excludeExtraneousValues: true,
      }),
      message: 'Medications created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  async getMedication(
    @Query('id') id: number,
    @Query('name') name: string,
  ): Promise<ApiResponseDto<MedicationResponseDto | MedicationResponseDto[]>> {
    let medications: MedicationResponseDto | MedicationResponseDto[];
    if (id) {
      medications = await this.medicationService.getMedicationById(id);
    } else if (name) {
      medications = await this.medicationService.getMedicationByName(name);
    } else {
      medications = await this.medicationService.getMedications();
    }
    return {
      data: plainToClass(MedicationResponseDto, medications, {
        excludeExtraneousValues: true,
      }),
      message: 'Medication found',
      statusCode: HttpStatus.OK,
    };
  }

  @Post('prescription')
  async createPrescription(
    @Body() prescription: PrescriptionDto,
  ): Promise<ApiResponseDto<PrescriptionResponseDto>> {
    const pres = await this.medicationService.createPrescription(prescription);
    return {
      data: plainToClass(PrescriptionResponseDto, pres, {
        excludeExtraneousValues: true,
      }),
      message: 'Tạo đơn thuốc thành công',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get('prescription')
  async getPrescription(
    @Query('id') id: number,
  ): Promise<
    ApiResponseDto<PrescriptionResponseDto | PrescriptionResponseDto[]>
  > {
    if (!id) {
      return {
        data: plainToClass(
          PrescriptionResponseDto,
          await this.medicationService.getPrescriptions(),
          {
            excludeExtraneousValues: true,
          },
        ),
        message: 'Danh sách đơn thuốc',
        statusCode: HttpStatus.OK,
      };
    }
    const pres = await this.medicationService.getPrescriptionById(id);
    if (!pres) {
      throw new NotFoundException('Không tìm thấy đơn thuốc');
    }

    return {
      data: plainToClass(PrescriptionResponseDto, pres, {
        excludeExtraneousValues: true,
      }),
      message: 'Prescription found',
      statusCode: HttpStatus.OK,
    };
  }
}
