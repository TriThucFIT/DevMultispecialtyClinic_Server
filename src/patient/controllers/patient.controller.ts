import { Controller, Get, Query } from '@nestjs/common';
import { PatientService } from '../patient.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('patient')
export class PatientController {
  constructor(private service: PatientService) {}

  @Get()
  @Public()
  async findAll(
    @Query('phone') phone: string,
    @Query('fullName') fullName: string,
    @Query('email') email: string,
    @Query('id') id: number,
  ) {
    return await this.service.findAll(phone, fullName, email, id);
  }

  @Get(':id')
  async findOne(id: number) {
    return this.service.findOne(id);
  }
}
