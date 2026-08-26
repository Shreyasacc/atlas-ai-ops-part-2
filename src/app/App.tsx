import React, { useState } from 'react';
import { Dashboard } from './components/pages/Dashboard';
import { IncidentAnalyzer } from './components/IncidentAnalyzer';
import { UserManagement } from './components/UserManagement';
import { IntegrationTool } from './components/pages/IntegrationTool';
import { Inventory } from './components/Inventory';
import { MyProfile } from './components/MyProfile';
import { AccountSettings } from './components/AccountSettings';
import { Preferences } from './components/Preferences';
import { NLPCommandCenter } from './components/NLPCommandCenter';
import { IntelligentObservability } from './components/IntelligentObservability';
import { RunbookOrchestration } from './components/RunbookOrchestration';
import { AdaptiveKnowledgeLearning } from './components/AdaptiveKnowledgeLearning';
import { ChatbotAssistant } from './components/ChatbotAssistant';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { ForgotPassword } from './components/Auth/ForgotPassword';
import { OTPLogin } from './components/Auth/OTPLogin';
import { AnomalyDetection } from './components/pages/AnomalyDetection';
import { AnomalyDetails } from './components/pages/AnomalyDetails';
import { ServiceAnomalyDashboard } from './components/pages/ServiceAnomalyDashboard';
import { ServiceTopology } from './components/pages/ServiceTopology';
import { RCA } from './components/pages/RCA';
import { RCADetails } from './components/pages/RCADetails';
import { SyslogReviewer } from './components/pages/SyslogReviewer';
import { PatternDetection } from './components/pages/PatternDetection';
import { Alerting } from './components/pages/Alerting';
import { PredictiveMaintenance } from './components/pages/PredictiveMaintenance';
import { Agent } from './components/pages/Agent';
import { FinOpsOverview } from './components/pages/FinOpsOverview';
import { FinOpsCloudServices } from './components/pages/FinOpsCloudServices';
import { FinOpsBudgets } from './components/pages/FinOpsBudgets';
import { FinOpsSavings } from './components/pages/FinOpsSavings';
import { FinOpsReports } from './components/pages/FinOpsReports';
import { Button } from './components/ui/button';
import { MessageCircle } from 'lucide-react';

type AuthPage = 'login' | 'signup' | 'forgot' | 'otp';

export default function App() {
  // Set to false to show login page, true to skip to dashboard
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [currentPage, setCurrentPage] = useState<string>('anomaly-detection');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [incidentView, setIncidentView] = useState<'incidents' | 'whitenoise'>('incidents');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>('');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthPage('login');
    setCurrentPage('dashboard');
  };

  // Handle navigation with optional incident view parameter
  const handleNavigate = (page: string, view?: 'incidents' | 'whitenoise', anomalyId?: string) => {
    setCurrentPage(page);
    if (view) {
      setIncidentView(view);
    }
    if (anomalyId) {
      setSelectedAnomalyId(anomalyId);
    }
  };

  if (!isAuthenticated) {
    switch (authPage) {
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={setAuthPage} />;
      case 'signup':
        return <SignUp onSignUp={handleSignUp} onNavigate={setAuthPage} />;
      case 'forgot':
        return <ForgotPassword onNavigate={setAuthPage} />;
      case 'otp':
        return <OTPLogin onLogin={handleLogin} onNavigate={setAuthPage} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'anomaly-detection':
        return <AnomalyDetection onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'anomaly-details':
        return <AnomalyDetails onNavigate={handleNavigate} onLogout={handleLogout} anomalyId={selectedAnomalyId} />;
      case 'service-anomaly-dashboard':
        return <ServiceAnomalyDashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'service-topology':
        return <ServiceTopology onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'rca':
        return <RCA onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'rca-details':
        return <RCADetails onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'rca-syslog':
      case 'syslog-reviewer':
      case 'Syslog Reviewer':
        return <SyslogReviewer onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'rca-pattern-detection':
      case 'pattern-detection':
      case 'Pattern Detection':
        return <PatternDetection onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'alerting':
        return <Alerting onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'predictive-maintenance':
        return <PredictiveMaintenance onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'agent':
        return <Agent onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'Overview':
      case 'fin-ops':
        return <FinOpsOverview onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'Cloud Services':
      case 'fin-ops-cloud-services':
      case 'cloud-services':
        return <FinOpsCloudServices onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'fin-ops-budgets':
      case 'Budgets':
        return <FinOpsBudgets onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'fin-ops-savings':
      case 'Savings':
      case 'Savings & Commitments':
        return <FinOpsSavings onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'fin-ops-reports':
      case 'Reports':
        return <FinOpsReports onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'analyzer':
        return <IncidentAnalyzer onNavigate={handleNavigate} onLogout={handleLogout} view={incidentView} />;
      case 'user-management':
        return <UserManagement onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'nlp-command-center':
        return <NLPCommandCenter onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'intelligent-observability':
        return <IntelligentObservability onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'runbook-orchestration':
        return <RunbookOrchestration onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'adaptive-learning':
        return <AdaptiveKnowledgeLearning onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'integration-tool':
        return <IntegrationTool onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'inventory':
        return <Inventory onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'my-profile':
        return <MyProfile onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'account-settings':
        return <AccountSettings onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'preferences':
        return <Preferences onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={setCurrentPage} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      {renderPage()}
      
      {/* AI Assistant Chatbot Button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#AE275F] hover:bg-[#8B1F4C] text-white shadow-lg hover:shadow-xl transition-all z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      <ChatbotAssistant 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}