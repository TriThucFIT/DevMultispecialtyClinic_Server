import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/Appoitment.dto';
import { AppointmentService } from './Appointment.service';
import { Public } from 'src/Decorators/public.decorator';
import { Roles } from 'src/Decorators/roles.decorator';
import { Action, Resource, RoleName } from 'src/Common/Enums/auth.enum';
import { Permissions } from 'src/Decorators/permissions.decorator';

@Controller('appointment')
export class AppointmentController {
  constructor(private service: AppointmentService) {}

  @Get()
  @Roles(RoleName.Receptionist)
  @Permissions([
    {
      resource: Resource.Appointment,
      actions: [Action.Manage],
    },
  ])
  async findByPatientPhone(
    @Query('phone') phone: string,
    @Query('name') fullName: string,
    @Query('email') email: string,
    @Query('date') date: Date,
  ) {
    if (date) {
      return this.service.findByDate(date);
    }
    return this.service.findByPatients(phone, fullName, email);
  }

  @Public()
  @Post()
  async create(@Body() appointment: CreateAppointmentDto) {
    return this.service.create(appointment);
  }

  @Delete('cancel/:id')
  @Roles(RoleName.Receptionist)
  @Permissions([
    {
      resource: Resource.Appointment,
      actions: [Action.Manage],
    },
  ])
  async cancel(@Param('id') id: number) {
    return this.service.cancelAppointment(id);
  }
}
