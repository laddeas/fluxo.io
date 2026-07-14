// ============================================================================
// DataFusion AI — Domain Events
// Event-driven communication contracts between microservices
// ============================================================================

import type { JobStatus, ConnectorStatus } from '../enums/index.js';

// ---------------------------------------------------------------------------
// Base Event
// ---------------------------------------------------------------------------

export interface DomainEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  tenantId: string;
  correlationId: string;
  source: string;
  payload: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Interface Events
// ---------------------------------------------------------------------------

export interface InterfaceCreatedEvent extends DomainEvent {
  eventType: 'interface.created';
  payload: {
    interfaceId: string;
    name: string;
    direction: string;
    connectorId: string;
  };
}

export interface InterfaceDataReceivedEvent extends DomainEvent {
  eventType: 'interface.data.received';
  payload: {
    interfaceId: string;
    fileId?: string;
    recordCount: number;
    sizeBytes: number;
  };
}

// ---------------------------------------------------------------------------
// Job Events
// ---------------------------------------------------------------------------

export interface JobStartedEvent extends DomainEvent {
  eventType: 'job.started';
  payload: {
    jobId: string;
    interfaceId: string;
    workflowId?: string;
    triggerType: string;
  };
}

export interface JobCompletedEvent extends DomainEvent {
  eventType: 'job.completed';
  payload: {
    jobId: string;
    recordsProcessed: number;
    durationMs: number;
    status: JobStatus;
  };
}

export interface JobFailedEvent extends DomainEvent {
  eventType: 'job.failed';
  payload: {
    jobId: string;
    errorCode: string;
    errorMessage: string;
    retryCount: number;
    maxRetries: number;
  };
}

// ---------------------------------------------------------------------------
// Connector Events
// ---------------------------------------------------------------------------

export interface ConnectorRegisteredEvent extends DomainEvent {
  eventType: 'connector.registered';
  payload: {
    connectorId: string;
    name: string;
    type: string;
    version: string;
  };
}

export interface ConnectorStatusChangedEvent extends DomainEvent {
  eventType: 'connector.status.changed';
  payload: {
    connectorId: string;
    oldStatus: ConnectorStatus;
    newStatus: ConnectorStatus;
  };
}

// ---------------------------------------------------------------------------
// User Events
// ---------------------------------------------------------------------------

export interface UserCreatedEvent extends DomainEvent {
  eventType: 'user.created';
  payload: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface UserStatusChangedEvent extends DomainEvent {
  eventType: 'user.status.changed';
  payload: {
    userId: string;
    oldStatus: string;
    newStatus: string;
  };
}

export interface UserLoginEvent extends DomainEvent {
  eventType: 'user.login';
  payload: {
    userId: string;
    email: string;
    ipAddress: string;
    userAgent: string;
  };
}

// ---------------------------------------------------------------------------
// Workflow Events
// ---------------------------------------------------------------------------

export interface WorkflowExecutionStartedEvent extends DomainEvent {
  eventType: 'workflow.execution.started';
  payload: {
    workflowId: string;
    jobId: string;
    version: string;
  };
}

export interface WorkflowStepCompletedEvent extends DomainEvent {
  eventType: 'workflow.step.completed';
  payload: {
    workflowId: string;
    jobId: string;
    stepId: string;
    stepType: string;
    durationMs: number;
  };
}

// ---------------------------------------------------------------------------
// AI Events
// ---------------------------------------------------------------------------

export interface AIMappingRequestEvent extends DomainEvent {
  eventType: 'ai.mapping.request';
  payload: {
    requestId: string;
    sourceSchemaId: string;
    targetSchemaId: string;
  };
}

export interface AIMappingResponseEvent extends DomainEvent {
  eventType: 'ai.mapping.response';
  payload: {
    requestId: string;
    mappings: Array<{
      sourceField: string;
      targetField: string;
      confidence: number;
    }>;
  };
}

// ---------------------------------------------------------------------------
// Notification Events
// ---------------------------------------------------------------------------

export interface NotificationRequestEvent extends DomainEvent {
  eventType: 'notification.request';
  payload: {
    userId: string;
    channel: string;
    title: string;
    body: string;
    priority: string;
    metadata?: Record<string, unknown>;
  };
}

// ---------------------------------------------------------------------------
// Event Type Union
// ---------------------------------------------------------------------------

export type DataFusionEvent =
  | InterfaceCreatedEvent
  | InterfaceDataReceivedEvent
  | JobStartedEvent
  | JobCompletedEvent
  | JobFailedEvent
  | ConnectorRegisteredEvent
  | ConnectorStatusChangedEvent
  | UserCreatedEvent
  | UserStatusChangedEvent
  | UserLoginEvent
  | WorkflowExecutionStartedEvent
  | WorkflowStepCompletedEvent
  | AIMappingRequestEvent
  | AIMappingResponseEvent
  | NotificationRequestEvent;

// ---------------------------------------------------------------------------
// Exchange & Queue Constants
// ---------------------------------------------------------------------------

export const EXCHANGES = {
  INTEGRATION_EVENTS: 'integration.events',
  JOB_COMMANDS: 'job.commands',
  NOTIFICATION_FANOUT: 'notification.fanout',
  AI_REQUESTS: 'ai.requests',
  AUDIT_EVENTS: 'audit.events',
} as const;

export const ROUTING_KEYS = {
  INTERFACE_CREATED: 'interface.created',
  INTERFACE_DATA_RECEIVED: 'interface.data.received',
  JOB_STARTED: 'job.started',
  JOB_COMPLETED: 'job.completed',
  JOB_FAILED: 'job.failed',
  CONNECTOR_REGISTERED: 'connector.registered',
  CONNECTOR_STATUS_CHANGED: 'connector.status.changed',
  USER_CREATED: 'user.created',
  USER_STATUS_CHANGED: 'user.status.changed',
  USER_LOGIN: 'user.login',
  WORKFLOW_STARTED: 'workflow.execution.started',
  WORKFLOW_STEP_COMPLETED: 'workflow.step.completed',
  AI_MAPPING_REQUEST: 'ai.mapping.request',
  AI_MAPPING_RESPONSE: 'ai.mapping.response',
  NOTIFICATION_REQUEST: 'notification.request',
} as const;
