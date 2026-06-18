import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, 
  MapPin, 
  Compass, 
  AlertTriangle, 
  PlusCircle, 
  Check, 
  Search,
  Flame,
  ShieldAlert,
  Users
} from 'lucide-react';
import { IncidentStatus } from '../types';

export default function MapsView({
  evacuationCenters,
  hydrants,
  reports,
  vulnerabilityRegistry,
  onAddHouseholdVulnerability,
  t,
  userRole,
  onUpdateReportStatus
}) {
  
  // Search state for Purok/hazard Lists
  const [searchQuery, setSearchQuery] = useState('');
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('All');

  // Selected spot state for displaying below the map
  const [selectedSpot, setSelectedSpot] = useState({
    id: 'purok-4',
    name: 'Purok 4 - Sawata Compound (High Danger Zone)',
    type: 'prone',
    description: 'High-density residential zone categorized as a Fire-Prone Area. Narrow alleys obstruct fire truck ingress, and tangled overhead electrical service connections multiply risk levels.',
    lat: 14.6418,
    lng: 120.9709,
    status: 'High Fire Prone Risk'
  });

  // Reference for Leaflet DOM container and map instance
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersGroupRef = useRef(null);
  const zonesGroupRef = useRef(null);

  // Pure list of custom Puroks with fire risk coordinates in Barangay 35 Maypajo, Caloocan
  const purokList = [
    {
      id: 'purok-1',
      name: 'Purok 1 - Chapel Street',
      desc: 'Old houses surrounding chapel area. Standard safety lanes, low brush ignition risk.',
      lat: 14.6395,
      lng: 120.9705,
      type: 'risk',
      status: 'Moderate Fire Risk'
    },
    {
      id: 'purok-2',
      name: 'Purok 2 - Daycare Area',
      desc: 'Mixed structures of concrete housing. Evacuation lane is directly open to chapel court.',
      lat: 14.6410,
      lng: 120.9715,
      type: 'risk',
      status: 'Safe Buffer Area'
    },
    {
      id: 'purok-3',
      name: 'Purok 3 - Solis Street Market Area',
      desc: 'High fire-prone vendor stalls. Crowded pathways restrict firefighter engine deployment. High density commercial LPG storage.',
      lat: 14.6405,
      lng: 120.9698,
      type: 'prone',
      status: 'Extreme Fire Prone Zone'
    },
    {
      id: 'purok-4',
      name: 'Purok 4 - Sawata Compound (Tangled Wires)',
      desc: 'High-density community wood houses. Dense network of tangled electrical service wires and sparks. Highly volatile fire hazard zone.',
      lat: 14.6418,
      lng: 120.9709,
      type: 'prone',
      status: 'Extreme Fire Prone Zone'
    },
    {
      id: 'purok-5',
      name: 'Purok 5 - Alleyway Safety Lane',
      desc: 'Main evacuation highway path leading to Rizal Ave. Standard layout with operational red hydrants.',
      lat: 14.6390,
      lng: 120.9719,
      type: 'evacuation',
      status: 'Active Fire Evacuation Way'
    }
  ];

  // Initialize Leaflet Map with light tile layer
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map if exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const L = window.L;
    if (!L) {
      console.error("Leaflet is not loaded on the window object.");
      return;
    }

    // Centered at Barangay 35 Maypajo, Caloocan (14.64028, 120.97082)
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      fadeAnimation: true,
      markerZoomAnimation: true
    }).setView([14.64028, 120.97082], 17);

    mapRef.current = map;

    // Beautiful street map Voyager (light gray background matching the mockup)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap | Barangay 35 Maypajo BDRRMC'
    }).addTo(map);

    // Create feature groups
    zonesGroupRef.current = L.featureGroup().addTo(map);
    markersGroupRef.current = L.featureGroup().addTo(map);

    // DRAW FIRE PRONE AREAS (Requirement 4: add an identification for fire prone areas)
    // Draw transparent amber-orange hazard circles designating high-risk fire-prone districts
    const fireProneSpots = [
      { lat: 14.6418, lng: 120.9709, radius: 75, name: 'Sawata High Fire Risk Comp.' },
      { lat: 14.6405, lng: 120.9698, radius: 65, name: 'Solis Street Market Hazard zone' }
    ];

    fireProneSpots.forEach(zone => {
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        color: '#f97316',       // Orange boundary
        fillColor: '#ef4444',   // Red fill
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '6, 6'
      })
      .bindPopup(`<b>🟠 FIRE PRONE DISTRICT: ${zone.name}</b><br/>High hazard density area. Limit electrical grid loading!`)
      .addTo(zonesGroupRef.current);
    });

    // Add Hydrants (RED Circle Markers)
    const hydrantsPositions = [
      { name: 'Hydrant Alpha', lat: 14.6393, lng: 120.9712, status: 'Operational' },
      { name: 'Hydrant Beta', lat: 14.6408, lng: 120.9702, status: 'Operational' },
      { name: 'Hydrant Gamma', lat: 14.6421, lng: 120.9718, status: 'Low Pressure' }
    ];

    hydrantsPositions.forEach(hyd => {
      const circleMarker = L.circleMarker([hyd.lat, hyd.lng], {
        radius: 7.5,
        fillColor: '#ef4444', // Red for fire hydrants
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.95,
        fillOpacity: 0.9
      })
      .bindPopup(`<b>🔥 Fire Hydrant Station</b><br/>Point: ${hyd.name}<br/>Status: <b>${hyd.status}</b>`)
      .on('click', () => {
        setSelectedSpot({
          id: hyd.name,
          name: `${hyd.name} - Fire Hydrant Point`,
          type: 'hydrant',
          description: `Crucial municipal firefighting installation located on the street path. Standby pressure: ${hyd.status === 'Operational' ? 'Optimal 60 PSI' : 'Decreased 15 PSI'}. Checked and verified by Bureau of Fire Protection volunteers.`,
          lat: hyd.lat,
          lng: hyd.lng,
          status: hyd.status
        });
      });
      
      markersGroupRef.current.addLayer(circleMarker);
    });

    // Add Evacuation Centers (GREEN Circle Markers)
    evacuationCenters.forEach(evac => {
      const circleMarker = L.circleMarker([evac.latitude, evac.longitude], {
        radius: 9,
        fillColor: '#22c55e', // Green for Evacuation Areas
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.95,
        fillOpacity: 0.9
      })
      .bindPopup(`<b>🟢 Evacuation Center: ${evac.name}</b><br/>Capacity: ${evac.currentOccupants}/${evac.maxCapacity}`)
      .on('click', () => {
        setSelectedSpot({
          id: evac.id,
          name: evac.name,
          type: 'evacuation',
          description: `Safe assembly shelter located in ${evac.locationName}. Features secure medical supplies, backup generator, disaster relief kitchen, and emergency restrooms.`,
          lat: evac.latitude,
          longitude: evac.longitude,
          status: evac.status
        });
      });
      
      markersGroupRef.current.addLayer(circleMarker);
    });

    // Add Tangled Wires Risks (YELLOW Circle Markers)
    purokList.forEach(purok => {
      const isProne = purok.type === 'prone';
      const color = isProne ? '#f97316' : '#eab308'; // Orange for fire-prone, Yellow for tangled wires
      
      const circleMarker = L.circleMarker([purok.lat, purok.lng], {
        radius: 8.5,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.95,
        fillOpacity: 0.9
      })
      .bindPopup(`<b>⚠️ Risk Point: ${purok.name}</b><br/>Hazard Grade: <b>${purok.status}</b>`)
      .on('click', () => {
        setSelectedSpot({
          id: purok.id,
          name: purok.name,
          type: isProne ? 'prone' : 'risk',
          description: purok.desc,
          lat: purok.lat,
          lng: purok.lng,
          status: purok.status
        });
      });
      
      markersGroupRef.current.addLayer(circleMarker);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [evacuationCenters]);

  // Zoom/pan map helper when purok is clicked on the right-hand street menu
  const handleSpotFocus = (spot) => {
    setSelectedSpot({
      id: spot.id,
      name: spot.name,
      type: spot.type,
      description: spot.desc || spot.description || 'Barangay 35 Local Infrastructure node.',
      lat: spot.lat,
      lng: spot.lng,
      status: spot.status
    });

    if (mapRef.current) {
      mapRef.current.setView([spot.lat, spot.lng], 18, { animate: true, duration: 1.2 });
      
      const L = window.L;
      if (L) {
        L.popup()
          .setLatLng([spot.lat, spot.lng])
          .setContent(`<b>📍 focusing on: ${spot.name}</b><br/><span style="font-size:10px;">Status: ${spot.status}</span>`)
          .openOn(mapRef.current);
      }
    }
  };

  // Filter list matching search query
  const filteredSpots = purokList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="hazard-map-main-block" className="space-y-4 text-slate-900 select-none">
      
      {/* 1. CONTAINER COMPONENT STYLED EXACTLY TO MATCH SCREENSHOT 1 */}
      <div className="bg-[#E5E9FA] border-2 border-slate-900/15 p-5 md:p-6 rounded-3xl grid grid-cols-1 lg:grid-cols-4 gap-6 shadow-sm">
        
        {/* Left column is Search box, Map, and Centered Label "MAP", with Legend underneath */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* SEARCH BAR CAPSULATION IN WEST BLOCK */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="search bar"
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              className="w-full bg-[#EAEDFC] border border-slate-300 focus:border-slate-500 rounded-full py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-500 font-medium focus:outline-none flex items-center transition-all shadow-xs"
            />
          </div>

          {/* Map Frame wrapper with border-2 rounded */}
          <div className="rounded-2xl border-2 border-slate-400 bg-white overflow-hidden relative">
            <div 
              id="leaflet-interactive-map-frame" 
              ref={mapContainerRef} 
              className="w-full z-10"
              style={{ height: '350px' }}
            />
          </div>

          {/* DYNAMIC HEADER LABEL: "MAP" WRITTEN IN CENTRED BOLD AS IN IMAGE 1 */}
          <div className="text-center">
            <span className="text-2xl font-black italic uppercase tracking-widest text-slate-950 font-sans leading-none block py-1">
              MAP
            </span>
          </div>

          {/* Legend Items structured exactly like the image labels */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2.5 border-t border-slate-300 text-xs font-bold text-slate-900">
            <div className="flex items-center gap-2">
              <span className="w-4.5 h-4.5 rounded-full bg-[#ef4444] border border-white shrink-0 block" />
              <span>Fire Hydrants</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4.5 h-4.5 rounded-full bg-[#22c55e] border border-white shrink-0 block" />
              <span>Evacuation Area</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4.5 h-4.5 rounded-full bg-[#eab308] border border-white shrink-0 block" />
              <span>Tangled Wires</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4.5 h-4.5 rounded-full bg-linear-to-tr from-red-500 to-orange-400 border border-white shrink-0 block animate-pulse" />
              <span className="text-orange-700">🔴 Fire Prone Areas</span>
            </div>
          </div>
        </div>

        {/* Right column sidebar containing SEARCH and STREET LIST */}
        <div className="lg:col-span-1 flex flex-col justify-between h-120 bg-[#EFF2FE] border border-slate-300 p-4 rounded-2xl relative">
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            
            {/* Search Street capsule */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search bar"
                className="w-full bg-[#F5F7FF] border border-slate-300 rounded-full py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-500 focus:outline-none focus:border-slate-400 font-medium"
              />
            </div>

            {/* List label */}
            <h3 className="font-extrabold italic uppercase text-slate-950 text-sm tracking-tight">
              list of purok/street
            </h3>

            {/* List items */}
            <div className="space-y-2">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => handleSpotFocus(spot)}
                  className={`p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${
                    selectedSpot.id === spot.id
                      ? 'bg-white border-slate-900 text-slate-950 font-bold shadow-sm'
                      : 'border-slate-300 hover:border-slate-500 bg-white/40 text-slate-850'
                  }`}
                >
                  <p className="font-black text-slate-900 flex items-center gap-1">
                    📍 {spot.name}
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium mt-0.5 leading-snug line-clamp-2">
                    {spot.desc}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[9px] font-mono text-amber-800 font-bold uppercase">
                    <span>hazard: {spot.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-3 pt-2.5 border-t border-slate-300 text-[10px] text-slate-500 font-bold font-mono text-center">
            Click street node to center map
          </div>
        </div>

      </div>

      {/* SELECTED SPOT DETAILED BOX */}
      {selectedSpot && (
        <div className="p-4 bg-white border-2 border-slate-950/15 rounded-2xl animate-fade-in shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-500/20 text-amber-600 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-950 font-mono">
              📍 FOCUS SPOT DETAILS: {selectedSpot.name} • <span className="text-orange-600">{selectedSpot.status}</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed max-w-4xl mt-0.5">
              {selectedSpot.description}
            </p>
          </div>
        </div>
      )}

      {/* 2. FIRE HAZARD REPORT TICKET LOGS & DISPATCH STATUS PANEL */}
      <div id="bdrrmc-ticket-record-logs" className="p-5 md:p-6 bg-[#EFF2FE] border-2 border-slate-900/15 rounded-3xl space-y-4">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-950 font-sans italic flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
              BDRRMC FIRE HAZARD RECORD LOGS & DISPATCH STATUS
            </h3>
            <p className="text-xs text-slate-700 leading-normal mt-0.5">
              Active incident registry of Barangay 35. Only the <strong className="text-orange-700 uppercase font-mono">System Admin</strong> is authorized to edit ticket dispatch status.
            </p>
          </div>
          
          {/* Active Status privilege Badge */}
          <div className="shrink-0">
            <span className={`px-3 py-1 text-[10px] font-mono font-bold rounded-full border ${
              userRole === 'Admin' 
                ? 'bg-amber-100 text-amber-800 border-amber-300' 
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}>
              👤 Privilege Level: <span className="uppercase">{userRole}</span> {userRole === 'Admin' ? '• AUTHORIZED' : '• READ-ONLY'}
            </span>
          </div>
        </div>

        {/* Search and Filters Strip */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#E5E9FA] p-3 rounded-2xl border border-slate-300">
          
          {/* Keyword Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-600" />
            <input
              type="text"
              value={ticketSearchQuery}
              onChange={(e) => setTicketSearchQuery(e.target.value)}
              placeholder="Search reports by title, location, or reporter..."
              className="w-full bg-white border border-slate-300 focus:border-slate-500 rounded-full py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-700 shrink-0">Filter Status:</span>
            <select
              value={ticketStatusFilter}
              onChange={(e) => setTicketStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-full py-1.5 px-3 pr-10 h-auto whitespace-normal wrap-break-word text-xs text-slate-800 focus:outline-none w-fit max-w-full cursor-pointer"
              style={{
                width: `calc(${
                  ({
                    "All": "All Statuses",
                    [IncidentStatus.PENDING]: "Pending",
                    [IncidentStatus.VERIFIED]: "Verified",
                    [IncidentStatus.DISPATCHED]: "Dispatched",
                    [IncidentStatus.RESOLVED]: "Resolved"
                  }[ticketStatusFilter] || ticketStatusFilter || '').length
                }ch + 3.5rem)`
              }}
            >
              <option value="All">All Statuses</option>
              <option value={IncidentStatus.PENDING}>Pending</option>
              <option value={IncidentStatus.VERIFIED}>Verified</option>
              <option value={IncidentStatus.DISPATCHED}>Dispatched</option>
              <option value={IncidentStatus.RESOLVED}>Resolved</option>
            </select>
          </div>
        </div>

        {/* Tickets Grid list */}
        <div className="space-y-3 max-h-120 overflow-y-auto pr-1">
          {reports && reports.filter(r => {
            const matchesSearch = 
              r.title.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
              r.description.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
              r.reporterName.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
              r.locationName.toLowerCase().includes(ticketSearchQuery.toLowerCase());
              
            const matchesStatus = ticketStatusFilter === 'All' || r.status === ticketStatusFilter;
            return matchesSearch && matchesStatus;
          }).length === 0 ? (
            <div className="p-10 border border-dashed border-slate-300 bg-white/50 rounded-2xl text-center text-xs text-slate-500 font-mono">
              No hazard report tickets found matching constraints.
            </div>
          ) : (
            reports.filter(r => {
              const matchesSearch = 
                r.title.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                r.description.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                r.reporterName.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                r.locationName.toLowerCase().includes(ticketSearchQuery.toLowerCase());
                
              const matchesStatus = ticketStatusFilter === 'All' || r.status === ticketStatusFilter;
              return matchesSearch && matchesStatus;
            }).map((report) => (
              <div 
                key={report.id}
                className="p-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all"
              >
                
                {/* Content Side */}
                <div className="space-y-2.5 flex-1">
                  
                  {/* Category and Title header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-full text-white ${
                      report.category.includes('Fire') || report.category.toLocaleLowerCase().includes('structural')
                        ? 'bg-red-600' 
                        : 'bg-orange-600'
                    }`}>
                      {report.category}
                    </span>
                    
                    <h4 className="font-extrabold text-sm text-slate-900 uppercase">
                      {report.title}
                    </h4>
                    
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                      ID: {report.id}
                    </span>
                  </div>

                  {/* Description text */}
                  <p className="text-xs text-slate-700 leading-normal max-w-3xl">
                    {report.description}
                  </p>

                  {/* Location & Metadata fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1.5 text-[11px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">📍 Location:</span>
                      <strong className="text-slate-800">{report.locationName}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">👤 Reporter:</span>
                      <strong className="text-slate-800">{report.reporterName}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">📞 Contact:</span>
                      <strong className="text-slate-800 font-mono">{report.reporterPhone}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">📆 Logged at:</span>
                      <strong className="text-slate-800 font-mono">{new Date(report.timestamp).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Status privilege changing side */}
                <div className="md:w-60 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 space-y-3 shrink-0">
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Current Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight text-center ${
                      report.status === IncidentStatus.PENDING 
                        ? 'bg-rose-100 text-rose-800 border-2 border-rose-300'
                        : report.status === IncidentStatus.VERIFIED
                        ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                        : report.status === IncidentStatus.DISPATCHED
                        ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                        : 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                    }`}>
                      ● {report.status}
                    </span>
                  </div>

                  {/* interactive Dropdown Selector for Admin ONLY */}
                  <div className="w-full">
                    {userRole === 'Admin' ? (
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-black text-rose-700 tracking-tight">
                          ⚙️ ADMIN ADVANCED DISPATCH STATUS:
                        </label>
                        <select
                          value={report.status}
                          onChange={(e) => onUpdateReportStatus(report.id, e.target.value)}
                          className="w-fit max-w-full text-xs py-2 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded border border-rose-400 bg-amber-50 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                          style={{
                            width: `calc(${
                              ({
                                [IncidentStatus.PENDING]: "Pending Report (Awaiting action)",
                                [IncidentStatus.VERIFIED]: "Verified Hazard (Confirmed)",
                                [IncidentStatus.DISPATCHED]: "Responder Dispatched (On route)",
                                [IncidentStatus.RESOLVED]: "Resolved (Declared Clean / Safe)"
                              }[report.status] || report.status || '').length
                            }ch + 3.5rem)`
                          }}
                        >
                          <option value={IncidentStatus.PENDING}>Pending Report (Awaiting action)</option>
                          <option value={IncidentStatus.VERIFIED}>Verified Hazard (Confirmed)</option>
                          <option value={IncidentStatus.DISPATCHED}>Responder Dispatched (On route)</option>
                          <option value={IncidentStatus.RESOLVED}>Resolved (Declared Clean / Safe)</option>
                        </select>
                      </div>
                    ) : (
                      <div className="p-2 border border-slate-300 bg-slate-100 rounded-xl text-[10px] text-slate-500 text-center font-bold">
                        🔒 Dropdown Locked. Only Admin privilege level is authorized to edit dispatch status codes.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
