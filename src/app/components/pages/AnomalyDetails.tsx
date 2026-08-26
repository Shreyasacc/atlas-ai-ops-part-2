import React, { useState } from 'react';
import { 
  ArrowLeft,
  Activity,
  Clock,
  Cloud,
  Server,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Brain,
  X,
  Settings,
  GitBranch,
  Zap,
  Database,
  PlayCircle,
  Calendar,
  Target,
  FileText
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog';

interface AnomalyDetailsProps {
  anomalyId: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function AnomalyDetails({ anomalyId, onNavigate, onLogout }: AnomalyDetailsProps) {
  const [showRCAModal, setShowRCAModal] = useState(false);
  
  // Mock data - in real app, fetch based on anomalyId
  const anomaly = {
    id: 'ANO-7842',
    serviceName: 'payment-api-prod',
    metricAffected: 'Response Time',
    severity: 'critical',
    confidence: 96,
    status: 'active',
    provider: 'AWS',
    region: 'us-east-1',
    appName: 'payment-api',
    usersImpacted: 12500,
    currentValue: '2,847ms',
    baselineValue: '450ms',
    deviation: '+533%',
    duration: '14 min',
    detectedTime: '2 min ago',
    firstSeen: '2025-12-30 14:23:45'
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <DashboardLayout currentPage="anomaly-detection" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate?.('anomaly-detection')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#AE275F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Feed</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg text-cyan-600">{anomaly.id}</span>
                <Badge className={`${getSeverityColor(anomaly.severity)} border uppercase`}>
                  {anomaly.severity}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${anomaly.status === 'active' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600 uppercase">{anomaly.status}</span>
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 border">
                  {anomaly.confidence}% confidence
                </Badge>
              </div>

              <h1 className="text-2xl text-gray-900 mb-2">{anomaly.serviceName}</h1>
              <p className="text-gray-600 mb-4">
                {anomaly.metricAffected} spike detected - {anomaly.deviation} above baseline
              </p>

              {/* Metadata Row */}
              <div className="flex items-center flex-wrap gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>{anomaly.metricAffected}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{anomaly.detectedTime} • Duration: {anomaly.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cloud className="w-4 h-4" />
                  <span>{anomaly.provider} / {anomaly.region}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  <span>{anomaly.appName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{anomaly.usersImpacted.toLocaleString()} users impacted</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="text-right ml-8">
              <div className="text-base text-gray-900 mb-2">
                {anomaly.currentValue} <span className="text-gray-400">/ {anomaly.baselineValue} baseline</span>
              </div>
              <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded inline-block">
                {anomaly.deviation} deviation
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => setShowRCAModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#AE275F] text-white rounded-lg hover:bg-[#8B1F4D] transition-all"
            >
              <Brain className="w-4 h-4" />
              Run RCA
            </button>
            <button
              onClick={() => onNavigate?.('alerting')}
              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
            >
              <Bell className="w-4 h-4" />
              Create Alert
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
              <CheckCircle2 className="w-4 h-4" />
              Mark as Resolved
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
              <X className="w-4 h-4" />
              Suppress
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Metric Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg text-gray-900 mb-4">Response Time Trend</h2>
              
              {/* Chart Placeholder */}
              <div className="h-80 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-200 p-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end px-4 pb-4">
                  <div className="w-full h-full relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                      <span>3000ms</span>
                      <span>2500ms</span>
                      <span>2000ms</span>
                      <span>1500ms</span>
                      <span>1000ms</span>
                      <span>500ms</span>
                      <span>0ms</span>
                    </div>

                    {/* Grid lines */}
                    <div className="absolute left-12 right-0 top-0 bottom-0">
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="absolute left-0 right-0 border-b border-gray-200" style={{ bottom: `${i * 16.67}%` }}></div>
                      ))}
                    </div>

                    {/* Baseline line */}
                    <div className="absolute left-12 right-0 border-b-2 border-dashed border-green-500" style={{ bottom: '25%' }}>
                      <span className="absolute right-0 -top-5 text-xs text-green-600 bg-white px-1">Baseline (450ms)</span>
                    </div>

                    {/* Normal range band */}
                    <div className="absolute left-12 right-0 bg-green-100 bg-opacity-30" style={{ bottom: '20%', height: '10%' }}></div>

                    {/* Simulated line chart */}
                    <svg className="absolute left-12 right-0 top-0 bottom-0 w-full h-full">
                      <polyline
                        points="0,75 50,73 100,72 150,74 200,71 250,73 300,150 350,180 400,170 450,75 500,74"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      {/* Anomaly spike marker */}
                      <circle cx="300" cy="150" r="4" fill="#ef4444" />
                      <circle cx="350" cy="180" r="4" fill="#ef4444" />
                      <circle cx="400" cy="170" r="4" fill="#ef4444" />
                    </svg>

                    {/* Anomaly marker */}
                    <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2">
                      <div className="flex flex-col items-center">
                        <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs mb-1">
                          Anomaly Detected
                        </Badge>
                        <div className="w-0.5 h-32 bg-red-400"></div>
                      </div>
                    </div>

                    {/* Deployment marker */}
                    <div className="absolute left-1/3 bottom-0">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-full bg-purple-400"></div>
                        <div className="flex items-center gap-1 mt-1">
                          <PlayCircle className="w-3 h-3 text-purple-600" />
                          <span className="text-xs text-purple-600">Deploy</span>
                        </div>
                      </div>
                    </div>

                    {/* X-axis time labels */}
                    <div className="absolute left-12 right-0 -bottom-6 flex justify-between text-xs text-gray-500">
                      <span>12:00</span>
                      <span>13:00</span>
                      <span>14:00</span>
                      <span>15:00</span>
                      <span>16:00</span>
                      <span>17:00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span className="text-gray-600">Actual Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 border-b-2 border-dashed border-green-500"></div>
                  <span className="text-gray-600">Baseline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300"></div>
                  <span className="text-gray-600">Expected Range</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Anomaly</span>
                </div>
              </div>
            </div>

            {/* Impact Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg text-gray-900 mb-4">Impact Analysis</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-gray-600">Users Affected</span>
                  </div>
                  <div className="text-2xl text-gray-900">12,500</div>
                  <div className="text-xs text-red-600 mt-1">High impact</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-gray-600">Failed Requests</span>
                  </div>
                  <div className="text-2xl text-gray-900">2,340</div>
                  <div className="text-xs text-orange-600 mt-1">+180% from baseline</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-600">Error Rate</span>
                  </div>
                  <div className="text-2xl text-gray-900">8.5%</div>
                  <div className="text-xs text-yellow-600 mt-1">Baseline: 0.5%</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Avg Latency</span>
                  </div>
                  <div className="text-2xl text-gray-900">2,847ms</div>
                  <div className="text-xs text-purple-600 mt-1">Baseline: 450ms</div>
                </div>
              </div>
            </div>

            {/* RCA Hypotheses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-gray-900">AI-Generated RCA Hypotheses</h2>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 border">
                  ML Powered
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0">1</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm text-gray-900">Database Connection Pool Exhaustion</h3>
                        <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs">High Confidence: 94%</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Database connection pool reached maximum capacity causing queuing and increased latency.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>• Correlation: Recent deployment increased DB calls</span>
                        <span>• Pattern: Similar to incident INC-2341</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0">2</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm text-gray-900">Downstream Service Degradation</h3>
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 border text-xs">Medium Confidence: 78%</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Payment gateway service showing increased response times coinciding with this anomaly.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>• Correlation: Payment-gateway-svc latency +340%</span>
                        <span>• Timeline: Started 2 minutes before</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">3</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm text-gray-900">Memory Leak from Recent Deployment</h3>
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 border text-xs">Low Confidence: 62%</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Memory usage trending upward since v2.3.1 deployment, potentially causing GC pressure.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>• Correlation: Memory +15% since deploy</span>
                        <span>• Pattern: Gradual degradation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowRCAModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#AE275F] text-white rounded-lg hover:bg-[#8B1F4D] transition-all"
                >
                  <Brain className="w-4 h-4" />
                  Run Full Root Cause Analysis
                </button>
              </div>
            </div>

            {/* Similar Incidents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-[#AE275F]" />
                <h2 className="text-lg text-gray-900">Similar Incidents</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border-2 border-red-300 hover:border-red-400 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-900">ANO-7821</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">Response Time Spike</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 border border-red-300 rounded text-red-700">Critical</span>
                    <span>98% match</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border-2 border-orange-300 hover:border-orange-400 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-900">ANO-7805</span>
                    <span className="text-xs text-gray-500">5 days ago</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">Database Pool Exhaustion</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 border border-orange-300 rounded text-orange-700">High</span>
                    <span>87% match</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border-2 border-yellow-300 hover:border-yellow-400 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-900">ANO-7789</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">API Latency Degradation</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 border border-yellow-300 rounded text-yellow-700">Medium</span>
                    <span>75% match</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border-2 border-blue-300 hover:border-blue-400 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-900">ANO-7756</span>
                    <span className="text-xs text-gray-500">2 weeks ago</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">Memory Leak Pattern</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 border border-blue-300 rounded text-blue-700">Medium</span>
                    <span>68% match</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 pt-3 border-t text-sm text-[#AE275F] hover:text-[#8B1F4D] transition-colors">
                View All Similar Incidents →
              </button>
            </div>
          </div>

          {/* Right Column - Timeline & Context */}
          <div className="space-y-6">
            {/* Recent Deployments List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-5 h-5 text-[#AE275F]" />
                <h2 className="text-lg text-gray-900">Recent Deployments</h2>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">payment-api v2.3.1</span>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 border text-xs">
                      Production
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">12:30 UTC • 2h ago</div>
                  <div className="text-xs text-purple-600 mt-1">⚠ Suspected correlation</div>
                </div>

                <div className="p-3 bg-white rounded-lg border-l-4 border-gray-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">api-gateway v1.8.2</span>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200 border text-xs">
                      Production
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">11:15 UTC • 3h ago</div>
                </div>

                <div className="p-3 bg-white rounded-lg border-l-4 border-gray-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">auth-service v3.1.0</span>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200 border text-xs">
                      Staging
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">10:45 UTC • 4h ago</div>
                </div>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg text-gray-900">Event Timeline</h2>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-4">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">14:25 UTC • Now</div>
                    <div className="text-sm text-gray-900">Anomaly Detected</div>
                    <div className="text-xs text-gray-600">Response time spike identified</div>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">14:20 UTC • 5m ago</div>
                    <div className="text-sm text-gray-900">Traffic Spike</div>
                    <div className="text-xs text-gray-600">+250% increase in API calls</div>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Database className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">13:45 UTC • 40m ago</div>
                    <div className="text-sm text-gray-900">Config Change</div>
                    <div className="text-xs text-gray-600">DB pool size: 50 → 100</div>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <PlayCircle className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">12:30 UTC • 2h ago</div>
                    <div className="text-sm text-gray-900">Deployment</div>
                    <div className="text-xs text-gray-600">payment-api v2.3.1</div>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">12:00 UTC • 2h ago</div>
                    <div className="text-sm text-gray-900">System Normal</div>
                    <div className="text-xs text-gray-600">All metrics within range</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-600" />
                <h2 className="text-lg text-gray-900">Related Metrics</h2>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">CPU Utilization</span>
                    <span className="text-sm text-red-600">+45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">85% (baseline: 40%)</div>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">Memory Usage</span>
                    <span className="text-sm text-orange-600">+15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">75% (baseline: 60%)</div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">Network I/O</span>
                    <span className="text-sm text-green-600">Normal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">45% (baseline: 42%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RCA Modal */}
        <Dialog open={showRCAModal} onOpenChange={setShowRCAModal}>
          <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#AE275F]" />
                Root Cause Analysis - {anomaly.id}
              </DialogTitle>
              <DialogDescription>
                AI-powered analysis identifying the root cause of this anomaly
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Anomaly Summary */}
              <div className="bg-gradient-to-r from-[#AE275F]/5 to-purple-50 border border-[#AE275F]/20 rounded-lg p-5">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Service</label>
                    <p className="text-sm font-medium text-gray-900">{anomaly.serviceName}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Metric Affected</label>
                    <p className="text-sm font-medium text-gray-900">{anomaly.metricAffected}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Severity</label>
                    <Badge className={`${getSeverityColor(anomaly.severity)} border`}>
                      {anomaly.severity}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Detected</label>
                    <p className="text-sm text-gray-700">{anomaly.firstSeen}</p>
                  </div>
                </div>
              </div>

              {/* AI Analysis Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">AI Analysis Complete</h3>
                    <p className="text-xs text-blue-700">
                      Analyzed 47 correlated events, 12 service dependencies, and 23 configuration changes
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1.5 flex-1 bg-blue-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <span className="text-xs text-blue-600 font-medium">100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Root Cause Identified */}
              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Target className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-red-900 mb-2">Root Cause Identified</h3>
                    <p className="text-sm text-red-800 leading-relaxed">
                      Database connection pool exhaustion caused by unexpected traffic spike following deployment of payment-api v2.3.1. 
                      The new authentication flow increased DB queries per request by 3x without corresponding pool size adjustment.
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-300 border">
                    Confidence: 96%
                  </Badge>
                </div>

                {/* Contributing Factors */}
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Contributing Factors</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                      <p className="text-sm text-gray-700">Deployment of payment-api v2.3.1 at 12:30 UTC</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                      <p className="text-sm text-gray-700">250% increase in API traffic at 14:20 UTC</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                      <p className="text-sm text-gray-700">Connection pool size remained at default 50 connections</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                      <p className="text-sm text-gray-700">No auto-scaling configuration for database pool</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Timeline */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  Event Timeline
                </h3>
                <div className="space-y-3">
                  {[
                    { time: '12:30 UTC', event: 'payment-api v2.3.1 deployed', type: 'deployment', icon: Activity },
                    { time: '13:15 UTC', event: 'Connection pool utilization increased to 75%', type: 'warning', icon: AlertTriangle },
                    { time: '14:20 UTC', event: 'Traffic spike detected (+250% API calls)', type: 'critical', icon: TrendingUp },
                    { time: '14:23 UTC', event: 'Anomaly detected: Response time spike', type: 'anomaly', icon: Zap },
                    { time: '14:25 UTC', event: 'Connection pool exhausted (100% utilization)', type: 'critical', icon: Server },
                    { time: '14:30 UTC', event: 'RCA analysis initiated', type: 'info', icon: Brain }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    const colorMap = {
                      deployment: 'bg-purple-50 border-purple-200 text-purple-700',
                      warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                      critical: 'bg-red-50 border-red-200 text-red-700',
                      anomaly: 'bg-orange-50 border-orange-200 text-orange-700',
                      info: 'bg-blue-50 border-blue-200 text-blue-700'
                    };
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`p-2 rounded-lg border ${colorMap[item.type as keyof typeof colorMap]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {idx < 5 && <div className="w-0.5 h-8 bg-gray-200"></div>}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-gray-500 font-medium">{item.time}</span>
                          </div>
                          <p className="text-sm text-gray-900">{item.event}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Affected Services */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Server className="w-4 h-4 text-gray-600" />
                  Affected Services
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'payment-api-prod', impact: 'Critical', status: 'critical' },
                    { name: 'api-gateway-prod', impact: 'High', status: 'degraded' },
                    { name: 'postgres-db-01', impact: 'Critical', status: 'critical' },
                    { name: 'user-service', impact: 'Medium', status: 'healthy' },
                    { name: 'notification-service', impact: 'Low', status: 'healthy' },
                    { name: 'auth-service', impact: 'Medium', status: 'warning' }
                  ].map((service, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{service.name}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          service.status === 'critical' ? 'bg-red-500' :
                          service.status === 'degraded' ? 'bg-orange-500' :
                          service.status === 'warning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                      </div>
                      <p className="text-xs text-gray-600">Impact: <span className="font-medium">{service.impact}</span></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h3 className="text-base font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Recommended Actions
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      priority: 'Immediate',
                      action: 'Increase database connection pool size from 50 to 150',
                      impact: 'Will restore service performance within 2 minutes',
                      color: 'red'
                    },
                    {
                      priority: 'Short-term',
                      action: 'Roll back payment-api to v2.3.0 or optimize query patterns',
                      impact: 'Reduces queries per request by 66%',
                      color: 'orange'
                    },
                    {
                      priority: 'Long-term',
                      action: 'Implement auto-scaling for connection pool based on traffic',
                      impact: 'Prevents future occurrences of similar issues',
                      color: 'blue'
                    },
                    {
                      priority: 'Long-term',
                      action: 'Add performance testing to deployment pipeline',
                      impact: 'Catches performance regressions before production',
                      color: 'blue'
                    }
                  ].map((rec, idx) => {
                    const priorityColors = {
                      red: 'bg-red-100 text-red-700 border-red-200',
                      orange: 'bg-orange-100 text-orange-700 border-orange-200',
                      blue: 'bg-blue-100 text-blue-700 border-blue-200'
                    };
                    return (
                      <div key={idx} className="bg-white border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Badge className={`${priorityColors[rec.color as keyof typeof priorityColors]} border mt-0.5`}>
                            {rec.priority}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">{rec.action}</p>
                            <p className="text-xs text-gray-600">{rec.impact}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    alert(`Initiating immediate remediation for ${anomaly.id}:\n\n✓ Increasing connection pool to 150\n✓ Notifying DevOps team\n✓ Creating incident ticket\n✓ Updating runbooks`);
                    setShowRCAModal(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#AE275F] text-white rounded-lg text-sm hover:bg-[#8B1F4D] transition-all font-medium"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Apply Immediate Fix
                </button>
                <button
                  onClick={() => {
                    alert(`Creating detailed incident report for ${anomaly.id}:\n\n✓ RCA findings documented\n✓ Timeline captured\n✓ Action items assigned\n✓ Stakeholders notified`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all font-medium"
                >
                  <FileText className="w-4 h-4" />
                  Generate Incident Report
                </button>
                <button
                  onClick={() => setShowRCAModal(false)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </DashboardLayout>
  );
}