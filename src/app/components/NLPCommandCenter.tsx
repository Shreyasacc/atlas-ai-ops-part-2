import { useState } from 'react';
import { 
  Mic, 
  Search, 
  AlertTriangle, 
  Users, 
  Activity, 
  TrendingUp,
  Eye,
  ShieldAlert,
  FileText,
  Bell,
  Lock,
  Link2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PageContainer } from './layouts/PageContainer';

interface NLPCommandCenterProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function NLPCommandCenter({ onNavigate, onLogout }: NLPCommandCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const quickCommands = [
    'Show high-risk alerts today',
    'List accounts flagged for unusual activity',
    'Show suspicious transactions last 24 hours',
    'Explain root cause of Alert #ID',
    'Start suspicious transaction review runbook'
  ];

  const summaryCards = [
    { title: 'Suspicious Transactions', value: '128', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'High-Risk Accounts', value: '19', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Behavioural Anomalies', value: '3', icon: Activity, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Fraud Probability', value: '87%', icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50' }
  ];

  const transactions = [
    { 
      id: 'TXN-39212', 
      account: 'ACC-28412', 
      amount: '₹72,000', 
      risk: 'High', 
      pattern: 'Velocity spike', 
      time: '10:23 AM',
      riskColor: 'bg-orange-100 text-orange-700'
    },
    { 
      id: 'TXN-28493', 
      account: 'ACC-49302', 
      amount: '₹4,52,000', 
      risk: 'Medium', 
      pattern: 'Unusual merchant', 
      time: '02:14 PM',
      riskColor: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 'TXN-58214', 
      account: 'ACC-10922', 
      amount: '₹1,90,000', 
      risk: 'Very High', 
      pattern: 'Geo mismatch', 
      time: '06:11 PM',
      riskColor: 'bg-red-100 text-red-700'
    }
  ];

  const chartData = [
    { date: 'Nov 13', alerts: 45 },
    { date: 'Nov 14', alerts: 52 },
    { date: 'Nov 15', alerts: 38 },
    { date: 'Nov 16', alerts: 65 },
    { date: 'Nov 17', alerts: 73 },
    { date: 'Nov 18', alerts: 58 },
    { date: 'Nov 19', alerts: 82 }
  ];

  const recommendedActions = [
    { icon: FileText, label: 'Run Suspicious Transaction Review Runbook', color: 'bg-[#AE275F]' },
    { icon: Lock, label: 'Freeze Account ACC-28412', color: 'bg-red-600' },
    { icon: FileText, label: 'Generate SAR Draft', color: 'bg-blue-600' },
    { icon: Bell, label: 'Notify Compliance Officer', color: 'bg-orange-600' },
    { icon: Link2, label: 'View linked anomalies (Last 48 hours)', color: 'bg-purple-600' }
  ];

  const relatedInsights = [
    'Account ACC-28412 shows repeated high-velocity activity',
    'Pattern #12 matched in 27 cases this week',
    'Merchant category MCC-4823 appears in 6 suspicious transactions'
  ];

  const recentQueries = [
    { query: 'Show high-risk alerts today', time: '10:10 AM' },
    { query: 'List flagged accounts', time: '10:06 AM' },
    { query: 'Show suspicious transactions 24h', time: '10:03 AM' },
    { query: 'Explain root cause Alert #5323', time: '9:58 AM' },
    { query: 'Start review runbook', time: '9:55 AM' }
  ];

  return (
    <DashboardLayout onLogout={onLogout} onNavigate={onNavigate} currentPage="nlp-command-center">
      <PageContainer>
        {/* Hero Section with Magenta Background */}
        <div className="bg-[#AE275F] rounded-lg p-8 mb-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-white mb-2">NLP Command Center</h1>
            <p className="text-white/90">Ask AML-related questions and get instant actionable insights.</p>
          </div>

          {/* Summary Cards Inside Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, index) => (
              <Card key={index} className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                      <p className="text-3xl text-gray-900">{card.value}</p>
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

        {/* NLP Input Bar */}
        <Card className="mb-6 border-[#AE275F]/20 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask anything… e.g., Show high-risk alerts today"
                  className="pr-12 h-12 text-base"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#AE275F]"
                >
                  <Mic className="w-5 h-5" />
                </Button>
              </div>
              <Button className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white h-12 px-6">
                <Search className="w-5 h-5 mr-2" />
                Run
              </Button>
            </div>

            {/* Quick Commands */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickCommands.map((command, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(command)}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#AE275F]/10 border border-gray-200 hover:border-[#AE275F] rounded-full text-sm text-gray-700 hover:text-[#AE275F] transition-colors"
                >
                  {command}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Right Sidebar Column - Now First */}
          <div className="lg:col-span-1 lg:order-2 space-y-6">
            {/* Related Insights */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-purple-600" />
                  Related Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-[#AE275F]" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendedActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 border-gray-200 hover:border-[#AE275F] hover:bg-[#AE275F]/5"
                    >
                      <div className={`w-8 h-8 ${action.color} rounded flex items-center justify-center mr-3 flex-shrink-0`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Left Column - Now Second - Takes 2 columns */}
          <div className="lg:col-span-2 lg:order-1 space-y-6">
            {/* Main Table Section */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Suspicious Transactions – Last 24 Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Txn ID</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Pattern</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="text-gray-900">{txn.id}</TableCell>
                          <TableCell className="text-gray-900">{txn.account}</TableCell>
                          <TableCell className="text-gray-900">{txn.amount}</TableCell>
                          <TableCell>
                            <Badge className={`${txn.riskColor} border-0`}>
                              {txn.risk}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{txn.pattern}</TableCell>
                          <TableCell className="text-gray-600">{txn.time}</TableCell>
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

            {/* Analysis Graph */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#AE275F]" />
                  High-Risk Alerts — Past 7 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="alerts" 
                        stroke="#AE275F" 
                        strokeWidth={2}
                        dot={{ fill: '#AE275F', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Width Sections Below Grid */}
        <div className="space-y-6 mb-6">
          {/* AI Summary Box - Full Width */}
          <Card className="border-blue-200 bg-blue-50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <ShieldAlert className="w-5 h-5" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-900 leading-relaxed">
                <strong>128 suspicious transactions</strong> detected. <strong>19 accounts</strong> involved. 
                <strong> 3 new behavioural anomalies</strong> found. Immediate review recommended.
              </p>
            </CardContent>
          </Card>

          {/* Recent Queries Section - Full Width */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Recent Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentQueries.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-gray-700">{item.query}</span>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}