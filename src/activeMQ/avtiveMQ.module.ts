import { Module } from '@nestjs/common';
import { ActiveMQController } from './avtiveMQ.controller';
import { ActiveMqService } from './activeMQ.service';

@Module({
  controllers: [ActiveMQController],
  providers: [ActiveMqService],
  exports: [ActiveMqService],
})
export class ActiveMQModule {}
