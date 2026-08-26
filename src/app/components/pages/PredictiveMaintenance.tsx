import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  Wrench,
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
  DollarSign,
  Shield,
  Eye,
  Server,
  Database,
  HardDrive,
  Cpu,
  PlayCircle,
  Settings,
  Plus,
  Minus
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog';

interface PredictiveResource {
  id: string;
  resourceName: string;
  resourceType: 'CPU' | 'Memory' | 'Storage' | 'Network';
  failureType: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  predictedDate: string;
  confidence: number;
  service: string;
  provider: 'AWS' | 'Azure' | 'GCP';
  weeksToCapacity?: number;
  currentUtilization: number;
  forecastedUtilization: number;
  costOfInaction?: string;
}

interface PredictiveMaintenanceProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const mockPredictiveResources: PredictiveResource[] = [
  {
    id: 'PM-001',
    resourceName: 'prod-db-01-storage',
    resourceType: 'Storage',
    failureType: 'Disk Capacity Exhaustion',
    riskLevel: 'critical',
    predictedDate: '2025-01-15',
    confidence: 94,
    service: 'postgres-db-01',
    provider: 'AWS',
    weeksToCapacity: 2,
    currentUtilization: 87,
    forecastedUtilization: 98,
    costOfInaction: '$45,000'
  },
  {
    id: 'PM-002',
    resourceName: 'api-gateway-memory',
    resourceType: 'Memory',
    failureType: 'Memory Leak Progression',
    riskLevel: 'high',
    predictedDate: '2025-01-20',
    confidence: 89,
    service: 'api-gateway-prod',
    provider: 'Azure',
    weeksToCapacity: 3,
    currentUtilization: 76,
    forecastedUtilization: 92,
    costOfInaction: '$28,000'
  },
  {
    id: 'PM-003',
    resourceName: 'worker-pool-cpu',
    resourceType: 'CPU',
    failureType: 'CPU Saturation',
    riskLevel: 'high',
    predictedDate: '2025-01-12',
    confidence: 91,
    service: 'ec2-worker-pool',
    provider: 'AWS',
    weeksToCapacity: 2,
    currentUtilization: 82,
    forecastedUtilization: 95,
    costOfInaction: '$32,500'
  },
  {
    id: 'PM-004',
    resourceName: 'cache-cluster-memory',
    resourceType: 'Memory',
    failureType: 'Cache Eviction Threshold',
    riskLevel: 'medium',
    predictedDate: '2025-01-25',
    confidence: 78,
    service: 'redis-cache-cluster',
    provider: 'AWS',
    weeksToCapacity: 4,
    currentUtilization: 68,
    forecastedUtilization: 88,
    costOfInaction: '$18,000'
  },
  {
    id: 'PM-005',
    resourceName: 'cdn-bandwidth',
    resourceType: 'Network',
    failureType: 'Bandwidth Capacity Limit',
    riskLevel: 'medium',
    predictedDate: '2025-02-01',
    confidence: 72,
    service: 'cdn-edge-us-east',
    provider: 'GCP',
    weeksToCapacity: 5,
    currentUtilization: 64,
    forecastedUtilization: 85,
    costOfInaction: '$22,000'
  },
  {
    id: 'PM-006',
    resourceName: 'k8s-node-pool-cpu',
    resourceType: 'CPU',
    failureType: 'Node Pool Exhaustion',
    riskLevel: 'critical',
    predictedDate: '2025-01-10',
    confidence: 96,
    service: 'kubernetes-nodes',
    provider: 'GCP',
    weeksToCapacity: 1,
    currentUtilization: 91,
    forecastedUtilization: 99,
    costOfInaction: '$52,000'
  },
  {
    id: 'PM-007',
    resourceName: 'backup-storage',
    resourceType: 'Storage',
    failureType: 'Backup Storage Full',
    riskLevel: 'low',
    predictedDate: '2025-02-10',
    confidence: 65,
    service: 'backup-service',
    provider: 'Azure',
    weeksToCapacity: 6,
    currentUtilization: 58,
    forecastedUtilization: 78,
    costOfInaction: '$12,000'
  },
  {
    id: 'PM-008',
    resourceName: 'auth-db-connections',
    resourceType: 'CPU',
    failureType: 'Connection Pool Depletion',
    riskLevel: 'high',
    predictedDate: '2025-01-18',
    confidence: 88,
    service: 'auth-service',
    provider: 'AWS',
    weeksToCapacity: 3,
    currentUtilization: 79,
    forecastedUtilization: 94,
    costOfInaction: '$35,000'
  }
];

export function PredictiveMaintenance({ onNavigate, onLogout }: PredictiveMaintenanceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [confidenceRange, setConfidenceRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [forecastHorizon, setForecastHorizon] = useState('4 Weeks');
  const [showHorizonDropdown, setShowHorizonDropdown] = useState(false);

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<PredictiveResource | null>(null);
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [maintenanceNotes, setMaintenanceNotes] = useState('');
  const [scaleAmount, setScaleAmount] = useState('25');
  const [scaleType, setScaleType] = useState('percentage');
  const [ticketPriority, setTicketPriority] = useState('high');
  const [ticketAssignee, setTicketAssignee] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDateRange, setExportDateRange] = useState('current');
  const [includeFilters, setIncludeFilters] = useState(true);

  const horizonOptions = ['1 Week', '4 Weeks', '12 Weeks'];

  // Filter resources
  const filteredResources = mockPredictiveResources.filter(resource => {
    const matchesSearch = resource.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskLevel === 'all' || resource.riskLevel === selectedRiskLevel;
    const matchesType = selectedResourceType === 'all' || resource.resourceType === selectedResourceType;
    const matchesProvider = selectedProvider === 'all' || resource.provider === selectedProvider;
    const matchesConfidence = resource.confidence >= confidenceRange[0] && resource.confidence <= confidenceRange[1];
    
    return matchesSearch && matchesRisk && matchesType && matchesProvider && matchesConfidence;
  });

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResources = filteredResources.slice(startIndex, endIndex);

  // Calculate KPIs
  const resourcesAtRisk = mockPredictiveResources.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'high').length;
  const minWeeksToCapacity = Math.min(...mockPredictiveResources.filter(r => r.weeksToCapacity).map(r => r.weeksToCapacity!));
  const totalCostOfInaction = mockPredictiveResources
    .filter(r => r.costOfInaction)
    .reduce((sum, r) => sum + parseInt(r.costOfInaction!.replace(/[$,]/g, '')), 0);
  const forecastAccuracy = 92;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'CPU': return Cpu;
      case 'Memory': return Server;
      case 'Storage': return HardDrive;
      case 'Network': return Activity;
      default: return Server;
    }
  };

  const handleExportData = () => {
    setShowExportModal(true);
  };

  // Modal handlers
  const handleViewDetails = (resourceId: string) => {
    const resource = mockPredictiveResources.find(r => r.id === resourceId);
    if (resource) {
      setSelectedResource(resource);
      setShowDetailsModal(true);
    }
  };

  const handleScheduleMaintenance = (resourceId: string) => {
    const resource = mockPredictiveResources.find(r => r.id === resourceId);
    if (resource) {
      setSelectedResource(resource);
      setShowMaintenanceModal(true);
    }
  };

  const handleScaleResource = (resourceId: string) => {
    const resource = mockPredictiveResources.find(r => r.id === resourceId);
    if (resource) {
      setSelectedResource(resource);
      setShowScaleModal(true);
    }
  };

  const handleCreateTicket = (resourceId: string) => {
    const resource = mockPredictiveResources.find(r => r.id === resourceId);
    if (resource) {
      setSelectedResource(resource);
      setTicketDescription(`Predicted ${resource.failureType} for ${resource.resourceName} (${resource.id})\n\nRisk Level: ${resource.riskLevel}\nPredicted Date: ${resource.predictedDate}\nConfidence: ${resource.confidence}%\n\nPlease investigate and take necessary action.`);
      setShowTicketModal(true);
    }
  };

  return (
    <DashboardLayout currentPage="predictive-maintenance" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl mb-6">
          {/* Header Row with Title and Search/Date */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl mb-2">Predictive Maintenance & Capacity</h1>
              <p className="text-white/80 text-sm">AI-powered failure prediction and capacity planning</p>
            </div>
            
            {/* Search and Forecast Horizon - Inline */}
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

              {/* Forecast Horizon Selector */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowHorizonDropdown(!showHorizonDropdown)}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-lg transition-all whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{forecastHorizon}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showHorizonDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {horizonOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setForecastHorizon(option);
                          setShowHorizonDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          forecastHorizon === option ? "bg-[#AE275F]/10 text-[#AE275F]" : "text-gray-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KPI Cards - White Filled */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Resources at Risk</span>
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{resourcesAtRisk}</div>
              <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                2 new this week
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Weeks to Capacity</span>
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{minWeeksToCapacity}w</div>
              <div className="text-xs text-gray-500 mt-1">critical threshold</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Cost of Inaction</span>
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">${(totalCostOfInaction / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-500 mt-1">potential savings</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Forecast Accuracy</span>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{forecastAccuracy}%</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                1% this month
              </div>
            </div>
          </div>
        </div>

        {/* Filter Button - Outside Hero, Right Side */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredResources.length} resources found
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
              {(selectedRiskLevel !== 'all' || selectedResourceType !== 'all' || selectedProvider !== 'all') && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {[selectedRiskLevel !== 'all', selectedResourceType !== 'all', selectedProvider !== 'all'].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Side Sheet */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="right" className="w-96 sm:max-w-md">
            <SheetTitle>Filter Resources</SheetTitle>
            <SheetDescription>
              Refine your predictive maintenance search by applying filters below
            </SheetDescription>
            
            <div className="py-[24px] px-[20px]">
              <div className="space-y-6">
                {/* Risk Level Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Risk Level</label>
                  <select
                    value={selectedRiskLevel}
                    onChange={(e) => setSelectedRiskLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Resource Type Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Resource Type</label>
                  <select
                    value={selectedResourceType}
                    onChange={(e) => setSelectedResourceType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="all">All Types</option>
                    <option value="CPU">CPU</option>
                    <option value="Memory">Memory</option>
                    <option value="Storage">Storage</option>
                    <option value="Network">Network</option>
                  </select>
                </div>

                {/* Provider Filter */}
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
                      setSelectedRiskLevel('all');
                      setSelectedResourceType('all');
                      setSelectedProvider('all');
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
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Failure Type</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Predicted Date</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Utilization</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentResources.map((resource) => {
                  const ResourceIcon = getResourceIcon(resource.resourceType);
                  return (
                    <tr key={resource.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ResourceIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">{resource.resourceName}</span>
                            <span className="text-xs text-gray-500">{resource.service} • {resource.provider}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{resource.failureType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getRiskColor(resource.riskLevel)} border`}>
                          {resource.riskLevel}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{resource.predictedDate}</span>
                          {resource.weeksToCapacity && (
                            <span className="text-xs text-gray-500">{resource.weeksToCapacity} weeks</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${getConfidenceColor(resource.confidence)}`}>
                          {resource.confidence}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  resource.currentUtilization >= 85 ? 'bg-red-500' :
                                  resource.currentUtilization >= 70 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${resource.currentUtilization}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{resource.currentUtilization}%</span>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            Forecast: {resource.forecastedUtilization}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2 text-gray-400 hover:text-[#AE275F] hover:bg-[#AE275F]/10 rounded-lg transition-all" onClick={() => handleViewDetails(resource.id)}>
                                  <Eye className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" onClick={() => handleScheduleMaintenance(resource.id)}>
                                  <Settings className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Schedule Maintenance</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" onClick={() => handleScaleResource(resource.id)}>
                                  <TrendingUp className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Scale Resource</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all" onClick={() => handleCreateTicket(resource.id)}>
                                  <FileText className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Create Ticket</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredResources.length)} of {filteredResources.length} resources
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

        {/* Resource Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#AE275F]" />
                Resource Details
              </DialogTitle>
              <DialogDescription>
                Comprehensive predictive maintenance information
              </DialogDescription>
            </DialogHeader>

            {selectedResource && (
              <div className="space-y-6 mt-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 mb-1">{selectedResource.resourceName}</h3>
                      <p className="text-sm text-gray-600">{selectedResource.service} • {selectedResource.provider}</p>
                    </div>
                    <Badge className={`${getRiskColor(selectedResource.riskLevel)} border ml-4`}>
                      {selectedResource.riskLevel}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Resource ID:</span>
                      <span className="ml-2 text-gray-900">{selectedResource.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 text-gray-900">{selectedResource.resourceType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Predicted Date:</span>
                      <span className="ml-2 text-gray-900">{selectedResource.predictedDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Confidence:</span>
                      <span className={`ml-2 ${getConfidenceColor(selectedResource.confidence)}`}>{selectedResource.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Failure Prediction
                  </h4>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-gray-900 mb-2"><strong>Predicted Failure:</strong> {selectedResource.failureType}</p>
                    <p className="text-sm text-gray-700">Time to Capacity: <strong>{selectedResource.weeksToCapacity} weeks</strong></p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    Utilization Trends
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Current Utilization</div>
                      <div className="text-2xl text-gray-900">{selectedResource.currentUtilization}%</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full ${
                            selectedResource.currentUtilization >= 85 ? 'bg-red-500' :
                            selectedResource.currentUtilization >= 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${selectedResource.currentUtilization}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Forecasted Utilization</div>
                      <div className="text-2xl text-gray-900">{selectedResource.forecastedUtilization}%</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${selectedResource.forecastedUtilization}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {selectedResource.costOfInaction && (
                  <div>
                    <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                      Financial Impact
                    </h4>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-gray-900">Cost of Inaction: <strong className="text-xl">{selectedResource.costOfInaction}</strong></p>
                      <p className="text-xs text-gray-600 mt-1">Estimated revenue loss if no action is taken</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowMaintenanceModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Schedule Maintenance
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowScaleModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Scale Resource
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

        {/* Schedule Maintenance Modal */}
        <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Schedule Maintenance
              </DialogTitle>
              <DialogDescription>
                Plan preventive maintenance for this resource
              </DialogDescription>
            </DialogHeader>

            {selectedResource && (
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900">{selectedResource.resourceName}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedResource.id} • {selectedResource.failureType}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Maintenance Date:</label>
                  <input
                    type="date"
                    value={maintenanceDate}
                    onChange={(e) => setMaintenanceDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    max={selectedResource.predictedDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Predicted failure: {selectedResource.predictedDate}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Maintenance Notes:</label>
                  <textarea
                    value={maintenanceNotes}
                    onChange={(e) => setMaintenanceNotes(e.target.value)}
                    placeholder="Describe the maintenance plan..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50 resize-none"
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Recommended:</strong> Schedule maintenance before {selectedResource.predictedDate} to avoid {selectedResource.failureType}.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (!maintenanceDate) {
                        alert('Please select a maintenance date.');
                        return;
                      }
                      alert(`Maintenance scheduled for ${selectedResource.resourceName}\n\nDate: ${maintenanceDate}\nNotes: ${maintenanceNotes || 'None'}\n\nCalendar invite sent to team!`);
                      setShowMaintenanceModal(false);
                      setMaintenanceDate('');
                      setMaintenanceNotes('');
                      setSelectedResource(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => {
                      setShowMaintenanceModal(false);
                      setMaintenanceDate('');
                      setMaintenanceNotes('');
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

        {/* Scale Resource Modal */}
        <Dialog open={showScaleModal} onOpenChange={setShowScaleModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Scale Resource
              </DialogTitle>
              <DialogDescription>
                Increase resource capacity to prevent failure
              </DialogDescription>
            </DialogHeader>

            {selectedResource && (
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900">{selectedResource.resourceName}</p>
                  <p className="text-xs text-gray-500 mt-1">Current: {selectedResource.currentUtilization}% • Forecast: {selectedResource.forecastedUtilization}%</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Scale Type:</label>
                  <select
                    value={scaleType}
                    onChange={(e) => setScaleType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="percentage">Percentage Increase</option>
                    <option value="absolute">Absolute Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {scaleType === 'percentage' ? 'Increase by (%)' : `Increase by (${selectedResource.resourceType === 'Storage' ? 'GB' : selectedResource.resourceType === 'Memory' ? 'GB' : 'cores'})`}:
                  </label>
                  <input
                    type="number"
                    value={scaleAmount}
                    onChange={(e) => setScaleAmount(e.target.value)}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  />
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                  <p className="text-sm text-green-800">
                    <strong>Scaling Impact:</strong>
                  </p>
                  <p className="text-xs text-green-700">
                    • Reduces predicted utilization to ~{Math.max(0, selectedResource.forecastedUtilization - parseInt(scaleAmount || '0'))}%
                  </p>
                  <p className="text-xs text-green-700">
                    • Extends time to capacity by ~{Math.ceil(parseInt(scaleAmount || '0') / 10)} weeks
                  </p>
                  <p className="text-xs text-green-700">
                    • Estimated cost: ~${((parseInt(scaleAmount || '0') * 150)).toLocaleString()}/month
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (!scaleAmount || parseInt(scaleAmount) <= 0) {
                        alert('Please enter a valid scale amount.');
                        return;
                      }
                      alert(`Resource Scaling Initiated\n\nResource: ${selectedResource.resourceName}\nScale Amount: ${scaleAmount}${scaleType === 'percentage' ? '%' : ` ${selectedResource.resourceType === 'Storage' ? 'GB' : 'cores'}`}\n\nAutomation workflow triggered!`);
                      setShowScaleModal(false);
                      setScaleAmount('25');
                      setScaleType('percentage');
                      setSelectedResource(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Scale Now
                  </button>
                  <button
                    onClick={() => {
                      setShowScaleModal(false);
                      setScaleAmount('25');
                      setScaleType('percentage');
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

        {/* Create Ticket Modal */}
        <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Create Maintenance Ticket
              </DialogTitle>
              <DialogDescription>
                Create a ticket for manual review and action
              </DialogDescription>
            </DialogHeader>

            {selectedResource && (
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900">{selectedResource.resourceName}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedResource.id} • {selectedResource.failureType}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Priority:</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Assign to:</label>
                  <select
                    value={ticketAssignee}
                    onChange={(e) => setTicketAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="">Unassigned</option>
                    <option value="Infrastructure Team">Infrastructure Team</option>
                    <option value="Cloud Operations">Cloud Operations</option>
                    <option value="Database Team">Database Team</option>
                    <option value="DevOps Team">DevOps Team</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Description:</label>
                  <textarea
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (!ticketAssignee) {
                        alert('Please assign the ticket to a team.');
                        return;
                      }
                      alert(`Ticket Created Successfully!\n\nID: TICKET-${Math.floor(Math.random() * 10000)}\nPriority: ${ticketPriority}\nAssigned to: ${ticketAssignee}\n\nNotification sent to team!`);
                      setShowTicketModal(false);
                      setTicketPriority('high');
                      setTicketAssignee('');
                      setTicketDescription('');
                      setSelectedResource(null);
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Ticket
                  </button>
                  <button
                    onClick={() => {
                      setShowTicketModal(false);
                      setTicketPriority('high');
                      setTicketAssignee('');
                      setTicketDescription('');
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
                Export Predictive Maintenance Data
              </DialogTitle>
              <DialogDescription>
                Configure export settings for predictive maintenance data
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
                <label className="block text-sm text-gray-700 mb-2">Data Scope:</label>
                <select
                  value={exportDateRange}
                  onChange={(e) => setExportDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                >
                  <option value="current">Current View ({forecastHorizon})</option>
                  <option value="all">All Resources</option>
                  <option value="critical">Critical Risk Only</option>
                  <option value="highcritical">High & Critical Risk</option>
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
                  <p>• Records: {includeFilters ? filteredResources.length : mockPredictiveResources.length} resources</p>
                  <p>• Forecast Horizon: {forecastHorizon}</p>
                  <p>• Filters: {includeFilters ? `Applied (${[selectedRiskLevel !== 'all', selectedResourceType !== 'all', selectedProvider !== 'all'].filter(Boolean).length} active)` : 'None'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    const recordCount = includeFilters ? filteredResources.length : mockPredictiveResources.length;
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