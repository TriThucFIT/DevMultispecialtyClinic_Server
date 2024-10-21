import { Controller, Get } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('doctor')
export class DoctorController {
  constructor(private DoctorService: DoctorService) {}

  @Get()
  async findAll() {
    return this.DoctorService.findAll();
  }
  
  @Public()
  @Get('/specialization/:specialization')
  async getDoctorBySpecialization(specialization: string) {
    return this.DoctorService.findBySpecialization(specialization);
  }
  @Public()
  @Get('/specializations')
  async getAllSpecializations() {
    return this.DoctorService.findAllSpecializations();
  }
}
