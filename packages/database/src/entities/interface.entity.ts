import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('interfaces')
export class Interface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ name: 'connector_id' })
  connectorId: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column({ name: 'trigger_type' })
  triggerType: string;

  @Column('jsonb', { name: 'schedule_config', default: {} })
  scheduleConfig: Record<string, any>;

  @Column('jsonb', { name: 'schema_config', default: {} })
  schemaConfig: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
