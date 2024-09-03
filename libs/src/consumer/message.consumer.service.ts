import { Inject, Injectable } from "@nestjs/common";

import { KafkaConfigOptions } from "../kafka.config.interface";
import { MessageConsumerClient } from "./message.consumer.client";
import {
  ConsumeOptions,
  MessageConsumerInterface,
} from "./message.consumer.interface";

@Injectable()
export class MessageConsumerService {
  constructor(
    @Inject("kafka_config") private readonly config: KafkaConfigOptions
  ) {}

  private readonly clients: MessageConsumerInterface[] = [];

  async disposeConsumer() {
    for (const client of this.clients) {
      await client.disconnect();
    }
  }

  async consume(options: ConsumeOptions): Promise<void> {
    const { consumerConfig, topic, onMessage } = options;
    const { brokers, sasl, ssl } = this.config;

    const newConsumer = new MessageConsumerClient(
      brokers,
      consumerConfig,
      topic,
      sasl,
      ssl
    );

    await newConsumer.connect();
    await newConsumer.consume(onMessage);
  }
}
