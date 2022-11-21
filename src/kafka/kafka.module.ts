import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { SendSMSService } from './send.sms.service';
import { TestConsumer } from './test.consumer';

@Module({
    providers: [ConsumerService, TestConsumer, SendSMSService],
    exports: [ConsumerService, TestConsumer, SendSMSService]
})
export class KafkaModule {}
