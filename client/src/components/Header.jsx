import React, { useState } from 'react';
import { 
  Menu, 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  X, 
  Flame, 
  Droplet, 
  HeartHandshake, 
  UserCircle,
  Globe,
  Phone,
  Search,
  Copy,
  Check
} from 'lucide-react';
import { IncidentCategory } from '../types';

export default function Header({
  userRole,
  sidebarOpen,
  setSidebarOpen,
  onTriggerSOS,
  activeExtremeAlertsExist,
  t
}) {
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosLocation, setSosLocation] = useState('');
  const [sosNotes, setSosNotes] = useState('');
  const [sosSuccess, setSosSuccess] = useState(false);

  // Custom Hotlines overlay and client-side code packaging
  const [showHotlinesModal, setShowHotlinesModal] = useState(false);
  const [hotlineSearch, setHotlineSearch] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(null);

  const [currentTimeStr, setCurrentTimeStr] = useState(() => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  // Keep time updated
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeStr(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSosSubmit = (e) => {
    e.preventDefault();
    if (!sosLocation.trim()) return;
    
    // We strictly trigger fire incident category
    onTriggerSOS(IncidentCategory.FIRE, sosLocation, sosNotes || 'IMMEDIATE SOS FIRE FIGHTING TRUCK DISPATCH REQUEST - CITIZEN ALARM BUTTON');
    setSosSuccess(true);
    setTimeout(() => {
      setSosSuccess(false);
      setShowSosModal(false);
      // Reset forms
      setSosLocation('');
      setSosNotes('');
    }, 2800);
  };

  return (
    <>
      {/* 1. TOP DIAGONAL FIRE-GRADIENT STRIP */}
      <div className="fire-gradient-bar" />

      {/* 2. THE HEADER BAR */}
      <header 
        id="app-header"
        className="sticky top-0 z-30 flex items-center justify-between h-16 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-sm select-none pl-0 pr-4 sm:pr-6 text-slate-900 animate-slide-down"
      >
        {/* Left Side: Cool Red Logo & Title */}
        <div className="flex items-center gap-3 h-full">
          {/* Flame Block on the far left */}
          <div className="h-full w-16 sm:w-20 bg-rose-600 shrink-0 flex items-center justify-center font-black border-r border-indigo-100 shadow-xs">
            <Flame className="w-6 h-6 text-white fill-white animate-pulse" />
          </div>

          <button
            id="mobile-menu-hamburger"
            className="p-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 lg:hidden transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:block text-left">
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block font-mono">
              {t('republicLabel')}
            </span>
            <span className="text-sm font-black text-slate-900 block -mt-1 tracking-tight">
              {t('headerBrgyLabel')}
            </span>
          </div>
        </div>

        {/* Center: Overall Brgy Alert Level Bar */}
        <div className="hidden sm:flex items-center gap-2">
          {activeExtremeAlertsExist ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-300 text-red-700 font-extrabold shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-mono">
                {t('statusHighRisk')}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-extrabold shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-mono">
                {t('statusLigtasNormal')}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Emergency Hotlines Button */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Emergency Hotlines Cyan block button */}
          <button
            id="emergency-hotlines-btn"
            onClick={() => setShowHotlinesModal(true)}
            className="bg-[#0ADBD2] hover:bg-[#09c2ba] text-slate-950 hover:text-black font-extrabold uppercase text-xs border border-indigo-200/80 px-3.5 sm:px-4 py-2 rounded-lg shadow-2xs cursor-pointer transition-all active:scale-95"
            title="Barangay 35 Emergency Fire Rescue Numbers"
          >
            {t('emergencyHotline')}
          </button>

          {/* SOS Panic Button */}
          <button
            id="sos-panic-btn"
            onClick={() => setShowSosModal(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black px-3 py-2 rounded-lg shadow-sm border border-red-700 hover:scale-102 active:scale-95 transition-all uppercase tracking-wider font-mono animate-pulse"
            title="S.O.S Emergency Citizens Alarm"
          >
            <Flame className="w-3.5 h-3.5 text-white fill-white animate-bounce" />
            <span>SOS</span>
          </button>
        </div>
      </header>

      {/* SOS TRIGGER MODAL */}
      {showSosModal && (
        <div id="sos-trigger-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            id="sos-trigger-modal-box"
            className="bg-white border-2 border-slate-950 max-w-sm w-full rounded-3xl p-6 text-slate-900 space-y-4 shadow-2xl relative animate-fade-in"
          >
            <div className="flex items-center gap-2 text-red-600">
              <Flame className="w-6 h-6 text-red-600 animate-pulse fill-red-600" />
              <h3 className="text-md font-black font-sans uppercase tracking-tight">
                CRITICAL FIRE DISPATCH REQUEST
              </h3>
            </div>

            {sosSuccess ? (
              <div 
                id="sos-trigger-success"
                className="p-4 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-500/20 text-xs font-mono font-bold text-center space-y-2 animate-pulse"
              >
                <div className="text-xl">🚒 TRANSMITTED!</div>
                <p>SOS alert has been coordinates-broadcasted to the Caloocan BFP Station. Local firefighters are en route to your street.</p>
              </div>
            ) : (
              <form onSubmit={handleSosSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit this distress alarm. It will immediately activate sirens and send automatic dispatch logs to responders.
                </p>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-mono font-black text-slate-600 uppercase">Emergency Location (Purok / No.)</label>
                  <input
                    type="text"
                    required
                    value={sosLocation}
                    onChange={(e) => setSosLocation(e.target.value)}
                    placeholder="e.g. Purok 4, Sawata Alleyway 2"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-mono font-black text-slate-600 uppercase">Hazard Details (Optional)</label>
                  <input
                    type="text"
                    value={sosNotes}
                    onChange={(e) => setSosNotes(e.target.value)}
                    placeholder="e.g. electrical transformer smoking or grass burning"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowSosModal(false)}
                    className="p-2 border rounded font-mono font-bold hover:bg-slate-100 text-slate-600"
                  >
                    Cancel Alarm
                  </button>
                  <button
                    type="submit"
                    className="p-2 px-5 bg-red-600 hover:bg-red-700 text-white font-mono font-black rounded-lg border-2 border-red-700"
                  >
                    DISPATCH TRUCKS
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE DIRECT EMERGENCY HOTLINES MODAL */}
      {showHotlinesModal && (
        <div id="hotlines-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            id="hotlines-modal-box"
            className="bg-white border-2 border-slate-950 max-w-lg w-full rounded-2xl p-4 sm:p-5 text-slate-900 shadow-2xl relative animate-fade-in flex flex-col max-h-[85vh] @container"
          >
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 bg-red-600 text-white rounded font-mono font-black text-[10px] sm:text-xs tracking-wider animate-pulse uppercase">
                  BDRRMC DIRECTORY
                </div>
                <h3 className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-tight font-sans">
                  Emergency Hotlines
                </h3>
              </div>
              <button 
                id="close-hotlines-modal-btn"
                onClick={() => {
                  setShowHotlinesModal(false);
                  setHotlineSearch('');
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed -mt-1.5 mb-2.5">
              Direct emergency help contact numbers for Barangay 35 Maypajo residents, local responders, and city dispatchers.
            </p>

            {/* Quick Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="search-hotlines-input"
                type="text"
                placeholder="Search departments, staff, or numbers..."
                value={hotlineSearch}
                onChange={(e) => setHotlineSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border-2 border-slate-200 rounded-lg text-xs font-medium focus:border-slate-900 focus:outline-none focus:ring-0 transition-all bg-slate-50 focus:bg-white"
              />
              {hotlineSearch && (
                <button
                  onClick={() => setHotlineSearch('')}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-900 text-xs font-mono font-extrabold"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Scrollable Hotlines List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 max-h-[45vh] scrollbar-thin">
              {[
                { name: "Caloocan Fire Department (BFP)", phone: "(02) 5310-6527", category: "Fire / Rescue", color: "bg-red-50 text-red-700 border-red-200" },
                { name: "Bureau of Fire Protection Caloocan HQ", phone: "(02) 8531-6527", category: "Fire / Rescue", color: "bg-red-50 text-red-700 border-red-200" },
                { name: "BFP Caloocan Mobile Hotline", phone: "0917-117-7873", category: "Fire / Rescue", color: "bg-red-50 text-red-700 border-red-200" },
                { name: "TXT Fire Hotline Mobile", phone: "0922-561-1111", category: "Fire / Rescue", color: "bg-red-50 text-red-700 border-red-200" },
                { name: "Maypajo Fire Substation (Station 1)", phone: "0995-637-3278", category: "Fire / Rescue", color: "bg-red-50 text-red-700 border-red-200" },
                { name: "Maypajo Fire Substation Mobile Alt", phone: "0912-358-4359", category: "Fire / Rescue", color: "bg-red-50 text-red-700 border-red-200" },
                { name: "Barangay 35 Hall / Barangay Office", phone: "(02) 8260-8842", category: "Barangay Hall", color: "bg-orange-50 text-orange-700 border-orange-200" },
                { name: "Barangay 35 Office Alt Phone", phone: "(02) 8352-1074", category: "Barangay Hall", color: "bg-orange-50 text-orange-700 border-orange-200" },
                { name: "Barangay Executive Officer (Brgy Ex-O)", phone: "0909-028-0292", category: "Barangay Staff", color: "bg-amber-50 text-amber-800 border-amber-200" },
                { name: "Senior Barangay Inspector", phone: "0928-433-2658", category: "Barangay Staff", color: "bg-amber-50 text-amber-800 border-amber-200" },
                { name: "Barangay Property Custodian", phone: "0967-061-7738", category: "Barangay Staff", color: "bg-amber-50 text-amber-800 border-amber-200" },
                { name: "Barangay Monitoring Officer", phone: "0956-164-9706", category: "Barangay Staff", color: "bg-amber-50 text-amber-800 border-amber-200" },
                { name: "Philippine Red Cross National Dispatch", phone: "143", category: "Medical / Rescue", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { name: "Philippine Red Cross Caloocan Chapter", phone: "0917-834-8230", category: "Medical / Rescue", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { name: "Caloocan City Medical Center (CCMC South)", phone: "(02) 8288-7077", category: "Medical / Rescue", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { name: "CDRRMO Disaster Rescue Landline 1", phone: "(02) 5310-6972", category: "Medical / Rescue", color: "bg-teal-50 text-teal-700 border-teal-200" },
                { name: "CDRRMO Disaster Rescue Landline 2", phone: "(02) 310-6527", category: "Medical / Rescue", color: "bg-teal-50 text-teal-700 border-teal-200" },
                { name: "CDRRMO Disaster Rescue Mobile 1", phone: "0947-796-4372", category: "Medical / Rescue", color: "bg-teal-50 text-teal-700 border-teal-200" },
                { name: "CDRRMO Disaster Rescue Mobile 2", phone: "0916-797-6365", category: "Medical / Rescue", color: "bg-teal-50 text-teal-700 border-teal-200" },
                { name: "Northern Police District (Caloocan Station) Line 1", phone: "0905-454-2547", category: "Law Enforcement", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                { name: "Northern Police District (Caloocan Station) Line 2", phone: "0998-598-7862", category: "Law Enforcement", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                { name: "Traffic South Caloocan Division Office", phone: "0915-112-4731", category: "Law Enforcement", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                { name: "City Social Welfare Development (CSWD)", phone: "53365705", category: "Staff / Welfare", color: "bg-purple-50 text-purple-700 border-purple-200" },
                { name: "Meralco Sparks & Power Cutoff Line 1", phone: "(02) 16211", category: "Utility Outage", color: "bg-yellow-50 text-yellow-800 border-yellow-200" },
                { name: "Meralco Sparks & Power Cutoff Line 2", phone: "(02) 1622", category: "Utility Outage", color: "bg-yellow-50 text-yellow-800 border-yellow-200" }
              ].filter(h => {
                const query = hotlineSearch.toLowerCase();
                return h.name.toLowerCase().includes(query) || h.phone.includes(query) || h.category.toLowerCase().includes(query);
              }).map((hotline, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 bg-white hover:bg-slate-50 transition-all gap-1 border-b border-dashed border-slate-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[12px] font-extrabold text-slate-900 leading-tight">
                        {hotline.name}
                      </span>
                      <span className={`text-[8px] font-mono font-bold uppercase px-1 rounded border leading-none py-0.5 ${hotline.color}`}>
                        {hotline.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 justify-between sm:justify-end">
                    <a 
                      href={`tel:${hotline.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-xs font-mono font-extrabold text-[#0D9488] bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded inline-flex items-center gap-1 border border-emerald-200 transition-all cursor-pointer"
                      title="Tap to call directly"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{hotline.phone}</span>
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(hotline.phone);
                        setCopiedNumber(hotline.phone);
                        setTimeout(() => setCopiedNumber(null), 1500);
                      }}
                      className="p-1.5 border border-slate-200 text-slate-500 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer"
                      title="Copy phone"
                    >
                      {copiedNumber === hotline.phone ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-extrabold" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Info Notice at footer */}
            <div className="bg-red-50 text-red-950 border border-red-150 p-2.5 rounded-lg flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-[9px] sm:text-[10px] leading-relaxed font-sans text-red-950">
                <span className="font-extrabold uppercase text-red-700 tracking-wider block">In case of active live fire:</span>
                Run. Turn off breakers if safe. Dial the BFP / TXT Fire lines above, shout warnings, and proceed to open safe zones.
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowHotlinesModal(false);
                  setHotlineSearch('');
                }}
                className="w-full sm:w-auto p-2 border-2 border-slate-950 font-mono font-black uppercase text-[10px] hover:bg-slate-100 rounded-lg cursor-pointer text-center text-slate-900 transition-all active:scale-95 shadow-2xs"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
