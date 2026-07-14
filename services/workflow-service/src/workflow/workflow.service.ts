import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from '@datafusion-ai/database';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepo: Repository<Workflow>,
  ) {}

  async create(tenantId: string, dto: any): Promise<Workflow> {
    const item = this.workflowRepo.create({
      tenantId,
      name: dto.name,
      steps: dto.steps || [],
      triggerType: dto.triggerType || 'MANUAL',
      status: 'ACTIVE',
    });
    return this.workflowRepo.save(item);
  }

  async findAll(tenantId: string): Promise<Workflow[]> {
    return this.workflowRepo.find({ where: { tenantId } });
  }

  async findById(tenantId: string, id: string): Promise<Workflow> {
    const item = await this.workflowRepo.findOne({ where: { id, tenantId } });
    if (!item) {
      throw new NotFoundException(`Workflow with ID "${id}" not found`);
    }
    return item;
  }

  async update(tenantId: string, id: string, dto: any): Promise<Workflow> {
    const item = await this.findById(tenantId, id);
    if (dto.name) item.name = dto.name;
    if (dto.status) item.status = dto.status;
    if (dto.steps) item.steps = dto.steps;
    if (dto.triggerType) item.triggerType = dto.triggerType;
    return this.workflowRepo.save(item);
  }
}
