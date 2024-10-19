import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AdmissionService } from './Addmission.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Action, Resource, RoleName } from 'src/enums/auth.enum';
import { Permissions } from 'src/decorators/permissions.decorator';
import { CreateAdmissionDto } from './dto/Admission.dto';
import { ServiceTypeService } from 'src/casher/services/ServiceType.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('admission')
export class AdmissionController {
  constructor(
    private readonly admissionService: AdmissionService,
    private readonly serviceTypeService: ServiceTypeService,
  ) {}
  @Roles(RoleName.Receptionist)
  @Permissions([
    {
      resource: Resource.Addmission,
      actions: [Action.Create],
    },
  ])
  @Post('patient-registration')
  async patientRegistration(
    @Request() request: any,
    @Body() createAdmissionDto: CreateAdmissionDto,
  ) {
    return this.admissionService.createPatientRegistration({
      ...createAdmissionDto,
      receptionist_useranme: request.user.username,
    });
  }

  @Public()
  @Get('service-types')
  async getServiceTypes() {
    return this.serviceTypeService.findAll();
  }
}
