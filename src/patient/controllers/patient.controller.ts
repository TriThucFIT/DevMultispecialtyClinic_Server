import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { PatientService } from '../patient.service';
import { Public } from 'src/Decorators/public.decorator';

@Controller('patient')
export class PatientController {
  constructor(private service: PatientService) {}

  @Get()
  @Public()
  async findAll(
    @Query('phone') phone: string,
    @Query('fullName') fullName: string,
    @Query('email') email: string,
    @Query('patientId') patientId: string,
  ) {
    return await this.service.findAll(phone, fullName, email, patientId);
  }

  @Public()
  @Get('findByPhone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    return await this.service.findByPhone(phone);
  }

  @Public()
  @Get(':patient_id')
  async findOne(@Param('patient_id') patient_id: string) {
    const response = await this.service.findOne(patient_id);

    if (!response) {
      throw new NotFoundException({
        message: 'Patient not found',
        message_VN: 'Không tìm thấy bệnh nhân',
      });
    }
    return response;
  }
}
