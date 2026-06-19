import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Users, 
  MapPin, 
  CheckSquare, 
  AlertTriangle, 
  Megaphone, 
  Clock, 
  PlusCircle,
  Activity, 
  Package, 
  PhoneCall,
  Search,
  Check,
  ChevronRight,
  Shield,
  BriefcaseMedical,
  FileSpreadsheet,
  AlertOctagon
} from 'lucide-react';
import { IncidentStatus, IncidentCategory } from '../types';

export default function DashboardView({
  userRole,
  currentUser,
  setCurrentTab,
  alerts,
  reports,
  evacuationCenters,
  programs,
  stockpileItems,
  onAddComment,
  onUpdateReportStatus,
  onQuickBroadcast,
  onDeleteReport
}) {
  
  // States
  const [filterStatus, setFilterStatus] = useState('All');
  const [reportSearch, setReportSearch] = useState('');
  
  // Modal controllers
  const [showGoBagModal, setShowGoBagModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [tempStatus, setTempStatus] = useState('Pending');
  
  // Custom assistance forms
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [damageName, setDamageName] = useState('');
  const [damageAddress, setDamageAddress] = useState('');
  const [damageAmount, setDamageAmount] = useState('');
  const [damageFormSuccess, setDamageFormSuccess] = useState(false);

  const [showReliefTracker, setShowReliefTracker] = useState(false);

  // Comments / Live community tracker state
  const [expandedTrackerId, setExpandedTrackerId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Interactive Go-bag items state pre-populated
  const [goBagProgress, setGoBagProgress] = useState({
    'water': true,
    'food': true,
    'radio': false,
    'firstaid': true,
    'flashlight': false,
    'whistle': true,
    'documents': false,
    'extinguisher': false
  });

  // Simple Mode Indicator (for gadget-free people)
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [easySosSent, setEasySosSent] = useState(false);

  const toggleGoBagItem = (key) => {
    setGoBagProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(goBagProgress).filter(Boolean).length;
  const totalGoBagItems = Object.keys(goBagProgress).length;
  const progressPercent = Math.round((completedCount / totalGoBagItems) * 100);

  // Disaster program registers
  const [registeredProgramsState, setRegisteredProgramsState] = useState({});
  const [registeringProgramId, setRegisteringProgramId] = useState(null);
  const [registerName, setRegisterName] = useState('');

  const triggerRegisterForProgramLocal = (progId) => {
    setRegisteringProgramId(progId);
    setRegisterName('');
  };

  const submitRegisterLocal = (e) => {
    e.preventDefault();
    if (!registerName.trim() || !registeringProgramId) return;
    setRegisteredProgramsState(prev => ({ ...prev, [registeringProgramId]: true }));
    setRegisteringProgramId(null);
  };

  // Quick damage form submit
  const handleDamageSubmit = (e) => {
    e.preventDefault();
    if (!damageName || !damageAddress) return;
    setDamageFormSuccess(true);
    setTimeout(() => {
      setDamageFormSuccess(false);
      setShowDamageForm(false);
      setDamageName('');
      setDamageAddress('');
      setDamageAmount('');
    }, 3000);
  };

  // Filter and search calculations
  const filteredReports = reports.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch = r.title.toLowerCase().includes(reportSearch.toLowerCase()) || 
                          r.locationName.toLowerCase().includes(reportSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div id="main-dashboard-wrapper" className="space-y-10 selection:bg-red-500 selection:text-white pb-16">
      
      {/* 🚀 SENIOR CITIZENS & EMERGENCY SIMULATION HELP TOGGLE */}
      <div 
        id="simplified-assistance-banner"
        className="bg-red-600 outline-3 outline-red-700/60 p-5 rounded-3xl text-white shadow-lg space-y-4 shadow-red-900/10"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl">
              <PhoneCall className="w-8 h-8 text-white animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-black bg-white/20 px-2.5 py-0.5 rounded-full">{"HELP FOR NON-TECH USERS"}</span>
              <h3 className="text-xl font-bold tracking-tight mt-1">{"Struggling with gadgets or internet?"}</h3>
              <p className="text-xs text-red-100 max-w-xl">
                {"We have prepared our emergency support protocol for senior residents and non-tech users. Click easy mode or use our direct emergency help hotlines!"}
              </p>
            </div>
          </div>
          
          <button
            id="toggle-simple-layout-btn"
            onClick={() => setIsSimpleMode(!isSimpleMode)}
            className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-950 font-black text-xs uppercase px-5 py-3 rounded-full border-2 border-white/20 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            {isSimpleMode ? ("✨ Back to Standard Map Portal") : ("🚨 Turn on Big Text / Easy Mode")}
          </button>
        </div>

        {/* Simplified View Contents */}
        {(isSimpleMode) && (
          <div id="simple-guidance-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-white/10 animate-fade-in text-white">
            <div className="bg-black/15 p-4 rounded-2xl space-y-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">{"📞 Hotlines (Call Now)"}</h4>
              <p className="text-xs">{"No internet required! Save these on any old analog mobile phone:"}</p>
              <div className="space-y-1 mt-2">
                <p className="text-sm font-bold">{"Maypajo Fire Station"}: <span className="p-1 px-1.5 bg-red-700 rounded text-[13px] font-mono tracking-wider ml-1">0917-BFP-LINE</span></p>
                <p className="text-sm font-bold">{"Barangay 35 Office"}: <span className="p-1 px-1.5 bg-red-700 rounded text-[13px] font-mono tracking-wider ml-1">(02) 8281-9111</span></p>
                <p className="text-sm font-bold">{"Barangay Health Clinic"}: <span className="p-1 px-1.5 bg-red-700 rounded text-[13px] font-mono tracking-wider ml-1">0918-HEALTH-35</span></p>
              </div>
            </div>

            <div className="bg-black/15 p-4 rounded-2xl space-y-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">{"📢 Traditional Fire Whistle Signals"}</h4>
              <p className="text-xs">{"If smoke is sighted and phones are unavailable, blow your emergency WHISTLE repeatedly:"}</p>
              <ul className="text-xs list-disc pl-4 space-y-1 mt-1 text-red-50 font-mono">
                <li>{"3 Short Blasts: Spark or gas/LPG leak detected."}</li>
                <li>{"Continuous Long Blasts: FIRE SIGHTED! EVACUATE immediately!"}</li>
              </ul>
            </div>

            <div className="bg-black/15 p-4 rounded-2xl space-y-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">{"🚒 One-Click Automatic Fire SOS"}</h4>
              <p className="text-xs">{"If you cannot write or search, press this giant red button right away to call fire responders."}</p>
              {easySosSent ? (
                <div className="bg-[#052e16]/80 border-2 border-emerald-500 rounded-xl p-3 text-center space-y-1 animate-pulse">
                  <p className="font-extrabold text-[#10B981] uppercase text-[11px] tracking-wider leading-tight">🚒 DISPATCH TRIGGERED!</p>
                  <p className="text-[10px] text-white/90">Barangay engine & water tanker are dispatched to Maypajo Puroks.</p>
                </div>
              ) : (
                <button
                  id="simple-instant-sos-btn"
                  onClick={() => {
                    setEasySosSent(true);
                    setTimeout(() => setEasySosSent(false), 6000);
                  }}
                  className="w-full bg-yellow-400 text-slate-950 font-black py-2.5 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all text-xs tracking-wider uppercase shadow-md mt-2 flex items-center justify-center gap-2 border-2 border-slate-950 cursor-pointer"
                >
                  <Flame className="w-5 h-5 text-red-600 animate-pulse fill-red-600" />
                  {"PRESS TO CALL FIRE TRUCK"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 1. BRANDING HERO BANNER: CUSTOM FIRE SAFETY HERO BANNER POSTER */}
      <div className="relative w-full h-50 xs:h-[250px] sm:h-85 md:h-107.5 mb-16 select-none">
        {/* Rounded Border Background Container */}
        <section
          className="w-full h-full rounded-2xl md:rounded-3xl border-2 border-slate-950/60 overflow-hidden bg-[url('/src/assets/images/HeroSectionBG.png')] bg-cover bg-[50%50%] bg-no-repeat shadow-xl"
          aria-label="Report an issue hero section"
        >
          {/* We do not overflow-hidden the outer parent so the button below can hang off of it! */}
        </section>

        {/* Custom Hanging Button overlaps the bottom of the section */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex h-22 w-[466.5px] bg-[url(https://c.animaapp.com/NY6mIFxF/img/btn-shadow.svg)] bg-position-[100%_100%] z-10 scale-[0.55] xs:scale-[0.65] sm:scale-[0.85] md:scale-100 origin-bottom">
          <button
            type="button"
            onClick={() => setCurrentTab('report')}
            className="ml-5.75 mt-0.5 flex h-18 w-105 items-center justify-center bg-[url(https://c.animaapp.com/NY6mIFxF/img/btn-holder.svg)] bg-position-[100%_100%] cursor-pointer active:scale-95 transition-all text-white"
            aria-label="Report an issue"
          >
            <span className="relative ml-7 h-12 w-73">
              <span className="absolute left-0 top-[calc(50.00%-24px)] inline-flex h-11.5 w-11.5 items-center justify-center">
                <img
                  className="aspect-[1] h-11.5 w-11.5"
                  alt=""
                  aria-hidden="true"
                  src="https://c.animaapp.com/NY6mIFxF/img/ant-design-alert-twotone.svg"
                  referrerPolicy="no-referrer"
                />
              </span>
              <span className="absolute left-[calc(50.00%-100px)] top-[calc(50.00%-14px)] w-61 whitespace-nowrap text-center font-['Jersey_25',Helvetica] text-[35px] font-normal leading-[normal] tracking-normal text-white">
                REPORT AN ISSUE
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* 2. FIRE PREPAREDNESS PROGRAMS */}
      <section id="preparedness-programs-section" className="space-y-4 pt-4">
        <h2 className="font-extrabold italic uppercase text-slate-950 text-2xl tracking-tight text-left">
          {"Fire Preparedness Programs"}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.slice(0, 4).map((prog, index) => {
            const hasRegistered = registeredProgramsState[prog.id];

            return (
              <div 
                key={prog.id} 
                className="bg-[#EFF2FE]/65 border-2 border-slate-900/15 rounded-3xl overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:shadow-md transition-all"
              >
                {/* Poster Graphic Header */}
                <div className="relative aspect-4/3 bg-linear-to-br from-[#EA580C] via-[#FF6302] to-[#B83D00] overflow-hidden flex flex-col justify-between p-3 border-b-2 border-slate-900/10">
                  {/* Logos Group */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 scale-90 origin-left">
                      <span className="w-4 h-4 rounded-full bg-yellow-400 border border-slate-950 flex items-center justify-center text-[8px]">🚒</span>
                      <span className="w-4 h-4 rounded-full bg-red-600 border border-slate-950 flex items-center justify-center text-[8px]">🔥</span>
                    </div>
                    <span className="text-[7.5px] font-mono font-black text-slate-950 bg-white/95 px-1 py-0.2 rounded border border-slate-950 scale-90 origin-right uppercase">
                      BFP COMMAND • BRGY 35
                    </span>
                  </div>

                  {/* Dynamic Poster Text */}
                  <div className="my-auto text-center px-1">
                    <h4 className="text-xs sm:text-[13px] font-black text-white uppercase tracking-tight drop-shadow-[0_2px_2.5px_rgba(0,0,0,0.95)] leading-tight italic">
                      {prog.title === 'Barangay Fire Response Training' && "BASIC SKILLS AND RESPONDER TRAINING"}
                      {prog.title === 'Quarterly Fire Awareness Seminar by BFP' && "FIRE SAFETY SEMINAR AND DRILL"}
                      {prog.title === 'Fire Safety Seminar: Prevent Hazards In Your Business' && "FIRE SAFETY IN BUSINESS"}
                      {prog.title === 'Fire Safety Drill Seminar and Fire Drill - June 2, 2026' && "FIRE DRILL SEMINAR"}
                    </h4>
                  </div>

                  {/* Footer overlay */}
                  <div className="flex items-center justify-between text-[6px] font-mono scale-90 origin-bottom-left">
                    <span className="text-red-100 font-bold">EMERGENCY: 911</span>
                    <span className="bg-slate-950 text-white px-1 py-0.2 rounded uppercase font-black text-[5.5px]">CALOOCAN BFP</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-[#F8FAFC]/50 text-left">
                  <div className="space-y-2">
                    {/* Centered Rounded title block */}
                    <div className="bg-[#E2E8F0] border border-slate-300 rounded-xl p-2.5 text-center mt-1 select-none">
                      <h3 className="text-xs sm:text-[13px] font-black leading-snug text-slate-950 uppercase tracking-tight">
                        {prog.title}
                      </h3>
                    </div>
                    
                    <p className="text-[11px] text-slate-700 leading-relaxed min-h-12.5 line-clamp-3">
                      {prog.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-mono space-y-0.5">
                      <p><b>{"Hosted by"}:</b> {prog.host}</p>
                      <p><b>{"Date"}:</b> {prog.date}</p>
                      <p><b>{"Time"}:</b> {prog.time}</p>
                      <p><b>{"Location"}:</b> {prog.location}</p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="text-[10px] font-bold text-slate-600 font-mono">
                      👥 {prog.registrantsCount + (hasRegistered ? 1 : 0)} joined
                    </span>
                    
                    {hasRegistered ? (
                      <span className="p-1 px-2.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold font-mono text-[10px] flex items-center gap-1 border border-emerald-500/20">
                        <Check className="w-3 h-3" /> Already Joined
                      </span>
                    ) : (
                      <button
                        onClick={() => triggerRegisterForProgramLocal(prog.id)}
                        className="p-1 px-3 bg-[#E5E9FA] hover:bg-slate-950 hover:text-white text-slate-900 border border-slate-400 hover:border-slate-950 rounded-lg font-bold font-mono text-[10px] uppercase transition-colors cursor-pointer"
                      >
                        {"Register / Support Now"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. RECENT REPORTS (LEFT) & EARLY FIRE WARNINGS (RIGHT) */}
      <div id="split-layout-reports-warnings" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT REPORTS CARD (2 COLS) */}
        <div className="lg:col-span-2 bg-[#E5E9FA] border-2 border-slate-900/15 p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-900/10">
            <h2 className="font-extrabold italic uppercase text-slate-950 text-xl tracking-tight">
              {"Recent Reports"}
            </h2>
            
            {/* Search Box & Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-700" />
                <input
                  type="text"
                  placeholder={"Search reports..."}
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  className="w-full sm:w-48 bg-[#F0F2FC] border border-slate-300 text-xs py-2 pl-8 pr-3 rounded-full text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Status Select Filter button */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#F0F2FC] border border-slate-300 text-xs py-2 px-3 h-auto whitespace-normal break-words rounded-full font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none w-full sm:w-auto min-w-[120px] max-w-full cursor-pointer hover:bg-[#e4e7f8]"
              >
                <option value="All">{"All Status"}</option>
                <option value="Pending">{"Pending"}</option>
                <option value="Verified">{"Verified"}</option>
                <option value="Dispatched">{"Dispatched"}</option>
                <option value="Resolved">{"Resolved"}</option>
              </select>
            </div>
          </div>

          {/* Table / Grid list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead>
                <tr className="border-b border-slate-900/10 text-[10px] font-mono tracking-wider uppercase text-slate-700 font-bold">
                  <th className="py-2.5 w-1/2 font-mono">{"REPORT TICKET"}</th>
                  <th className="py-2.5 font-mono">{"LOCATION"}</th>
                  <th className="py-2.5 text-right font-mono">{"STATUS"}</th>
                  {userRole === 'Admin' && <th className="py-2.5 text-right font-mono w-20">ACTIONS</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/10">
                {filteredReports.map((rep) => {
                  
                  // Color codes for status
                  let statusBg = 'bg-slate-200 text-slate-700';
                  if (rep.status === IncidentStatus.VERIFIED) statusBg = 'bg-amber-100 text-amber-800 border border-amber-400/20';
                  if (rep.status === IncidentStatus.DISPATCHED) statusBg = 'bg-red-100 text-red-800 border border-red-400/20 animate-pulse';
                  if (rep.status === IncidentStatus.RESOLVED) statusBg = 'bg-emerald-100 text-emerald-800 border border-emerald-400/20';

                  const isStaff = userRole === 'Admin';
                  return (
                    <tr 
                      key={rep.id} 
                      className={`hover:bg-slate-950/5 group transition-colors ${isStaff ? 'cursor-pointer' : 'cursor-default'}`}
                      onClick={() => {
                        if (isStaff) {
                          setShowStatusModal(rep.id);
                          setTempStatus(rep.status);
                        }
                      }}
                    >
                      <td className="py-3 pr-4 text-left">
                        <div className="font-bold text-slate-950">{rep.title}</div>
                        <div className="text-[10px] text-slate-700 mt-0.5 font-mono">
                          🚨 {rep.id} • {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3 text-slate-700 font-medium text-left">
                        {rep.locationName}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-block p-1 px-2.5 rounded text-[10px] uppercase font-black tracking-wider ${statusBg}`}>
                          {rep.status}
                        </span>
                      </td>
                      {userRole === 'Admin' && (
                        <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onDeleteReport && onDeleteReport(rep.id)}
                            className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-black rounded border border-red-205 transition-colors text-[10px] uppercase font-mono"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}

                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={userRole === 'Admin' ? 4 : 3} className="text-center py-8 text-slate-700 font-bold italic font-sans">
                      {"No fire hazard reports match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* EARLY FIRE WARNINGS CARD (1 COL) */}
        <div className="bg-[#E5E9FA] border-2 border-slate-900/15 p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4 shadow-sm text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900/10">
              <h2 className="font-extrabold italic uppercase text-slate-950 text-xl tracking-tight">
                {"Early Fire Warnings"}
              </h2>
              <span className="p-1 px-2.5 bg-red-100 text-red-700 font-extrabold text-[10px] rounded uppercase font-mono tracking-widest block">
                {"Active Alerts"}
              </span>
            </div>

            {/* List of Warnings */}
            <div className="space-y-3 max-h-72.5 overflow-y-auto pr-1">
              {alerts.filter(a => a.isActive).map((alert) => (
                <div 
                  key={alert.id}
                  className="p-3.5 bg-white border border-slate-300 rounded-xl space-y-1.5 hover:border-slate-500 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-orange-600 tracking-wider font-mono">
                      🚨 {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(alert.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {alert.message}
                  </p>
                  <div className="pt-1.5 flex items-center gap-1 text-[10px] text-slate-600 font-mono">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span>Area: {alert.affectedArea}</span>
                  </div>
                </div>
              ))}

              {alerts.filter(a => a.isActive).length === 0 && (
                <div className="text-center py-10 text-slate-500 italic text-xs font-bold font-mono">
                  {"No active fire warning alerts at the moment."}
                </div>
              )}
            </div>
          </div>

          {/* Go Bag Planner Activation Box */}
          {userRole === 'Resident' && (
            <button
              id="open-gobag-planner-btn"
              onClick={() => setCurrentTab('gobag')}
              className="w-full bg-[#EAEDFC] hover:bg-slate-950 hover:text-white text-slate-900 font-extrabold py-3.5 px-4 rounded-xl border border-slate-400 hover:border-slate-950 transition-colors text-xs tracking-wider uppercase shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />
              {"Go BAG Planner"}
            </button>
          )}
        </div>
      </div>

      {/* 5. COMMUNITY DASHBOARD WITH ASSISTANCE CONTROLS */}
      <section id="community-dashboard-card" className="space-y-4">
        <h2 className="font-extrabold italic uppercase text-slate-950 text-2xl tracking-tight">
          Community Dashboard
        </h2>
        
        <div className="bg-[#E5E9FA] border-2 border-slate-900/15 p-5 sm:p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-600 tracking-wider font-mono">INCIDENT LOGS & ASSISTANCE</span>
            <hr className="mt-1.5 border-slate-900/10" />
          </div>

          <div className="flex flex-col gap-4">
            
            {/* ITEM 1: MY REPORTS TRACKER */}
            {userRole === 'Resident' && (
              <div className="p-4 bg-white border border-slate-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-md font-extrabold text-slate-900 italic uppercase">
                    My Reports Tracker
                  </h3>
                  <p className="text-xs text-slate-700 max-w-xl leading-relaxed mt-1">
                    Follow and check real-time action status of fire hazards or electric wire dangers you logged to your local Purok officer.
                  </p>
                  {/* Visual log helper */}
                  <div className="flex gap-2.5 mt-2.5 text-[10px] font-mono text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1">🔴 Report Filed</span>
                    <span>➜</span>
                    <span className="flex items-center gap-1 font-bold">🟡 Verified by Brgy</span>
                    <span>➜</span>
                    <span className="flex items-center gap-1">🟢 Solved</span>
                  </div>
                </div>
                <button
                  id="track-my-record-btn"
                  onClick={() => {
                    setCurrentTab('report');
                  }}
                  className="text-xs px-4 py-2 font-mono font-bold border border-slate-400 bg-[#EFF2FE] hover:bg-slate-950 hover:text-white rounded-lg transition-colors shrink-0"
                >
                  Track My Record
                </button>
              </div>
            )}

            {/* ITEM 2: LIVE COMMUNITY FIRE TRACKER */}
            <div className="p-4 bg-white border border-slate-300 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-md font-extrabold text-slate-900 italic uppercase">
                    Live Community Fire Tracker
                  </h3>
                  <p className="text-xs text-slate-700 max-w-xl leading-relaxed mt-1">
                    Monitor ongoing BFP firetruck dispatch statuses, on-scene comments, line closures, and water tank refill completions.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    const firstActive = reports.find(r => r.status !== IncidentStatus.RESOLVED);
                    if (firstActive) {
                      setExpandedTrackerId(expandedTrackerId === firstActive.id ? null : firstActive.id);
                    } else if (reports.length > 0) {
                      setExpandedTrackerId(expandedTrackerId === reports[0].id ? null : reports[0].id);
                    }
                  }}
                  className="text-xs px-4 py-2 font-mono font-bold border border-slate-400 bg-[#EFF2FE] hover:bg-slate-950 hover:text-white rounded-lg transition-colors shrink-0"
                >
                  {expandedTrackerId ? 'Hide Logs' : 'View Dispatch Streams'}
                </button>
              </div>

              {expandedTrackerId && (
                <div className="p-3 bg-slate-50 border border-slate-250 rounded-xl space-y-3 animate-fade-in text-slate-800">
                  {reports.filter(r => r.id === expandedTrackerId).map(report => (
                    <div key={report.id} className="space-y-3 text-xs">
                      <div className="flex justify-between font-bold border-b pb-2 font-mono uppercase text-slate-900">
                        <span>🚨 ACTIVE STREAM: {report.title}</span>
                        <span className="text-red-600 font-extrabold animate-pulse">● {report.status}</span>
                      </div>
                      <p><b>Reporter:</b> {report.reporterName} ({report.reporterPhone})</p>
                      <p><b>Detailed notes:</b> {report.description}</p>

                      {report.fireAlarmLevel && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 p-2.5 bg-indigo-50/40 border border-slate-200 rounded-xl font-mono text-[10px] text-slate-900 shadow-3xs">
                          <div>
                            <span className="font-black uppercase text-rose-600 block">🚨 Fire Alarm Level</span>
                            <span className="font-bold text-slate-900">{report.fireAlarmLevel}</span>
                          </div>
                          <div>
                            <span className="font-black uppercase text-blue-600 block">💧 Water level supply</span>
                            <span className="font-bold text-slate-900">{report.waterLevel}</span>
                          </div>
                          <div>
                            <span className="font-black uppercase text-amber-600 block">⚠️ Task Urgency</span>
                            <span className="font-bold text-slate-900">{report.taskUrgency}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2 mt-3 pt-2 border-t">
                        <p className="font-bold font-mono uppercase tracking-wide text-slate-700">Dispatch Update Stream:</p>
                        {report.comments.map(c => (
                          <div key={c.id} className="p-2 bg-white rounded-lg border border-slate-200">
                            <div className="flex justify-between font-bold font-mono text-[10px] text-slate-600">
                              <span>🚒 {c.author} ({c.role})</span>
                              <span>{new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                            </div>
                            <p className="mt-1 text-slate-800 text-[11px] leading-relaxed">{c.text}</p>
                          </div>
                        ))}

                        <div className="flex gap-2 pt-1 w-full">
                          <input
                            type="text"
                            placeholder="Add emergency feedback notes here..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="bg-white border rounded-lg text-xs p-2 flex-1 outline-none focus:border-slate-400"
                          />
                          <button
                            onClick={() => {
                              if (newCommentText.trim()) {
                                onAddComment(report.id, newCommentText);
                                setNewCommentText('');
                              }
                            }}
                            className="bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold px-3 py-2 rounded-lg"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ITEM 3: RELIEF GOODS TRACKER (MUTATION) */}
            <div className="p-4 bg-white border border-slate-300 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-md font-extrabold text-[#0d1222] italic uppercase">
                    Relief Goods Tracker
                  </h3>
                  <p className="text-xs text-slate-750 max-w-xl leading-relaxed mt-1">
                    Check safe water distribute stations, burn treatment supply chests, and active relief pack disbursements in evacuation spots.
                  </p>
                </div>
                
                <button
                  onClick={() => setShowReliefTracker(!showReliefTracker)}
                  className="text-xs px-4 py-2 font-mono font-bold border border-slate-400 bg-[#EFF2FE] hover:bg-slate-950 hover:text-white rounded-lg transition-colors shrink-0"
                >
                  {showReliefTracker ? 'Hide Relief Logs' : 'Check Relief Items'}
                </button>
              </div>

              {showReliefTracker && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fade-in text-slate-800 max-h-75flow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-extrabold font-mono text-xs text-slate-700">🚒 ACTIVE RELIEF SUPPLIES IN PORTAL:</p>
                      {stockpileItems.map(item => (
                        <div key={item.id} className="p-2.5 bg-white rounded-xl border flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">Category: {item.category}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-900">{item.quantity}</span> <span className="text-slate-600 font-mono text-[10px]">{item.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="font-extrabold font-mono text-xs text-slate-700">🏡 EVACUATION FOOD DROPS & WATER POINT STATIONS:</p>
                      {evacuationCenters.map(center => (
                        <div key={center.id} className="p-2.5 bg-white rounded-xl border space-y-1.5 text-xs">
                          <p className="font-bold text-slate-900">{center.name}</p>
                          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-600">
                            <div>💧 Clean Water: <span className="text-emerald-600 font-bold">Operational</span></div>
                            <div>🛌 Bedding kit: <span className="text-emerald-600 font-bold">Standard Available</span></div>
                            <div>🍲 Kitchen Hall: <span className={center.hasKitchen ? 'text-emerald-600 font-bold':'text-slate-400'}>{center.hasKitchen ? 'ACTIVE':'None'}</span></div>
                            <div>⚕️ Medical Aid Station: <span className={center.hasMedicalSupply ? 'text-emerald-600 font-bold':'text-slate-400'}>{center.hasMedicalSupply ? 'ACTIVE':'None'}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ITEM 4: PROPERTY DAMAGE ASSISTANCE FORM (MUTATION) */}
            {userRole === 'Resident' && (
              <div className="p-4 bg-white border border-slate-300 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-md font-extrabold text-[#0d1222] italic uppercase">
                      Property Damage Assistance Form
                    </h3>
                    <p className="text-xs text-slate-750 max-w-xl leading-relaxed mt-1">
                      Affected residents can submit estimated property damage values directly to fire marshals to expedite social welfare relief coordination.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowDamageForm(!showDamageForm)}
                    className="text-xs px-4 py-2 font-mono font-bold border border-slate-400 bg-[#EFF2FE] hover:bg-slate-950 hover:text-white rounded-lg transition-colors shrink-0"
                  >
                    {showDamageForm ? 'Cancel Form' : 'Submit Assistance Claims'}
                  </button>
                </div>

                {showDamageForm && (
                  <form onSubmit={handleDamageSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fade-in text-slate-800">
                    <p className="text-xs font-extrabold font-mono text-red-600 uppercase tracking-widest">
                      ⚠️ OFFICIAL BDRRMC POST-FIRE DAMAGE SUBMISSION
                    </p>
                    
                    {damageFormSuccess ? (
                      <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-mono font-bold border border-emerald-400/20 text-center animate-pulse">
                        ✅ Damage report filed successfully! Maypajo fire relief officers will contact you at your household phone number for verification visits.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-600">Head of Household Full Name</label>
                          <input
                            type="text"
                            required
                            value={damageName}
                            onChange={(e) => setDamageName(e.target.value)}
                            placeholder="e.g., Carlos Santos Mendiola"
                            className="w-full bg-white border rounded p-2 text-xs text-slate-900 border-slate-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-600">Street / Area in Barangay 35</label>
                          <input
                            type="text"
                            required
                            value={damageAddress}
                            onChange={(e) => setDamageAddress(e.target.value)}
                            placeholder="e.g., Purok 4 Sawata Alleyway"
                            className="w-full bg-white border rounded p-2 text-xs text-slate-900 border-slate-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-600">Estimated Damages (PHP value)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            max={5000000000}
                            value={damageAmount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setDamageAmount(isNaN(val) ? '' : Math.min(5000000000, Math.max(0, val)));
                            }}
                            placeholder="e.g., 45000"
                            className="w-full bg-white border rounded p-2 text-xs text-slate-900 border-slate-300"
                          />
                        </div>

                        <div className="md:col-span-3 text-right">
                          <button
                            type="submit"
                            className="w-full md:w-auto bg-slate-950 text-white hover:bg-slate-900 font-bold font-mono text-xs px-5 py-2.5 rounded-lg border border-slate-800 transition-colors"
                          >
                            Send Damage Report
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* MODAL 1: GO-BAG INTERACTIVE CHECKLIST MODAL */}
      {showGoBagModal && (
        <div id="gobag-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            id="gobag-modal-box"
            className="bg-white border-2 border-slate-950 max-w-lg w-full rounded-3xl p-6 text-slate-900 space-y-5 shadow-2xl relative animate-fade-in"
          >
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase font-mono tracking-widest text-[#e11d48]">SURVIVAL CHECKLIST FOR FIRES</span>
              <h3 className="text-xl font-bold font-sans italic uppercase text-slate-950">Family GO-BAG Interactive Checklist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A simple, survival kit loaded with non-perishable food, water, medical aids and tools which your local family will need for 72 hours if a fast-spreading residential fire forces instant evacuation.
              </p>
            </div>

            {/* Progress metrics */}
            <div className="bg-slate-50 border rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span>Kit Readiness Rating:</span>
                <span className="text-red-600 uppercase">{progressPercent}% COMPLETED</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-red-600 h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>

            {/* Checklist items list */}
            <div className="space-y-2.5 max-h-55 overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase font-bold border-b pb-1">
                <span>ITEM REQUISITE</span>
                <span>STATUS</span>
              </div>
              
              <div 
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs"
                onClick={() => toggleGoBagItem('water')}
              >
                <div>
                  <p className="font-bold">💧 Drinking Water (6 Liters per head)</p>
                  <p className="text-[9px] text-slate-500 font-mono">Status: Required</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={goBagProgress['water']} 
                  readOnly 
                  className="w-4.5 h-4.5 text-red-600 rounded border-slate-300"
                />
              </div>

              <div 
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs"
                onClick={() => toggleGoBagItem('food')}
              >
                <div>
                  <p className="font-bold">🥫 Non-Perishable Canned Food (Easy Open)</p>
                  <p className="text-[9px] text-slate-500 font-mono">Status: Required</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={goBagProgress['food']} 
                  readOnly 
                  className="w-4.5 h-4.5 text-red-600 rounded border-slate-300"
                />
              </div>

              <div 
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs"
                onClick={() => toggleGoBagItem('flashlight')}
              >
                <div>
                  <p className="font-bold">🔦 High-intensity Flashlight & fresh batteries</p>
                  <p className="text-[9px] text-slate-500 font-mono">Status: Required</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={goBagProgress['flashlight']} 
                  readOnly 
                  className="w-4.5 h-4.5 text-red-600 rounded border-slate-300"
                />
              </div>

              <div 
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs"
                onClick={() => toggleGoBagItem('firstaid')}
              >
                <div>
                  <p className="font-bold">🩹 First Aid Box (Burn dressing, lint tape, alcohol)</p>
                  <p className="text-[9px] text-slate-500 font-mono">Status: Required</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={goBagProgress['firstaid']} 
                  readOnly 
                  className="w-4.5 h-4.5 text-red-600 rounded border-slate-300"
                />
              </div>

              <div 
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs"
                onClick={() => toggleGoBagItem('whistle')}
              >
                <div>
                  <p className="font-bold">📢 High-pitch Emergency Whistle</p>
                  <p className="text-[9px] text-slate-500 font-mono">Status: Required / Gadget-Free Alert</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={goBagProgress['whistle']} 
                  readOnly 
                  className="w-4.5 h-4.5 text-red-600 rounded border-slate-300"
                />
              </div>

              <div 
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs"
                onClick={() => toggleGoBagItem('documents')}
              >
                <div>
                  <p className="font-bold">📂 Photocopies of Land Titles, Birth Certs inside dry zip lock</p>
                  <p className="text-[9px] text-slate-500 font-mono">Status: Highly Advised</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={goBagProgress['documents']} 
                  readOnly 
                  className="w-4.5 h-4.5 text-red-600 rounded border-slate-300"
                />
              </div>

            </div>

            <div className="flex gap-3 justify-end pt-3 text-xs">
              <button
                onClick={() => setGoBagProgress({
                  'water': false,
                  'food': false,
                  'radio': false,
                  'firstaid': false,
                  'flashlight': false,
                  'whistle': false,
                  'documents': false,
                  'extinguisher': false
                })}
                className="p-2 border rounded font-mono font-bold text-slate-600 hover:bg-slate-50"
              >
                Reset Checklist
              </button>
              <button
                onClick={() => setShowGoBagModal(false)}
                className="p-2 px-5 bg-slate-950 text-white hover:bg-slate-900 font-mono font-bold rounded-lg"
              >
                Close Planner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERFACES TO UPDATE REPORT STATUS FOR VERIFICATION DEMO */}
      {showStatusModal && (() => {
        const currentReport = reports.find(r => r.id === showStatusModal);
        
        let handlingDept = { id: 'rescue', name: 'Barangay Rescue & Evacuation Squad' };
        if (currentReport) {
          if (
            currentReport.category === IncidentCategory.FIRE ||
            currentReport.category === IncidentCategory.GAS_LEAK ||
            currentReport.category === IncidentCategory.FIRE_ALARM
          ) {
            handlingDept = { id: 'bfp', name: 'Bureau of Fire Protection (BFP)' };
          }
        }

        const hasStatusPermission = 
          !currentUser || 
          !currentUser?.department || 
          currentUser.department.toLowerCase() === 'system' || 
          currentUser.department.toLowerCase() === handlingDept.id;

        return (
          <div id="status-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div 
              id="status-modal-box"
              className="bg-white border-2 border-slate-950 max-w-sm w-full rounded-2xl p-5 text-slate-900 space-y-4 animate-fade-in text-left"
            >
              <h3 className="font-sans font-black uppercase text-sm border-b pb-1.5 text-orange-600">
                🛠️ REPORT LIFE CYCLE CONTROL
              </h3>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                Verify or resolve reports on behalf of local response units. Current report: <b className="text-slate-950">{currentReport?.title}</b>
              </p>

              <div className={`p-2.5 rounded-xl border text-[11px] font-mono leading-relaxed ${
                hasStatusPermission 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                  : 'bg-rose-50 border-rose-300 text-rose-955 shadow-xs'
              }`}>
                <p className="font-extrabold flex items-center gap-1">
                  <span>🔑 ASSIGNED DEPT:</span>
                  <span className="underline text-red-600">{handlingDept.name.toUpperCase()}</span>
                </p>
                {!hasStatusPermission && (
                  <p className="text-[10px] text-red-600 mt-1 font-extrabold">
                    ❌ ACCESS DENIED: Your department ({currentUser?.department?.toUpperCase()}) does not have administrative rights to update {handlingDept.id.toUpperCase()} incidents.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {[IncidentStatus.PENDING, IncidentStatus.VERIFIED, IncidentStatus.DISPATCHED, IncidentStatus.RESOLVED].map((st) => (
                  <button
                    key={st}
                    disabled={!hasStatusPermission}
                    onClick={() => setTempStatus(st)}
                    className={`p-2.5 rounded-lg text-left text-xs font-semibold font-mono tracking-tight flex items-center justify-between border transition-all ${
                      !hasStatusPermission
                        ? 'opacity-60 cursor-not-allowed bg-slate-50 text-slate-450 border-slate-205'
                        : tempStatus === st 
                          ? 'bg-red-50 border-red-500 text-red-700 font-extrabold shadow-sm' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-750'
                    }`}
                  >
                    <span>{st}</span>
                    {tempStatus === st && <Check className="w-4 h-4 text-red-500" />}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusModal(null);
                  }}
                  className="p-2 border rounded font-mono font-bold hover:bg-slate-50 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!hasStatusPermission}
                  onClick={() => {
                    if (showStatusModal) {
                      onUpdateReportStatus(showStatusModal, tempStatus);
                      setShowStatusModal(null);
                    }
                  }}
                  className={`p-2 px-4 font-mono font-bold rounded-lg transition-all ${
                    hasStatusPermission 
                      ? 'bg-slate-950 hover:bg-slate-900 text-white cursor-pointer shadow-xs' 
                      : 'bg-slate-100 text-slate-450 border border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                >
                  Save Action
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL 3: PROGRAM REGISTRATION FORM */}
      {registeringProgramId && (
        <div id="register-program-backdrop" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={submitRegisterLocal}
            className="bg-white border-2 border-slate-950 max-w-sm w-full rounded-2xl p-5 text-slate-955 space-y-4 animate-fade-in"
          >
            <h3 className="font-black font-sans uppercase text-sm border-b pb-1.5 text-slate-900">
              ✍️ REGISTER FOR FIRE TRAINING
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Register to participate in <b>"{programs.find(p => p.id === registeringProgramId)?.title}"</b>. We will send you an SMS calendar reminder slot.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-600 uppercase">Participant's Name</label>
              <input
                type="text"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Enter your name... (e.g. Mang Ador)"
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 outline-none focus:border-slate-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRegisteringProgramId(null)}
                className="p-2 border rounded font-mono font-bold hover:bg-slate-50 text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="p-2 px-5 bg-slate-950 hover:bg-slate-900 text-white font-mono font-bold rounded-lg"
              >
                Register Now
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
