import { DynamicModule, Module } from "@nestjs/common";
import { MessageConsumerService } from "./consumer/message.consumer.service";
import {
  KafkaConfigAsyncOptions,
  KafkaConfigOptions,
} from "./kafka.config.interface";

import { MessageProducerService } from "./producer/message.producer.service";

@Module({})
export class KafkaModule {
  static register(options: KafkaConfigOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: "kafka_config",
          useValue: options,
        },
        MessageConsumerService,
        MessageProducerService,
      ],
      exports: [MessageConsumerService, MessageProducerService],
    };
  }

  static registerAsync(options: KafkaConfigAsyncOptions): DynamicModule {
    const kafkaAsyncProvider = {
      provide: "kafka_config",
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: KafkaModule,
      imports: options.imports,
      providers: [kafkaAsyncProvider],
      exports: [MessageConsumerService, MessageProducerService],
    };
  }
}
