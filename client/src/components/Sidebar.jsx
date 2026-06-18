import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  Shield, 
  Flame, 
  Bell, 
  X, 
  PhoneCall, 
  BriefcaseMedical,
  LogIn,
  LogOut,
  UserCheck,
  Users,
  Briefcase,
  Search,
  Copy,
  Check,
  Phone
} from 'lucide-react';

export default function Sidebar({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  isOpen,
  setIsOpen,
  activeAlertsCount,
  pendingReportsCount,
  isLoggedIn,
  setIsLoggedIn,
  currentUser,
  setCurrentUser,
  setShowAuthModal,
  t = (key) => {
    const localTranslations = {
      sidebarDashboard: 'Dashboard Hub',
      sidebarMap: 'Hazard Map',
      sidebarPreparedness: 'Preparedness Hub',
      sidebarResponse: 'Evac & Recovery',
      sidebarReport: 'Report Fire Hazard',
      sidebarAlerts: 'Broadcaster Portal',
      logoutBtn: 'Sign Out',
      roleSwitcherLockInfo: 'To switch roles or update hazard levels, please log in with your authorized Barangay credentials.',
      loginBtn: 'Acknowledge & Sign In'
    };
    return localTranslations[key] || '';
  },
  broadcastPublicMode = false
}) {
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const directHotlines = [
    { group: "Barangay 35 Hall", name: "Barangay Hall Direct", phone: "(02) 8260-8842", color: "bg-orange-50 text-orange-700 border-orange-200" }
  ];

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 1500);
  };
  
  const getDeptLabel = (dept) => {
    if (!dept) return '';
    switch (dept.toLowerCase()) {
      case 'bfp': return 'Bureau of Fire Protection';
      case 'pnp': return 'PNP Maypajo';
      case 'volunteers': return 'Barangay Volunteer';
      case 'medics': return 'Health & Medics';
      case 'rescue': 
        if (currentUser && (currentUser.departmentId === 'BDRRMC-35' || currentUser.username === 'official')) {
          return 'Barangay Admin & Officials';
        }
        return 'Barangay Rescue Squad';
      default: return dept.toUpperCase();
    }
  };

  const getRoleLabel = (role) => {
    if (!role) return '';
    switch (role) {
      case 'Resident':
        return 'Resident';
      case 'Responder':
        return 'Responder';
      case 'SuperAdmin':
        if (currentUser && currentUser.department) {
          return `SuperAdmin [${getDeptLabel(currentUser.department)} - ID: ${currentUser.departmentId}]`;
        }
        return 'SuperAdmin';
      case 'Admin':
        if (currentUser && currentUser.department && currentUser.departmentId) {
          return `Admin [${getDeptLabel(currentUser.department)} - ID: ${currentUser.departmentId}]`;
        }
        return 'Admin';
      default:
        return role;
    }
  };

  // Dynamic sidebar items based on role as requested by user
  const menuItems = [];

  if (userRole === 'Resident') {
    // Resident side: They only have access to Dashboard, Hazard Map, Preparedness, Evac & Recovery
    menuItems.push(
      { id: 'dashboard', name: t('sidebarDashboard') || 'Dashboard Hub', icon: LayoutDashboard },
      { id: 'maps', name: t('sidebarMap') || 'Hazard Map', icon: Map, badge: null }
    );

    if (broadcastPublicMode) {
      menuItems.push({
        id: 'alerts',
        name: 'Broadcast',
        icon: Bell,
        badge: activeAlertsCount > 0 ? activeAlertsCount : null,
        badgeColor: 'bg-yellow-200 text-yellow-900 border border-yellow-400 animate-pulse'
      });
    }

    menuItems.push(
      { id: 'preparedness', name: t('sidebarPreparedness') || 'Preparedness Hub', icon: Shield },
      { id: 'gobag', name: 'Go Bag Planner', icon: Briefcase },
      { id: 'response', name: t('sidebarResponse') || 'Evac & Recovery', icon: BriefcaseMedical }
    );

    // Include Report Fire Hazard ONLY if currently redirected to it, so active highlight works
    if (currentTab === 'report') {
      menuItems.push({
        id: 'report',
        name: t('sidebarReport') || 'Report Fire Hazard',
        icon: AlertTriangle,
        badge: pendingReportsCount > 0 ? pendingReportsCount : null,
        badgeColor: 'bg-red-100 text-red-700 border border-red-300'
      });
    }
  } else {
    // Responders, volunteers (Official), and Admin side: Remove "Report Fire Hazard" completely!
    menuItems.push(
      { id: 'dashboard', name: t('sidebarDashboard') || 'Dashboard Hub', icon: LayoutDashboard },
      { id: 'maps', name: t('sidebarMap') || 'Hazard Map', icon: Map, badge: null },
      { id: 'interdepartment', name: 'Inter-Department Portal', icon: Users },
      { 
        id: 'alerts', 
        name: broadcastPublicMode ? 'Broadcast' : (t('sidebarAlerts') || 'Broadcaster Portal'), 
        icon: Bell, 
        badge: activeAlertsCount > 0 ? activeAlertsCount : null,
        badgeColor: 'bg-yellow-100 text-yellow-800 border border-yellow-300 animate-pulse'
      },
      { id: 'preparedness', name: t('sidebarPreparedness') || 'Preparedness Hub', icon: Shield },
      { id: 'gobag', name: 'Go Bag Planner', icon: Briefcase },
      { id: 'response', name: t('sidebarResponse') || 'Evac & Recovery', icon: BriefcaseMedical }
    );
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole('Resident');
    setCurrentTab('dashboard');
    localStorage.removeItem('bdrrmc_logged_in');
    localStorage.removeItem('bdrrmc_user');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          id="sidebar-backdrop"
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container OVERHAULED TO THE LIGHT PERIWINKLE THEME */}
      <aside 
        id="sidebar-container"
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-72 bg-[#EFF2FE] text-slate-900 border-r-2 border-slate-900/10 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between p-6 border-b border-slate-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 overflow-hidden bg-red-600 rounded-xl flex items-center justify-center border border-red-700 shadow-sm">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-950 uppercase leading-4 font-sans italic">
                Barangay 35
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#e11d48] mt-0.5 font-black font-mono">Maypajo Caloocan</p>
            </div>
          </div>
          
          <button 
            id="close-sidebar-btn"
            className="p-1 rounded text-slate-600 hover:text-slate-900 lg:hidden hover:bg-slate-200"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Authentication View */}
        <div className="p-4 mx-4 my-3 rounded-2xl bg-white border border-slate-300 space-y-3">
          {isLoggedIn && currentUser ? (
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black tracking-widest text-emerald-700 uppercase font-mono">
                  {getRoleLabel(currentUser.role).toUpperCase()} ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[9px] text-slate-500 font-extrabold font-mono uppercase">
                    {getRoleLabel(currentUser.role)}
                  </p>
                </div>
              </div>
              <button
                id="sidebar-logout-btn"
                onClick={handleLogout}
                className="w-full py-1.5 rounded-lg border border-slate-300 hover:border-red-500 hover:bg-red-50 hover:text-red-700 text-[10px] uppercase font-black tracking-wide font-mono transition-all text-slate-600 cursor-pointer"
              >
                {t('logoutBtn')}
              </button>
            </div>
          ) : (
            <div className="space-y-2 text-left">
              <p className="text-[10px] text-slate-500 leading-snug font-medium">
                {t('roleSwitcherLockInfo')}
              </p>
              <button
                id="sidebar-login-btn"
                onClick={() => setShowAuthModal(true)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-black text-[10px] uppercase rounded-lg shadow-sm font-mono tracking-wider transition-colors cursor-pointer"
              >
                {t('loginBtn')}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu Tab Indicators */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = currentTab === item.id;
            
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-black transition-all ${
                  isSelected 
                    ? 'bg-white border border-slate-300 text-slate-950 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-slate-500'}`} />
                  <span className="tracking-tight">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black font-mono leading-none ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

     {/* Barangay helpline footer */}
        <div className="p-3 mx-4 mb-4 mt-auto rounded-2xl bg-white border border-slate-200 text-left flex flex-col min-h-0 shrink-0">
          <div className="flex items-center gap-1.5 mb-2 select-none border-b pb-1.5 border-slate-100">
            <span className="p-0.5 bg-red-650 text-white font-mono rounded text-[8px] font-black tracking-wide shrink-0 animate-pulse">
              HOTLINE
            </span>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight font-sans">
              Direct Dispatch Line
            </p>
          </div>

          <div className="pt-1 select-none">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-black text-slate-950 uppercase font-sans">
                Barangay 35 Hall
              </span>
              <span className="text-[8px] font-mono font-extrabold uppercase px-1 rounded leading-none py-0.5 inline-block bg-orange-50 text-orange-700 border border-orange-200">
                Direct Line
              </span>
            </div>

            <div className="flex items-center justify-between gap-1.5">
              <a
                href="tel:0282608842"
                className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200/50 inline-flex items-center gap-1 cursor-pointer transition-colors"
                title="Tap to call"
              >
                <Phone className="w-3 h-3 text-emerald-650" />
                <span>(02) 8260-8842</span>
              </a>

              <button
                onClick={() => handleCopy("(02) 8260-8842")}
                className="p-1 border border-slate-200 text-slate-400 rounded bg-slate-50 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"
                title="Copy number"
              >
                {copiedNumber === "(02) 8260-8842" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-extrabold" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          
          <p className="text-[8px] text-slate-400 font-extrabold uppercase leading-none mt-2 text-center select-none">
            BDRRMC 35 Official Broadcast Directory
          </p>
        </div>
      </aside>
    </>
  );
}
