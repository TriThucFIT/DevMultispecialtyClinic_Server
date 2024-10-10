import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { PatientService } from '../patient.service';
import { Public } from 'src/decorators/public.decorator';
import { PatientResponseDto } from '../dto/patient.dto';

@Controller('patient')
export class PatientController {
  constructor(private service: PatientService) {}

  @Get()
  @Public()
  async findAll(
    @Query('phone') phone: string,
    @Query('fullName') fullName: string,
  ) {
    if (phone && fullName) {
      return this.service.findByPhoneAndName(phone, fullName);
    }
    if (phone) {
      return this.service.findByPhone(phone);
    }
    if (fullName) {
      return this.service.findByFullName(fullName);
    }
    return (await this.service.findAll()).map((patient) =>
      PatientResponseDto.plainToInstance(patient),
    );
  }

  @Get(':id')
  async findOne(id: number) {
    return this.service.findOne(id);
  }
}
