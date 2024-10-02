import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/Appoitment.dto';
import { AppointmentService } from './Appointment.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('appointment')
export class AppointmentController {
  constructor(private service: AppointmentService) {}

  @Public()
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Get('patient/:phone')
  @Public()
  async findByPatientPhone(@Param('phone') phone: string) {
    return this.service.findByPatientPhone(phone);
  }

  @Public()
  @Post()
  async create(@Body() appointment: CreateAppointmentDto) {
    return this.service.create(appointment);
  }
}
