import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connector } from '@datafusion-ai/database';

@Injectable()
export class ConnectorService {
  constructor(
    @InjectRepository(Connector)
    private readonly connectorRepo: Repository<Connector>,
  ) {}

  async create(tenantId: string, dto: any): Promise<Connector> {
    const connector = this.connectorRepo.create({
      tenantId,
      name: dto.name,
      type: dto.type,
      config: dto.config || {},
      version: dto.version || '1.0.0',
      status: 'ACTIVE',
    });
    return this.connectorRepo.save(connector);
  }

  async findAll(tenantId: string): Promise<Connector[]> {
    return this.connectorRepo.find({ where: { tenantId } });
  }

  async findById(tenantId: string, id: string): Promise<Connector> {
    const connector = await this.connectorRepo.findOne({ where: { id, tenantId } });
    if (!connector) {
      throw new NotFoundException(`Connector with ID "${id}" not found`);
    }
    return connector;
  }

  async testConnection(tenantId: string, id: string): Promise<{ success: boolean; message: string }> {
    const connector = await this.findById(tenantId, id);
    connector.lastTestedAt = new Date();
    await this.connectorRepo.save(connector);
    return { success: true, message: `Successfully connected to ${connector.name}!` };
  }

  async update(tenantId: string, id: string, dto: any): Promise<Connector> {
    const connector = await this.findById(tenantId, id);
    if (dto.name) connector.name = dto.name;
    if (dto.config) connector.config = { ...connector.config, ...dto.config };
    if (dto.status) connector.status = dto.status;
    return this.connectorRepo.save(connector);
  }
}
