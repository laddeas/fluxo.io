// ============================================================================
// DataFusion AI — Interface Page
// Input & Output interface management with tabs and mock handlers
// ============================================================================

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Divider,
  Radio,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  AddOutlined,
  SearchOutlined,
  FilterListOutlined,
  MoreVertOutlined,
  PlayArrowOutlined,
  EditOutlined,
  DeleteOutlined,
  VisibilityOutlined,
  CloudUploadOutlined,
  StorageOutlined,
  ApiOutlined,
  CloudOutlined,
  DescriptionOutlined,
  ScheduleOutlined,
  RefreshOutlined,
  InputOutlined,
  OutputOutlined,
  ContentCopyOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const initialInputInterfaces = [
  {
    id: 'INT-001',
    name: 'Salesforce Contact Sync',
    type: 'REST_API',
    connector: 'Salesforce',
    status: 'ACTIVE',
    triggerType: 'SCHEDULED',
    schedule: 'Every 15 min',
    lastRun: '2 min ago',
    records: '12,450',
    icon: '☁️',
  },
  {
    id: 'INT-002',
    name: 'SAP Invoice Import',
    type: 'ENTERPRISE_APP',
    connector: 'SAP',
    status: 'ACTIVE',
    triggerType: 'EVENT_BASED',
    schedule: 'On event',
    lastRun: '8 min ago',
    records: '8,231',
    icon: '🏭',
  },
  {
    id: 'INT-003',
    name: 'CSV File Upload',
    type: 'FILE_SYSTEM',
    connector: 'Local File',
    status: 'ACTIVE',
    triggerType: 'MANUAL',
    schedule: 'Manual',
    lastRun: '15 min ago',
    records: '5,678',
    icon: '📄',
  },
  {
    id: 'INT-004',
    name: 'PostgreSQL Orders Feed',
    type: 'DATABASE',
    connector: 'PostgreSQL',
    status: 'DRAFT',
    triggerType: 'SCHEDULED',
    schedule: 'Hourly',
    lastRun: 'Never',
    records: '0',
    icon: '🗄️',
  },
  {
    id: 'INT-005',
    name: 'Azure Blob Data Ingest',
    type: 'CLOUD_STORAGE',
    connector: 'Azure Blob',
    status: 'ERROR',
    triggerType: 'REAL_TIME',
    schedule: 'Real-time',
    lastRun: '1 hour ago',
    records: '0',
    icon: '☁️',
  },
];

const initialOutputInterfaces = [
  {
    id: 'OUT-001',
    name: 'Data Warehouse Export',
    type: 'DATABASE',
    connector: 'Snowflake',
    status: 'ACTIVE',
    triggerType: 'SCHEDULED',
    schedule: 'Daily 2 AM',
    lastRun: '6 hours ago',
    records: '124,500',
    icon: '🏢',
  },
  {
    id: 'OUT-002',
    name: 'S3 Archive Push',
    type: 'CLOUD_STORAGE',
    connector: 'AWS S3',
    status: 'ACTIVE',
    triggerType: 'EVENT_BASED',
    schedule: 'On completion',
    lastRun: '12 min ago',
    records: '45,200',
    icon: '📦',
  },
  {
    id: 'OUT-003',
    name: 'ServiceNow Ticket Create',
    type: 'ENTERPRISE_APP',
    connector: 'ServiceNow',
    status: 'ACTIVE',
    triggerType: 'REAL_TIME',
    schedule: 'Real-time',
    lastRun: '3 min ago',
    records: '3,421',
    icon: '🎫',
  },
];

const statusColors: Record<string, string> = {
  ACTIVE: brand.success,
  DRAFT: brand.warning,
  ERROR: brand.error,
  INACTIVE: '#64748B',
  PENDING_APPROVAL: brand.warning,
  REJECTED: brand.error,
};

const typeIcons: Record<string, React.ReactElement> = {
  REST_API: <ApiOutlined />,
  DATABASE: <StorageOutlined />,
  FILE_SYSTEM: <DescriptionOutlined />,
  CLOUD_STORAGE: <CloudOutlined />,
  ENTERPRISE_APP: <CloudOutlined />,
};

const getInterfaceDetails = (item: any) => {
  const defaults = {
    s3Path: 's3://fluxo-ingest-bucket/default-files/',
    fileSize: '45.2 KB',
    fields: [
      { name: 'id', type: 'INT', isPk: true, isNullable: false, length: '11', desc: 'Auto-increment primary key' },
      { name: 'name', type: 'VARCHAR', isPk: false, isNullable: false, length: '100', desc: 'Resource name' },
      { name: 'created_at', type: 'DATETIME', isPk: false, isNullable: true, length: '-', desc: 'Record timestamp' },
    ],
    sampleData: [
      { id: '1', name: 'Sample Record A', created_at: '2026-07-14 10:00:00' },
      { id: '2', name: 'Sample Record B', created_at: '2026-07-14 10:15:00' },
    ]
  };

  if (!item) return defaults;

  if (item.name.toLowerCase().includes('trade') || item.name.toLowerCase().includes('history')) {
    return {
      s3Path: 's3://fluxo-ingest-bucket/uploads/trade-history/',
      fileSize: '33.6 KB',
      fields: [
        { name: 'id', type: 'UUID', isPk: true, isNullable: false, length: '36', desc: 'Unique trade execution identifier' },
        { name: 'symbol', type: 'VARCHAR', isPk: false, isNullable: false, length: '20', desc: 'Trading symbol (e.g. BALKRISIND)' },
        { name: 'optionType', type: 'VARCHAR', isPk: false, isNullable: false, length: '5', desc: 'Option or Future type (e.g. FUT)' },
        { name: 'side', type: 'VARCHAR', isPk: false, isNullable: false, length: '4', desc: 'Buy or Sell direction' },
        { name: 'quantity', type: 'INTEGER', isPk: false, isNullable: false, length: '-', desc: 'Number of units traded' },
        { name: 'entryPrice', type: 'DECIMAL', isPk: false, isNullable: false, length: '12,2', desc: 'Trade entry price' },
        { name: 'exitPrice', type: 'DECIMAL', isPk: false, isNullable: false, length: '12,2', desc: 'Trade exit price' },
        { name: 'pnl', type: 'DECIMAL', isPk: false, isNullable: false, length: '12,2', desc: 'Net Profit and Loss' },
        { name: 'entryTime', type: 'DATETIME', isPk: false, isNullable: false, length: '-', desc: 'Entry timestamp' },
        { name: 'exitTime', type: 'DATETIME', isPk: false, isNullable: false, length: '-', desc: 'Exit timestamp' },
      ],
      sampleData: [
        {
          "id": "0471b2f0-dc97-45fc-8610-964053fcfb78",
          "symbol": "BALKRISIND",
          "expiry": "2026-05-28",
          "strike": 0,
          "optionType": "FUT",
          "side": "SELL",
          "quantity": 200,
          "entryPrice": 2160.92,
          "exitPrice": 2107.1,
          "pnl": 10764,
          "pnlPct": 2.49,
          "entryTime": "2026-05-12T06:42:04.099Z",
          "exitTime": "2026-05-12T09:42:26.678Z"
        },
        {
          "id": "f72ad5d5-b14d-4de6-b399-d22eee8f98fe",
          "symbol": "ICICIPRULI",
          "expiry": "2026-05-28",
          "strike": 0,
          "optionType": "FUT",
          "side": "SELL",
          "quantity": 1500,
          "entryPrice": 555.92,
          "exitPrice": 541.85,
          "pnl": 21105,
          "pnlPct": 2.53,
          "entryTime": "2026-05-12T06:41:53.447Z",
          "exitTime": "2026-05-12T09:34:49.535Z"
        }
      ]
    };
  }

  if (item.name.toLowerCase().includes('salesforce') || item.connector.toLowerCase().includes('salesforce')) {
    return {
      s3Path: 's3://fluxo-ingest-bucket/salesforce-sync/',
      fileSize: '1.2 MB',
      fields: [
        { name: 'ContactId', type: 'VARCHAR', isPk: true, isNullable: false, length: '18', desc: 'Salesforce unique identifier' },
        { name: 'FirstName', type: 'VARCHAR', isPk: false, isNullable: true, length: '40', desc: 'First name of contact' },
        { name: 'LastName', type: 'VARCHAR', isPk: false, isNullable: false, length: '80', desc: 'Last name of contact' },
        { name: 'Email', type: 'VARCHAR', isPk: false, isNullable: false, length: '120', desc: 'Email address' },
        { name: 'Phone', type: 'VARCHAR', isPk: false, isNullable: true, length: '40', desc: 'Primary phone number' },
      ],
      sampleData: [
        { ContactId: '0038W00001yZabcQAD', FirstName: 'John', LastName: 'Doe', Email: 'john.doe@salesforce.com', Phone: '555-0199' },
        { ContactId: '0038W00001yZxyzQAD', FirstName: 'Jane', LastName: 'Smith', Email: 'jane.smith@acme.com', Phone: '555-0144' },
      ]
    };
  }

  if (item.name.toLowerCase().includes('sap') || item.connector.toLowerCase().includes('sap')) {
    return {
      s3Path: 's3://fluxo-ingest-bucket/sap-invoices/',
      fileSize: '4.8 MB',
      fields: [
        { name: 'InvoiceNum', type: 'VARCHAR', isPk: true, isNullable: false, length: '10', desc: 'SAP Billing document number' },
        { name: 'CompanyCode', type: 'VARCHAR', isPk: false, isNullable: false, length: '4', desc: 'SAP Company organization code' },
        { name: 'PostingDate', type: 'DATE', isPk: false, isNullable: false, length: '-', desc: 'Posting date' },
        { name: 'Amount', type: 'DECIMAL', isPk: false, isNullable: false, length: '15,2', desc: 'Net invoice amount in EUR' },
      ],
      sampleData: [
        { InvoiceNum: '9000123456', CompanyCode: '1000', PostingDate: '2026-07-14', Amount: '12450.00' },
        { InvoiceNum: '9000123457', CompanyCode: '1000', PostingDate: '2026-07-14', Amount: '8920.50' },
      ]
    };
  }

  if (item.name.toLowerCase().includes('csv') || item.connector.toLowerCase().includes('file') || item.type === 'FILE_SYSTEM') {
    return {
      s3Path: 's3://fluxo-ingest-bucket/uploads/',
      fileSize: item.records === '0' ? '0 bytes' : '154 KB',
      fields: [
        { name: 'id', type: 'INTEGER', isPk: true, isNullable: false, length: '11', desc: 'Record index key' },
        { name: 'product_sku', type: 'VARCHAR', isPk: false, isNullable: false, length: '30', desc: 'Product inventory stock keeping unit' },
        { name: 'price', type: 'FLOAT', isPk: false, isNullable: false, length: '-', desc: 'Current sale price' },
        { name: 'quantity', type: 'INTEGER', isPk: false, isNullable: false, length: '6', desc: 'Remaining stock quantity' },
      ],
      sampleData: [
        { id: '1', product_sku: 'PROD-SKU-001', price: '49.99', quantity: '120' },
        { id: '2', product_sku: 'PROD-SKU-002', price: '29.50', quantity: '85' },
      ]
    };
  }

  return defaults;
};

const InterfacePage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [userRole, setUserRole] = useState<'DOMAIN_ADMIN' | 'INTEGRATION_DEVELOPER'>(() => {
    return (localStorage.getItem('df_user_role') as any) || 'DOMAIN_ADMIN';
  });

  // Live API Connection state
  const [isLive, setIsLive] = useState(false);
  const [inputs, setInputs] = useState<any[]>([]);
  const [outputs, setOutputs] = useState<any[]>([]);

  // Selected Interface details state
  const [selectedDetailItem, setSelectedDetailItem] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Registered connectors loaded from local storage
  const [registeredConnectors, setRegisteredConnectors] = useState<any[]>([]);

  // Primary Key mapping configurations
  const [selectedPKs, setSelectedPKs] = useState<Record<string, string>>({});

  // Menu tracking states for actions
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedMenuName, setSelectedMenuName] = useState<string | null>(null);

  // Schedule dialog states
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState('Hourly');

  // Duplicate custom name dialog states
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');
  const [duplicateDescription, setDuplicateDescription] = useState('');
  const [duplicateConnector, setDuplicateConnector] = useState('');
  const [duplicateType, setDuplicateType] = useState('');
  const [duplicateTriggerType, setDuplicateTriggerType] = useState('MANUAL');
  const [duplicateSqlQuery, setDuplicateSqlQuery] = useState('');
  const [duplicateSelectedInputs, setDuplicateSelectedInputs] = useState<string[]>([]);
  const [duplicateExportFormat, setDuplicateExportFormat] = useState('JSON');

  // Edit/Rename existing interface dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Output export configurations
  const [selectedInputIds, setSelectedInputIds] = useState<string[]>([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [exportFormat, setExportFormat] = useState('JSON');

  const formatNextRunDate = (schedule: string, triggerType: string) => {
    if (triggerType !== 'SCHEDULED') return '-';
    const now = new Date();
    if (schedule === 'Hourly') {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    } else if (schedule === 'Daily') {
      now.setDate(now.getDate() + 1);
      now.setHours(9);
      now.setMinutes(0);
    } else if (schedule === 'Weekly') {
      now.setDate(now.getDate() + 7);
      now.setHours(9);
      now.setMinutes(0);
    } else if (schedule === 'Monthly') {
      now.setMonth(now.getMonth() + 1);
      now.setDate(1);
      now.setHours(9);
      now.setMinutes(0);
    } else {
      now.setHours(now.getHours() + 1);
    }
    
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const MM = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${MM}`;
  };

  const handleSelectPrimaryKey = (interfaceId: string, fieldName: string) => {
    setSelectedPKs(prev => ({ ...prev, [interfaceId]: fieldName }));
    setSnackbarMessage(`Primary key configured to "${fieldName}"`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleDeleteInterface = () => {
    if (selectedMenuId) {
      const localData = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
      const updated = localData.filter((i: any) => i.id !== selectedMenuId);
      localStorage.setItem('df_interfaces', JSON.stringify(updated));

      setInputs(prev => prev.filter((i) => i.id !== selectedMenuId));
      setOutputs(prev => prev.filter((i) => i.id !== selectedMenuId));

      setSnackbarMessage(`Interface "${selectedMenuName}" deleted successfully.`);
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }
    setMenuAnchor(null);
    setSelectedMenuId(null);
    setSelectedMenuName(null);
  };

  const handleDuplicateInterface = () => {
    if (selectedMenuId) {
      const localData = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
      const original = localData.find((i: any) => i.id === selectedMenuId) || inputs.find(i => i.id === selectedMenuId) || outputs.find(i => i.id === selectedMenuId);
      if (original) {
        const typePrefix = original.id.split('-')[0] || 'INT';
        const newId = `${typePrefix}-${Math.floor(100 + Math.random() * 900)}`;
        const duplicated = {
          ...original,
          id: newId,
          name: duplicateName.trim() || `Copy of ${original.name}`,
          connector: duplicateConnector,
          type: duplicateType,
          triggerType: duplicateTriggerType,
          schedule: duplicateTriggerType === 'SCHEDULED' ? 'Hourly' : 'Manual',
          status: 'PENDING_APPROVAL',
          lastRun: 'Never',
          records: '0',
          selectedInputs: duplicateSelectedInputs,
          sqlQuery: duplicateSqlQuery,
          exportFormat: duplicateExportFormat,
          schemaConfig: { description: duplicateDescription }
        };
        const updated = [duplicated, ...localData];
        localStorage.setItem('df_interfaces', JSON.stringify(updated));

        // Determine list tab insertion
        const isInput = ['REST_API', 'FILE_SYSTEM', 'CLOUD_STORAGE'].includes(duplicated.type) || tab === 0;
        if (isInput) {
          setInputs([duplicated, ...inputs]);
        } else {
          setOutputs([duplicated, ...outputs]);
        }

        setSnackbarMessage(`Duplicated interface to "${duplicated.name}" (Awaiting Approval).`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    }
    setDuplicateDialogOpen(false);
    setSelectedMenuId(null);
    setSelectedMenuName(null);
  };

  const handleSaveSchedule = () => {
    if (selectedMenuId) {
      const localData = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
      const updated = localData.map((item: any) =>
        item.id === selectedMenuId
          ? { ...item, triggerType: 'SCHEDULED', schedule: selectedSchedule }
          : item
      );
      localStorage.setItem('df_interfaces', JSON.stringify(updated));

      const updateItemSchedule = (list: any[]) =>
        list.map((item) => (item.id === selectedMenuId ? { ...item, triggerType: 'SCHEDULED', schedule: selectedSchedule } : item));
      setInputs(prev => updateItemSchedule(prev));
      setOutputs(prev => updateItemSchedule(prev));

      setSnackbarMessage(`Configured schedule for "${selectedMenuName}" to ${selectedSchedule}.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    setScheduleDialogOpen(false);
    setSelectedMenuId(null);
    setSelectedMenuName(null);
  };

  const handleUpdateInterface = () => {
    if (selectedMenuId) {
      const localData = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
      const updated = localData.map((item: any) =>
        item.id === selectedMenuId
          ? { ...item, name: editName, schemaConfig: { ...item.schemaConfig, description: editDesc } }
          : item
      );
      localStorage.setItem('df_interfaces', JSON.stringify(updated));

      const updateStateList = (list: any[]) =>
        list.map((item) => (item.id === selectedMenuId ? { ...item, name: editName, schemaConfig: { ...item.schemaConfig, description: editDesc } } : item));
      setInputs(prev => updateStateList(prev));
      setOutputs(prev => updateStateList(prev));

      setSnackbarMessage(`Interface renamed to "${editName}"`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    setEditDialogOpen(false);
    setSelectedMenuId(null);
  };

  // Execution states for Run button spinner & Download button visibility
  const [runningId, setRunningId] = useState<string | null>(null);
  const [justExecutedIds, setJustExecutedIds] = useState<Record<string, boolean>>({});

  // Dynamic live connector data states
  const [liveSchemaFields, setLiveSchemaFields] = useState<any[] | null>(null);
  const [liveSampleData, setLiveSampleData] = useState<any[] | null>(null);
  const [liveFullData, setLiveFullData] = useState<any[] | null>(null);

  React.useEffect(() => {
    if (!selectedDetailItem) {
      setLiveSchemaFields(null);
      setLiveSampleData(null);
      setLiveFullData(null);
      return;
    }

    const isOutput = selectedDetailItem.id.startsWith('OUT-') || !['REST_API', 'FILE_SYSTEM', 'CLOUD_STORAGE'].includes(selectedDetailItem.type);

    if (isOutput) {
      // Compile combined/merged data from selected input interfaces!
      let combinedData: any[] = [];
      const selectedInputs = selectedDetailItem.selectedInputs || [];

      if (selectedInputs.length > 0) {
        for (const inputId of selectedInputs) {
          const inpItem = inputs.find(i => i.id === inputId);
          if (inpItem) {
            const details = getInterfaceDetails(inpItem);
            combinedData = [
              ...combinedData,
              ...details.sampleData.map((row: any) => ({ ...row, source_input_name: inpItem.name }))
            ];
          }
        }
      }

      if (combinedData.length === 0) {
        // Fallback default mock output if no inputs selected
        combinedData = [
          { txn_id: 'TXN-001', department: 'Sales', volume: 1450, code: 'SALES_DEPT', processed_at: new Date().toLocaleDateString() },
          { txn_id: 'TXN-002', department: 'Finance', volume: 9800, code: 'FINANCE_DEPT', processed_at: new Date().toLocaleDateString() },
          { txn_id: 'TXN-003', department: 'IT Ops', volume: 24500, code: 'IT_OPS', processed_at: new Date().toLocaleDateString() },
        ];
      }

      const firstRecord = combinedData[0] || {};
      const generatedFields = Object.keys(firstRecord).map((key, idx) => ({
        name: key,
        type: typeof firstRecord[key] === 'number' ? 'INTEGER' : 'VARCHAR',
        isPk: idx === 0,
        isNullable: true,
        length: '-',
        desc: `Pipeline compiled data field`
      }));

      setLiveSampleData(combinedData.slice(0, 10));
      setLiveFullData(combinedData);
      setLiveSchemaFields(generatedFields);
      return;
    }

    const localConns = JSON.parse(localStorage.getItem('df_connectors') || '[]');
    const connectorObj = localConns.find((c: any) => c.name === selectedDetailItem.connector);
    let url = connectorObj?.hostUrl || '';

    // Auto-detect Beeceptor or mock-todos URLs inside interface name/connector configurations
    if (!url && selectedDetailItem.name.toLowerCase().includes('api') && selectedDetailItem.connector.toLowerCase().includes('api')) {
      url = 'https://dummy-json.mock.beeceptor.com/todos';
    }

    if (url && url.startsWith('http')) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const dataArray = Array.isArray(data) ? data : (data.todos || data.data || [data]);
          const sample = dataArray.slice(0, 10); // Take up to 10 rows for display preview
          const firstRecord = dataArray[0] || {};
          const generatedFields = Object.keys(firstRecord).map((key, idx) => ({
            name: key,
            type: typeof firstRecord[key] === 'number' ? 'INTEGER' : typeof firstRecord[key] === 'boolean' ? 'BOOLEAN' : 'VARCHAR',
            isPk: key.toLowerCase() === 'id' || idx === 0,
            isNullable: true,
            length: typeof firstRecord[key] === 'number' ? '-' : '255',
            desc: `Live field ingested from remote API node`
          }));
          setLiveSampleData(sample);
          setLiveFullData(dataArray); // Save the entire list (e.g. all 20 records) for the file download!
          setLiveSchemaFields(generatedFields);
        })
        .catch((err) => {
          console.warn('Failed to fetch from live connector URL:', err);
          setLiveSchemaFields(null);
          setLiveSampleData(null);
          setLiveFullData(null);
        });
    }
  }, [selectedDetailItem]);

  const handleDownloadIngestedData = (item: any) => {
    const dataToDownload = liveFullData || getInterfaceDetails(item).sampleData;
    const format = item.exportFormat || 'JSON';
    
    let blob: Blob;
    let filename: string;

    if (format === 'CSV') {
      const headers = Object.keys(dataToDownload[0] || {});
      const csvRows = [
        headers.join(','),
        ...dataToDownload.map(row => headers.map(fieldName => JSON.stringify(row[fieldName] || '')).join(','))
      ];
      blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      filename = `${item.name.toLowerCase().replace(/\s+/g, '-')}-data.csv`;
    } else if (format === 'TXT') {
      const headers = Object.keys(dataToDownload[0] || {});
      const txtRows = [
        headers.join('\t'),
        ...dataToDownload.map(row => headers.map(fieldName => String(row[fieldName] || '')).join('\t'))
      ];
      blob = new Blob([txtRows.join('\n')], { type: 'text/plain;charset=utf-8;' });
      filename = `${item.name.toLowerCase().replace(/\s+/g, '-')}-data.txt`;
    } else {
      blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
      filename = `${item.name.toLowerCase().replace(/\s+/g, '-')}-data.json`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbarMessage(`Downloaded ${item.name} processed data as ${format} (${dataToDownload.length} records).`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Form Fields States
  const [name, setName] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [connector, setConnector] = useState('');
  const [triggerType, setTriggerType] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Feedback State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Live Interfaces on Mount
  const fetchInterfaces = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/v1/interfaces', {
        headers: {
          'x-tenant-id': 'TEN-001',
        },
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        const rawData = resData.data || [];
        // Sort into inputs/outputs by triggerType or type criteria
        const liveInputs = rawData.filter((item: any) =>
          ['REST_API', 'FILE_SYSTEM', 'CLOUD_STORAGE'].includes(item.type)
        ).map((item: any) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          connector: item.connectorId || 'REST API',
          status: item.status || 'ACTIVE',
          triggerType: item.triggerType || 'MANUAL',
          schedule: item.triggerType === 'SCHEDULED' ? 'Hourly' : 'Manual',
          lastRun: 'Never',
          records: '0',
        }));

        const liveOutputs = rawData.filter((item: any) =>
          !['REST_API', 'FILE_SYSTEM', 'CLOUD_STORAGE'].includes(item.type)
        ).map((item: any) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          connector: item.connectorId || 'Database Store',
          status: item.status || 'ACTIVE',
          triggerType: item.triggerType || 'MANUAL',
          schedule: item.triggerType === 'SCHEDULED' ? 'Daily' : 'Manual',
          lastRun: 'Never',
          records: '0',
        }));

        setInputs(liveInputs);
        setOutputs(liveOutputs);
        setIsLive(true);
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.warn('Interface Service API offline. Falling back to local storage session data.');
      const localData = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
      const localInputs = localData.filter((item: any) =>
        ['REST_API', 'FILE_SYSTEM', 'CLOUD_STORAGE'].includes(item.type)
      );
      const localOutputs = localData.filter((item: any) =>
        !['REST_API', 'FILE_SYSTEM', 'CLOUD_STORAGE'].includes(item.type)
      );
      setInputs(localInputs);
      setOutputs(localOutputs);
      setIsLive(false);
    }
  };

  React.useEffect(() => {
    fetchInterfaces();
    const localConnectors = JSON.parse(localStorage.getItem('df_connectors') || '[]');
    setRegisteredConnectors(localConnectors);
  }, []);

  React.useEffect(() => {
    if (createOpen) {
      const localConnectors = JSON.parse(localStorage.getItem('df_connectors') || '[]');
      setRegisteredConnectors(localConnectors);
    }
  }, [createOpen]);

  const data = tab === 0 ? inputs : outputs;
  const filtered = data.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.connector.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setName(file.name.replace(/\.[^/.]+$/, "")); // Strip extension for interface name
      setSourceType('FILE_SYSTEM');
      setConnector('Local File');
      setTriggerType('MANUAL');
      setUploadedFile(file);
      setSnackbarMessage(`File "${file.name}" ready to ingest.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setName(file.name.replace(/\.[^/.]+$/, ""));
      setSourceType('FILE_SYSTEM');
      setConnector('Local File');
      setTriggerType('MANUAL');
      setUploadedFile(file);
      setSnackbarMessage(`File "${file.name}" ready to ingest.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setSnackbarMessage('Interface name is required');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const isOutputTab = tab === 1;
    const finalType = isOutputTab 
      ? (sourceType || 'INPUT_INTERFACES') 
      : (sourceType || 'REST_API');

    const finalConnector = isOutputTab 
      ? (sourceType === 'QUERY_BUILDER' ? 'SQL Query Engine' : 'Input Aggregator')
      : (connector || 'REST API');

    const payload = {
      name,
      type: finalType,
      connectorId: finalConnector,
      triggerType: triggerType || 'MANUAL',
      scheduleConfig: {},
      schemaConfig: { 
        description,
        sqlQuery: isOutputTab ? sqlQuery : undefined,
        selectedInputs: isOutputTab ? selectedInputIds : undefined,
        exportFormat: isOutputTab ? exportFormat : undefined
      },
    };

    try {
      // 1. Post to live API if reachable
      const response = await fetch('http://localhost:3005/api/v1/interfaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': 'TEN-001',
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setSnackbarMessage(`Interface "${name}" created successfully in live database!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchInterfaces();
      } else {
        throw new Error('API creation failed');
      }
    } catch (err) {
      // 2. Local Fallback simulation with localStorage persistence
      console.warn('API Offline. Simulating creation locally.');
      const newId = `${tab === 0 ? 'INT' : 'OUT'}-${String(Math.floor(100 + Math.random() * 900))}`;
      const newItem = {
        id: newId,
        name: name,
        type: payload.type,
        connector: payload.connectorId,
        status: 'PENDING_APPROVAL',
        triggerType: payload.triggerType,
        schedule: triggerType === 'SCHEDULED' ? 'Hourly' : 'Manual',
        lastRun: 'Never',
        records: '0',
        icon: tab === 0 ? (sourceType === 'FILE_SYSTEM' ? '📄' : '☁️') : '🏢',
        selectedInputs: payload.schemaConfig.selectedInputs,
        sqlQuery: payload.schemaConfig.sqlQuery,
        exportFormat: payload.schemaConfig.exportFormat,
        schemaConfig: { description }
      };

      const localData = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
      const updated = [newItem, ...localData];
      localStorage.setItem('df_interfaces', JSON.stringify(updated));

      if (tab === 0) {
        setInputs([newItem, ...inputs]);
      } else {
        setOutputs([newItem, ...outputs]);
      }

      setSnackbarMessage(`Interface "${name}" created (Pending Admin Approval).`);
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }

    setCreateOpen(false);
    
    // Reset fields
    setName('');
    setSourceType('');
    setConnector('');
    setTriggerType('');
    setDescription('');
    setUploadedFile(null);
    setSelectedInputIds([]);
    setSqlQuery('');
    setExportFormat('JSON');
  };
  const handleRunInterface = async (id: string, name: string) => {
    // Set executing state for spinner
    setRunningId(id);

    // 1. Show toast feedback
    setSnackbarMessage(`Job execution started for "${name}" (${id})`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);

    let recordCount = 12; // default fallback

    try {
      // Find the interface details to check connector configuration
      const localInterfaces = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
      const item = localInterfaces.find((i: any) => i.id === id) || inputs.find(i => i.id === id) || outputs.find(i => i.id === id);

      if (item) {
        // Find the connector linked to this interface
        const localConns = JSON.parse(localStorage.getItem('df_connectors') || '[]');
        const connectorObj = localConns.find((c: any) => c.name === item.connector);
        let url = connectorObj?.hostUrl || '';

        // Auto-detect Beeceptor endpoints if connector type lacks a custom hostUrl
        if (!url && item.name.toLowerCase().includes('api') && item.connector.toLowerCase().includes('api')) {
          url = 'https://dummy-json.mock.beeceptor.com/todos';
        }

        if (url && url.startsWith('http')) {
          const res = await fetch(url);
          const data = await res.json();
          const dataArray = Array.isArray(data) ? data : (data.todos || data.data || [data]);
          recordCount = dataArray.length;
        } else if (item.name.toLowerCase().includes('trade') || item.name.toLowerCase().includes('history')) {
          recordCount = 20; // Exact count for trade history json file
        }
      }
    } catch (err) {
      console.warn('Could not fetch dynamic record count during run, falling back:', err);
    }

    setTimeout(() => {
      // 2. Write a real-time completed job run to localStorage so it displays in Job History
      const newJob = {
        id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
        interface: name,
        workflow: 'Ad-hoc Ingestion Pipeline',
        status: 'COMPLETED',
        trigger: 'MANUAL',
        recordsProcessed: recordCount,
        recordsFailed: 0,
        duration: `${(2 + Math.random() * 5).toFixed(1)}s`,
        startedAt: new Date().toLocaleString(),
        completedAt: new Date().toLocaleString(),
      };

      const localJobs = JSON.parse(localStorage.getItem('df_jobs') || '[]');
      localStorage.setItem('df_jobs', JSON.stringify([newJob, ...localJobs]));

      // 3. Mark as just executed during this session
      setJustExecutedIds(prev => ({ ...prev, [id]: true }));
      setRunningId(null);

      // 4. Update the interfaces list 'lastRun' field and 'records' count in state and localStorage
      const runTime = new Date();
      const yyyy = runTime.getFullYear();
      const mm = String(runTime.getMonth() + 1).padStart(2, '0');
      const dd = String(runTime.getDate()).padStart(2, '0');
      const hh = String(runTime.getHours()).padStart(2, '0');
      const MM = String(runTime.getMinutes()).padStart(2, '0');
      const exactTimestamp = `${yyyy}-${mm}-${dd} ${hh}:${MM}`;

      const updateInterfaceRecords = (list: any[]) =>
        list.map((item) => (item.id === id ? { ...item, lastRun: exactTimestamp, records: String(recordCount) } : item));
      setInputs(prev => updateInterfaceRecords(prev));
      setOutputs(prev => updateInterfaceRecords(prev));

      const localInterfaces = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
      const updatedInterfaces = localInterfaces.map((item: any) =>
        item.id === id ? { ...item, lastRun: exactTimestamp, records: String(recordCount) } : item
      );
      localStorage.setItem('df_interfaces', JSON.stringify(updatedInterfaces));

      setSnackbarMessage(`Pipeline execution completed for "${name}"!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 1500);
  };

  const handleApproveStatus = (id: string, newStatus: 'ACTIVE' | 'REJECTED') => {
    const updateList = (list: any[]) =>
      list.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    
    setInputs(prev => updateList(prev));
    setOutputs(prev => updateList(prev));

    const localInterfaces = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
    const updatedInterfaces = localInterfaces.map((item: any) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    localStorage.setItem('df_interfaces', JSON.stringify(updatedInterfaces));

    if (selectedDetailItem && selectedDetailItem.id === id) {
      setSelectedDetailItem({ ...selectedDetailItem, status: newStatus });
    }

    setSnackbarMessage(
      newStatus === 'ACTIVE'
        ? `Interface approved successfully! It is now active.`
        : `Interface has been rejected.`
    );
    setSnackbarSeverity(newStatus === 'ACTIVE' ? 'success' : 'info');
    setSnackbarOpen(true);
  };

  return (
    <Box>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".csv,.xls,.xlsx,.json,.xml,.txt,.pdf"
      />

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Interfaces
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage data ingestion and export interfaces
          </Typography>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Simulate Role:
            </Typography>
            <Chip
              label="Domain Admin"
              size="small"
              onClick={() => {
                setUserRole('DOMAIN_ADMIN');
                localStorage.setItem('df_user_role', 'DOMAIN_ADMIN');
              }}
              color={userRole === 'DOMAIN_ADMIN' ? 'primary' : 'default'}
              variant={userRole === 'DOMAIN_ADMIN' ? 'filled' : 'outlined'}
              sx={{ fontSize: '0.7rem', fontWeight: 700 }}
            />
            <Chip
              label="Integration Developer"
              size="small"
              onClick={() => {
                setUserRole('INTEGRATION_DEVELOPER');
                localStorage.setItem('df_user_role', 'INTEGRATION_DEVELOPER');
              }}
              color={userRole === 'INTEGRATION_DEVELOPER' ? 'primary' : 'default'}
              variant={userRole === 'INTEGRATION_DEVELOPER' ? 'filled' : 'outlined'}
              sx={{ fontSize: '0.7rem', fontWeight: 700 }}
            />
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => setCreateOpen(true)}
          sx={{ px: 3 }}
        >
          Create Interface
        </Button>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 56,
            },
          }}
        >
          <Tab
            icon={<InputOutlined sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Input Interface
                <Chip label={inputs.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </Box>
            }
          />
          <Tab
            icon={<OutputOutlined sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Output Interface
                <Chip label={outputs.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </Box>
            }
          />
        </Tabs>

        <CardContent sx={{ p: 2.5 }}>
          {/* Search & Filter Bar */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
            <TextField
              size="small"
              placeholder="Search interfaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" startIcon={<FilterListOutlined />} size="small">
              Filters
            </Button>
            <Button variant="outlined" startIcon={<RefreshOutlined />} size="small">
              Refresh
            </Button>
          </Box>

          {/* Interface Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Interface</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Connector</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Trigger</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Next Scheduled Job</TableCell>
                  <TableCell>Records</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      No interfaces found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      onClick={() => {
                        setSelectedDetailItem(item);
                        setDetailOpen(true);
                      }}
                      sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                              fontSize: '1.1rem',
                              bgcolor: alpha(brand.primary, 0.1),
                            }}
                          >
                            {item.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {item.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {item.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={typeIcons[item.type]}
                          label={item.type.replace(/_/g, ' ')}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.72rem', '& .MuiChip-icon': { fontSize: 14 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {item.connector}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            bgcolor: alpha(statusColors[item.status] || '#64748B', 0.1),
                            color: statusColors[item.status] || '#64748B',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScheduleOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption">{item.schedule}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                          {item.lastRun}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {formatNextRunDate(item.schedule, item.triggerType)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {item.records}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title={item.status === 'PENDING_APPROVAL' ? "Pending Admin Approval" : item.status === 'REJECTED' ? "Rejected" : "Execute"}>
                            <span>
                              <IconButton
                                size="small"
                                disabled={item.status === 'PENDING_APPROVAL' || item.status === 'REJECTED'}
                                sx={{ color: brand.success }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRunInterface(item.id, item.name);
                                }}
                              >
                                <PlayArrowOutlined fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDetailItem(item);
                                setDetailOpen(true);
                              }}
                            >
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                           <Tooltip title="Edit">
                             <IconButton
                               size="small"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setSelectedMenuId(item.id);
                                 setEditName(item.name);
                                 setEditDesc(item.schemaConfig?.description || '');
                                 setEditDialogOpen(true);
                               }}
                             >
                               <EditOutlined fontSize="small" />
                             </IconButton>
                           </Tooltip>
                          <Tooltip title="More">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMenuId(item.id);
                                setSelectedMenuName(item.name);
                                setMenuAnchor(e.currentTarget);
                              }}
                            >
                              <MoreVertOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedMenuId(null);
          setSelectedMenuName(null);
        }}
        slotProps={{ paper: { sx: { width: 180, borderRadius: '12px' } } }}
      >
        <MenuItem onClick={() => {
          if (selectedMenuId) {
            const localData = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
            const original = localData.find((i: any) => i.id === selectedMenuId) || inputs.find(i => i.id === selectedMenuId) || outputs.find(i => i.id === selectedMenuId);
            if (original) {
              setDuplicateName(`Copy of ${original.name}`);
              setDuplicateDescription(original.description || original.schemaConfig?.description || '');
              setDuplicateConnector(original.connector || '');
              setDuplicateType(original.type || '');
              setDuplicateTriggerType(original.triggerType || 'MANUAL');
              setDuplicateSqlQuery(original.sqlQuery || '');
              setDuplicateSelectedInputs(original.selectedInputs || []);
              setDuplicateExportFormat(original.exportFormat || 'JSON');
            }
          }
          setMenuAnchor(null);
          setDuplicateDialogOpen(true);
        }}>
          <ContentCopyOutlined sx={{ mr: 1.5, fontSize: 18 }} /> Duplicate
        </MenuItem>
        <MenuItem onClick={() => { setMenuAnchor(null); setScheduleDialogOpen(true); }}>
          <ScheduleOutlined sx={{ mr: 1.5, fontSize: 18 }} /> Schedule
        </MenuItem>
        <MenuItem onClick={handleDeleteInterface} sx={{ color: 'error.main' }}>
          <DeleteOutlined sx={{ mr: 1.5, fontSize: 18 }} /> Delete
        </MenuItem>
      </Menu>
      {/* Edit Interface Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedMenuId(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Edit Interface Details
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Interface Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Rename your interface"
            />
            <TextField
              fullWidth
              label="Description"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Edit description"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => {
            setEditDialogOpen(false);
            setSelectedMenuId(null);
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateInterface}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Duplicate Interface Dialog */}
      <Dialog
        open={duplicateDialogOpen}
        onClose={() => {
          setDuplicateDialogOpen(false);
          setSelectedMenuId(null);
          setSelectedMenuName(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Duplicate Interface
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Interface Name"
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                placeholder="e.g. Copy of Interface"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={duplicateDescription}
                onChange={(e) => setDuplicateDescription(e.target.value)}
              />
            </Grid>

            {/* Check if it is an Output interface based on selectedMenuId split */}
            {selectedMenuId && selectedMenuId.startsWith('OUT') ? (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Source Mode</InputLabel>
                    <Select
                      label="Source Mode"
                      value={duplicateType || 'INPUT_INTERFACES'}
                      onChange={(e) => {
                        setDuplicateType(e.target.value);
                        if (e.target.value === 'QUERY_BUILDER') {
                          setDuplicateSelectedInputs([]);
                        } else {
                          setDuplicateSqlQuery('');
                        }
                      }}
                    >
                      <MenuItem value="INPUT_INTERFACES">Input Interface Sources</MenuItem>
                      <MenuItem value="QUERY_BUILDER">SQL Query Builder</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Export Format</InputLabel>
                    <Select
                      label="Export Format"
                      value={duplicateExportFormat}
                      onChange={(e) => setDuplicateExportFormat(e.target.value)}
                    >
                      <MenuItem value="JSON">JSON (.json)</MenuItem>
                      <MenuItem value="CSV">CSV (.csv)</MenuItem>
                      <MenuItem value="TXT">Text (.txt)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {duplicateType === 'QUERY_BUILDER' ? (
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="SQL Custom Query Builder"
                      value={duplicateSqlQuery}
                      onChange={(e) => setDuplicateSqlQuery(e.target.value)}
                    />
                  </Grid>
                ) : (
                  <Grid size={12}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
                      Select Input Interfaces to Aggregate / Process:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 150, overflowY: 'auto', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                      {inputs.map((inp) => (
                        <FormControlLabel
                          key={inp.id}
                          control={
                            <Checkbox
                              checked={duplicateSelectedInputs.includes(inp.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDuplicateSelectedInputs([...duplicateSelectedInputs, inp.id]);
                                } else {
                                  setDuplicateSelectedInputs(duplicateSelectedInputs.filter((id) => id !== inp.id));
                                }
                              }}
                            />
                          }
                          label={`${inp.name} (${inp.connector})`}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </>
            ) : (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Source Type</InputLabel>
                    <Select
                      label="Source Type"
                      value={duplicateType}
                      onChange={(e) => setDuplicateType(e.target.value)}
                    >
                      <MenuItem value="REST_API">REST API</MenuItem>
                      <MenuItem value="DATABASE">Database</MenuItem>
                      <MenuItem value="FILE_SYSTEM">File Upload</MenuItem>
                      <MenuItem value="CLOUD_STORAGE">Cloud Storage</MenuItem>
                      <MenuItem value="ENTERPRISE_APP">Enterprise App</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Connector</InputLabel>
                    <Select
                      label="Connector"
                      value={duplicateConnector}
                      onChange={(e) => setDuplicateConnector(e.target.value)}
                    >
                      {(() => {
                        const filteredConns = registeredConnectors.filter((c) => {
                          if (duplicateType === 'REST_API') return c.type === 'REST_API' || c.type === 'ENTERPRISE_APP';
                          if (duplicateType === 'DATABASE') return c.type === 'DATABASE';
                          if (duplicateType === 'CLOUD_STORAGE') return c.type === 'CLOUD_STORAGE';
                          if (duplicateType === 'FILE_SYSTEM') return c.type === 'FILE_SYSTEM';
                          return true;
                        });
                        if (filteredConns.length === 0) {
                          if (duplicateType === 'REST_API') {
                            return [
                              <MenuItem key="rest" value="REST API">Default REST API</MenuItem>,
                              <MenuItem key="sf" value="Salesforce">Salesforce</MenuItem>,
                              <MenuItem key="sap" value="SAP">SAP</MenuItem>
                            ];
                          }
                          if (duplicateType === 'DATABASE') {
                            return <MenuItem key="pg" value="PostgreSQL">Default PostgreSQL</MenuItem>;
                          }
                          if (duplicateType === 'CLOUD_STORAGE') {
                            return <MenuItem key="s3" value="AWS S3">Default AWS S3</MenuItem>;
                          }
                          if (duplicateType === 'FILE_SYSTEM') {
                            return <MenuItem key="local" value="Local File">Local File Storage</MenuItem>;
                          }
                          return <MenuItem key="gen" value="General Connector">General Connector</MenuItem>;
                        }
                        return filteredConns.map((c) => (
                          <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                        ));
                      })()}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Trigger Type</InputLabel>
                <Select
                  label="Trigger Type"
                  value={duplicateTriggerType}
                  onChange={(e) => setDuplicateTriggerType(e.target.value)}
                >
                  <MenuItem value="MANUAL">Manual Trigger</MenuItem>
                  <MenuItem value="SCHEDULED">Scheduled Interval</MenuItem>
                  <MenuItem value="EVENT_BASED">Event-based Real-time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => {
            setDuplicateDialogOpen(false);
            setSelectedMenuId(null);
            setSelectedMenuName(null);
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDuplicateInterface}>
            Duplicate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Interface Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={() => {
          setScheduleDialogOpen(false);
          setSelectedMenuId(null);
          setSelectedMenuName(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Schedule Interface: {selectedMenuName}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Schedule Interval</InputLabel>
              <Select
                label="Schedule Interval"
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
              >
                <MenuItem value="Hourly">Hourly</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => {
            setScheduleDialogOpen(false);
            setSelectedMenuId(null);
            setSelectedMenuName(null);
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveSchedule}>
            Save Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Interface Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Create New {tab === 0 ? 'Input' : 'Output'} Interface
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Interface Name"
                placeholder={tab === 0 ? "e.g., Salesforce Contact Sync" : "e.g., Finance Reconciliation Export"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            {tab === 0 ? (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Source Type</InputLabel>
                    <Select
                      label="Source Type"
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value)}
                    >
                      <MenuItem value="REST_API">REST API</MenuItem>
                      <MenuItem value="DATABASE">Database</MenuItem>
                      <MenuItem value="FILE_SYSTEM">File Upload</MenuItem>
                      <MenuItem value="CLOUD_STORAGE">Cloud Storage</MenuItem>
                      <MenuItem value="ENTERPRISE_APP">Enterprise App</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Connector</InputLabel>
                    <Select
                      label="Connector"
                      value={connector}
                      onChange={(e) => setConnector(e.target.value)}
                    >
                      {(() => {
                        const filteredConns = registeredConnectors.filter((c) => {
                          if (sourceType === 'REST_API') return c.type === 'REST_API' || c.type === 'ENTERPRISE_APP';
                          if (sourceType === 'DATABASE') return c.type === 'DATABASE';
                          if (sourceType === 'CLOUD_STORAGE') return c.type === 'CLOUD_STORAGE';
                          if (sourceType === 'FILE_SYSTEM') return c.type === 'FILE_SYSTEM';
                          return true;
                        });
                        if (filteredConns.length === 0) {
                          if (sourceType === 'REST_API') {
                            return [
                              <MenuItem key="rest-api" value="REST API">Default REST API</MenuItem>,
                              <MenuItem key="sf" value="Salesforce">Salesforce</MenuItem>,
                              <MenuItem key="sap" value="SAP">SAP</MenuItem>
                            ];
                          }
                          if (sourceType === 'DATABASE') {
                            return <MenuItem key="pg" value="PostgreSQL">Default PostgreSQL</MenuItem>;
                          }
                          if (sourceType === 'CLOUD_STORAGE') {
                            return <MenuItem key="s3" value="AWS S3">Default AWS S3</MenuItem>;
                          }
                          if (sourceType === 'FILE_SYSTEM') {
                            return <MenuItem key="local" value="Local File">Local File Storage</MenuItem>;
                          }
                          return <MenuItem key="gen" value="General Connector">General Connector</MenuItem>;
                        }
                        return filteredConns.map((c) => (
                          <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                        ));
                      })()}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            ) : (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Source Mode</InputLabel>
                    <Select
                      label="Source Mode"
                      value={sourceType || 'INPUT_INTERFACES'}
                      onChange={(e) => {
                        setSourceType(e.target.value);
                        if (e.target.value === 'QUERY_BUILDER') {
                          setSelectedInputIds([]);
                        } else {
                          setSqlQuery('');
                        }
                      }}
                    >
                      <MenuItem value="INPUT_INTERFACES">Input Interface Sources</MenuItem>
                      <MenuItem value="QUERY_BUILDER">SQL Query Builder</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Export Format</InputLabel>
                    <Select
                      label="Export Format"
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                    >
                      <MenuItem value="JSON">JSON (.json)</MenuItem>
                      <MenuItem value="CSV">CSV (.csv)</MenuItem>
                      <MenuItem value="TXT">Text (.txt)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {sourceType === 'QUERY_BUILDER' ? (
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="SQL Custom Query Builder"
                      placeholder="SELECT * FROM trade_history JOIN api_data ON trade_history.id = api_data.id"
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                    />
                  </Grid>
                ) : (
                  <Grid size={12}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
                      Select Input Interfaces to Aggregate / Process:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 150, overflowY: 'auto', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                      {inputs.map((inp) => (
                        <FormControlLabel
                          key={inp.id}
                          control={
                            <Checkbox
                              checked={selectedInputIds.includes(inp.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedInputIds([...selectedInputIds, inp.id]);
                                } else {
                                  setSelectedInputIds(selectedInputIds.filter(id => id !== inp.id));
                                }
                              }}
                            />
                          }
                          label={`${inp.name} (${inp.id})`}
                          sx={{ '& .MuiTypography-root': { fontSize: '0.8rem' } }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </>
            )}

            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Trigger Type</InputLabel>
                <Select
                  label="Trigger Type"
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value)}
                >
                  <MenuItem value="MANUAL">Manual</MenuItem>
                  <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                  <MenuItem value="EVENT_BASED">Event-Based</MenuItem>
                  <MenuItem value="REAL_TIME">Real-Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            {/* File Upload Area */}
            {tab === 0 && sourceType === 'FILE_SYSTEM' && (
              <Grid size={12}>
                <Box
                  onClick={handleFileClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  sx={{
                    border: '2px dashed',
                    borderColor: uploadedFile ? brand.success : 'divider',
                    borderRadius: '16px',
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: uploadedFile ? alpha(brand.success, 0.04) : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: uploadedFile ? brand.success : brand.primary,
                      bgcolor: uploadedFile ? alpha(brand.success, 0.06) : alpha(brand.primary, 0.04),
                    },
                  }}
                >
                  <CloudUploadOutlined sx={{ fontSize: 40, color: uploadedFile ? brand.success : 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {uploadedFile ? `File Selected: ${uploadedFile.name}` : 'Drag & drop files here, or click to browse'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {uploadedFile ? `(${(uploadedFile.size / 1024).toFixed(1)} KB)` : 'Supports CSV, XLS, XLSX, JSON, XML, TXT, PDF (Max 100MB)'}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create Interface
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Interface Detail Drawer */}
      <Drawer
        anchor="right"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        PaperProps={{
          sx: {
            width: 620,
            maxWidth: '100vw',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            borderLeft: '1px solid',
            borderColor: 'divider',
            p: 4,
            boxShadow: `-12px 0 40px ${alpha('#000', 0.5)}`,
            overflowX: 'hidden',
          },
        }}
      >
        {selectedDetailItem && (() => {
          const details = getInterfaceDetails(selectedDetailItem);
          const activeFields = liveSchemaFields || details.fields;
          const activeSample = liveSampleData || details.sampleData;
          const isOutput = selectedDetailItem.id.startsWith('OUT-') || !['REST_API', 'FILE_SYSTEM', 'CLOUD_STORAGE'].includes(selectedDetailItem.type);
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowX: 'hidden' }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {selectedDetailItem.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                    ID: {selectedDetailItem.id}
                  </Typography>
                </Box>
                <Chip
                  label={selectedDetailItem.status}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    bgcolor: alpha(statusColors[selectedDetailItem.status] || '#64748B', 0.1),
                    color: statusColors[selectedDetailItem.status] || '#64748B',
                  }}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Metadata Details */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                General Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Connector</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedDetailItem.connector}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Trigger Type</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedDetailItem.triggerType}</Typography>
                </Grid>
                {isOutput ? (
                  <>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Pipeline Mode</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedDetailItem.type === 'QUERY_BUILDER' ? 'SQL Query Builder' : 'Input Interfaces'}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Export Format</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brand.success }}>
                        {selectedDetailItem.exportFormat || 'JSON'}
                      </Typography>
                    </Grid>
                    {selectedDetailItem.type === 'QUERY_BUILDER' ? (
                      <Grid size={12}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Custom SQL Query</Typography>
                        <Box sx={{ p: 1.5, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.75rem', color: brand.accent, mt: 0.5, whiteSpace: 'pre-wrap' }}>
                          {selectedDetailItem.sqlQuery || 'SELECT * FROM ...'}
                        </Box>
                      </Grid>
                    ) : (
                      <Grid size={12}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Aggregate Input Sources</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                          {(selectedDetailItem.selectedInputs || []).map((id: string) => {
                            const match = inputs.find(i => i.id === id);
                            return (
                              <Chip key={id} label={match ? match.name : id} size="small" variant="outlined" />
                            );
                          })}
                          {(!selectedDetailItem.selectedInputs || selectedDetailItem.selectedInputs.length === 0) && (
                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', fontSize: '0.8rem' }}>
                              No inputs selected (Default mock output used)
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>S3 Bucket Location</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.75rem', color: brand.primary }}>
                        {details.s3Path}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Estimated File Size</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{details.fileSize}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Fields / Schema Table */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                Source Schema Details (Fields & Types)
              </Typography>
              <TableContainer sx={{ mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: '12px', width: 556, maxWidth: 556, overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>Field</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>Type</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>Key</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>Length</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(() => {
                      const activePkName = selectedPKs[selectedDetailItem.id] || activeFields.find(field => field.isPk)?.name;
                      return activeFields.map((f: any) => (
                        <TableRow key={f.name}>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{f.name}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>{f.desc}</Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Chip label={f.type} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Radio
                              checked={f.name === activePkName}
                              onChange={() => handleSelectPrimaryKey(selectedDetailItem.id, f.name)}
                              size="small"
                              sx={{ p: 0 }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>{f.length}</TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Sample Data Preview */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                Sample Ingestion Rows Preview
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  maxHeight: 250,
                  width: 556,
                  maxWidth: 556,
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  bgcolor: (theme) => alpha(theme.palette.background.default, 0.4),
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {Object.keys(activeSample[0] || {}).map((key) => (
                        <TableCell key={key} sx={{ fontSize: '0.72rem', py: 1, fontWeight: 700, whiteSpace: 'nowrap', bgcolor: 'action.hover' }}>
                          {key}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeSample.map((row: any, idx: number) => (
                      <TableRow key={idx} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        {Object.keys(activeSample[0] || {}).map((key) => (
                          <TableCell key={key} sx={{ fontSize: '0.72rem', py: 1, whiteSpace: 'nowrap', color: 'text.secondary' }}>
                            {typeof row[key] === 'object' && row[key] !== null ? JSON.stringify(row[key]) : String(row[key])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              {/* Actions */}
              {selectedDetailItem.status === 'PENDING_APPROVAL' && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'warning.main',
                    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.05),
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                    Approval Request Pending
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                    This interface requires a Domain Admin's approval before it can be run or exported.
                  </Typography>
                  {userRole === 'DOMAIN_ADMIN' ? (
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleApproveStatus(selectedDetailItem.id, 'ACTIVE')}
                        sx={{ flex: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleApproveStatus(selectedDetailItem.id, 'REJECTED')}
                        sx={{ flex: 1 }}
                      >
                        Reject
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      Switch simulation role to Domain Admin at the top of the page to approve/reject.
                    </Typography>
                  )}
                </Box>
              )}

              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={runningId === selectedDetailItem.id || selectedDetailItem.status === 'PENDING_APPROVAL' || selectedDetailItem.status === 'REJECTED'}
                    onClick={() => handleRunInterface(selectedDetailItem.id, selectedDetailItem.name)}
                    sx={{
                      position: 'relative',
                      ...(runningId === selectedDetailItem.id && {
                        color: 'transparent',
                      })
                    }}
                  >
                    {runningId === selectedDetailItem.id 
                      ? (isOutput ? 'Running Export...' : 'Running Ingestion...') 
                      : selectedDetailItem.status === 'PENDING_APPROVAL'
                      ? 'Awaiting Approval'
                      : selectedDetailItem.status === 'REJECTED'
                      ? 'Rejected'
                      : (isOutput ? 'Run Export Pipeline' : 'Run Ingestion Pipeline')}
                  </Button>

                  {(justExecutedIds[selectedDetailItem.id] || selectedDetailItem.lastRun !== 'Never') && (
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: brand.success,
                        '&:hover': { bgcolor: alpha(brand.success, 0.85) }
                      }}
                      onClick={() => handleDownloadIngestedData(selectedDetailItem)}
                    >
                      {isOutput ? 'Download Processed File' : 'Download Ingested Data'}
                    </Button>
                  )}
                </Box>

                {isOutput && (justExecutedIds[selectedDetailItem.id] || selectedDetailItem.lastRun !== 'Never') && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ShareOutlined />}
                    onClick={() => {
                      const shareUrl = `${window.location.protocol}//${window.location.host}/public-export/${selectedDetailItem.id}`;
                      navigator.clipboard.writeText(shareUrl);
                      setSnackbarMessage('Shareable dataset link copied to clipboard!');
                      setSnackbarSeverity('success');
                      setSnackbarOpen(true);
                    }}
                  >
                    Copy Shareable Link
                  </Button>
                )}
                
                <Button fullWidth variant="outlined" onClick={() => setDetailOpen(false)}>
                  Close Details
                </Button>
              </Box>
            </Box>
          );
        })()}
      </Drawer>
    </Box>
  );
};

export default InterfacePage;
