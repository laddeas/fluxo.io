import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { TenantService } from './tenant.service.js';
import type { CreateTenantRequest, UpdateTenantRequest } from '@datafusion-ai/shared-types';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() dto: CreateTenantRequest) {
    return this.tenantService.create(dto);
  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tenantService.findById(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.tenantService.findBySlug(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantRequest) {
    return this.tenantService.update(id, dto);
  }
}
