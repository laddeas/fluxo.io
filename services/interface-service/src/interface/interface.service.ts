import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interface } from '@datafusion-ai/database';

@Injectable()
export class InterfaceService {
  constructor(
    @InjectRepository(Interface)
    private readonly interfaceRepo: Repository<Interface>,
  ) {}

  async create(tenantId: string, dto: any): Promise<Interface> {
    const item = this.interfaceRepo.create({
      tenantId,
      name: dto.name,
      type: dto.type,
      connectorId: dto.connectorId,
      status: 'ACTIVE',
      triggerType: dto.triggerType || 'MANUAL',
      scheduleConfig: dto.scheduleConfig || {},
      schemaConfig: dto.schemaConfig || {},
    });
    return this.interfaceRepo.save(item);
  }

  async findAll(tenantId: string): Promise<Interface[]> {
    return this.interfaceRepo.find({ where: { tenantId } });
  }

  async findById(tenantId: string, id: string): Promise<Interface> {
    const item = await this.interfaceRepo.findOne({ where: { id, tenantId } });
    if (!item) {
      throw new NotFoundException(`Interface with ID "${id}" not found`);
    }
    return item;
  }

  async update(tenantId: string, id: string, dto: any): Promise<Interface> {
    const item = await this.findById(tenantId, id);
    if (dto.name) item.name = dto.name;
    if (dto.status) item.status = dto.status;
    if (dto.triggerType) item.triggerType = dto.triggerType;
    if (dto.schemaConfig) item.schemaConfig = { ...item.schemaConfig, ...dto.schemaConfig };
    if (dto.scheduleConfig) item.scheduleConfig = { ...item.scheduleConfig, ...dto.scheduleConfig };
    return this.interfaceRepo.save(item);
  }
}
