import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, Interface } from '@datafusion-ai/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterfaceController } from './interface/interface.controller.js';
import { InterfaceService } from './interface/interface.service.js';
import { TenantMiddleware } from '@datafusion-ai/shared-utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    DatabaseModule.register(),
    TypeOrmModule.forFeature([Interface]),
  ],
  controllers: [InterfaceController],
  providers: [InterfaceService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
