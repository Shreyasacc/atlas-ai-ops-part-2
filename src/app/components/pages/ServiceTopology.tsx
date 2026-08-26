import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  Server,
  AlertTriangle,
  AlertCircle,
  Activity,
  ChevronRight,
  CheckCircle,
  XCircle,
  Database,
  Globe,
  Zap,
  Network
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';

interface ServiceTopologyProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

// Mock data for KPI cards
const kpiData = {
  healthyServices: { count: 45, percentage: 82, trend: 'up' },
  warningServices: { count: 8, percentage: 15, trend: 'down' },
  degradedServices: { count: 2, percentage: 3, trend: 'stable' },
  activeConnections: { count: 1247, percentage: 95, trend: 'up' }
};

// Mock data for dependency map
const dependencyNodes = [
  // Gateway Layer
  { id: 'api-gateway', name: 'API Gateway', status: 'healthy', health: 88, alerts: 1, type: 'gateway', layer: 0 },
  
  // Services Layer (Data Layer in visual)
  { id: 'user-db', name: 'User DB', status: 'healthy', health: 89, alerts: 1, type: 'database', layer: 1 },
  { id: 'payment-db', name: 'Payment DB', status: 'warning', health: 76, alerts: 2, type: 'database', layer: 1 },
  { id: 'order-db', name: 'Order DB', status: 'healthy', health: 91, alerts: 0, type: 'database', layer: 1 },
  { id: 'redis-cache', name: 'Redis Cache', status: 'warning', health: 79, alerts: 1, type: 'cache', layer: 1 },
  { id: 'message-queue', name: 'Message Queue', status: 'healthy', health: 94, alerts: 0, type: 'cache', layer: 1 },
  
  // Services Layer
  { id: 'payment-api', name: 'Payment API', status: 'warning', health: 72, alerts: 3, type: 'service', layer: 2 },
  { id: 'order-service', name: 'Order Service', status: 'warning', health: 68, alerts: 4, type: 'service', layer: 2 },
  { id: 'user-service', name: 'User Service', status: 'healthy', health: 85, alerts: 1, type: 'service', layer: 2 },
  
  // Support Layer
  { id: 'auth-service', name: 'Auth Service', status: 'healthy', health: 94, alerts: 0, type: 'service', layer: 3 },
  { id: 'notification-service', name: 'Notification Service', status: 'healthy', health: 91, alerts: 0, type: 'service', layer: 3 },
  { id: 'inventory', name: 'Inventory', status: 'healthy', health: 82, alerts: 1, type: 'service', layer: 3 },
  { id: 'analytics', name: 'Analytics', status: 'healthy', health: 96, alerts: 0, type: 'service', layer: 3 }
];

// Connection lines with type (solid or dashed for problematic)
const connections = [
  // Gateway to Data Layer
  { from: 'api-gateway', to: 'user-db', type: 'normal' },
  { from: 'api-gateway', to: 'payment-db', type: 'degraded' },
  { from: 'api-gateway', to: 'order-db', type: 'degraded' },
  { from: 'api-gateway', to: 'redis-cache', type: 'normal' },
  { from: 'api-gateway', to: 'message-queue', type: 'normal' },
  
  // Data Layer to Services
  { from: 'user-db', to: 'payment-api', type: 'degraded' },
  { from: 'payment-db', to: 'order-service', type: 'degraded' },
  { from: 'order-db', to: 'order-service', type: 'degraded' },
  { from: 'redis-cache', to: 'user-service', type: 'normal' },
  { from: 'message-queue', to: 'user-service', type: 'normal' },
  
  // Services to Support
  { from: 'payment-api', to: 'auth-service', type: 'degraded' },
  { from: 'order-service', to: 'notification-service', type: 'degraded' },
  { from: 'user-service', to: 'inventory', type: 'normal' },
  { from: 'user-service', to: 'analytics', type: 'normal' }
];

// Mock data for affected services
const affectedServices = [
  { name: 'Payment API', status: 'degraded', impact: 'critical', dependencies: 3, downstreamImpact: 12, responseTime: '450ms', errorRate: '2.3%' },
  { name: 'API Gateway', status: 'warning', impact: 'high', dependencies: 5, downstreamImpact: 8, responseTime: '320ms', errorRate: '1.1%' },
  { name: 'Order Service', status: 'healthy', impact: 'low', dependencies: 2, downstreamImpact: 0, responseTime: '120ms', errorRate: '0.1%' },
  { name: 'Cache Redis', status: 'healthy', impact: 'none', dependencies: 0, downstreamImpact: 0, responseTime: '15ms', errorRate: '0.0%' }
];

export function ServiceTopology({ onNavigate, onLogout }: ServiceTopologyProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [linePositions, setLinePositions] = useState<Array<{ x1: number; y1: number; x2: number; y2: number; type: string }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'degraded': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'degraded': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'low': return 'text-yellow-600';
      case 'none': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'database': return <Database className="w-5 h-5" />;
      case 'cache': return <Zap className="w-5 h-5" />;
      case 'gateway': return <Globe className="w-5 h-5" />;
      default: return <Server className="w-5 h-5" />;
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'border-green-500';
      case 'warning': return 'border-yellow-500';
      case 'degraded': return 'border-red-500';
      default: return 'border-gray-300';
    }
  };

  const getAlertBgColor = (alerts: number) => {
    if (alerts === 0) return 'bg-green-500';
    if (alerts <= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const layers = ['GATEWAY', 'DATA LAYER', 'SERVICES', 'SUPPORT'];

  useEffect(() => {
    const calculateLinePositions = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      // Calculate positions for connection lines
      const newLinePositions: Array<{ x1: number; y1: number; x2: number; y2: number; type: string }> = [];
      
      connections.forEach(conn => {
        const fromNode = document.getElementById(`node-${conn.from}`);
        const toNode = document.getElementById(`node-${conn.to}`);
        if (!fromNode || !toNode) return;

        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();

        // Calculate relative positions to the container
        const fromX = fromRect.left - containerRect.left + fromRect.width / 2;
        const fromY = fromRect.bottom - containerRect.top; // Bottom of the from node
        const toX = toRect.left - containerRect.left + toRect.width / 2;
        const toY = toRect.top - containerRect.top; // Top of the to node

        newLinePositions.push({ x1: fromX, y1: fromY, x2: toX, y2: toY, type: conn.type });
      });

      setLinePositions(newLinePositions);
    };

    // Calculate on mount and when layout changes
    calculateLinePositions();
    
    // Recalculate after a short delay to ensure cards are rendered
    const timeout = setTimeout(calculateLinePositions, 100);
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateLinePositions);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculateLinePositions);
    };
  }, [selectedNode]);

  return (
    <DashboardLayout currentPage="service-topology" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => onNavigate?.('service-anomaly-dashboard')}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl">Service Topology</h1>
          </div>
          <p className="text-white/80 text-sm ml-11">Visualize service dependencies and health status across your infrastructure</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Healthy Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl text-gray-900">{kpiData.healthyServices.count}</div>
                <div className="text-xs text-gray-500 mt-1">{kpiData.healthyServices.percentage}%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Healthy Services</span>
              <span className="text-xs text-green-600">↑ 3</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl text-gray-900">{kpiData.warningServices.count}</div>
                <div className="text-xs text-gray-500 mt-1">{kpiData.warningServices.percentage}%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Warning</span>
              <span className="text-xs text-red-600">↓ 2</span>
            </div>
          </div>

          {/* Degraded */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl text-gray-900">{kpiData.degradedServices.count}</div>
                <div className="text-xs text-gray-500 mt-1">{kpiData.degradedServices.percentage}%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Degraded</span>
              <span className="text-xs text-gray-600">→ 0</span>
            </div>
          </div>

          {/* Active Connections */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Activity className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl text-gray-900">{kpiData.activeConnections.count}</div>
                <div className="text-xs text-gray-500 mt-1">{kpiData.activeConnections.percentage}%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Connections</span>
              <span className="text-xs text-green-600">↑ 142</span>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dependency Map - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-[#AE275F]" />
                  <h2 className="text-lg text-gray-900">Dependency Map</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Healthy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-gray-600">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600">Degraded</span>
                  </div>
                </div>
              </div>

              {/* SVG Dependency Graph */}
              <div ref={containerRef} className="relative bg-gray-50 rounded-lg p-8 overflow-visible" style={{ minHeight: '650px' }}>
                {/* SVG for Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                  {linePositions.map((line, index) => (
                    <line
                      key={index}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={line.type === 'degraded' ? '#EF4444' : '#10B981'}
                      strokeWidth="2"
                      strokeDasharray={line.type === 'degraded' ? '6,4' : 'none'}
                      opacity="0.5"
                    />
                  ))}
                </svg>
                
                {/* Layer Rows */}
                <div className="relative space-y-16 z-10">
                  {layers.map((layerName, layerIndex) => {
                    const layerNodes = dependencyNodes.filter(node => node.layer === layerIndex);
                    if (layerNodes.length === 0) return null;
                    
                    return (
                      <div key={layerIndex} className="relative">
                        {/* Layer Label */}
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -translate-x-full">
                          <div className="text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                            {layerName}
                          </div>
                        </div>
                        
                        {/* Service Cards Row */}
                        <div className="flex gap-4 justify-start flex-wrap">
                          {layerNodes.map((node) => (
                            <div
                              key={node.id}
                              id={`node-${node.id}`}
                              className={`flex-shrink-0 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                                selectedNode === node.id ? 'ring-2 ring-[#AE275F] shadow-xl scale-105 z-20' : 'z-10'
                              }`}
                              style={{ width: '220px' }}
                              onClick={() => setSelectedNode(node.id)}
                            >
                              <div className={`bg-white rounded-xl border-2 ${getBorderColor(node.status)} p-4 relative h-full`}>
                                {/* Alert Badge */}
                                {node.alerts > 0 && (
                                  <div className={`absolute -top-2 -right-2 w-7 h-7 ${getAlertBgColor(node.alerts)} text-white rounded-full flex items-center justify-center text-xs font-semibold z-10 shadow-md`}>
                                    {node.alerts}
                                  </div>
                                )}

                                {/* Service Icon and Name */}
                                <div className="flex items-start gap-3 mb-4">
                                  <div className="p-2.5 bg-gray-100 rounded-lg flex-shrink-0">
                                    {getNodeIcon(node.type)}
                                  </div>
                                  <div className="flex-1 min-w-0 pt-1">
                                    <div className="text-base text-gray-900" title={node.name}>
                                      {node.name}
                                    </div>
                                  </div>
                                </div>

                                {/* Health Status */}
                                <div className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                                  {node.health}% health
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Node Details Popup */}
                {selectedNode && (
                  <div className="absolute bottom-4 right-4 bg-white border-2 border-[#AE275F] rounded-lg p-4 shadow-2xl max-w-xs z-30">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm text-gray-900">
                        {dependencyNodes.find(n => n.id === selectedNode)?.name}
                      </h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(null);
                        }} 
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusBadgeColor(dependencyNodes.find(n => n.id === selectedNode)?.status || '')}>
                          {dependencyNodes.find(n => n.id === selectedNode)?.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Health:</span>
                        <span className="text-gray-900">{dependencyNodes.find(n => n.id === selectedNode)?.health}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="text-gray-900 capitalize">{dependencyNodes.find(n => n.id === selectedNode)?.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Alerts:</span>
                        <span className={`${dependencyNodes.find(n => n.id === selectedNode)?.alerts ? 'text-red-600' : 'text-green-600'}`}>
                          {dependencyNodes.find(n => n.id === selectedNode)?.alerts || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Layer:</span>
                        <span className="text-gray-900 text-[10px]">{layers[dependencyNodes.find(n => n.id === selectedNode)?.layer || 0]}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    Click on any service node to view detailed information. Lines represent dependencies and data flow between services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Affected Services - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg text-gray-900">Affected Services</h2>
              </div>

              <div className="space-y-3">
                {affectedServices.map((service, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-l-4 transition-all cursor-pointer hover:shadow-md ${
                      service.status === 'degraded' ? 'border-red-500 bg-red-50' :
                      service.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-gray-900 mb-1">{service.name}</div>
                        <Badge className={getStatusBadgeColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Impact Level:</span>
                        <span className={`${getImpactColor(service.impact)} uppercase`}>
                          {service.impact}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Dependencies:</span>
                        <span className="text-gray-900">{service.dependencies}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Downstream Impact:</span>
                        <span className={service.downstreamImpact > 0 ? 'text-red-600' : 'text-green-600'}>
                          {service.downstreamImpact}
                        </span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-600">Response Time:</span>
                          <span className="text-gray-900">{service.responseTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Error Rate:</span>
                          <span className={parseFloat(service.errorRate) > 1 ? 'text-red-600' : 'text-green-600'}>
                            {service.errorRate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-sm text-[#AE275F] hover:bg-[#AE275F]/10 rounded-lg transition-all">
                View All Services →
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}