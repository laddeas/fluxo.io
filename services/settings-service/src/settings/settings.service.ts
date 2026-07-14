import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '@datafusion-ai/database';
import type { UpdateSettingsRequest } from '@datafusion-ai/shared-types';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
  ) {}

  async findByGroup(tenantId: string, groupName: string): Promise<Setting[]> {
    return this.settingRepo.find({ where: { tenantId, groupName } });
  }

  async findByKey(tenantId: string, groupName: string, key: string): Promise<Setting> {
    const setting = await this.settingRepo.findOne({ where: { tenantId, groupName, key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found in group "${groupName}"`);
    }
    return setting;
  }

  async update(tenantId: string, groupName: string, dto: UpdateSettingsRequest): Promise<Setting[]> {
    const updatedSettings: Setting[] = [];

    for (const item of dto.settings) {
      let setting = await this.settingRepo.findOne({
        where: { tenantId, groupName, key: item.key },
      });

      if (!setting) {
        setting = this.settingRepo.create({
          tenantId,
          groupName,
          key: item.key,
          value: item.value,
          description: '',
        });
      } else {
        setting.value = item.value;
      }

      const saved = await this.settingRepo.save(setting);
      updatedSettings.push(saved);
    }

    return updatedSettings;
  }

  async findAll(tenantId: string): Promise<Setting[]> {
    return this.settingRepo.find({ where: { tenantId } });
  }
}
