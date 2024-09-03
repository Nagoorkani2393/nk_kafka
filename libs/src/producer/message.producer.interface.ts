import { Message } from 'kafkajs';

export interface MessageProducerInterface {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  produce: (message: any) => Promise<void>;
}

export interface ProduceOptions {
  topic: string;
  message: Message;
}
