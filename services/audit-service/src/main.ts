import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://datafusion:datafusion_rabbit_2024@localhost:5672/datafusion'],
      queue: 'audit_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  const port = process.env.AUDIT_PORT || 3010;

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`Audit Service is running on HTTP: http://localhost:${port}/api/v1`);
  console.log(`Audit Service is listening on RabbitMQ queue "audit_queue"`);
}
bootstrap();
