import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '@datafusion-ai/database';
import type { CreateTenantRequest, UpdateTenantRequest } from '@datafusion-ai/shared-types';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async create(dto: CreateTenantRequest): Promise<Tenant> {
    const existing = await this.tenantRepo.findOne({ where: { slug: dto.slug } });
    if (existing) {
      throw new ConflictException(`Tenant with slug "${dto.slug}" already exists`);
    }

    const tenant = this.tenantRepo.create({
      name: dto.name,
      slug: dto.slug,
      tier: dto.tier || 'SHARED',
      brandingConfig: dto.brandingConfig || {},
      settings: {},
    });

    return this.tenantRepo.save(tenant);
  }

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${id}" not found`);
    }
    return tenant;
  }

  async findBySlug(slug: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({ where: { slug } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with slug "${slug}" not found`);
    }
    return tenant;
  }

  async update(id: string, dto: UpdateTenantRequest): Promise<Tenant> {
    const tenant = await this.findById(id);

    if (dto.name) tenant.name = dto.name;
    if (dto.brandingConfig) {
      tenant.brandingConfig = { ...tenant.brandingConfig, ...dto.brandingConfig };
    }
    if (dto.settings) {
      tenant.settings = { ...tenant.settings, ...dto.settings };
    }

    return this.tenantRepo.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepo.find();
  }
}
