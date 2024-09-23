import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { PatientRegistration } from './Admission.types';
import { AdmissionService } from './Addmission.service';

@Controller('admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('patient-registration')
  async patientRegistration(@Body() patientRegistration: PatientRegistration) {
    return this.admissionService.createPatientRegistration(patientRegistration);
  }
}
