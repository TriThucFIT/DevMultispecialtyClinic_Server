import { Controller, Get, Param, Query } from '@nestjs/common';
import { PatientService } from '../patient.service';
import { Public } from 'src/Decorators/public.decorator';
import { log } from 'console';

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
  async findOne(@Param('patient_id') patient_id: string) {
    return this.service.findOne(patient_id);
  }

  @Public()
  @Get('findByPhone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    return await this.service.findByPhone(phone);
  }
}
