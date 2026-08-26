import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, BarChart3, AlertTriangle, TrendingUp, Cloud, Zap, Activity, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestionChips = [
  { icon: AlertTriangle, label: 'Critical Issues', query: 'What are our current critical issues?' },
  { icon: BarChart3, label: 'Performance Metrics', query: 'Show me key performance metrics' },
  { icon: Cloud, label: 'Cloud Status', query: 'What is the cloud provider status?' },
  { icon: TrendingUp, label: 'Trend Analysis', query: 'Show me current trends' },
  { icon: Zap, label: 'Automation', query: 'How is our automation performing?' },
  { icon: Activity, label: 'System Health', query: 'What is the overall system health?' },
];

export function ChatbotAssistant({ isOpen, onClose }: ChatbotAssistantProps) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset to intro screen when closed
  useEffect(() => {
    if (!isOpen) {
      setShowChat(false);
      setMessages([]);
      setInputValue('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (query?: string) => {
    const messageText = query || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShowChat(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleChipClick = (query: string) => {
    handleSend(query);
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Critical Issues & Incidents
    if (lowerInput.includes('critical') || lowerInput.includes('p1') || lowerInput.includes('urgent')) {
      return 'There are currently 4 critical issues requiring immediate attention:\n\n**P1 Incidents (2):**\n• Payment Gateway Timeout - Revenue Impact (AWS EC2)\n• Login Failure - Customer Impact (Auth Service)\n\n**P2 Incidents (2):**\n• Account Lockouts Spike - SLA Risk (Azure AD)\n• Order Database Latency - Performance Issue (GCP)\n\nThe payment gateway issue is most critical due to direct revenue impact. All incidents are being actively tracked with response teams engaged.';
    }
    
    // Incident Severity
    else if (lowerInput.includes('severity') || lowerInput.includes('p2') || lowerInput.includes('p3')) {
      return 'Current incident distribution by severity:\n\n• **P1 (Critical):** 2 incidents - Direct business impact\n• **P2 (High):** 2 incidents - Service degradation\n• **P3 (Medium):** Lower priority issues under monitoring\n\nWhile P3 incidents are more numerous, P1 incidents account for the majority of business risk. Current focus is on resolving the 2 critical P1 incidents.';
    }
    
    // KPIs & Metrics
    else if (lowerInput.includes('kpi') || lowerInput.includes('metric') || lowerInput.includes('performance')) {
      return 'Key operational metrics are performing well:\n\n**Response Performance:**\n• Mean Time to Identify: 12 minutes\n• Mean Time to Resolve: 45 minutes\n• All metrics within SLA targets\n\n**System Health:**\n• System availability: 99%+ across all services\n• Response times: Optimal\n• Security score: Strong\n\nOverall operational performance is stable and within acceptable limits.';
    }
    
    // SLA & Response Time
    else if (lowerInput.includes('sla') || lowerInput.includes('response time') || lowerInput.includes('resolution')) {
      return 'Response and resolution times are currently **within SLA targets**, indicating stable operational performance.\n\n**Current Performance:**\n• Mean Time to Identify: 12 minutes ✓\n• Mean Time to Resolve: 45 minutes ✓\n• SLA Compliance: On target\n\nNo concerning trends detected. The team is maintaining excellent response standards.';
    }
    
    // Cloud Providers
    else if (lowerInput.includes('cloud') || lowerInput.includes('aws') || lowerInput.includes('azure') || lowerInput.includes('gcp')) {
      return 'Cloud provider status overview:\n\n**AWS:** 8 active incidents\n• Top impacted: EC2, S3, Lambda\n• Risk Status: Amber\n\n**Azure:** 6 active incidents\n• Top impacted: App Service, Azure AD\n• Risk Status: Green\n\n**GCP:** 5 active incidents\n• Top impacted: Compute Engine, Cloud SQL\n• Risk Status: Green\n\nAWS has the highest incident count but all providers are within manageable limits.';
    }
    
    // Applications
    else if (lowerInput.includes('application') || lowerInput.includes('app') || lowerInput.includes('service')) {
      return 'Top 5 Problematic Applications:\n\n1. **Stripe Payment Service** - Revenue Impact (AWS EC2)\n2. **Customer Portal App** - Customer Impact (Auth Service)\n3. **Order Processing API** - Internal Operations (GCP)\n4. **Identity Management** - Security Risk (Azure AD)\n5. **Notification Service** - Customer Experience (AWS Lambda)\n\nThe majority of current issues are application-related rather than cloud infrastructure issues. Payment and authentication services require immediate attention.';
    }
    
    // Automation & Efficiency
    else if (lowerInput.includes('automation') || lowerInput.includes('auto') || lowerInput.includes('efficiency')) {
      return 'Automation & efficiency metrics are strong:\n\n**Auto-Resolution:**\n• 68% of incidents resolved automatically\n• Significant reduction in manual effort\n• Faster response times\n\n**Integration Status:**\n• 8/9 tools connected and syncing\n• Real-time monitoring active\n• Cross-platform automation enabled\n\nAutomation is resolving over half of incidents automatically, reducing manual workload and improving overall response speed.';
    }
    
    // Integration Tools
    else if (lowerInput.includes('tool') || lowerInput.includes('integration') || lowerInput.includes('monitoring')) {
      return 'Integration & monitoring tools status:\n\n**Connected & Active (8):**\n• New Relic - APM monitoring\n• Grafana - Metrics visualization  \n• Dynatrace - Full-stack observability\n• Teams - Incident collaboration\n• Slack - Real-time alerts\n• SigNoz - Open-source observability\n• AWS CloudWatch - Cloud monitoring\n• Azure Monitor - Azure services\n\n**Syncing (1):**\n• GCP Operations - In progress\n\nEcosystem readiness is excellent with 89% of tools fully operational.';
    }
    
    // Trends
    else if (lowerInput.includes('trend') || lowerInput.includes('improving') || lowerInput.includes('worse') || lowerInput.includes('increase')) {
      return 'Current trend analysis:\n\n**Improving ↓:**\n• Incident resolution times\n• Automation coverage\n• System availability\n\n**Concern ↑:**\n• Payment service incidents (+15% this week)\n• Customer portal issues\n• AWS incident volume\n\nWhile some applications show increased incidents, overall operational performance is improving thanks to faster response times and higher automation.';
    }
    
    // Risk & Health
    else if (lowerInput.includes('risk') || lowerInput.includes('health') || lowerInput.includes('status')) {
      return 'Overall system health and risk assessment:\n\n**Risk Status:**\n• AWS: Amber (elevated incidents)\n• Azure: Green (stable)\n• GCP: Green (stable)\n\n**System Health:**\n• Availability: 99%+ (Excellent)\n• Performance: Within targets\n• Security: Strong compliance\n\n**Current Focus:**\n• 2 P1 incidents require immediate attention\n• Payment gateway is highest priority\n\nOverall operational health is good, with isolated critical issues being actively managed.';
    }
    
    // Help / Capabilities
    else if (lowerInput.includes('help') || lowerInput.includes('can you') || lowerInput.includes('what can')) {
      return 'I can help you understand:\n\n**Critical Issues & Incidents**\n• Current P1/P2/P3 incidents\n• Status updates and ETAs\n• Business impact assessment\n\n**KPIs & Metrics**\n• Resolution times and SLA compliance\n• Automation coverage\n• Operational health indicators\n\n**Infrastructure**\n• Cloud provider performance\n• Problematic applications\n• Integration tool status\n\n**Trends & Analysis**\n• Week-over-week performance\n• Risk indicators\n• Efficiency improvements\n\nWhat would you like to explore?';
    }
    
    // Default response
    else {
      return 'I understand you\'re asking about the dashboard. I can provide insights on:\n\n• Critical issues and current incidents\n• KPIs, metrics, and SLA performance\n• Cloud provider and application status\n• Automation efficiency and integration tools\n• Trends and operational health\n\nCould you be more specific about what you\'d like to know?';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[420px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 z-50 overflow-hidden"
      style={{ height: showChat ? '600px' : 'auto', maxHeight: '600px' }}
    >
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[#AE275F] to-[#8B1F4C] rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <p className="text-xs text-white/80">Dashboard Intelligence</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!showChat ? (
          // Introduction View
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Welcome Message */}
            <div className="text-center space-y-2">
              <h4 className="text-gray-900 font-semibold">Welcome! How can I help you today?</h4>
              <p className="text-sm text-gray-600">
                I can provide real-time insights on incidents, metrics, cloud performance, and operational health.
              </p>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-100">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-[#AE275F]" />
                <span className="text-sm font-medium text-gray-900">Live Dashboard Status</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#AE275F]">4</div>
                  <div className="text-xs text-gray-600">Active Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">99%</div>
                  <div className="text-xs text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">68%</div>
                  <div className="text-xs text-gray-600">Auto-Resolved</div>
                </div>
              </div>
            </div>

            {/* Suggestion Chips */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestionChips.map((chip, index) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleChipClick(chip.query)}
                      className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-[#AE275F] hover:bg-pink-50 transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#AE275F] flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-[#AE275F] font-medium">{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Chat View
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Back to Intro Button */}
            <div className="px-4 pt-3 pb-2 border-b border-gray-100">
              <button
                onClick={() => {
                  setShowChat(false);
                  setMessages([]);
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#AE275F] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Quick Actions</span>
              </button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'bot' ? 'bg-pink-100' : 'bg-gray-200'
                      }`}
                    >
                      {message.sender === 'bot' ? (
                        <Bot className="w-5 h-5 text-[#AE275F]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div
                        className={`inline-block px-4 py-2.5 rounded-2xl max-w-[280px] ${
                          message.sender === 'bot'
                            ? 'bg-gray-100 text-gray-900 rounded-tl-sm'
                            : 'bg-[#AE275F] text-white rounded-tr-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 px-1">{formatTime(message.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Always Visible */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about the dashboard..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border-gray-300 focus:border-[#AE275F] focus:ring-[#AE275F]"
          />
          <Button
            onClick={() => handleSend()}
            className="bg-[#AE275F] hover:bg-[#8B1F4C] text-white px-4"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
