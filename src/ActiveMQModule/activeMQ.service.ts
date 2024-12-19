import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Stomp from '@stomp/stompjs';
import { WebSocket } from 'ws';
@Injectable()
export class ActiveMqService implements OnModuleInit {
  private client: Stomp.Client;
  private retryInterval: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.connect();
  }

  private connect() {
    this.client = new Stomp.Client({
      brokerURL: process.env.ACTIVEMQ_HOST ?? 'ws://localhost:61614/stomp',
      webSocketFactory: () => {
        return new WebSocket(
          process.env.ACTIVEMQ_HOST ?? 'ws://localhost:61614/stomp',
          'stomp',
        );
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

  async sendEmergencyMessage(message: string) {
    const topicName = 'emergency'; // Tên topic

    const send = async () => {
      try {
        const consumerCount = await this.checkTopicConsumers(topicName);
        if (consumerCount > 0) {
          if (this.client && this.client.connected) {
            this.client.publish({
              destination: `/topic/${topicName}`,
              body: JSON.stringify(message),
            });
            Logger.log(`Emergency message sent: ${message}`, 'ActiveMQ');
            if (this.retryInterval) {
              // Clear interval nếu đã gửi thành công
              clearInterval(this.retryInterval);
              this.retryInterval = null;
            }
          } else {
            Logger.error('ActiveMQ client is not connected', 'ActiveMQ');
            if (!this.retryInterval) {
              this.retryInterval = setInterval(send, 10000);
            }
          }
        } else {
          Logger.warn(
            `No consumers on topic ${topicName}. Retrying in 30s...`,
            'ActiveMQ',
          );
          if (!this.retryInterval) {
            this.retryInterval = setInterval(send, 10000);
          }
        }
      } catch (error) {
        Logger.error(
          `Error checking consumers or sending message: ${error.message}`,
          'ActiveMQ',
        );
        if (!this.retryInterval) {
          this.retryInterval = setInterval(send, 10000);
        }
      }
    };
    send();
  }

  async checkTopicConsumers(topicName: string): Promise<number> {
    try {
      const response = await fetch(`${process.env.ACTIVEMQ_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from('admin:admin').toString('base64')}`,
        },
        body: JSON.stringify({
          type: 'read',
          mbean: `org.apache.activemq:type=Broker,brokerName=localhost,destinationType=Topic,destinationName=${topicName}`, //Thay localhost nếu cần
          attribute: 'ConsumerCount',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
      const data = await response.json();

      if (data.status !== 200) {
        throw new Error(`Jolokia error ${data.status}: ${data.error}`);
      }

      Logger.log(`Consumers on topic ${topicName}: ${data.value}`, 'ActiveMQ');
      return data.value;
    } catch (error) {
      Logger.error(
        `Error checking topic consumers: ${error.message}`,
        'ActiveMQ',
      );
      return 0; // Trả về 0 để tiếp tục retry
    }
  }
}
