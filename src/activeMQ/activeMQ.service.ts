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
      brokerURL: 'ws://localhost:61614/stomp',
      webSocketFactory: () => {
        return new WebSocket('ws://localhost:61614/stomp', 'stomp');
      },
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      Logger.log('Connected to ActiveMQ', 'ActiveMQ');
    };
    this.client.activate();
  }

  sendMessage(queueName: string, message: string) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: queueName,
        body: JSON.stringify(message),
      });
      Logger.log(`Message sent to queue ${queueName} : ${message}`, 'ActiveMQ');
    } else {
      Logger.error('ActiveMQ client is not connected', 'ActiveMQ');
    }
  }
}
