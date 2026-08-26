import image_d094584273e9688a35421f0c50eb1528984ff7f2 from 'figma:asset/d094584273e9688a35421f0c50eb1528984ff7f2.png';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from 'figma:asset/d094584273e9688a35421f0c50eb1528984ff7f2.png';
import { 
  ChevronRight,
  ChevronLeft,
  Home, 
  Server, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Target, 
  Zap, 
  Cloud, 
  AlertTriangle, 
  Eye, 
  Shield, 
  GitBranch,
  Package,
  FileWarning,
  Users,
  UserPlus,
  Building2,
  X,
  MessageSquare,
  Brain,
  Bell,
  Wrench,
  Bot,
  PieChart,
  Wallet,
  TrendingDown,
  ListChecks,
  FileText,
  Network
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Sheet, SheetContent } from '../ui/sheet';

interface SideNavigationProps {
  onNavigate?: (page: string, view?: 'incidents' | 'whitenoise') => void;
  externalCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  currentPage?: string;
}

/**
 * SideNavigation Component - Responsive side navigation
 * Responsive:
 * - Mobile (< 768px): Sheet/Drawer overlay
 * - Tablet (768px - 1024px): Collapsed by default with expand option
 * - Desktop (>= 1024px): Full side nav with collapse toggle
 */
export function SideNavigation({ onNavigate, externalCollapsed, onCollapsedChange, currentPage }: SideNavigationProps = {}) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('Overview');
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Update active item based on current page
  useEffect(() => {
    if (currentPage === 'anomaly-detection') {
      setActiveItem('Anomaly Detection');
    } else if (currentPage === 'rca') {
      setActiveItem('RCA');
    } else if (currentPage === 'alerting') {
      setActiveItem('Alerting');
    } else if (currentPage === 'predictive-maintenance') {
      setActiveItem('Predictive Maintenance');
    } else if (currentPage === 'agent') {
      setActiveItem('Agent');
    } else if (currentPage === 'fin-ops' || currentPage === 'Overview') {
      setActiveItem('Overview');
      setExpandedMenu('FinOps');
    } else if (currentPage === 'Cloud Services') {
      setActiveItem('Cloud Services');
      setExpandedMenu('FinOps');
    } else if (currentPage === 'Budgets' || currentPage === 'fin-ops-budgets') {
      setActiveItem('Budgets');
      setExpandedMenu('FinOps');
    } else if (currentPage === 'Savings & Commitments') {
      setActiveItem('Savings & Commitments');
      setExpandedMenu('FinOps');
    } else if (currentPage === 'Reports') {
      setActiveItem('Reports');
      setExpandedMenu('FinOps');
    } else if (currentPage === 'dashboard') {
      setActiveItem('Analytics Hub');
    } else if (currentPage === 'inventory') {
      setActiveItem('Inventory');
    } else if (currentPage === 'user-management') {
      setActiveItem('User Management');
    } else if (currentPage === 'integration-tool') {
      setActiveItem('Integration Tool');
    }
  }, [currentPage]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync external collapsed state with mobile drawer
  useEffect(() => {
    if (isMobile && externalCollapsed === false) {
      // When menu button is clicked (externalCollapsed becomes false), open drawer
      setIsMobileOpen(true);
    }
  }, [externalCollapsed, isMobile]);
  
  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const handleCollapsedChange = (collapsed: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    } else {
      setInternalCollapsed(collapsed);
    }
    // Close mobile drawer when toggling
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const toggleMenu = (label: string) => {
    if (expandedMenu === label) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(label);
    }
  };

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    
    // Handle navigation
    if (onNavigate) {
      if (label === 'Anomaly Detection') {
        onNavigate('anomaly-detection');
      } else if (label === 'RCA' || label === 'Overview') {
        // Check which menu is expanded to determine context
        if (expandedMenu === 'RCA') {
          onNavigate('rca');
        } else if (expandedMenu === 'FinOps') {
          onNavigate('fin-ops');
        } else {
          onNavigate('rca');
        }
      } else if (label === 'Syslog Reviewer') {
        onNavigate('rca-syslog');
      } else if (label === 'Pattern Detection') {
        onNavigate('rca-pattern-detection');
      } else if (label === 'Alerting') {
        onNavigate('alerting');
      } else if (label === 'Predictive Maintenance') {
        onNavigate('predictive-maintenance');
      } else if (label === 'Agent') {
        onNavigate('agent');
      } else if (label === 'FinOps') {
        onNavigate('fin-ops');
      } else if (label === 'Cloud Services') {
        onNavigate('fin-ops-cloud-services');
      } else if (label === 'Budgets') {
        onNavigate('fin-ops-budgets');
      } else if (label === 'Savings & Commitments') {
        onNavigate('fin-ops-savings');
      } else if (label === 'Reports') {
        onNavigate('fin-ops-reports');
      } else if (label === 'Analytics Hub') {
        onNavigate('dashboard');
      } else if (label === 'Inventory') {
        onNavigate('inventory');
      } else if (label === 'User Management') {
        onNavigate('user-management');
      } else if (label === 'Integration Tool') {
        onNavigate('integration-tool');
      }
    }

    // Close mobile drawer after navigation
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const menuSections = [
    {
      title: 'AI-OPS',
      items: [
        {
          label: 'Anomaly Detection',
          icon: Eye,
          hasDropdown: false,
        },
        {
          label: 'RCA',
          icon: Brain,
          hasDropdown: true,
          subItems: [
            { label: 'Overview', icon: ListChecks },
            { label: 'Syslog Reviewer', icon: FileText },
            { label: 'Pattern Detection', icon: Network },
          ],
        },
        {
          label: 'Alerting',
          icon: Bell,
          hasDropdown: false,
        },
        {
          label: 'Predictive Maintenance',
          icon: Wrench,
          hasDropdown: false,
        },
        {
          label: 'Agent',
          icon: Bot,
          hasDropdown: false,
        },
        {
          label: 'FinOps',
          icon: DollarSign,
          hasDropdown: true,
          subItems: [
            { label: 'Overview', icon: PieChart },
            { label: 'Cloud Services', icon: Cloud },
            { label: 'Budgets', icon: Wallet },
            { label: 'Savings & Commitments', icon: TrendingDown },
            { label: 'Reports', icon: BarChart3 },
          ],
        },
      ],
    },
  ];

  // Render navigation content
  const NavContent = ({ isMobileView = false }: { isMobileView?: boolean }) => (
    <div className={`${!isMobileView && (isCollapsed ? 'w-20' : 'w-64')} h-full bg-white flex flex-col shadow-sm transition-all duration-300 relative`}>
      {/* Toggle Button - Desktop Only */}
      {!isMobileView && (
        <button
          onClick={() => handleCollapsedChange(!isCollapsed)}
          className="absolute -right-3 top-8 z-10 w-6 h-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-md transition-all hidden lg:flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Logo Section */}
      <div className={`px-4 sm:px-6 py-4 sm:py-6 ${isCollapsed && !isMobileView ? 'flex justify-center' : ''}`}>
        {isCollapsed && !isMobileView ? (
          <img src={image_d094584273e9688a35421f0c50eb1528984ff7f2} alt="Xoriant" className="h-8 w-8 px-[1px] py-[0px]" />
        ) : (
          <img src={image_d094584273e9688a35421f0c50eb1528984ff7f2} alt="Xoriant" className="h-7 sm:h-8" />
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2">
        <TooltipProvider>
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'mt-6' : ''}>
              {/* Section Title */}
              {!isCollapsed || isMobileView ? (
                <div className="px-3 mb-3">
                  <h3 className="text-gray-900 text-xs sm:text-sm uppercase tracking-wide">{section.title}</h3>
                </div>
              ) : null}

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isExpanded = expandedMenu === item.label;
                  const isActive = activeItem === item.label;

                  if (isCollapsed && !isMobileView) {
                    // Collapsed state - show only icons with tooltips
                    return (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              if (!item.hasDropdown) {
                                handleItemClick(item.label);
                              } else {
                                handleCollapsedChange(false);
                                toggleMenu(item.label);
                              }
                            }}
                            className={`w-full flex items-center justify-center px-3 py-2.5 rounded-lg transition-all relative ${
                              isActive && !item.hasDropdown
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-primary-50'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            {/* Active Indicator */}
                            {isActive && !item.hasDropdown && (
                              <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-full" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <div key={item.label}>
                      {/* Main Item */}
                      <button
                        onClick={() => {
                          if (item.hasDropdown) {
                            toggleMenu(item.label);
                          } else {
                            handleItemClick(item.label);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all relative group ${
                          isActive && !item.hasDropdown
                            ? 'text-primary-600'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                          <span className="text-xs sm:text-sm truncate">{item.label}</span>
                        </div>
                        {item.hasDropdown && (
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4 shrink-0" />
                          </motion.div>
                        )}
                        
                        {/* Active Indicator */}
                        {isActive && !item.hasDropdown && (
                          <motion.div
                            layoutId={isMobileView ? "activeIndicatorMobile" : "activeIndicator"}
                            className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </button>

                      {/* Dropdown Items */}
                      <AnimatePresence>
                        {item.hasDropdown && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-6 sm:ml-8 mt-1 space-y-1">
                              {item.subItems?.map((subItem, index) => {
                                if (subItem.type === 'separator') {
                                  return (
                                    <div
                                      key={`separator-${index}`}
                                      className="my-2 border-t border-gray-200"
                                    />
                                  );
                                }

                                if (subItem.type === 'header') {
                                  return (
                                    <div
                                      key={`header-${index}`}
                                      className="px-3 py-1.5 text-xs text-gray-500 uppercase tracking-wider"
                                    >
                                      {subItem.label}
                                    </div>
                                  );
                                }

                                const SubIcon = subItem.icon;
                                const isSubActive = activeItem === subItem.label;

                                return (
                                  <button
                                    key={subItem.label}
                                    onClick={() => handleItemClick(subItem.label)}
                                    className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg transition-all relative ${
                                      isSubActive
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                  >
                                    {SubIcon && <SubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
                                    <span className="text-xs sm:text-sm truncate">{subItem.label}</span>
                                    
                                    {/* Active Indicator for sub-items */}
                                    {isSubActive && (
                                      <motion.div
                                        layoutId={isMobileView ? "activeIndicatorMobile" : "activeIndicator"}
                                        className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* Footer */}
      {(!isCollapsed || isMobileView) && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">@Xoriant 2025</p>
        </div>
      )}
    </div>
  );

  // On mobile, use Sheet (Drawer)
  if (isMobile) {
    return (
      <Sheet open={isMobileOpen} onOpenChange={(open) => {
        setIsMobileOpen(open);
        // When drawer closes, notify parent to update collapsed state
        if (!open && onCollapsedChange) {
          onCollapsedChange(true);
        }
      }}>
        <SheetContent side="left" className="p-0 w-64 sm:w-72">
          <NavContent isMobileView={true} />
        </SheetContent>
      </Sheet>
    );
  }

  // On desktop/tablet, use fixed sidebar
  return <NavContent />;
}