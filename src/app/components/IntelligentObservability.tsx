import { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  CheckCircle,
  Eye,
  Clock,
  MapPin,
  Users,
  Shield,
  Zap,
  Server,
  Database,
  Network
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PageContainer } from './layouts/PageContainer';

interface IntelligentObservabilityProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function IntelligentObservability({ onNavigate, onLogout }: IntelligentObservabilityProps) {
  const summaryCards = [
    { 
      title: 'Total Transactions Today', 
      value: '1,82,491', 
      subtext: 'Monitored in real time',
      icon: Activity, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Anomalies Detected', 
      value: '47', 
      subtext: 'Behavioural + rule-based',
      icon: AlertTriangle, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      title: 'High-Risk Alerts', 
      value: '12', 
      subtext: 'Require immediate review',
      icon: Shield, 
      color: 'text-red-600', 
      bg: 'bg-red-50' 
    },
    { 
      title: 'System Health Score', 
      value: '97%', 
      subtext: 'API uptime, latency, model health',
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    }
  ];

  const realTimeAlerts = [
    {
      message: 'High-risk transaction detected for ACC-28412 (₹3.2L)',
      time: '2 mins ago',
      risk: 'High',
      riskColor: 'bg-red-100 text-red-700'
    },
    {
      message: 'Multiple failed login attempts from unusual IP: 192.22.x.x',
      time: '5 mins ago',
      risk: 'Medium',
      riskColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      message: 'Velocity spike: 14 transactions within 3 mins for ACC-39142',
      time: '8 mins ago',
      risk: 'High',
      riskColor: 'bg-red-100 text-red-700'
    },
    {
      message: 'New behavioural anomaly detected in Merchant Category MCC-4823',
      time: '12 mins ago',
      risk: 'Medium',
      riskColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      message: 'Unusual cross-border transaction sequence observed',
      time: '15 mins ago',
      risk: 'High',
      riskColor: 'bg-red-100 text-red-700'
    }
  ];

  const alertTrendData = [
    { date: 'Nov 13', total: 65, highRisk: 15, anomaly: 28 },
    { date: 'Nov 14', total: 72, highRisk: 18, anomaly: 32 },
    { date: 'Nov 15', total: 58, highRisk: 12, anomaly: 25 },
    { date: 'Nov 16', total: 85, highRisk: 22, anomaly: 38 },
    { date: 'Nov 17', total: 93, highRisk: 25, anomaly: 42 },
    { date: 'Nov 18', total: 78, highRisk: 19, anomaly: 35 },
    { date: 'Nov 19', total: 102, highRisk: 28, anomaly: 47 }
  ];

  const patternDeviationData = [
    { pattern: 'Velocity', deviation: 45 },
    { pattern: 'Amount Spikes', deviation: 78 },
    { pattern: 'Merchant Change', deviation: 32 },
    { pattern: 'Location Anomalies', deviation: 65 }
  ];

  const anomalyTable = [
    {
      id: 'AN-1092',
      account: 'ACC-28412',
      pattern: 'Velocity Spike',
      severity: 'High',
      time: '10:12 AM',
      severityColor: 'bg-red-100 text-red-700'
    },
    {
      id: 'AN-1093',
      account: 'ACC-39142',
      pattern: 'Geo Mismatch',
      severity: 'Medium',
      time: '10:18 AM',
      severityColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'AN-1094',
      account: 'ACC-43892',
      pattern: 'Unusual Merchant',
      severity: 'High',
      time: '11:10 AM',
      severityColor: 'bg-red-100 text-red-700'
    },
    {
      id: 'AN-1095',
      account: 'ACC-59302',
      pattern: 'IP Risk',
      severity: 'Medium',
      time: '11:35 AM',
      severityColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'AN-1096',
      account: 'ACC-61442',
      pattern: 'Amount Anomaly',
      severity: 'High',
      time: '12:05 PM',
      severityColor: 'bg-red-100 text-red-700'
    },
    {
      id: 'AN-1097',
      account: 'ACC-72183',
      pattern: 'Device Fingerprint Change',
      severity: 'Low',
      time: '12:22 PM',
      severityColor: 'bg-gray-100 text-gray-700'
    },
    {
      id: 'AN-1098',
      account: 'ACC-84720',
      pattern: 'Cross-Border Pattern',
      severity: 'Medium',
      time: '01:15 PM',
      severityColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'AN-1099',
      account: 'ACC-91238',
      pattern: 'Merchant Category Switch',
      severity: 'High',
      time: '01:42 PM',
      severityColor: 'bg-red-100 text-red-700'
    }
  ];

  const behaviourInsights = [
    'Cluster #12 shows rising activity — 5 anomalies in 2 hours',
    'Merchant MCC-4823 repeatedly linked to medium-risk alerts',
    'Account ACC-28412 has 3 anomaly types triggered today',
    'Location hopping pattern similar to last week\'s flagged case'
  ];

  const systemHealth = [
    { label: 'API Latency', value: '112ms', icon: Zap, color: 'text-green-600' },
    { label: 'Model Refresh', value: '23 minutes ago', icon: Server, color: 'text-blue-600' },
    { label: 'Data Pipeline Status', value: 'Healthy', icon: Database, color: 'text-green-600' },
    { label: 'Log Ingestion', value: 'Real-time', icon: Network, color: 'text-green-600' }
  ];

  return (
    <DashboardLayout onLogout={onLogout} onNavigate={onNavigate} currentPage="intelligent-observability">
      <PageContainer>
        {/* Hero Section with Magenta Background */}
        <div className="bg-[#AE275F] rounded-lg p-8 mb-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-white mb-2">Intelligent Observability</h1>
            <p className="text-white/90">Real-time monitoring of anomalies, risk patterns, and AML system health.</p>
          </div>

          {/* Summary Cards Inside Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, index) => (
              <Card key={index} className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                      <p className="text-3xl text-gray-900 mb-1">{card.value}</p>
                      <p className="text-xs text-gray-500">{card.subtext}</p>
                    </div>
                    <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Right Sidebar Column */}
          <div className="lg:col-span-1 lg:order-2 space-y-6">
            {/* Real-Time Alerts Feed */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#AE275F]" />
                  Real-Time Alerts Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {realTimeAlerts.map((alert, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${alert.riskColor} border-0 text-xs`}>
                          {alert.risk}
                        </Badge>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <Button size="sm" variant="outline" className="w-full border-[#AE275F] text-[#AE275F] hover:bg-[#AE275F]/10">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Root Cause Analysis Card */}
            <Card className="border-orange-200 bg-orange-50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <AlertTriangle className="w-5 h-5" />
                  Root Cause Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-orange-900 mb-1"><strong>Primary cause:</strong></p>
                  <p className="text-sm text-orange-800">Unusual velocity pattern + repeated location switching</p>
                </div>
                <div>
                  <p className="text-sm text-orange-900 mb-1"><strong>Affected Accounts:</strong></p>
                  <p className="text-sm text-orange-800">ACC-28412, ACC-39142</p>
                </div>
                <div>
                  <p className="text-sm text-orange-900 mb-1"><strong>Risk Score Impact:</strong></p>
                  <p className="text-sm text-orange-800">+22%</p>
                </div>
                <div>
                  <p className="text-sm text-orange-900 mb-1"><strong>Suggested Action:</strong></p>
                  <p className="text-sm text-orange-800">Trigger "Suspicious Transaction Review" runbook</p>
                </div>
              </CardContent>
            </Card>

            {/* Behaviour Pattern Insights */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Behaviour Pattern Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {behaviourInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Left Column - Takes 2 columns */}
          <div className="lg:col-span-2 lg:order-1 space-y-6">
            {/* Alert Trend Chart */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#AE275F]" />
                  Alert Trend — Last 7 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={alertTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#AE275F" 
                        strokeWidth={2}
                        name="Total Alerts"
                        dot={{ fill: '#AE275F', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="highRisk" 
                        stroke="#dc2626" 
                        strokeWidth={2}
                        name="High-Risk Alerts"
                        dot={{ fill: '#dc2626', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="anomaly" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        name="Anomaly-Based"
                        dot={{ fill: '#f59e0b', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Pattern Deviation Chart */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#AE275F]" />
                  Transaction Pattern Deviation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patternDeviationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="pattern" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="deviation" fill="#AE275F" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Anomaly Drill-Down Table */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Anomalies Detected Today
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Anomaly ID</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Pattern</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {anomalyTable.map((anomaly) => (
                        <TableRow key={anomaly.id}>
                          <TableCell className="text-gray-900 pl-6">{anomaly.id}</TableCell>
                          <TableCell className="text-gray-900">{anomaly.account}</TableCell>
                          <TableCell className="text-gray-600">{anomaly.pattern}</TableCell>
                          <TableCell>
                            <Badge className={`${anomaly.severityColor} border-0`}>
                              {anomaly.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{anomaly.time}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="border-[#AE275F] text-[#AE275F] hover:bg-[#AE275F]/10">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Observability Health Checks - Full Width */}
        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-[#AE275F]" />
              System Observability Health Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemHealth.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardLayout>
  );
}