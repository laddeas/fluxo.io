import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '@datafusion-ai/database';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async create(tenantId: string, dto: any): Promise<Job> {
    const job = new Job();
    job.tenantId = tenantId;
    job.interfaceId = dto.interfaceId || null;
    job.workflowId = dto.workflowId || null;
    job.status = dto.status || 'PENDING';
    job.recordsProcessed = 0;
    job.recordsFailed = 0;
    job.durationMs = 0;
    job.startedAt = dto.startedAt ? new Date(dto.startedAt) : null;
    return this.jobRepo.save(job);
  }

  async findAll(tenantId: string): Promise<Job[]> {
    return this.jobRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(tenantId: string, id: string): Promise<Job> {
    const job = await this.jobRepo.findOne({ where: { id, tenantId } });
    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found`);
    }
    return job;
  }

  async update(tenantId: string, id: string, dto: any): Promise<Job> {
    const job = await this.findById(tenantId, id);
    if (dto.status) job.status = dto.status;
    if (dto.recordsProcessed !== undefined) job.recordsProcessed = dto.recordsProcessed;
    if (dto.recordsFailed !== undefined) job.recordsFailed = dto.recordsFailed;
    if (dto.durationMs !== undefined) job.durationMs = dto.durationMs;
    if (dto.startedAt) job.startedAt = new Date(dto.startedAt);
    if (dto.completedAt) job.completedAt = new Date(dto.completedAt);
    return this.jobRepo.save(job);
  }
}
