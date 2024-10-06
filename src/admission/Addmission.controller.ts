import { Body, Controller, Post } from '@nestjs/common';
import { AdmissionService } from './Addmission.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Action, Resource, RoleName } from 'src/enums/auth.enum';
import { Permissions } from 'src/decorators/permissions.decorator';
import { CreateAppointmentDto } from 'src/appointment/dto/Appoitment.dto';
import { CreateAdmissionDto } from './dto/Admission.dto';

@Controller('admission')
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
  async patientRegistration(@Body() createAdmissionDto: CreateAdmissionDto) {
    return this.admissionService.createPatientRegistration(createAdmissionDto);
  }
}
