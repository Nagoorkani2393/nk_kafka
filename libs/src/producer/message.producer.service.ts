import { Inject, Injectable } from "@nestjs/common";

import { KafkaConfigOptions } from "../kafka.config.interface";
import { MessageProducerClient } from "./message.producer.client";
import {
  MessageProducerInterface,
  ProduceOptions,
} from "./message.producer.interface";

@Injectable()
export class MessageProducerService {
  constructor(
    @Inject("kafka_config") private readonly config: KafkaConfigOptions
  ) {}

  private readonly clients = new Map<string, MessageProducerInterface>();

  async produce(options: ProduceOptions): Promise<void> {
    const { topic, message } = options;
    const { brokers, sasl, ssl } = this.config;

    let producer = this.clients.get(topic);
    if (!producer) {
      producer = new MessageProducerClient(brokers, topic, sasl, ssl);
      await producer.connect();
      this.clients.set(topic, producer);
    }
    await producer.produce(message);
  }

  async disposeProducer() {
    for (const producer of this.clients.values()) {
      await producer.disconnect();
    }
  }
}
