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
  alerts = []
}) {
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosLocation, setSosLocation] = useState('');
  const [sosNotes, setSosNotes] = useState('');
  const [sosSuccess, setSosSuccess] = useState(false);

  // Additional crisis parameters
  const [waterLevel, setWaterLevel] = useState('Adequate');
  const [taskUrgency, setTaskUrgency] = useState('Critical (All agencies)');
  const [fireAlarmLevel, setFireAlarmLevel] = useState('First Alarm');

  // GPS tracking & Automatic calling simulation states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // Helper function to synthesize a cellular ringtone
  const playPhoneRingSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 440;
      osc2.frequency.value = 480;

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Ring sound: rise/decay pattern
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime + 1.8);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.0);

      osc1.start();
      osc2.start();

      osc1.stop(ctx.currentTime + 2.1);
      osc2.stop(ctx.currentTime + 2.1);
    } catch (e) {
      console.warn("Web Audio API not supported or awaiting focus layout:", e);
    }
  };

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

  // Sync GPS coordinates tracking on modal toggled
  React.useEffect(() => {
    if (showSosModal) {
      setGpsLoading(true);
      setGpsError(null);
      setGpsCoords(null);
      setSosLocation('');
      setIsCalling(false);
      setCallTimer(0);

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setGpsCoords({ lat, lng });
            setGpsLoading(false);
            
            // Reverse geocode/estimate the best Purok 1-5 region
            const puroks = ['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4 (Sawata)', 'Purok 5'];
            const idx = Math.abs(Math.floor((lat + lng) * 10000)) % puroks.length;
            const estimatedPurok = puroks[idx] || 'Purok 4';
            setSosLocation(`${estimatedPurok} (GPS Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)})`);
          },
          (error) => {
            console.error(error);
            setGpsError(error.message || "GPS Permission Blocked");
            setGpsLoading(false);
            // Default fallbacks for Barangay 35 Central
            setGpsCoords({ lat: 14.6425, lng: 120.9734 });
            setSosLocation("Purok 4, Sawata Yard (Barangay 35 Central)");
          },
          { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
        );
      } else {
        setGpsError("Browser does not support geolocation APIs");
        setGpsLoading(false);
        setGpsCoords({ lat: 14.6425, lng: 120.9734 });
        setSosLocation("Purok 4, Sawata Yard (Barangay 35 Central)");
      }
    }
  }, [showSosModal]);

  // Handle automatic simulated voice-dispatch call progression
  React.useEffect(() => {
    let timerID;
    if (isCalling) {
      // Sound active ring tone immediately
      playPhoneRingSound();
      
      timerID = setInterval(() => {
        setCallTimer(prev => {
          const next = prev + 1;
          // Repeat ringing sound cadence
          if (next === 3 || next === 6) {
            playPhoneRingSound();
          }
          if (next >= 8) {
            clearInterval(timerID);
            const finalNotes = sosNotes.trim() === '' ? 'cause: Under Investigation' : sosNotes;
            onTriggerSOS(
              IncidentCategory.FIRE, 
              sosLocation || 'Barangay 35 Live GPS Hub', 
              finalNotes,
              waterLevel,
              taskUrgency,
              fireAlarmLevel
            );
            setSosSuccess(true);
            setIsCalling(false);
            setTimeout(() => {
              setSosSuccess(false);
              setShowSosModal(false);
            }, 3000);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timerID);
  }, [isCalling, sosLocation, sosNotes, waterLevel, taskUrgency, fireAlarmLevel]);

  const handleSosSubmit = (e) => {
    e.preventDefault();
    if (!sosLocation.trim()) return;
    setIsCalling(true);
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
              Republic of the Philippines
            </span>
            <span className="text-sm font-black text-slate-900 block -mt-1 tracking-tight">
              Barangay 35 – Maypajo, Caloocan
            </span>
          </div>
        </div>

        {/* Center: Overall Brgy Alert Level Bar */}
        <div className="hidden sm:flex items-center gap-2">
          {(() => {
            const activeAlerts = alerts?.filter(a => a.isActive) || [];
            
            // Check if there is an active extreme alert
            const hasExtreme = activeAlerts.some(a => 
              a.severity === 'Extreme Danger' || 
              a.severity?.toUpperCase() === 'EXTREME'
            );
            
            // Check if there is an active warning alert
            const hasWarning = activeAlerts.some(a => 
              a.severity === 'Warning' || 
              a.severity?.toUpperCase() === 'WARNING'
            );
            
            // Check if there is an active advisory alert
            const hasAdvisory = activeAlerts.some(a => 
              a.severity === 'Advisory' || 
              a.severity?.toUpperCase() === 'ADVISORY'
            );

            if (hasExtreme) {
              const activeExtreme = activeAlerts.find(a => 
                a.severity === 'Extreme Danger' || 
                a.severity?.toUpperCase() === 'EXTREME'
              );
              const address = activeExtreme?.affectedArea || 'Barangay 35';
              return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 border border-red-400 text-red-800 font-extrabold shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse animate-duration-1000" />
                  <span className="text-[10px] uppercase tracking-widest font-mono">
                    HORROR ALERT
                  </span>
                  <span className="text-red-400 text-[10px] font-normal">|</span>
                  <span className="text-[10px] text-red-700 font-sans tracking-tight font-bold truncate max-w-[150px] sm:max-w-[250px]">
                    📍 {address}
                  </span>
                </div>
              );
            } else if (hasWarning) {
              const activeWarning = activeAlerts.find(a => 
                a.severity === 'Warning' || 
                a.severity?.toUpperCase() === 'WARNING'
              );
              const address = activeWarning?.affectedArea || 'Barangay 35';
              return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-extrabold shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest font-mono">
                    WARNING ADVISORY
                  </span>
                  <span className="text-amber-300 text-[10px] font-normal">|</span>
                  <span className="text-[10px] text-amber-700 font-sans tracking-tight font-bold truncate max-w-[150px] sm:max-w-[250px]">
                    📍 {address}
                  </span>
                </div>
              );
            } else if (hasAdvisory) {
              const activeAdvisory = activeAlerts.find(a => 
                a.severity === 'Advisory' || 
                a.severity?.toUpperCase() === 'ADVISORY'
              );
              const address = activeAdvisory?.affectedArea || 'Barangay 35';
              return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-300 text-sky-700 font-extrabold shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest font-mono">
                    ADVISORY FEED
                  </span>
                  <span className="text-sky-305 text-[10px] font-normal">|</span>
                  <span className="text-[10px] text-sky-600 font-sans tracking-tight font-bold truncate max-w-[150px] sm:max-w-[250px]">
                    📍 {address}
                  </span>
                </div>
              );
            } else {
              return (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-extrabold shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest font-mono">
                    ALL CLEAR (LIGTAS)
                  </span>
                </div>
              );
            }
          })()}
        </div>

        {/* Right Side: Emergency Hotlines Button */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Emergency Hotlines Cyan block button */}
          <button
            id="emergency-hotlines-btn"
            onClick={() => setShowHotlinesModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold uppercase text-xs border border-indigo-700 px-3.5 sm:px-4 py-2 rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 hover:scale-[1.02]"
            title="Barangay 35 Emergency Fire Rescue Numbers"
          >
            Emergency Hotlines
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
            className="bg-white border-3 border-slate-950 max-w-lg w-full rounded-3xl p-6 md:p-8 text-slate-900 space-y-4 shadow-2xl relative animate-fade-in"
          >
            {/* Success screen once dispatch completes */}
            {sosSuccess ? (
              <div 
                id="sos-trigger-success-animate"
                className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-center space-y-3 text-slate-900"
              >
                <div className="text-3xl animate-bounce">🚒 CONNECTED!</div>
                <h4 className="font-extrabold text-xs text-emerald-800 uppercase font-mono">Barangay Maypajo Response Activated</h4>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  Your live GPS coordinates and specifications have been transmitted inside the central control dashboard. All fire engines, medics, and BDRRMC responders have been sounded via sirens!
                </p>
              </div>
            ) : isCalling ? (
              /* Simulated phone dialer performing the automatic call to the barangay */
              <div id="sos-calling-screen" className="text-center space-y-5 animate-fade-in bg-slate-950 text-white p-6 rounded-2xl border-2 border-red-700">
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center bg-red-600 rounded-full animate-bounce">
                  <Phone className="w-8 h-8 text-white fill-white animate-pulse" />
                  <span className="absolute -inset-2 bg-red-500/25 rounded-full animate-ping" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-mono tracking-widest uppercase font-black text-red-500">Live Satellite Dialing</p>
                  <h4 className="text-base font-extrabold text-white">Calling Barangay 35 Office (BDRRMC Desk)</h4>
                  <p className="text-xs font-mono text-slate-400">🚨 (02) 8281-9111 • Active GPS Link</p>
                </div>

                {/* Call status steps */}
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-left font-mono text-[10px] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-emerald-500">✔</span>
                    <span>GPS lock established ({gpsCoords?.lat?.toFixed(5)}, {gpsCoords?.lng?.toFixed(5)})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-emerald-500">✔</span>
                    <span>Specifying constraints: [Water: ${waterLevel}] [Urgency: ${taskUrgency}] [Alarm: ${fireAlarmLevel}]</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-red-400 font-extrabold">
                    <span className="animate-pulse">●</span>
                    <span>
                      {callTimer < 3 ? "Initiating Call Trunk..." : 
                       callTimer < 6 ? "Ringing Dispatch Desks..." : 
                       "Connecting Voice Synth Voice-Feed..."}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-300 bg-red-950/40 p-2 rounded border border-red-900 border-dashed">
                  📞 Automatically reporting fire threat area...
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    setIsCalling(false);
                    setCallTimer(0);
                  }}
                  className="w-full py-2 bg-red-800 hover:bg-red-900 text-white font-mono font-black text-[11px] rounded-lg border border-red-600/50 uppercase transition-all"
                >
                  Hang Up / Cancel Dispatch
                </button>
              </div>
            ) : (
              /* Step 1: Tracking location and showing Big Confirm Buttons with maximized two-grid parameters */
              <div id="sos-confirm-form" className="space-y-4 text-slate-900">
                <div className="flex items-center gap-2 text-red-600 border-b pb-2">
                  <Flame className="w-6 h-6 text-red-600 animate-pulse fill-red-600" />
                  <h3 className="text-sm font-black font-sans uppercase tracking-tight">
                    INTEGRATED CRITICAL SOS BROADCASTER
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  This system tracks precise satellite GPS coordinates, updates the live database, and automatically issues hotlines notifications to Barangay 35.
                </p>

                {/* GPS Status and Coordinate Box */}
                {gpsLoading ? (
                  <div className="p-3 bg-[#EEF2FC]/60 border border-indigo-100 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-800 font-bold animate-pulse">
                    <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    🛰️ Querying live GPS coordinates...
                  </div>
                ) : gpsError ? (
                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-amber-800 uppercase tracking-wide">📍 Default Station coordinates</span>
                      <span className="px-1.5 py-0.5 text-[8px] bg-amber-100 text-amber-800 rounded font-bold uppercase">FALLBACK LOCKED</span>
                    </div>
                    <p className="text-[10px] text-amber-700 font-medium font-sans">
                      Could not secure live GPS track ({gpsError}). Using preset Barangay Maypajo Central workspace coordinates.
                    </p>
                    <p className="text-xs font-mono text-slate-800">
                      Lat: <span className="text-indigo-700 font-bold">14.642500</span>, Lng: <span className="text-indigo-700 font-bold">120.973400</span>
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-emerald-800 uppercase tracking-wide">📍 Live GPS Coordinates Secured</span>
                      <span className="px-1.5 py-0.5 text-[8px] bg-emerald-100 text-emerald-800 rounded font-bold uppercase font-mono">ACTIVE SATELLITE FEED</span>
                    </div>
                    <p className="text-xs font-mono text-slate-800">
                      Latitude: <span className="text-emerald-700 font-bold">{gpsCoords?.lat?.toFixed(6)}</span> <br />
                      Longitude: <span className="text-emerald-700 font-bold">{gpsCoords?.lng?.toFixed(6)}</span>
                    </p>
                  </div>
                )}

                {/* Confirm Dispatch Details form elements */}
                <form onSubmit={handleSosSubmit} className="space-y-4 text-left">
                  <div className="space-y-4">
                    {/* Location input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-wide">📍 EMERGENCY LOCATION (PUROK / STREET)</label>
                      <input
                        type="text"
                        required
                        value={sosLocation}
                        onChange={(e) => setSosLocation(e.target.value)}
                        placeholder="e.g. Purok 1, Maypajo"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:border-red-500 focus:outline-none text-slate-900"
                      />
                    </div>

                    {/* Emergency Details input (renamed from Hazard Details) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-wide">📝 EMERGENCY DETAILS (LEAVE BLANK FOR UNDER INVESTIGATION)</label>
                      <textarea
                        rows={4}
                        value={sosNotes}
                        onChange={(e) => setSosNotes(e.target.value)}
                        placeholder="Provide details. If left blank, this logs as 'cause: Under Investigation'."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:border-red-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* HIGH-CONTRAST BIG SCREEN CRITICAL CALL TRIGGER */}
                  <div className="space-y-2.5 pt-1.5 border-t border-slate-200">
                    <button
                      type="submit"
                      className="w-full py-4 bg-red-600 hover:bg-slate-950 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl border-3 border-slate-950 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-pulse"
                    >
                      <Phone className="w-4 h-4 text-white fill-white animate-bounce" />
                      CONFIRM SOS & AUTOMATIC CALL
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSosModal(false)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-[11px] rounded-lg border border-slate-300/40 uppercase transition-all text-center"
                    >
                      Cancel / Close Alarm
                    </button>
                  </div>
                </form>
              </div>
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
