import React, { useState } from 'react';
import { 
  Bell, 
  Megaphone, 
  Clock, 
  Siren, 
  AlertTriangle, 
  PlusCircle, 
  ShieldAlert, 
  UserPlus, 
  Users 
} from 'lucide-react';
import { AlertSeverity } from '../types';

export default function AlertsView({
  userRole,
  currentUser,
  alerts,
  onAddAlert,
  onDeleteAlert,
  onUpdateAlerts,
  language,
  t,
  broadcastPublicMode = false,
  onToggleBroadcastPublicMode
}) {
  
  // Custom Broadcast States (Official actions)
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('Warning');
  const [affectedArea, setAffectedArea] = useState('Purok 4 (Riverside Area)');
  const [broadcastSMS, setBroadcastSMS] = useState(true);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState(null);

  // Search/Filter state
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [smsLogs, setSmsLogs] = useState([
    'BDRRMC SMS: [9:40 AM] BAGYONG CARINA Red rainfall alert sent to 450 contacts on Globe/Smart network.',
    'BDRRMC SMS: [3:15 PM] Purok 3 Fire safety seminar reminder sent successfully to 120 registered students and parents.'
  ]);

  const isVolunteer = currentUser?.department?.toLowerCase() === 'volunteers';
  const isResident = userRole === 'Resident';
  const isPublicViewer = isResident || isVolunteer;
  const isAdmin = userRole === 'Admin' || userRole === 'SuperAdmin';

  const canConfigurePublicBroadcast = isAdmin && currentUser?.department?.toLowerCase() !== 'volunteers';

  const getDeptNameFromKey = (deptKey) => {
    if (!deptKey) return 'Municipal Emergency Command Unit';
    switch (deptKey.toLowerCase()) {
      case 'bfp': return 'Bureau of Fire Protection (BFP) Maypajo';
      case 'pnp': return 'Philippine National Police (PNP) Maypajo';
      case 'medics': return 'Maypajo Health & Red Cross Medic Unit';
      case 'rescue': return 'Barangay Rescue & Evacuation Squad';
      case 'volunteers': return 'Barangay 35 Fire Volunteer Brigade';
      default: return deptKey.toUpperCase();
    }
  };

  const canModifyAlert = (alert) => {
    if (isPublicViewer) return false;
    if (!isAdmin) return false;
    if (!currentUser?.department || currentUser.department.toLowerCase() === 'rescue') return true; 
    return alert.department === currentUser.department;
  };

  const handleStartEditAlert = (alert) => {
    setEditingAlertId(alert.id);
    setTitle(alert.title);
    setSeverity(alert.severity);
    setAffectedArea(alert.affectedArea);
    setMessage(alert.message);
    setBroadcastSMS(alert.broadcastSMS);
  };

  const handleCancelEdit = () => {
    setEditingAlertId(null);
    setTitle('');
    setSeverity('Warning');
    setAffectedArea('Purok 4 (Riverside Area)');
    setMessage('');
    setBroadcastSMS(true);
  };

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!title || !message || !affectedArea) return;

    if (editingAlertId) {
      if (onUpdateAlerts) {
        const updated = alerts.map(a => {
          if (a.id === editingAlertId) {
            return {
              ...a,
              title,
              severity,
              message,
              affectedArea,
              broadcastSMS
            };
          }
          return a;
        });
        onUpdateAlerts(updated);

        if (broadcastSMS) {
          setSmsLogs([
            `BDRRMC Live SMS Update: [${new Date().toLocaleTimeString()}] UPDATE: "${title}" alert updated and sent to ${Math.floor(Math.random() * 200) + 380} subscribers!`,
            ...smsLogs
          ]);
        }
      }
      setEditingAlertId(null);
    } else {
      onAddAlert({
        title,
        severity,
        message,
        affectedArea,
        isActive: true,
        createdBy: getDeptNameFromKey(currentUser?.department),
        broadcastSMS,
        department: currentUser?.department
      });

      if (broadcastSMS) {
        setSmsLogs([
          `BDRRMC Live SMS Broadcast: [${new Date().toLocaleTimeString()}] "${title}" dispatch alert successfully transmitted to ${Math.floor(Math.random() * 200) + 380} subscribers!`,
          ...smsLogs
        ]);
      }
    }

    setAlertSuccess(true);
    setTimeout(() => {
      setTitle('');
      setMessage('');
      setAlertSuccess(false);
    }, 2000);
  };

  const filteredAlerts = alerts.filter(a => {
    if (selectedSeverity === 'All') return true;
    return a.severity === selectedSeverity;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER ROW */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black uppercase text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-500 animate-pulse" />
            {broadcastPublicMode ? 'Emergency Broadcast Stream' : 'Early Warning Broadcast Operations'}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {broadcastPublicMode 
              ? 'Mga real-time warning, anunsyo, at safety guidelines para sa kaligtasan ng pamilyang mamamayan ng San Sebastian.'
              : 'BDRRMC early warning broadcast logs. Sa bahaging ito ipinapakita ang lahat ng active extreme danger announcements at simulated SMS logs.'}
          </p>
        </div>
      </div>

      {/* ADMIN CONTROLS FOR PUBLIC MODE */}
      {canConfigurePublicBroadcast && (
        <div id="admin-broadcast-portal-config" className="bg-linear-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none">
          <div className="space-y-1 text-left font-sans">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 font-extrabold text-[9px] uppercase tracking-wider rounded border border-indigo-500/30 font-mono">
                Admin Settings Mode
              </span>
              <span className={`w-2 h-2 rounded-full ${broadcastPublicMode ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-[10px] font-mono font-bold text-slate-300">
                {broadcastPublicMode ? 'LIVE PUBLIC BROADCAST' : 'PRIVATE COMMAND ONLY'}
              </span>
            </div>
            <h3 className="font-extrabold text-sm uppercase text-white tracking-tight flex items-center gap-1.5">
              Modify Broadcaster Portal Access
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans max-w-xl">
              Toggling public access changes the portal tab name to <strong className="text-yellow-400">"Broadcast"</strong>, making it fully visible to Residents and Volunteers. Controls and sensitive SMS log gateways are automatically hidden for their read-only safety view.
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleBroadcastPublicMode}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md border cursor-pointer border-solid ${
              broadcastPublicMode 
                ? 'bg-rose-600 hover:bg-rose-700 border-rose-550 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-555 text-white'
            }`}
          >
            {broadcastPublicMode ? 'Change to Normal Portal' : 'Change into "Broadcast"'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: BROADCAST CREATION FORM (Only visible to admin / Officials) */}
        {!isPublicViewer && (
          <div className="lg:col-span-1 space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600 animate-pulse" />
            
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase flex items-center gap-1.5 mb-2">
              <Megaphone className="w-4 h-4 text-rose-500 animate-pulse" />
              {editingAlertId ? 'I-update ang Warning Broadcast' : 'Mag-Broadcast ng Bagong Warning'}
            </h3>

            {!isAdmin && (
              <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-slate-805 text-[10.5px] leading-relaxed font-sans font-medium text-left flex items-start gap-1.5 shadow-3xs">
                <span className="text-rose-600 font-extrabold shrink-0">⚠️</span>
                <span>
                  <strong>Hala (Read-Only View):</strong>{' '}
                  {language === 'ph' 
                    ? 'Ang mga Barangay Official Admin lamang ang may privilege na mag-modify, mag-delete, o mag-broadcast ng bagong early warning.'
                    : 'Only verified Barangay Official Admins possess the administrative privilege to broadcast warning alerts, modify fields, and trigger active SMS queues.'}
                </span>
              </div>
            )}

            {alertSuccess ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3 text-xl">
                  ✓
                </div>
                <h4 className="text-base font-bold text-emerald-600">Warning Broadcast Active!</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Ang warning alert ay live na sa lahat ng Resident dashboard at naipadala na sa SMS priority queues.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBroadcastSubmit} className="space-y-3.5 text-left">
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-705">
                    Pamagat ng Warning (Alert Title) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Hal: BAGYONG CARINA RED RAINFALL WARNING"
                    className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-705">
                      Antas ng Alerto (Severity Group)
                    </label>
                    <select
                      disabled={!isAdmin}
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <option value={AlertSeverity.EXTREME}>🔴 Extreme Danger / Critical Evacuation (Kagyat na Paglikas)</option>
                      <option value={AlertSeverity.WARNING}>🟡 Warning Level / Alert Preparation (Maging Handa)</option>
                      <option value={AlertSeverity.ADVISORY}>🔵 Advisory Level / General Monitoring (General Advisory)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-705">
                      Sakop na Lugar (Affected Area) *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!isAdmin}
                      value={affectedArea}
                      onChange={(e) => setAffectedArea(e.target.value)}
                      placeholder="e.g. Purok 4 Riverside"
                      className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-705">
                    Detalyadong Mensahe / Tagubilin *
                  </label>
                  <textarea
                    required
                    rows={4}
                    disabled={!isAdmin}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mangyaring isara ang mga kuryente, mag-lock ng tahanan at patungo sa safe covered court..."
                    className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* SMS Checkbox */}
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="sms-check"
                    disabled={!isAdmin}
                    checked={broadcastSMS}
                    onChange={(e) => setBroadcastSMS(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 h-4 w-4 disabled:opacity-60"
                  />
                  <label htmlFor="sms-check" className="text-[11px] font-bold text-slate-700 cursor-pointer select-none">
                    I-broadcast din bilang SMS Text Message sa pamilya
                  </label>
                </div>

                {isAdmin && (
                  <div className="space-y-2 pt-1.5 flex flex-col">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-indigo-650 hover:bg-slate-900 text-white font-extrabold text-xs shadow hover:shadow-md transition-all active:scale-95 text-center cursor-pointer uppercase"
                    >
                      {editingAlertId ? 'I-save ang mga Pagbabago' : 'I-Send Live Broadcast'}
                    </button>
                    {editingAlertId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-755 font-extrabold text-xs transition-all active:scale-95 text-center cursor-pointer uppercase border border-slate-200"
                      >
                        Cancel Edit Changes
                      </button>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>

          <div className="bg-[#EFF2FE] text-slate-900 p-5 rounded-2xl border border-slate-300 space-y-3.5 mt-4 text-left">
            <span className="p-2 bg-white rounded-lg text-rose-500 inline-block border border-slate-200">
              <Siren className="w-5 h-5 animate-pulse" />
            </span>
            <h4 className="font-extrabold text-xs tracking-wider uppercase text-slate-950">
              Early Warning Siren Codes Guide
            </h4>
            <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
              Barangay 35 is deploying an Emergency Siren Warning broadcast sequence on the main Brgy Hall Tower to guide residents:
            </p>
            <div className="space-y-2 text-[10px] font-mono text-slate-600 pt-1.5 border-t border-slate-200">
              <div className="flex items-start gap-1.5">
                <span className="text-rose-600 font-black">● ONE LONG BLAST (30s):</span>
                <span className="font-medium">Flood / Fire Advisory - Gather Go-Bags and prepare for fast evacuation.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-red-600 font-black">● CONTINUOUS BLASTS:</span>
                <span className="font-medium">EVACUATION NOW! Fire or flood hazards threatening your immediate sector.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-black">● TWO SHORT BLASTS:</span>
                <span className="font-medium">All Clear / Normal - Safe to return to your residences.</span>
              </div>
            </div>
          </div>

          {/* SIMULATED SMS CELLULAR LOGS DIAGNOSTICS */}
          <div className="bg-slate-100 p-4 rounded-2xl border border-slate-300 text-slate-800">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block mb-2.5 font-mono">
              📲 BDRRMC GSM GATEWAY SIMULATION LOGS:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto text-[10px] font-mono leading-relaxed divide-y divide-slate-200">
              {smsLogs.map((log, idx) => (
                <p key={idx} className="pt-1.5 text-slate-600 first:text-indigo-900 first:font-black">
                  {log}
                </p>
              ))}
            </div>
          </div>

        </div>
        )}

        {/* RIGHT COLUMN: LIST OF BROADCASTS */}
        <div className={`col-span-1 ${isPublicViewer ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-4`}>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-slate-400" />
                Active Early Warnings & Advisories Feed
              </h3>

              {/* Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-705 font-medium"
              >
                <option value="All">Lahat ng Warning Levels</option>
                <option value="Extreme Danger">Extreme Danger</option>
                <option value="Warning">Warning</option>
                <option value="Advisory">Advisory</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredAlerts.map((alert) => {
                const isExtreme = alert.severity === 'Extreme Danger';
                const isWarning = alert.severity === 'Warning';
                const isAdvisory = alert.severity === 'Advisory';

                let cardBgClass = 'bg-slate-50 border-slate-200 text-slate-900';
                let stripeClass = 'bg-slate-400';
                let badgeClass = 'bg-slate-100 text-slate-800 border border-slate-200';

                if (isExtreme) {
                  cardBgClass = 'bg-rose-50/65 border-rose-250 text-slate-950 shadow-3xs';
                  stripeClass = 'bg-rose-600 animate-pulse';
                  badgeClass = 'bg-red-100 text-red-900 border border-red-300 animate-pulse';
                } else if (isWarning) {
                  cardBgClass = 'bg-amber-50/50 border-amber-250 text-slate-900 shadow-3xs';
                  stripeClass = 'bg-amber-500';
                  badgeClass = 'bg-amber-100 text-amber-950 border border-amber-300';
                } else if (isAdvisory) {
                  cardBgClass = 'bg-blue-50/20 border-blue-200 text-slate-850';
                  stripeClass = 'bg-blue-500';
                  badgeClass = 'bg-blue-50 text-blue-900 border border-blue-200';
                }

                return (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-xl border relative overflow-hidden text-left ${cardBgClass}`}
                  >
                    {/* Left indicator stripe */}
                    <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${stripeClass}`} />

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${badgeClass}`}>
                        ⚠️ {alert.severity} • {alert.affectedArea}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 font-bold">
                        <Clock className="w-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="font-black text-xs tracking-tight text-slate-950 uppercase">
                      {alert.title}
                    </h4>

                    <p className="text-xs text-slate-800 mt-1.5 leading-relaxed font-medium">
                      {alert.message}
                    </p>

                    <div className="mt-3 pt-2 border-t border-dotted border-slate-200 text-[10px] text-slate-500 font-mono flex justify-between items-center">
                      <span>Broadcast Sent By: <strong>{alert.createdBy}</strong></span>
                      <div className="flex items-center gap-3 font-bold">
                        <span>SMS Text Channel: {alert.broadcastSMS ? 'Enabled (ON)' : 'Disabled'}</span>
                        {canModifyAlert(alert) ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartEditAlert(alert)}
                              className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 hover:text-amber-900 font-black border border-amber-250 rounded cursor-pointer transition-colors text-[9px] uppercase tracking-wide font-mono"
                            >
                              Change
                            </button>
                            <button
                              onClick={() => onDeleteAlert && onDeleteAlert(alert.id)}
                              className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 font-black border border-red-250 rounded cursor-pointer transition-colors text-[9px] uppercase tracking-wide font-mono"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          isAdmin && (
                            <span className="px-1 py-0.5 bg-slate-100 border border-slate-300 text-slate-500 rounded text-[9px] font-mono select-none">
                              🔒 Department Locked
                            </span>
                          )
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
              {filteredAlerts.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs font-medium">
                  Walang nakuhang anunsyo para sa piniling warning group.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
