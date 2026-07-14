import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('connectors')
export class Connector {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column('jsonb', { default: {} })
  config: Record<string, any>;

  @Column()
  version: string;

  @Column({ name: 'last_tested_at', type: 'timestamp with time zone', nullable: true })
  lastTestedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
