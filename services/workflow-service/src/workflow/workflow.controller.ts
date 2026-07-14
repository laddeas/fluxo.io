import { Controller, Get, Post, Put, Body, Param, Headers } from '@nestjs/common';
import { WorkflowService } from './workflow.service.js';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  create(@Headers('x-tenant-id') tenantId: string, @Body() dto: any) {
    return this.workflowService.create(tenantId, dto);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.workflowService.findAll(tenantId);
  }

  @Get(':id')
  findById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.workflowService.findById(tenantId, id);
  }

  @Put(':id')
  update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.workflowService.update(tenantId, id, dto);
  }
}
