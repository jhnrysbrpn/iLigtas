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
import { translations } from '../data/translations';

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
  language,
  t,
  broadcastPublicMode = false
}) {
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const directHotlines = [
    { group: "BFP Fire/Rescue", name: "Maypajo Substation 1", phone: "0995-637-3278", alt: "0912-358-4359", color: "bg-red-50 text-red-700 border-red-200" },
    { group: "BFP Fire/Rescue", name: "Caloocan Fire Dept", phone: "(02) 5310-6527", color: "bg-red-50 text-red-700 border-red-200" },
    { group: "BFP Fire/Rescue", name: "TXT Fire", phone: "0922-561-1111", color: "bg-red-50 text-red-700 border-red-200" },
    { group: "Barangay 35 Hall", name: "Barangay Hall Direct", phone: "(02) 8260-8842", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { group: "Barangay Staff", name: "Arnold Arenas (Ex-O)", phone: "0909-028-0292", color: "bg-amber-50 text-amber-800 border-amber-200" },
    { group: "Barangay Staff", name: "Dan Doyon (Inspector)", phone: "0928-433-2658", color: "bg-amber-50 text-amber-800 border-amber-200" },
    { group: "Barangay Staff", name: "Jacqueline Mendoza", phone: "0967-061-7738", color: "bg-amber-50 text-amber-800 border-amber-200" },
    { group: "Barangay Staff", name: "Rene Llaban (Monitor)", phone: "0956-164-9706", color: "bg-amber-50 text-amber-800 border-amber-200" },
    { group: "Medical / Rescue", name: "CCMC South Hospital", phone: "(02) 8288-7077", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { group: "Medical / Rescue", name: "CDRRMO Alert Line 1", phone: "(02) 5310-6972", alt: "0947-796-4372", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { group: "Medical / Rescue", name: "CDRRMO Alert Line 2", phone: "(02) 310-6527", alt: "0916-797-6365", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { group: "Law Enforcement", name: "NPD Caloocan Police", phone: "0905-454-2547", alt: "0998-598-7862", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { group: "Law Enforcement", name: "Traffic South Caloocan", phone: "0915-112-4731", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { group: "Welfare & Utilities", name: "Meralco Power Cutoff", phone: "16211", alt: "1622", color: "bg-yellow-50 text-yellow-800 border-yellow-200" },
    { group: "Welfare & Utilities", name: "City Social Welfare", phone: "5336-5705", color: "bg-purple-50 text-purple-700 border-purple-200" }
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
        return language === 'ph' ? 'Mamamayan (Resident)' : 'Resident';
      case 'Responder':
        return language === 'ph' ? 'Tagatugon (Responder)' : 'Responder';
      case 'SuperAdmin':
        if (currentUser && currentUser.department) {
          return `SuperAdmin [${getDeptLabel(currentUser.department)} - ID: ${currentUser.departmentId}]`;
        }
        return 'SuperAdmin';
      case 'Admin':
        if (currentUser && currentUser.department && currentUser.departmentId) {
          return `Admin [${getDeptLabel(currentUser.department)} - ID: ${currentUser.departmentId}]`;
        }
        return language === 'ph' ? 'Admin / Tagapamahala' : 'Admin';
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
        <div className="p-3 mx-4 mb-4 mt-auto rounded-2xl bg-white border border-slate-200 text-left flex flex-col min-h-0">
          <div className="flex items-center gap-1.5 mb-2 select-none border-b pb-1.5 border-slate-100">
            <span className="p-0.5 bg-red-650 text-white font-mono rounded text-[8px] font-black tracking-wide shrink-0 animate-pulse">
              HOTLINES
            </span>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight font-sans">
              Direct Dispatch Lines
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search direct dept, staff or #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-7 py-1.5 text-[10px] border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 bg-slate-50 font-medium text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-[9px] font-black text-slate-400 hover:text-slate-950 font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Scrollable list of exact hotlines */}
          <div className="overflow-y-auto space-y-1.5 pr-0.5 divide-y divide-slate-100 max-h-42.5 flex-1 scrollbar-thin">
            {directHotlines.filter(h => {
              const query = searchQuery.toLowerCase();
              return h.name.toLowerCase().includes(query) || h.phone.includes(query) || (h.alt && h.alt.includes(query)) || h.group.toLowerCase().includes(query);
            }).map((hotline, idx) => (
              <div key={idx} className="pt-1.5 first:pt-0 flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-extrabold text-slate-900 leading-tight">
                    {hotline.name}
                  </span>
                  <span className={`text-[7px] font-mono font-bold uppercase px-1 rounded hover:opacity-90 leading-none py-0.5 inline-block shrink-0 ${hotline.color}`}>
                    {hotline.group}
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex flex-wrap items-center gap-1">
                    <a
                      href={`tel:${hotline.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200/50 inline-flex items-center gap-0.5 cursor-pointer"
                      title="Tap to call"
                    >
                      <Phone className="w-2.5 h-2.5 text-emerald-650" />
                      <span>{hotline.phone}</span>
                    </a>
                    {hotline.alt && (
                      <a
                        href={`tel:${hotline.alt.replace(/[^0-9+]/g, '')}`}
                        className="text-[10px] font-mono font-black text-teal-700 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded border border-teal-200/50 inline-flex items-center gap-0.5 cursor-pointer"
                        title="Tap to call alt"
                      >
                        <Phone className="w-2.5 h-2.5 text-teal-600" />
                        <span>{hotline.alt}</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(hotline.phone)}
                      className="p-1 border border-slate-200 text-slate-405 rounded bg-slate-50 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                      title="Copy main number"
                    >
                      {copiedNumber === hotline.phone ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600 font-extrabold" />
                      ) : (
                        <Copy className="w-2.5 h-2.5 text-slate-400" />
                      )}
                    </button>
                    {hotline.alt && (
                      <button
                        onClick={() => handleCopy(hotline.alt)}
                        className="p-1 border border-slate-200 text-slate-405 rounded bg-slate-50 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                        title="Copy alternative number"
                      >
                        {copiedNumber === hotline.alt ? (
                          <Check className="w-2.5 h-2.5 text-emerald-600 font-extrabold" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 text-slate-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {directHotlines.filter(h => {
              const query = searchQuery.toLowerCase();
              return h.name.toLowerCase().includes(query) || h.phone.includes(query) || (h.alt && h.alt.includes(query)) || h.group.toLowerCase().includes(query);
            }).length === 0 && (
              <p className="text-[9px] text-slate-400 text-center py-4 font-medium uppercase font-mono">No matching direct lines</p>
            )}
          </div>
          
          <p className="text-[8px] text-slate-400 font-extrabold uppercase leading-none mt-2 text-center select-none">
            BDRRMC 35 Official Broadcast Directory
          </p>
        </div>
      </aside>
    </>
  );
}
