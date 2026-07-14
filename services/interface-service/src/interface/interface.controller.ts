import { Controller, Get, Post, Put, Body, Param, Headers } from '@nestjs/common';
import { InterfaceService } from './interface.service.js';

@Controller('interfaces')
export class InterfaceController {
  constructor(private readonly interfaceService: InterfaceService) {}

  @Post()
  create(@Headers('x-tenant-id') tenantId: string, @Body() dto: any) {
    return this.interfaceService.create(tenantId, dto);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.interfaceService.findAll(tenantId);
  }

  @Get(':id')
  findById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.interfaceService.findById(tenantId, id);
  }

  @Put(':id')
  update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.interfaceService.update(tenantId, id, dto);
  }
}
