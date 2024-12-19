import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { ActiveMqService } from './activeMQ.service';
import { Public } from 'src/Decorators/public.decorator';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';

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

  @Get('/topic-consumers/:topicName')
  @Public()
  async checkTopicConsumers(@Param('topicName') topicName: string): Promise<
    ApiResponseDto<{
      consumerCount: number;
    }>
  > {
    try {
      return {
        data: {
          consumerCount:
            await this.activeMqService.checkTopicConsumers(topicName),
        },
        message: 'Topic consumers count fetched successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
