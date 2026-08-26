import React from "react";
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Bot,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Activity,
  Calendar,
  ChevronDown,
  CheckCircle2,
  X,
  Filter,
  Search,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PageContainer } from "../layouts/PageContainer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { DateTimeRangePicker } from "../ui/datetime-range-picker";
import { format, subDays, subMonths, startOfDay, endOfDay } from "date-fns";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { CriticalIssuesSection } from "../CriticalIssuesSection";
import teamsLogo from "figma:asset/4be1a8225ecf8a2669411e4f97be7a3b5b957133.png";
import dynatraceLogo from "figma:asset/f392b5fed600a49d6be38c9234ecd7a2726324b4.png";
import grafanaLogo from "figma:asset/946d1752e29f4dbac5427cc1ea61d13fdc4cde9a.png";
import slackLogo from "figma:asset/403126d7a1277ba6f757fd200ce86210572c9225.png";
import awsLogo from "figma:asset/842f305051c82d7ab507109953a37071407a4919.png";
import newRelicLogo from "figma:asset/f5be67c5add83eb44775fbaa35e394d80180aed6.png";
import gcpLogo from "figma:asset/13add375e3a2db3f7db7cbae5b934507fb50dc5a.png";
import azureLogo from "figma:asset/d33531d236b10313b9671afe2f89ffc6853e67ba.png";
import signozLogo from "figma:asset/775d64cdd6d020ce8063d4b94354949955d28626.png";

// Executive Dashboard v2.0 - Updated Dec 2024
interface DashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function Dashboard({
  onNavigate,
  onLogout,
}: DashboardProps) {
  const [selectedSeverities, setSelectedSeverities] = React.useState<string[]>([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]);
  const [timeView, setTimeView] = React.useState<"Daily" | "Weekly">("Weekly");
  const [dateRange, setDateRange] = React.useState<string>("Last 30 days");
  const [showDateDropdown, setShowDateDropdown] = React.useState(false);
  const [customStartDate, setCustomStartDate] = React.useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = React.useState<Date | undefined>(undefined);
  const [appliedCustomRange, setAppliedCustomRange] = React.useState<{start: Date, end: Date} | null>(null);
  const [showCustomRangePicker, setShowCustomRangePicker] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const dateRangeOptions = [
    "Last 7 days",
    "Last 30 days",
    "Last 1 month",
    "Custom date",
  ];

  // Handle date range selection
  const handleDateRangeSelect = (option: string) => {
    if (option === "Custom date") {
      setShowDateDropdown(false);
      setShowCustomRangePicker(true);
    } else {
      setDateRange(option);
      setShowDateDropdown(false);
      setAppliedCustomRange(null);
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  };

  // Apply custom date range from DateTimeRangePicker
  const handleApplyCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setAppliedCustomRange({ start, end });
    
    // Format display text
    const formatDate = (date: Date) => {
      return format(date, "MMM d, yyyy h:mm a");
    };
    
    setDateRange(`${formatDate(start)} - ${formatDate(end)}`);
    setShowCustomRangePicker(false);
  };

  const toggleSeverity = (severity: string) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity)
        ? prev.filter((s) => s !== severity)
        : [...prev, severity],
    );
  };

  // Calculate metrics based on selected date range
  const getMetricsForDateRange = () => {
    // Adjust metrics based on selected range
    if (dateRange === "Last 7 days") {
      return {
        criticalIncidents: 8,
        avgResolutionTime: 15,
        slaCompliance: 98.5,
        automationCoverage: 72,
        operationalEfficiency: 45,
        costSavings: 5800,
        aiResolvedCount: 3,
        criticalTrend: "↓ 2 from previous week",
        resolutionTrend: "↓ 3min improvement",
        slaTrend: "↑ 1.2% this week",
        automationTrend: "↑ 5% this week",
        efficiencyTrend: "↑ 8% improvement",
        problematicApps: [
          { name: 'Stripe Payment Service', incidents: 12, trend: 'up', color: 'red', cloud: 'AWS EC2', impact: 'Revenue' },
          { name: 'Customer Portal App', incidents: 9, trend: 'down', color: 'amber', cloud: 'Auth Service', impact: 'Customer' },
          { name: 'Order Processing API', incidents: 8, trend: 'up', color: 'orange', cloud: 'GCP Cloud SQL', impact: 'Revenue' },
          { name: 'Identity Management', incidents: 6, trend: 'stable', color: 'amber', cloud: 'Azure AD', impact: 'Security' },
          { name: 'Analytics Dashboard', incidents: 5, trend: 'down', color: 'amber', cloud: 'AWS S3', impact: 'Internal' }
        ]
      };
    } else if (dateRange === "Last 1 month") {
      return {
        criticalIncidents: 72,
        avgResolutionTime: 22,
        slaCompliance: 96.8,
        automationCoverage: 68,
        operationalEfficiency: 38,
        costSavings: 42000,
        aiResolvedCount: 24,
        criticalTrend: "↑ 12 from last month",
        resolutionTrend: "↑ 4min slower",
        slaTrend: "↓ 0.8% this month",
        automationTrend: "↑ 3% this month",
        efficiencyTrend: "↑ 12% improvement",
        problematicApps: [
          { name: 'Stripe Payment Service', incidents: 58, trend: 'up', color: 'red', cloud: 'AWS EC2', impact: 'Revenue' },
          { name: 'Customer Portal App', incidents: 45, trend: 'up', color: 'orange', cloud: 'Auth Service', impact: 'Customer' },
          { name: 'Order Processing API', incidents: 39, trend: 'stable', color: 'red', cloud: 'GCP Cloud SQL', impact: 'Revenue' },
          { name: 'Identity Management', incidents: 32, trend: 'down', color: 'amber', cloud: 'Azure AD', impact: 'Security' },
          { name: 'Analytics Dashboard', incidents: 28, trend: 'up', color: 'amber', cloud: 'AWS S3', impact: 'Internal' }
        ]
      };
    } else if (appliedCustomRange) {
      // Calculate days in custom range
      const days = Math.ceil((appliedCustomRange.end.getTime() - appliedCustomRange.start.getTime()) / (1000 * 60 * 60 * 24));
      const multiplier = days / 30;
      
      return {
        criticalIncidents: Math.round(42 * multiplier),
        avgResolutionTime: Math.round(18 + (Math.random() * 10 - 5)),
        slaCompliance: Number((97.2 + (Math.random() * 4 - 2)).toFixed(1)),
        automationCoverage: Math.round(70 + (Math.random() * 10 - 5)),
        operationalEfficiency: Math.round(42 + (Math.random() * 10 - 5)),
        costSavings: Math.round(24500 * multiplier),
        aiResolvedCount: Math.round(14 * multiplier),
        criticalTrend: `Custom ${days} days`,
        resolutionTrend: "Custom range",
        slaTrend: "Custom range",
        automationTrend: "Custom range",
        efficiencyTrend: "Custom range",
        problematicApps: [
          { name: 'Stripe Payment Service', incidents: Math.round(47 * multiplier), trend: 'up', color: 'red', cloud: 'AWS EC2', impact: 'Revenue' },
          { name: 'Customer Portal App', incidents: Math.round(38 * multiplier), trend: 'stable', color: 'orange', cloud: 'Auth Service', impact: 'Customer' },
          { name: 'Order Processing API', incidents: Math.round(32 * multiplier), trend: 'down', color: 'red', cloud: 'GCP Cloud SQL', impact: 'Revenue' },
          { name: 'Identity Management', incidents: Math.round(28 * multiplier), trend: 'down', color: 'amber', cloud: 'Azure AD', impact: 'Security' },
          { name: 'Analytics Dashboard', incidents: Math.round(24 * multiplier), trend: 'up', color: 'amber', cloud: 'AWS S3', impact: 'Internal' }
        ]
      };
    } else {
      // Last 30 days (default)
      return {
        criticalIncidents: 42,
        avgResolutionTime: 18,
        slaCompliance: 97.2,
        automationCoverage: 70,
        operationalEfficiency: 42,
        costSavings: 24500,
        aiResolvedCount: 14,
        criticalTrend: "↓ 8 from last week",
        resolutionTrend: "↓ 8min improvement",
        slaTrend: "↑ 0.5% this month",
        automationTrend: "↑ 4% this month",
        efficiencyTrend: "↑ 15% improvement",
        problematicApps: [
          { name: 'Stripe Payment Service', incidents: 47, trend: 'up', color: 'red', cloud: 'AWS EC2', impact: 'Revenue' },
          { name: 'Customer Portal App', incidents: 38, trend: 'up', color: 'orange', cloud: 'Auth Service', impact: 'Customer' },
          { name: 'Order Processing API', incidents: 32, trend: 'down', color: 'red', cloud: 'GCP Cloud SQL', impact: 'Revenue' },
          { name: 'Identity Management', incidents: 28, trend: 'stable', color: 'amber', cloud: 'Azure AD', impact: 'Security' },
          { name: 'Analytics Dashboard', incidents: 24, trend: 'down', color: 'amber', cloud: 'AWS S3', impact: 'Internal' }
        ]
      };
    }
  };

  const metrics = getMetricsForDateRange();

  // Weekly Incident Trends Data
  const weeklyIncidentTrends = [
    { week: "Week 1", Critical: 40, High: 105, Medium: 75, Low: 35 },
    { week: "Week 2", Critical: 45, High: 110, Medium: 85, Low: 38 },
    { week: "Week 3", Critical: 35, High: 95, Medium: 70, Low: 40 },
    { week: "Week 4", Critical: 50, High: 125, Medium: 95, Low: 45 },
  ];

  // Mock data for incidents table
  const activeIncidents = [
    {
      id: 1,
      incident: "Payment Gateway Timeout",
      severity: "critical",
      provider: "AWS",
      status: "Investigating",
      eta: "15 mins",
    },
    {
      id: 2,
      incident: "Database Connection Pool Full",
      severity: "warning",
      provider: "Azure",
      status: "In Progress",
      eta: "30 mins",
    },
    {
      id: 3,
      incident: "API Rate Limit Exceeded",
      severity: "warning",
      provider: "AWS",
      status: "Monitoring",
      eta: "10 mins",
    },
  ];

  const upcomingRisks = [
    {
      title: "API Key expiring in 7 days",
      description: "Production AWS key needs renewal",
      color: "border-l-orange-500",
    },
    {
      title: "Database backup overdue",
      description: "Last backup was 36 hours ago",
      color: "border-l-red-500",
    },
    {
      title: "SSL Certificate renewal due",
      description: "Expires in 14 days",
      color: "border-l-yellow-500",
    },
  ];

  const incidentTrendData = [
    { day: "Mon", critical: 2, warning: 5, info: 8 },
    { day: "Tue", critical: 1, warning: 3, info: 6 },
    { day: "Wed", critical: 4, warning: 8, info: 12 },
    { day: "Thu", critical: 2, warning: 4, info: 7 },
    { day: "Fri", critical: 5, warning: 9, info: 15 },
    { day: "Sat", critical: 1, warning: 2, info: 4 },
    { day: "Sun", critical: 1, warning: 3, info: 5 },
  ];

  const costSavingsData = [
    { month: "Jan", savings: 1800 },
    { month: "Feb", savings: 2100 },
    { month: "Mar", savings: 1600 },
    { month: "Apr", savings: 2400 },
    { month: "May", savings: 1900 },
    { month: "Jun", savings: 2600 },
    { month: "Jul", savings: 2200 },
    { month: "Aug", savings: 2900 },
    { month: "Sep", savings: 2400 },
    { month: "Oct", savings: 3100 },
    { month: "Nov", savings: 2700 },
    { month: "Dec", savings: 3300 },
  ];

  // AI Auto-Resolved Incidents by Type
  const aiResolvedIncidents = [
    { name: "Network", value: 5, color: "#3b82f6" },
    { name: "Database", value: 4, color: "#8b5cf6" },
    { name: "API", value: 3, color: "#06b6d4" },
    { name: "CPU", value: 2, color: "#10b981" },
  ];

  const topImpactCategories = [
    { name: "Database", value: 85, color: "bg-red-500" },
    { name: "Network", value: 72, color: "bg-orange-500" },
    { name: "CPU", value: 58, color: "bg-yellow-500" },
    { name: "Firewall", value: 45, color: "bg-blue-500" },
    { name: "API", value: 32, color: "bg-purple-500" },
  ];

  // Integration Tools Activity Data
  const integrationTools = [
    {
      name: "New Relic",
      status: "Connected",
      incidents: 45,
      statusColor: "bg-green-500",
      topStroke: "bg-blue-600",
      icon: "📊",
      logo: newRelicLogo,
    },
    {
      name: "Grafana",
      status: "Connected",
      incidents: 32,
      statusColor: "bg-green-500",
      topStroke: "bg-orange-500",
      icon: "📈",
      logo: grafanaLogo,
    },
    {
      name: "Dynatrace",
      status: "Syncing",
      incidents: 28,
      statusColor: "bg-blue-500",
      topStroke: "bg-purple-600",
      icon: "🔍",
      logo: dynatraceLogo,
    },
    {
      name: "Teams",
      status: "Connected",
      incidents: 18,
      statusColor: "bg-green-500",
      topStroke: "bg-blue-500",
      icon: "👥",
      logo: teamsLogo,
    },
    {
      name: "Slack",
      status: "Connected",
      incidents: 22,
      statusColor: "bg-green-500",
      topStroke: "bg-purple-500",
      icon: "💬",
      logo: slackLogo,
    },
    {
      name: "AWS",
      status: "Connected",
      incidents: 56,
      statusColor: "bg-green-500",
      topStroke: "bg-orange-500",
      icon: "☁️",
      logo: awsLogo,
    },
    {
      name: "GCP",
      status: "Connected",
      incidents: 30,
      statusColor: "bg-green-500",
      topStroke: "bg-blue-500",
      icon: "☁️",
      logo: gcpLogo,
    },
    {
      name: "Azure",
      status: "Connected",
      incidents: 40,
      statusColor: "bg-green-500",
      topStroke: "bg-blue-600",
      icon: "☁️",
      logo: azureLogo,
    },
    {
      name: "SigNoz",
      status: "Connected",
      incidents: 25,
      statusColor: "bg-green-500",
      topStroke: "bg-red-500",
      icon: "📊",
      logo: signozLogo,
    },
  ];

  // Cloud Provider Overview Data
  const cloudProviders = [
    {
      name: "AWS",
      logo: awsLogo,
      activeIncidents: 12,
      topServices: ["EC2", "S3", "Lambda"],
      topService: "EC2",
      color: "bg-orange-500",
    },
    {
      name: "Azure",
      logo: azureLogo,
      activeIncidents: 8,
      topServices: ["App Service", "SQL Database", "Functions"],
      topService: "App Service",
      color: "bg-blue-500",
    },
    {
      name: "GCP",
      logo: gcpLogo,
      activeIncidents: 5,
      topServices: ["Compute Engine", "Cloud Storage", "Cloud Functions"],
      topService: "Compute Engine",
      color: "bg-green-500",
    },
    {
      name: "Other",
      logo: null,
      activeIncidents: 3,
      topServices: ["On-Premise", "CDN", "Third-party APIs"],
      topService: "On-Premise",
      color: "bg-gray-500",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "warning":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Filter function for search
  const filterBySearch = <T extends Record<string, any>>(items: T[], searchFields: (keyof T)[]): T[] => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        if (typeof value === 'number') {
          return value.toString().includes(query);
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(query)
          );
        }
        return false;
      })
    );
  };

  // Apply filters to data
  const filteredProblematicApps = filterBySearch(metrics.problematicApps, ['name', 'cloud', 'impact']);
  const filteredIntegrationTools = filterBySearch(integrationTools, ['name', 'status']);
  const filteredCloudProviders = filterBySearch(cloudProviders, ['name', 'topService', 'topServices']);

  return (
    <DashboardLayout
      currentPage="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* Hero Section with Title and Metrics */}
      <div className="relative bg-[#AE275F] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Animated Wave Lines */}
            <path
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.3"
              d="M0,30 C15,25 25,35 35,30 S55,25 65,30 S85,35 100,30"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="
                  M0,30 C15,25 25,35 35,30 S55,25 65,30 S85,35 100,30;
                  M0,35 C15,30 25,40 35,35 S55,30 65,35 S85,40 100,35;
                  M0,30 C15,25 25,35 35,30 S55,25 65,30 S85,35 100,30
                "
              />
            </path>
            <path
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.3"
              d="M0,50 C20,45 30,55 45,50 S65,45 75,50 S90,55 100,50"
            >
              <animate
                attributeName="d"
                dur="12s"
                repeatCount="indefinite"
                values="
                  M0,50 C20,45 30,55 45,50 S65,45 75,50 S90,55 100,50;
                  M0,55 C20,50 30,60 45,55 S65,50 75,55 S90,60 100,55;
                  M0,50 C20,45 30,55 45,50 S65,45 75,50 S90,55 100,50
                "
              />
            </path>
            <path
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.2"
              d="M0,70 C25,65 35,75 50,70 S70,65 80,70 S95,75 100,70"
            >
              <animate
                attributeName="d"
                dur="15s"
                repeatCount="indefinite"
                values="
                  M0,70 C25,65 35,75 50,70 S70,65 80,70 S95,75 100,70;
                  M0,75 C25,70 35,80 50,75 S70,70 80,75 S95,80 100,75;
                  M0,70 C25,65 35,75 50,70 S70,65 80,70 S95,75 100,70
                "
              />
            </path>
            
            {/* Floating Circles */}
            <circle cx="10" cy="20" r="1" fill="rgba(255,255,255,0.3)">
              <animate
                attributeName="cy"
                dur="8s"
                repeatCount="indefinite"
                values="20;80;20"
              />
              <animate
                attributeName="opacity"
                dur="8s"
                repeatCount="indefinite"
                values="0.3;0.6;0.3"
              />
            </circle>
            <circle cx="30" cy="60" r="1.5" fill="rgba(255,255,255,0.4)">
              <animate
                attributeName="cy"
                dur="10s"
                repeatCount="indefinite"
                values="60;15;60"
              />
              <animate
                attributeName="opacity"
                dur="10s"
                repeatCount="indefinite"
                values="0.4;0.7;0.4"
              />
            </circle>
            <circle cx="70" cy="40" r="1" fill="rgba(255,255,255,0.35)">
              <animate
                attributeName="cy"
                dur="12s"
                repeatCount="indefinite"
                values="40;85;40"
              />
              <animate
                attributeName="opacity"
                dur="12s"
                repeatCount="indefinite"
                values="0.35;0.65;0.35"
              />
            </circle>
            <circle cx="90" cy="70" r="1.2" fill="rgba(255,255,255,0.3)">
              <animate
                attributeName="cy"
                dur="9s"
                repeatCount="indefinite"
                values="70;25;70"
              />
              <animate
                attributeName="opacity"
                dur="9s"
                repeatCount="indefinite"
                values="0.3;0.6;0.3"
              />
            </circle>
            
            {/* Diagonal Lines */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2">
              <animate
                attributeName="opacity"
                dur="6s"
                repeatCount="indefinite"
                values="0.15;0.3;0.15"
              />
            </line>
            <line x1="0" y1="100" x2="100" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2">
              <animate
                attributeName="opacity"
                dur="7s"
                repeatCount="indefinite"
                values="0.15;0.3;0.15"
              />
            </line>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-white mb-2">
                Operational Health Overview
              </h1>
              <p className="text-white/90 text-sm">
                Real-time visibility into system performance, AI driven optimization, and incident impact on your environment.
              </p>
            </div>
            
            {/* Filters Section: Search Bar + Date Range */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search Bar */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search incidents, cloud, apps, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 px-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Date Range Selector */}
              <div className="relative flex-shrink-0">
              {!showCustomRangePicker ? (
                <>
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-lg transition-all w-full sm:w-auto"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm whitespace-nowrap">{dateRange}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showDateDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      {dateRangeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleDateRangeSelect(option)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            dateRange === option
                              ? "bg-[#AE275F]/10 text-[#AE275F]"
                              : "text-gray-700"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute right-0 mt-0 z-20">
                  <DateTimeRangePicker
                    startDate={customStartDate}
                    endDate={customEndDate}
                    onApply={handleApplyCustomRange}
                    onCancel={() => setShowCustomRangePicker(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Hero Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {/* Critical Incidents (P1) */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Critical Incidents (P1)
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  metrics.criticalIncidents < 10 ? 'bg-green-100' : metrics.criticalIncidents < 30 ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    metrics.criticalIncidents < 10 ? 'text-green-600' : metrics.criticalIncidents < 30 ? 'text-orange-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  {metrics.criticalIncidents}
                </div>
              </div>
              <div className={`text-xs ${
                metrics.criticalTrend.includes('↓') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.criticalTrend}
              </div>
            </div>

            {/* Avg Time to Resolve (Critical) */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Avg Time to Resolve
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  metrics.avgResolutionTime < 20 ? 'bg-green-100' : metrics.avgResolutionTime < 30 ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  <Clock className={`w-4 h-4 ${
                    metrics.avgResolutionTime < 20 ? 'text-green-600' : metrics.avgResolutionTime < 30 ? 'text-orange-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  {metrics.avgResolutionTime} min
                </div>
              </div>
              <div className={`text-xs ${
                metrics.resolutionTrend.includes('↓') || metrics.resolutionTrend.includes('improvement') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.resolutionTrend}
              </div>
            </div>

            {/* SLA Compliance (%) */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  SLA Compliance
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  metrics.slaCompliance >= 98 ? 'bg-green-100' : metrics.slaCompliance >= 95 ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${
                    metrics.slaCompliance >= 98 ? 'text-green-600' : metrics.slaCompliance >= 95 ? 'text-orange-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  {metrics.slaCompliance}%
                </div>
              </div>
              <div className={`text-xs ${
                metrics.slaTrend.includes('↑') ? 'text-green-600' : metrics.slaTrend.includes('↓') ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metrics.slaTrend}
              </div>
            </div>

            {/* Automation Coverage (%) */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Automation Coverage
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  metrics.automationCoverage >= 70 ? 'bg-green-100' : metrics.automationCoverage >= 50 ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  <Bot className={`w-4 h-4 ${
                    metrics.automationCoverage >= 70 ? 'text-green-600' : metrics.automationCoverage >= 50 ? 'text-orange-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  {metrics.automationCoverage}%
                </div>
              </div>
              <div className={`text-xs ${
                metrics.automationTrend.includes('↑') ? 'text-green-600' : 'text-gray-600'
              }`}>
                {metrics.automationTrend}
              </div>
            </div>

            {/* Operational Efficiency Gain (%) */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Operational Efficiency
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  {metrics.operationalEfficiency}%
                </div>
              </div>
              <div className={`text-xs ${
                metrics.efficiencyTrend.includes('↑') || metrics.efficiencyTrend.includes('improvement') ? 'text-green-600' : 'text-gray-600'
              }`}>
                {metrics.efficiencyTrend}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Incidents (Live Issue Cards) */}
      <CriticalIssuesSection searchQuery={searchQuery} />

      <PageContainer maxWidth="7xl" padding="md">
        <div className="space-y-6">
          {/* Issue Distribution by Layer (3-Column Matrix) */}
          <div>
            <h3 className="text-gray-900 mb-4">Issue Distribution by Layer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cloud Issues */}
              <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shadow-sm">
                    <Activity className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                    dateRange === "Last 7 days" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {dateRange === "Last 7 days" ? '↓' : '↑'} {dateRange === "Last 7 days" ? '12%' : '8%'}
                  </div>
                </div>
                <h4 className="text-gray-900 mb-3 font-medium">Cloud Issues</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Total Incidents</span>
                    <span className="text-2xl text-gray-900 font-semibold">{dateRange === "Last 7 days" ? 18 : dateRange === "Last 1 month" ? 156 : 85}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Critical (P1)</span>
                    <span className="text-xl text-red-500 font-semibold">{dateRange === "Last 7 days" ? 3 : dateRange === "Last 1 month" ? 28 : 15}</span>
                  </div>
                </div>
              </div>

              {/* Application Issues */}
              <div className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shadow-sm">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                    dateRange === "Last 7 days" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {dateRange === "Last 7 days" ? '↓' : '↑'} {dateRange === "Last 7 days" ? '5%' : '15%'}
                  </div>
                </div>
                <h4 className="text-gray-900 mb-3 font-medium">Application Issues</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Total Incidents</span>
                    <span className="text-2xl text-gray-900 font-semibold">{dateRange === "Last 7 days" ? 28 : dateRange === "Last 1 month" ? 198 : 124}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Critical (P1)</span>
                    <span className="text-xl text-red-500 font-semibold">{dateRange === "Last 7 days" ? 4 : dateRange === "Last 1 month" ? 32 : 19}</span>
                  </div>
                </div>
              </div>

              {/* Account / User Issues */}
              <div className="bg-white rounded-xl border-2 border-orange-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shadow-sm">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                    dateRange === "Last 7 days" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {dateRange === "Last 7 days" ? '↓' : '↑'} {dateRange === "Last 7 days" ? '18%' : '6%'}
                  </div>
                </div>
                <h4 className="text-gray-900 mb-3 font-medium">Account / User Issues</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Total Incidents</span>
                    <span className="text-2xl text-gray-900 font-semibold">{dateRange === "Last 7 days" ? 12 : dateRange === "Last 1 month" ? 71 : 38}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Critical (P1)</span>
                    <span className="text-xl text-red-500 font-semibold">{dateRange === "Last 7 days" ? 1 : dateRange === "Last 1 month" ? 12 : 8}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Incident Severity Distribution + Incident Response Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incident Severity Distribution */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-900 mb-6 font-medium">Incident Severity Distribution</h3>
              <div className="flex items-center justify-center gap-8">
                {/* Donut Chart */}
                <div className="w-52 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { 
                            name: 'P1 (Critical)', 
                            value: dateRange === "Last 7 days" ? 8 : dateRange === "Last 1 month" ? 72 : 42,
                            percentage: dateRange === "Last 7 days" ? 14 : dateRange === "Last 1 month" ? 17 : 16,
                            color: '#ef4444'
                          },
                          { 
                            name: 'P2 (High)', 
                            value: dateRange === "Last 7 days" ? 22 : dateRange === "Last 1 month" ? 168 : 102,
                            percentage: dateRange === "Last 7 days" ? 38 : dateRange === "Last 1 month" ? 40 : 39,
                            color: '#f97316'
                          },
                          { 
                            name: 'P3 (Medium)', 
                            value: dateRange === "Last 7 days" ? 28 : dateRange === "Last 1 month" ? 185 : 103,
                            percentage: dateRange === "Last 7 days" ? 48 : dateRange === "Last 1 month" ? 43 : 45,
                            color: '#eab308'
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {[
                          { color: '#ef4444' },
                          { color: '#f97316' },
                          { color: '#eab308' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px',
                          padding: '8px 12px',
                        }}
                        formatter={(value: any, name: any, props: any) => [
                          `${value} incidents (${props.payload.percentage}%)`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">P1 (Critical)</div>
                      <div className="text-xs text-gray-500">
                        {dateRange === "Last 7 days" ? 8 : dateRange === "Last 1 month" ? 72 : 42} incidents • {dateRange === "Last 7 days" ? '14%' : dateRange === "Last 1 month" ? '17%' : '16%'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">P2 (High)</div>
                      <div className="text-xs text-gray-500">
                        {dateRange === "Last 7 days" ? 22 : dateRange === "Last 1 month" ? 168 : 102} incidents • {dateRange === "Last 7 days" ? '38%' : dateRange === "Last 1 month" ? '40%' : '39%'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">P3 (Medium)</div>
                      <div className="text-xs text-gray-500">
                        {dateRange === "Last 7 days" ? 28 : dateRange === "Last 1 month" ? 185 : 103} incidents • {dateRange === "Last 7 days" ? '48%' : dateRange === "Last 1 month" ? '43%' : '45%'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Response Metrics */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-900 mb-6 font-medium">Incident Response Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* MTTA */}
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-emerald-200">
                  <div className="text-sm text-gray-600 mb-2 font-medium">MTTA</div>
                  <div className="text-3xl text-gray-900 mb-3 font-semibold">{dateRange === "Last 7 days" ? '8' : dateRange === "Last 1 month" ? '12' : '10'} <span className="text-lg text-gray-500">min</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: dateRange === "Last 7 days" ? '85%' : dateRange === "Last 1 month" ? '70%' : '78%' }} />
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">↓ 2 min improvement</div>
                </div>

                {/* MTTR */}
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-emerald-200">
                  <div className="text-sm text-gray-600 mb-2 font-medium">MTTR</div>
                  <div className="text-3xl text-gray-900 mb-3 font-semibold">{metrics.avgResolutionTime} <span className="text-lg text-gray-500">min</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: dateRange === "Last 7 days" ? '90%' : dateRange === "Last 1 month" ? '65%' : '80%' }} />
                  </div>
                  <div className={`text-xs font-medium ${
                    metrics.resolutionTrend.includes('↓') || metrics.resolutionTrend.includes('improvement') ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {metrics.resolutionTrend}
                  </div>
                </div>

                {/* SLA Compliance (%) */}
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-emerald-200">
                  <div className="text-sm text-gray-600 mb-2 font-medium">SLA Compliance</div>
                  <div className="text-3xl text-gray-900 mb-3 font-semibold">{metrics.slaCompliance}<span className="text-lg text-gray-500">%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div className={`h-2 rounded-full transition-all ${
                      metrics.slaCompliance >= 98 ? 'bg-emerald-500' : metrics.slaCompliance >= 95 ? 'bg-orange-400' : 'bg-red-500'
                    }`} style={{ width: `${metrics.slaCompliance}%` }} />
                  </div>
                  <div className={`text-xs font-medium ${
                    metrics.slaTrend.includes('↑') ? 'text-emerald-600' : metrics.slaTrend.includes('↓') ? 'text-red-500' : 'text-gray-600'
                  }`}>
                    {metrics.slaTrend}
                  </div>
                </div>

                {/* Auto-Resolved Incidents (%) */}
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="text-sm text-gray-600 mb-2 font-medium">Auto-Resolved</div>
                  <div className="text-3xl text-gray-900 mb-3 font-semibold">{dateRange === "Last 7 days" ? '68' : dateRange === "Last 1 month" ? '52' : '58'}<span className="text-lg text-gray-500">%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: dateRange === "Last 7 days" ? '68%' : dateRange === "Last 1 month" ? '52%' : '58%' }} />
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">↑ 12% this period</div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Cloud Provider Overview + Integration Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cloud Provider Overview (Exec Version) */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-gray-900 mb-1">
                  Cloud Provider Overview
                </h3>
                <p className="text-sm text-gray-500">
                  Multi-cloud incident tracking across providers
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredCloudProviders.map((provider) => (
                  <div
                    key={provider.name}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Colored Top Bar */}
                    <div className={`h-2 ${provider.color}`} />
                    
                    {/* Card Content */}
                    <div className="p-4">
                      {/* Logo and Provider Name */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center h-10 w-10">
                          {provider.logo ? (
                            <img 
                              src={provider.logo} 
                              alt={`${provider.name} logo`}
                              className="h-10 w-10 object-contain"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
                              <Activity className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-gray-900">
                            {provider.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Cloud Provider
                          </p>
                        </div>
                      </div>
                      
                      {/* Active Incidents */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Active Incidents</span>
                        <span className="text-lg text-red-600 font-semibold">{provider.activeIncidents}</span>
                      </div>
                      
                      {/* Critical Incidents */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Critical (P1)</span>
                        <span className="text-lg text-red-700 font-semibold">{Math.floor(provider.activeIncidents * 0.2)}</span>
                      </div>
                      
                      {/* Top Impacted Service */}
                      <div className="mb-3 pb-3 border-b border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Top Impacted Service</div>
                        <div className="text-sm text-gray-900 font-medium">{provider.topService}</div>
                      </div>
                      
                      {/* Risk Indicator (R/A/G) */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Risk Status</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          provider.activeIncidents > 10 
                            ? 'bg-red-100 text-red-700' 
                            : provider.activeIncidents > 5 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {provider.activeIncidents > 10 ? 'Red' : provider.activeIncidents > 5 ? 'Amber' : 'Green'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredCloudProviders.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No cloud providers match your search</p>
                  </div>
                )}
              </div>
            </div>

            {/* Integration Tools Activity (Condensed) */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-gray-900">
                  Monitoring & Integration Tools
                </h3>
                <p className="text-sm text-gray-500">
                  Ecosystem readiness and automation status
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredIntegrationTools.length > 0 ? (
                  filteredIntegrationTools.map((tool) => (
                  <div
                    key={tool.name}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Colored Top Stroke */}
                    <div className={`h-2 ${tool.topStroke}`} />
                    
                    {/* Card Content */}
                    <div className="p-3 relative">
                      {/* Status Indicator */}
                      <div className={`absolute top-3 right-3 w-2.5 h-2.5 ${tool.statusColor} rounded-full`} />
                      
                      {/* Icon or Logo */}
                      <div className="mb-2 flex items-center justify-center h-6 w-6">
                        {tool.logo ? (
                          <img 
                            src={tool.logo} 
                            alt={`${tool.name} logo`}
                            className="h-6 w-6 object-contain"
                          />
                        ) : (
                          <div className="text-2xl">{tool.icon}</div>
                        )}
                      </div>
                      
                      {/* Tool Name */}
                      <h4 className="text-sm text-gray-900 mb-1 font-medium">
                        {tool.name}
                      </h4>
                      
                      {/* Connection Status */}
                      <p className="text-xs text-gray-600 mb-2">
                        {tool.status}
                      </p>
                      
                      {/* Incidents Detected Today */}
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Today</span>
                        <span className="text-gray-900 font-medium">{tool.incidents} incidents</span>
                      </div>
                      
                      {/* Automation Enabled */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Automation</span>
                        <span className={`font-medium ${tool.incidents > 20 ? 'text-green-600' : 'text-orange-600'}`}>
                          {tool.incidents > 20 ? 'Yes' : 'Partial'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No integration tools match your search</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Automation & Efficiency + Top Problematic Apps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Automation & Efficiency Card */}
            <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
              <div className="mb-4">
                <h3 className="text-gray-900 mb-1">Automation & Efficiency - ROI Summary</h3>
                <p className="text-sm text-gray-600">Business value delivered through intelligent automation</p>
              </div>
              
              {/* Combined Auto-Resolved & Manual Effort Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-5">
                <div className="grid grid-cols-2 gap-6 mb-5">
                  {/* Auto-Resolved Incidents */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Bot className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-4xl text-gray-900 mb-1">
                      {dateRange === "Last 7 days" ? '68' : dateRange === "Last 1 month" ? '52' : '58'}%
                    </div>
                    <div className="text-xs text-gray-600 mb-2">Auto-Resolved Incidents</div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 border text-xs">
                      AI Powered
                    </Badge>
                  </div>

                  {/* Manual Effort Reduction */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-4xl text-gray-900 mb-1">
                      {metrics.operationalEfficiency}%
                    </div>
                    <div className="text-xs text-gray-600 mb-2">Manual Effort Reduction</div>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300 border text-xs">
                      Cost Savings
                    </Badge>
                  </div>
                </div>

                {/* Combined Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Auto-Resolution Rate</span>
                      <span className="text-xs text-emerald-600 font-medium">↑ 12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: dateRange === "Last 7 days" ? '68%' : dateRange === "Last 1 month" ? '52%' : '58%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Effort Reduction</span>
                      <span className="text-xs text-emerald-600 font-medium">{metrics.efficiencyTrend}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full transition-all" style={{ width: `${metrics.operationalEfficiency}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Top 5 Problematic Applications */}
            <div className="bg-white rounded-xl border-2 border-red-200 p-6 flex flex-col">
              <div className="mb-4">
                <h3 className="text-gray-900 mb-1">Top 5 Problematic Applications</h3>
                <p className="text-sm text-gray-600">Applications with highest incident frequency</p>
              </div>
              
              <div className="space-y-3 overflow-y-auto flex-1 pr-2" style={{ maxHeight: '400px' }}>
                {filteredProblematicApps.map((app, index) => (
                  <div key={index} className={`${
                    app.color === 'red' ? 'bg-red-50 border-red-200' :
                    app.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                    'bg-amber-50 border-amber-200'
                  } border-2 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${
                          app.color === 'red' ? 'bg-red-100 text-red-700' :
                          app.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                          'bg-amber-100 text-amber-700'
                        } rounded-lg flex items-center justify-center font-semibold text-sm`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="text-gray-900 font-medium text-sm">{app.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                            <span className="bg-white px-2 py-0.5 rounded border border-gray-200">{app.cloud}</span>
                            <span className="text-gray-400">•</span>
                            <span>{app.impact} Impact</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl ${
                          app.color === 'red' ? 'text-red-700' :
                          app.color === 'orange' ? 'text-orange-700' :
                          'text-amber-700'
                        } font-semibold`}>{app.incidents}</div>
                        <div className="text-xs text-gray-500">incidents</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`text-xs font-medium ${
                        app.trend === 'up' ? 'text-red-600' : 
                        app.trend === 'down' ? 'text-emerald-600' : 
                        'text-gray-600'
                      } flex items-center gap-1`}>
                        {app.trend === 'up' && <ArrowUp className="w-3 h-3" />}
                        {app.trend === 'down' && <ArrowDown className="w-3 h-3" />}
                        {app.trend === 'up' && '+15% this week'}
                        {app.trend === 'down' && '-8% this week'}
                        {app.trend === 'stable' && 'Stable'}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs text-[#AE275F] hover:bg-[#AE275F]/10"
                      >
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredProblematicApps.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No problematic applications match your search</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}