import { Kafka, Mechanism, Message, Producer, SASLOptions } from 'kafkajs';
import { ConnectionOptions } from 'tls';
import { MessageProducerInterface } from './message.producer.interface';

class MessageProducerClient implements MessageProducerInterface {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(
    brokers: string[],
    private readonly topic: string,
    sasl?: SASLOptions | Mechanism | undefined,
    ssl?: boolean | ConnectionOptions | undefined,
  ) {
    this.kafka = new Kafka({
      brokers: brokers,
      sasl: sasl,
      ssl: ssl,
    });
    this.producer = this.kafka.producer();
  }

  async connect() {
    try {
      await this.producer.connect();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async disconnect() {
    try {
      await this.producer.disconnect();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async produce(message: Message): Promise<void> {
    try {
      await this.producer.send({
        messages: [message],
        topic: this.topic,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export { MessageProducerClient };
