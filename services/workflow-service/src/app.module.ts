import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, Workflow } from '@datafusion-ai/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowController } from './workflow/workflow.controller.js';
import { WorkflowService } from './workflow/workflow.service.js';
import { TenantMiddleware } from '@datafusion-ai/shared-utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    DatabaseModule.register(),
    TypeOrmModule.forFeature([Workflow]),
  ],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
