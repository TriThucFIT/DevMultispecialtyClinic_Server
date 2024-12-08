import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Stomp from '@stomp/stompjs';
import { WebSocket } from 'ws';
@Injectable()
export class ActiveMqService implements OnModuleInit {
  private client: Stomp.Client;

  onModuleInit() {
    this.connect();
  }

  private connect() {
    this.client = new Stomp.Client({
      brokerURL: process.env.ACTIVEMQ_HOST ?? 'ws://localhost:61614/stomp',
      webSocketFactory: () => {
        return new WebSocket(process.env.ACTIVEMQ_HOST ?? 'ws://localhost:61614/stomp', 'stomp');
      },
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      Logger.log('Connected to ActiveMQ', 'ActiveMQ');
    };
    this.client.activate();
  }

  sendMessage(queueName: string, message: string, doctorId?: string) {
    if (this.client && this.client.connected) {
      const headers = {
        processor: doctorId || 'general',
      };

      this.client.publish({
        destination: queueName,
        body: JSON.stringify(message),
        headers,
      });
      Logger.log(`Message sent to queue ${queueName} : ${message}`, 'ActiveMQ');
    } else {
      Logger.error('ActiveMQ client is not connected', 'ActiveMQ');
    }
  }

  sendEmergencyMessage(message: string) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/topic/emergency',
        body: JSON.stringify(message),
      });
      Logger.log(`Emergency message sent: ${message}`, 'ActiveMQ');
    } else {
      Logger.error('ActiveMQ client is not connected', 'ActiveMQ');
    }
  }
}
