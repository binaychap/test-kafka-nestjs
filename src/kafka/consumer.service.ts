import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';
import fs from 'fs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092']
    // ssl: {
    //   rejectUnauthorized: false,
    //   ca: [fs.readFileSync('/my/ca.cert', 'utf-8')],
    //   key: fs.readFileSync('my/client-key.pem', 'utf-8'),
    //   cert: fs.readFileSync('/my/client-cert.pem', 'utf-8'),
    // },
  });

  private readonly consumers: Consumer[] = [];
  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
