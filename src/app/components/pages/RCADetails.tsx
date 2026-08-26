import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  TrendingDown,
  FileText,
  GitBranch,
  Settings,
  Filter,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Brain,
  Activity,
  Server,
  Code,
  AlertTriangle,
  ChevronRight,
  Zap,
  Target,
  Eye,
  BarChart3,
  List,
  Radio,
  Edit3
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog';

interface RCADetailsProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  hypothesisId?: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'metric' | 'log' | 'trace' | 'deployment' | 'config';
  title: string;
  description: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  service: string;
  evidenceStrength: number;
  details?: any;
}

interface Evidence {
  id: string;
  type: 'metric' | 'log' | 'trace' | 'change';
  title: string;
  description: string;
  timestamp: string;
  strength: number;
  data?: any;
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'evt-001',
    timestamp: '2025-12-30 14:23:45',
    type: 'deployment',
    title: 'API Gateway v2.4.1 Deployed',
    description: 'New version deployed with connection pool changes',
    severity: 'high',
    service: 'api-gateway-prod',
    evidenceStrength: 95
  },
  {
    id: 'evt-002',
    timestamp: '2025-12-30 14:24:12',
    type: 'metric',
    title: 'Response Time Spike Detected',
    description: 'P95 latency increased from 120ms to 850ms',
    severity: 'critical',
    service: 'api-gateway-prod',
    evidenceStrength: 98
  },
  {
    id: 'evt-003',
    timestamp: '2025-12-30 14:24:45',
    type: 'log',
    title: 'Connection Pool Exhaustion Errors',
    description: 'ERROR: Unable to acquire connection from pool',
    severity: 'critical',
    service: 'api-gateway-prod',
    evidenceStrength: 92
  },
  {
    id: 'evt-004',
    timestamp: '2025-12-30 14:25:10',
    type: 'trace',
    title: 'Trace Shows Database Wait Time',
    description: 'Database query execution time increased 4x',
    severity: 'high',
    service: 'postgres-db-01',
    evidenceStrength: 88
  },
  {
    id: 'evt-005',
    timestamp: '2025-12-30 14:20:00',
    type: 'config',
    title: 'Connection Pool Size Modified',
    description: 'max_connections reduced from 500 to 100',
    severity: 'medium',
    service: 'api-gateway-prod',
    evidenceStrength: 85
  }
];

const mockEvidence: Evidence[] = [
  {
    id: 'evidence-001',
    type: 'metric',
    title: 'API Response Time Degradation',
    description: 'Sharp increase in P95 latency immediately after deployment',
    timestamp: '2025-12-30 14:24:12',
    strength: 98,
    data: {
      baseline: '120ms',
      current: '850ms',
      change: '+608%'
    }
  },
  {
    id: 'evidence-002',
    type: 'log',
    title: 'Connection Pool Exhaustion Logs',
    description: 'Repeated errors indicating connection pool saturation',
    timestamp: '2025-12-30 14:24:45',
    strength: 92,
    data: {
      errorCount: 1247,
      errorRate: '15.3/sec',
      pattern: 'Unable to acquire connection from pool'
    }
  },
  {
    id: 'evidence-003',
    type: 'trace',
    title: 'Database Query Wait Times',
    description: 'Distributed traces show increased wait time for database connections',
    timestamp: '2025-12-30 14:25:10',
    strength: 88,
    data: {
      avgWaitTime: '340ms',
      maxWaitTime: '1.2s',
      affectedServices: 3
    }
  },
  {
    id: 'evidence-004',
    type: 'change',
    title: 'Deployment Configuration Change',
    description: 'Connection pool max_connections parameter modified in deployment',
    timestamp: '2025-12-30 14:20:00',
    strength: 95,
    data: {
      parameter: 'max_connections',
      oldValue: '500',
      newValue: '100',
      changeType: 'Configuration'
    }
  }
];

export function RCADetails({ onNavigate, onLogout, hypothesisId = 'RCA-001' }: RCADetailsProps) {
  const [selectedSignalType, setSelectedSignalType] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedStrength, setSelectedStrength] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showEvidenceGallery, setShowEvidenceGallery] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  // Editable RCA fields
  const [editedTitle, setEditedTitle] = useState('');
  const [editedRootCause, setEditedRootCause] = useState('');
  const [editedImpact, setEditedImpact] = useState('');
  const [editedRemediation, setEditedRemediation] = useState('');

  // Hypothesis data (normally would come from props or API)
  const hypothesis = {
    id: hypothesisId,
    title: 'API Gateway Response Time Degradation',
    rootCause: 'Connection pool size misconfiguration in v2.4.1 deployment',
    confidence: 94,
    impact: 'critical',
    status: 'investigating',
    affectedService: 'api-gateway-prod',
    detectedAt: '2025-12-30 14:23:45',
    estimatedImpact: '1,250 users affected, 25% increase in 5xx errors'
  };

  // Initialize editor fields
  const openEditor = () => {
    setEditedTitle(hypothesis.title);
    setEditedRootCause(hypothesis.rootCause);
    setEditedImpact(hypothesis.estimatedImpact);
    setEditedRemediation('Increase max_connections parameter from 100 to 500 in API Gateway configuration and redeploy.');
    setShowEditorModal(true);
  };

  const handleSaveEdits = () => {
    // In a real app, this would update the hypothesis via API
    alert(`RCA Updated!\n\nTitle: ${editedTitle}\nRoot Cause: ${editedRootCause}\n\nChanges saved successfully.`);
    setShowEditorModal(false);
  };

  // Filter timeline events
  const filteredEvents = mockTimelineEvents.filter(event => {
    const matchesType = selectedSignalType === 'all' || event.type === selectedSignalType;
    const matchesService = selectedService === 'all' || event.service === selectedService;
    const matchesStrength = selectedStrength === 'all' || 
      (selectedStrength === 'high' && event.evidenceStrength >= 90) ||
      (selectedStrength === 'medium' && event.evidenceStrength >= 70 && event.evidenceStrength < 90) ||
      (selectedStrength === 'low' && event.evidenceStrength < 70);
    
    return matchesType && matchesService && matchesStrength;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'metric': return <BarChart3 className="w-4 h-4" />;
      case 'log': return <FileText className="w-4 h-4" />;
      case 'trace': return <Radio className="w-4 h-4" />;
      case 'deployment': return <GitBranch className="w-4 h-4" />;
      case 'config': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'metric': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'log': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'trace': return 'bg-green-100 text-green-700 border-green-200';
      case 'deployment': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'config': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'metric': return <TrendingUp className="w-5 h-5" />;
      case 'log': return <List className="w-5 h-5" />;
      case 'trace': return <Radio className="w-5 h-5" />;
      case 'change': return <GitBranch className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const handleConfirmRootCause = () => {
    setShowConfirmModal(false);
    alert(`Root Cause Confirmed!\n\nHypothesis: ${hypothesis.title}\nConfidence: ${hypothesis.confidence}%\n\nRedirecting to Intelligent Alerting...`);
    if (onNavigate) {
      onNavigate('alerting');
    }
  };

  return (
    <DashboardLayout currentPage="rca" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate && onNavigate('rca')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#AE275F] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to RCA Engine</span>
          </button>

          <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl">Timeline & Correlation View</h1>
                  <Badge className="bg-white/20 text-white border-white/30 border">
                    {hypothesis.id}
                  </Badge>
                </div>
                <p className="text-white/90 text-lg mb-4">{hypothesis.title}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-white/70 text-xs mb-1">Confidence Score</div>
                    <div className="text-2xl">{hypothesis.confidence}%</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-white/70 text-xs mb-1">Status</div>
                    <div className="text-2xl capitalize">{hypothesis.status}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-white/70 text-xs mb-1">Evidence Items</div>
                    <div className="text-2xl">{mockEvidence.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Root Cause Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-gray-900 mb-2">AI-Identified Root Cause</h3>
              <p className="text-gray-700 mb-3">{hypothesis.rootCause}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Affected Service:</span>
                  <span className="ml-2 text-gray-900">{hypothesis.affectedService}</span>
                </div>
                <div>
                  <span className="text-gray-500">Detected At:</span>
                  <span className="ml-2 text-gray-900">{hypothesis.detectedAt}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500">Estimated Impact:</span>
                  <span className="ml-2 text-gray-900">{hypothesis.estimatedImpact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredEvents.length} timeline events • Show cause-effect sequence visually
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEvidenceGallery(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#AE275F] text-white rounded-lg text-sm hover:bg-[#8B1F4D] transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>View Evidence Gallery</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(selectedSignalType !== 'all' || selectedService !== 'all' || selectedStrength !== 'all') && (
                <span className="ml-1 px-2 py-0.5 bg-[#AE275F] text-white rounded-full text-xs">
                  {[selectedSignalType !== 'all', selectedService !== 'all', selectedStrength !== 'all'].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Side Sheet */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="right" className="w-96 sm:max-w-md">
            <SheetTitle>Filter Timeline</SheetTitle>
            <SheetDescription>
              Refine timeline view by applying filters
            </SheetDescription>
            
            <div className="py-[24px] px-[20px]">
              <div className="space-y-6">
                {/* Signal Type Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Signal Type</label>
                  <select
                    value={selectedSignalType}
                    onChange={(e) => setSelectedSignalType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="all">All Types</option>
                    <option value="metric">Metrics</option>
                    <option value="log">Logs</option>
                    <option value="trace">Traces</option>
                    <option value="deployment">Deployments</option>
                    <option value="config">Config Changes</option>
                  </select>
                </div>

                {/* Service Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="all">All Services</option>
                    <option value="api-gateway-prod">api-gateway-prod</option>
                    <option value="postgres-db-01">postgres-db-01</option>
                    <option value="auth-service">auth-service</option>
                  </select>
                </div>

                {/* Evidence Strength Filter */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Evidence Strength</label>
                  <select
                    value={selectedStrength}
                    onChange={(e) => setSelectedStrength(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  >
                    <option value="all">All Strengths</option>
                    <option value="high">High (90%+)</option>
                    <option value="medium">Medium (70-89%)</option>
                    <option value="low">Low (&lt;70%)</option>
                  </select>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setSelectedSignalType('all');
                      setSelectedService('all');
                      setSelectedStrength('all');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 px-4 py-2 bg-[#AE275F] text-white rounded-lg text-sm hover:bg-[#8B1F4D] transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Timeline Layers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#AE275F]" />
            Timeline Layers
          </h3>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Events */}
            <div className="space-y-6">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="relative pl-16 pb-6 last:pb-0">
                  {/* Timeline dot */}
                  <div className={`absolute left-6 top-1 w-5 h-5 rounded-full border-4 border-white ${
                    event.severity === 'critical' ? 'bg-red-500' :
                    event.severity === 'high' ? 'bg-orange-500' :
                    event.severity === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>

                  {/* Event card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getEventColor(event.type)} border`}>
                          <div className="flex items-center gap-1">
                            {getEventIcon(event.type)}
                            <span className="capitalize">{event.type}</span>
                          </div>
                        </Badge>
                        <span className="text-xs text-gray-500">{event.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{event.evidenceStrength}% strength</span>
                      </div>
                    </div>
                    <h4 className="text-sm text-gray-900 mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Server className="w-3 h-3" />
                        <span>{event.service}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evidence Gallery Dialog */}
        <Dialog open={showEvidenceGallery} onOpenChange={setShowEvidenceGallery}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Eye className="w-6 h-6 text-[#AE275F]" />
                Evidence Gallery
              </DialogTitle>
              <DialogDescription>
                Comprehensive proof supporting the AI's root cause analysis
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4 mt-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-600 mb-1">Total Evidence</div>
                    <div className="text-2xl text-blue-900">{mockEvidence.length}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-xs text-green-600 mb-1">High Confidence</div>
                    <div className="text-2xl text-green-900">{mockEvidence.filter(e => e.strength >= 90).length}</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="text-xs text-purple-600 mb-1">Avg Strength</div>
                    <div className="text-2xl text-purple-900">
                      {Math.round(mockEvidence.reduce((sum, e) => sum + e.strength, 0) / mockEvidence.length)}%
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-xs text-orange-600 mb-1">Data Sources</div>
                    <div className="text-2xl text-orange-900">{new Set(mockEvidence.map(e => e.type)).size}</div>
                  </div>
                </div>

                {/* Evidence Items */}
                <div className="space-y-3">
                  {mockEvidence.map((evidence) => (
                    <div
                      key={evidence.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-[#AE275F]/30 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          evidence.type === 'metric' ? 'bg-blue-100 text-blue-600' :
                          evidence.type === 'log' ? 'bg-purple-100 text-purple-600' :
                          evidence.type === 'trace' ? 'bg-green-100 text-green-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {getEvidenceIcon(evidence.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={`${getEventColor(evidence.type)} border text-xs`}>
                                <span className="capitalize">{evidence.type}</span>
                              </Badge>
                              <span className="text-xs text-gray-500">{evidence.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="text-right">
                                <div className="text-xs text-gray-500">Confidence</div>
                                <div className={`text-sm ${evidence.strength >= 90 ? 'text-green-600' : evidence.strength >= 70 ? 'text-yellow-600' : 'text-gray-600'}`}>
                                  {evidence.strength}%
                                </div>
                              </div>
                              <div className="w-2 h-12 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`w-full transition-all ${
                                    evidence.strength >= 90 ? 'bg-green-500' : 
                                    evidence.strength >= 70 ? 'bg-yellow-500' : 
                                    'bg-gray-400'
                                  }`}
                                  style={{ height: `${evidence.strength}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <h4 className="text-base text-gray-900 mb-1">{evidence.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{evidence.description}</p>
                          
                          {evidence.data && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                {Object.entries(evidence.data).map(([key, value]) => (
                                  <div key={key} className="flex items-center justify-between">
                                    <span className="text-gray-500 capitalize text-xs">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                                    </span>
                                    <span className="text-gray-900 font-medium text-sm">{value as string}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Learning Loop Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900 mb-1">AI Learning Loop</h4>
                      <p className="text-xs text-gray-600">
                        Your feedback on this hypothesis helps improve AI accuracy for future incidents. 
                        Confirming or rejecting teaches the system to recognize similar patterns more effectively.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex gap-3 pt-4 border-t mt-4">
              <button
                onClick={() => {
                  setShowEvidenceGallery(false);
                  setShowConfirmModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Root Cause</span>
              </button>
              <button
                onClick={() => {
                  setShowEvidenceGallery(false);
                  setShowRejectModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject Hypothesis</span>
              </button>
              <button
                onClick={() => setShowEvidenceGallery(false)}
                className="px-5 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirm Root Cause Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Confirm Root Cause
              </DialogTitle>
              <DialogDescription>
                Mark this hypothesis as the confirmed root cause
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm text-gray-900 mb-2">{hypothesis.title}</h4>
                <p className="text-xs text-gray-600 mb-3">{hypothesis.rootCause}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200 border">
                    {hypothesis.confidence}% Confidence
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 border">
                    {mockEvidence.length} Evidence Items
                  </Badge>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Next Steps:</strong> Confirming this root cause will:
                </p>
                <ul className="text-xs text-green-700 mt-2 space-y-1 ml-4 list-disc">
                  <li>Update related alerts with confirmed RCA</li>
                  <li>Feed the learning loop for improved future detection</li>
                  <li>Generate remediation recommendations</li>
                  <li>Redirect you to Intelligent Alerting for action</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleConfirmRootCause}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm & Continue
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reject Hypothesis Modal */}
        <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Reject Hypothesis
              </DialogTitle>
              <DialogDescription>
                Provide feedback to improve AI accuracy
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-900">{hypothesis.title}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Reason for Rejection:</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this hypothesis is incorrect (helps improve AI accuracy)..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50 resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Learning Loop:</strong> Your feedback helps the AI learn and improve future root cause analysis accuracy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    if (!rejectReason.trim()) {
                      alert('Please provide a reason for rejection to help improve the AI.');
                      return;
                    }
                    alert(`Hypothesis Rejected!\n\nFeedback: ${rejectReason}\n\nThank you for improving our AI accuracy.`);
                    setShowRejectModal(false);
                    setRejectReason('');
                    if (onNavigate) {
                      onNavigate('rca');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Rejection
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit RCA Modal */}
        <Dialog open={showEditorModal} onOpenChange={setShowEditorModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                Edit Root Cause Analysis
              </DialogTitle>
              <DialogDescription>
                Modify the details of this root cause analysis
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm text-gray-900 mb-2">Current Hypothesis</h4>
                <p className="text-xs text-gray-600 mb-3">{hypothesis.title}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200 border">
                    {hypothesis.confidence}% Confidence
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 border">
                    {mockEvidence.length} Evidence Items
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Title:</label>
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Enter a new title for the RCA..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Root Cause:</label>
                  <textarea
                    value={editedRootCause}
                    onChange={(e) => setEditedRootCause(e.target.value)}
                    placeholder="Enter a new root cause description..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Impact:</label>
                  <textarea
                    value={editedImpact}
                    onChange={(e) => setEditedImpact(e.target.value)}
                    placeholder="Enter a new impact description..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Remediation:</label>
                  <textarea
                    value={editedRemediation}
                    onChange={(e) => setEditedRemediation(e.target.value)}
                    placeholder="Enter remediation steps..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveEdits}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditorModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowEvidenceGallery(true)}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#AE275F] hover:bg-[#AE275F]/5 transition-all text-left"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-900">View All Evidence</div>
                <div className="text-xs text-gray-500">{mockEvidence.length} items available</div>
              </div>
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-900">Confirm Root Cause</div>
                <div className="text-xs text-gray-500">Mark as verified</div>
              </div>
            </button>

            <button
              onClick={() => setShowRejectModal(true)}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-900">Reject Hypothesis</div>
                <div className="text-xs text-gray-500">Provide feedback</div>
              </div>
            </button>

            <button
              onClick={openEditor}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-900">Edit RCA</div>
                <div className="text-xs text-gray-500">Modify details</div>
              </div>
            </button>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}