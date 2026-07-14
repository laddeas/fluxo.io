import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, User, Role, Permission } from '@datafusion-ai/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller.js';
import { UserService } from './user/user.service.js';
import { TenantMiddleware } from '@datafusion-ai/shared-utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    DatabaseModule.register(),
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
