import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { Public } from 'src/Decorators/public.decorator';
import { log } from 'console';
import { PatientResponseDto, PatientUpdateDto } from '../dto/patient.dto';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';
import { plainToClass } from 'class-transformer';

@Controller('patient')
export class PatientController {
  constructor(private service: PatientService) {}

  @Get()
  @Public()
  async findAll(
    @Query('phone') phone: string,
    @Query('fullName') fullName: string,
    @Query('email') email: string,
    @Query('patient_id') patientId: string,
  ) {
    return this.service.findAll(phone, fullName, email, patientId);
  }

  @Get(':patient_id')
  async findOne(
    @Param('patient_id') patient_id: string,
  ): Promise<ApiResponseDto<PatientResponseDto>> {
    const patient = await this.service.findOne(patient_id);
    return {
      data: plainToClass(
        PatientResponseDto,
        {
          ...patient,
          email: patient.account?.email,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
      message: 'Success',
      statusCode: 200,
    };
  }

  @Put(':patient_id')
  async update(
    @Param('patient_id') patient_id: string | number,
    @Body() patient: Partial<PatientUpdateDto>,
  ): Promise<ApiResponseDto<PatientResponseDto>> {
    const pat = await this.service.update(patient_id, patient);
    return {
      data: plainToClass(
        PatientResponseDto,
        {
          ...pat,
          email: pat.account?.email,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
      message: 'Success',
      statusCode: 200,
    };
  }
}
