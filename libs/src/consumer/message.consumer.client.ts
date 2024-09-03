import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
  Mechanism,
  SASLOptions,
} from 'kafkajs';
import { ConnectionOptions } from 'tls';
import { MessageConsumerInterface } from './message.consumer.interface';

class MessageConsumerClient implements MessageConsumerInterface {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  constructor(
    brokers: string[],
    consumerConfig: ConsumerConfig,
    private readonly topic: ConsumerSubscribeTopics,
    sasl?: SASLOptions | Mechanism | undefined,
    ssl?: boolean | ConnectionOptions | undefined,
  ) {
    this.kafka = new Kafka({
      brokers: brokers,
      sasl: sasl,
      ssl: ssl,
    });
    this.consumer = this.kafka.consumer(consumerConfig);
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async disconnect() {
    try {
      await this.consumer.disconnect();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async consume(
    onMessage: (message: KafkaMessage) => Promise<void>,
  ): Promise<void> {
    try {
      await this.consumer.subscribe(this.topic);
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          await onMessage(message);
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export { MessageConsumerClient };
