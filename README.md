# nk_kafka
A nest-js kafka module

```bash
$ npm i nk-kafka

$ npm install nk-kafka
```

## Kafka module

```bash
// app.module.ts

import { KafkaModule } from 'nestjs/kafka';
import * as fs from 'fs';

// Initialize the Kafka module globally
KafkaModule.register({
  brokers: ['xxxxxxx'],
  sasl: {
    mechanism: 'xxxxxxx',
    username: 'xxxxxxx',
    password: 'xxxxxxx',
  },
  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync('xxxxxxx', 'utf-8')],
  },
  global: true,
}),

(or)

KafkaModule.registerAsync({
  imports:[ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService) => {
  brokers: [configService.getOrThrow('xxxxxxx')],
  sasl: {
    mechanism: configService.getOrThrow('xxxxxxx'),
    username: configService.getOrThrow('xxxxxxx'),
    password: configService.getOrThrow('xxxxxxx'),
  },
  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync(configService.getOrThrow('xxxxxxx'), 'utf-8')],
  },
  global: true,},
  },
)


// message.service.ts

import { OnModuleInit } from '@nestjs/common';
import { KafkaMessage } from 'nestjs/kafka';
import { MessageProducerService, MessageConsumerService, WhatsappService } from './your-services';

export class MessageService implements OnModuleInit {
  constructor(
    private readonly producerService: MessageProducerService,
    private readonly consumerService: MessageConsumerService,
    private readonly whatsappService: WhatsappService,
  ) {}

  // Example of producing a message
  async example(): Promise<void> {
    await this.producerService.produce({
      topic: '*****',
      message: {
        value: 'Hello world from producer',
      },
    });
  }

  // Consuming messages during the module initialization
  async onModuleInit() {
    await this.consumerService.consume({
      consumerConfig: { groupId: '*****' },
      topic: { topics: ['*****'] },
      onMessage: async (message: KafkaMessage) => {
        console.log('Message from consumer:', message.value?.toString());
      },
    });
  }
}
```