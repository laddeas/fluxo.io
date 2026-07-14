import { Controller, Get, Post, Put, Patch, Body, Param, Headers } from '@nestjs/common';
import { UserService } from './user.service.js';
import type { CreateUserRequest, UpdateUserRequest, AssignRolesRequest, UpdateUserStatusRequest } from '@datafusion-ai/shared-types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateUserRequest) {
    return this.userService.create(tenantId, dto);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.userService.findAll(tenantId);
  }

  @Get(':id')
  findById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.userService.findById(tenantId, id);
  }

  @Put(':id')
  update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateUserRequest,
  ) {
    return this.userService.update(tenantId, id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusRequest,
  ) {
    return this.userService.updateStatus(tenantId, id, dto.status);
  }

  @Put(':id/roles')
  assignRoles(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: AssignRolesRequest,
  ) {
    return this.userService.assignRoles(tenantId, id, dto.roleIds);
  }
}
