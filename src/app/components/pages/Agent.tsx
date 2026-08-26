import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Server,
  ArrowLeft,
  ArrowRight,
  Cloud,
  Globe,
  Cpu,
  Gauge,
  Timer,
  Shield,
  Eye,
  Edit2,
  Zap,
  HardDrive,
  Network,
  TrendingUp,
  Download,
  Upload,
  Database,
  Settings,
  RefreshCw,
  FileText,
  XCircle
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog';

interface AgentProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function Agent({ onNavigate, onLogout }: AgentProps) {
  const [showDeploymentWizard, setShowDeploymentWizard] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [selectedAgentType, setSelectedAgentType] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string>('');
  const [deployedAgents, setDeployedAgents] = useState([
    { name: 'prod-aws-east-01', provider: 'AWS', region: 'us-east-1', status: 'Healthy', lastSeen: '2 min ago' },
    { name: 'prod-azure-west-01', provider: 'Azure', region: 'westus2', status: 'Healthy', lastSeen: '5 min ago' },
    { name: 'prod-gcp-central-01', provider: 'GCP', region: 'us-central1', status: 'Warning', lastSeen: '1 min ago' },
    { name: 'staging-aws-west-01', provider: 'AWS', region: 'us-west-2', status: 'Healthy', lastSeen: '3 min ago' },
    { name: 'dev-azure-east-01', provider: 'Azure', region: 'eastus', status: 'Offline', lastSeen: '45 min ago' },
  ]);
  const [newlyDeployedAgent, setNewlyDeployedAgent] = useState<any>(null);

  const totalSteps = 7;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      // Auto-generate agent name when entering step 7 (Review)
      if (currentStep === 6 && !agentName) {
        const provider = selectedProvider?.toLowerCase() || 'cloud';
        const region = selectedRegion?.split('-')[0] || 'default';
        const randomId = Math.random().toString(36).substr(2, 6);
        setAgentName(`${provider}-${region}-${randomId}`);
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Deploy agent - use the custom agent name
      const newAgent = {
        name: agentName,
        provider: selectedProvider,
        region: selectedRegion,
        status: 'Healthy',
        lastSeen: 'just now'
      };
      setDeployedAgents([newAgent, ...deployedAgents]);
      setNewlyDeployedAgent(newAgent);
      setShowDeploymentWizard(false);
      setShowSuccessModal(true);
      resetWizard();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedProvider(null);
    setSelectedRegion(null);
    setSelectedResources([]);
    setSelectedAgentType(null);
    setSelectedInterval(null);
    setAuthMethod(null);
    setAgentName('');
  };

  const handleCancelWizard = () => {
    setShowDeploymentWizard(false);
    resetWizard();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedProvider !== null;
      case 2: return selectedRegion !== null;
      case 3: return selectedResources.length > 0;
      case 4: return selectedAgentType !== null;
      case 5: return selectedInterval !== null;
      case 6: return authMethod !== null;
      case 7: return true;
      default: return false;
    }
  };

  const toggleResource = (resource: string) => {
    if (selectedResources.includes(resource)) {
      setSelectedResources(selectedResources.filter(r => r !== resource));
    } else {
      setSelectedResources([...selectedResources, resource]);
    }
  };

  return (
    <DashboardLayout currentPage="agent" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {!showDeploymentWizard ? (
          <>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Bot className="w-8 h-8" />
                    <h1 className="text-3xl">Agent Management</h1>
                  </div>
                  <p className="text-white/90 text-lg">Deploy and manage monitoring agents across your infrastructure</p>
                </div>
                <button
                  onClick={() => setShowDeploymentWizard(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-[#AE275F] rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Deploy New Agent</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Agents */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 border">
                    Active
                  </Badge>
                </div>
                <div className="text-3xl text-gray-900 mb-1">24</div>
                <div className="text-sm text-gray-600">Total Agents</div>
                <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
                  <Activity className="w-4 h-4" />
                  <span>+2 this week</span>
                </div>
              </div>

              {/* Healthy Agents */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 border">
                    Healthy
                  </Badge>
                </div>
                <div className="text-3xl text-gray-900 mb-1">22</div>
                <div className="text-sm text-gray-600">Healthy Agents</div>
                <div className="mt-3 flex items-center gap-1 text-sm text-gray-600">
                  <span>91.7% uptime</span>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 border">
                    Warning
                  </Badge>
                </div>
                <div className="text-3xl text-gray-900 mb-1">1</div>
                <div className="text-sm text-gray-600">Needs Attention</div>
                <div className="mt-3 flex items-center gap-1 text-sm text-yellow-600">
                  <Clock className="w-4 h-4" />
                  <span>High latency</span>
                </div>
              </div>

              {/* Offline */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-red-600" />
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-200 border">
                    Offline
                  </Badge>
                </div>
                <div className="text-3xl text-gray-900 mb-1">1</div>
                <div className="text-sm text-gray-600">Offline Agents</div>
                <div className="mt-3 flex items-center gap-1 text-sm text-red-600">
                  <span>Requires restart</span>
                </div>
              </div>
            </div>

            {/* Agent List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-[#AE275F]" />
                Deployed Agents
              </h3>
              <div className="space-y-3">
                {deployedAgents.map((agent, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#AE275F]/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        agent.status === 'Healthy' ? 'bg-green-100' :
                        agent.status === 'Warning' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        <Bot className={`w-5 h-5 ${
                          agent.status === 'Healthy' ? 'text-green-600' :
                          agent.status === 'Warning' ? 'text-yellow-600' :
                          'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{agent.name}</div>
                        <div className="text-xs text-gray-500">{agent.provider} • {agent.region}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={`${
                          agent.status === 'Healthy' ? 'bg-green-100 text-green-700 border-green-200' :
                          agent.status === 'Warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        } border`}>
                          {agent.status}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{agent.lastSeen}</div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setShowDetailsModal(true);
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Deployment Wizard Full Page
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancelWizard}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-2xl text-gray-900">Agent Deployment Wizard</h1>
                    <p className="text-sm text-gray-600 mt-1">Deploy monitoring agents with guided configuration</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 border">
                  Step {currentStep} of {totalSteps}
                </Badge>
              </div>
            </div>

            {/* Stepper */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between gap-2">
                {[
                  { num: 1, label: 'Cloud Provider', icon: Cloud },
                  { num: 2, label: 'Region', icon: Globe },
                  { num: 3, label: 'Resources', icon: Cpu },
                  { num: 4, label: 'Agent Type', icon: Gauge },
                  { num: 5, label: 'Interval', icon: Timer },
                  { num: 6, label: 'Authentication', icon: Shield },
                  { num: 7, label: 'Review', icon: Eye },
                ].map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <React.Fragment key={step.num}>
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all mb-2 ${
                            currentStep === step.num
                              ? 'bg-[#AE275F] border-[#AE275F] text-white shadow-md'
                              : currentStep > step.num
                              ? 'bg-green-100 border-green-500 text-green-700'
                              : 'bg-gray-100 border-gray-300 text-gray-400'
                          }`}
                        >
                          {currentStep > step.num ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <StepIcon className="w-6 h-6" />
                          )}
                        </div>
                        <div className={`text-xs text-center max-w-[100px] ${
                          currentStep === step.num ? 'text-[#AE275F]' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </div>
                      </div>
                      {index < 6 && (
                        <div className={`flex-1 h-0.5 -mt-8 ${
                          currentStep > step.num ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="min-h-[320px]">
                {/* Step 1: Cloud Provider */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Cloud className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg text-gray-900">Select Cloud Provider</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">Choose where to deploy your monitoring agent</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {['AWS', 'Azure', 'GCP'].map((provider) => (
                        <button
                          key={provider}
                          onClick={() => setSelectedProvider(provider)}
                          className={`p-6 border-2 rounded-lg transition-all text-center ${
                            selectedProvider === provider
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                            selectedProvider === provider ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Cloud className={`w-8 h-8 ${
                              selectedProvider === provider ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="text-lg text-gray-900">{provider}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {provider === 'AWS' ? 'Amazon Web Services' :
                             provider === 'Azure' ? 'Microsoft Azure' :
                             'Google Cloud Platform'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Region */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg text-gray-900">Select Region</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">Choose the region for agent deployment</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1',
                        'ap-southeast-1', 'ap-northeast-1'
                      ].map((region) => (
                        <button
                          key={region}
                          onClick={() => setSelectedRegion(region)}
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            selectedRegion === region
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm text-gray-900">{region}</div>
                          <div className="text-xs text-gray-500 mt-1">Available</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Resources */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg text-gray-900">Select Resources to Monitor</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">Choose which resources the agent should monitor</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Compute Instances', 'Databases', 'Load Balancers',
                        'Storage', 'Network', 'Containers'
                      ].map((resource) => (
                        <button
                          key={resource}
                          onClick={() => toggleResource(resource)}
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            selectedResources.includes(resource)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className={`w-5 h-5 ${
                              selectedResources.includes(resource) ? 'text-blue-600' : 'text-gray-300'
                            }`} />
                            <span className="text-sm text-gray-900">{resource}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Agent Type */}
                {currentStep === 4 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Gauge className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg text-gray-900">Select Agent Type</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">Choose the type of monitoring agent</p>
                    
                    <div className="space-y-3">
                      {[
                        { type: 'Standard', desc: 'Basic metrics collection with minimal overhead' },
                        { type: 'Advanced', desc: 'Detailed metrics with custom instrumentation' },
                        { type: 'APM', desc: 'Application Performance Monitoring with tracing' },
                      ].map((agent) => (
                        <button
                          key={agent.type}
                          onClick={() => setSelectedAgentType(agent.type)}
                          className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                            selectedAgentType === agent.type
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm text-gray-900">{agent.type}</div>
                          <div className="text-xs text-gray-500 mt-1">{agent.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Interval */}
                {currentStep === 5 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Timer className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg text-gray-900">Select Collection Interval</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">How often should the agent collect metrics?</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { interval: '15 seconds', desc: 'Real-time monitoring' },
                        { interval: '30 seconds', desc: 'High frequency' },
                        { interval: '1 minute', desc: 'Standard (Recommended)' },
                        { interval: '5 minutes', desc: 'Low overhead' },
                      ].map((option) => (
                        <button
                          key={option.interval}
                          onClick={() => setSelectedInterval(option.interval)}
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            selectedInterval === option.interval
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm text-gray-900">{option.interval}</div>
                          <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: Authentication */}
                {currentStep === 6 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg text-gray-900">Configure Authentication</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">Select authentication method for the agent</p>
                    
                    <div className="space-y-3">
                      {[
                        { method: 'IAM Role', desc: 'Recommended for AWS/Azure/GCP' },
                        { method: 'API Key', desc: 'Static credentials' },
                        { method: 'Service Account', desc: 'Dedicated service identity' },
                      ].map((auth) => (
                        <button
                          key={auth.method}
                          onClick={() => setAuthMethod(auth.method)}
                          className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                            authMethod === auth.method
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm text-gray-900">{auth.method}</div>
                          <div className="text-xs text-gray-500 mt-1">{auth.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 7: Review */}
                {currentStep === 7 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg text-gray-900">Review & Customize</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">Review and edit your agent configuration before deployment</p>
                    
                    <div className="space-y-3">
                      {/* Agent Name - Editable */}
                      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <div className="text-xs text-blue-600 mb-2 uppercase tracking-wide">Agent Name</div>
                        <input
                          type="text"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          placeholder="Enter agent name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent"
                        />
                        <div className="text-xs text-blue-600 mt-2">You can customize the agent name</div>
                      </div>

                      {/* Cloud Provider */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Cloud Provider</div>
                          <div className="text-sm text-gray-900">{selectedProvider}</div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-white transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>

                      {/* Region */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Region</div>
                          <div className="text-sm text-gray-900">{selectedRegion}</div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-white transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>

                      {/* Resources */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Resources</div>
                          <div className="text-sm text-gray-900">{selectedResources.join(', ')}</div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-white transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>

                      {/* Agent Type */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Agent Type</div>
                          <div className="text-sm text-gray-900">{selectedAgentType}</div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(4)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-white transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>

                      {/* Collection Interval */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Collection Interval</div>
                          <div className="text-sm text-gray-900">{selectedInterval}</div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(5)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-white transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>

                      {/* Authentication */}
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Authentication</div>
                          <div className="text-sm text-gray-900">{authMethod}</div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(6)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-white transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4 border-t mt-4">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={handleNextStep}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#AE275F] text-white rounded-lg hover:bg-[#8B1F4D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{currentStep === totalSteps ? 'Deploy Agent' : 'Next'}</span>
                {currentStep < totalSteps && <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCancelWizard}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </PageContainer>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center text-center py-4">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Title */}
            <DialogTitle className="text-2xl text-gray-900 mb-2">
              Agent Deployed Successfully!
            </DialogTitle>

            {/* Description */}
            <DialogDescription className="text-gray-600 mb-6">
              Your monitoring agent has been deployed and is now active.
            </DialogDescription>

            {/* Agent Details Card */}
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Agent Name:</span>
                  <span className="text-sm text-gray-900">{newlyDeployedAgent?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Provider:</span>
                  <span className="text-sm text-gray-900">{newlyDeployedAgent?.provider}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Region:</span>
                  <span className="text-sm text-gray-900">{newlyDeployedAgent?.region}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status:</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200 border">
                    {newlyDeployedAgent?.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-2 bg-[#AE275F] text-white rounded-lg hover:bg-[#8B1F4D] transition-colors"
              >
                View All Agents
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <div className="py-4">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                selectedAgent?.status === 'Healthy' ? 'bg-green-100' :
                selectedAgent?.status === 'Warning' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <Bot className={`w-8 h-8 ${
                  selectedAgent?.status === 'Healthy' ? 'text-green-600' :
                  selectedAgent?.status === 'Warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl text-gray-900">{selectedAgent?.name}</DialogTitle>
                <DialogDescription className="text-gray-600">
                  {selectedAgent?.provider} • {selectedAgent?.region}
                </DialogDescription>
              </div>
              <Badge className={`${
                selectedAgent?.status === 'Healthy' ? 'bg-green-100 text-green-700 border-green-200' :
                selectedAgent?.status === 'Warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                'bg-red-100 text-red-700 border-red-200'
              } border text-sm px-3 py-1`}>
                {selectedAgent?.status}
              </Badge>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4 py-6 border-b">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-500">CPU</span>
                </div>
                <div className="text-2xl text-gray-900">24%</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <HardDrive className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-gray-500">Memory</span>
                </div>
                <div className="text-2xl text-gray-900">1.2GB</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Network className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-500">Network</span>
                </div>
                <div className="text-2xl text-gray-900">45ms</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-gray-500">Uptime</span>
                </div>
                <div className="text-2xl text-gray-900">99.8%</div>
              </div>
            </div>

            {/* Configuration Section */}
            <div className="py-6 border-b">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-[#AE275F]" />
                <h3 className="text-lg text-gray-900">Configuration</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Agent Type</div>
                  <div className="text-sm text-gray-900">Standard</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Collection Interval</div>
                  <div className="text-sm text-gray-900">1 minute</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Authentication</div>
                  <div className="text-sm text-gray-900">IAM Role</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Version</div>
                  <div className="text-sm text-gray-900">v2.4.1</div>
                </div>
              </div>
            </div>

            {/* Resources Monitored */}
            <div className="py-6 border-b">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-[#AE275F]" />
                <h3 className="text-lg text-gray-900">Resources Monitored</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Compute Instances', 'Databases', 'Load Balancers', 'Storage'].map((resource, idx) => (
                  <Badge key={idx} className="bg-blue-100 text-blue-700 border-blue-200 border">
                    {resource}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="py-6 border-b">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-5 h-5 text-[#AE275F]" />
                <h3 className="text-lg text-gray-900">Performance Metrics (Last 24h)</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Data Collected</span>
                    </div>
                    <span className="text-gray-900">1,440 data points</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Data Transmitted</span>
                    </div>
                    <span className="text-gray-900">245 MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">API Calls</span>
                    </div>
                    <span className="text-gray-900">12,456 calls</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-[#AE275F]" />
                <h3 className="text-lg text-gray-900">Recent Activity</h3>
              </div>
              <div className="space-y-2">
                {[
                  { time: '2 min ago', message: 'Successfully collected metrics from 24 resources', status: 'success' },
                  { time: '15 min ago', message: 'Configuration updated', status: 'info' },
                  { time: '1 hour ago', message: 'Data transmission completed', status: 'success' },
                  { time: '3 hours ago', message: 'Restarted after configuration change', status: 'warning' },
                  { time: '6 hours ago', message: 'Connected to monitoring service', status: 'success' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      log.status === 'success' ? 'bg-green-600' :
                      log.status === 'warning' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{log.message}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowRestartModal(true)}
                className="px-6 py-2 border border-[#AE275F] text-[#AE275F] rounded-lg hover:bg-[#AE275F]/5 transition-colors"
              >
                Restart Agent
              </button>
              <button
                onClick={() => setShowLogsModal(true)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Logs
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-[#AE275F] text-white rounded-lg hover:bg-[#8B1F4D] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restart Agent Confirmation Modal */}
      <Dialog open={showRestartModal} onOpenChange={setShowRestartModal}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center text-center py-4">
            {/* Warning Icon */}
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-12 h-12 text-orange-600" />
            </div>

            {/* Title */}
            <DialogTitle className="text-2xl text-gray-900 mb-2">
              Restart Agent?
            </DialogTitle>

            {/* Description */}
            <DialogDescription className="text-gray-600 mb-6">
              This will temporarily stop the agent and restart it. Metrics collection will be interrupted for a few seconds.
            </DialogDescription>

            {/* Agent Info */}
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Agent:</span>
                  <span className="text-sm text-gray-900">{selectedAgent?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Current Status:</span>
                  <Badge className={`${
                    selectedAgent?.status === 'Healthy' ? 'bg-green-100 text-green-700 border-green-200' :
                    selectedAgent?.status === 'Warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    'bg-red-100 text-red-700 border-red-200'
                  } border`}>
                    {selectedAgent?.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowRestartModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRestartModal(false);
                  // In a real app, you would call an API here to restart the agent
                  // For now, just close the modal
                }}
                className="flex-1 px-4 py-2 bg-[#AE275F] text-white rounded-lg hover:bg-[#8B1F4D] transition-colors"
              >
                Restart Agent
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Logs Modal */}
      <Dialog open={showLogsModal} onOpenChange={setShowLogsModal}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <div className="py-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <DialogTitle className="text-2xl text-gray-900">Agent Logs</DialogTitle>
                <DialogDescription className="text-gray-600">
                  {selectedAgent?.name} • Last 100 entries
                </DialogDescription>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Logs Content */}
            <div className="py-4">
              <div className="bg-gray-900 rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono text-sm">
                {[
                  { time: '2026-01-06 14:35:22', level: 'INFO', message: 'Successfully collected metrics from 24 resources' },
                  { time: '2026-01-06 14:34:22', level: 'INFO', message: 'Heartbeat sent to monitoring service' },
                  { time: '2026-01-06 14:33:22', level: 'INFO', message: 'Collected 145 data points from compute instances' },
                  { time: '2026-01-06 14:32:22', level: 'WARN', message: 'High latency detected: 156ms (threshold: 150ms)' },
                  { time: '2026-01-06 14:31:22', level: 'INFO', message: 'Data transmission completed: 2.4 MB' },
                  { time: '2026-01-06 14:30:22', level: 'INFO', message: 'Successfully collected metrics from databases' },
                  { time: '2026-01-06 14:29:22', level: 'INFO', message: 'Configuration sync completed' },
                  { time: '2026-01-06 14:28:22', level: 'INFO', message: 'API call successful: ListResources' },
                  { time: '2026-01-06 14:27:22', level: 'INFO', message: 'Heartbeat sent to monitoring service' },
                  { time: '2026-01-06 14:26:22', level: 'INFO', message: 'Successfully collected metrics from load balancers' },
                  { time: '2026-01-06 14:25:22', level: 'ERROR', message: 'Failed to connect to resource: timeout after 30s' },
                  { time: '2026-01-06 14:24:22', level: 'INFO', message: 'Retry attempt 1/3 for failed connection' },
                  { time: '2026-01-06 14:23:22', level: 'INFO', message: 'Data transmission completed: 2.1 MB' },
                  { time: '2026-01-06 14:22:22', level: 'INFO', message: 'Successfully collected metrics from storage' },
                  { time: '2026-01-06 14:21:22', level: 'INFO', message: 'Heartbeat sent to monitoring service' },
                ].map((log, idx) => (
                  <div key={idx} className="py-1">
                    <span className="text-gray-400">[{log.time}]</span>{' '}
                    <span className={`${
                      log.level === 'ERROR' ? 'text-red-400' :
                      log.level === 'WARN' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>[{log.level}]</span>{' '}
                    <span className="text-gray-300">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Download Logs</span>
                </div>
              </button>
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </div>
              </button>
              <button
                onClick={() => setShowLogsModal(false)}
                className="ml-auto px-6 py-2 bg-[#AE275F] text-white rounded-lg hover:bg-[#8B1F4D] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}