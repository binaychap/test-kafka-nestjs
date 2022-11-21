import { ConsumerConfig, ConsumerSubscribeTopics, KafkaConfig, KafkaMessage } from "kafkajs";

export interface KafkajsConsumerOptions{
topic: ConsumerSubscribeTopics;
  consumerConfig: ConsumerConfig;
  kafkaConfig: KafkaConfig
  onMessage: (message: KafkaMessage) => Promise<void>;
}