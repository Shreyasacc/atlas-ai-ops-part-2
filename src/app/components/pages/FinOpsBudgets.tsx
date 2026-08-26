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
  Filter,
  Download,
  Bell,
  Activity,
  CheckCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { CustomDateTimePicker } from '../ui/custom-datetime-picker';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FinOpsBudgetsProps {
  onNavigate?: (page: string, params?: Record<string, string>) => void;
  onLogout?: () => void;
}

// Mock Budget Summary Data
const budgetSummaryData = [
  { 
    id: 1, 
    name: 'Production Infrastructure', 
    budgetAmount: '₹5,00,000', 
    actualSpend: '₹4,75,000', 
    utilization: 95,
    variance: '-₹25,000',
    status: 'At Risk',
    owner: 'DevOps Team',
    period: 'Jan 2024',
    cloudProvider: 'AWS',
    serviceType: 'Compute',
    environment: 'Production',
    forecast: '₹5,10,000'
  },
  { 
    id: 2, 
    name: 'Development Environment', 
    budgetAmount: '₹2,00,000', 
    actualSpend: '₹1,20,000', 
    utilization: 60,
    variance: '-₹80,000',
    status: 'On Track',
    owner: 'Dev Team',
    period: 'Jan 2024',
    cloudProvider: 'Azure',
    serviceType: 'Compute',
    environment: 'Development',
    forecast: '₹1,80,000'
  },
  { 
    id: 3, 
    name: 'Storage & Backup', 
    budgetAmount: '₹3,00,000', 
    actualSpend: '₹3,15,000', 
    utilization: 105,
    variance: '+₹15,000',
    status: 'Breached',
    owner: 'Storage Team',
    period: 'Jan 2024',
    cloudProvider: 'AWS',
    serviceType: 'Storage',
    environment: 'Production',
    forecast: '₹3,40,000'
  },
  { 
    id: 4, 
    name: 'Database Services', 
    budgetAmount: '₹4,00,000', 
    actualSpend: '₹2,80,000', 
    utilization: 70,
    variance: '-₹1,20,000',
    status: 'On Track',
    owner: 'DBA Team',
    period: 'Jan 2024',
    cloudProvider: 'GCP',
    serviceType: 'Database',
    environment: 'Production',
    forecast: '₹3,50,000'
  },
  { 
    id: 5, 
    name: 'Network & CDN', 
    budgetAmount: '₹1,50,000', 
    actualSpend: '₹1,48,000', 
    utilization: 99,
    variance: '-₹2,000',
    status: 'At Risk',
    owner: 'Network Team',
    period: 'Jan 2024',
    cloudProvider: 'AWS',
    serviceType: 'Network',
    environment: 'Production',
    forecast: '₹1,55,000'
  },
  { 
    id: 6, 
    name: 'ML Training Infrastructure', 
    budgetAmount: '₹6,00,000', 
    actualSpend: '₹3,90,000', 
    utilization: 65,
    variance: '-₹2,10,000',
    status: 'On Track',
    owner: 'ML Team',
    period: 'Jan 2024',
    cloudProvider: 'Azure',
    serviceType: 'Compute',
    environment: 'Development',
    forecast: '₹5,20,000'
  }
];

// Budget Alerts Data
const budgetAlertsData = [
  {
    id: 1,
    budgetName: 'Production Infrastructure',
    threshold: '90%',
    currentUtilization: '95%',
    severity: 'high',
    status: 'active',
    triggeredAt: '2 hours ago',
    message: 'Budget utilization exceeded 90% threshold'
  },
  {
    id: 2,
    budgetName: 'Storage & Backup',
    threshold: '100%',
    currentUtilization: '105%',
    severity: 'critical',
    status: 'active',
    triggeredAt: '1 day ago',
    message: 'Budget breached by ₹15,000'
  },
  {
    id: 3,
    budgetName: 'Network & CDN',
    threshold: '95%',
    currentUtilization: '99%',
    severity: 'medium',
    status: 'active',
    triggeredAt: '5 hours ago',
    message: 'Approaching budget limit'
  },
  {
    id: 4,
    budgetName: 'Development Environment',
    threshold: '80%',
    currentUtilization: '60%',
    severity: 'low',
    status: 'resolved',
    triggeredAt: '3 days ago',
    message: 'Spending returned to normal levels'
  }
];

// Budget vs Actual Chart Data
const budgetVsActualData = [
  { month: 'Jul', budget: 180, actual: 165 },
  { month: 'Aug', budget: 180, actual: 172 },
  { month: 'Sep', budget: 200, actual: 195 },
  { month: 'Oct', budget: 200, actual: 185 },
  { month: 'Nov', budget: 220, actual: 215 },
  { month: 'Dec', budget: 220, actual: 225 },
  { month: 'Jan', budget: 215, actual: 213 }
];

export function FinOpsBudgets({ onNavigate, onLogout }: FinOpsBudgetsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [budgetFilters, setBudgetFilters] = useState({
    cloudProvider: [] as string[],
    dateRange: 'Monthly',
    environment: [] as string[],
    account: [] as string[],
    costCenter: [] as string[],
    service: [] as string[],
    owner: [] as string[],
  });

  const handleApplyCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setDateRange(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
    setShowCustomRangePicker(false);
    setShowDateDropdown(false);
  };

  // Calculate KPIs
  const totalBudget = budgetSummaryData.reduce((sum, b) => sum + parseInt(b.budgetAmount.replace(/[₹,]/g, '')), 0);
  const totalSpend = budgetSummaryData.reduce((sum, b) => sum + parseInt(b.actualSpend.replace(/[₹,]/g, '')), 0);
  const budgetUtilization = Math.round((totalSpend / totalBudget) * 100);
  const forecastedBreachCount = budgetSummaryData.filter(b => b.status === 'At Risk' || b.status === 'Breached').length;
  const activeBudgetAlerts = budgetAlertsData.filter(a => a.status === 'active').length;
  const overBudgetSpend = budgetSummaryData.filter(b => b.utilization > 100).reduce((sum, b) => {
    const budget = parseInt(b.budgetAmount.replace(/[₹,]/g, ''));
    const actual = parseInt(b.actualSpend.replace(/[₹,]/g, ''));
    return sum + (actual - budget);
  }, 0);

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 70) return 'text-green-600';
    if (utilization < 90) return 'text-amber-600';
    return 'text-red-600';
  };

  const getUtilizationBgColor = (utilization: number) => {
    if (utilization < 70) return 'bg-green-50';
    if (utilization < 90) return 'bg-amber-50';
    return 'bg-red-50';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Track': return <Badge className="bg-green-100 text-green-700 border-green-200">On Track</Badge>;
      case 'At Risk': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">At Risk</Badge>;
      case 'Breached': return <Badge className="bg-red-100 text-red-700 border-red-200">Breached</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter budgets based on filters
  const filteredBudgets = budgetSummaryData.filter(budget => {
    // Apply service filter from sidebar only
    if (budgetFilters.service.length > 0 && !budgetFilters.service.includes(budget.serviceType)) {
      return false;
    }
    
    // Apply other filters
    if (budgetFilters.cloudProvider.length > 0 && !budgetFilters.cloudProvider.includes(budget.cloudProvider)) {
      return false;
    }
    if (budgetFilters.environment.length > 0 && !budgetFilters.environment.includes(budget.environment)) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return budget.name.toLowerCase().includes(query) ||
             budget.owner.toLowerCase().includes(query) ||
             budget.serviceType.toLowerCase().includes(query);
    }
    
    return true;
  });

  return (
    <DashboardLayout 
      currentPage="Budgets" 
      onNavigate={onNavigate} 
      onLogout={onLogout}
    >
      <PageContainer
        title=""
        subtitle=""
        actions={<div></div>}
      >
        {/* Hero Section with Gradient Background */}
        <div className="relative -mt-6 -mx-6 mb-6">
          <div className="bg-gradient-to-r from-[#AE275F] to-[#D63384] px-6 pt-8 pb-32 rounded-b-2xl">
            <div className="max-w-7xl mx-auto">
              {/* Title and Subtitle */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Budget Management</h1>
                <p className="text-pink-100">Monitor and manage cloud spending budgets across all services</p>
              </div>

              {/* Search and Date Range */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-200 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search budgets, teams, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-pink-200"
                  />
                </div>

                {/* Date Range Selector */}
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
                      {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Month', 'Last Month', 'This Quarter', 'Custom Range'].map((range) => (
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

          {/* 5 KPI Cards - Overlapping the Hero */}
          <div className="max-w-7xl mx-auto px-6 -mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 1. Total Budget */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('budget-summary-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Total Budget</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹{(totalBudget/100000).toFixed(1)}L</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Monthly Period</span>
                </div>
              </div>

              {/* 2. Budget Utilized */}
              <div 
                className={`bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow`}
                onClick={() => document.getElementById('budget-vs-actual-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Budget Utilized</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className={`text-2xl font-bold mb-1 ${getUtilizationColor(budgetUtilization)}`}>
                  {budgetUtilization}%
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>5% this month</span>
                </div>
              </div>

              {/* 3. Forecasted Breach */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('forecast-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Forecasted Breach</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{forecastedBreachCount}</div>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>2 from last week</span>
                </div>
              </div>

              {/* 4. Active Alerts */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('alerts-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Active Alerts</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{activeBudgetAlerts}</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingDown className="w-3 h-3" />
                  <span>1 resolved today</span>
                </div>
              </div>

              {/* 5. Over-Budget Spend */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Over-Budget</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">₹{(overBudgetSpend/1000).toFixed(0)}K</div>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>8% increase</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredBudgets.length}</span> budgets found
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => onNavigate?.('fin-ops-budgets')}
            >
              <Activity className="w-4 h-4 mr-2" />
              Budget Dashboard
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

        {/* Budget vs Actual Chart */}
        <div id="budget-vs-actual-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Budget vs Actual Spend</h3>
              <p className="text-sm text-gray-500 mt-1">Monthly comparison (in thousands)</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Budget</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#AE275F]"></div>
                <span className="text-gray-600">Actual</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={budgetVsActualData}>
              <defs>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AE275F" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#AE275F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="budget" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBudget)" 
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#AE275F" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorActual)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Summary Table */}
        <div id="budget-summary-section" className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Budget Summary</h3>
                <p className="text-sm text-gray-500 mt-1">
                  All active budgets across services
                  {filteredBudgets.length !== budgetSummaryData.length && ` (${filteredBudgets.length} of ${budgetSummaryData.length} shown)`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Spend</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forecast</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map((budget) => (
                  <tr 
                    key={budget.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {/* Handle budget details click */}}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{budget.name}</div>
                          <div className="text-xs text-gray-500">{budget.cloudProvider} • {budget.environment}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs">{budget.serviceType}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{budget.budgetAmount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{budget.actualSpend}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className={`h-2 rounded-full ${
                              budget.utilization < 70 ? 'bg-green-500' :
                              budget.utilization < 90 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(budget.utilization, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getUtilizationColor(budget.utilization)}`}>
                          {budget.utilization}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{budget.forecast}</td>
                    <td className="px-6 py-4">{getStatusBadge(budget.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{budget.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts & Thresholds */}
        <div id="alerts-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Budget Alerts & Thresholds</h3>
              <p className="text-sm text-gray-500 mt-1">Active and recent budget threshold alerts</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate?.('fin-ops-budgets')}
            >
              Configure Thresholds
            </Button>
          </div>

          <div className="space-y-3">
            {budgetAlertsData.map((alert) => (
              <div 
                key={alert.id} 
                className={`border rounded-lg p-4 ${
                  alert.severity === 'critical' ? 'border-red-300 bg-red-50' :
                  alert.severity === 'high' ? 'border-orange-300 bg-orange-50' :
                  alert.severity === 'medium' ? 'border-amber-300 bg-amber-50' :
                  'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'critical' ? 'bg-red-100' :
                      alert.severity === 'high' ? 'bg-orange-100' :
                      alert.severity === 'medium' ? 'bg-amber-100' :
                      'bg-gray-100'
                    }`}>
                      {alert.status === 'resolved' ? (
                        <CheckCircle className={`w-5 h-5 ${
                          alert.severity === 'critical' ? 'text-red-600' :
                          alert.severity === 'high' ? 'text-orange-600' :
                          alert.severity === 'medium' ? 'text-amber-600' :
                          'text-gray-600'
                        }`} />
                      ) : (
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.severity === 'critical' ? 'text-red-600' :
                          alert.severity === 'high' ? 'text-orange-600' :
                          alert.severity === 'medium' ? 'text-amber-600' :
                          'text-gray-600'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{alert.budgetName}</h4>
                        <Badge className={
                          alert.status === 'active' ? 'bg-red-100 text-red-700 border-red-200' : 
                          'bg-green-100 text-green-700 border-green-200'
                        }>
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                        <span>Threshold: {alert.threshold}</span>
                        <span>Current: {alert.currentUtilization}</span>
                        <span>Triggered: {alert.triggeredAt}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecasting Insights */}
        <div id="forecast-section" className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Budget Forecasting</h3>
              <p className="text-sm text-gray-500 mt-1">AI-powered spending predictions for next 30 days</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate?.('fin-ops-budgets')}
            >
              Configure Budget Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetSummaryData.filter(b => b.status !== 'On Track').map((budget) => {
              const budgetNum = parseInt(budget.budgetAmount.replace(/[₹,]/g, ''));
              const forecastNum = parseInt(budget.forecast.replace(/[₹,]/g, ''));
              const diff = forecastNum - budgetNum;
              const percentDiff = Math.round((diff / budgetNum) * 100);

              return (
                <div key={budget.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{budget.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{budget.serviceType}</span>
                        <span>•</span>
                        <span>{budget.cloudProvider}</span>
                      </div>
                    </div>
                    {getStatusBadge(budget.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Current Budget:</span>
                      <span className="font-medium text-gray-900">{budget.budgetAmount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">30-Day Forecast:</span>
                      <span className={`font-medium ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {budget.forecast}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Projected Variance:</span>
                      <span className={`font-medium flex items-center gap-1 ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {diff > 0 ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        ₹{Math.abs(diff).toLocaleString()} ({Math.abs(percentDiff)}%)
                      </span>
                    </div>
                  </div>

                  {diff > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
                        <strong>Action Required:</strong> This budget is forecasted to exceed by ₹{Math.abs(diff).toLocaleString()}. Consider optimization measures.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PageContainer>

      {/* Filter Sidebar */}
      {showFilterSidebar && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowFilterSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Filter Budgets</h3>
                <button
                  onClick={() => setShowFilterSidebar(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Cloud Provider Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cloud Provider</label>
                  <div className="space-y-2">
                    {['AWS', 'Azure', 'GCP'].map((provider) => (
                      <label key={provider} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={budgetFilters.cloudProvider.includes(provider)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBudgetFilters(prev => ({
                                ...prev,
                                cloudProvider: [...prev.cloudProvider, provider]
                              }));
                            } else {
                              setBudgetFilters(prev => ({
                                ...prev,
                                cloudProvider: prev.cloudProvider.filter(p => p !== provider)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{provider}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Environment Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                  <div className="space-y-2">
                    {['Production', 'Development', 'Staging'].map((env) => (
                      <label key={env} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={budgetFilters.environment.includes(env)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBudgetFilters(prev => ({
                                ...prev,
                                environment: [...prev.environment, env]
                              }));
                            } else {
                              setBudgetFilters(prev => ({
                                ...prev,
                                environment: prev.environment.filter(e => e !== env)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{env}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Service Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <div className="space-y-2">
                    {['Compute', 'Storage', 'Database', 'Network'].map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={budgetFilters.service.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBudgetFilters(prev => ({
                                ...prev,
                                service: [...prev.service, service]
                              }));
                            } else {
                              setBudgetFilters(prev => ({
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
                    setBudgetFilters({
                      cloudProvider: [],
                      dateRange: 'Monthly',
                      environment: [],
                      account: [],
                      costCenter: [],
                      service: [],
                      owner: [],
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
    </DashboardLayout>
  );
}