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
  Shield,
  Zap,
  Clock,
  CheckCircle,
  Eye,
  Activity,
  ArrowRight,
  LightbulbIcon,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { CustomDateTimePicker } from '../ui/custom-datetime-picker';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface FinOpsSavingsProps {
  onNavigate?: (page: string, params?: Record<string, string>) => void;
  onLogout?: () => void;
}

// Mock Data for Savings Breakdown
const savingsBreakdownData = [
  { name: 'Reserved Instances', value: 320000, color: '#3B82F6' },
  { name: 'Savings Plans', value: 280000, color: '#AE275F' },
  { name: 'Spot Usage', value: 150000, color: '#10B981' },
  { name: 'Rightsizing', value: 120000, color: '#F59E0B' },
  { name: 'Storage Tiering', value: 80000, color: '#8B5CF6' },
];

// Mock Active Commitments Data
const activeCommitmentsData = [
  {
    id: 1,
    type: 'Reserved Instance',
    service: 'EC2 Compute',
    account: 'Production-AWS-01',
    region: 'us-east-1',
    commitmentValue: '₹4,50,000',
    utilized: 92,
    realizedSavings: '₹3,80,000',
    remainingTerm: '8 months',
    status: 'Healthy',
    expiryDate: '2024-10-15'
  },
  {
    id: 2,
    type: 'Savings Plan',
    service: 'Lambda Compute',
    account: 'Dev-AWS-02',
    region: 'ap-south-1',
    commitmentValue: '₹2,80,000',
    utilized: 88,
    realizedSavings: '₹2,20,000',
    remainingTerm: '1 year',
    status: 'Healthy',
    expiryDate: '2025-02-20'
  },
  {
    id: 3,
    type: 'Reserved Instance',
    service: 'RDS Database',
    account: 'Production-AWS-01',
    region: 'us-west-2',
    commitmentValue: '₹5,20,000',
    utilized: 65,
    realizedSavings: '₹2,80,000',
    remainingTerm: '3 months',
    status: 'At Risk',
    expiryDate: '2024-05-10'
  },
  {
    id: 4,
    type: 'Committed Use Discount',
    service: 'Compute Engine',
    account: 'Production-GCP-01',
    region: 'us-central1',
    commitmentValue: '₹3,60,000',
    utilized: 95,
    realizedSavings: '₹3,10,000',
    remainingTerm: '1.5 years',
    status: 'Healthy',
    expiryDate: '2025-08-30'
  },
  {
    id: 5,
    type: 'Savings Plan',
    service: 'Fargate Compute',
    account: 'UAT-AWS-03',
    region: 'eu-west-1',
    commitmentValue: '₹1,80,000',
    utilized: 55,
    realizedSavings: '₹85,000',
    remainingTerm: '2 months',
    status: 'Expiring',
    expiryDate: '2024-04-05'
  },
  {
    id: 6,
    type: 'Reserved Instance',
    service: 'ElastiCache',
    account: 'Production-AWS-01',
    region: 'ap-southeast-1',
    commitmentValue: '₹2,20,000',
    utilized: 78,
    realizedSavings: '₹1,50,000',
    remainingTerm: '6 months',
    status: 'Healthy',
    expiryDate: '2024-08-20'
  }
];

// Mock At-Risk Commitments Data
const atRiskCommitmentsData = [
  {
    id: 1,
    name: 'RDS Reserved Instance',
    service: 'RDS Database',
    utilization: 65,
    expiryDate: '2024-05-10',
    lostSavings: '₹45,000',
    recommendation: 'Optimize database queries or scale down'
  },
  {
    id: 2,
    name: 'Fargate Savings Plan',
    service: 'Fargate Compute',
    utilization: 55,
    expiryDate: '2024-04-05',
    lostSavings: '₹68,000',
    recommendation: 'Migrate workloads or cancel renewal'
  },
  {
    id: 3,
    name: 'EC2 Reserved Instance',
    service: 'EC2 Compute',
    utilization: 58,
    expiryDate: '2024-06-15',
    lostSavings: '₹52,000',
    recommendation: 'Consolidate instances or modify reservation'
  }
];

// Mock Optimization Opportunities Data
const optimizationOpportunities = [
  {
    id: 1,
    title: 'Downsize 14 EC2 instances',
    savings: '₹6,20,000',
    service: 'EC2 Compute',
    effort: 'Low',
    impact: 'High',
    description: 'CPU utilization < 20% for 30 days'
  },
  {
    id: 2,
    title: 'Move 3TB data to cold storage',
    savings: '₹1,10,000',
    service: 'S3 Storage',
    effort: 'Medium',
    impact: 'Medium',
    description: 'Data not accessed in 90+ days'
  },
  {
    id: 3,
    title: 'Switch to Savings Plan for Compute',
    savings: '₹4,50,000',
    service: 'Lambda',
    effort: 'Low',
    impact: 'High',
    description: 'Consistent usage pattern detected'
  },
  {
    id: 4,
    title: 'Delete unattached EBS volumes',
    savings: '₹85,000',
    service: 'EBS Storage',
    effort: 'Low',
    impact: 'Low',
    description: '28 volumes unattached for 60+ days'
  },
  {
    id: 5,
    title: 'Optimize RDS instance types',
    savings: '₹2,80,000',
    service: 'RDS Database',
    effort: 'Medium',
    impact: 'High',
    description: 'Over-provisioned database instances'
  },
  {
    id: 6,
    title: 'Enable auto-scaling for ASG',
    savings: '₹1,50,000',
    service: 'EC2 Compute',
    effort: 'Medium',
    impact: 'Medium',
    description: 'Static capacity with variable load'
  }
];

export function FinOpsSavings({ onNavigate, onLogout }: FinOpsSavingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [savingsFilters, setSavingsFilters] = useState({
    cloudProvider: [] as string[],
    dateRange: 'Monthly',
    environment: [] as string[],
    account: [] as string[],
    service: [] as string[],
    region: [] as string[],
    commitmentType: [] as string[],
  });

  const handleApplyCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setDateRange(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
    setShowCustomRangePicker(false);
    setShowDateDropdown(false);
  };

  // Calculate KPIs
  const totalRealizedSavings = savingsBreakdownData.reduce((sum, item) => sum + item.value, 0);
  const activeCommitments = activeCommitmentsData.length;
  const totalCommittedValue = activeCommitmentsData.reduce((sum, c) => sum + parseInt(c.commitmentValue.replace(/[₹,]/g, '')), 0);
  const avgUtilization = Math.round(activeCommitmentsData.reduce((sum, c) => sum + c.utilized, 0) / activeCommitmentsData.length);
  const atRiskSavings = atRiskCommitmentsData.reduce((sum, c) => sum + parseInt(c.lostSavings.replace(/[₹,]/g, '')), 0);
  const potentialSavings = optimizationOpportunities.reduce((sum, o) => sum + parseInt(o.savings.replace(/[₹,]/g, '')), 0);

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 80) return 'text-green-600';
    if (utilization >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy': return <Badge className="bg-green-100 text-green-700 border-green-200">Healthy</Badge>;
      case 'At Risk': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">At Risk</Badge>;
      case 'Expiring': return <Badge className="bg-red-100 text-red-700 border-red-200">Expiring</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'Low': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Low Effort</Badge>;
      case 'Medium': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Medium Effort</Badge>;
      case 'High': return <Badge className="bg-red-100 text-red-700 border-red-200">High Effort</Badge>;
      default: return <Badge variant="outline">{effort}</Badge>;
    }
  };

  // Filter commitments based on filters
  const filteredCommitments = activeCommitmentsData.filter(commitment => {
    if (savingsFilters.service.length > 0 && !savingsFilters.service.some(s => commitment.service.includes(s))) {
      return false;
    }
    if (savingsFilters.commitmentType.length > 0 && !savingsFilters.commitmentType.includes(commitment.type)) {
      return false;
    }
    if (savingsFilters.region.length > 0 && !savingsFilters.region.includes(commitment.region)) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return commitment.service.toLowerCase().includes(query) ||
             commitment.account.toLowerCase().includes(query) ||
             commitment.type.toLowerCase().includes(query);
    }
    
    return true;
  });

  return (
    <DashboardLayout 
      currentPage="Savings & Commitments" 
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
                <h1 className="text-3xl font-bold text-white mb-2">Savings & Commitments</h1>
                <p className="text-pink-100">Track realized savings, commitment utilization, and optimization opportunities</p>
              </div>

              {/* Search and Date Range */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-200 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search commitments, services..."
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
              {/* 1. Total Realized Savings */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('savings-breakdown-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Total Realized Savings</span>
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹{(totalRealizedSavings/100000).toFixed(1)}L</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>12% vs last month</span>
                </div>
              </div>

              {/* 2. Active Commitments */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('commitments-table-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Active Commitments</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{activeCommitments}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>₹{(totalCommittedValue/100000).toFixed(1)}L committed</span>
                </div>
              </div>

              {/* 3. Commitment Utilization */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('commitments-table-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Commitment Utilization</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className={`text-2xl font-bold mb-1 ${getUtilizationColor(avgUtilization)}`}>
                  {avgUtilization}%
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>3% improvement</span>
                </div>
              </div>

              {/* 4. At-Risk Savings */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('at-risk-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">At-Risk Savings</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">₹{(atRiskSavings/1000).toFixed(0)}K</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{atRiskCommitmentsData.length} commitments</span>
                </div>
              </div>

              {/* 5. Potential Savings Opportunity */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => document.getElementById('optimization-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Potential Savings</span>
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹{(potentialSavings/100000).toFixed(1)}L</div>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <LightbulbIcon className="w-3 h-3" />
                  <span>{optimizationOpportunities.length} opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredCommitments.length}</span> active commitments
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => onNavigate?.('anomaly-detection')}
            >
              <Activity className="w-4 h-4 mr-2" />
              View in AI-OPS
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
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

        {/* Savings Breakdown Section */}
        <div id="savings-breakdown-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Savings Breakdown by Source</h3>
              <p className="text-sm text-gray-500 mt-1">Distribution of realized savings across optimization categories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={savingsBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {savingsBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              {savingsBreakdownData.map((item) => {
                const percentage = ((item.value / totalRealizedSavings) * 100).toFixed(1);
                return (
                  <div key={item.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{percentage}% of total savings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">₹{(item.value/1000).toFixed(0)}K</div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+8%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Commitments Table */}
        <div id="commitments-table-section" className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Active Commitments Overview</h3>
                <p className="text-sm text-gray-500 mt-1">
                  All active commitments across cloud providers
                  {filteredCommitments.length !== activeCommitmentsData.length && ` (${filteredCommitments.length} of ${activeCommitmentsData.length} shown)`}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account / Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commitment Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilized %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Realized Savings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommitments.map((commitment) => (
                  <tr 
                    key={commitment.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {/* Handle commitment details click */}}
                  >
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs">{commitment.type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{commitment.service}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{commitment.account}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{commitment.region}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{commitment.commitmentValue}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                          <div 
                            className={`h-2 rounded-full ${
                              commitment.utilized > 80 ? 'bg-green-500' :
                              commitment.utilized >= 60 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${commitment.utilized}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getUtilizationColor(commitment.utilized)}`}>
                          {commitment.utilized}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">{commitment.realizedSavings}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{commitment.remainingTerm}</td>
                    <td className="px-6 py-4">{getStatusBadge(commitment.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view utilization
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate?.('anomaly-detection');
                          }}
                        >
                          <Activity className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* At-Risk & Expiring Commitments */}
        <div id="at-risk-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">At-Risk & Expiring Commitments</h3>
              <p className="text-sm text-gray-500 mt-1">Underutilized commitments and upcoming expirations requiring attention</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commitment Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lost Savings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {atRiskCommitmentsData.map((risk) => (
                  <tr 
                    key={risk.id} 
                    className="border-b border-gray-100 hover:bg-red-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-gray-900">{risk.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{risk.service}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getUtilizationColor(risk.utilization)}`}>
                        {risk.utilization}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{risk.expiryDate}</td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">{risk.lostSavings}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{risk.recommendation}</td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optimization Opportunities */}
        <div id="optimization-section" className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Optimization Opportunities</h3>
              <p className="text-sm text-gray-500 mt-1">AI-powered recommendations to maximize cloud savings</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => onNavigate?.('fin-ops-cloud-services')}
            >
              View All in Cloud Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {optimizationOpportunities.map((opportunity) => (
              <div 
                key={opportunity.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-[#AE275F]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <LightbulbIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  {getEffortBadge(opportunity.effort)}
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">{opportunity.title}</h4>
                <p className="text-xs text-gray-500 mb-3">{opportunity.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-gray-500">Estimated Savings</div>
                    <div className="text-lg font-bold text-green-600">{opportunity.savings}<span className="text-sm text-gray-500">/mo</span></div>
                  </div>
                  <Badge variant="outline" className="text-xs">{opportunity.service}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4C] text-white"
                    onClick={() => onNavigate?.('fin-ops-cloud-services')}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    Mark Planned
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Powered by AI-OPS */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Activity className="w-4 h-4 text-[#AE275F]" />
              <span>Powered by <strong className="text-[#AE275F]">AI-OPS</strong> - Predictive Analytics & Anomaly Detection</span>
            </div>
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
                <h3 className="text-lg font-medium text-gray-900">Filter Commitments</h3>
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
                          checked={savingsFilters.cloudProvider.includes(provider)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSavingsFilters(prev => ({
                                ...prev,
                                cloudProvider: [...prev.cloudProvider, provider]
                              }));
                            } else {
                              setSavingsFilters(prev => ({
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

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]"
                    value={savingsFilters.dateRange}
                    onChange={(e) => setSavingsFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                {/* Environment Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                  <div className="space-y-2">
                    {['Production', 'UAT', 'Development'].map((env) => (
                      <label key={env} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={savingsFilters.environment.includes(env)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSavingsFilters(prev => ({
                                ...prev,
                                environment: [...prev.environment, env]
                              }));
                            } else {
                              setSavingsFilters(prev => ({
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

                {/* Service Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <div className="space-y-2">
                    {['Compute', 'Storage', 'Network', 'Database'].map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={savingsFilters.service.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSavingsFilters(prev => ({
                                ...prev,
                                service: [...prev.service, service]
                              }));
                            } else {
                              setSavingsFilters(prev => ({
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

                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {['us-east-1', 'us-west-2', 'ap-south-1', 'ap-southeast-1', 'eu-west-1', 'us-central1'].map((region) => (
                      <label key={region} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={savingsFilters.region.includes(region)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSavingsFilters(prev => ({
                                ...prev,
                                region: [...prev.region, region]
                              }));
                            } else {
                              setSavingsFilters(prev => ({
                                ...prev,
                                region: prev.region.filter(r => r !== region)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Commitment Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commitment Type</label>
                  <div className="space-y-2">
                    {['Reserved Instance', 'Savings Plan', 'Committed Use Discount'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={savingsFilters.commitmentType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSavingsFilters(prev => ({
                                ...prev,
                                commitmentType: [...prev.commitmentType, type]
                              }));
                            } else {
                              setSavingsFilters(prev => ({
                                ...prev,
                                commitmentType: prev.commitmentType.filter(t => t !== type)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
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
                    setSavingsFilters({
                      cloudProvider: [],
                      dateRange: 'Monthly',
                      environment: [],
                      account: [],
                      service: [],
                      region: [],
                      commitmentType: [],
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
