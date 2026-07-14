// ============================================================================
// DataFusion AI — Shared Types
// Core domain enums used across all services and the frontend
// ============================================================================

// ---------------------------------------------------------------------------
// User & Auth Enums
// ---------------------------------------------------------------------------

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  ADMINISTRATOR = 'ADMINISTRATOR',
  INTEGRATION_DEVELOPER = 'INTEGRATION_DEVELOPER',
  BUSINESS_USER = 'BUSINESS_USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  READ_ONLY = 'READ_ONLY',
}

export enum PermissionScope {
  PAGE = 'PAGE',
  FEATURE = 'FEATURE',
  CONNECTOR = 'CONNECTOR',
  API = 'API',
  JOB = 'JOB',
  TENANT = 'TENANT',
}

export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXECUTE = 'EXECUTE',
  MANAGE = 'MANAGE',
}

export enum AuthMethod {
  OAUTH2 = 'OAUTH2',
  OIDC = 'OIDC',
  SAML = 'SAML',
  LDAP = 'LDAP',
  API_KEY = 'API_KEY',
  BASIC = 'BASIC',
  JWT = 'JWT',
}

export enum MFAMethod {
  TOTP = 'TOTP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  WEBAUTHN = 'WEBAUTHN',
}

// ---------------------------------------------------------------------------
// Tenant Enums
// ---------------------------------------------------------------------------

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL',
}

export enum TenantTier {
  SHARED = 'SHARED',
  DEDICATED_SCHEMA = 'DEDICATED_SCHEMA',
  FULLY_ISOLATED = 'FULLY_ISOLATED',
}

// ---------------------------------------------------------------------------
// Connector Enums
// ---------------------------------------------------------------------------

export enum ConnectorType {
  REST_API = 'REST_API',
  SOAP_API = 'SOAP_API',
  DATABASE = 'DATABASE',
  CLOUD_STORAGE = 'CLOUD_STORAGE',
  ENTERPRISE_APP = 'ENTERPRISE_APP',
  FILE_SYSTEM = 'FILE_SYSTEM',
  MESSAGE_QUEUE = 'MESSAGE_QUEUE',
  CUSTOM = 'CUSTOM',
}

export enum ConnectorCategory {
  SOURCE = 'SOURCE',
  DESTINATION = 'DESTINATION',
  BIDIRECTIONAL = 'BIDIRECTIONAL',
}

export enum ConnectorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED',
  ERROR = 'ERROR',
}

export enum DatabaseType {
  POSTGRESQL = 'POSTGRESQL',
  MYSQL = 'MYSQL',
  SQL_SERVER = 'SQL_SERVER',
  ORACLE = 'ORACLE',
  MONGODB = 'MONGODB',
}

export enum CloudStorageType {
  AWS_S3 = 'AWS_S3',
  AZURE_BLOB = 'AZURE_BLOB',
  GOOGLE_CLOUD_STORAGE = 'GOOGLE_CLOUD_STORAGE',
}

export enum EnterpriseAppType {
  SAP = 'SAP',
  SALESFORCE = 'SALESFORCE',
  SERVICENOW = 'SERVICENOW',
  SHAREPOINT = 'SHAREPOINT',
  WORKDAY = 'WORKDAY',
}

// ---------------------------------------------------------------------------
// Interface Enums
// ---------------------------------------------------------------------------

export enum InterfaceDirection {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export enum InterfaceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  ERROR = 'ERROR',
}

export enum FileType {
  CSV = 'CSV',
  XLS = 'XLS',
  XLSX = 'XLSX',
  JSON = 'JSON',
  XML = 'XML',
  TXT = 'TXT',
  PDF = 'PDF',
}

export enum TriggerType {
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
  EVENT_BASED = 'EVENT_BASED',
  REAL_TIME = 'REAL_TIME',
}

// ---------------------------------------------------------------------------
// Job Enums
// ---------------------------------------------------------------------------

export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  SCHEDULED = 'SCHEDULED',
  RETRYING = 'RETRYING',
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

// ---------------------------------------------------------------------------
// Workflow Enums
// ---------------------------------------------------------------------------

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum WorkflowStepType {
  SOURCE = 'SOURCE',
  VALIDATION = 'VALIDATION',
  TRANSFORMATION = 'TRANSFORMATION',
  MAPPING = 'MAPPING',
  PROCESSING = 'PROCESSING',
  DESTINATION = 'DESTINATION',
  CONDITION = 'CONDITION',
  HUMAN_APPROVAL = 'HUMAN_APPROVAL',
  ERROR_HANDLER = 'ERROR_HANDLER',
}

// ---------------------------------------------------------------------------
// Notification Enums
// ---------------------------------------------------------------------------

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SLACK = 'SLACK',
  TEAMS = 'TEAMS',
  SMS = 'SMS',
  WEBHOOK = 'WEBHOOK',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  READ = 'READ',
  FAILED = 'FAILED',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// ---------------------------------------------------------------------------
// Settings Enums
// ---------------------------------------------------------------------------

export enum SettingsGroup {
  GENERAL = 'GENERAL',
  FILE = 'FILE',
  CONNECTOR = 'CONNECTOR',
  SECURITY = 'SECURITY',
  AI = 'AI',
  NOTIFICATION = 'NOTIFICATION',
  MONITORING = 'MONITORING',
  BACKUP = 'BACKUP',
}

// ---------------------------------------------------------------------------
// AI Enums
// ---------------------------------------------------------------------------

export enum AIProvider {
  OPENAI = 'OPENAI',
  AZURE_OPENAI = 'AZURE_OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  GOOGLE = 'GOOGLE',
  LOCAL = 'LOCAL',
}

export enum AIServiceType {
  ASSISTANT = 'ASSISTANT',
  MAPPING = 'MAPPING',
  TRANSFORMATION = 'TRANSFORMATION',
  MONITORING = 'MONITORING',
  TROUBLESHOOTING = 'TROUBLESHOOTING',
  DOCUMENTATION = 'DOCUMENTATION',
}

// ---------------------------------------------------------------------------
// Audit Enums
// ---------------------------------------------------------------------------

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXECUTE = 'EXECUTE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
}

export enum AuditResourceType {
  USER = 'USER',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  TENANT = 'TENANT',
  CONNECTOR = 'CONNECTOR',
  INTERFACE = 'INTERFACE',
  WORKFLOW = 'WORKFLOW',
  JOB = 'JOB',
  SETTINGS = 'SETTINGS',
  AI_CONFIG = 'AI_CONFIG',
}
