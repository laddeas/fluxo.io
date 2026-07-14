// ============================================================================
// DataFusion AI — Domain Entity Interfaces
// Core data models used across all services and the frontend
// ============================================================================

import {
  UserStatus,
  UserRole,
  TenantStatus,
  TenantTier,
  ConnectorType,
  ConnectorCategory,
  ConnectorStatus,
  InterfaceDirection,
  InterfaceStatus,
  TriggerType,
  JobStatus,
  LogLevel,
  WorkflowStatus,
  WorkflowStepType,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
  SettingsGroup,
  AIProvider,
  AuditAction,
  AuditResourceType,
  AuthMethod,
  MFAMethod,
} from '../enums/index.js';

// ---------------------------------------------------------------------------
// Base Entity
// ---------------------------------------------------------------------------

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantScopedEntity extends BaseEntity {
  tenantId: string;
}

// ---------------------------------------------------------------------------
// Tenant
// ---------------------------------------------------------------------------

export interface ITenant extends BaseEntity {
  name: string;
  slug: string;
  status: TenantStatus;
  tier: TenantTier;
  brandingConfig: TenantBrandingConfig;
  settings: Record<string, unknown>;
}

export interface TenantBrandingConfig {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  appName?: string;
  favicon?: string;
}

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface IUser extends TenantScopedEntity {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  mfaConfig: MFAConfig | null;
  lastLogin: Date | null;
  avatar?: string;
}

export interface MFAConfig {
  enabled: boolean;
  method: MFAMethod;
  secret?: string;
  backupCodes?: string[];
}

export interface IUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  avatar?: string;
  roles: IRole[];
  permissions: string[];
  tenant: Pick<ITenant, 'id' | 'name' | 'slug' | 'brandingConfig'>;
}

// ---------------------------------------------------------------------------
// Role & Permission
// ---------------------------------------------------------------------------

export interface IRole extends TenantScopedEntity {
  name: UserRole | string;
  description: string;
  isSystem: boolean;
  permissions: IPermission[];
}

export interface IPermission extends BaseEntity {
  resource: string;
  action: string;
  scope: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Connector
// ---------------------------------------------------------------------------

export interface IConnector extends TenantScopedEntity {
  name: string;
  type: ConnectorType;
  category: ConnectorCategory;
  version: string;
  status: ConnectorStatus;
  config: ConnectorConfig;
  authConfig: ConnectorAuthConfig;
  icon?: string;
  description?: string;
  lastTested: Date | null;
}

export interface ConnectorConfig {
  host?: string;
  port?: number;
  database?: string;
  basePath?: string;
  region?: string;
  bucket?: string;
  container?: string;
  [key: string]: unknown;
}

export interface ConnectorAuthConfig {
  method: AuthMethod;
  credentials: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IInterface extends TenantScopedEntity {
  name: string;
  direction: InterfaceDirection;
  connectorId: string;
  type: string;
  config: InterfaceConfig;
  schemaDefinition: SchemaDefinition | null;
  scheduleConfig: ScheduleConfig | null;
  status: InterfaceStatus;
  description?: string;
}

export interface InterfaceConfig {
  endpoint?: string;
  query?: string;
  filePath?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  batchSize?: number;
  retryPolicy?: RetryPolicy;
  [key: string]: unknown;
}

export interface SchemaDefinition {
  fields: SchemaField[];
  primaryKey?: string[];
  metadata?: Record<string, unknown>;
}

export interface SchemaField {
  name: string;
  type: string;
  nullable: boolean;
  description?: string;
  defaultValue?: unknown;
  constraints?: FieldConstraint[];
}

export interface FieldConstraint {
  type: 'REQUIRED' | 'UNIQUE' | 'MIN' | 'MAX' | 'PATTERN' | 'ENUM';
  value?: unknown;
}

export interface ScheduleConfig {
  type: TriggerType;
  cronExpression?: string;
  intervalMs?: number;
  timezone?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
}

// ---------------------------------------------------------------------------
// Workflow
// ---------------------------------------------------------------------------

export interface IWorkflow extends TenantScopedEntity {
  name: string;
  description: string;
  version: string;
  steps: IWorkflowStep[];
  retryPolicy: RetryPolicy;
  status: WorkflowStatus;
}

export interface IWorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  order: number;
  config: Record<string, unknown>;
  nextStepId?: string;
  errorStepId?: string;
  conditionExpression?: string;
}

// ---------------------------------------------------------------------------
// Job
// ---------------------------------------------------------------------------

export interface IJob extends TenantScopedEntity {
  interfaceId: string;
  workflowId?: string;
  status: JobStatus;
  triggerType: TriggerType;
  recordsProcessed: number;
  recordsFailed: number;
  durationMs: number;
  errorDetails: JobErrorDetail | null;
  metrics: JobMetrics;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface JobErrorDetail {
  code: string;
  message: string;
  stackTrace?: string;
  failedRecords?: unknown[];
}

export interface JobMetrics {
  bytesProcessed: number;
  throughputRecordsPerSec: number;
  peakMemoryMb: number;
  retryCount: number;
}

export interface IJobLog extends BaseEntity {
  jobId: string;
  level: LogLevel;
  message: string;
  metadata: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface ISetting extends TenantScopedEntity {
  group: SettingsGroup;
  key: string;
  value: unknown;
  description: string;
}

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------

export interface INotification extends TenantScopedEntity {
  userId: string;
  type: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  priority: NotificationPriority;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  readAt: Date | null;
}

// ---------------------------------------------------------------------------
// Audit Log
// ---------------------------------------------------------------------------

export interface IAuditLog extends TenantScopedEntity {
  userId: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
}

// ---------------------------------------------------------------------------
// AI Configuration
// ---------------------------------------------------------------------------

export interface IAIConfiguration extends TenantScopedEntity {
  provider: AIProvider;
  model: string;
  config: AIModelConfig;
  promptTemplates: Record<string, string>;
  status: string;
}

export interface AIModelConfig {
  apiKey?: string;
  endpoint?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// File Metadata
// ---------------------------------------------------------------------------

export interface IFileMetadata extends TenantScopedEntity {
  interfaceId: string;
  originalName: string;
  storedName: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
  checksum: string;
  parsedSchema: SchemaDefinition | null;
  status: string;
}

// ---------------------------------------------------------------------------
// API Configuration
// ---------------------------------------------------------------------------

export interface IAPIConfiguration extends TenantScopedEntity {
  connectorId: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  authConfig: ConnectorAuthConfig;
  bodyTemplate: Record<string, unknown> | null;
  timeoutMs: number;
  retryConfig: RetryPolicy;
}
