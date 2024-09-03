import { ModuleMetadata } from "@nestjs/common";
import { Mechanism, SASLOptions } from "kafkajs";
import { ConnectionOptions } from "tls";

export interface KafkaConfigOptions {
  brokers: string[];
  sasl?: SASLOptions | Mechanism | undefined;
  ssl?: boolean | ConnectionOptions | undefined;
}

export interface KafkaConfigAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  name?: string;
  useFactory: (
    ...args: any[]
  ) => Promise<KafkaConfigOptions> | KafkaConfigOptions;
  inject?: any[];
}
