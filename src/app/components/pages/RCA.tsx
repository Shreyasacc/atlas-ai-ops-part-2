import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  Brain,
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
  Zap,
  Shield,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Layers,
  GitBranch
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

interface RCAHypothesis {
  id: string;
  rank: number;
  hypothesis: string;
  confidence: number;
  evidenceCount: number;
  impact: 'critical' | 'high' | 'medium' | 'low';
  status: 'confirmed' | 'investigating' | 'rejected' | 'pending';
  anomalyId?: string;
  service: string;
  timeToRCA: string;
  correlatedSignals: number;
}

interface RCAProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const mockRCAHypotheses: RCAHypothesis[] = [
  {
    id: 'RCA-001',
    rank: 1,
    hypothesis: 'Database connection pool exhaustion due to memory leak in auth service v2.3.1',
    confidence: 96,
    evidenceCount: 24,
    impact: 'critical',
    status: 'confirmed',
    anomalyId: 'ANO-001',
    service: 'api-gateway-prod',
    timeToRCA: '45s',
    correlatedSignals: 18
  },
  {
    id: 'RCA-002',
    rank: 2,
    hypothesis: 'Increased API latency caused by degraded network performance between regions',
    confidence: 87,
    evidenceCount: 16,
    impact: 'high',
    status: 'investigating',
    anomalyId: 'ANO-002',
    service: 'postgres-db-01',
    timeToRCA: '1m 12s',
    correlatedSignals: 12
  },
  {
    id: 'RCA-003',
    rank: 3,
    hypothesis: 'CDN cache invalidation triggered by recent deployment at 12:30 UTC',
    confidence: 82,
    evidenceCount: 11,
    impact: 'medium',
    status: 'investigating',
    anomalyId: 'ANO-003',
    service: 'cdn-edge-us-east',
    timeToRCA: '2m 5s',
    correlatedSignals: 9
  },
  {
    id: 'RCA-004',
    rank: 4,
    hypothesis: 'CPU spike correlated with batch job execution overlapping with peak traffic',
    confidence: 91,
    evidenceCount: 19,
    impact: 'high',
    status: 'confirmed',
    anomalyId: 'ANO-004',
    service: 'ec2-worker-pool',
    timeToRCA: '38s',
    correlatedSignals: 15
  },
  {
    id: 'RCA-005',
    rank: 5,
    hypothesis: 'Redis memory pressure due to increased session storage without eviction policy',
    confidence: 78,
    evidenceCount: 13,
    impact: 'medium',
    status: 'investigating',
    anomalyId: 'ANO-005',
    service: 'redis-cache-cluster',
    timeToRCA: '1m 45s',
    correlatedSignals: 10
  },
  {
    id: 'RCA-006',
    rank: 6,
    hypothesis: 'Pod restart loop caused by OOMKilled events in container runtime',
    confidence: 94,
    evidenceCount: 21,
    impact: 'critical',
    status: 'confirmed',
    anomalyId: 'ANO-006',
    service: 'kubernetes-nodes',
    timeToRCA: '52s',
    correlatedSignals: 17
  },
  {
    id: 'RCA-007',
    rank: 7,
    hypothesis: 'Load balancer health check failures due to slow backend response times',
    confidence: 68,
    evidenceCount: 8,
    impact: 'low',
    status: 'rejected',
    anomalyId: 'ANO-007',
    service: 'load-balancer-prod',
    timeToRCA: '3m 20s',
    correlatedSignals: 6
  },
  {
    id: 'RCA-008',
    rank: 8,
    hypothesis: 'Authentication errors from expired OAuth tokens not being refreshed properly',
    confidence: 89,
    evidenceCount: 17,
    impact: 'high',
    status: 'investigating',
    anomalyId: 'ANO-008',
    service: 'auth-service',
    timeToRCA: '1m 8s',
    correlatedSignals: 13
  }
];

export function RCA({ onNavigate, onLogout }: RCAProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
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
  
  // Modal states
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedRCA, setSelectedRCA] = useState<RCAHypothesis | null>(null);
  const [rejectReason, setRejectReason] = useState('');
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

  // Action handlers
  const handleViewEvidence = (rcaId: string) => {
    const rca = mockRCAHypotheses.find(h => h.id === rcaId);
    if (rca) {
      setSelectedRCA(rca);
      setShowEvidenceModal(true);
    }
  };

  const handleConfirmRootCause = (rcaId: string) => {
    const rca = mockRCAHypotheses.find(h => h.id === rcaId);
    if (rca) {
      setSelectedRCA(rca);
      setShowConfirmModal(true);
    }
  };

  const handleRejectHypothesis = (rcaId: string) => {
    const rca = mockRCAHypotheses.find(h => h.id === rcaId);
    if (rca) {
      setSelectedRCA(rca);
      setShowRejectModal(true);
    }
  };

  const handleViewTimeline = (rcaId: string) => {
    const rca = mockRCAHypotheses.find(h => h.id === rcaId);
    if (rca) {
      // Navigate to RCA Details page
      if (onNavigate) {
        onNavigate('rca-details');
      }
    }
  };

  const handleExportData = () => {
    setShowExportModal(true);
  };

  // Filter hypotheses
  const filteredHypotheses = mockRCAHypotheses.filter(hyp => {
    const matchesSearch = hyp.hypothesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hyp.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hyp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesImpact = selectedImpact === 'all' || hyp.impact === selectedImpact;
    const matchesStatus = selectedStatus === 'all' || hyp.status === selectedStatus;
    const matchesConfidence = hyp.confidence >= confidenceRange[0] && hyp.confidence <= confidenceRange[1];
    
    return matchesSearch && matchesImpact && matchesStatus && matchesConfidence;
  });

  // Pagination
  const totalPages = Math.ceil(filteredHypotheses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHypotheses = filteredHypotheses.slice(startIndex, endIndex);

  // Calculate KPIs
  const topConfidence = Math.max(...mockRCAHypotheses.map(h => h.confidence));
  const avgTimeToRCA = '1m 15s';
  const avgCorrelatedSignals = Math.round(mockRCAHypotheses.reduce((sum, h) => sum + h.correlatedSignals, 0) / mockRCAHypotheses.length);
  const blastRadius = new Set(mockRCAHypotheses.map(h => h.service)).size;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'investigating': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <DashboardLayout currentPage="rca" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl mb-6">
          {/* Header Row with Title and Search/Date */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl mb-2">Root Cause Analysis Engine</h1>
              <p className="text-white/80 text-sm">AI-powered root cause identification in seconds</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Top Root Cause Confidence</span>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{topConfidence}%</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                2% improvement
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Time to RCA</span>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{avgTimeToRCA}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                20s faster
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Correlated Signals</span>
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{avgCorrelatedSignals}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                3 signals avg
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Blast Radius</span>
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl text-gray-900">{blastRadius}</div>
              <div className="text-xs text-gray-500 mt-1">services impacted</div>
            </div>
          </div>
        </div>

        {/* Filter Button - Outside Hero, Right Side */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredHypotheses.length} hypotheses found
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
              {(selectedImpact !== 'all' || selectedStatus !== 'all' || confidenceRange[0] !== 0 || confidenceRange[1] !== 100) && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {[selectedImpact !== 'all', selectedStatus !== 'all', confidenceRange[0] !== 0 || confidenceRange[1] !== 100].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Side Sheet */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="right" className="w-96 sm:max-w-md">
            <SheetTitle>Filter RCA Hypotheses</SheetTitle>
            <SheetDescription>
              Refine your root cause analysis search by applying filters below
            </SheetDescription>
            
            <div className="py-[24px] px-[20px]">
              <div className="space-y-6">
                {/* Impact Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Impact</label>
                  <select
                    value={selectedImpact}
                    onChange={(e) => setSelectedImpact(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="all">All Impacts</option>
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
                    <option value="confirmed">Confirmed</option>
                    <option value="investigating">Investigating</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
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
                      setSelectedImpact('all');
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
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Hypothesis</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Confidence %</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Evidence Count</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentHypotheses.map((hyp) => (
                  <tr key={hyp.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          hyp.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          hyp.rank === 2 ? 'bg-gray-100 text-gray-700' :
                          hyp.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {hyp.rank}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-md">
                        <button
                          onClick={() => handleViewTimeline(hyp.id)}
                          className="text-sm text-gray-900 line-clamp-2 hover:text-[#AE275F] hover:underline transition-colors text-left"
                        >
                          {hyp.hypothesis}
                        </button>
                        <span className="text-xs text-gray-500 mt-1">{hyp.service} • {hyp.timeToRCA}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getConfidenceColor(hyp.confidence)}`}>
                        {hyp.confidence}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{hyp.evidenceCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getImpactColor(hyp.impact)} border`}>
                        {hyp.impact}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatusColor(hyp.status)} border`}>
                        {hyp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="p-2 text-gray-400 hover:text-[#AE275F] hover:bg-[#AE275F]/10 rounded-lg transition-all"
                                onClick={() => handleViewEvidence(hyp.id)}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>View Evidence</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                onClick={() => handleConfirmRootCause(hyp.id)}
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Confirm Root Cause</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                onClick={() => handleRejectHypothesis(hyp.id)}
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Reject Hypothesis</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                onClick={() => handleViewTimeline(hyp.id)}
                              >
                                <GitBranch className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>View Timeline</TooltipContent>
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
              Showing {startIndex + 1} to {Math.min(endIndex, filteredHypotheses.length)} of {filteredHypotheses.length} hypotheses
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

        {/* Evidence Modal */}
        <Dialog open={showEvidenceModal} onOpenChange={setShowEvidenceModal}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Evidence Details - {selectedRCA?.id}</DialogTitle>
              <DialogDescription>
                Comprehensive evidence analysis for: {selectedRCA?.hypothesis}
              </DialogDescription>
            </DialogHeader>
            
            {selectedRCA && (
              <div className="space-y-6 py-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-xs text-purple-600 mb-1">Confidence Score</div>
                    <div className="text-2xl text-purple-700">{selectedRCA.confidence}%</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-xs text-blue-600 mb-1">Evidence Count</div>
                    <div className="text-2xl text-blue-700">{selectedRCA.evidenceCount}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-xs text-orange-600 mb-1">Correlated Signals</div>
                    <div className="text-2xl text-orange-700">{selectedRCA.correlatedSignals}</div>
                  </div>
                </div>

                {/* Correlated Logs */}
                <div>
                  <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#AE275F]" />
                    Correlated Log Entries
                  </h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
                    <div>[ERROR] 2024-12-30 10:23:45 - Connection pool exhausted: max connections reached</div>
                    <div>[WARN] 2024-12-30 10:23:46 - Auth service health check failed</div>
                    <div>[ERROR] 2024-12-30 10:23:47 - Memory leak detected in auth-service-v2.3.1</div>
                    <div>[INFO] 2024-12-30 10:23:48 - Automatic restart triggered</div>
                  </div>
                </div>

                {/* Metrics Timeline */}
                <div>
                  <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#AE275F]" />
                    Metric Variations
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span className="text-sm text-gray-900">CPU Utilization</span>
                      </div>
                      <span className="text-red-600">+45%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span className="text-sm text-gray-900">Memory Usage</span>
                      </div>
                      <span className="text-red-600">+62%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span className="text-sm text-gray-900">Response Time</span>
                      </div>
                      <span className="text-yellow-600">+28%</span>
                    </div>
                  </div>
                </div>

                {/* Related Anomalies */}
                <div>
                  <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#AE275F]" />
                    Related Anomalies
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-900">{selectedRCA.anomalyId}</div>
                        <div className="text-xs text-gray-500">High CPU on {selectedRCA.service}</div>
                      </div>
                      <Badge className="bg-red-100 text-red-700 border-red-200 border">Critical</Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowEvidenceModal(false);
                      if (selectedRCA.anomalyId) {
                        onNavigate?.('anomaly-detection');
                      }
                    }}
                    className="px-4 py-2 text-sm text-[#AE275F] hover:bg-[#AE275F]/10 rounded-lg transition-all"
                  >
                    View Anomaly Details
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowEvidenceModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowEvidenceModal(false);
                        handleConfirmRootCause(selectedRCA.id);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all"
                    >
                      Confirm Root Cause
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm Root Cause Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Confirm Root Cause - {selectedRCA?.id}
              </DialogTitle>
              <DialogDescription>
                You are about to confirm this hypothesis as the root cause of the incident
              </DialogDescription>
            </DialogHeader>
            
            {selectedRCA && (
              <div className="space-y-4 py-4">
                {/* Hypothesis Details */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-900 mb-2">{selectedRCA.hypothesis}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Service: {selectedRCA.service}</span>
                    <span>•</span>
                    <span>Confidence: {selectedRCA.confidence}%</span>
                    <span>•</span>
                    <span>Evidence: {selectedRCA.evidenceCount} items</span>
                  </div>
                </div>

                {/* Impact Information */}
                <div>
                  <h4 className="text-sm text-gray-900 mb-3">Impact & Actions</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Status will be updated to "Confirmed"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Remediation workflows will be triggered automatically</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Knowledge base will be updated with this finding</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>AI models will learn from this confirmation</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      onNavigate?.('alerting');
                    }}
                    className="px-4 py-2 text-sm text-[#AE275F] hover:bg-[#AE275F]/10 rounded-lg transition-all"
                  >
                    Create Alert
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (selectedRCA) {
                          alert(`✓ ${selectedRCA.id} confirmed as root cause\n\n• Status updated to "Confirmed"\n• Remediation workflows triggered\n• Knowledge base updated`);
                          setShowConfirmModal(false);
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all"
                    >
                      Confirm Root Cause
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Hypothesis Modal */}
        <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reject RCA {selectedRCA?.id}</DialogTitle>
              <DialogDescription>
                Please provide a reason:
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                placeholder="Enter reason here..."
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                className="bg-gray-100 text-gray-900 hover:bg-gray-200"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  if (selectedRCA && rejectReason) {
                    alert(`${selectedRCA.id} rejected.\n\nReason: ${rejectReason}\n\nAI will learn from this feedback.`);
                    setShowRejectModal(false);
                  }
                }}
              >
                Reject
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Timeline Modal */}
        <Dialog open={showTimelineModal} onOpenChange={setShowTimelineModal}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-blue-600" />
                View Timeline - {selectedRCA?.id}
              </DialogTitle>
              <DialogDescription>
                Chronological sequence of events leading to this root cause hypothesis
              </DialogDescription>
            </DialogHeader>
            
            {selectedRCA && (
              <div className="space-y-6 py-4">
                {/* Timeline Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-600 mb-1">Time to Detection</div>
                    <div className="text-xl text-blue-700">{selectedRCA.timeToRCA}</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="text-xs text-purple-600 mb-1">Events Analyzed</div>
                    <div className="text-xl text-purple-700">{selectedRCA.evidenceCount}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-xs text-orange-600 mb-1">Services Impacted</div>
                    <div className="text-xl text-orange-700">3</div>
                  </div>
                </div>

                {/* Timeline Events */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-4 relative">
                    {/* Event 1 */}
                    <div className="flex gap-4">
                      <div className="relative z-10">
                        <div className="w-8 h-8 bg-green-100 border-2 border-green-600 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm text-gray-900">Deployment Started</div>
                            <div className="text-xs text-gray-500">10:15:23 AM</div>
                          </div>
                          <div className="text-xs text-gray-600">Auth service v2.3.1 deployment initiated</div>
                        </div>
                      </div>
                    </div>

                    {/* Event 2 */}
                    <div className="flex gap-4">
                      <div className="relative z-10">
                        <div className="w-8 h-8 bg-yellow-100 border-2 border-yellow-600 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        </div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm text-gray-900">Memory Usage Spike</div>
                            <div className="text-xs text-gray-500">10:18:45 AM</div>
                          </div>
                          <div className="text-xs text-gray-600">Memory consumption increased by 45% on {selectedRCA.service}</div>
                        </div>
                      </div>
                    </div>

                    {/* Event 3 */}
                    <div className="flex gap-4">
                      <div className="relative z-10">
                        <div className="w-8 h-8 bg-orange-100 border-2 border-orange-600 rounded-full flex items-center justify-center">
                          <Activity className="w-4 h-4 text-orange-600" />
                        </div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm text-gray-900">Connection Pool Degradation</div>
                            <div className="text-xs text-gray-500">10:23:12 AM</div>
                          </div>
                          <div className="text-xs text-gray-600">Database connections reaching maximum capacity</div>
                        </div>
                      </div>
                    </div>

                    {/* Event 4 */}
                    <div className="flex gap-4">
                      <div className="relative z-10">
                        <div className="w-8 h-8 bg-red-100 border-2 border-red-600 rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm text-gray-900">Service Failure Detected</div>
                            <div className="text-xs text-gray-500">10:23:45 AM</div>
                          </div>
                          <div className="text-xs text-gray-600">Connection pool exhausted - Memory leak identified</div>
                        </div>
                      </div>
                    </div>

                    {/* Event 5 - RCA Complete */}
                    <div className="flex gap-4">
                      <div className="relative z-10">
                        <div className="w-8 h-8 bg-purple-100 border-2 border-purple-600 rounded-full flex items-center justify-center">
                          <Brain className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm text-gray-900">Root Cause Identified</div>
                            <div className="text-xs text-gray-500">10:24:30 AM</div>
                          </div>
                          <div className="text-xs text-gray-600">AI analysis completed in {selectedRCA.timeToRCA}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowTimelineModal(false);
                      handleViewEvidence(selectedRCA.id);
                    }}
                    className="px-4 py-2 text-sm text-[#AE275F] hover:bg-[#AE275F]/10 rounded-lg transition-all"
                  >
                    View Evidence
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowTimelineModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowTimelineModal(false);
                        handleConfirmRootCause(selectedRCA.id);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all"
                    >
                      Confirm Root Cause
                    </button>
                  </div>
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
                Export RCA Hypotheses Data
              </DialogTitle>
              <DialogDescription>
                Configure export settings for RCA analysis data
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
                  <option value="pdf">PDF Report with Evidence</option>
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
                  <option value="all">All Hypotheses</option>
                  <option value="confirmed">Confirmed Only</option>
                  <option value="investigating">Investigating Only</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
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
                  <p>• Records: {includeFilters ? filteredHypotheses.length : mockRCAHypotheses.length} hypotheses</p>
                  <p>• Date Range: {exportDateRange === 'current' ? dateRange : exportDateRange === 'all' ? 'All Time' : exportDateRange.replace('last', 'Last ').replace('days', ' Days')}</p>
                  <p>• Filters: {includeFilters ? `Applied (${[selectedStatus !== 'all', selectedImpact !== 'all'].filter(Boolean).length} active)` : 'None'}</p>
                  {exportFormat === 'pdf' && <p className="text-blue-900">• Includes evidence timeline and supporting data</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    const recordCount = includeFilters ? filteredHypotheses.length : mockRCAHypotheses.length;
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