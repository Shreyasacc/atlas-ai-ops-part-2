import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  X,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Target,
  Zap,
  Cloud,
  Server,
  Database,
  Network,
  PieChart,
  Wallet,
  BarChart3,
  ArrowUpRight,
  ArrowRight,
  Eye,
  Wrench,
  Bell
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { CustomDateTimePicker } from '../ui/custom-datetime-picker';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinOpsOverviewProps {
  onNavigate?: (page: string, params?: Record<string, string>) => void;
  onLogout?: () => void;
}

// Mock data for cost trends
const costTrendData = [
  { month: 'Jan', Compute: 35000, Storage: 15000, Network: 8000, Database: 12000 },
  { month: 'Feb', Compute: 38000, Storage: 16000, Network: 8500, Database: 13000 },
  { month: 'Mar', Compute: 42000, Storage: 17000, Network: 9000, Database: 14000 },
  { month: 'Apr', Compute: 45000, Storage: 18000, Network: 9500, Database: 15000 },
  { month: 'May', Compute: 42300, Storage: 19000, Network: 10000, Database: 16000 },
  { month: 'Jun', Compute: 48000, Storage: 20000, Network: 11000, Database: 17000 },
];

// Mock insights
const insights = [
  {
    id: 1,
    title: 'Compute cost increased 18% due to scale-up in ap-south-1',
    impact: 'high',
    service: 'Compute',
  },
  {
    id: 2,
    title: 'Storage snapshot growth detected – ₹3.2L impact',
    impact: 'medium',
    service: 'Storage',
  },
  {
    id: 3,
    title: 'Network egress spike detected in last 48 hrs',
    impact: 'high',
    service: 'Network',
  },
  {
    id: 4,
    title: 'Database idle time increased – potential for optimization',
    impact: 'low',
    service: 'Database',
  },
];

// Mock top cost drivers
const topCostDrivers = [
  {
    service: 'Compute',
    resourceName: 'ec2-prod-web-01',
    account: 'Production',
    region: 'ap-south-1',
    currentCost: '₹42,300',
    change: '+18%',
    optimization: true,
  },
  {
    service: 'Storage',
    resourceName: 's3-data-lake',
    account: 'Analytics',
    region: 'us-east-1',
    currentCost: '₹35,800',
    change: '+12%',
    optimization: true,
  },
  {
    service: 'Database',
    resourceName: 'rds-postgres-main',
    account: 'Production',
    region: 'eu-west-1',
    currentCost: '₹28,500',
    change: '+5%',
    optimization: false,
  },
  {
    service: 'Network',
    resourceName: 'cloudfront-cdn',
    account: 'Production',
    region: 'global',
    currentCost: '₹22,100',
    change: '+25%',
    optimization: true,
  },
  {
    service: 'Compute',
    resourceName: 'eks-cluster-prod',
    account: 'Production',
    region: 'ap-south-1',
    currentCost: '₹19,700',
    change: '-3%',
    optimization: false,
  },
];

export function FinOpsOverview({ onNavigate, onLogout }: FinOpsOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [visibleLines, setVisibleLines] = useState({
    Compute: true,
    Storage: true,
    Network: true,
    Database: true,
  });

  const dateRangeOptions = [
    'Last 7 Days',
    'Last 14 Days',
    'Last 30 Days',
    'Last 90 Days',
    'Last 6 Months',
    'Last 1 Year',
    'Custom Range'
  ];

  const handleDateRangeSelect = (option: string) => {
    if (option === 'Custom Range') {
      setShowCustomRangePicker(true);
    } else {
      setDateRange(option);
      setShowCustomRangePicker(false);
    }
    setShowDateDropdown(false);
  };

  const handleApplyCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setDateRange('Custom Range');
    setShowCustomRangePicker(false);
  };

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  const getBudgetStatusColor = (percentage: number) => {
    if (percentage < 70) return 'text-green-600';
    if (percentage < 90) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBudgetBgColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-50';
    if (percentage < 90) return 'bg-amber-50';
    return 'bg-red-50';
  };

  return (
    <DashboardLayout currentPage="fin-ops" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl mb-6">
          {/* Header Row with Title and Search/Date */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl mb-2">FinOps Overview</h1>
              <p className="text-white/80 text-sm">Comprehensive cloud cost management and optimization</p>
            </div>
            
            {/* Search and Date Range - Inline */}
            <div className="flex gap-3 ml-8">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 z-10" />
                <input
                  type="text"
                  placeholder="Search services, resources..."
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
            {/* 1. Total Cloud Spend */}
            <button 
              onClick={() => onNavigate?.('fin-ops-reports')}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Total Cloud Spend</span>
                <div className="w-8 h-8 bg-[#AE275F]/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-[#AE275F]" />
                </div>
              </div>
              <div className="text-2xl text-gray-900 mb-1">₹2,45,800</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% vs last month
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
              </div>
            </button>
            
            {/* 2. Budget Status */}
            <button 
              onClick={() => onNavigate?.('fin-ops-budgets')}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Budget Status</span>
                <div className={`w-8 h-8 ${getBudgetBgColor(72)} rounded-lg flex items-center justify-center`}>
                  <Target className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <div className={`text-2xl ${getBudgetStatusColor(72)} mb-1`}>72%</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  ₹98,000 remaining
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
              </div>
            </button>

            {/* 3. Active Cost Anomalies */}
            <button 
              onClick={() => onNavigate?.('anomaly-detection')}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Active Cost Anomalies</span>
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div className="text-2xl text-gray-900 mb-1">4</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  2 High, 2 Medium
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
              </div>
            </button>

            {/* 4. Potential Monthly Savings */}
            <button 
              onClick={() => onNavigate?.('fin-ops-optimization')}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Potential Savings</span>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="text-2xl text-gray-900 mb-1">₹45,200</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  18% of total spend
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
              </div>
            </button>

            {/* 5. Top Cost Driver */}
            <button 
              onClick={() => onNavigate?.('fin-ops-compute')}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs">Top Cost Driver</span>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Server className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-sm text-gray-900 mb-1 font-medium">Compute - EC2</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  42% of total spend
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
              </div>
            </button>
          </div>
        </div>

        {/* Cloud Services Cost Cards */}
        <div className="mb-6">
          <h2 className="text-xl text-gray-900 mb-4">Cloud Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Compute Card */}
            <button
              onClick={() => onNavigate?.('fin-ops-compute')}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Server className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Compute</h3>
                  </div>
                  <div className="text-2xl text-gray-900">₹42,300</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12%
                  </span>
                  <div className="w-2 h-2 bg-amber-500 rounded-full" title="Budget: 75%"></div>
                </div>
                <Badge variant="destructive" className="text-xs">2 anomalies</Badge>
              </div>
            </button>

            {/* Storage Card */}
            <button
              onClick={() => onNavigate?.('fin-ops-storage')}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium text-gray-900">Storage</h3>
                  </div>
                  <div className="text-2xl text-gray-900">₹35,800</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +8%
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Budget: 62%"></div>
                </div>
                <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">1 anomaly</Badge>
              </div>
            </button>

            {/* Network Card */}
            <button
              onClick={() => onNavigate?.('fin-ops-network')}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Network className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-gray-900">Network</h3>
                  </div>
                  <div className="text-2xl text-gray-900">₹28,500</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +15%
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Budget: 58%"></div>
                </div>
              </div>
            </button>

            {/* Database Card */}
            <button
              onClick={() => onNavigate?.('fin-ops-database')}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-5 h-5 text-orange-600" />
                    <h3 className="font-medium text-gray-900">Database</h3>
                  </div>
                  <div className="text-2xl text-gray-900">₹22,100</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +5%
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Budget: 55%"></div>
                </div>
                <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">1 anomaly</Badge>
              </div>
            </button>
          </div>
        </div>

        {/* Cost Trend Visualization */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gray-900">Cost Trend Analysis</h2>
            <div className="flex gap-3">
              {Object.keys(visibleLines).map((service) => (
                <button
                  key={service}
                  onClick={() => toggleLine(service as keyof typeof visibleLines)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                    visibleLines[service as keyof typeof visibleLines]
                      ? 'border-[#AE275F] bg-[#AE275F]/10 text-[#AE275F]'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    service === 'Compute' ? 'bg-blue-500' :
                    service === 'Storage' ? 'bg-purple-500' :
                    service === 'Network' ? 'bg-green-500' :
                    'bg-orange-500'
                  }`}></div>
                  <span className="text-sm">{service}</span>
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={costTrendData}>
              <defs>
                <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDatabase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                formatter={(value: number) => `₹${value.toLocaleString()}`}
              />
              {visibleLines.Compute && (
                <Area 
                  type="monotone" 
                  dataKey="Compute" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fill="url(#colorCompute)"
                  onClick={() => onNavigate?.('fin-ops-compute')}
                  style={{ cursor: 'pointer' }}
                />
              )}
              {visibleLines.Storage && (
                <Area 
                  type="monotone" 
                  dataKey="Storage" 
                  stroke="#A855F7" 
                  strokeWidth={2}
                  fill="url(#colorStorage)"
                  onClick={() => onNavigate?.('fin-ops-storage')}
                  style={{ cursor: 'pointer' }}
                />
              )}
              {visibleLines.Network && (
                <Area 
                  type="monotone" 
                  dataKey="Network" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fill="url(#colorNetwork)"
                  onClick={() => onNavigate?.('fin-ops-network')}
                  style={{ cursor: 'pointer' }}
                />
              )}
              {visibleLines.Database && (
                <Area 
                  type="monotone" 
                  dataKey="Database" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  fill="url(#colorDatabase)"
                  onClick={() => onNavigate?.('fin-ops-database')}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights Cards */}
        <div className="mb-6">
          <h2 className="text-xl text-gray-900 mb-4">AI-Powered Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((insight) => (
              <div key={insight.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    insight.impact === 'high' ? 'bg-red-50' :
                    insight.impact === 'medium' ? 'bg-amber-50' :
                    'bg-blue-50'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${
                      insight.impact === 'high' ? 'text-red-600' :
                      insight.impact === 'medium' ? 'text-amber-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{insight.title}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-[#AE275F] border-[#AE275F] hover:bg-[#AE275F] hover:text-white"
                  onClick={() => onNavigate?.('rca')}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cost Drivers Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">Top Cost Drivers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Service</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Resource Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Account</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Region</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Current Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Change</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topCostDrivers.map((driver, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onNavigate?.('rca')}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {driver.service === 'Compute' && <Server className="w-4 h-4 text-blue-600" />}
                        {driver.service === 'Storage' && <Database className="w-4 h-4 text-purple-600" />}
                        {driver.service === 'Network' && <Network className="w-4 h-4 text-green-600" />}
                        {driver.service === 'Database' && <Database className="w-4 h-4 text-orange-600" />}
                        <span className="text-sm text-gray-900">{driver.service}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{driver.resourceName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.account}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{driver.region}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{driver.currentCost}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${driver.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {driver.change}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-[#AE275F] hover:bg-[#AE275F]/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate?.('rca');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          RCA
                        </Button>
                        {driver.optimization && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-green-600 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate?.('fin-ops-optimization');
                            }}
                          >
                            <Wrench className="w-4 h-4 mr-1" />
                            Optimize
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts & Anomalies Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Budget Alerts */}
          <button
            onClick={() => onNavigate?.('fin-ops-budgets')}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Budget Alerts</h3>
                  <p className="text-sm text-gray-500">Active budget warnings</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Alerts</span>
                <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">3</Badge>
              </div>
              <div className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg">
                Latest: Production account exceeded 75% of monthly budget
              </div>
            </div>
          </button>

          {/* Cost Anomalies */}
          <button
            onClick={() => onNavigate?.('anomaly-detection')}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Cost Anomalies</h3>
                  <p className="text-sm text-gray-500">Detected spending anomalies</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#AE275F] transition-colors" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Anomalies</span>
                <Badge variant="destructive">4</Badge>
              </div>
              <div className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg">
                Highest Impact: Compute spike in ap-south-1 (+₹12,500)
              </div>
            </div>
          </button>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}