import { useState } from 'react';
import { 
  Brain,
  TrendingUp,
  Target,
  Database,
  CheckCircle,
  XCircle,
  RefreshCw,
  Edit,
  Lightbulb,
  Network,
  Activity,
  AlertCircle,
  FileText,
  Users,
  Shield,
  Zap,
  BarChart3,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PageContainer } from './layouts/PageContainer';

interface AdaptiveKnowledgeLearningProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdaptiveKnowledgeLearning({ onNavigate, onLogout }: AdaptiveKnowledgeLearningProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(null);

  const learningKPIs = [
    { 
      title: 'Cases Learned This Week', 
      value: '142', 
      subtext: 'New insights added',
      icon: Brain, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Active Behaviour Models', 
      value: '7', 
      subtext: 'Continuously updating',
      icon: Network, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      title: 'Recommendation Accuracy', 
      value: '89%', 
      subtext: 'Based on analyst feedback',
      icon: Target, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Knowledge Items', 
      value: '1,284', 
      subtext: 'Rules, patterns & entity data',
      icon: Database, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    }
  ];

  const recentCasesLearned = [
    {
      caseId: 'C-39281',
      account: 'ACC-28412',
      patternLearned: 'Velocity Spike',
      confidence: '92%',
      time: '10:10 AM',
      confidenceColor: 'text-green-600'
    },
    {
      caseId: 'C-39282',
      account: 'ACC-49102',
      patternLearned: 'Merchant Risk',
      confidence: '88%',
      time: '09:42 AM',
      confidenceColor: 'text-green-600'
    },
    {
      caseId: 'C-39283',
      account: 'ACC-39211',
      patternLearned: 'Login Geo Mismatch',
      confidence: '73%',
      time: '08:59 AM',
      confidenceColor: 'text-yellow-600'
    },
    {
      caseId: 'C-39284',
      account: 'ACC-14321',
      patternLearned: 'Amount Spike',
      confidence: '81%',
      time: '08:41 AM',
      confidenceColor: 'text-green-600'
    },
    {
      caseId: 'C-39285',
      account: 'ACC-92847',
      patternLearned: 'Cross-Border Pattern',
      confidence: '95%',
      time: '08:22 AM',
      confidenceColor: 'text-green-600'
    },
    {
      caseId: 'C-39286',
      account: 'ACC-61293',
      patternLearned: 'Frequency Anomaly',
      confidence: '78%',
      time: '08:05 AM',
      confidenceColor: 'text-yellow-600'
    }
  ];

  const smartRecommendations = [
    {
      id: 1,
      text: 'Pattern #14 resembles last month\'s fraud ring. Recommend deeper investigation.',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 2,
      text: 'Account ACC-39212 frequently matches geo-risk pattern cluster #7.',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 3,
      text: 'Velocity anomaly detected across 3 linked accounts. Recommend runbook trigger.',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 4,
      text: 'This transaction matches 82% similarity with a past SAR case.',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  const learningInsights = [
    {
      text: 'Behaviour model #3 improved velocity detection by +12%.',
      icon: TrendingUp,
      color: 'text-green-600',
      trend: '+12%'
    },
    {
      text: 'New anomaly cluster identified: 41 linked transactions.',
      icon: Network,
      color: 'text-purple-600',
      trend: 'New'
    },
    {
      text: 'Geo mismatch false positives reduced by 8% this week.',
      icon: Target,
      color: 'text-green-600',
      trend: '-8%'
    },
    {
      text: 'High correlation found between Merchant Category 4823 and high-risk alerts.',
      icon: AlertCircle,
      color: 'text-orange-600',
      trend: 'Alert'
    }
  ];

  const handleFeedback = (recommendationId: number, feedback: 'correct' | 'incorrect' | 'retrain') => {
    setSelectedRecommendation(recommendationId);
    // In real app, this would send feedback to backend
    setTimeout(() => setSelectedRecommendation(null), 2000);
  };

  return (
    <DashboardLayout onLogout={onLogout} onNavigate={onNavigate} currentPage="adaptive-learning">
      <PageContainer>
        {/* Hero Section with Magenta Background */}
        <div className="bg-[#AE275F] rounded-lg p-8 mb-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-white mb-2">Adaptive Knowledge Learning</h1>
            <p className="text-white/90">A self-learning engine that improves AML detection accuracy by analyzing past cases, user actions, and evolving patterns.</p>
          </div>

          {/* Learning KPIs Inside Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningKPIs.map((kpi, index) => (
              <Card key={index} className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                      <p className="text-3xl text-gray-900 mb-1">{kpi.value}</p>
                      <p className="text-xs text-gray-500">{kpi.subtext}</p>
                    </div>
                    <div className={`w-12 h-12 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                      <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
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
            {/* Learning Insights */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#AE275F]" />
                  Learning Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <insight.icon className={`w-4 h-4 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-relaxed">{insight.text}</p>
                        <Badge className={`mt-2 ${
                          insight.trend.includes('+') ? 'bg-green-100 text-green-700' :
                          insight.trend.includes('-') ? 'bg-red-100 text-red-700' :
                          insight.trend === 'New' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        } border-0 text-xs`}>
                          {insight.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Learning Status */}
            <Card className="border-green-200 bg-green-50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Activity className="w-5 h-5" />
                  System Learning Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-900">Model Update</span>
                  <span className="text-sm text-green-800">22 mins ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-900">Next Retrain Cycle</span>
                  <span className="text-sm text-green-800">In 6 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-900">Data Streams</span>
                  <Badge className="bg-green-600 text-white border-0">Real-time</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-900">Learning Engine Health</span>
                  <Badge className="bg-green-600 text-white border-0">Excellent</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#AE275F]" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#AE275F] hover:bg-[#8d1f4c] text-white">
                  <Brain className="w-4 h-4 mr-2" />
                  View All Models
                </Button>
                <Button variant="outline" className="w-full border-[#AE275F] text-[#AE275F] hover:bg-[#AE275F]/10">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Training History
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Manual Retrain
                </Button>
              </CardContent>
            </Card>

            {/* Recent Cases Learned Table */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#AE275F]" />
                  Recent Cases Learned
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="w-full min-w-full">
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="text-left pl-6">Case ID</TableHead>
                        <TableHead className="text-left">Account</TableHead>
                        <TableHead className="text-left">Pattern Learned</TableHead>
                        <TableHead className="text-left">Confidence</TableHead>
                        <TableHead className="text-left pr-6">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCasesLearned.map((caseItem, index) => (
                        <TableRow key={index} className="border-b last:border-0">
                          <TableCell className="pl-6">{caseItem.caseId}</TableCell>
                          <TableCell>{caseItem.account}</TableCell>
                          <TableCell>
                            <Badge className="bg-purple-100 text-purple-700 border-0">
                              {caseItem.patternLearned}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={caseItem.confidenceColor}>{caseItem.confidence}</span>
                          </TableCell>
                          <TableCell className="pr-6">{caseItem.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Left Column - Takes 2 columns */}
          <div className="lg:col-span-2 lg:order-1 space-y-6">
            {/* Knowledge Graph Panel */}
            <Card className="border-[#AE275F] border-2 shadow-sm">
              <CardHeader className="bg-[#AE275F]/5">
                <CardTitle className="flex items-center gap-2 text-[#AE275F]">
                  <Network className="w-5 h-5" />
                  Knowledge Graph - Visual Intelligence
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">Node-based visualization showing risk relationships, suspicious patterns, and linked entities.</p>
              </CardHeader>
              <CardContent className="pt-6">
                {/* SVG Knowledge Graph Visualization */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-8 min-h-[500px] relative overflow-hidden">
                  {/* Animated background grid */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  <svg className="w-full h-[500px] relative z-10" viewBox="0 0 900 500">
                    <defs>
                      {/* Glow filters for nodes */}
                      <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-magenta" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      {/* Gradient definitions */}
                      <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity="1" />
                        <stop offset="100%" stopColor="#991b1b" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="grad-magenta" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#AE275F" stopOpacity="1" />
                        <stop offset="100%" stopColor="#7d1b44" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ea580c" stopOpacity="1" />
                        <stop offset="100%" stopColor="#c2410c" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#16a34a" stopOpacity="1" />
                        <stop offset="100%" stopColor="#15803d" stopOpacity="1" />
                      </linearGradient>
                    </defs>

                    {/* Connection lines with gradient strokes */}
                    <g className="connections" opacity="0.6">
                      <line x1="450" y1="250" x2="250" y2="150" stroke="#AE275F" strokeWidth="3" strokeDasharray="5,5">
                        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                      </line>
                      <line x1="450" y1="250" x2="650" y2="120" stroke="#dc2626" strokeWidth="3" strokeDasharray="5,5">
                        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                      </line>
                      <line x1="450" y1="250" x2="250" y2="350" stroke="#ea580c" strokeWidth="2.5" strokeDasharray="5,5">
                        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1.2s" repeatCount="indefinite"/>
                      </line>
                      <line x1="450" y1="250" x2="650" y2="350" stroke="#16a34a" strokeWidth="2" strokeDasharray="5,5">
                        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1.5s" repeatCount="indefinite"/>
                      </line>
                      <line x1="250" y1="150" x2="150" y2="80" stroke="#AE275F" strokeWidth="2" opacity="0.5"/>
                      <line x1="650" y1="120" x2="750" y2="70" stroke="#dc2626" strokeWidth="2" opacity="0.5"/>
                      <line x1="250" y1="350" x2="200" y2="420" stroke="#ea580c" strokeWidth="2" opacity="0.5"/>
                      <line x1="650" y1="350" x2="700" y2="420" stroke="#16a34a" strokeWidth="2" opacity="0.5"/>
                    </g>

                    {/* Smaller peripheral nodes */}
                    <g className="peripheral-nodes">
                      {/* TX-001 */}
                      <circle cx="150" cy="80" r="24" fill="url(#grad-magenta)" filter="url(#glow-magenta)" opacity="0.9">
                        <animate attributeName="r" values="24;26;24" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="150" cy="80" r="18" fill="#AE275F" opacity="0.3"/>
                      <text x="150" y="84" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">TX-001</text>
                      
                      {/* SAR Case */}
                      <circle cx="750" cy="70" r="26" fill="url(#grad-red)" filter="url(#glow-red)" opacity="0.95">
                        <animate attributeName="r" values="26;28;26" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="750" cy="70" r="20" fill="#dc2626" opacity="0.3"/>
                      <text x="750" y="68" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">SAR</text>
                      <text x="750" y="78" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">Case</text>
                      
                      {/* Geo Risk */}
                      <circle cx="200" cy="420" r="22" fill="url(#grad-orange)" filter="url(#glow-orange)" opacity="0.9">
                        <animate attributeName="r" values="22;24;22" dur="2.5s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="200" cy="420" r="16" fill="#ea580c" opacity="0.3"/>
                      <text x="200" y="418" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">Geo</text>
                      <text x="200" y="428" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">Risk</text>
                      
                      {/* Clean Entity */}
                      <circle cx="700" cy="420" r="22" fill="url(#grad-green)" filter="url(#glow-green)" opacity="0.85">
                        <animate attributeName="r" values="22;24;22" dur="3s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="700" cy="420" r="16" fill="#16a34a" opacity="0.3"/>
                      <text x="700" y="424" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">Clean</text>
                    </g>

                    {/* Secondary nodes */}
                    <g className="secondary-nodes">
                      {/* Linked Account */}
                      <circle cx="250" cy="150" r="38" fill="url(#grad-magenta)" filter="url(#glow-magenta)" opacity="0.95">
                        <animate attributeName="opacity" values="0.95;1;0.95" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="250" cy="150" r="30" fill="#AE275F" opacity="0.2"/>
                      <text x="250" y="148" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">Linked</text>
                      <text x="250" y="162" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">ACC-49102</text>
                      
                      {/* Fraud Ring - High Risk */}
                      <circle cx="650" cy="120" r="42" fill="url(#grad-red)" filter="url(#glow-red)" opacity="1">
                        <animate attributeName="opacity" values="1;0.9;1" dur="1.5s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="650" cy="120" r="34" fill="#dc2626" opacity="0.2"/>
                      <circle cx="650" cy="120" r="26" fill="#dc2626" opacity="0.2"/>
                      <text x="650" y="116" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">Fraud Ring</text>
                      <text x="650" y="130" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Pattern #14</text>
                      
                      {/* Velocity Spike */}
                      <circle cx="250" cy="350" r="38" fill="url(#grad-orange)" filter="url(#glow-orange)" opacity="0.95">
                        <animate attributeName="opacity" values="0.95;1;0.95" dur="2.5s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="250" cy="350" r="30" fill="#ea580c" opacity="0.2"/>
                      <text x="250" y="348" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">Velocity</text>
                      <text x="250" y="362" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Spike</text>
                      
                      {/* Normal Entity */}
                      <circle cx="650" cy="350" r="34" fill="url(#grad-green)" filter="url(#glow-green)" opacity="0.9">
                        <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="650" cy="350" r="26" fill="#16a34a" opacity="0.2"/>
                      <text x="650" y="348" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">Normal</text>
                      <text x="650" y="362" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Entity</text>
                    </g>

                    {/* Central node - Primary Account with pulse effect */}
                    <g className="central-node">
                      <circle cx="450" cy="250" r="60" fill="#AE275F" opacity="0.1">
                        <animate attributeName="r" values="60;75;60" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.1;0;0.1" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="450" cy="250" r="50" fill="url(#grad-magenta)" filter="url(#glow-magenta)">
                        <animate attributeName="r" values="50;52;50" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="450" cy="250" r="42" fill="#AE275F" opacity="0.3"/>
                      <circle cx="450" cy="250" r="34" fill="#AE275F" opacity="0.2"/>
                      <text x="450" y="244" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">Primary</text>
                      <text x="450" y="260" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">ACC-28412</text>
                      
                      {/* Risk badge */}
                      <rect x="480" y="220" width="50" height="18" rx="9" fill="#dc2626"/>
                      <text x="505" y="232" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">HIGH</text>
                    </g>
                  </svg>

                  {/* Modern Legend */}
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-2xl border border-gray-200">
                    <p className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <Network className="w-4 h-4 text-[#AE275F]" />
                      <span>Risk Severity Levels</span>
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-lg"></div>
                        <span className="text-sm text-gray-700">Critical / High Risk</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 shadow-lg"></div>
                        <span className="text-sm text-gray-700">Medium Risk</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#AE275F] to-[#7d1b44] shadow-lg"></div>
                        <span className="text-sm text-gray-700">Linked / Connected</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-600 to-green-800 shadow-lg"></div>
                        <span className="text-sm text-gray-700">Low Risk / Clean</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats overlay */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-gray-600">Active Nodes</span>
                        <span className="text-sm text-gray-900">12</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-gray-600">Connections</span>
                        <span className="text-sm text-gray-900">8</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-gray-600">Risk Level</span>
                        <Badge className="bg-red-600 text-white border-0 text-xs">High</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How the Engine Learns */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#AE275F]" />
                  How the Engine Learns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* A. Learns From Past Cases */}
                <div>
                  <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#AE275F]">A.</span> Learns From Past Cases
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: CheckCircle, text: 'Closed alerts', color: 'text-green-600' },
                      { icon: Users, text: 'Analyst decisions (freeze/close/escalate)', color: 'text-blue-600' },
                      { icon: FileText, text: 'Case summaries', color: 'text-purple-600' },
                      { icon: Shield, text: 'SAR drafts', color: 'text-orange-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                        <span className="text-sm text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* B. Learns From System Data */}
                <div>
                  <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#AE275F]">B.</span> Learns From System Data
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: TrendingUp, text: 'Anomaly patterns', color: 'text-red-600' },
                      { icon: Network, text: 'Transaction sequences', color: 'text-purple-600' },
                      { icon: BarChart3, text: 'Behaviour clusters', color: 'text-blue-600' },
                      { icon: AlertCircle, text: 'Geo deviations', color: 'text-orange-600' },
                      { icon: Database, text: 'Merchant category risks', color: 'text-pink-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                        <span className="text-sm text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* C. Learns From User Feedback */}
                <div>
                  <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#AE275F]">C.</span> Learns From User Feedback
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { icon: CheckCircle, text: 'Correct / Incorrect', color: 'text-green-600' },
                      { icon: Target, text: 'Model suggestions accepted/rejected', color: 'text-blue-600' },
                      { icon: Edit, text: 'Notes added by analysts', color: 'text-purple-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                        <span className="text-sm text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Recommendations Panel */}
            
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}