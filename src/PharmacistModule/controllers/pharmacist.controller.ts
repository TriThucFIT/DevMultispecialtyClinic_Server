import { Body, Controller, HttpStatus, Param, Put } from '@nestjs/common';
import { MedicationService } from '../services/Medication.service';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';
import { PrescriptionResponseDto, PrescriptionUpdateDto } from '../types';
import { plainToClass } from 'class-transformer';
import { log } from 'console';

@Controller('pharmacist')
export class PharmacistController {
  constructor(private readonly medicationService: MedicationService) {}

  @Put('/update-prescriptions-status')
  async updatePrescriptionStatus(
    @Body() prescriptions: PrescriptionUpdateDto[],
  ): Promise<ApiResponseDto<PrescriptionResponseDto[]>> {
    log('Updating prescription status', prescriptions);
    return {
      data: plainToClass(
        PrescriptionResponseDto,
        await this.medicationService.updatePrescriptionStatus(prescriptions),
      ),
      message: 'Cập nhật trạng thái đơn thuốc thành công',
      statusCode: HttpStatus.OK,
    };
  }
}
