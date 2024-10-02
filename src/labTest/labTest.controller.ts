import { Controller } from '@nestjs/common';
import { LabTestService } from './labTest.service';

@Controller('labTest')
export class LabTestController {
  constructor(private service: LabTestService) {}
}
