import { Controller, Get, Post, Put, Body, Param, Headers } from '@nestjs/common';
import { JobService } from './job.service.js';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@Headers('x-tenant-id') tenantId: string, @Body() dto: any) {
    return this.jobService.create(tenantId, dto);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.jobService.findAll(tenantId);
  }

  @Get(':id')
  findById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.jobService.findById(tenantId, id);
  }

  @Put(':id')
  update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.jobService.update(tenantId, id, dto);
  }
}
