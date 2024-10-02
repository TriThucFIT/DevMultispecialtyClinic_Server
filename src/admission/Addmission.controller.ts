import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { PatientRegistration } from './Admission.types';
import { AdmissionService } from './Addmission.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Action, Resource, RoleName } from 'src/enums/auth.enum';
import { Permissions } from 'src/decorators/permissions.decorator';

@Controller('addmission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}
  @Roles(RoleName.Receptionist)
  @Permissions([
    {
      resource: Resource.addmission,
      actions: [Action.Create],
    },
  ])
  @Post('patient-registration')
  async patientRegistration(@Body() patientRegistration: PatientRegistration) {
    return this.admissionService.createPatientRegistration(patientRegistration);
  }
}
