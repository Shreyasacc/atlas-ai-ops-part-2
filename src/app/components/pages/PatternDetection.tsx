import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  X,
  Calendar,
  Activity,
  Clock,
  AlertTriangle,
  Filter,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Server,
  ChevronRight,
  FileText,
  Link2,
  Bell,
  Flag,
  CheckCircle,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { CustomDateTimePicker } from '../ui/custom-datetime-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface PatternDetectionProps {
  onNavigate?: (page: string, params?: Record<string, string>) => void;
  onLogout?: () => void;
}

// Mock Data for Pattern Timeline
const patternTimelineData = [
  { time: '00:00', low: 2, medium: 1, high: 0, critical: 0 },
  { time: '02:00', low: 3, medium: 2, high: 1, critical: 0 },
  { time: '04:00', low: 4, medium: 3, high: 2, critical: 0 },
  { time: '06:00', low: 5, medium: 4, high: 3, critical: 1 },
  { time: '08:00', low: 8, medium: 6, high: 5, critical: 3 }, // Spike
  { time: '10:00', low: 6, medium: 5, high: 4, critical: 2 },
  { time: '12:00', low: 5, medium: 3, high: 2, critical: 1 },
  { time: '14:00', low: 4, medium: 2, high: 1, critical: 0 },
  { time: '16:00', low: 3, medium: 2, high: 1, critical: 0 },
  { time: '18:00', low: 3, medium: 1, high: 0, critical: 0 },
  { time: '20:00', low: 2, medium: 1, high: 0, critical: 0 },
  { time: '22:00', low: 2, medium: 0, high: 0, critical: 0 },
];

// Mock Data for Patterns
const patternsData = [
  {
    id: 1,
    name: 'DB Connection Pool Exhaustion after Deployment',
    confidence: 94,
    frequency: 12,
    impactSeverity: 'Critical',
    servicesAffected: ['API Gateway', 'User Service', 'Payment Service'],
    lastOccurrence: '2024-02-02 08:15:32',
    linkedHypotheses: ['DB-TIMEOUT-001', 'DEPLOY-IMPACT-002'],
    description: 'This pattern indicates database connection pool exhaustion that consistently occurs 5-15 minutes after production deployments. The issue is characterized by connection timeout errors, increased response times, and temporary service degradation.',
    matchedSyslogs: 145,
    historicalIncidents: 8,
    recommendations: [
      'Increase connection pool size from 50 to 100',
      'Implement connection pool warm-up during deployment',
      'Add pre-deployment database health check',
      'Configure gradual traffic ramp-up post-deployment'
    ]
  },
  {
    id: 2,
    name: 'Authentication Service JWT Token Expiry Pattern',
    confidence: 89,
    frequency: 28,
    impactSeverity: 'High',
    servicesAffected: ['User Service', 'API Gateway'],
    lastOccurrence: '2024-02-02 08:14:58',
    linkedHypotheses: ['AUTH-FAIL-002'],
    description: 'Recurring pattern of JWT token expiration errors occurring during high-traffic periods, suggesting insufficient token refresh logic or session timeout misconfigurations.',
    matchedSyslogs: 89,
    historicalIncidents: 15,
    recommendations: [
      'Extend JWT token lifetime from 1 hour to 4 hours',
      'Implement automatic token refresh 5 minutes before expiry',
      'Add session persistence layer',
      'Configure proper CORS settings for refresh tokens'
    ]
  },
  {
    id: 3,
    name: 'Cache Memory Pressure during Peak Hours',
    confidence: 82,
    frequency: 45,
    impactSeverity: 'Medium',
    servicesAffected: ['Cache Service', 'API Gateway'],
    lastOccurrence: '2024-02-02 08:13:42',
    linkedHypotheses: ['-'],
    description: 'Memory usage consistently exceeds 85% threshold during peak traffic hours (8 AM - 10 AM), causing increased cache evictions and higher database load.',
    matchedSyslogs: 234,
    historicalIncidents: 22,
    recommendations: [
      'Increase cache memory from 8GB to 16GB',
      'Implement cache key TTL optimization',
      'Configure memory-based auto-scaling',
      'Review and optimize frequently cached objects'
    ]
  },
  {
    id: 4,
    name: 'Payment Gateway API Intermittent Failures',
    confidence: 76,
    frequency: 18,
    impactSeverity: 'High',
    servicesAffected: ['Payment Service'],
    lastOccurrence: '2024-02-02 08:12:15',
    linkedHypotheses: ['PAYMENT-DOWN-003'],
    description: 'Third-party payment gateway returning 503 errors with a pattern of 2-3 minute recovery time, suggesting scheduled maintenance or capacity issues on vendor side.',
    matchedSyslogs: 67,
    historicalIncidents: 12,
    recommendations: [
      'Implement circuit breaker pattern for payment gateway',
      'Add fallback to secondary payment provider',
      'Configure retry logic with exponential backoff',
      'Set up payment gateway health monitoring'
    ]
  },
  {
    id: 5,
    name: 'Load Balancer Health Check Failures',
    confidence: 91,
    frequency: 8,
    impactSeverity: 'Medium',
    servicesAffected: ['Load Balancer', 'API Gateway'],
    lastOccurrence: '2024-02-02 08:08:45',
    linkedHypotheses: ['LB-HEALTH-004'],
    description: 'Backend servers intermittently failing health checks with "connection refused" errors, typically correlating with high CPU usage or memory pressure on target instances.',
    matchedSyslogs: 42,
    historicalIncidents: 6,
    recommendations: [
      'Increase health check timeout from 3s to 5s',
      'Reduce health check frequency during known high-load periods',
      'Implement gradual health check retry before removal',
      'Add CPU/memory monitoring to health check logic'
    ]
  },
  {
    id: 6,
    name: 'Gradual Response Time Degradation Pattern',
    confidence: 68,
    frequency: 34,
    impactSeverity: 'Low',
    servicesAffected: ['API Gateway', 'User Service', 'Cache Service'],
    lastOccurrence: '2024-02-02 07:45:22',
    linkedHypotheses: ['-'],
    description: 'Slow degradation in API response times over 24-48 hour periods, indicating possible memory leak or resource contention.',
    matchedSyslogs: 156,
    historicalIncidents: 10,
    recommendations: [
      'Perform memory profiling on identified services',
      'Implement automated service restart on performance threshold',
      'Add resource usage trending alerts',
      'Review and optimize database query patterns'
    ]
  }
];

export function PatternDetection({ onNavigate, onLogout }: PatternDetectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<typeof patternsData[0] | null>(null);
  const [showPatternDrawer, setShowPatternDrawer] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [showLinkRCAModal, setShowLinkRCAModal] = useState(false);
  const [showMarkInvestigatedModal, setShowMarkInvestigatedModal] = useState(false);

  const [filters, setFilters] = useState({
    service: [] as string[],
    severity: [] as string[],
    confidenceLevel: [] as string[],
    status: [] as string[],
  });

  const handleApplyCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setDateRange(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
    setShowCustomRangePicker(false);
    setShowDateDropdown(false);
  };

  // Calculate KPIs
  const activePatternsDetected = patternsData.length;
  const highConfidencePatterns = patternsData.filter(p => p.confidence >= 80).length;
  const highConfidencePercentage = ((highConfidencePatterns / activePatternsDetected) * 100).toFixed(0);
  const repeatingIncidents = patternsData.reduce((sum, p) => sum + p.historicalIncidents, 0);
  const avgTimeToDetection = '2.4 min';
  const impactedServices = new Set(patternsData.flatMap(p => p.servicesAffected)).size;

  const getSeverityBadge = (severity: string) => {
    const baseClasses = "flex items-center gap-1";
    switch (severity) {
      case 'Critical':
        return <Badge className={`bg-[#AE275F] text-white border-[#AE275F] ${baseClasses}`}><AlertTriangle className="w-3 h-3" />Critical</Badge>;
      case 'High':
        return <Badge className={`bg-[#C94979] text-white border-[#C94979] ${baseClasses}`}><AlertTriangle className="w-3 h-3" />High</Badge>;
      case 'Medium':
        return <Badge className={`bg-[#E46B93] text-white border-[#E46B93] ${baseClasses}`}><AlertTriangle className="w-3 h-3" />Medium</Badge>;
      case 'Low':
        return <Badge className={`bg-[#F0A8C0] text-gray-700 border-[#F0A8C0] ${baseClasses}`}><CheckCircle className="w-3 h-3" />Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) {
      return <Badge className="bg-green-100 text-green-700 border-green-200">High: {confidence}%</Badge>;
    } else if (confidence >= 60) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Medium: {confidence}%</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Low: {confidence}%</Badge>;
    }
  };

  const handlePatternClick = (pattern: typeof patternsData[0]) => {
    setSelectedPattern(pattern);
    setShowPatternDrawer(true);
  };

  // Filter patterns
  const filteredPatterns = patternsData.filter(pattern => {
    if (filters.severity.length > 0 && !filters.severity.includes(pattern.impactSeverity)) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return pattern.name.toLowerCase().includes(query) ||
             pattern.servicesAffected.some(s => s.toLowerCase().includes(query));
    }
    return true;
  });

  return (
    <DashboardLayout 
      currentPage="Pattern Detection" 
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
                <h1 className="text-3xl font-bold text-white mb-2">Pattern Detection</h1>
                <p className="text-pink-100">AI-powered detection of recurring patterns and incidents</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-200 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search patterns by name, service..."
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
                      {['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom Range'].map((range) => (
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

          {/* 5 KPI Cards */}
          <div className="max-w-7xl mx-auto px-6 -mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 1. Active Patterns Detected */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Active Patterns</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{activePatternsDetected}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Activity className="w-3 h-3" />
                  <span>Unique patterns detected</span>
                </div>
              </div>

              {/* 2. High-Confidence Patterns */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => {
                  setFilters(prev => ({ ...prev, confidenceLevel: ['High'] }));
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">High Confidence</span>
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{highConfidencePercentage}%</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>{highConfidencePatterns} patterns ≥80%</span>
                </div>
              </div>

              {/* 3. Repeating Incidents */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('pattern-timeline-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Repeating Incidents</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{repeatingIncidents}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Historical matches</span>
                </div>
              </div>

              {/* 4. Avg Time to Detection */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Avg Detection Time</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{avgTimeToDetection}</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingDown className="w-3 h-3" />
                  <span>18% faster vs last period</span>
                </div>
              </div>

              {/* 5. Potentially Impacted Services */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Impacted Services</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <Server className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{impactedServices}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Services with patterns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredPatterns.length}</span> of <span className="font-medium">{patternsData.length}</span> patterns shown
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-[#AE275F] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-[#AE275F] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Table
              </button>
            </div>
            <Button 
              variant="outline"
              onClick={() => onNavigate?.('rca-syslog')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Syslog Reviewer
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
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

        {/* Pattern Timeline */}
        <div id="pattern-timeline-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Pattern Timeline</h3>
              <p className="text-sm text-gray-500 mt-1">Pattern detection frequency by severity over time</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patternTimelineData}>
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
              <Bar dataKey="high" stackId="a" fill="#C94979" name="High" />
              <Bar dataKey="medium" stackId="a" fill="#E46B93" name="Medium" />
              <Bar dataKey="low" stackId="a" fill="#F0A8C0" name="Low" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pattern Cards or Table */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {filteredPatterns.map((pattern) => (
              <div 
                key={pattern.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handlePatternClick(pattern)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-md font-medium text-gray-900 mb-2">{pattern.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getSeverityBadge(pattern.impactSeverity)}
                      {getConfidenceBadge(pattern.confidence)}
                      <Badge variant="outline" className="text-gray-600">
                        <Activity className="w-3 h-3 mr-1" />
                        {pattern.frequency}x
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Server className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Services:</span>
                    <span className="text-gray-900">{pattern.servicesAffected.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Last Seen:</span>
                    <span className="text-gray-900">{pattern.lastOccurrence}</span>
                  </div>
                  {pattern.linkedHypotheses[0] !== '-' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Link2 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Linked RCA:</span>
                      <span className="text-[#AE275F] font-medium">{pattern.linkedHypotheses.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePatternClick(pattern);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {pattern.linkedHypotheses[0] !== '-' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate?.('rca');
                      }}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      View RCA
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate?.('rca-syslog');
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Syslogs
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Detected Patterns</h3>
                  <p className="text-sm text-gray-500 mt-1">Click any pattern row to view full details</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Occurrence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatterns.map((pattern) => (
                    <tr 
                      key={pattern.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePatternClick(pattern)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-md">{pattern.name}</div>
                        {pattern.linkedHypotheses[0] !== '-' && (
                          <div className="text-xs text-[#AE275F] mt-1">{pattern.linkedHypotheses.join(', ')}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-gray-600">
                          <Activity className="w-3 h-3 mr-1" />
                          {pattern.frequency}x
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{getConfidenceBadge(pattern.confidence)}</td>
                      <td className="px-6 py-4">{getSeverityBadge(pattern.impactSeverity)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{pattern.servicesAffected.length}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{pattern.lastOccurrence}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPattern(pattern);
                              setShowPatternModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPattern(pattern);
                              setShowLinkRCAModal(true);
                            }}
                          >
                            <Activity className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPattern(pattern);
                              setShowMarkInvestigatedModal(true);
                            }}
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageContainer>

      {/* Pattern Detail Drawer */}
      {showPatternDrawer && selectedPattern && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowPatternDrawer(false)}
          />
          
          <div className="fixed right-0 top-0 h-full w-[700px] bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Pattern Details</h3>
                <button
                  onClick={() => setShowPatternDrawer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pattern Header */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{selectedPattern.name}</h2>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {getSeverityBadge(selectedPattern.impactSeverity)}
                  {getConfidenceBadge(selectedPattern.confidence)}
                  <Badge variant="outline" className="text-gray-600">
                    <Activity className="w-3 h-3 mr-1" />
                    {selectedPattern.frequency} occurrences
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedPattern.description}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Matched Syslogs</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedPattern.matchedSyslogs}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Historical Incidents</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedPattern.historicalIncidents}</div>
                </div>
              </div>

              {/* Services Affected */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Services Affected</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPattern.servicesAffected.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-gray-700">
                      <Server className="w-3 h-3 mr-1" />
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Linked Hypotheses */}
              {selectedPattern.linkedHypotheses[0] !== '-' && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Correlated Hypotheses</h4>
                  <div className="space-y-2">
                    {selectedPattern.linkedHypotheses.map((hypothesis, index) => (
                      <div 
                        key={index}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onNavigate?.('rca')}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#AE275F]">{hypothesis}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recommendations & Preventive Actions</h4>
                <div className="space-y-2">
                  {selectedPattern.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <Button 
                  className="w-full bg-[#AE275F] hover:bg-[#8B1F4C] text-white"
                  onClick={() => onNavigate?.('rca')}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  View RCA Overview
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate?.('rca-syslog')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Open Syslog Reviewer
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate?.('alerting')}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Create Alert Rule
                </Button>
                <Button 
                  variant="outline"
                  className="w-full text-gray-600"
                  onClick={() => {
                    // Mark pattern as investigated and close drawer
                    setShowPatternDrawer(false);
                  }}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Mark as Investigated
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
                <h3 className="text-lg font-medium text-gray-900">Filter Patterns</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Impact Severity</label>
                  <div className="space-y-2">
                    {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
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

                {/* Confidence Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Level</label>
                  <div className="space-y-2">
                    {['High (≥80%)', 'Medium (60-79%)', 'Low (<60%)'].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Service Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {['API Gateway', 'User Service', 'Payment Service', 'Cache Service', 'Load Balancer'].map((service) => (
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

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="space-y-2">
                    {['Active', 'Investigated', 'Resolved'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
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
                      severity: [],
                      confidenceLevel: [],
                      status: [],
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

      {/* View Pattern Details Modal - Eye Button */}
      {showPatternModal && selectedPattern && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPatternModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Pattern Details</h3>
                <button onClick={() => setShowPatternModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>
              <div className="mb-6"><h2 className="text-2xl font-semibold text-gray-900 mb-3">{selectedPattern.name}</h2><div className="flex items-center gap-2 flex-wrap mb-4">{getSeverityBadge(selectedPattern.impactSeverity)}{getConfidenceBadge(selectedPattern.confidence)}<Badge variant="outline" className="text-gray-600"><Activity className="w-3 h-3 mr-1" />{selectedPattern.frequency} occurrences</Badge></div></div>
              <div className="mb-6 bg-gray-50 rounded-lg p-4"><h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4><p className="text-sm text-gray-700 leading-relaxed">{selectedPattern.description}</p></div>
              <div className="grid grid-cols-2 gap-4 mb-6"><div className="border border-gray-200 rounded-lg p-4 bg-purple-50"><div className="text-xs text-gray-600 mb-1">Matched Syslogs</div><div className="text-3xl font-bold text-[#AE275F]">{selectedPattern.matchedSyslogs}</div></div><div className="border border-gray-200 rounded-lg p-4 bg-orange-50"><div className="text-xs text-gray-600 mb-1">Historical Incidents</div><div className="text-3xl font-bold text-orange-600">{selectedPattern.historicalIncidents}</div></div></div>
              <div className="mb-6"><h4 className="text-sm font-medium text-gray-900 mb-3">Services Affected</h4><div className="flex flex-wrap gap-2">{selectedPattern.servicesAffected.map((service, index) => (<Badge key={index} variant="outline" className="text-gray-700"><Server className="w-3 h-3 mr-1" />{service}</Badge>))}</div></div>
              {selectedPattern.linkedHypotheses[0] !== '-' && (<div className="mb-6"><h4 className="text-sm font-medium text-gray-900 mb-3">Correlated RCA Hypotheses</h4><div className="space-y-2">{selectedPattern.linkedHypotheses.map((hypothesis, index) => (<div key={index} className="border border-[#AE275F] bg-purple-50 rounded-lg p-3 hover:bg-purple-100 cursor-pointer transition-colors" onClick={() => { setShowPatternModal(false); onNavigate?.('rca'); }}><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Link2 className="w-4 h-4 text-[#AE275F]" /><span className="text-sm font-medium text-[#AE275F]">{hypothesis}</span></div><ChevronRight className="w-4 h-4 text-[#AE275F]" /></div></div>))}</div></div>)}
              <div className="mb-6"><h4 className="text-sm font-medium text-gray-900 mb-3">AI Recommendations</h4><div className="space-y-2">{selectedPattern.recommendations.map((rec, index) => (<div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"><Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" /><span className="text-sm text-gray-700">{rec}</span></div>))}</div></div>
              <div className="flex gap-3 pt-6 border-t border-gray-200"><Button className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4C] text-white" onClick={() => { setShowPatternModal(false); onNavigate?.('rca-syslog'); }}><FileText className="w-4 h-4 mr-2" />View Syslogs ({selectedPattern.matchedSyslogs})</Button><Button variant="outline" className="flex-1" onClick={() => { setShowPatternModal(false); onNavigate?.('alerting'); }}><Bell className="w-4 h-4 mr-2" />Create Alert</Button><Button variant="outline" onClick={() => setShowPatternModal(false)}>Close</Button></div>
            </div>
          </div>
        </div>
      )}

      {/* Link to RCA Modal - Activity Button */}
      {showLinkRCAModal && selectedPattern && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLinkRCAModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6"><div><h3 className="text-xl font-semibold text-gray-900">Link Pattern to RCA Hypothesis</h3><p className="text-sm text-gray-500 mt-1">Associate this pattern with an existing or new hypothesis</p></div><button onClick={() => setShowLinkRCAModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button></div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-200"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-full bg-[#AE275F] flex items-center justify-center flex-shrink-0"><Target className="w-5 h-5 text-white" /></div><div className="flex-1"><div className="flex items-center gap-2 mb-2"><span className="text-sm font-medium text-gray-900">{selectedPattern.name}</span>{getSeverityBadge(selectedPattern.impactSeverity)}</div><div className="text-sm text-gray-700 mb-2">Confidence: {selectedPattern.confidence}% • Frequency: {selectedPattern.frequency}x</div><div className="text-xs text-gray-500">Last Occurrence: {selectedPattern.lastOccurrence}</div></div></div></div>
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-3">Select Existing Hypothesis</label><div className="space-y-2">{['DB-TIMEOUT-001', 'AUTH-FAIL-002', 'PAYMENT-DOWN-003', 'LB-HEALTH-004'].map((hypothesis) => (<label key={hypothesis} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"><input type="radio" name="hypothesis" value={hypothesis} defaultChecked={selectedPattern.linkedHypotheses.includes(hypothesis)} className="text-[#AE275F] focus:ring-[#AE275F]" /><div className="ml-3 flex-1"><div className="text-sm font-medium text-gray-900">{hypothesis}</div></div><ChevronRight className="w-5 h-5 text-gray-400" /></label>))}</div></div>
              <div className="mb-6"><label className="flex items-center p-4 border-2 border-dashed border-[#AE275F] rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"><input type="radio" name="hypothesis" value="new" className="text-[#AE275F] focus:ring-[#AE275F]" /><div className="ml-3 flex-1"><div className="text-sm font-medium text-[#AE275F]">Create New RCA Hypothesis</div><div className="text-xs text-gray-500">Generate a new hypothesis based on this pattern</div></div><Zap className="w-5 h-5 text-[#AE275F]" /></label></div>
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Investigation Notes (Optional)</label><textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent" rows={3} placeholder="Add any context or observations about this correlation..."></textarea></div>
              <div className="flex gap-3 pt-6 border-t border-gray-200"><Button className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4C] text-white" onClick={() => { setShowLinkRCAModal(false); onNavigate?.('rca'); }}><Link2 className="w-4 h-4 mr-2" />Link & Open RCA</Button><Button variant="outline" onClick={() => setShowLinkRCAModal(false)}>Cancel</Button></div>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Investigated Modal - Flag Button */}
      {showMarkInvestigatedModal && selectedPattern && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowMarkInvestigatedModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6"><div><h3 className="text-xl font-semibold text-gray-900">Mark Pattern as Investigated</h3><p className="text-sm text-gray-500 mt-1">Document your investigation and resolution steps</p></div><button onClick={() => setShowMarkInvestigatedModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button></div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-700">Pattern</span><div className="flex items-center gap-2">{getSeverityBadge(selectedPattern.impactSeverity)}{getConfidenceBadge(selectedPattern.confidence)}</div></div><div className="text-sm text-gray-900 font-medium mb-1">{selectedPattern.name}</div><div className="text-xs text-gray-600">{selectedPattern.frequency} occurrences • {selectedPattern.matchedSyslogs} syslogs</div></div>
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-3">Investigation Status</label><div className="space-y-2"><label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"><input type="radio" name="status" value="investigated" defaultChecked className="text-[#AE275F] focus:ring-[#AE275F]" /><div className="ml-3"><div className="text-sm font-medium text-gray-900">Investigated</div><div className="text-xs text-gray-500">Pattern has been reviewed</div></div></label><label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"><input type="radio" name="status" value="resolved" className="text-[#AE275F] focus:ring-[#AE275F]" /><div className="ml-3"><div className="text-sm font-medium text-gray-900">Resolved</div><div className="text-xs text-gray-500">Root cause identified and fixed</div></div></label><label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"><input type="radio" name="status" value="false-positive" className="text-[#AE275F] focus:ring-[#AE275F]" /><div className="ml-3"><div className="text-sm font-medium text-gray-900">False Positive</div><div className="text-xs text-gray-500">Pattern does not indicate an issue</div></div></label></div></div>
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Investigation Summary *</label><textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent" rows={4} placeholder="Describe what you found, actions taken, and preventive measures..."></textarea></div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"><div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" /><div><div className="text-sm font-medium text-green-900 mb-1">After marking as investigated:</div><ul className="text-xs text-green-800 space-y-1"><li>• Pattern status will be updated</li><li>• Investigation notes saved to audit trail</li><li>• Related team members notified</li></ul></div></div></div>
              <div className="flex gap-3 pt-6 border-t border-gray-200"><Button className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4C] text-white" onClick={() => setShowMarkInvestigatedModal(false)}><Flag className="w-4 h-4 mr-2" />Mark as Investigated</Button><Button variant="outline" onClick={() => setShowMarkInvestigatedModal(false)}>Cancel</Button></div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}