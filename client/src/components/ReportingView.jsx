import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  MapPin, 
  PhoneCall, 
  User, 
  Camera, 
  Clock, 
  CheckCircle, 
  CircleDot, 
  MessageSquare, 
  Search, 
  Smartphone,
  Check
} from 'lucide-react';
import { IncidentCategory, IncidentStatus, PriorityLevel } from '../types';
import {
  E164_PHONE_REGEX,
  hasProfanity,
  isAllowedImage,
  normalizePhone,
  validateFullName
} from '../utils/validation';

export default function ReportingView({
  userRole,
  reports,
  onSubmitReport,
  onAddComment,
  isLoggedIn = false,
  currentUser = null,
  setShowAuthModal
}) {
  
  // Submit states
  const [category, setCategory] = useState('Fire');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [locationName, setLocationName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [customImage, setCustomImage] = useState('');
  const [fileSelectedName, setFileSelectedName] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');
  const [isReportSubmitting, setIsReportSubmitting] = useState(false);

  // Auto-fill reporter details if logged in
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      setReporterName(currentUser.name || '');
      setReporterPhone(currentUser.phone || '');
    }
  }, [isLoggedIn, currentUser]);

  // Search & Filter state for reports
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Comment updates state
  const [activeAccordionId, setActiveAccordionId] = useState(null);
  const [commentTextMap, setCommentTextMap] = useState({});

  // SMS subscription state
  const [smsPhone, setSmsPhone] = useState('');
  const [smsName, setSmsName] = useState('');
  const [smsTopics, setSmsTopics] = useState(['fire', 'electric_lpg']);
  const [smsRegistered, setSmsRegistered] = useState(false);

  const handleMockPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isAllowedImage(file)) {
        setReportError('Photo must be jpg, png, or webp and no larger than 5 MB.');
        e.target.value = '';
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(imageUrl);
        if (image.width < 100 || image.height < 100) {
          setReportError('Photo must be at least 100 x 100 pixels.');
          setFileSelectedName('');
          setCustomImage('');
          e.target.value = '';
          return;
        }
        setFileSelectedName(file.name);
        setCustomImage(
          category === 'Fire'
            ? 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&q=80&w=400'
            : 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=400'
        );
        setReportError('');
      };
      image.src = imageUrl;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isReportSubmitting) return;
    setReportError('');

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanReporterName = reporterName.trim();
    const cleanPhone = normalizePhone(reporterPhone);
    const cleanLocation = locationName.trim();

    if (!cleanTitle || !cleanDescription || !cleanReporterName || !cleanPhone || !cleanLocation) {
      setReportError('All required fields must be completed.');
      return;
    }
    if (cleanTitle.length > 100 || cleanDescription.length > 1000 || cleanLocation.length > 180) {
      setReportError('One or more fields exceeded the character limit.');
      return;
    }
    if (!validateFullName(cleanReporterName)) {
      setReportError('Name must include first and last name using letters, hyphens, or apostrophes only.');
      return;
    }
    if (!E164_PHONE_REGEX.test(cleanPhone)) {
      setReportError('Mobile number must use E.164 format, e.g. +639171234567.');
      return;
    }
    if ([cleanTitle, cleanDescription, cleanReporterName, cleanLocation].some(hasProfanity)) {
      setReportError('Please remove blocked language before submitting.');
      return;
    }
    setIsReportSubmitting(true);

    // Simulate coordinates based on selected location
    let lat = 14.6225;
    let lng = 121.0963;
    if (locationName.toLowerCase().includes('purok 1')) { lat = 14.6205; lng = 121.0940; }
    else if (locationName.toLowerCase().includes('purok 2')) { lat = 14.6242; lng = 121.0990; }
    else if (locationName.toLowerCase().includes('purok 3')) { lat = 14.6218; lng = 121.0955; }
    else if (locationName.toLowerCase().includes('purok 4')) { lat = 14.6235; lng = 121.0975; }

    onSubmitReport({
      category,
      title: cleanTitle,
      description: cleanDescription,
      reporterName: cleanReporterName,
      reporterPhone: cleanPhone,
      locationName: cleanLocation,
      latitude: lat,
      longitude: lng,
      image: customImage || 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&q=80&w=400',
      priority
    });

    setReportSuccess(true);
    setTimeout(() => {
      setTitle('');
      setDescription('');
      setReporterName('');
      setReporterPhone('');
      setLocationName('');
      setCustomImage('');
      setFileSelectedName('');
      setReportSuccess(false);
      setIsReportSubmitting(false);
    }, 2500);
  };

  // Toggle SMS subscription Topics
  const handleToggleSmsTopic = (topic) => {
    if (smsTopics.includes(topic)) {
      setSmsTopics(smsTopics.filter(t => t !== topic));
    } else {
      setSmsTopics([...smsTopics, topic]);
    }
  };

  const handleSmsSubmit = (e) => {
    e.preventDefault();
    if (!smsPhone || !smsName.trim()) return;

    const normalizedPhone = normalizePhone(smsPhone);
    if (!/^\+639\d{9}$/.test(normalizedPhone) || !validateFullName(smsName.trim())) return;

    setSmsRegistered(true);
    setTimeout(() => {
      setSmsRegistered(false);
      setSmsPhone('');
      setSmsName('');
    }, 3000);
  };

  const handleAddComment = (reportId) => {
    const text = commentTextMap[reportId];
    if (!text || !text.trim()) return;
    if (text.trim().length > 500 || hasProfanity(text)) return;

    onAddComment(reportId, text.trim());
    setCommentTextMap({
      ...commentTextMap,
      [reportId]: ''
    });
  };

  // Filter reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || r.category === filterCategory;

    // If Resident is logged in, show their own tickets by default. 
    // If they explicitly enter a search query, allow them to view details of any searchable ticket ID they specify.
    if (userRole === 'Resident' && currentUser) {
      const isMine = r.reporterName.toLowerCase() === currentUser.name.toLowerCase() || 
                     (currentUser.phone && r.reporterPhone === currentUser.phone);
      
      if (searchQuery.trim() === '') {
        return isMine && matchesCategory;
      } else {
        return matchesSearch && matchesCategory;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-[#EFF2FE] p-5 rounded-2xl border border-indigo-100 flex items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black px-1.5 py-0.5 rounded uppercase tracking-tight text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Resident Incident Reporting Center
          </h2>
          <p className="text-xs text-slate-700 mt-1">
            Report any fires, electrical hazards, or structural risk issues immediately to alert dispatchers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: HAZARD REPORT SUBMISSION FORM */}
        <div className="lg:col-span-1 space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
            
            {/* Red alert stripe for fire readiness */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600" />

            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase flex items-center gap-1.5 mb-4">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              Submit New Hazard Report (New Report)
            </h3>

            {reportSuccess ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="h-12 w-12 bg-emerald-55 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 mb-3 text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-extrabold text-slate-900">Report Successfully Submitted!</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Your fire hazard report has been logged and is currently being actioned by the BDRRMC command dispatcher. Call our hotlines directly for immediate fire emergencies.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3.5 text-left">
                {reportError && (
                  <div className="p-3 text-[11px] leading-relaxed bg-red-50 border border-red-300 text-red-900 rounded-lg font-bold">
                    {reportError}
                  </div>
                )}
                
                {/* Category Selection dropdown */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-700">
                    Incident Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full text-xs py-2 px-3 h-auto whitespace-normal break-words rounded-lg border border-slate-300 bg-slate-50 text-slate-905 focus:outline-none cursor-pointer hover:bg-slate-100/50"
                  >
                    <option value={IncidentCategory.FIRE}>🔥 Structural Fire Escape / Smoke</option>
                    <option value={IncidentCategory.ELECTRICAL_HAZARD}>⚡ Electrical Sparking / Grid Failure</option>
                    <option value={IncidentCategory.GAS_LEAK}>💨 LPG Leakage / Gas Odor</option>
                    <option value={IncidentCategory.RUBBISH_BURNING}>🗑️ Illegal Rubbish Burning</option>
                    <option value={IncidentCategory.FIRE_ALARM}>🚨 Active Fire Sprinkler Alert</option>
                  </select>
                </div>

                {/* Sub title */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-700">
                    Short Incident Title *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                    placeholder="e.g. Sparking power poles or active LPG leak in residential alley"
                    className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-slate-500 text-right font-mono">{title.length}/100</p>
                </div>

                {/* Detailed description */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-700">
                    Detailed Hazard Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                    placeholder="Describe exactly what you are seeing right now to aid fire crews..."
                    className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-slate-500 text-right font-mono">{description.length}/1000</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Reporter Name */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-700">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-700">
                      Primary Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 18))}
                      onBlur={() => setReporterPhone(normalizePhone(reporterPhone))}
                      placeholder="e.g. +639171234567"
                      className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Specific Location area */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-700">
                      Street Address / Purok / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={180}
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value.slice(0, 180))}
                      placeholder="e.g. Purok 3 J.P. Rizal St."
                      className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                    <p className="mt-1 text-[10px] text-slate-500 text-right font-mono">{locationName.length}/180</p>
                  </div>

                  {/* Priority indicator */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-700">
                      Threat Urgency Level (Priority)
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="mt-1 w-full text-xs py-2 px-3 h-auto whitespace-normal break-words rounded-lg border border-slate-300 bg-slate-50 text-slate-905 focus:outline-none cursor-pointer hover:bg-slate-100/50"
                    >
                      <option value={PriorityLevel.HIGH}>🔴 High (Threat to life & structures)</option>
                      <option value={PriorityLevel.MEDIUM}>🟡 Medium (Property damage at risk)</option>
                      <option value={PriorityLevel.LOW}>🟢 Low (Minor safety concern / obstacle)</option>
                    </select>
                  </div>
                </div>

                {/* File Attachment Upload with simulator display */}
                <div className="pt-1.5 border-t border-dashed border-slate-205">
                  <label className="block text-[10px] uppercase font-bold text-slate-700 mb-1">
                    Upload Photo Evidence (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center justify-center h-11 w-11 rounded-lg border-2 border-dashed border-slate-300 hover:border-rose-500 cursor-pointer bg-slate-50">
                      <Camera className="w-5 h-5 text-slate-500" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleMockPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="flex-1 text-[11px]">
                      {fileSelectedName ? (
                        <div>
                          <p className="text-emerald-755 font-bold max-w-45 truncate">{fileSelectedName}</p>
                          <p className="text-[10px] text-slate-400">Attached successfully</p>
                        </div>
                      ) : (
                        <p className="text-slate-400">No image attachment selected (Optional)</p>
                      )}
                    </div>
                  </div>
                  {customImage && (
                    <div className="mt-2.5 rounded-lg overflow-hidden border border-slate-200 h-28 w-full bg-slate-100">
                      <img 
                        src={customImage} 
                        alt="Hazard upload preview" 
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isReportSubmitting}
                  className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-extrabold text-xs shadow hover:shadow-md transition-all active:scale-95 text-center disabled:cursor-not-allowed"
                >
                  {isReportSubmitting ? 'SENDING...' : 'SEND EMERGENCY FIRE REPORT NOW'}
                </button>
              </form>
            )}
          </div>

          {/* SMS ALERT BROADCAST SUBSCRIPTION UI (SMS Broadcast) */}
          <div className="bg-[#E5E9FA] p-5 rounded-2xl border-2 border-slate-900/15 text-slate-900 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mr-6 -mt-6" />
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-2 font-mono">
              <Smartphone className="w-4 h-4 text-indigo-600 animate-bounce" />
              Barangay SMS Warning Registry
            </h4>
            <p className="text-[11px] text-slate-800 leading-relaxed mt-1">
              Join our emergency text dispatch warnings broad list. Receive free real-time text warnings in case of active fires or electrical/LPG hazards in your specific street.
            </p>

            {smsRegistered ? (
              <div className="p-4 mt-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-lg text-center font-mono">
                ✓ PHONE NUMBER SUBSCRIBED FOR WARNINGS!
              </div>
            ) : (
              <form onSubmit={handleSmsSubmit} className="mt-3 space-y-2.5 text-left">
                <div>
                  <input
                    type="text"
                    required
                    value={smsName}
                    onChange={(e) => setSmsName(e.target.value)}
                    placeholder="Full Name (e.g. Jane Doe)"
                    className="w-full text-xs p-2.5 rounded bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={18}
                    pattern="\+[1-9][0-9]{7,14}"
                    value={smsPhone}
                    onChange={(e) => {
                      setSmsPhone(e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 18));
                    }}
                    onBlur={() => setSmsPhone(normalizePhone(smsPhone))}
                    placeholder="+639XXXXXXXXX"
                    className="w-full text-xs p-2.5 rounded bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleSmsTopic('fire')}
                    className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg border text-center transition-colors font-mono uppercase tracking-tight ${
                      smsTopics.includes('fire') 
                        ? 'bg-rose-100 border-rose-400 text-rose-800' 
                        : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-205 hover:text-slate-900'
                    }`}
                  >
                    🔥 Fire Sirens
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSmsTopic('electric_lpg')}
                    className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg border text-center transition-colors font-mono uppercase tracking-tight ${
                      smsTopics.includes('electric_lpg') 
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900' 
                        : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-205 hover:text-slate-900'
                    }`}
                  >
                    ⚡ LPG Sparks
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg tracking-wider text-center uppercase font-mono shadow-xs cursor-pointer border border-indigo-700"
                >
                  SUBSCRIBE PHONE FOR ALERT ALERTS
                </button>
              </form>
            )}

            <p className="mt-2 text-[9px] text-slate-600 italic text-center font-mono">
              * Zero charges. Simulated response system utilizing the official BDRRMC local gateway integration.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: SEARCHABLE INCIDENT LIST WITH TIMELINE STEP TRACKERS */}
        <div className="col-span-1 lg:col-span-2 space-y-4 text-left">
          
          <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-50 pb-3 mb-4 text-left">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  <Clock className="w-4 h-4 text-slate-500" />
                  Active Reports and Status History (Reports History)
                </h3>
                <p className="text-xs text-slate-600">Track and monitor reported incidents along with authorized dispatch personnel logging updates</p>
              </div>

              {/* Search input and category filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-xs py-1.5 px-3 h-auto whitespace-normal break-words rounded-lg border border-slate-300 bg-slate-50 text-slate-950 focus:outline-none font-mono w-full sm:w-auto min-w-[150px] max-w-full cursor-pointer hover:bg-slate-100/50"
                >
                  <option value="All">All Types</option>
                  <option value={IncidentCategory.FIRE}>Structural Fire</option>
                  <option value={IncidentCategory.ELECTRICAL_HAZARD}>Electrical Hazard</option>
                  <option value={IncidentCategory.GAS_LEAK}>LPG / Gas Leak</option>
                  <option value={IncidentCategory.RUBBISH_BURNING}>Rubbish Burning</option>
                  <option value={IncidentCategory.FIRE_ALARM}>Fire Alarm</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reports..."
                    className="text-xs p-1.5 pl-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* List of filtered reports */}
            <div className="space-y-4">
              {filteredReports.map(report => {
                const isOpen = activeAccordionId === report.id;
                return (
                  <div 
                    key={report.id}
                    className="p-4 rounded-xl border border-indigo-100 hover:bg-indigo-50/20 text-left transition-colors bg-white shadow-3xs"
                  >
                    
                    {/* Upper row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-50 pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-black rounded-full uppercase leading-none ${
                          report.category === IncidentCategory.FIRE 
                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                            : report.category === IncidentCategory.ELECTRICAL_HAZARD
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : report.category === IncidentCategory.GAS_LEAK
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : report.category === IncidentCategory.RUBBISH_BURNING
                            ? 'bg-yellow-100 text-yellow-850 border border-yellow-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {report.category}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-950 font-sans tracking-tight">
                          {report.title}
                        </h4>
                      </div>
                      
                      {/* Priority Tag */}
                      <span className={`px-2 py-0.5 text-[9px] font-black font-mono uppercase tracking-wider rounded ${
                        report.priority === PriorityLevel.HIGH ? 'bg-red-50 text-red-700 border border-red-200' :
                        report.priority === PriorityLevel.MEDIUM ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {report.priority} Priority
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed mb-3">
                      {report.description}
                    </p>

                    {report.fireAlarmLevel && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 mb-3.5 p-2.5 bg-indigo-50/40 border border-slate-200 rounded-xl font-mono text-[10px] text-slate-900 shadow-3xs">
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

                    {/* PHOTO ATTACHMENT DISPLAY DIRECT IN WORKSPACE */}
                    {report.image && (
                      <div className="mb-3.5 rounded-xl overflow-hidden border border-slate-200 max-h-48 w-full bg-slate-50">
                        <img 
                          src={report.image} 
                          alt="Incident Report attachment" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}

                    {/* IN-DEPTH TRACKING STEP VISUALIZER STATUS BAR */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 font-mono">
                        🔍 STEP-BY-STEP EMERGENCY STATUS TRACKER:
                      </span>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] relative">
                        
                        {/* Step 1: Pending */}
                        <div className="flex flex-col items-center">
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold mb-1 ${
                            report.status === IncidentStatus.PENDING || report.status === IncidentStatus.VERIFIED || report.status === IncidentStatus.DISPATCHED || report.status === IncidentStatus.RESOLVED
                              ? 'bg-rose-600 text-white font-black' 
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            1
                          </div>
                          <span className="font-bold text-slate-700">Pending</span>
                        </div>

                        {/* Step 2: Verified */}
                        <div className="flex flex-col items-center">
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold mb-1 ${
                            report.status === IncidentStatus.VERIFIED || report.status === IncidentStatus.DISPATCHED || report.status === IncidentStatus.RESOLVED
                              ? 'bg-indigo-600 text-white font-black' 
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            2
                          </div>
                          <span className="font-bold text-slate-700">Verified</span>
                        </div>

                        {/* Step 3: Dispatched */}
                        <div className="flex flex-col items-center">
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold mb-1 ${
                            report.status === IncidentStatus.DISPATCHED || report.status === IncidentStatus.RESOLVED
                              ? 'bg-rose-600 text-white font-black animate-pulse' 
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            3
                          </div>
                          <span className="font-bold text-slate-700">Dispatched</span>
                        </div>

                        {/* Step 4: Resolved */}
                        <div className="flex flex-col items-center">
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold mb-1 ${
                            report.status === IncidentStatus.RESOLVED
                              ? 'bg-emerald-600 text-white font-black' 
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            ✓
                          </div>
                          <span className="font-bold text-slate-700">Resolved</span>
                        </div>

                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-100">
                      <div>
                        👤 Inulat ni: <strong className="text-slate-800">{report.reporterName}</strong> | {report.reporterPhone}
                      </div>
                      <div>
                        📍 Sektor: <strong className="text-slate-800">{report.locationName}</strong>
                      </div>
                    </div>

                    {/* OFFICIAL DISPATCH ACTION CHAT */}
                    <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200">
                      <button
                        onClick={() => setActiveAccordionId(isOpen ? null : report.id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{report.comments.length} Dispatch Comments & Logs ({isOpen ? 'Collapse' : 'Expand'})</span>
                      </button>

                      {isOpen && (
                        <div className="mt-3.5 space-y-2 bg-indigo-50/30 p-3 rounded-xl border border-indigo-100">
                          {report.comments.map(comment => (
                            <div key={comment.id} className="text-xs p-3 rounded-xl bg-white shadow-3xs border border-slate-100">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-extrabold text-slate-900 text-[11px]">
                                  {comment.author} ({comment.role})
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-slate-700 text-[11px] leading-relaxed">{comment.text}</p>
                            </div>
                          ))}

                          {/* Quick reply comment box */}
                          <div className="flex gap-2 pt-1.5Packed">
                            <input
                              type="text"
                              maxLength={500}
                              value={commentTextMap[report.id] || ''}
                              onChange={(e) => setCommentTextMap({
                                ...commentTextMap,
                                [report.id]: e.target.value.slice(0, 500)
                              })}
                              placeholder="Type a reply or request update on current status details..."
                              className="flex-1 text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none placeholder-slate-400"
                            />
                            <button
                              onClick={() => handleAddComment(report.id)}
                              className="bg-indigo-600 hover:bg-slate-900 text-white text-xs px-3.5 rounded-lg font-black uppercase tracking-tight"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}

              {filteredReports.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs font-medium font-mono">
                  No active hazard logs found matches your query. Keep safe!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
