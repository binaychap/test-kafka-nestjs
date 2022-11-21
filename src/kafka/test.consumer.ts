import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ConsumerService } from './consumer.service';
import { SendSMSService } from './send.sms.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly sendSMSService: SendSMSService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['audit-event-created','test'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          this.sendSMSService.sendSms(message.value.toString());
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }
}
