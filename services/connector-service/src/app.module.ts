import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, Connector } from '@datafusion-ai/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectorController } from './connector/connector.controller.js';
import { ConnectorService } from './connector/connector.service.js';
import { TenantMiddleware } from '@datafusion-ai/shared-utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    DatabaseModule.register(),
    TypeOrmModule.forFeature([Connector]),
  ],
  controllers: [ConnectorController],
  providers: [ConnectorService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
