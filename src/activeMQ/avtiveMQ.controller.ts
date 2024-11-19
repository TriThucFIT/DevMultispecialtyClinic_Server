import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ActiveMqService } from './activeMQ.service';
import { Public } from 'src/Decorators/public.decorator';

@Controller('messages')
export class ActiveMQController {
  constructor(private readonly activeMqService: ActiveMqService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.OK)
  sendMessage(@Body('queue') queue: string, @Body('message') message: string) {
    this.activeMqService.sendMessage(queue, message);
    return { success: true, message: `Message sent to queue ${queue}` };
  }
}
