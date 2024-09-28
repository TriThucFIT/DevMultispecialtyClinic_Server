import { Controller } from '@nestjs/common';
import { AppointmentService } from './Appointment.service';

@Controller('appointment')
export class AppointmentController {
  constructor(private service: AppointmentService) {}
}
