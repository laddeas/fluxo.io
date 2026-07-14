import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'interface_id', nullable: true })
  interfaceId: string | null;

  @Column({ name: 'workflow_id', nullable: true })
  workflowId: string | null;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ name: 'records_processed', default: 0 })
  recordsProcessed: number;

  @Column({ name: 'records_failed', default: 0 })
  recordsFailed: number;

  @Column({ name: 'duration_ms', default: 0 })
  durationMs: number;

  @Column({ name: 'started_at', type: 'timestamp with time zone', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamp with time zone', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
