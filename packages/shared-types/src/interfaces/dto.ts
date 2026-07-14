// ============================================================================
// DataFusion AI — DTOs (Data Transfer Objects)
// Request/Response shapes for all API endpoints
// ============================================================================

import {
  UserStatus,
  UserRole,
  ConnectorType,
  ConnectorCategory,
  ConnectorStatus,
  InterfaceDirection,
  InterfaceStatus,
  TriggerType,
  JobStatus,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
  SettingsGroup,
  AIProvider,
  AuthMethod,
  MFAMethod,
  TenantTier,
} from '../enums/index.js';

import type {
  ConnectorConfig,
  ConnectorAuthConfig,
  InterfaceConfig,
  ScheduleConfig,
  RetryPolicy,
  SchemaDefinition,
  MFAConfig,
  TenantBrandingConfig,
  IWorkflowStep,
  AIModelConfig,
} from './entities.js';

// ---------------------------------------------------------------------------
// Common DTOs
// ---------------------------------------------------------------------------

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  validationErrors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// ---------------------------------------------------------------------------
// Auth DTOs
// ---------------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
  tenantSlug?: string;
  mfaCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  user: UserResponse;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ---------------------------------------------------------------------------
// User DTOs
// ---------------------------------------------------------------------------

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleIds: string[];
  status?: UserStatus;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface UserResponse {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  avatar?: string;
  mfaEnabled: boolean;
  lastLogin: string | null;
  roles: RoleResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

export interface AssignRolesRequest {
  roleIds: string[];
}

export interface ConfigureMFARequest {
  enabled: boolean;
  method: MFAMethod;
}

export interface ResetPasswordRequest {
  userId: string;
  newPassword?: string;
  sendEmail?: boolean;
}

// ---------------------------------------------------------------------------
// Role DTOs
// ---------------------------------------------------------------------------

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: PermissionResponse[];
  createdAt: string;
}

export interface PermissionResponse {
  id: string;
  resource: string;
  action: string;
  scope: string;
  description: string;
}

export interface UpdateRolePermissionsRequest {
  permissionIds: string[];
}

// ---------------------------------------------------------------------------
// Tenant DTOs
// ---------------------------------------------------------------------------

export interface CreateTenantRequest {
  name: string;
  slug: string;
  tier?: TenantTier;
  adminEmail: string;
  adminPassword: string;
  adminFirstName: string;
  adminLastName: string;
  brandingConfig?: TenantBrandingConfig;
}

export interface UpdateTenantRequest {
  name?: string;
  brandingConfig?: TenantBrandingConfig;
  settings?: Record<string, unknown>;
}

export interface TenantResponse {
  id: string;
  name: string;
  slug: string;
  status: string;
  tier: TenantTier;
  brandingConfig: TenantBrandingConfig;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Connector DTOs
// ---------------------------------------------------------------------------

export interface CreateConnectorRequest {
  name: string;
  type: ConnectorType;
  category: ConnectorCategory;
  config: ConnectorConfig;
  authConfig: ConnectorAuthConfig;
  description?: string;
  icon?: string;
}

export interface UpdateConnectorRequest {
  name?: string;
  config?: ConnectorConfig;
  authConfig?: ConnectorAuthConfig;
  description?: string;
}

export interface ConnectorResponse {
  id: string;
  tenantId: string;
  name: string;
  type: ConnectorType;
  category: ConnectorCategory;
  version: string;
  status: ConnectorStatus;
  config: ConnectorConfig;
  description?: string;
  icon?: string;
  lastTested: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TestConnectionResponse {
  success: boolean;
  latencyMs: number;
  message: string;
  details?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Interface DTOs
// ---------------------------------------------------------------------------

export interface CreateInterfaceRequest {
  name: string;
  direction: InterfaceDirection;
  connectorId: string;
  type: string;
  config: InterfaceConfig;
  scheduleConfig?: ScheduleConfig;
  description?: string;
}

export interface UpdateInterfaceRequest {
  name?: string;
  config?: InterfaceConfig;
  scheduleConfig?: ScheduleConfig;
  description?: string;
}

export interface InterfaceResponse {
  id: string;
  tenantId: string;
  name: string;
  direction: InterfaceDirection;
  connectorId: string;
  type: string;
  config: InterfaceConfig;
  schemaDefinition: SchemaDefinition | null;
  scheduleConfig: ScheduleConfig | null;
  status: InterfaceStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataPreviewResponse {
  columns: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
  schema: SchemaDefinition;
}

export interface FileUploadResponse {
  id: string;
  originalName: string;
  sizeBytes: number;
  contentType: string;
  schema: SchemaDefinition | null;
  rowCount: number;
}

// ---------------------------------------------------------------------------
// Job DTOs
// ---------------------------------------------------------------------------

export interface JobFilterParams extends PaginationParams {
  status?: JobStatus;
  interfaceId?: string;
  workflowId?: string;
  triggerType?: TriggerType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface JobResponse {
  id: string;
  tenantId: string;
  interfaceId: string;
  workflowId?: string;
  status: JobStatus;
  triggerType: TriggerType;
  recordsProcessed: number;
  recordsFailed: number;
  durationMs: number;
  errorDetails: { code: string; message: string } | null;
  metrics: {
    bytesProcessed: number;
    throughputRecordsPerSec: number;
    peakMemoryMb: number;
    retryCount: number;
  };
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface JobStatisticsResponse {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  runningJobs: number;
  pendingJobs: number;
  avgDurationMs: number;
  totalRecordsProcessed: number;
  successRate: number;
}

export interface JobLogResponse {
  id: string;
  jobId: string;
  level: string;
  message: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Workflow DTOs
// ---------------------------------------------------------------------------

export interface CreateWorkflowRequest {
  name: string;
  description: string;
  steps: IWorkflowStep[];
  retryPolicy?: RetryPolicy;
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  steps?: IWorkflowStep[];
  retryPolicy?: RetryPolicy;
}

export interface WorkflowResponse {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  version: string;
  steps: IWorkflowStep[];
  retryPolicy: RetryPolicy;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Settings DTOs
// ---------------------------------------------------------------------------

export interface UpdateSettingsRequest {
  settings: Array<{
    key: string;
    value: unknown;
  }>;
}

export interface SettingsResponse {
  group: SettingsGroup;
  settings: Array<{
    key: string;
    value: unknown;
    description: string;
    updatedAt: string;
  }>;
}

// ---------------------------------------------------------------------------
// Notification DTOs
// ---------------------------------------------------------------------------

export interface NotificationResponse {
  id: string;
  type: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  priority: NotificationPriority;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Audit Log DTOs
// ---------------------------------------------------------------------------

export interface AuditLogFilterParams extends PaginationParams {
  userId?: string;
  action?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditLogResponse {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// AI DTOs
// ---------------------------------------------------------------------------

export interface AIChatRequest {
  message: string;
  context?: Record<string, unknown>;
  conversationId?: string;
}

export interface AIChatResponse {
  message: string;
  conversationId: string;
  suggestions?: string[];
}

export interface AIMappingSuggestRequest {
  sourceSchema: SchemaDefinition;
  targetSchema: SchemaDefinition;
  context?: string;
}

export interface AIMappingSuggestResponse {
  mappings: Array<{
    sourceField: string;
    targetField: string;
    confidence: number;
    transformExpression?: string;
  }>;
}

export interface AIQualityScoreResponse {
  overallScore: number;
  dimensions: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
  };
  issues: Array<{
    field: string;
    issue: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    suggestion: string;
  }>;
}
