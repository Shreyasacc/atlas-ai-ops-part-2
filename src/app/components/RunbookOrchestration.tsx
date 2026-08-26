import { useState } from 'react';
import { 
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  PlayCircle,
  FileText,
  UserPlus,
  History,
  Zap,
  TrendingUp,
  AlertCircle,
  Database,
  Users,
  Shield,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PageContainer } from './layouts/PageContainer';

interface RunbookOrchestrationProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function RunbookOrchestration({ onNavigate, onLogout }: RunbookOrchestrationProps) {
  const summaryCards = [
    { 
      title: 'Active Runbooks', 
      value: '24', 
      subtext: 'Ready for execution',
      icon: BookOpen, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Executions Today', 
      value: '147', 
      subtext: 'Auto-triggered & manual',
      icon: Play, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Pending Approvals', 
      value: '8', 
      subtext: 'Awaiting analyst review',
      icon: Clock, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      title: 'Success Rate', 
      value: '94%', 
      subtext: 'Last 30 days',
      icon: CheckCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    }
  ];

  const runbookExecutions = [
    {
      runbook: 'Suspicious Transaction Review',
      account: 'ACC-28412',
      result: 'Completed',
      time: '10:25 AM',
      triggeredBy: 'NLP Command',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      runbook: 'Freeze Account Procedure',
      account: 'ACC-39142',
      result: 'Completed',
      time: '09:50 AM',
      triggeredBy: 'Analyst',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      runbook: 'SAR Draft Preparation',
      account: 'ACC-10922',
      result: 'Completed',
      time: '09:12 AM',
      triggeredBy: 'System',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      runbook: 'Customer Re-Verification',
      account: 'ACC-49211',
      result: 'Pending',
      time: '08:45 AM',
      triggeredBy: 'Analyst',
      statusColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      runbook: 'Enhanced Due Diligence',
      account: 'ACC-61442',
      result: 'Completed',
      time: '08:20 AM',
      triggeredBy: 'NLP Command',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      runbook: 'Transaction Monitoring Alert',
      account: 'ACC-72183',
      result: 'Completed',
      time: '08:05 AM',
      triggeredBy: 'System',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      runbook: 'Suspicious Transaction Review',
      account: 'ACC-84720',
      result: 'Failed',
      time: '07:45 AM',
      triggeredBy: 'System',
      statusColor: 'bg-red-100 text-red-700'
    },
    {
      runbook: 'Account Risk Reassessment',
      account: 'ACC-91238',
      result: 'Completed',
      time: '07:30 AM',
      triggeredBy: 'Analyst',
      statusColor: 'bg-green-100 text-green-700'
    }
  ];

  const automationInsights = [
    {
      text: '62% of runbooks today were auto-triggered by NLP commands.',
      icon: Zap,
      color: 'text-purple-600'
    },
    {
      text: 'Freeze Account runbook trending: 3 triggers in past 2 hours.',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      text: 'Customer Re-Verification has 2 approvals pending.',
      icon: AlertCircle,
      color: 'text-yellow-600'
    },
    {
      text: '1 runbook failed due to missing customer profile data.',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  const auditLogs = [
    {
      time: '10:25 AM',
      message: 'Suspicious Transaction Review executed by NLP command',
      icon: Play,
      color: 'text-green-600'
    },
    {
      time: '09:50 AM',
      message: 'Account ACC-39142 frozen by automated workflow',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      time: '09:12 AM',
      message: 'SAR Draft generated automatically',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      time: '09:05 AM',
      message: 'Error: Missing merchant data in runbook step 2',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
    {
      time: '08:45 AM',
      message: 'Customer Re-Verification initiated by analyst',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      time: '08:20 AM',
      message: 'Enhanced Due Diligence completed successfully',
      icon: Shield,
      color: 'text-green-600'
    }
  ];

  return (
    <DashboardLayout onLogout={onLogout} onNavigate={onNavigate} currentPage="runbook-orchestration">
      <PageContainer>
        {/* Hero Section with Magenta Background */}
        <div className="bg-[#AE275F] rounded-lg p-8 mb-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-white mb-2">Runbook Orchestration</h1>
            <p className="text-white/90">Automated AML workflows with full audit trail and compliance tracking.</p>
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
            {/* Automation Insights */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#AE275F]" />
                  Automation Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <insight.icon className={`w-4 h-4 ${insight.color}`} />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{insight.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-[#AE275F]" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#AE275F] hover:bg-[#8d1f4c] text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Run New Runbook
                </Button>
                <Button variant="outline" className="w-full border-[#AE275F] text-[#AE275F] hover:bg-[#AE275F]/10">
                  <FileText className="w-4 h-4 mr-2" />
                  View All Runbooks
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  <History className="w-4 h-4 mr-2" />
                  Execution History
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-green-200 bg-green-50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Activity className="w-5 h-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-900">Orchestration Engine</span>
                  <Badge className="bg-green-600 text-white border-0">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-900">Workflow Queue</span>
                  <Badge className="bg-green-600 text-white border-0">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-900">API Connectivity</span>
                  <Badge className="bg-green-600 text-white border-0">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-900">Last Sync</span>
                  <span className="text-sm text-green-800">2 mins ago</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Left Column - Takes 2 columns */}
          <div className="lg:col-span-2 lg:order-1 space-y-6">
            {/* Featured Runbook */}
            <Card className="border-[#AE275F] border-2 shadow-sm">
              <CardHeader className="bg-[#AE275F]/5">
                <CardTitle className="flex items-center gap-2 text-[#AE275F]">
                  <BookOpen className="w-5 h-5" />
                  Featured Runbook: Suspicious Transaction Review
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">Investigate suspicious transactions with automated checks.</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Steps Overview */}
                <div>
                  <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#AE275F]">A.</span> Steps Overview
                  </h3>
                  <div className="space-y-3">
                    {[
                      { num: '1️⃣', title: 'Data Collection', desc: 'Pull customer profile, transaction history, linked accounts.' },
                      { num: '2️⃣', title: 'Pattern Matching', desc: 'Check velocity spikes, geo mismatch, unusual merchant categories.' },
                      { num: '3️⃣', title: 'Decision Rules', desc: 'Apply AML thresholds & scoring logic.' },
                      { num: '4️⃣', title: 'Documentation', desc: 'Generate findings summary & attach logs.' },
                      { num: '5️⃣', title: 'Escalation / Closure', desc: 'Send alert to compliance OR close if false positive.' }
                    ].map((step, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg">{step.num}</span>
                        <div>
                          <p className="text-gray-900 mb-1">{step.title}</p>
                          <p className="text-sm text-gray-600">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Inputs */}
                <div>
                  <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#AE275F]">B.</span> Required Inputs
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-[#AE275F] rounded-full"></div>
                      <span className="text-gray-900">Transaction ID</span>
                      <span className="text-gray-500">(auto-filled if initiated from alert)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-900">Analyst Notes</span>
                      <span className="text-gray-500">(optional)</span>
                    </div>
                  </div>
                </div>

                {/* Expected Output */}
                <div>
                  <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#AE275F]">C.</span> Expected Output
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Case summary', 'Risk score', 'Recommended action: Freeze / Review / Close', 'Audit trail entry'].map((output, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{output}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div>
                  <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#AE275F]">D.</span> Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-[#AE275F] hover:bg-[#8d1f4c] text-white">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Run Runbook Now
                    </Button>
                    <Button variant="outline" className="border-[#AE275F] text-[#AE275F] hover:bg-[#AE275F]/10">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Steps
                    </Button>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign to Analyst
                    </Button>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <History className="w-4 h-4 mr-2" />
                      View Audit Log
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Runbook Executions */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#AE275F]" />
                  Recent Runbook Executions (Today)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="w-full min-w-full">
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="text-left pl-6">Runbook</TableHead>
                        <TableHead className="text-left">Account / Entity</TableHead>
                        <TableHead className="text-left">Result</TableHead>
                        <TableHead className="text-left">Time</TableHead>
                        <TableHead className="text-left pr-6">Triggered By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {runbookExecutions.map((execution, index) => (
                        <TableRow key={index} className="border-b last:border-0">
                          <TableCell className="pl-6">{execution.runbook}</TableCell>
                          <TableCell>{execution.account}</TableCell>
                          <TableCell>
                            <Badge className={`${execution.statusColor} border-0`}>
                              {execution.result}
                            </Badge>
                          </TableCell>
                          <TableCell>{execution.time}</TableCell>
                          <TableCell className="pr-6">{execution.triggeredBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Audit & Compliance - Full Width */}
        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#AE275F]" />
              Audit & Compliance Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <log.icon className={`w-5 h-5 ${log.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-700">{log.message}</p>
                      <span className="text-xs text-gray-500 ml-4">{log.time}</span>
                    </div>
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