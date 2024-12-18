import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import {
  AvailableAppointmentParams,
  AvailableAppointments,
  CreateAppointmentDto,
} from '../dto/Appoitment.dto';
import { AppointmentService } from '../Appointment.service';
import { Roles } from 'src/Decorators/roles.decorator';
import { Action, Resource, RoleName } from 'src/Common/Enums/auth.enum';
import { Permissions } from 'src/Decorators/permissions.decorator';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';

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

  @Get('me')
  async getMyAppointments(@Request() req: any) {
    return this.service.findByPatients(req.user.username);
  }

  @Post()
  async create(@Body() appointment: CreateAppointmentDto) {
    return this.service.create(appointment);
  }

  @Delete('cancel/:id')
  @Roles(RoleName.Receptionist, RoleName.Patient)
  @Permissions([
    {
      resource: Resource.Appointment,
      actions: [Action.Manage],
    },
  ])
  async cancel(@Param('id') id: number) {
    return this.service.cancelAppointment(id);
  }

  @Get('available')
  async getAvailableAppointments(
    @Body() { date, specialization }: AvailableAppointmentParams,
  ): Promise<ApiResponseDto<AvailableAppointments>> {
    if (date && specialization !== '') {
      return {
        data: await this.service.getAvailableAppointments(
          new Date(date),
          specialization,
        ),
        message: 'Danh sách lịch hẹn trống',
        statusCode: 200,
      };
    } else if (!date && specialization !== '') {
      return {
        data: await this.service.getAvailableAppointments(
          new Date(),
          specialization,
        ),
        message: 'Danh sách lịch hẹn trống hôm nay',
        statusCode: 200,
      };
    } else {
      throw new BadRequestException('Thiếu tham số Chuyên khoa');
    }
  }
}
