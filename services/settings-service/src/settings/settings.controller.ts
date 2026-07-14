import { Controller, Get, Put, Body, Param, Headers } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import type { UpdateSettingsRequest } from '@datafusion-ai/shared-types';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.settingsService.findAll(tenantId);
  }

  @Get(':group')
  findByGroup(@Headers('x-tenant-id') tenantId: string, @Param('group') group: string) {
    return this.settingsService.findByGroup(tenantId, group.toUpperCase());
  }

  @Get(':group/:key')
  findByKey(
    @Headers('x-tenant-id') tenantId: string,
    @Param('group') group: string,
    @Param('key') key: string,
  ) {
    return this.settingsService.findByKey(tenantId, group.toUpperCase(), key);
  }

  @Put(':group')
  update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('group') group: string,
    @Body() dto: UpdateSettingsRequest,
  ) {
    return this.settingsService.update(tenantId, group.toUpperCase(), dto);
  }
}
