import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@datafusion-ai/database';
import { JwtService } from '@nestjs/jwt';
import type { LoginRequest, LoginResponse } from '@datafusion-ai/shared-types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(`User account is ${user.status.toLowerCase()}`);
    }

    const permissions = new Set<string>();
    if (user.roles) {
      for (const role of user.roles) {
        if (role.permissions) {
          for (const perm of role.permissions) {
            permissions.add(`${perm.resource}:${perm.action.toLowerCase()}`);
          }
        }
      }
    }

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      roles: user.roles?.map((r) => r.name) || [],
      permissions: Array.from(permissions),
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      refreshToken: this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' }),
      expiresIn: 3600,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status as any,
        mfaEnabled: user.mfaConfig?.enabled || false,
        lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
        roles: user.roles?.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description || '',
          isSystem: r.isSystem,
          permissions: r.permissions?.map((p) => ({
            id: p.id,
            resource: p.resource,
            action: p.action,
            scope: p.scope,
            description: p.description || '',
          })) || [],
          createdAt: r.createdAt.toISOString(),
        })) || [],
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }
}
