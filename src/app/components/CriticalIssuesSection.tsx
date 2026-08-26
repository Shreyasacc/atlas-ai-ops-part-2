import React from "react";
import { Cloud, Activity, Shield, AlertTriangle, Clock, Eye, ArrowDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface CriticalIssuesSectionProps {
  searchQuery?: string;
}

export function CriticalIssuesSection({ searchQuery = "" }: CriticalIssuesSectionProps) {
  const [hoveredDay, setHoveredDay] = React.useState<number | null>(null);

  const weekData = [
    { day: 'Mon', abbr: 'M', value: 22, x: 20, y: 27 },
    { day: 'Tue', abbr: 'T', value: 28, x: 60, y: 7 },
    { day: 'Wed', abbr: 'W', value: 19, x: 100, y: 37 },
    { day: 'Thu', abbr: 'T', value: 24, x: 140, y: 20 },
    { day: 'Fri', abbr: 'F', value: 21, x: 180, y: 30 },
    { day: 'Sat', abbr: 'S', value: 16, x: 220, y: 47 },
    { day: 'Sun', abbr: 'S', value: 18, x: 260, y: 27 }
  ];

  const criticalIssues = [
    {
      id: 1,
      title: "Payment Gateway Timeout",
      cloud: "AWS EC2",
      application: "Stripe Payment Service",
      impact: "Revenue Impact",
      eta: "15 min",
      status: "Investigating",
      statusClass: "bg-orange-100 text-orange-700 border-orange-300",
      icon: Cloud,
    },
    {
      id: 2,
      title: "Login Failure – APAC Region",
      cloud: "Auth Service",
      application: "Customer Portal App",
      impact: "Customer Impact",
      eta: "30 min",
      status: "Mitigating",
      statusClass: "bg-blue-100 text-blue-700 border-blue-300",
      icon: Activity,
    },
    {
      id: 3,
      title: "Account Lockouts Spike",
      cloud: "Azure AD",
      application: "Identity Management System",
      impact: "SLA Risk",
      eta: "20 min",
      status: "Investigating",
      statusClass: "bg-orange-100 text-orange-700 border-orange-300",
      icon: Shield,
    },
    {
      id: 4,
      title: "Order Database Latency Spike",
      cloud: "GCP Cloud SQL",
      application: "Order Processing API",
      impact: "Performance Issue",
      eta: "10 min",
      status: "Monitoring",
      statusClass: "bg-green-100 text-green-700 border-green-300",
      icon: Activity,
    },
  ];

  // Filter critical issues based on search query
  const filteredIssues = criticalIssues.filter(issue => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(query) ||
      issue.cloud.toLowerCase().includes(query) ||
      issue.application.toLowerCase().includes(query) ||
      issue.impact.toLowerCase().includes(query) ||
      issue.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Critical Issue Cards (2 columns width) */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-gray-900 font-medium">Critical Issues</h2>
              <p className="text-sm text-gray-600">
                Active critical incidents requiring immediate attention
              </p>
            </div>
            
            <div className="space-y-3">
              {filteredIssues.map((issue) => {
                const IconComponent = issue.icon;
                const cloudColorClasses = 
                  issue.cloud.includes('AWS') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  issue.cloud.includes('Auth') ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  issue.cloud.includes('Azure') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  'bg-green-50 text-green-700 border-green-200';

                return (
                  <div key={issue.id} className="group bg-white border-2 border-red-200 rounded-xl p-4 hover:border-red-400 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-red-600"></div>
                    <div className="ml-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-red-600" />
                          </div>
                          <h3 className="text-gray-900 font-medium">{issue.title}</h3>
                        </div>
                        <Badge className={`${issue.statusClass} text-xs`}>
                          {issue.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                        <span className={`px-2 py-0.5 rounded-md border font-medium ${cloudColorClasses}`}>
                          {issue.cloud}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{issue.application}</span>
                        <span className="text-gray-400">•</span>
                        <span className={`font-medium ${issue.impact.includes('Revenue') ? 'text-red-600' : issue.impact.includes('Customer') ? 'text-red-600' : issue.impact.includes('SLA') ? 'text-orange-600' : 'text-yellow-600'}`}>
                          {issue.impact}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ETA: {issue.eta}
                        </span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="text-[#AE275F] hover:bg-[#AE275F]/10 -ml-2 h-7 text-xs">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredIssues.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No critical issues match your search</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Avg Time for Resolution Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 h-full flex flex-col shadow-sm">
              <div className="mb-4">
                <h3 className="text-gray-900 font-medium mb-1">Avg Time to Resolution</h3>
                <p className="text-xs text-gray-600">(Critical Incidents)</p>
              </div>

              {/* Semi-circular Gauge */}
              <div className="flex-1 flex flex-col items-center justify-start pt-4 pb-2">
                <div className="relative w-48 h-28 mb-4">
                  {/* Background Arc */}
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid meet">
                    <path
                      d="M 20 85 A 80 80 0 0 1 180 85"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />
                    {/* Progress Arc - Emerald (under SLA) */}
                    <path
                      d="M 20 85 A 80 80 0 0 1 120 25"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />
                    {/* SLA Benchmark Line at 30 mins */}
                    <line
                      x1="100"
                      y1="25"
                      x2="100"
                      y2="10"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Center Value */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pt-2">
                    <div className="text-gray-900 font-semibold leading-none text-[20px] font-bold">18</div>
                    <div className="text-xs text-gray-500 font-medium">minutes</div>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="flex items-center gap-2 mb-3 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-medium">8 min improvement</span>
                </div>

                {/* SLA Benchmark */}
                <div className="w-full bg-white border-2 border-amber-200 rounded-xl p-2.5 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 font-medium">SLA Target:</span>
                    <span className="text-amber-700 font-semibold">30 mins</span>
                  </div>
                </div>

                {/* Micro-metrics */}
                <div className="w-full grid grid-cols-2 gap-2.5 text-xs mb-3">
                  <div className="bg-white border-2 border-emerald-200 rounded-xl p-2.5 text-center">
                    <div className="text-emerald-600 font-semibold mb-0.5">Fastest</div>
                    <div className="text-xl text-gray-900 font-semibold">6</div>
                    <div className="text-gray-500 text-xs">mins</div>
                  </div>
                  <div className="bg-white border-2 border-red-200 rounded-xl p-2.5 text-center">
                    <div className="text-red-600 font-semibold mb-0.5">Longest</div>
                    <div className="text-xl text-gray-900 font-semibold">52</div>
                    <div className="text-gray-500 text-xs">mins</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="w-full mb-3">
                  <div className="bg-white border-2 border-emerald-300 rounded-xl px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-700 font-semibold">Under SLA Target</span>
                    </div>
                  </div>
                </div>

                {/* Weekly Resolution Trend */}
                <div className="w-full bg-white border-2 border-gray-200 rounded-xl p-3">
                  <div className="text-xs text-gray-700 font-medium mb-2">7-Day Trend</div>
                  <div className="relative h-20 mb-2">
                    <svg className="w-full h-full" viewBox="0 0 280 80" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="280" y2="20" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="0" y1="40" x2="280" y2="40" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="0" y1="60" x2="280" y2="60" stroke="#f3f4f6" strokeWidth="1" />
                      
                      {/* SLA Target Line at 30 mins */}
                      <line x1="0" y1="40" x2="280" y2="40" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />
                      
                      {/* Line Graph Path */}
                      <path
                        d="M 20 27, L 60 7, L 100 37, L 140 20, L 180 30, L 220 47, L 260 27"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Area under the line */}
                      <path
                        d="M 20 27, L 60 7, L 100 37, L 140 20, L 180 30, L 220 47, L 260 27 L 260 80 L 20 80 Z"
                        fill="url(#areaGradient)"
                        opacity="0.2"
                      />
                      
                      {/* Data points with larger hover areas */}
                      {weekData.map((point, index) => (
                        <g key={index}>
                          {/* Invisible larger circle for easier hover */}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="8"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredDay(index)}
                            onMouseLeave={() => setHoveredDay(null)}
                          />
                          {/* Visible data point */}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={index === 6 ? 4 : 3}
                            fill={point.value > 25 ? "#f59e0b" : "#10b981"}
                            stroke="white"
                            strokeWidth={index === 6 ? 2 : 1.5}
                            className="pointer-events-none"
                          />
                        </g>
                      ))}
                      
                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Tooltip */}
                    {hoveredDay !== null && (
                      <div
                        className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium pointer-events-none z-10 transition-all"
                        style={{
                          left: `${(weekData[hoveredDay].x / 280) * 100}%`,
                          top: '-45px',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <div className="text-center">
                          <div className="text-white/80 text-xs">{weekData[hoveredDay].day}</div>
                          <div className="text-white font-semibold">{weekData[hoveredDay].value} mins</div>
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                    
                    {/* Day Labels */}
                    <div className="flex justify-between px-1 mt-1">
                      {weekData.map((point, index) => (
                        <span key={index} className="text-xs text-gray-500 flex-1 text-center">{point.abbr}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Resolved Today</div>
                      <div className="text-lg text-gray-900 font-semibold">12</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">This Week</div>
                      <div className="text-lg text-gray-900 font-semibold">67</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}