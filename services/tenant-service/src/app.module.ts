import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, Tenant } from '@datafusion-ai/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './tenant/tenant.controller.js';
import { TenantService } from './tenant/tenant.service.js';
import { TenantMiddleware } from '@datafusion-ai/shared-utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    DatabaseModule.register(),
    TypeOrmModule.forFeature([Tenant]),
  ],
  controllers: [TenantController],
  providers: [TenantService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
