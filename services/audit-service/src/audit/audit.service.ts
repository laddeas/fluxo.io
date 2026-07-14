import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '@datafusion-ai/database';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async logEvent(payload: {
    tenantId: string;
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const log = new AuditLog();
    log.tenantId = payload.tenantId;
    log.userId = payload.userId;
    log.action = payload.action;
    log.resourceType = payload.resourceType;
    log.resourceId = payload.resourceId || null;
    log.oldValue = payload.oldValue || null;
    log.newValue = payload.newValue || null;
    log.ipAddress = payload.ipAddress || null;
    log.userAgent = payload.userAgent || null;
    return this.auditRepo.save(log);
  }

  async findAll(tenantId: string): Promise<AuditLog[]> {
    return this.auditRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(tenantId: string, userId: string): Promise<AuditLog[]> {
    return this.auditRepo.find({
      where: { tenantId, userId },
      order: { createdAt: 'DESC' },
    });
  }
}
