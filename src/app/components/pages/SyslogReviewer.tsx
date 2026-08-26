import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  X,
  Calendar,
  FileText,
  Activity,
  Clock,
  AlertTriangle,
  Filter,
  Download,
  Eye,
  Link2,
  VolumeX,
  Send,
  Server,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { CustomDateTimePicker } from '../ui/custom-datetime-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

interface SyslogReviewerProps {
  onNavigate?: (page: string, params?: Record<string, string>) => void;
  onLogout?: () => void;
}

// Mock Data for Syslog Timeline
const syslogTimelineData = [
  { time: '00:00', info: 45, warn: 12, error: 3, critical: 0 },
  { time: '02:00', info: 52, warn: 15, error: 5, critical: 1 },
  { time: '04:00', info: 48, warn: 18, error: 8, critical: 2 },
  { time: '06:00', info: 62, warn: 25, error: 15, critical: 5 },
  { time: '08:00', info: 85, warn: 42, error: 28, critical: 12 }, // Spike
  { time: '10:00', info: 78, warn: 38, error: 22, critical: 8 },
  { time: '12:00', info: 65, warn: 20, error: 10, critical: 3 },
  { time: '14:00', info: 58, warn: 16, error: 6, critical: 1 },
  { time: '16:00', info: 55, warn: 14, error: 4, critical: 1 },
  { time: '18:00', info: 48, warn: 11, error: 3, critical: 0 },
  { time: '20:00', info: 42, warn: 8, error: 2, critical: 0 },
  { time: '22:00', info: 38, warn: 6, error: 1, critical: 0 },
];

// Mock Data for Syslog Table
const syslogTableData = [
  {
    id: 1,
    timestamp: '2024-02-02 08:15:32',
    severity: 'Critical',
    service: 'API Gateway',
    host: 'api-prod-01',
    logSource: 'Application',
    messageSummary: 'Connection timeout to database cluster after 30s',
    correlationStatus: 'Correlated',
    linkedHypothesis: 'DB-TIMEOUT-001',
    fullLog: `[ERROR] 2024-02-02 08:15:32 - API Gateway - Connection timeout
  Service: api-gateway-prod
  Host: api-prod-01
  Error: java.sql.SQLException: Timeout waiting for connection from pool
  Stack trace:
    at com.database.ConnectionPool.getConnection(ConnectionPool.java:245)
    at com.api.DatabaseService.query(DatabaseService.java:89)
  Context: High load period - 500+ concurrent requests`,
    parsedFields: {
      errorCode: 'DB_TIMEOUT',
      duration: '30000ms',
      affectedUsers: 142,
      retryAttempts: 3
    }
  },
  {
    id: 2,
    timestamp: '2024-02-02 08:14:58',
    severity: 'Error',
    service: 'User Service',
    host: 'user-prod-03',
    logSource: 'Application',
    messageSummary: 'Failed to authenticate user - JWT token expired',
    correlationStatus: 'Correlated',
    linkedHypothesis: 'AUTH-FAIL-002',
    fullLog: `[ERROR] 2024-02-02 08:14:58 - User Service - Authentication failed
  Service: user-service-prod
  Host: user-prod-03
  Error: JWT token validation failed - token expired
  User ID: user_8792456
  Session ID: sess_4fa821bc
  Request path: /api/v2/profile/update`,
    parsedFields: {
      errorCode: 'AUTH_EXPIRED',
      userId: 'user_8792456',
      sessionId: 'sess_4fa821bc',
      tokenAge: '3665s'
    }
  },
  {
    id: 3,
    timestamp: '2024-02-02 08:13:42',
    severity: 'Warning',
    service: 'Cache Service',
    host: 'cache-prod-02',
    logSource: 'Infrastructure',
    messageSummary: 'Memory usage above 85% threshold',
    correlationStatus: 'Uncorrelated',
    linkedHypothesis: '-',
    fullLog: `[WARN] 2024-02-02 08:13:42 - Cache Service - High memory usage
  Service: redis-cache-prod
  Host: cache-prod-02
  Memory used: 7.2GB / 8GB (90%)
  Cache keys: 2,456,789
  Eviction policy: allkeys-lru`,
    parsedFields: {
      memoryUsed: '7.2GB',
      memoryTotal: '8GB',
      percentage: '90%',
      cacheKeys: 2456789
    }
  },
  {
    id: 4,
    timestamp: '2024-02-02 08:12:15',
    severity: 'Error',
    service: 'Payment Service',
    host: 'payment-prod-01',
    logSource: 'Application',
    messageSummary: 'Payment gateway API returned 503 Service Unavailable',
    correlationStatus: 'Correlated',
    linkedHypothesis: 'PAYMENT-DOWN-003',
    fullLog: `[ERROR] 2024-02-02 08:12:15 - Payment Service - Gateway failure
  Service: payment-processor-prod
  Host: payment-prod-01
  Error: HTTP 503 Service Unavailable
  Gateway: stripe-api
  Transaction ID: txn_9f2b4d1a
  Amount: $249.99
  Retry scheduled: +2 minutes`,
    parsedFields: {
      errorCode: 'GATEWAY_503',
      transactionId: 'txn_9f2b4d1a',
      amount: '$249.99',
      gateway: 'stripe-api'
    }
  },
  {
    id: 5,
    timestamp: '2024-02-02 08:10:28',
    severity: 'Info',
    service: 'Notification Service',
    host: 'notif-prod-05',
    logSource: 'Application',
    messageSummary: 'Email batch successfully sent to 1,250 users',
    correlationStatus: 'Uncorrelated',
    linkedHypothesis: '-',
    fullLog: `[INFO] 2024-02-02 08:10:28 - Notification Service - Batch sent
  Service: email-notification-prod
  Host: notif-prod-05
  Batch ID: batch_email_0202_001
  Recipients: 1,250
  Success rate: 100%
  Send duration: 2.3s`,
    parsedFields: {
      batchId: 'batch_email_0202_001',
      recipients: 1250,
      successRate: '100%',
      duration: '2.3s'
    }
  },
  {
    id: 6,
    timestamp: '2024-02-02 08:08:45',
    severity: 'Warning',
    service: 'Load Balancer',
    host: 'lb-prod-01',
    logSource: 'Network',
    messageSummary: 'Backend server health check failed 2 consecutive times',
    correlationStatus: 'Correlated',
    linkedHypothesis: 'LB-HEALTH-004',
    fullLog: `[WARN] 2024-02-02 08:08:45 - Load Balancer - Health check failure
  Service: nginx-lb-prod
  Host: lb-prod-01
  Backend: api-prod-03:8080
  Failed checks: 2 consecutive
  Response: Connection refused
  Action: Removed from pool`,
    parsedFields: {
      backend: 'api-prod-03:8080',
      failedChecks: 2,
      responseCode: 'CONNECTION_REFUSED',
      action: 'removed_from_pool'
    }
  }
];

export function SyslogReviewer({ onNavigate, onLogout }: SyslogReviewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 24 Hours');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [selectedLog, setSelectedLog] = useState<typeof syslogTableData[0] | null>(null);
  const [showLogDrawer, setShowLogDrawer] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const [filters, setFilters] = useState({
    service: [] as string[],
    host: [] as string[],
    severity: [] as string[],
    logSource: [] as string[],
    correlationStatus: [] as string[],
    linkedHypothesis: [] as string[],
  });

  const handleApplyCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setDateRange(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
    setShowCustomRangePicker(false);
    setShowDateDropdown(false);
  };

  // Calculate KPIs
  const totalSyslogs = syslogTableData.length * 28; // Simulated
  const correlatedLogs = syslogTableData.filter(log => log.correlationStatus === 'Correlated').length;
  const correlatedPercentage = ((correlatedLogs / syslogTableData.length) * 100).toFixed(0);
  const errorSpikeWindow = '08:00 - 08:30';
  const linkedHypotheses = 4;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Critical
          </Badge>
        );
      case 'Error':
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Error
          </Badge>
        );
      case 'Warning':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Warning
          </Badge>
        );
      case 'Info':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Info
          </Badge>
        );
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getCorrelationBadge = (status: string) => {
    if (status === 'Correlated') {
      return <Badge className="bg-green-100 text-green-700 border-green-200">Correlated</Badge>;
    }
    return <Badge variant="outline" className="text-gray-500">Uncorrelated</Badge>;
  };

  const handleLogClick = (log: typeof syslogTableData[0]) => {
    setSelectedLog(log);
    setShowLogDrawer(true);
  };

  // Filter logs
  const filteredLogs = syslogTableData.filter(log => {
    if (filters.severity.length > 0 && !filters.severity.includes(log.severity)) {
      return false;
    }
    if (filters.service.length > 0 && !filters.service.includes(log.service)) {
      return false;
    }
    if (filters.correlationStatus.length > 0 && !filters.correlationStatus.includes(log.correlationStatus)) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return log.messageSummary.toLowerCase().includes(query) ||
             log.service.toLowerCase().includes(query) ||
             log.host.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <DashboardLayout 
      currentPage="Syslog Reviewer" 
      onNavigate={onNavigate} 
      onLogout={onLogout}
    >
      <PageContainer
        title=""
        subtitle=""
        actions={<div></div>}
      >
        {/* Hero Section */}
        <div className="relative -mt-6 -mx-6 mb-6">
          <div className="bg-gradient-to-r from-[#AE275F] to-[#D63384] px-6 pt-8 pb-32 rounded-b-2xl">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Syslog Reviewer</h1>
                <p className="text-pink-100">Analyze and correlate system logs with RCA hypotheses</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-200 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search logs by message, service, host..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-pink-200"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 text-white transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{dateRange}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showDateDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {['Last 1 Hour', 'Last 6 Hours', 'Last 24 Hours', 'Last 7 Days', 'Custom Range'].map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            if (range === 'Custom Range') {
                              setShowCustomRangePicker(true);
                              setShowDateDropdown(false);
                            } else {
                              setDateRange(range);
                              setShowDateDropdown(false);
                            }
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            dateRange === range ? 'bg-purple-50 text-[#AE275F]' : 'text-gray-700'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}

                  {showCustomRangePicker && (
                    <div className="absolute right-0 mt-0 z-20">
                      <CustomDateTimePicker
                        startDate={customStartDate}
                        endDate={customEndDate}
                        onApply={handleApplyCustomRange}
                        onCancel={() => setShowCustomRangePicker(false)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="max-w-7xl mx-auto px-6 -mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Total Syslogs */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('syslog-timeline-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Total Syslogs</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{totalSyslogs.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{dateRange}</span>
                </div>
              </div>

              {/* 2. Correlated Logs */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => {
                  setFilters(prev => ({ ...prev, correlationStatus: ['Correlated'] }));
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Correlated Logs</span>
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{correlatedPercentage}%</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Activity className="w-3 h-3" />
                  <span>{correlatedLogs} logs linked to RCA</span>
                </div>
              </div>

              {/* 3. Error Spike Window */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => {
                  // Zoom timeline to spike window
                  document.getElementById('syslog-timeline-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Error Spike Window</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">{errorSpikeWindow}</div>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <Activity className="w-3 h-3" />
                  <span>Peak error rate: 28/hr</span>
                </div>
              </div>

              {/* 4. Linked Hypotheses */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => onNavigate?.('rca')}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Linked Hypotheses</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{linkedHypotheses}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Click to view in RCA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredLogs.length}</span> of <span className="font-medium">{syslogTableData.length}</span> logs shown
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => onNavigate?.('rca')}
            >
              <Activity className="w-4 h-4 mr-2" />
              RCA Overview
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
            <Button 
              className="bg-[#AE275F] hover:bg-[#8B1F4C] text-white"
              onClick={() => setShowFilterSidebar(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Syslog Timeline */}
        <div id="syslog-timeline-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Syslog Timeline</h3>
              <p className="text-sm text-gray-500 mt-1">Log volume by severity over time</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={syslogTimelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="critical" stackId="a" fill="#AE275F" name="Critical" />
              <Bar dataKey="error" stackId="a" fill="#C94979" name="Error" />
              <Bar dataKey="warn" stackId="a" fill="#E46B93" name="Warning" />
              <Bar dataKey="info" stackId="a" fill="#F0A8C0" name="Info" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Syslog Table */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">System Logs</h3>
                <p className="text-sm text-gray-500 mt-1">Click any log row to view full details</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service / App</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host / Node</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message Summary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correlation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleLogClick(log)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-6 py-4">{getSeverityBadge(log.severity)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{log.host}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{log.logSource}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">{log.messageSummary}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {getCorrelationBadge(log.correlationStatus)}
                        {log.linkedHypothesis !== '-' && (
                          <span className="text-xs text-[#AE275F] font-medium">{log.linkedHypothesis}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                            setShowLogModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                            setShowLinkModal(true);
                          }}
                        >
                          <Link2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                            setShowSendModal(true);
                          }}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>

      {/* Log Detail Drawer */}
      {showLogDrawer && selectedLog && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowLogDrawer(false)}
          />
          
          <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Log Details</h3>
                <button
                  onClick={() => setShowLogDrawer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Log Metadata */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Timestamp</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLog.timestamp}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Severity</div>
                    <div>{getSeverityBadge(selectedLog.severity)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Service</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLog.service}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Host</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLog.host}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Log Source</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLog.logSource}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Correlation Status</div>
                    <div>{getCorrelationBadge(selectedLog.correlationStatus)}</div>
                  </div>
                </div>
              </div>

              {/* Full Raw Log */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-900 mb-2">Full Raw Log</div>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{selectedLog.fullLog}</pre>
                </div>
              </div>

              {/* Parsed Fields */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-900 mb-3">Parsed Fields</div>
                <div className="space-y-2">
                  {Object.entries(selectedLog.parsedFields).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-sm font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Hypothesis */}
              {selectedLog.linkedHypothesis !== '-' && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-900 mb-3">Related RCA Hypothesis</div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                       onClick={() => onNavigate?.('rca')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">{selectedLog.linkedHypothesis}</div>
                        <div className="text-xs text-gray-500">Click to view in RCA Overview</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <Button 
                  className="w-full bg-[#AE275F] hover:bg-[#8B1F4C] text-white"
                  onClick={() => onNavigate?.('rca-pattern-detection')}
                >
                  <Send className="w-4 h-4 mr-2" />
                  View Pattern Detection
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate?.('rca')}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Open in RCA Overview
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Link to Hypothesis
                </Button>
                <Button 
                  variant="outline"
                  className="w-full text-gray-600"
                >
                  <VolumeX className="w-4 h-4 mr-2" />
                  Mark as Noise
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Filter Sidebar */}
      {showFilterSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowFilterSidebar(false)}
          />
          
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Filter Syslogs</h3>
                <button
                  onClick={() => setShowFilterSidebar(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Severity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <div className="space-y-2">
                    {['Critical', 'Error', 'Warning', 'Info'].map((severity) => (
                      <label key={severity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.severity.includes(severity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                severity: [...prev.severity, severity]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                severity: prev.severity.filter(s => s !== severity)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{severity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Service Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service / Application</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {['API Gateway', 'User Service', 'Cache Service', 'Payment Service', 'Notification Service', 'Load Balancer'].map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.service.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                service: [...prev.service, service]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                service: prev.service.filter(s => s !== service)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Log Source Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Log Source</label>
                  <div className="space-y-2">
                    {['Application', 'Infrastructure', 'Database', 'Network'].map((source) => (
                      <label key={source} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.logSource.includes(source)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                logSource: [...prev.logSource, source]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                logSource: prev.logSource.filter(s => s !== source)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Correlation Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correlation Status</label>
                  <div className="space-y-2">
                    {['Correlated', 'Uncorrelated'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.correlationStatus.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                correlationStatus: [...prev.correlationStatus, status]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                correlationStatus: prev.correlationStatus.filter(s => s !== status)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <Button
                  className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4C] text-white"
                  onClick={() => setShowFilterSidebar(false)}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      service: [],
                      host: [],
                      severity: [],
                      logSource: [],
                      correlationStatus: [],
                      linkedHypothesis: [],
                    });
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View Log Modal */}
      {showLogModal && selectedLog && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogModal(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Log Details</h3>
                  <button
                    onClick={() => setShowLogModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Log Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Timestamp</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLog.timestamp}</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Severity</div>
                    <div>{getSeverityBadge(selectedLog.severity)}</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Service</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLog.service}</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Host</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLog.host}</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Log Source</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLog.logSource}</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Correlation Status</div>
                    <div>{getCorrelationBadge(selectedLog.correlationStatus)}</div>
                  </div>
                </div>

                {/* Full Raw Log */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-900 mb-2">Full Raw Log</div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-60">
                    <pre className="whitespace-pre-wrap">{selectedLog.fullLog}</pre>
                  </div>
                </div>

                {/* Parsed Fields */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-900 mb-3">Parsed Fields</div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedLog.parsedFields).map(([key, value]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="text-sm font-medium text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linked Hypothesis */}
                {selectedLog.linkedHypothesis !== '-' && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-900 mb-3">Related RCA Hypothesis</div>
                    <div 
                      className="border border-[#AE275F] bg-purple-50 rounded-lg p-4 hover:bg-purple-100 cursor-pointer transition-colors"
                      onClick={() => {
                        setShowLogModal(false);
                        onNavigate?.('rca');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-[#AE275F] mb-1">{selectedLog.linkedHypothesis}</div>
                          <div className="text-xs text-gray-600">Click to view in RCA Overview</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#AE275F]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <Button 
                    className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4C] text-white"
                    onClick={() => {
                      setShowLogModal(false);
                      onNavigate?.('rca');
                    }}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Open in RCA
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowLogModal(false);
                      onNavigate?.('rca-pattern-detection');
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Pattern Detection
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Link to Hypothesis Modal */}
      {showLinkModal && selectedLog && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLinkModal(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Link Log to RCA Hypothesis</h3>
                    <p className="text-sm text-gray-500 mt-1">Associate this log with an existing hypothesis</p>
                  </div>
                  <button
                    onClick={() => setShowLinkModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Selected Log Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Selected Log</span>
                    {getSeverityBadge(selectedLog.severity)}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{selectedLog.service} • {selectedLog.host}</div>
                  <div className="text-sm text-gray-900">{selectedLog.messageSummary}</div>
                </div>

                {/* Hypothesis Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Hypothesis</label>
                  <div className="space-y-2">
                    {['DB-TIMEOUT-001', 'AUTH-FAIL-002', 'PAYMENT-DOWN-003', 'LB-HEALTH-004'].map((hypothesis) => (
                      <label 
                        key={hypothesis}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="hypothesis"
                          value={hypothesis}
                          defaultChecked={selectedLog.linkedHypothesis === hypothesis}
                          className="text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">{hypothesis}</div>
                          <div className="text-xs text-gray-500">
                            {hypothesis === 'DB-TIMEOUT-001' && 'Database connection pool exhaustion after deployment'}
                            {hypothesis === 'AUTH-FAIL-002' && 'Authentication service JWT token expiry pattern'}
                            {hypothesis === 'PAYMENT-DOWN-003' && 'Payment gateway intermittent failures'}
                            {hypothesis === 'LB-HEALTH-004' && 'Load balancer health check failures'}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Optional Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent"
                    rows={3}
                    placeholder="Add any additional context or notes about this correlation..."
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <Button 
                    className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4C] text-white"
                    onClick={() => {
                      setShowLinkModal(false);
                      // Success toast or confirmation
                    }}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Link to Hypothesis
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowLinkModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Send to Pattern Detection Modal */}
      {showSendModal && selectedLog && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSendModal(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Send to Pattern Detection</h3>
                    <p className="text-sm text-gray-500 mt-1">Analyze this log for recurring patterns and anomalies</p>
                  </div>
                  <button
                    onClick={() => setShowSendModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Selected Log Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#AE275F] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">{selectedLog.service}</span>
                        {getSeverityBadge(selectedLog.severity)}
                      </div>
                      <div className="text-sm text-gray-700 mb-1">{selectedLog.messageSummary}</div>
                      <div className="text-xs text-gray-500">{selectedLog.timestamp} • {selectedLog.host}</div>
                    </div>
                  </div>
                </div>

                {/* Analysis Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Analysis Options</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Include similar logs from same service</div>
                        <div className="text-xs text-gray-500">Analyze patterns across {selectedLog.service}</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Include time window context</div>
                        <div className="text-xs text-gray-500">Analyze logs ±30 minutes from this timestamp</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Cross-service correlation</div>
                        <div className="text-xs text-gray-500">Look for patterns across all services</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Expected Results */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-blue-900 mb-1">What you'll get:</div>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Detected pattern frequency and confidence score</li>
                        <li>• Historical incidents sharing similar characteristics</li>
                        <li>• Recommended preventive actions and alerts</li>
                        <li>• Correlated metrics and service dependencies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <Button 
                    className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4C] text-white"
                    onClick={() => {
                      setShowSendModal(false);
                      onNavigate?.('rca-pattern-detection');
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send to Pattern Detection
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowSendModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}