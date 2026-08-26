import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown,
  ChevronRight,
  X,
  Calendar,
  Download,
  Settings,
  ArrowLeft,
  Network,
  AlertTriangle,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Server,
  Zap,
  Database,
  Globe
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface ServiceAnomalyDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

// Mock data for 7-day anomaly trend
const anomalyTrendData = [
  { day: 'Mon', anomalies: 2, baseline: 3, healthScore: 85 },
  { day: 'Tue', anomalies: 4, baseline: 3, healthScore: 78 },
  { day: 'Wed', anomalies: 3, baseline: 3, healthScore: 82 },
  { day: 'Thu', anomalies: 5, baseline: 3, healthScore: 75 },
  { day: 'Fri', anomalies: 10, baseline: 3, healthScore: 65 },
  { day: 'Sat', anomalies: 8, baseline: 3, healthScore: 70 },
  { day: 'Sun', anomalies: 6, baseline: 3, healthScore: 73 }
];

// Mock data for anomaly frequency by hour
const anomalyFrequencyData = [
  { hour: '00:00', count: 0 },
  { hour: '02:00', count: 0 },
  { hour: '04:00', count: 1 },
  { hour: '06:00', count: 1 },
  { hour: '08:00', count: 0 },
  { hour: '10:00', count: 2 },
  { hour: '12:00', count: 4 },
  { hour: '14:00', count: 3 },
  { hour: '16:00', count: 2 },
  { hour: '18:00', count: 3 },
  { hour: '20:00', count: 4 },
  { hour: '22:00', count: 2 }
];

const allServices = [
  { id: 1, name: 'Payment API', score: 72, status: 'critical', anomalies: 3 },
  { id: 2, name: 'User Service', score: 92, status: 'healthy', anomalies: 0 },
  { id: 3, name: 'Order Service', score: 68, status: 'warning', anomalies: 1 },
  { id: 4, name: 'Auth Service', score: 95, status: 'healthy', anomalies: 0 },
  { id: 5, name: 'API Gateway', score: 88, status: 'healthy', anomalies: 0 },
  { id: 6, name: 'Notification Service', score: 98, status: 'healthy', anomalies: 0 },
  { id: 7, name: 'Cache Service', score: 74, status: 'warning', anomalies: 1 },
  { id: 8, name: 'Inventory Service', score: 82, status: 'healthy', anomalies: 1 }
];

const recentAnomalies = [
  { id: 'ANO-1842', severity: 'critical', status: 'active', service: 'payment-api-prod', time: '2 min ago' },
  { id: 'ANO-1841', severity: 'high', status: 'active', service: 'payment-api-prod', time: '15 min ago' },
  { id: 'ANO-1840', severity: 'medium', status: 'resolved', service: 'payment-api-prod', time: '1 hour ago' }
];

const topAffectedMetrics = [
  { name: 'Response Time', value: '450ms', impact: 'high', change: '+180%' },
  { name: 'Error Rate', value: '0.8%', impact: 'medium', change: '+45%' },
  { name: 'CPU Utilization', value: '78%', impact: 'high', change: '+32%' },
  { name: 'Memory Usage', value: '82%', impact: 'low', change: '+12%' }
];

const thresholdStatus = [
  { metric: 'Response Time', current: 450, threshold: 200, status: 'critical', percentage: 85 },
  { metric: 'Error Rate', current: 0.8, threshold: 1.0, status: 'warning', percentage: 45 },
  { metric: 'CPU', current: 78, threshold: 90, status: 'healthy', percentage: 65 },
  { metric: 'Memory', current: 82, threshold: 85, status: 'healthy', percentage: 92 }
];

const serviceDependencies = {
  upstream: ['user-db', 'cache-redis', 'auth-service'],
  downstream: ['api-gateway', 'order-service', 'analytics-service']
};

export function ServiceAnomalyDashboard({ onNavigate, onLogout }: ServiceAnomalyDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 border-green-500';
    if (score >= 75) return 'text-yellow-600 border-yellow-500';
    if (score >= 60) return 'text-orange-600 border-orange-500';
    return 'text-red-600 border-red-500';
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout currentPage="service-anomaly-dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl mb-6">
          {/* Header Row with Title and Actions */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button 
                  onClick={() => onNavigate?.('anomaly-detection')}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl">Service Anomaly Dashboard</h1>
              </div>
              <p className="text-white/80 text-sm ml-11">Service-specific anomaly analysis with historical patterns and MTTD/MTTR metrics</p>
            </div>
            
            {/* Action Buttons Row */}
            <div className="flex gap-3 ml-8">
              {/* Date Range Selector */}
              <div className="relative flex-shrink-0">
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
                    {['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setDateRange(option);
                          setShowDateDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          dateRange === option ? "bg-[#AE275F]/10 text-[#AE275F]" : "text-gray-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => onNavigate?.('service-topology')}
                      className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg transition-all"
                    >
                      <Network className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Service Topology</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Export Report</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all">
                      <Settings className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Configure Thresholds</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment API Service Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl text-gray-900 mb-1">Payment API Service</h2>
                  <p className="text-sm text-gray-500">payment-api-prod</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Health Score Circle */}
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="38"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="38"
                        stroke="#f59e0b"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 38}`}
                        strokeDashoffset={`${2 * Math.PI * 38 * (1 - 72 / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl text-yellow-600">72</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl text-red-600 mb-1">3</div>
                  <div className="text-xs text-gray-600">CRITICAL<br/>ANOMALIES</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl text-gray-900 mb-1">8</div>
                  <div className="text-xs text-gray-600">ANOMALIES<br/>TODAY</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl text-gray-900 mb-1">2.3m</div>
                  <div className="text-xs text-gray-600">REQUESTS</div>
                  <div className="text-xs text-red-600">-42m</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl text-gray-900 mb-1">12m</div>
                  <div className="text-xs text-gray-600">AVG TIME</div>
                  <div className="text-xs text-green-600">-3m</div>
                </div>
              </div>
            </div>

            {/* 7-Day Anomaly Trend Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                  <h3 className="text-base text-gray-900">7-Day Anomaly Trend</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">7 Days</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={anomalyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="anomalies" fill="#ef4444" name="Anomalies" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="baseline" fill="#10b981" name="Baseline" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Anomaly Frequency by Hour */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="text-base text-gray-900">Anomaly Frequency by Hour</h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={anomalyFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#a855f7" fill="#e9d5ff" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 mt-4">Peak anomaly count: 00:00 - 08:00 business hours</p>
            </div>

            {/* Recent Anomalies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-base text-gray-900">Recent Anomalies</h3>
                </div>
                <button className="text-sm text-cyan-600 hover:text-cyan-700">View All</button>
              </div>
              <div className="space-y-3">
                {recentAnomalies.map((anomaly) => (
                  <div key={anomaly.id} className="flex items-center justify-between p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-900">{anomaly.id}</span>
                          <Badge className={`${getSeverityColor(anomaly.severity)} border text-xs uppercase`}>
                            {anomaly.severity}
                          </Badge>
                          <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs uppercase">
                            {anomaly.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">Response Time • {anomaly.time}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-[#AE275F] hover:bg-[#AE275F]/10 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Dependencies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-blue-600" />
                <h3 className="text-base text-gray-900">Service Dependencies</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">UPSTREAM</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceDependencies.upstream.map((service) => (
                      <Badge key={service} className="bg-blue-50 text-blue-700 border-blue-200 border">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">DOWNSTREAM</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceDependencies.downstream.map((service) => (
                      <Badge key={service} className="bg-purple-50 text-purple-700 border-purple-200 border">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* All Services List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-gray-600" />
                <h3 className="text-base text-gray-900">All Services</h3>
              </div>
              <div className="space-y-2">
                {allServices.map((service) => (
                  <button
                    key={service.id}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      service.id === 1 
                        ? 'bg-yellow-50 border-yellow-300' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        service.status === 'critical' ? 'bg-red-100 text-red-600' :
                        service.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {service.score}
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-gray-900">{service.name}</div>
                        {service.anomalies > 0 && (
                          <div className="text-xs text-red-600">{service.anomalies} active</div>
                        )}
                        {service.anomalies === 0 && (
                          <div className="text-xs text-green-600">No anomalies</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Top Affected Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-orange-600" />
                <h3 className="text-base text-gray-900">Top Affected Metrics</h3>
              </div>
              <div className="space-y-3">
                {topAffectedMetrics.map((metric, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-900">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{metric.value}</span>
                        <span className={`text-xs ${metric.change.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded text-xs ${
                        metric.impact === 'high' ? 'bg-red-100 text-red-700' :
                        metric.impact === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Threshold Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-600" />
                <h3 className="text-base text-gray-900">Threshold Status</h3>
              </div>
              <div className="space-y-4">
                {thresholdStatus.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-900">{item.metric}</span>
                      <span className={`text-xs ${
                        item.status === 'critical' ? 'text-red-600' :
                        item.status === 'warning' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {item.current}{item.metric === 'Response Time' ? 'ms' : item.metric.includes('Rate') ? '%' : '%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.status === 'critical' ? 'bg-red-500' :
                          item.status === 'warning' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Critical: {item.threshold}{item.metric === 'Response Time' ? 'ms' : '%'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}