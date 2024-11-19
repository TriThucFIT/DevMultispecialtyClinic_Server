import { Controller, Get, Param } from '@nestjs/common';
import { DoctorService } from './doctor.service';
<<<<<<< HEAD:src/doctor/doctor.controller.ts
import { Public } from 'src/Decorators/public.decorator';
=======
>>>>>>> 2ed803faf176af1a2b6ef2f3117e0ff22b1c3a92:src/DoctorModule/doctor.controller.ts

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
