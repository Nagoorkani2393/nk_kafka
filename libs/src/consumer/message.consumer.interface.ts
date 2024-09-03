import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';

export interface MessageConsumerInterface {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  consume: (onMessage: (message: any) => Promise<void>) => Promise<void>;
}

export interface ConsumeOptions {
  consumerConfig: ConsumerConfig;
  topic: ConsumerSubscribeTopics;
  onMessage: (message: KafkaMessage) => Promise<void>;
}
