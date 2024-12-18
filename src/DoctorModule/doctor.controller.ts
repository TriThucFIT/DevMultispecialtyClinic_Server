import { Controller, Get, Param } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@Controller('doctor')
export class DoctorController {
  constructor(private DoctorService: DoctorService) {}

  @Get()
  async findAll() {
    return this.DoctorService.findAll();
  }

  @Get('/specialization/:specialization')
  async getDoctorBySpecialization(specialization: string) {
    return this.DoctorService.findBySpecialization(specialization);
  }
  
  @Get('/specializations')
  async getAllSpecializations() {
    return this.DoctorService.findAllSpecializations();
  }
}
