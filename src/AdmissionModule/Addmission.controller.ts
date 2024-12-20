import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { AdmissionService } from './Addmission.service';
import { Roles } from 'src/Decorators/roles.decorator';
import { Action, Resource, RoleName } from 'src/Common/Enums/auth.enum';
import { Permissions } from 'src/Decorators/permissions.decorator';
import {
  AcceptEmergency,
  CreateAdmissionDto,
  CreateEmergencyDTO,
} from './dto/Admission.dto';
import { ServiceTypeService } from 'src/CasherModule/services/ServiceType.service';
import { Public } from 'src/Decorators/public.decorator';

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

  @Post('emergency')
  async emergency(@Body() createEmergencyDTO: CreateEmergencyDTO) {
    return this.admissionService.createEmergencyRegistration(
      createEmergencyDTO,
    );
  }

  @Post('accept-emergency')
  async acceptEmergency(@Body() acceptEmergency: AcceptEmergency) {
    return this.admissionService.acceptEmergency(acceptEmergency);
  }

  @Public()
  @Get('service-types')
  async getServiceTypes() {
    return this.serviceTypeService.findAll();
  }
}
