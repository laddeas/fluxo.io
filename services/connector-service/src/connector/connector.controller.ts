import { Controller, Get, Post, Put, Body, Param, Headers } from '@nestjs/common';
import { ConnectorService } from './connector.service.js';

@Controller('connectors')
export class ConnectorController {
  constructor(private readonly connectorService: ConnectorService) {}

  @Post()
  create(@Headers('x-tenant-id') tenantId: string, @Body() dto: any) {
    return this.connectorService.create(tenantId, dto);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.connectorService.findAll(tenantId);
  }

  @Get(':id')
  findById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.connectorService.findById(tenantId, id);
  }

  @Post(':id/test')
  testConnection(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.connectorService.testConnection(tenantId, id);
  }

  @Put(':id')
  update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.connectorService.update(tenantId, id, dto);
  }
}
