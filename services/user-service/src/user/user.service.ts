import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role, Permission } from '@datafusion-ai/database';
import type { CreateUserRequest, UpdateUserRequest } from '@datafusion-ai/shared-types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(tenantId: string, dto: CreateUserRequest): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { tenantId, email: dto.email } });
    if (existing) {
      throw new ConflictException(`User with email "${dto.email}" already exists in this tenant`);
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const roles: Role[] = [];
    if (dto.roleIds && dto.roleIds.length > 0) {
      for (const id of dto.roleIds) {
        const role = await this.roleRepo.findOne({ where: { id, tenantId } });
        if (role) roles.push(role);
      }
    }

    const user = this.userRepo.create({
      tenantId,
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      status: dto.status || 'ACTIVE',
      roles,
    });

    return this.userRepo.save(user);
  }

  async findById(tenantId: string, id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id, tenantId },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(tenantId: string, email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email, tenantId },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }

  async update(tenantId: string, id: string, dto: UpdateUserRequest): Promise<User> {
    const user = await this.findById(tenantId, id);

    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.email) {
      const existing = await this.userRepo.findOne({ where: { tenantId, email: dto.email } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Email "${dto.email}" is already taken`);
      }
      user.email = dto.email;
    }
    if (dto.avatar) user.avatar = dto.avatar;

    return this.userRepo.save(user);
  }

  async updateStatus(tenantId: string, id: string, status: string): Promise<User> {
    const user = await this.findById(tenantId, id);
    user.status = status;
    return this.userRepo.save(user);
  }

  async assignRoles(tenantId: string, id: string, roleIds: string[]): Promise<User> {
    const user = await this.findById(tenantId, id);
    const roles: Role[] = [];
    for (const rid of roleIds) {
      const role = await this.roleRepo.findOne({ where: { id: rid, tenantId } });
      if (role) roles.push(role);
    }
    user.roles = roles;
    return this.userRepo.save(user);
  }

  async findAll(tenantId: string): Promise<User[]> {
    return this.userRepo.find({
      where: { tenantId },
      relations: {
        roles: true,
      },
    });
  }
}
