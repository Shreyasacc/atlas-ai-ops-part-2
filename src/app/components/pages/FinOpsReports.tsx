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
  Activity,
  FileText,
  Mail,
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AlertCircle,
  Shield,
  Zap,
  Eye
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { CustomDateTimePicker } from '../ui/custom-datetime-picker';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface FinOpsReportsProps {
  onNavigate?: (page: string, params?: Record<string, string>) => void;
  onLogout?: () => void;
}

type ReportTab = 'cost-summary' | 'service-spend' | 'budget-forecast' | 'savings-commitments' | 'anomalies-alerts' | 'usage-optimization' | 'executive-summary';

// Mock Data for Cost Trend
const costTrendData = [
  { month: 'Jan', compute: 120000, storage: 45000, network: 25000, database: 80000 },
  { month: 'Feb', compute: 135000, storage: 48000, network: 28000, database: 85000 },
  { month: 'Mar', compute: 150000, storage: 52000, network: 30000, database: 90000 },
  { month: 'Apr', compute: 145000, storage: 50000, network: 29000, database: 88000 },
  { month: 'May', compute: 160000, storage: 55000, network: 32000, database: 95000 },
  { month: 'Jun', compute: 175000, storage: 58000, network: 35000, database: 100000 },
];

// Mock Data for Service Breakdown
const serviceBreakdownData = [
  { name: 'Compute', value: 945000, color: '#3B82F6' },
  { name: 'Storage', value: 308000, color: '#10B981' },
  { name: 'Network', value: 179000, color: '#F59E0B' },
  { name: 'Database', value: 538000, color: '#8B5CF6' },
];

// Mock Data for Cost Breakdown Table
const costBreakdownTableData = [
  {
    id: 1,
    service: 'EC2 Compute',
    account: 'Production-AWS-01',
    region: 'us-east-1',
    actualSpend: '₹9,45,000',
    contribution: 47.5,
    trend: 'up',
    trendValue: 8.2,
    optimizationFlag: true
  },
  {
    id: 2,
    service: 'RDS Database',
    account: 'Production-AWS-01',
    region: 'us-west-2',
    actualSpend: '₹5,38,000',
    contribution: 27.0,
    trend: 'up',
    trendValue: 5.3,
    optimizationFlag: false
  },
  {
    id: 3,
    service: 'S3 Storage',
    account: 'Production-AWS-01',
    region: 'us-east-1',
    actualSpend: '₹3,08,000',
    contribution: 15.5,
    trend: 'down',
    trendValue: -2.1,
    optimizationFlag: true
  },
  {
    id: 4,
    service: 'CloudFront CDN',
    account: 'Production-AWS-01',
    region: 'Global',
    actualSpend: '₹1,79,000',
    contribution: 9.0,
    trend: 'up',
    trendValue: 12.5,
    optimizationFlag: false
  },
  {
    id: 5,
    service: 'Lambda Functions',
    account: 'Dev-AWS-02',
    region: 'ap-south-1',
    actualSpend: '₹95,000',
    contribution: 4.8,
    trend: 'down',
    trendValue: -3.2,
    optimizationFlag: true
  }
];

// Mock Data for Budget vs Actual
const budgetActualData = [
  { month: 'Jan', budget: 300000, actual: 270000 },
  { month: 'Feb', budget: 300000, actual: 296000 },
  { month: 'Mar', budget: 320000, actual: 322000 },
  { month: 'Apr', budget: 320000, actual: 312000 },
  { month: 'May', budget: 340000, actual: 342000 },
  { month: 'Jun', budget: 340000, actual: 368000 },
];

// Mock Data for Anomalies
const anomaliesData = [
  {
    id: 1,
    date: '2024-02-28',
    service: 'EC2 Compute',
    anomalyType: 'Spike',
    impactAmount: '₹45,000',
    status: 'Resolved',
    severity: 'High',
    linkedRCA: 'RCA-2024-028'
  },
  {
    id: 2,
    date: '2024-02-25',
    service: 'CloudFront CDN',
    anomalyType: 'Unusual Pattern',
    impactAmount: '₹28,000',
    status: 'Under Investigation',
    severity: 'Medium',
    linkedRCA: 'RCA-2024-025'
  },
  {
    id: 3,
    date: '2024-02-20',
    service: 'RDS Database',
    anomalyType: 'Gradual Increase',
    impactAmount: '₹18,500',
    status: 'Monitoring',
    severity: 'Low',
    linkedRCA: '-'
  }
];

// Mock Data for Optimization Status
const optimizationStatusData = [
  { name: 'Applied', value: 18, color: '#10B981' },
  { name: 'Pending', value: 12, color: '#F59E0B' },
  { name: 'Rejected', value: 3, color: '#EF4444' },
];

export function FinOpsReports({ onNavigate, onLogout }: FinOpsReportsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<ReportTab>('cost-summary');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  
  const [reportFilters, setReportFilters] = useState({
    cloudProvider: [] as string[],
    dateRange: 'Monthly',
    environment: [] as string[],
    account: [] as string[],
    service: [] as string[],
    region: [] as string[],
    costCenter: [] as string[],
  });

  const handleApplyCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setDateRange(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
    setShowCustomRangePicker(false);
    setShowDateDropdown(false);
  };

  // Calculate KPIs
  const totalCloudSpend = serviceBreakdownData.reduce((sum, item) => sum + item.value, 0);
  const budgetVariance = 28000; // Over budget
  const totalSavingsRealized = 950000;
  const activeCostAnomalies = 5;
  const forecastedSpend = 2280000;

  const reportTabs = [
    { id: 'cost-summary', label: 'Cost Summary', icon: BarChart3 },
    { id: 'service-spend', label: 'Service-wise Spend', icon: PieChartIcon },
    { id: 'budget-forecast', label: 'Budget & Forecast', icon: Target },
    { id: 'savings-commitments', label: 'Savings & Commitments', icon: DollarSign },
    { id: 'anomalies-alerts', label: 'Anomalies & Alerts', icon: AlertTriangle },
    { id: 'usage-optimization', label: 'Usage & Optimization', icon: Zap },
    { id: 'executive-summary', label: 'Executive Summary', icon: FileText },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'High': return <Badge className="bg-red-100 text-red-700 border-red-200">High</Badge>;
      case 'Medium': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Medium</Badge>;
      case 'Low': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Low</Badge>;
      default: return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved': return <Badge className="bg-green-100 text-green-700 border-green-200">Resolved</Badge>;
      case 'Under Investigation': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Under Investigation</Badge>;
      case 'Monitoring': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Monitoring</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderReportContent = () => {
    switch (activeTab) {
      case 'cost-summary':
        return (
          <>
            {/* Cost Breakdown Visualization */}
            <div id="cost-breakdown-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Cost Breakdown Visualization</h3>
                  <p className="text-sm text-gray-500 mt-1">Monthly spend trend by service category</p>
                </div>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#AE275F]">
                    <option>By Service</option>
                    <option>By Account</option>
                    <option>By Cost Center</option>
                  </select>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={costTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="compute" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Compute" />
                  <Area type="monotone" dataKey="database" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="Database" />
                  <Area type="monotone" dataKey="storage" stackId="1" stroke="#10B981" fill="#10B981" name="Storage" />
                  <Area type="monotone" dataKey="network" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Network" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Breakdown Table */}
            <div className="bg-white border border-gray-200 rounded-lg mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Cost Breakdown Details</h3>
                    <p className="text-sm text-gray-500 mt-1">Detailed cost analysis by service and account</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account / Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Spend</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Contribution</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costBreakdownTableData.map((row) => (
                      <tr 
                        key={row.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onNavigate?.('fin-ops-cloud-services')}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{row.service}</span>
                            {row.optimizationFlag && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Optimize
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.account}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.region}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.actualSpend}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                              <div 
                                className="h-2 rounded-full bg-[#AE275F]"
                                style={{ width: `${row.contribution}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700">{row.contribution.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-1 text-sm ${row.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                            {row.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span>{Math.abs(row.trendValue)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate?.('fin-ops-cloud-services');
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'service-spend':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Service-wise Spend Analysis</h3>
                <p className="text-sm text-gray-500 mt-1">Detailed breakdown of costs by individual services</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Pie Chart */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceBreakdownData.map((entry, index) => (
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

              {/* Service Cards */}
              <div className="space-y-3">
                {serviceBreakdownData.map((service) => (
                  <div 
                    key={service.name}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => onNavigate?.('fin-ops-cloud-services')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: service.color }}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500">Click to view details</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">₹{(service.value/1000).toFixed(0)}K</div>
                        <div className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>+5.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Monthly Service Cost Trend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="compute" stroke="#3B82F6" name="Compute" />
                  <Line type="monotone" dataKey="database" stroke="#8B5CF6" name="Database" />
                  <Line type="monotone" dataKey="storage" stroke="#10B981" name="Storage" />
                  <Line type="monotone" dataKey="network" stroke="#F59E0B" name="Network" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'budget-forecast':
        return (
          <div className="space-y-6">
            {/* Budget vs Actual Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Budget vs Actual Spend</h3>
                  <p className="text-sm text-gray-500 mt-1">Track budget adherence and identify variances</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate?.('fin-ops-budgets')}
                >
                  View Budget Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetActualData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="budget" fill="#94A3B8" name="Budget" />
                  <Bar dataKey="actual" fill="#AE275F" name="Actual Spend" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Over-Budget Services */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Over-Budget Services</h3>
              <div className="space-y-3">
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">EC2 Compute</div>
                      <div className="text-xs text-gray-500 mt-1">Production-AWS-01</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">+₹45,000</div>
                      <div className="text-xs text-gray-500">15% over budget</div>
                    </div>
                  </div>
                </div>
                <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">CloudFront CDN</div>
                      <div className="text-xs text-gray-500 mt-1">Production-AWS-01</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-amber-600">+₹18,000</div>
                      <div className="text-xs text-gray-500">8% over budget</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Accuracy */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Forecast Accuracy Indicator</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">Forecast Confidence</span>
                    <Badge className="bg-green-100 text-green-700 border-green-200">High</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="h-3 rounded-full bg-green-500" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Based on 6 months data</div>
                  <div className="text-xs text-green-600 flex items-center gap-1 justify-end mt-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Last forecast accuracy: 88%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'savings-commitments':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Savings & Commitments Report</h3>
                <p className="text-sm text-gray-500 mt-1">Track savings realized and commitment utilization</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => onNavigate?.('fin-ops-savings')}
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Savings by Source */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Savings by Source</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Reserved Instances', amount: 320000, color: '#3B82F6' },
                    { name: 'Savings Plans', amount: 280000, color: '#AE275F' },
                    { name: 'Spot Usage', amount: 150000, color: '#10B981' },
                    { name: 'Rightsizing', amount: 120000, color: '#F59E0B' },
                    { name: 'Storage Tiering', amount: 80000, color: '#8B5CF6' }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-900">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">₹{(item.amount/1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commitment Utilization */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Commitment Utilization Trend</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={[
                    { month: 'Jan', utilization: 75 },
                    { month: 'Feb', utilization: 78 },
                    { month: 'Mar', utilization: 82 },
                    { month: 'Apr', utilization: 79 },
                    { month: 'May', utilization: 85 },
                    { month: 'Jun', utilization: 88 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value: number) => `${value}%`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line type="monotone" dataKey="utilization" stroke="#AE275F" strokeWidth={2} name="Utilization %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* At-Risk Savings */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">At-Risk & Missed Savings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="text-xs text-gray-500 mb-1">Underutilized Commitments</div>
                  <div className="text-2xl font-bold text-red-600">₹85K</div>
                  <div className="text-xs text-gray-500 mt-1">3 commitments</div>
                </div>
                <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                  <div className="text-xs text-gray-500 mb-1">Expiring Soon</div>
                  <div className="text-2xl font-bold text-amber-600">₹45K</div>
                  <div className="text-xs text-gray-500 mt-1">2 commitments</div>
                </div>
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="text-xs text-gray-500 mb-1">Potential Additional Savings</div>
                  <div className="text-2xl font-bold text-blue-600">₹165K</div>
                  <div className="text-xs text-gray-500 mt-1">6 opportunities</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'anomalies-alerts':
        return (
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Cost Anomalies & Budget Alerts</h3>
                  <p className="text-sm text-gray-500 mt-1">Historical anomalies and their financial impact</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate?.('anomaly-detection')}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  View in AI-OPS
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anomaly Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked RCA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {anomaliesData.map((anomaly) => (
                    <tr 
                      key={anomaly.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">{anomaly.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{anomaly.service}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{anomaly.anomalyType}</td>
                      <td className="px-6 py-4 text-sm font-medium text-red-600">{anomaly.impactAmount}</td>
                      <td className="px-6 py-4">{getSeverityBadge(anomaly.severity)}</td>
                      <td className="px-6 py-4">{getStatusBadge(anomaly.status)}</td>
                      <td className="px-6 py-4">
                        {anomaly.linkedRCA !== '-' ? (
                          <span className="text-sm text-[#AE275F] font-medium">{anomaly.linkedRCA}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onNavigate?.('rca')}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onNavigate?.('anomaly-detection')}
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
        );

      case 'usage-optimization':
        return (
          <div className="space-y-6">
            {/* Optimization Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Optimization Recommendations Status</h3>
                  <p className="text-sm text-gray-500 mt-1">Track applied vs pending optimizations</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate?.('fin-ops-cloud-services')}
                >
                  View All Optimizations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Pie Chart */}
                <div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={optimizationStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {optimizationStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Summary */}
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Applied Optimizations</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">18</Badge>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">₹8.2L/mo</div>
                    <div className="text-xs text-gray-500 mt-1">Realized savings</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Pending Review</span>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">12</Badge>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">₹6.5L/mo</div>
                    <div className="text-xs text-gray-500 mt-1">Potential additional savings</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Rejected</span>
                      <Badge className="bg-red-100 text-red-700 border-red-200">3</Badge>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">₹1.8L/mo</div>
                    <div className="text-xs text-gray-500 mt-1">Not applicable</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage vs Cost Correlation */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Usage vs Cost Correlation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip 
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="compute" stroke="#3B82F6" name="Compute Cost" />
                  <Line yAxisId="right" type="monotone" dataKey="storage" stroke="#10B981" name="Storage Cost" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'executive-summary':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
              <p className="text-sm text-gray-500 mt-2">Cloud Cost & Optimization Report - {dateRange}</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Total Spend</div>
                <div className="text-3xl font-bold text-gray-900">₹{(totalCloudSpend/100000).toFixed(1)}L</div>
                <div className="text-xs text-green-600 mt-2">↑ 8.5% vs last period</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Savings Achieved</div>
                <div className="text-3xl font-bold text-gray-900">₹{(totalSavingsRealized/100000).toFixed(1)}L</div>
                <div className="text-xs text-green-600 mt-2">↑ 12% improvement</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Budget Health</div>
                <div className="text-3xl font-bold text-amber-600">92%</div>
                <div className="text-xs text-gray-600 mt-2">On track</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Active Alerts</div>
                <div className="text-3xl font-bold text-gray-900">{activeCostAnomalies}</div>
                <div className="text-xs text-gray-600 mt-2">Require attention</div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Strong Cost Optimization</div>
                      <div className="text-sm text-gray-600 mt-1">Successfully implemented 18 optimization recommendations, achieving ₹8.2L in monthly savings</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Budget Variance Alert</div>
                      <div className="text-sm text-gray-600 mt-1">EC2 Compute spending is 15% over budget. Recommend immediate rightsizing review</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">High Commitment Utilization</div>
                      <div className="text-sm text-gray-600 mt-1">Reserved Instance utilization at 88%, exceeding industry benchmark of 75%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Recommendations */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top Recommendations</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-900">1. Downsize 14 underutilized EC2 instances</span>
                    <span className="text-sm font-medium text-green-600">Save ₹6.2L/mo</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-900">2. Enable Savings Plan for Lambda workloads</span>
                    <span className="text-sm font-medium text-green-600">Save ₹4.5L/mo</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-900">3. Optimize RDS instance types</span>
                    <span className="text-sm font-medium text-green-600">Save ₹2.8L/mo</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Actions</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#AE275F]">•</span>
                    <span>Review and apply pending 12 optimization recommendations to unlock additional ₹6.5L monthly savings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#AE275F]">•</span>
                    <span>Investigate EC2 budget variance and implement cost controls to prevent future overruns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#AE275F]">•</span>
                    <span>Address 3 at-risk commitments to prevent ₹85K in lost savings opportunity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout 
      currentPage="Reports" 
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
                <h1 className="text-3xl font-bold text-white mb-2">FinOps Reports</h1>
                <p className="text-pink-100">Comprehensive cost analysis, budget tracking, and optimization insights</p>
              </div>

              {/* Search and Date Range */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-200 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search reports, services..."
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
              {/* 1. Total Cloud Spend */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => {
                  setActiveTab('cost-summary');
                  setTimeout(() => {
                    document.getElementById('cost-breakdown-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Total Cloud Spend</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹{(totalCloudSpend/100000).toFixed(1)}L</div>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>8.5% vs last period</span>
                </div>
              </div>

              {/* 2. Budget Variance */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setActiveTab('budget-forecast')}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Budget Variance</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <Target className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">+₹{(budgetVariance/1000).toFixed(0)}K</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>8% over budget</span>
                </div>
              </div>

              {/* 3. Total Savings Realized */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setActiveTab('savings-commitments')}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Savings Realized</span>
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹{(totalSavingsRealized/100000).toFixed(1)}L</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>12% improvement</span>
                </div>
              </div>

              {/* 4. Active Cost Anomalies */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setActiveTab('anomalies-alerts')}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Cost Anomalies</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{activeCostAnomalies}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Activity className="w-3 h-3" />
                  <span>Highest: ₹45K</span>
                </div>
              </div>

              {/* 5. Forecasted Spend */}
              <div 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setActiveTab('budget-forecast')}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-xs font-medium">Forecasted Spend</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <LineChartIcon className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹{(forecastedSpend/100000).toFixed(1)}L</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>High confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Category Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-x-auto">
          <div className="flex items-center gap-1 p-2">
            {reportTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ReportTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#AE275F] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Viewing <span className="font-medium">{reportTabs.find(t => t.id === activeTab)?.label}</span> report
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowFilterSidebar(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="relative">
              <Button 
                className="bg-[#AE275F] hover:bg-[#8B1F4C] text-white"
                onClick={() => setShowExportDropdown(!showExportDropdown)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Export as PDF
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Export as CSV
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Export as XLS
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Schedule Report
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Share via Email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Content */}
        {renderReportContent()}
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
                <h3 className="text-lg font-medium text-gray-900">Filter Reports</h3>
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
                          checked={reportFilters.cloudProvider.includes(provider)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReportFilters(prev => ({
                                ...prev,
                                cloudProvider: [...prev.cloudProvider, provider]
                              }));
                            } else {
                              setReportFilters(prev => ({
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
                    {['Production', 'UAT', 'Development'].map((env) => (
                      <label key={env} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={reportFilters.environment.includes(env)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReportFilters(prev => ({
                                ...prev,
                                environment: [...prev.environment, env]
                              }));
                            } else {
                              setReportFilters(prev => ({
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
                          checked={reportFilters.service.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReportFilters(prev => ({
                                ...prev,
                                service: [...prev.service, service]
                              }));
                            } else {
                              setReportFilters(prev => ({
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
                          checked={reportFilters.region.includes(region)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReportFilters(prev => ({
                                ...prev,
                                region: [...prev.region, region]
                              }));
                            } else {
                              setReportFilters(prev => ({
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

                {/* Cost Center Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Center</label>
                  <div className="space-y-2">
                    {['Engineering', 'Marketing', 'Sales', 'Operations'].map((center) => (
                      <label key={center} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={reportFilters.costCenter.includes(center)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReportFilters(prev => ({
                                ...prev,
                                costCenter: [...prev.costCenter, center]
                              }));
                            } else {
                              setReportFilters(prev => ({
                                ...prev,
                                costCenter: prev.costCenter.filter(c => c !== center)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-[#AE275F] focus:ring-[#AE275F]"
                        />
                        <span className="ml-2 text-sm text-gray-700">{center}</span>
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
                    setReportFilters({
                      cloudProvider: [],
                      dateRange: 'Monthly',
                      environment: [],
                      account: [],
                      service: [],
                      region: [],
                      costCenter: [],
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
