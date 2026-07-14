import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Tenant } from './entities/tenant.entity.js';
import { User } from './entities/user.entity.js';
import { Role } from './entities/role.entity.js';
import { Permission } from './entities/permission.entity.js';
import { Setting } from './entities/setting.entity.js';
import { AuditLog } from './entities/audit-log.entity.js';
import { Connector } from './entities/connector.entity.js';
import { Interface } from './entities/interface.entity.js';
import { Workflow } from './entities/workflow.entity.js';
import { Job } from './entities/job.entity.js';
import { TenantIsolationSubscriber } from './tenant-isolation.subscriber.js';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DB_HOST', 'localhost'),
            port: config.get<number>('DB_PORT', 5432),
            username: config.get<string>('DB_USERNAME', 'datafusion'),
            password: config.get<string>('DB_PASSWORD', 'datafusion_dev_2024'),
            database: config.get<string>('DB_DATABASE', 'datafusion'),
            entities: [Tenant, User, Role, Permission, Setting, AuditLog, Connector, Interface, Workflow, Job],
            synchronize: false,
            subscribers: [TenantIsolationSubscriber],
            logging: config.get<string>('NODE_ENV') === 'development' ? ['query', 'error'] : ['error'],
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
