import { Controller, Get, Logger, Param } from '@nestjs/common';
import { PatientService } from '../patient.service';
import { IsPhoneNumber } from 'class-validator';

@Controller('patient')
export class PatientController {
  constructor(private service: PatientService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(id: number) {
    return this.service.findOne(id);
  }

  @Get('phone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    try {
      const patient = await this.service.findByPhone(phone);
      return patient
        ? patient
        : {
            message: 'Patient not found',
            message_VN: 'Không tìm thấy bệnh nhân',
          };
    } catch (error) {
      Logger.error(error);
      return { error: error.message };
    }
  }
}
