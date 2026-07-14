import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter, TransformResponseInterceptor } from '@datafusion-ai/shared-utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.enableCors();

  const port = process.env.CONNECTOR_PORT || 3004;
  await app.listen(port);
  console.log(`Connector Service is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
