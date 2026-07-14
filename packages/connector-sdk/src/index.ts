// ============================================================================
// DataFusion AI — Connector SDK
// Plugin interface and base class for building data connectors
// ============================================================================

import type {
  ConnectorType,
  ConnectorCategory,
  AuthMethod,
} from '@datafusion-ai/shared-types';

// ---------------------------------------------------------------------------
// Connector Metadata
// ---------------------------------------------------------------------------

export interface ConnectorMetadata {
  /** Unique connector identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Semantic version string */
  version: string;
  /** Connector classification */
  type: ConnectorType;
  /** Source, destination, or bidirectional */
  category: ConnectorCategory;
  /** Short description of the connector */
  description: string;
  /** URL or base64 icon */
  icon: string;
  /** Author or organization name */
  author: string;
  /** Supported authentication methods */
  supportedAuthMethods: AuthMethod[];
  /** JSON Schema for connector configuration */
  configSchema: Record<string, unknown>;
  /** Connector capabilities */
  capabilities: ConnectorCapability[];
}

export type ConnectorCapability =
  | 'READ'
  | 'WRITE'
  | 'SCHEMA_DISCOVERY'
  | 'BATCH_READ'
  | 'BATCH_WRITE'
  | 'STREAM_READ'
  | 'STREAM_WRITE'
  | 'TRANSFORM'
  | 'VALIDATE'
  | 'INCREMENTAL_READ';

// ---------------------------------------------------------------------------
// Auth & Config Types
// ---------------------------------------------------------------------------

export interface AuthCredentials {
  method: AuthMethod;
  username?: string;
  password?: string;
  apiKey?: string;
  token?: string;
  clientId?: string;
  clientSecret?: string;
  certificate?: string;
  privateKey?: string;
  [key: string]: unknown;
}

export interface AuthResult {
  authenticated: boolean;
  token?: string;
  expiresAt?: Date;
  error?: string;
}

export interface ConnectorConfiguration {
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Data Types
// ---------------------------------------------------------------------------

export interface SchemaDefinition {
  fields: SchemaField[];
  primaryKey?: string[];
  metadata?: Record<string, unknown>;
}

export interface SchemaField {
  name: string;
  type: DataType;
  nullable: boolean;
  description?: string;
  defaultValue?: unknown;
  maxLength?: number;
}

export type DataType =
  | 'STRING'
  | 'INTEGER'
  | 'FLOAT'
  | 'BOOLEAN'
  | 'DATE'
  | 'DATETIME'
  | 'TIMESTAMP'
  | 'BINARY'
  | 'JSON'
  | 'ARRAY'
  | 'OBJECT';

export interface ReadQuery {
  /** Table, endpoint, or object name */
  source: string;
  /** Field selection (empty = all) */
  fields?: string[];
  /** Filter conditions */
  filters?: FilterCondition[];
  /** Sort specification */
  sort?: SortSpec[];
  /** Pagination */
  offset?: number;
  limit?: number;
  /** Custom query (SQL, SOQL, etc.) */
  rawQuery?: string;
}

export interface FilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like' | 'between';
  value: unknown;
}

export interface SortSpec {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface DataResult {
  records: Record<string, unknown>[];
  totalCount: number;
  hasMore: boolean;
  cursor?: string;
  schema: SchemaDefinition;
}

export interface WritePayload {
  /** Target table, endpoint, or object name */
  target: string;
  /** Records to write */
  records: Record<string, unknown>[];
  /** Write mode */
  mode: 'INSERT' | 'UPDATE' | 'UPSERT' | 'DELETE';
  /** Key fields for update/upsert/delete */
  keyFields?: string[];
}

export interface WriteResult {
  successCount: number;
  failedCount: number;
  errors: WriteError[];
}

export interface WriteError {
  recordIndex: number;
  code: string;
  message: string;
  record?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Transform Types
// ---------------------------------------------------------------------------

export interface TransformRule {
  sourceField: string;
  targetField: string;
  expression: string;
  type: 'MAP' | 'CONVERT' | 'FORMAT' | 'CUSTOM';
}

// ---------------------------------------------------------------------------
// Connection & Health
// ---------------------------------------------------------------------------

export interface ConnectionResult {
  connected: boolean;
  latencyMs: number;
  serverVersion?: string;
  error?: string;
}

export interface HealthCheckResult {
  healthy: boolean;
  latencyMs: number;
  details: Record<string, unknown>;
  checkedAt: Date;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// IConnector Interface — The Contract Every Connector Must Implement
// ---------------------------------------------------------------------------

export interface IConnector {
  // Metadata
  getMetadata(): ConnectorMetadata;

  // Lifecycle
  initialize(config: ConnectorConfiguration): Promise<void>;
  connect(): Promise<ConnectionResult>;
  disconnect(): Promise<void>;

  // Authentication
  authenticate(credentials: AuthCredentials): Promise<AuthResult>;
  refreshAuth?(): Promise<AuthResult>;

  // Validation
  validate(): Promise<ValidationResult>;
  testConnection(): Promise<HealthCheckResult>;

  // Schema Discovery
  discoverSchema(objectName?: string): Promise<SchemaDefinition>;
  listObjects?(): Promise<string[]>;

  // Data Operations
  read(query: ReadQuery): Promise<DataResult>;
  write(data: WritePayload): Promise<WriteResult>;

  // Transformations
  getDefaultTransformations?(): TransformRule[];
}

// ---------------------------------------------------------------------------
// BaseConnector — Abstract Base Class (Optional Helper)
// ---------------------------------------------------------------------------

export abstract class BaseConnector implements IConnector {
  protected config: ConnectorConfiguration = {};
  protected isConnected = false;
  protected isAuthenticated = false;

  abstract getMetadata(): ConnectorMetadata;

  async initialize(config: ConnectorConfiguration): Promise<void> {
    this.config = config;
  }

  abstract connect(): Promise<ConnectionResult>;

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.isAuthenticated = false;
  }

  abstract authenticate(credentials: AuthCredentials): Promise<AuthResult>;

  async refreshAuth(): Promise<AuthResult> {
    throw new Error('refreshAuth not implemented');
  }

  async validate(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.config || Object.keys(this.config).length === 0) {
      errors.push('Connector configuration is empty');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  async testConnection(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      const result = await this.connect();
      return {
        healthy: result.connected,
        latencyMs: Date.now() - start,
        details: { serverVersion: result.serverVersion },
        checkedAt: new Date(),
      };
    } catch (error) {
      return {
        healthy: false,
        latencyMs: Date.now() - start,
        details: { error: String(error) },
        checkedAt: new Date(),
      };
    }
  }

  abstract discoverSchema(objectName?: string): Promise<SchemaDefinition>;

  async listObjects(): Promise<string[]> {
    throw new Error('listObjects not implemented');
  }

  abstract read(query: ReadQuery): Promise<DataResult>;
  abstract write(data: WritePayload): Promise<WriteResult>;

  getDefaultTransformations(): TransformRule[] {
    return [];
  }

  protected ensureConnected(): void {
    if (!this.isConnected) {
      throw new Error('Connector is not connected. Call connect() first.');
    }
  }

  protected ensureAuthenticated(): void {
    if (!this.isAuthenticated) {
      throw new Error('Connector is not authenticated. Call authenticate() first.');
    }
  }
}
