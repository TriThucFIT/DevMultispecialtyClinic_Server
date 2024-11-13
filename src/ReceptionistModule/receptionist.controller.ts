import { Controller } from '@nestjs/common';
import { ReceptionistService } from './receptionist.service';

@Controller('receptionist')
export class ReceptionistController {

  constructor(private service: ReceptionistService) { }

}
