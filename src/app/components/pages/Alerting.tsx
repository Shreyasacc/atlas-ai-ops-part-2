import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  Bell,
  Target,
  Clock,
  Activity,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Eye,
  UserPlus,
  PauseCircle,
  XCircle,
  PlayCircle,
  Users,
  Brain,
  Server,
  Wifi
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { CustomDateTimePicker } from '../ui/custom-datetime-picker';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'acknowledged' | 'snoozed' | 'closed';
  service: string;
  triggeredAt: string;
  anomalyId?: string;
  rcaLinked: boolean;
  impact: string;
  recommendedAction: string;
  assignedTo?: string;
  impactedUsers?: number;
}

interface AlertingProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    title: 'API Gateway Response Time Degradation',
    description: 'Response time increased by 340% from baseline, affecting user authentication flow',
    severity: 'critical',
    status: 'active',
    service: 'api-gateway-prod',
    triggeredAt: '2025-12-30 14:23:45',
    anomalyId: 'ANO-001',
    rcaLinked: true,
    impact: 'User authentication failures, 25% increase in 5xx errors',
    recommendedAction: 'Scale connection pool, restart auth service pods',
    impactedUsers: 1250,
    assignedTo: 'John Smith'
  },
  {
    id: 'ALT-002',
    title: 'Database Connection Pool Exhaustion',
    description: 'PostgreSQL connection pool at 98% capacity, query latency spiking',
    severity: 'high',
    status: 'acknowledged',
    service: 'postgres-db-01',
    triggeredAt: '2025-12-30 13:15:22',
    anomalyId: 'ANO-002',
    rcaLinked: true,
    impact: 'Database query timeouts, transaction failures',
    recommendedAction: 'Increase max_connections, identify long-running queries',
    impactedUsers: 850,
    assignedTo: 'Sarah Johnson'
  },
  {
    id: 'ALT-003',
    title: 'CDN Cache Hit Ratio Below Threshold',
    description: 'Cache hit ratio dropped from 92% to 34% after recent deployment',
    severity: 'medium',
    status: 'active',
    service: 'cdn-edge-us-east',
    triggeredAt: '2025-12-30 12:45:10',
    anomalyId: 'ANO-003',
    rcaLinked: true,
    impact: 'Increased origin server load, slower page load times',
    recommendedAction: 'Verify cache invalidation rules, warm up cache',
    impactedUsers: 420
  },
  {
    id: 'ALT-004',
    title: 'EC2 Worker Pool CPU Saturation',
    description: 'Worker pool instances running at 95%+ CPU for 15+ minutes',
    severity: 'high',
    status: 'active',
    service: 'ec2-worker-pool',
    triggeredAt: '2025-12-30 11:30:15',
    anomalyId: 'ANO-004',
    rcaLinked: true,
    impact: 'Job processing delays, queue backlog growing',
    recommendedAction: 'Trigger auto-scaling, review batch job scheduling',
    impactedUsers: 0
  },
  {
    id: 'ALT-005',
    title: 'Redis Memory Pressure Warning',
    description: 'Redis memory usage at 87%, approaching eviction threshold',
    severity: 'medium',
    status: 'snoozed',
    service: 'redis-cache-cluster',
    triggeredAt: '2025-12-30 10:20:33',
    anomalyId: 'ANO-005',
    rcaLinked: false,
    impact: 'Potential cache evictions, session data loss risk',
    recommendedAction: 'Configure eviction policy, scale Redis cluster',
    impactedUsers: 2100
  },
  {
    id: 'ALT-006',
    title: 'Kubernetes Pod Restart Loop Detected',
    description: 'Multiple pods restarting due to OOMKilled events in last 10 minutes',
    severity: 'critical',
    status: 'acknowledged',
    service: 'kubernetes-nodes',
    triggeredAt: '2025-12-30 09:15:48',
    anomalyId: 'ANO-006',
    rcaLinked: true,
    impact: 'Service instability, intermittent downtime',
    recommendedAction: 'Increase memory limits, investigate memory leak',
    impactedUsers: 3400,
    assignedTo: 'Mike Chen'
  },
  {
    id: 'ALT-007',
    title: 'Load Balancer Health Check Failures',
    description: 'Backend instances failing health checks intermittently',
    severity: 'low',
    status: 'closed',
    service: 'load-balancer-prod',
    triggeredAt: '2025-12-30 08:45:12',
    anomalyId: 'ANO-007',
    rcaLinked: false,
    impact: 'No customer impact, health check configuration issue',
    recommendedAction: 'Adjust health check timeout settings',
    impactedUsers: 0
  },
  {
    id: 'ALT-008',
    title: 'Authentication Service Error Rate Spike',
    description: 'OAuth token validation errors increased 5x in past hour',
    severity: 'high',
    status: 'active',
    service: 'auth-service',
    triggeredAt: '2025-12-30 07:30:25',
    anomalyId: 'ANO-008',
    rcaLinked: true,
    impact: 'Login failures, user session interruptions',
    recommendedAction: 'Verify OAuth provider connectivity, check token refresh logic',
    impactedUsers: 1680,
    assignedTo: 'Emily Rodriguez'
  }
];

export function Alerting({ onNavigate, onLogout }: AlertingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRCALinked, setSelectedRCALinked] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState('Last 24 Hours');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAcknowledgeModal, setShowAcknowledgeModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [assignee, setAssignee] = useState('');
  const [snoozeDuration, setSnoozeDuration] = useState('30');
  const [closeNotes, setCloseNotes] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDateRange, setExportDateRange] = useState('current');
  const [includeFilters, setIncludeFilters] = useState(true);
  
  const dateRangeOptions = ['Last 15 Minutes', 'Last 1 Hour', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

  const handleDateRangeSelect = (option: string) => {
    setDateRange(option);
    setShowDateDropdown(false);
    if (option === 'Custom Range') {
      setShowCustomRangePicker(true);
    }
  };

  const handleApplyCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setDateRange(`${format(start, 'MMM dd, yyyy')} - ${format(end, 'MMM dd, yyyy')}`);
    setShowCustomRangePicker(false);
  };

  // Filter alerts
  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus;
    const matchesRCA = selectedRCALinked === 'all' || 
                      (selectedRCALinked === 'yes' && alert.rcaLinked) ||
                      (selectedRCALinked === 'no' && !alert.rcaLinked);
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesRCA;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlerts = filteredAlerts.slice(startIndex, endIndex);

  // Calculate KPIs
  const activeAlerts = mockAlerts.filter(a => a.status === 'active').length;
  const criticalAlerts = mockAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const alertsSuppressed = mockAlerts.filter(a => a.status === 'snoozed').length;
  const truePositiveRate = 94;
  const avgResolutionTime = '42m';

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-700 border-red-200';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'snoozed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'closed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleExportData = () => {
    setShowExportModal(true);
  };

  // Modal handlers
  const handleViewDetails = (alertId: string) => {
    const alert = mockAlerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setShowDetailsModal(true);
    }
  };

  const handleAcknowledge = (alertId: string) => {
    const alert = mockAlerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setShowAcknowledgeModal(true);
    }
  };

  const handleAssign = (alertId: string) => {
    const alert = mockAlerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setShowAssignModal(true);
    }
  };

  const handleSnooze = (alertId: string) => {
    const alert = mockAlerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setShowSnoozeModal(true);
    }
  };

  const handleClose = (alertId: string) => {
    const alert = mockAlerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setShowCloseModal(true);
    }
  };

  return (
    <DashboardLayout currentPage="alerting" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl mb-6">
          {/* Header Row with Title and Search/Date */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl mb-2">Intelligent Alerting</h1>
              <p className="text-white/80 text-sm">Noise reduction with AI-powered alert prioritization</p>
            </div>
            
            {/* Search and Date Range - Inline */}
            <div className="flex gap-3 ml-8">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 z-10" />
                <input
                  type="text"
                  placeholder="Search incidents, cloud, apps, to..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Date Range Selector */}
              <div className="relative flex-shrink-0">
                {!showCustomRangePicker ? (
                  <>
                    <button
                      onClick={() => setShowDateDropdown(!showDateDropdown)}
                      className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-lg transition-all whitespace-nowrap"
                    >
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{dateRange}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showDateDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        {dateRangeOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleDateRangeSelect(option)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                              dateRange === option ? "bg-[#AE275F]/10 text-[#AE275F]" : "text-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
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

          {/* KPI Cards - White Filled */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Active Alerts</span>
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{activeAlerts}</div>
              <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                5 new today
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Critical Alerts</span>
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{criticalAlerts}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                1 less than yesterday
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Alerts Suppressed</span>
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <PauseCircle className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{alertsSuppressed}</div>
              <div className="text-xs text-gray-500 mt-1">noise reduction</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">True Positive Rate</span>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{truePositiveRate}%</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                3% this month
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Avg Resolution Time</span>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{avgResolutionTime}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                12m faster
              </div>
            </div>
          </div>
        </div>

        {/* Filter Button - Outside Hero, Right Side */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredAlerts.length} alerts found
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[#AE275F] text-white rounded-lg text-sm hover:bg-[#8B1F4D] transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(selectedSeverity !== 'all' || selectedStatus !== 'all' || selectedRCALinked !== 'all') && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {[selectedSeverity !== 'all', selectedStatus !== 'all', selectedRCALinked !== 'all'].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Side Sheet */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="right" className="w-96 sm:max-w-md">
            <SheetTitle>Filter Alerts</SheetTitle>
            <SheetDescription>
              Refine your alert search by applying filters below
            </SheetDescription>
            
            <div className="py-[24px] px-[20px]">
              <div className="space-y-6">
                {/* Severity Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Severity</label>
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="snoozed">Snoozed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* RCA Linked Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">RCA Linked</label>
                  <select
                    value={selectedRCALinked}
                    onChange={(e) => setSelectedRCALinked(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="all">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setSelectedSeverity('all');
                      setSelectedStatus('all');
                      setSelectedRCALinked('all');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 px-4 py-2 bg-[#AE275F] text-white rounded-lg text-sm hover:bg-[#8B1F4D] transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Alert</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">RCA</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-md">
                        <span className="text-sm text-gray-900 mb-1">{alert.title}</span>
                        <span className="text-xs text-gray-500 line-clamp-1">{alert.description}</span>
                        <span className="text-xs text-gray-400 mt-1">{alert.triggeredAt}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{alert.service}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getSeverityColor(alert.severity)} border`}>
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatusColor(alert.status)} border`}>
                        {alert.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-xs">
                        <span className="text-sm text-gray-900 line-clamp-1">{alert.impact}</span>
                        {alert.impactedUsers !== undefined && alert.impactedUsers > 0 && (
                          <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {alert.impactedUsers.toLocaleString()} users
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {alert.rcaLinked ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 border">
                          Linked
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 border-gray-200 border">
                          No
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleViewDetails(alert.id)}
                                className="p-2 text-gray-400 hover:text-[#AE275F] hover:bg-[#AE275F]/10 rounded-lg transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>View Details</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleAcknowledge(alert.id)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Acknowledge</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleAssign(alert.id)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Assign</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleSnooze(alert.id)}
                                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                              >
                                <PauseCircle className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Snooze</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleClose(alert.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Close</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAlerts.length)} of {filteredAlerts.length} alerts
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Alert Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#AE275F]" />
                Alert Details
              </DialogTitle>
              <DialogDescription>
                Comprehensive information about this alert
              </DialogDescription>
            </DialogHeader>

            {selectedAlert && (
              <div className="space-y-6 mt-4">
                {/* Alert Header */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 mb-1">{selectedAlert.title}</h3>
                      <p className="text-sm text-gray-600">{selectedAlert.description}</p>
                    </div>
                    <Badge className={`${getSeverityColor(selectedAlert.severity)} border ml-4`}>
                      {selectedAlert.severity}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Alert ID:</span>
                      <span className="ml-2 text-gray-900">{selectedAlert.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <Badge className={`${getStatusColor(selectedAlert.status)} border ml-2`}>
                        {selectedAlert.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-500">Service:</span>
                      <span className="ml-2 text-gray-900">{selectedAlert.service}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Triggered At:</span>
                      <span className="ml-2 text-gray-900">{selectedAlert.triggeredAt}</span>
                    </div>
                  </div>
                </div>

                {/* Impact Analysis */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Impact Analysis
                  </h4>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-gray-900 mb-2">{selectedAlert.impact}</p>
                    {selectedAlert.impactedUsers !== undefined && selectedAlert.impactedUsers > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4" />
                        <span>{selectedAlert.impactedUsers.toLocaleString()} users impacted</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#AE275F]" />
                    AI-Recommended Actions
                  </h4>
                  <div className="p-4 bg-[#AE275F]/5 border border-[#AE275F]/20 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedAlert.recommendedAction}</p>
                  </div>
                </div>

                {/* RCA Linkage */}
                {selectedAlert.rcaLinked && selectedAlert.anomalyId && (
                  <div>
                    <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Root Cause Analysis
                    </h4>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-900 mb-1">Linked to Anomaly: {selectedAlert.anomalyId}</p>
                          <p className="text-xs text-gray-600">RCA analysis available for this alert</p>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          View RCA
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assignment Info */}
                {selectedAlert.assignedTo && (
                  <div>
                    <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-green-600" />
                      Assignment
                    </h4>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-900">Assigned to: <strong>{selectedAlert.assignedTo}</strong></p>
                    </div>
                  </div>
                )}

                {/* Related Metrics */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    Related Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Response Time</div>
                      <div className="text-lg text-gray-900">2.4s</div>
                      <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +340%
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Error Rate</div>
                      <div className="text-lg text-gray-900">12.5%</div>
                      <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +25%
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Throughput</div>
                      <div className="text-lg text-gray-900">156/s</div>
                      <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <TrendingDown className="w-3 h-3" />
                        -45%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowAcknowledgeModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowAssignModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Acknowledge Modal */}
        <Dialog open={showAcknowledgeModal} onOpenChange={setShowAcknowledgeModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Acknowledge Alert
              </DialogTitle>
              <DialogDescription>
                Confirm that you have reviewed this alert
              </DialogDescription>
            </DialogHeader>

            {selectedAlert && (
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900">{selectedAlert.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedAlert.id}</p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Acknowledging this alert will change its status and notify the team that you are aware of the issue.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      alert(`Alert ${selectedAlert.id} has been acknowledged successfully!`);
                      setShowAcknowledgeModal(false);
                      setSelectedAlert(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirm Acknowledgement
                  </button>
                  <button
                    onClick={() => setShowAcknowledgeModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Assign Modal */}
        <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Assign Alert
              </DialogTitle>
              <DialogDescription>
                Assign this alert to a team member for resolution
              </DialogDescription>
            </DialogHeader>

            {selectedAlert && (
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900">{selectedAlert.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedAlert.id}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Assign to:</label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="">Select team member...</option>
                    <option value="John Smith">John Smith (DevOps Engineer)</option>
                    <option value="Sarah Johnson">Sarah Johnson (SRE Lead)</option>
                    <option value="Mike Chen">Mike Chen (Platform Engineer)</option>
                    <option value="Emily Rodriguez">Emily Rodriguez (Security Engineer)</option>
                    <option value="David Kim">David Kim (Database Admin)</option>
                    <option value="Lisa Wang">Lisa Wang (Cloud Architect)</option>
                  </select>
                </div>

                {selectedAlert.assignedTo && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Currently assigned to: <strong>{selectedAlert.assignedTo}</strong>
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (!assignee) {
                        alert('Please select a team member to assign this alert to.');
                        return;
                      }
                      alert(`Alert ${selectedAlert.id} has been assigned to ${assignee}!`);
                      setShowAssignModal(false);
                      setAssignee('');
                      setSelectedAlert(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Assign Alert
                  </button>
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setAssignee('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Snooze Modal */}
        <Dialog open={showSnoozeModal} onOpenChange={setShowSnoozeModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <PauseCircle className="w-5 h-5 text-yellow-600" />
                Snooze Alert
              </DialogTitle>
              <DialogDescription>
                Temporarily suppress this alert for a specified duration
              </DialogDescription>
            </DialogHeader>

            {selectedAlert && (
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900">{selectedAlert.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedAlert.id}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Snooze Duration:</label>
                  <select
                    value={snoozeDuration}
                    onChange={(e) => setSnoozeDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="240">4 hours</option>
                    <option value="480">8 hours</option>
                    <option value="1440">24 hours</option>
                  </select>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> The alert will be automatically reactivated after the snooze period expires if the condition persists.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      const duration = snoozeDuration === '60' ? '1 hour' : 
                                      snoozeDuration === '120' ? '2 hours' :
                                      snoozeDuration === '240' ? '4 hours' :
                                      snoozeDuration === '480' ? '8 hours' :
                                      snoozeDuration === '1440' ? '24 hours' :
                                      `${snoozeDuration} minutes`;
                      alert(`Alert ${selectedAlert.id} has been snoozed for ${duration}!`);
                      setShowSnoozeModal(false);
                      setSnoozeDuration('30');
                      setSelectedAlert(null);
                    }}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Snooze Alert
                  </button>
                  <button
                    onClick={() => {
                      setShowSnoozeModal(false);
                      setSnoozeDuration('30');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Close Alert Modal */}
        <Dialog open={showCloseModal} onOpenChange={setShowCloseModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <XCircle className="w-5 h-5 text-gray-600" />
                Close Alert
              </DialogTitle>
              <DialogDescription>
                Mark this alert as resolved and close it
              </DialogDescription>
            </DialogHeader>

            {selectedAlert && (
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900">{selectedAlert.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedAlert.id}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Resolution Notes (Optional):</label>
                  <textarea
                    value={closeNotes}
                    onChange={(e) => setCloseNotes(e.target.value)}
                    placeholder="Describe how this alert was resolved..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50 resize-none"
                  />
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Note:</strong> Closing this alert will mark it as resolved. The alert will remain in the closed alerts list for historical reference.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      const message = closeNotes 
                        ? `Alert ${selectedAlert.id} has been closed!\n\nResolution Notes:\n${closeNotes}`
                        : `Alert ${selectedAlert.id} has been closed successfully!`;
                      alert(message);
                      setShowCloseModal(false);
                      setCloseNotes('');
                      setSelectedAlert(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close Alert
                  </button>
                  <button
                    onClick={() => {
                      setShowCloseModal(false);
                      setCloseNotes('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Export Data Modal */}
        <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Download className="w-5 h-5 text-[#AE275F]" />
                Export Alerts Data
              </DialogTitle>
              <DialogDescription>
                Configure export settings for alerts data
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Export Format:</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                >
                  <option value="csv">CSV (Comma Separated Values)</option>
                  <option value="json">JSON (JavaScript Object Notation)</option>
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="pdf">PDF Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Date Range:</label>
                <select
                  value={exportDateRange}
                  onChange={(e) => setExportDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                >
                  <option value="current">Current View ({dateRange})</option>
                  <option value="all">All Alerts</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFilters}
                    onChange={(e) => setIncludeFilters(e.target.checked)}
                    className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]"
                  />
                  <span className="text-sm text-gray-700">Apply current filters to export</span>
                </label>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <p className="text-sm text-blue-900">
                  <strong>Export Summary:</strong>
                </p>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>• Format: {exportFormat.toUpperCase()}</p>
                  <p>• Records: {includeFilters ? filteredAlerts.length : mockAlerts.length} alerts</p>
                  <p>• Date Range: {exportDateRange === 'current' ? dateRange : exportDateRange === 'all' ? 'All Time' : exportDateRange.replace('last', 'Last ').replace('days', ' Days')}</p>
                  <p>• Filters: {includeFilters ? `Applied (${[selectedSeverity !== 'all', selectedStatus !== 'all', selectedRCALinked !== 'all'].filter(Boolean).length} active)` : 'None'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    const recordCount = includeFilters ? filteredAlerts.length : mockAlerts.length;
                    const formatName = exportFormat.toUpperCase();
                    alert(`Export Started!\n\nFormat: ${formatName}\nRecords: ${recordCount}\nFilters: ${includeFilters ? 'Applied' : 'None'}\n\nYour download will begin shortly...`);
                    setShowExportModal(false);
                    setExportFormat('csv');
                    setExportDateRange('current');
                    setIncludeFilters(true);
                  }}
                  className="flex-1 px-4 py-2 bg-[#AE275F] text-white rounded-lg hover:bg-[#8B1F4D] transition-colors"
                >
                  Export Data
                </button>
                <button
                  onClick={() => {
                    setShowExportModal(false);
                    setExportFormat('csv');
                    setExportDateRange('current');
                    setIncludeFilters(true);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </DashboardLayout>
  );
}