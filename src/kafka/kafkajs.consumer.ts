import { Injectable, Logger } from '@nestjs/common';
import { Consumer, ConsumerConfig, ConsumerSubscribeTopics, Kafka, KafkaConfig, KafkaMessage } from 'kafkajs';
import { sleep } from 'src/utils/sleep';
import { IConsumer } from './consumer.interface';
import * as retry from 'async-retry';

@Injectable()
export class KafkaJsConsumer implements IConsumer {
    
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;
  constructor(private readonly topic: ConsumerSubscribeTopics,consumerConfig: ConsumerConfig,kafkaConfig: KafkaConfig){
    this.kafka = new Kafka(kafkaConfig);
    this.consumer = this.kafka.consumer(consumerConfig);
    this.logger = new Logger(`${topic.topics}-${consumerConfig.groupId}`);
  }
  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            retries: 3,
            onRetry: (error, attempt) =>
              this.logger.error(
                `Error consuming message, executing retry ${attempt}/3...`,
                error,
              ),
          });
        } catch (err) {
          this.logger.error(
            'Error consuming message. Adding to dead letter queue...',
            err,
          );
          //await this.addMessageToDlq(message);
        }
      },
    });
  }

  
  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
