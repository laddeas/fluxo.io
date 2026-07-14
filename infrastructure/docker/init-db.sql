-- ============================================================================
-- DataFusion AI — Database Initialization Script
-- Creates all tables, indexes, RLS policies, and seed data
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- TENANTS
-- ============================================================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    tier VARCHAR(50) NOT NULL DEFAULT 'SHARED',
    branding_config JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);

-- ============================================================================
-- USERS
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    mfa_config JSONB DEFAULT NULL,
    avatar VARCHAR(500),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- ============================================================================
-- ROLES
-- ============================================================================
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

CREATE INDEX idx_roles_tenant ON roles(tenant_id);

-- ============================================================================
-- PERMISSIONS
-- ============================================================================
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    scope VARCHAR(50) NOT NULL,
    description TEXT,
    UNIQUE(resource, action, scope)
);

-- ============================================================================
-- ROLE_PERMISSIONS (Many-to-Many)
-- ============================================================================
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ============================================================================
-- USER_ROLES (Many-to-Many)
-- ============================================================================
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- ============================================================================
-- CONNECTORS
-- ============================================================================
CREATE TABLE connectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'BIDIRECTIONAL',
    version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    config JSONB DEFAULT '{}',
    auth_config JSONB DEFAULT '{}',
    icon VARCHAR(500),
    description TEXT,
    last_tested TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_connectors_tenant ON connectors(tenant_id);
CREATE INDEX idx_connectors_type ON connectors(type);
CREATE INDEX idx_connectors_status ON connectors(status);

-- ============================================================================
-- INTERFACES
-- ============================================================================
CREATE TABLE interfaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    connector_id UUID REFERENCES connectors(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    type VARCHAR(100) NOT NULL,
    config JSONB DEFAULT '{}',
    schema_definition JSONB,
    schedule_config JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_interfaces_tenant ON interfaces(tenant_id);
CREATE INDEX idx_interfaces_connector ON interfaces(connector_id);
CREATE INDEX idx_interfaces_direction ON interfaces(direction);
CREATE INDEX idx_interfaces_status ON interfaces(status);

-- ============================================================================
-- WORKFLOWS
-- ============================================================================
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    steps JSONB DEFAULT '[]',
    retry_policy JSONB DEFAULT '{"maxRetries": 3, "retryDelayMs": 5000, "backoffMultiplier": 2, "maxDelayMs": 60000}',
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workflows_tenant ON workflows(tenant_id);
CREATE INDEX idx_workflows_status ON workflows(status);

-- ============================================================================
-- JOBS
-- ============================================================================
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    interface_id UUID REFERENCES interfaces(id) ON DELETE SET NULL,
    workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    trigger_type VARCHAR(50) NOT NULL DEFAULT 'MANUAL',
    records_processed INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    error_details JSONB,
    metrics JSONB DEFAULT '{"bytesProcessed": 0, "throughputRecordsPerSec": 0, "peakMemoryMb": 0, "retryCount": 0}',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_jobs_tenant ON jobs(tenant_id);
CREATE INDEX idx_jobs_interface ON jobs(interface_id);
CREATE INDEX idx_jobs_workflow ON jobs(workflow_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- ============================================================================
-- JOB_LOGS
-- ============================================================================
CREATE TABLE job_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL DEFAULT 'INFO',
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_logs_job ON job_logs(job_id);
CREATE INDEX idx_job_logs_level ON job_logs(level);
CREATE INDEX idx_job_logs_created_at ON job_logs(created_at DESC);

-- ============================================================================
-- SETTINGS
-- ============================================================================
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    group_name VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value JSONB,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, group_name, key)
);

CREATE INDEX idx_settings_tenant ON settings(tenant_id);
CREATE INDEX idx_settings_group ON settings(group_name);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL DEFAULT 'IN_APP',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    title VARCHAR(500) NOT NULL,
    body TEXT,
    metadata JSONB DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- AUDIT_LOGS
-- ============================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- AI_CONFIGURATIONS
-- ============================================================================
CREATE TABLE ai_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    config JSONB DEFAULT '{}',
    prompt_templates JSONB DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_configs_tenant ON ai_configurations(tenant_id);

-- ============================================================================
-- FILE_METADATA
-- ============================================================================
CREATE TABLE file_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    interface_id UUID REFERENCES interfaces(id) ON DELETE SET NULL,
    original_name VARCHAR(500) NOT NULL,
    stored_name VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    storage_path VARCHAR(1000) NOT NULL,
    checksum VARCHAR(128),
    parsed_schema JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'UPLOADED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_file_metadata_tenant ON file_metadata(tenant_id);
CREATE INDEX idx_file_metadata_interface ON file_metadata(interface_id);

-- ============================================================================
-- API_CONFIGURATIONS
-- ============================================================================
CREATE TABLE api_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    connector_id UUID REFERENCES connectors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL DEFAULT 'GET',
    url VARCHAR(2000) NOT NULL,
    headers JSONB DEFAULT '{}',
    auth_config JSONB DEFAULT '{}',
    body_template JSONB,
    timeout_ms INTEGER DEFAULT 30000,
    retry_config JSONB DEFAULT '{"maxRetries": 3, "retryDelayMs": 1000, "backoffMultiplier": 2, "maxDelayMs": 30000}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_configs_tenant ON api_configurations(tenant_id);
CREATE INDEX idx_api_configs_connector ON api_configurations(connector_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — Multi-Tenant Isolation
-- ============================================================================

-- Create a function to get the current tenant ID from session
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_tenant_id', TRUE), '')::UUID;
END;
$$ LANGUAGE plpgsql STABLE;

-- Enable RLS on all tenant-scoped tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE interfaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table
CREATE POLICY tenant_isolation_users ON users
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_roles ON roles
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_connectors ON connectors
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_interfaces ON interfaces
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_workflows ON workflows
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_jobs ON jobs
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_settings ON settings
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_notifications ON notifications
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_audit_logs ON audit_logs
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_ai_configurations ON ai_configurations
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_file_metadata ON file_metadata
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_api_configurations ON api_configurations
    USING (tenant_id = current_tenant_id());

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_connectors_updated_at BEFORE UPDATE ON connectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_interfaces_updated_at BEFORE UPDATE ON interfaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_ai_configs_updated_at BEFORE UPDATE ON ai_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_api_configs_updated_at BEFORE UPDATE ON api_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA — Default Tenant, Admin User, Roles, Permissions
-- ============================================================================

-- Default Tenant
INSERT INTO tenants (id, name, slug, status, tier, branding_config) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'DataFusion Demo', 'demo', 'ACTIVE', 'SHARED',
     '{"appName": "DataFusion AI", "primaryColor": "#6366F1", "secondaryColor": "#8B5CF6"}');

-- Default Roles (bypassing RLS for seed data by using the datafusion superuser)
INSERT INTO roles (id, tenant_id, name, description, is_system) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'SUPER_ADMIN', 'Full platform access', TRUE),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'TENANT_ADMIN', 'Tenant-level administration', TRUE),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'ADMINISTRATOR', 'Application administration', TRUE),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'INTEGRATION_DEVELOPER', 'Build and manage integrations', TRUE),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'BUSINESS_USER', 'View and execute integrations', TRUE),
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'OPERATOR', 'Monitor and operate jobs', TRUE),
    ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'AUDITOR', 'View audit trails and compliance', TRUE),
    ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'READ_ONLY', 'Read-only access', TRUE);

-- Default Permissions
INSERT INTO permissions (id, resource, action, scope, description) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'interface', 'CREATE', 'PAGE', 'Create integrations'),
    ('c0000000-0000-0000-0000-000000000002', 'interface', 'READ', 'PAGE', 'View integrations'),
    ('c0000000-0000-0000-0000-000000000003', 'interface', 'UPDATE', 'PAGE', 'Update integrations'),
    ('c0000000-0000-0000-0000-000000000004', 'interface', 'DELETE', 'PAGE', 'Delete integrations'),
    ('c0000000-0000-0000-0000-000000000005', 'interface', 'EXECUTE', 'FEATURE', 'Execute integrations'),
    ('c0000000-0000-0000-0000-000000000006', 'user', 'CREATE', 'PAGE', 'Create users'),
    ('c0000000-0000-0000-0000-000000000007', 'user', 'READ', 'PAGE', 'View users'),
    ('c0000000-0000-0000-0000-000000000008', 'user', 'UPDATE', 'PAGE', 'Update users'),
    ('c0000000-0000-0000-0000-000000000009', 'user', 'DELETE', 'PAGE', 'Delete users'),
    ('c0000000-0000-0000-0000-000000000010', 'settings', 'READ', 'PAGE', 'View settings'),
    ('c0000000-0000-0000-0000-000000000011', 'settings', 'UPDATE', 'PAGE', 'Update settings'),
    ('c0000000-0000-0000-0000-000000000012', 'job', 'READ', 'PAGE', 'View job history'),
    ('c0000000-0000-0000-0000-000000000013', 'job', 'EXECUTE', 'FEATURE', 'Retry jobs'),
    ('c0000000-0000-0000-0000-000000000014', 'connector', 'CREATE', 'CONNECTOR', 'Create connectors'),
    ('c0000000-0000-0000-0000-000000000015', 'connector', 'MANAGE', 'CONNECTOR', 'Manage connectors'),
    ('c0000000-0000-0000-0000-000000000016', 'audit', 'READ', 'PAGE', 'View audit logs'),
    ('c0000000-0000-0000-0000-000000000017', 'ai', 'READ', 'FEATURE', 'Use AI features'),
    ('c0000000-0000-0000-0000-000000000018', 'ai', 'MANAGE', 'FEATURE', 'Configure AI settings'),
    ('c0000000-0000-0000-0000-000000000019', 'tenant', 'MANAGE', 'TENANT', 'Manage tenant settings'),
    ('c0000000-0000-0000-0000-000000000020', 'monitoring', 'READ', 'PAGE', 'View monitoring dashboards');

-- Assign all permissions to SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'b0000000-0000-0000-0000-000000000001', id FROM permissions;

-- Assign relevant permissions to TENANT_ADMIN (all except tenant management)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'b0000000-0000-0000-0000-000000000002', id FROM permissions WHERE resource != 'tenant' OR action != 'MANAGE';

-- Default Admin User (password: Admin@123456)
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, status) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'admin@datafusion.io', '$2b$10$EIXtK2qYBf3Y4E1qX2r5DOlSiG6S7WaZZqJ5aGhU1J2rT0W7sOkCy',
     'System', 'Administrator', 'ACTIVE');

-- Assign SUPER_ADMIN role to default admin
INSERT INTO user_roles (user_id, role_id) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001');

-- Default Settings
INSERT INTO settings (tenant_id, group_name, key, value, description) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'GENERAL', 'app_name', '"DataFusion AI"', 'Application display name'),
    ('a0000000-0000-0000-0000-000000000001', 'GENERAL', 'theme', '"dark"', 'Default theme (dark/light)'),
    ('a0000000-0000-0000-0000-000000000001', 'GENERAL', 'language', '"en"', 'Default language'),
    ('a0000000-0000-0000-0000-000000000001', 'FILE', 'upload_enabled', 'true', 'Enable file uploads'),
    ('a0000000-0000-0000-0000-000000000001', 'FILE', 'allowed_extensions', '["csv","xls","xlsx","json","xml","txt","pdf"]', 'Allowed file extensions'),
    ('a0000000-0000-0000-0000-000000000001', 'FILE', 'max_file_size_mb', '100', 'Maximum file size in MB'),
    ('a0000000-0000-0000-0000-000000000001', 'SECURITY', 'mfa_enabled', 'false', 'Enforce MFA for all users'),
    ('a0000000-0000-0000-0000-000000000001', 'SECURITY', 'session_timeout_minutes', '60', 'Session timeout in minutes'),
    ('a0000000-0000-0000-0000-000000000001', 'AI', 'ai_enabled', 'true', 'Enable AI features'),
    ('a0000000-0000-0000-0000-000000000001', 'AI', 'default_provider', '"OPENAI"', 'Default AI provider'),
    ('a0000000-0000-0000-0000-000000000001', 'MONITORING', 'log_retention_days', '90', 'Log retention period in days'),
    ('a0000000-0000-0000-0000-000000000001', 'MONITORING', 'metrics_enabled', 'true', 'Enable metrics collection');

RAISE NOTICE 'DataFusion AI database initialized successfully!';
