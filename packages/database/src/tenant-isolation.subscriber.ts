import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  QueryRunner,
} from 'typeorm';
import { tenantContext } from '@datafusion-ai/shared-utils';

@EventSubscriber()
export class TenantIsolationSubscriber implements EntitySubscriberInterface {
  async beforeInsert(event: InsertEvent<any>) {
    await this.setTenantContext(event.queryRunner);
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    await this.setTenantContext(event.queryRunner);
  }

  async beforeRemove(event: RemoveEvent<any>) {
    await this.setTenantContext(event.queryRunner);
  }

  private async setTenantContext(queryRunner: QueryRunner) {
    const context = tenantContext.getStore();
    if (context?.tenantId) {
      await queryRunner.query(
        `SET LOCAL app.current_tenant_id = '${context.tenantId}'`
      );
    }
  }
}
