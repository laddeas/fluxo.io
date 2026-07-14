import { Controller, Get, Param, Headers } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuditService } from './audit.service.js';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @EventPattern('audit.log')
  handleAuditLog(@Payload() data: any) {
    console.log('Received audit log event via RMQ:', data);
    return this.auditService.logEvent(data);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.auditService.findAll(tenantId);
  }

  @Get('user/:userId')
  findByUser(@Headers('x-tenant-id') tenantId: string, @Param('userId') userId: string) {
    return this.auditService.findByUser(tenantId, userId);
  }
}
