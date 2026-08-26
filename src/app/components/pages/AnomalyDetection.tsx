import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  Eye,
  Cloud,
  Clock,
  Activity,
  FileText,
  Play,
  CheckCircle2,
  AlertTriangle,
  X,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  Zap,
  ShieldCheck,
  Target,
  Bell,
  Brain,
  Settings,
  Users,
  Server
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

interface Anomaly {
  id: string;
  serviceName: string;
  metricAffected: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  firstSeen: string;
  status: 'active' | 'investigating' | 'suppressed' | 'resolved';
  provider: 'AWS' | 'Azure' | 'GCP';
  serviceType: 'Compute' | 'Database' | 'Network' | 'Application';
  assignedTo?: string;
  description: string;
  detectedTime: string;
  duration: string;
  region: string;
  appName: string;
  usersImpacted: number;
  currentValue: string;
  baselineValue: string;
  deviation: string;
}

interface AnomalyDetectionProps {
  onNavigate?: (page: string, params?: Record<string, string>, anomalyId?: string) => void;
  onLogout?: () => void;
}

const mockAnomalies: Anomaly[] = [
  {
    id: 'ANO-001',
    serviceName: 'api-gateway-prod',
    metricAffected: 'Response Time',
    severity: 'critical',
    confidence: 94,
    firstSeen: '2025-12-30 14:23:45',
    status: 'active',
    provider: 'AWS',
    serviceType: 'Application',
    assignedTo: 'John Smith',
    description: 'An unusual spike in response time detected in the API Gateway service.',
    detectedTime: '2025-12-30 14:23:45',
    duration: '15 minutes',
    region: 'us-east-1',
    appName: 'api-gateway-prod',
    usersImpacted: 1000,
    currentValue: '500ms',
    baselineValue: '100ms',
    deviation: '400%'
  },
  {
    id: 'ANO-002',
    serviceName: 'postgres-db-01',
    metricAffected: 'Connection Pool',
    severity: 'high',
    confidence: 87,
    firstSeen: '2025-12-30 13:15:22',
    status: 'investigating',
    provider: 'Azure',
    serviceType: 'Database',
    description: 'Connection pool size exceeded the expected threshold in the PostgreSQL database.',
    detectedTime: '2025-12-30 13:15:22',
    duration: '10 minutes',
    region: 'westeurope',
    appName: 'postgres-db-01',
    usersImpacted: 500,
    currentValue: '150',
    baselineValue: '100',
    deviation: '50%'
  },
  {
    id: 'ANO-003',
    serviceName: 'cdn-edge-us-east',
    metricAffected: 'Cache Hit Ratio',
    severity: 'medium',
    confidence: 76,
    firstSeen: '2025-12-30 12:45:10',
    status: 'active',
    provider: 'GCP',
    serviceType: 'Network',
    description: 'Cache hit ratio dropped below the expected level in the CDN service.',
    detectedTime: '2025-12-30 12:45:10',
    duration: '5 minutes',
    region: 'us-east1',
    appName: 'cdn-edge-us-east',
    usersImpacted: 2000,
    currentValue: '70%',
    baselineValue: '80%',
    deviation: '10%'
  },
  {
    id: 'ANO-004',
    serviceName: 'ec2-worker-pool',
    metricAffected: 'CPU Utilization',
    severity: 'high',
    confidence: 91,
    firstSeen: '2025-12-30 11:30:15',
    status: 'active',
    provider: 'AWS',
    serviceType: 'Compute',
    description: 'CPU utilization exceeded the expected threshold in the EC2 worker pool.',
    detectedTime: '2025-12-30 11:30:15',
    duration: '20 minutes',
    region: 'us-west-2',
    appName: 'ec2-worker-pool',
    usersImpacted: 300,
    currentValue: '95%',
    baselineValue: '70%',
    deviation: '25%'
  },
  {
    id: 'ANO-005',
    serviceName: 'redis-cache-cluster',
    metricAffected: 'Memory Usage',
    severity: 'medium',
    confidence: 82,
    firstSeen: '2025-12-30 10:20:33',
    status: 'suppressed',
    provider: 'AWS',
    serviceType: 'Database',
    description: 'Memory usage in the Redis cache cluster exceeded the expected threshold.',
    detectedTime: '2025-12-30 10:20:33',
    duration: '10 minutes',
    region: 'us-east-1',
    appName: 'redis-cache-cluster',
    usersImpacted: 150,
    currentValue: '800MB',
    baselineValue: '500MB',
    deviation: '60%'
  },
  {
    id: 'ANO-006',
    serviceName: 'kubernetes-nodes',
    metricAffected: 'Pod Restart Rate',
    severity: 'critical',
    confidence: 96,
    firstSeen: '2025-12-30 09:15:48',
    status: 'investigating',
    provider: 'GCP',
    serviceType: 'Compute',
    assignedTo: 'Sarah Johnson',
    description: 'Pod restart rate increased significantly in the Kubernetes nodes.',
    detectedTime: '2025-12-30 09:15:48',
    duration: '15 minutes',
    region: 'us-central1',
    appName: 'kubernetes-nodes',
    usersImpacted: 400,
    currentValue: '5%',
    baselineValue: '1%',
    deviation: '400%'
  },
  {
    id: 'ANO-007',
    serviceName: 'load-balancer-prod',
    metricAffected: 'Request Rate',
    severity: 'low',
    confidence: 68,
    firstSeen: '2025-12-30 08:45:12',
    status: 'resolved',
    provider: 'Azure',
    serviceType: 'Network',
    description: 'Request rate in the load balancer exceeded the expected threshold.',
    detectedTime: '2025-12-30 08:45:12',
    duration: '5 minutes',
    region: 'westeurope',
    appName: 'load-balancer-prod',
    usersImpacted: 1000,
    currentValue: '1500req/s',
    baselineValue: '1000req/s',
    deviation: '50%'
  },
  {
    id: 'ANO-008',
    serviceName: 'auth-service',
    metricAffected: 'Error Rate',
    severity: 'high',
    confidence: 89,
    firstSeen: '2025-12-30 07:30:25',
    status: 'active',
    provider: 'AWS',
    serviceType: 'Application',
    description: 'Error rate in the authentication service increased significantly.',
    detectedTime: '2025-12-30 07:30:25',
    duration: '10 minutes',
    region: 'us-east-1',
    appName: 'auth-service',
    usersImpacted: 500,
    currentValue: '5%',
    baselineValue: '1%',
    deviation: '400%'
  }
];

export function AnomalyDetection({ onNavigate, onLogout }: AnomalyDetectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [confidenceRange, setConfidenceRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState('Last 24 Hours');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDateRange, setExportDateRange] = useState('current');
  const [includeFilters, setIncludeFilters] = useState(true);
  const [showSuppressModal, setShowSuppressModal] = useState(false);
  const [suppressAction, setSuppressAction] = useState<'flag' | 'suppress'>('suppress');
  const [suppressReason, setSuppressReason] = useState('');
  const [suppressDuration, setSuppressDuration] = useState('1hour');
  const [selectedAnomalyForSuppress, setSelectedAnomalyForSuppress] = useState<Anomaly | null>(null);
  const [showRCAModal, setShowRCAModal] = useState(false);
  const [selectedAnomalyForRCA, setSelectedAnomalyForRCA] = useState<Anomaly | null>(null);

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

  // Action handlers
  const handleViewDetails = (anomalyId: string) => {
    const anomaly = mockAnomalies.find(a => a.id === anomalyId);
    if (anomaly) {
      setSelectedAnomaly(anomaly);
      setShowDetailsModal(true);
    }
  };

  const handleInvestigate = (anomalyId: string) => {
    alert(`Starting investigation for Anomaly ${anomalyId}\n\nActions taken:\n- Creating investigation workspace\n- Gathering related logs\n- Correlating events\n- Notifying on-call engineer`);
  };

  const handleSuppress = (anomalyId: string) => {
    if (confirm(`Are you sure you want to suppress Anomaly ${anomalyId}?\n\nThis will:\n- Hide the anomaly from active view\n- Stop generating alerts\n- Keep for historical records`)) {
      alert(`Anomaly ${anomalyId} has been suppressed successfully.`);
    }
  };

  const handleResolve = (anomalyId: string) => {
    const resolution = prompt(`Resolving Anomaly ${anomalyId}\n\nPlease enter resolution notes:`);
    if (resolution) {
      alert(`Anomaly ${anomalyId} marked as resolved.\n\nResolution notes: ${resolution}`);
    }
  };

  const handleExportData = () => {
    setShowExportModal(true);
  };

  // Filter anomalies
  const filteredAnomalies = mockAnomalies.filter(anomaly => {
    const matchesSearch = anomaly.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         anomaly.metricAffected.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         anomaly.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || anomaly.severity === selectedSeverity;
    const matchesProvider = selectedProvider === 'all' || anomaly.provider === selectedProvider;
    const matchesServiceType = selectedServiceType === 'all' || anomaly.serviceType === selectedServiceType;
    const matchesStatus = selectedStatus === 'all' || anomaly.status === selectedStatus;
    const matchesConfidence = anomaly.confidence >= confidenceRange[0] && anomaly.confidence <= confidenceRange[1];
    
    return matchesSearch && matchesSeverity && matchesProvider && matchesServiceType && matchesStatus && matchesConfidence;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAnomalies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnomalies = filteredAnomalies.slice(startIndex, endIndex);

  // Calculate KPIs
  const activeAnomalies = mockAnomalies.filter(a => a.status === 'active').length;
  const criticalAnomalies = mockAnomalies.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const affectedServices = new Set(mockAnomalies.filter(a => a.status === 'active').map(a => a.serviceName)).size;
  const avgConfidence = Math.round(mockAnomalies.reduce((sum, a) => sum + a.confidence, 0) / mockAnomalies.length);

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
      case 'investigating': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'suppressed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <DashboardLayout currentPage="anomaly-detection" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl mb-6">
          {/* Header Row with Title and Search/Date */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl mb-2">Anomaly Detection Engine</h1>
              <p className="text-white/80 text-sm">Real-time anomaly monitoring powered by machine learning</p>
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
                <span className="text-gray-600 text-xs">Active Anomalies</span>
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{activeAnomalies}</div>
              <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                8 from last week
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Critical Anomalies</span>
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{criticalAnomalies}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                6min improvement
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Affected Services</span>
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Cloud className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{affectedServices}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                0.5% this month
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Confidence Avg</span>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{avgConfidence}%</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                4% this month
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">MTTA</span>
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">18m</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                15% improvement
              </div>
            </div>
          </div>
        </div>

        {/* Filter Button - Outside Hero, Right Side */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredAnomalies.length} anomalies found
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate?.('service-anomaly-dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-all"
            >
              <Activity className="w-4 h-4" />
              <span>Service Anomaly Dashboard</span>
            </button>
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
              {(selectedSeverity !== 'all' || selectedProvider !== 'all' || selectedServiceType !== 'all' || selectedStatus !== 'all' || confidenceRange[0] !== 0 || confidenceRange[1] !== 100) && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {[selectedSeverity !== 'all', selectedProvider !== 'all', selectedServiceType !== 'all', selectedStatus !== 'all', confidenceRange[0] !== 0 || confidenceRange[1] !== 100].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Side Sheet */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="right" className="w-96 sm:max-w-md">
            <SheetTitle>Filter Anomalies</SheetTitle>
            <SheetDescription>
              Refine your anomaly search by applying filters below
            </SheetDescription>
            
            <div className="py-[24px] space-y-6 px-[20px]">
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

              {/* Cloud Provider Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Cloud Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                >
                  <option value="all">All Providers</option>
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="GCP">GCP</option>
                </select>
              </div>

              {/* Service Type Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Service Type</label>
                <select
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                >
                  <option value="all">All Types</option>
                  <option value="Compute">Compute</option>
                  <option value="Database">Database</option>
                  <option value="Network">Network</option>
                  <option value="Application">Application</option>
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
                  <option value="investigating">Investigating</option>
                  <option value="suppressed">Suppressed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Confidence Range */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Confidence Range: {confidenceRange[0]}% - {confidenceRange[1]}%
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500">Min: {confidenceRange[0]}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={confidenceRange[0]}
                      onChange={(e) => setConfidenceRange([parseInt(e.target.value), confidenceRange[1]])}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Max: {confidenceRange[1]}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={confidenceRange[1]}
                      onChange={(e) => setConfidenceRange([confidenceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedSeverity('all');
                    setSelectedProvider('all');
                    setSelectedServiceType('all');
                    setSelectedStatus('all');
                    setConfidenceRange([0, 100]);
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
          </SheetContent>
        </Sheet>

        {/* Main Cards List */}
        <div className="space-y-3">
          {currentAnomalies.map((anomaly) => (
            <div 
              key={anomaly.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 pr-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Section - Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Header Row - ID, Badges, Status */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-cyan-600">{anomaly.id}</span>
                    <Badge className={`${getSeverityColor(anomaly.severity)} border uppercase text-xs`}>
                      {anomaly.severity}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${anomaly.status === 'active' ? 'bg-red-500' : anomaly.status === 'investigating' ? 'bg-yellow-500' : anomaly.status === 'resolved' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-gray-600 uppercase">{anomaly.status}</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 border text-xs">
                      {anomaly.confidence}% confidence
                    </Badge>
                  </div>

                  {/* Service Name */}
                  <h3 className="text-base text-gray-900 mb-2">{anomaly.serviceName}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">{anomaly.metricAffected} spike detected - {anomaly.deviation} above baseline</p>

                  {/* Metadata Icons Row */}
                  <div className="flex items-center flex-nowrap gap-4 text-xs text-gray-500 overflow-x-auto">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Activity className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{anomaly.metricAffected}</span>
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>2 min ago • Duration: {anomaly.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Cloud className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{anomaly.provider} / {anomaly.region}</span>
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Server className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{anomaly.appName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{anomaly.usersImpacted.toLocaleString()} users impacted</span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Metrics & Actions */}
                <div className="flex items-start gap-6 ml-8">
                  {/* Metrics */}
                  <div className="text-right">
                    <div className="text-sm text-gray-900 mb-1 whitespace-nowrap">
                      {anomaly.currentValue} <span className="text-gray-400">/ {anomaly.baselineValue} baseline</span>
                    </div>
                    
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={() => {
                              onNavigate?.('anomaly-details', undefined, anomaly.id);
                            }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAnomalyForRCA(anomaly);
                              setShowRCAModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Run RCA</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAnomalyForSuppress(anomaly);
                              setShowSuppressModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Flag/Suppress</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 px-6 py-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAnomalies.length)} of {filteredAnomalies.length} anomalies
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

        {/* Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Anomaly Details - {selectedAnomaly?.id}</DialogTitle>
              <DialogDescription>
                Comprehensive analysis and context for this anomaly
              </DialogDescription>
            </DialogHeader>
            
            {selectedAnomaly && (
              <div className="space-y-6 mt-4">
                {/* Anomaly Summary Panel */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Anomaly Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Description</label>
                      <p className="text-sm text-gray-900">
                        {selectedAnomaly.metricAffected} anomaly detected in {selectedAnomaly.serviceName} 
                        showing unusual pattern deviating from baseline by 340%
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Severity</label>
                      <Badge className={`${getSeverityColor(selectedAnomaly.severity)} border`}>
                        {selectedAnomaly.severity}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Confidence</label>
                      <span className={`text-sm ${getConfidenceColor(selectedAnomaly.confidence)}`}>
                        {selectedAnomaly.confidence}%
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Impacted Resources</label>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-900">{selectedAnomaly.serviceName}</span>
                        <span className="text-xs text-gray-500">{selectedAnomaly.provider} • {selectedAnomaly.serviceType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metric Visualization */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Metric Visualization</h3>
                  <div className="space-y-4">
                    {/* Placeholder chart - would use recharts in real implementation */}
                    <div className="h-64 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-200 p-4 relative overflow-hidden">
                      {/* Simulated chart */}
                      <div className="absolute inset-0 flex items-end px-4 pb-4">
                        <div className="w-full h-full relative">
                          {/* Baseline line */}
                          <div className="absolute bottom-1/2 left-0 right-0 border-b-2 border-dashed border-gray-400"></div>
                          <span className="absolute right-0 bottom-1/2 text-xs text-gray-500 bg-white px-1">Baseline</span>
                          
                          {/* Expected range band */}
                          <div className="absolute bottom-[40%] left-0 right-0 h-[20%] bg-green-100 bg-opacity-50 border-y border-green-300"></div>
                          <span className="absolute right-0 bottom-[40%] text-xs text-green-600 bg-white px-1">Range</span>
                          
                          {/* Anomaly spike */}
                          <div className="absolute bottom-1/2 right-1/4 w-2 h-32 bg-red-500"></div>
                          <div className="absolute bottom-full right-1/4 transform -translate-x-1/2 mb-2">
                            <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs">
                              Anomaly Detected
                            </Badge>
                          </div>
                          
                          {/* Deployment marker */}
                          <div className="absolute bottom-0 left-1/3 flex flex-col items-center">
                            <div className="w-0.5 h-full bg-purple-400"></div>
                            <span className="text-xs text-purple-600 mt-1">Deploy</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="text-sm text-gray-700">Actual vs Baseline</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-gray-600">Actual Value</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-dashed border-gray-400"></div>
                        <span className="text-gray-600">Baseline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-100 border border-green-300"></div>
                        <span className="text-gray-600">Expected Range</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Context Signals */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Context Signals</h3>
                  <div className="space-y-4">
                    {/* Recent Deployments */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">Recent Deployments</span>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">auth-service v2.3.1</span>
                          <span className="text-xs text-gray-500">12:30 UTC</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">api-gateway v1.8.2</span>
                          <span className="text-xs text-gray-500">11:15 UTC</span>
                        </div>
                      </div>
                    </div>

                    {/* Traffic Spikes */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-900">Traffic Spikes</span>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">+250% increase in API calls</span>
                          <span className="text-xs text-gray-500">14:20 UTC</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Peak concurrent users: 15,000</span>
                          <span className="text-xs text-gray-500">14:25 UTC</span>
                        </div>
                      </div>
                    </div>

                    {/* Config Changes */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Config Changes</span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Database connection pool: 50 → 100</span>
                          <span className="text-xs text-gray-500">13:45 UTC</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Cache TTL updated: 300s → 600s</span>
                          <span className="text-xs text-gray-500">13:30 UTC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedAnomalyForRCA(selectedAnomaly);
                      setShowRCAModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#AE275F] text-white rounded-lg text-sm hover:bg-[#8B1F4D] transition-all"
                  >
                    <Brain className="w-4 h-4" />
                    Run RCA
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      onNavigate?.('alerting');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-all"
                  >
                    <Bell className="w-4 h-4" />
                    Escalate to Alerting
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Mark ${selectedAnomaly.id} as false positive?\n\nThis will help improve the ML model.`)) {
                        alert(`${selectedAnomaly.id} marked as false positive.`);
                        setShowDetailsModal(false);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Mark as False Positive
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
                Export Anomaly Data
              </DialogTitle>
              <DialogDescription>
                Configure export settings for anomaly detection data
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
                  <option value="all">All Anomalies</option>
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
                  <p>• Records: {includeFilters ? filteredAnomalies.length : mockAnomalies.length} anomalies</p>
                  <p>• Date Range: {exportDateRange === 'current' ? dateRange : exportDateRange === 'all' ? 'All Time' : exportDateRange.replace('last', 'Last ').replace('days', ' Days')}</p>
                  <p>• Filters: {includeFilters ? `Applied (${[selectedSeverity !== 'all', selectedProvider !== 'all', selectedServiceType !== 'all', selectedStatus !== 'all', confidenceRange[0] !== 0 || confidenceRange[1] !== 100].filter(Boolean).length} active)` : 'None'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    const recordCount = includeFilters ? filteredAnomalies.length : mockAnomalies.length;
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

        {/* Flag/Suppress Modal */}
        <Dialog open={showSuppressModal} onOpenChange={setShowSuppressModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Flag or Suppress Anomaly
              </DialogTitle>
              <DialogDescription>
                {selectedAnomalyForSuppress ? `Managing anomaly ${selectedAnomalyForSuppress.id} - ${selectedAnomalyForSuppress.serviceName}` : ''}
              </DialogDescription>
            </DialogHeader>

            {selectedAnomalyForSuppress && (
              <div className="space-y-5 mt-4">
                {/* Action Type Selection */}
                <div>
                  <label className="block text-sm text-gray-700 mb-3">Action Type:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSuppressAction('flag')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        suppressAction === 'flag'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className={`w-5 h-5 ${suppressAction === 'flag' ? 'text-orange-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${suppressAction === 'flag' ? 'text-orange-900' : 'text-gray-700'}`}>Flag as Review</span>
                      </div>
                      <p className="text-xs text-gray-500">Mark for manual review without suppression</p>
                    </button>

                    <button
                      onClick={() => setSuppressAction('suppress')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        suppressAction === 'suppress'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <X className={`w-5 h-5 ${suppressAction === 'suppress' ? 'text-red-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${suppressAction === 'suppress' ? 'text-red-900' : 'text-gray-700'}`}>Suppress</span>
                      </div>
                      <p className="text-xs text-gray-500">Hide anomaly and stop alerts</p>
                    </button>
                  </div>
                </div>

                {/* Duration (only for suppress) */}
                {suppressAction === 'suppress' && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Suppression Duration:</label>
                    <select
                      value={suppressDuration}
                      onChange={(e) => setSuppressDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                    >
                      <option value="1hour">1 Hour</option>
                      <option value="6hours">6 Hours</option>
                      <option value="24hours">24 Hours</option>
                      <option value="7days">7 Days</option>
                      <option value="30days">30 Days</option>
                      <option value="permanent">Permanent</option>
                    </select>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Reason {suppressAction === 'flag' ? '(Optional)' : '(Required)'}:
                  </label>
                  <select
                    value={suppressReason}
                    onChange={(e) => setSuppressReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50 mb-2"
                  >
                    <option value="">Select a reason...</option>
                    <option value="false-positive">False Positive - ML Model Error</option>
                    <option value="expected-behavior">Expected Behavior - Planned Activity</option>
                    <option value="known-issue">Known Issue - Already Tracking</option>
                    <option value="maintenance">Scheduled Maintenance</option>
                    <option value="low-priority">Low Priority - Will Address Later</option>
                    <option value="duplicate">Duplicate Anomaly</option>
                    <option value="other">Other - See Notes</option>
                  </select>
                  <textarea
                    placeholder="Add additional notes (optional)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50 resize-none"
                    rows={3}
                  />
                </div>

                {/* Summary Box */}
                <div className={`p-4 rounded-lg border-2 ${
                  suppressAction === 'flag' 
                    ? 'bg-orange-50 border-orange-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`text-sm mb-2 ${suppressAction === 'flag' ? 'text-orange-900' : 'text-red-900'}`}>
                    <strong>{suppressAction === 'flag' ? 'Flag Summary' : 'Suppression Summary'}:</strong>
                  </p>
                  <div className={`text-xs space-y-1 ${suppressAction === 'flag' ? 'text-orange-800' : 'text-red-800'}`}>
                    <p>• Anomaly: {selectedAnomalyForSuppress.id}</p>
                    <p>• Service: {selectedAnomalyForSuppress.serviceName}</p>
                    <p>• Action: {suppressAction === 'flag' ? 'Flag for Review' : 'Suppress'}</p>
                    {suppressAction === 'suppress' && (
                      <p>• Duration: {suppressDuration === 'permanent' ? 'Permanent' : suppressDuration.replace('hour', ' Hour').replace('days', ' Days')}</p>
                    )}
                    {suppressReason && <p>• Reason: {suppressReason.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>}
                  </div>
                  {suppressAction === 'suppress' && (
                    <p className="text-xs text-red-700 mt-3 pt-3 border-t border-red-200">
                      ⚠️ This will hide the anomaly from the active view and stop generating alerts.
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (suppressAction === 'suppress' && !suppressReason) {
                        alert('Please select a reason for suppression.');
                        return;
                      }
                      const actionText = suppressAction === 'flag' ? 'flagged for review' : 'suppressed';
                      const durationText = suppressAction === 'suppress' ? `\nDuration: ${suppressDuration === 'permanent' ? 'Permanent' : suppressDuration}` : '';
                      alert(`Anomaly ${selectedAnomalyForSuppress.id} has been ${actionText}.\n${durationText}\nReason: ${suppressReason || 'None provided'}`);
                      setShowSuppressModal(false);
                      setSuppressAction('suppress');
                      setSuppressReason('');
                      setSuppressDuration('1hour');
                      setSelectedAnomalyForSuppress(null);
                    }}
                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                      suppressAction === 'flag'
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {suppressAction === 'flag' ? 'Flag Anomaly' : 'Suppress Anomaly'}
                  </button>
                  <button
                    onClick={() => {
                      setShowSuppressModal(false);
                      setSuppressAction('suppress');
                      setSuppressReason('');
                      setSuppressDuration('1hour');
                      setSelectedAnomalyForSuppress(null);
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

        {/* RCA Modal */}
        <Dialog open={showRCAModal} onOpenChange={setShowRCAModal}>
          <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#AE275F]" />
                Root Cause Analysis - {selectedAnomalyForRCA?.id}
              </DialogTitle>
              <DialogDescription>
                AI-powered analysis identifying the root cause of this anomaly
              </DialogDescription>
            </DialogHeader>

            {selectedAnomalyForRCA && (
              <div className="space-y-6 mt-4">
                {/* Anomaly Summary */}
                <div className="bg-gradient-to-r from-[#AE275F]/5 to-purple-50 border border-[#AE275F]/20 rounded-lg p-5">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Service</label>
                      <p className="text-sm font-medium text-gray-900">{selectedAnomalyForRCA.serviceName}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Metric Affected</label>
                      <p className="text-sm font-medium text-gray-900">{selectedAnomalyForRCA.metricAffected}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Severity</label>
                      <Badge className={`${getSeverityColor(selectedAnomalyForRCA.severity)} border`}>
                        {selectedAnomalyForRCA.severity}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Detected</label>
                      <p className="text-sm text-gray-700">{selectedAnomalyForRCA.detectedTime}</p>
                    </div>
                  </div>
                </div>

                {/* AI Analysis Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">AI Analysis Complete</h3>
                      <p className="text-xs text-blue-700">
                        Analyzed 47 correlated events, 12 service dependencies, and 23 configuration changes
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 flex-1 bg-blue-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="text-xs text-blue-600 font-medium">100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Root Cause Identified */}
                <div className="border-2 border-red-200 bg-red-50 rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Target className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-red-900 mb-2">Root Cause Identified</h3>
                      <p className="text-sm text-red-800 leading-relaxed">
                        Database connection pool exhaustion caused by unexpected traffic spike following deployment of auth-service v2.3.1. 
                        The new authentication flow increased DB queries per request by 3x without corresponding pool size adjustment.
                      </p>
                    </div>
                    <Badge className="bg-red-100 text-red-700 border-red-300 border">
                      Confidence: 94%
                    </Badge>
                  </div>

                  {/* Contributing Factors */}
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Contributing Factors</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                        <p className="text-sm text-gray-700">Deployment of auth-service v2.3.1 at 12:30 UTC</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                        <p className="text-sm text-gray-700">250% increase in API traffic at 14:20 UTC</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                        <p className="text-sm text-gray-700">Connection pool size remained at default 50 connections</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                        <p className="text-sm text-gray-700">No auto-scaling configuration for database pool</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Timeline */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    Event Timeline
                  </h3>
                  <div className="space-y-3">
                    {[
                      { time: '12:30 UTC', event: 'auth-service v2.3.1 deployed', type: 'deployment', icon: Activity },
                      { time: '13:15 UTC', event: 'Connection pool utilization increased to 75%', type: 'warning', icon: AlertTriangle },
                      { time: '14:20 UTC', event: 'Traffic spike detected (+250% API calls)', type: 'critical', icon: TrendingUp },
                      { time: '14:23 UTC', event: 'Anomaly detected: Response time spike', type: 'anomaly', icon: Zap },
                      { time: '14:25 UTC', event: 'Connection pool exhausted (100% utilization)', type: 'critical', icon: Server },
                      { time: '14:30 UTC', event: 'RCA analysis initiated', type: 'info', icon: Brain }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      const colorMap = {
                        deployment: 'bg-purple-50 border-purple-200 text-purple-700',
                        warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                        critical: 'bg-red-50 border-red-200 text-red-700',
                        anomaly: 'bg-orange-50 border-orange-200 text-orange-700',
                        info: 'bg-blue-50 border-blue-200 text-blue-700'
                      };
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`p-2 rounded-lg border ${colorMap[item.type as keyof typeof colorMap]}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            {idx < 5 && <div className="w-0.5 h-8 bg-gray-200"></div>}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs text-gray-500 font-medium">{item.time}</span>
                            </div>
                            <p className="text-sm text-gray-900">{item.event}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Correlated Services */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Server className="w-4 h-4 text-gray-600" />
                    Affected Services
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'auth-service', impact: 'High', status: 'degraded' },
                      { name: 'api-gateway-prod', impact: 'High', status: 'degraded' },
                      { name: 'postgres-db-01', impact: 'Critical', status: 'critical' },
                      { name: 'user-service', impact: 'Medium', status: 'healthy' },
                      { name: 'notification-service', impact: 'Low', status: 'healthy' },
                      { name: 'payment-service', impact: 'Medium', status: 'warning' }
                    ].map((service, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{service.name}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            service.status === 'critical' ? 'bg-red-500' :
                            service.status === 'degraded' ? 'bg-orange-500' :
                            service.status === 'warning' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                        </div>
                        <p className="text-xs text-gray-600">Impact: <span className="font-medium">{service.impact}</span></p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                  <h3 className="text-base font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Recommended Actions
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        priority: 'Immediate',
                        action: 'Increase database connection pool size from 50 to 150',
                        impact: 'Will restore service performance within 2 minutes',
                        color: 'red'
                      },
                      {
                        priority: 'Short-term',
                        action: 'Roll back auth-service to v2.3.0 or optimize query patterns',
                        impact: 'Reduces queries per request by 66%',
                        color: 'orange'
                      },
                      {
                        priority: 'Long-term',
                        action: 'Implement auto-scaling for connection pool based on traffic',
                        impact: 'Prevents future occurrences of similar issues',
                        color: 'blue'
                      },
                      {
                        priority: 'Long-term',
                        action: 'Add performance testing to deployment pipeline',
                        impact: 'Catches performance regressions before production',
                        color: 'blue'
                      }
                    ].map((rec, idx) => {
                      const priorityColors = {
                        red: 'bg-red-100 text-red-700 border-red-200',
                        orange: 'bg-orange-100 text-orange-700 border-orange-200',
                        blue: 'bg-blue-100 text-blue-700 border-blue-200'
                      };
                      return (
                        <div key={idx} className="bg-white border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Badge className={`${priorityColors[rec.color as keyof typeof priorityColors]} border mt-0.5`}>
                              {rec.priority}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">{rec.action}</p>
                              <p className="text-xs text-gray-600">{rec.impact}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      alert(`Initiating immediate remediation for ${selectedAnomalyForRCA.id}:\n\n✓ Increasing connection pool to 150\n✓ Notifying DevOps team\n✓ Creating incident ticket\n✓ Updating runbooks`);
                      setShowRCAModal(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#AE275F] text-white rounded-lg text-sm hover:bg-[#8B1F4D] transition-all font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Apply Immediate Fix
                  </button>
                  <button
                    onClick={() => {
                      alert(`Creating detailed incident report for ${selectedAnomalyForRCA.id}:\n\n✓ RCA findings documented\n✓ Timeline captured\n✓ Action items assigned\n✓ Stakeholders notified`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Generate Incident Report
                  </button>
                  <button
                    onClick={() => setShowRCAModal(false)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-all font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageContainer>
    </DashboardLayout>
  );
}