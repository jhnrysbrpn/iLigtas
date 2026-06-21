import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  MapPin, 
  PhoneCall, 
  Flame, 
  AlertTriangle, 
  Heart, 
  Search, 
  Activity, 
  Bell, 
  HelpCircle, 
  ShieldCheck, 
  Grid 
} from 'lucide-react';
import { 
  IncidentCategory, 
  IncidentStatus, 
  PriorityLevel, 
  AlertSeverity 
} from './types';

// Mock Data Imports
import { 
  INITIAL_ALERTS, 
  INITIAL_HAZARD_REPORTS, 
  INITIAL_EVACUATION_CENTERS, 
  INITIAL_PROGRAMS, 
  INITIAL_STOCKPILE, 
  INITIAL_VULNERABILITY_REGISTRY, 
  HYDRANTS_DATA, 
  RELIEF_DISTRIBUTION_MOCK 
} from './data/mockData';

// Component Imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import MapsView from './components/MapsView';
import ReportingView from './components/ReportingView';
import PreparednessView from './components/PreparednessView';
import ResponseRecoveryView from './components/ResponseRecoveryView';
import AlertsView from './components/AlertsView';
import InterDepartmentView from './components/InterDepartmentView';
import AuthModal from './components/AuthModal';
import GoBagPlannerView from './components/GoBagPlannerView';
import { supabase } from './supabaseClient';

export default function App() {
  
  // Sidebar State (Mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Current View / Tab State
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Currently Active Role Sandbox simulating privileges
  const [userRole, setUserRole] = useState('Resident');

  // Custom persistent states for login
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bdrrmc_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bdrrmc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [usersList, setUsersList] = useState(() => {
    const defaultUsers = [
      { name: 'Kagawad Jaime Ortiz', username: 'admin', email: 'jaime.ortiz@maypajo.gov.ph', phone: '0917-828-9111', password: 'admin', role: 'Admin', department: 'rescue', departmentId: 'RES-101', approved: true },
      { name: 'SFO4 Juan Dela Cruz', username: 'bfpadmin', email: 'juan.delacruz@bfp.gov.ph', phone: '0917-001-9111', password: 'bfpadmin', role: 'Admin', department: 'bfp', departmentId: 'BFP-911', approved: true },
      { name: 'Dr. Jane Doe V', username: 'healthadmin', email: 'jane.doe@redcross.org.ph', phone: '0917-003-9111', password: 'healthadmin', role: 'Admin', department: 'medics', departmentId: 'MDC-911', approved: true },
      { name: 'Developer Super Admin', username: 'supadmin', email: 'developer@maypajo.gov.ph', phone: '0917-999-0000', password: 'supadmin', role: 'SuperAdmin', department: 'system', departmentId: 'SYS-001', approved: true }
    ];
    const saved = localStorage.getItem('_users_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = [...parsed];
        defaultUsers.forEach(du => {
          const index = merged.findIndex(u => u && u.username && u.username.toLowerCase() === du.username.toLowerCase());
          if (index === -1) {
            merged.push(du);
          } else {
            // Overwrite with fresh default values to make sure admin and superadmin accounts exist
            merged[index] = { ...du, ...merged[index], role: du.role, approved: true };
          }
        });
        return merged;
      } catch (e) {
        return defaultUsers;
      }
    }
    return defaultUsers;
  });

  const [broadcastPublicMode, setBroadcastPublicMode] = useState(() => {
    return localStorage.getItem('bdrrmc_broadcast_portal_public_mode') === 'true';
  });

  const handleToggleBroadcastPublicMode = () => {
    const nextVal = !broadcastPublicMode;
    setBroadcastPublicMode(nextVal);
    localStorage.setItem('bdrrmc_broadcast_portal_public_mode', String(nextVal));
    window.dispatchEvent(new CustomEvent('bdrrmc-broadcast-mode-updated', { detail: nextVal }));
  };

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sync role to user selection on reload/state update to make role management updates live
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const freshUser = usersList.find(u => u.username?.toLowerCase() === currentUser.username?.toLowerCase() || u.email?.toLowerCase() === currentUser.email?.toLowerCase());
      if (freshUser) {
        const activeRole = (freshUser.approved || freshUser.role === 'Resident') ? freshUser.role : 'Resident';
        setUserRole(activeRole);
        
        // Also update currentUser info in state
        const updatedCurrentUser = {
          ...currentUser,
          role: activeRole,
          department: freshUser.department,
          departmentId: freshUser.departmentId
        };
        if (JSON.stringify(updatedCurrentUser) !== JSON.stringify(currentUser)) {
          setCurrentUser(updatedCurrentUser);
          localStorage.setItem('bdrrmc_user', JSON.stringify(updatedCurrentUser));
        }
      } else {
        setUserRole(currentUser.role);
      }
    } else {
      setUserRole('Resident');
    }
  }, [isLoggedIn, currentUser, usersList]);

  const handleAuthSuccess = (username, name, role, email, phone) => {
    setIsLoggedIn(true);
    const matchedUser = usersList.find(u => u && u.username && u.username.toLowerCase() === username.toLowerCase());
    const user = { 
      name, 
      username: username.toLowerCase(),
      role, 
      email, 
      phone,
      department: matchedUser?.department,
      departmentId: matchedUser?.departmentId
    };
    setCurrentUser(user);
    setUserRole(role);
    localStorage.setItem('bdrrmc_logged_in', 'true');
    localStorage.setItem('bdrrmc_user', JSON.stringify(user));
  };

  // Core synchronized Local States backed by localStorage
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);

  const [evacuationCenters, setEvacuationCenters] = useState(() => {
    const saved = localStorage.getItem('bdrrmc_evacuation_centers');
    return saved ? JSON.parse(saved) : INITIAL_EVACUATION_CENTERS;
  });

  const [programs, setPrograms] = useState(() => {
    const saved = localStorage.getItem('bdrrmc_programs');
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [stockpile, setStockpile] = useState(() => {
    const saved = localStorage.getItem('bdrrmc_stockpile');
    return saved ? JSON.parse(saved) : INITIAL_STOCKPILE;
  });

  const [vulnerabilityRegistry, setVulnerabilityRegistry] = useState(() => {
    const saved = localStorage.getItem('bdrrmc_vulnerability_registry');
    return saved ? JSON.parse(saved) : INITIAL_VULNERABILITY_REGISTRY;
  });

  const [distributions, setDistributions] = useState(() => {
    const saved = localStorage.getItem('bdrrmc_distributions');
    return saved ? JSON.parse(saved) : RELIEF_DISTRIBUTION_MOCK;
  });

  // Hydrants list (Keep cached mapping simple)
  const [hydrants] = useState(HYDRANTS_DATA);

  // Fetch Alerts and Reports from Backend database on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        // 1. Fetch Alerts from Supabase
        const { data: alertsData, error: alertsError } = await supabase
          .from('alerts')
          .select('*')
          .order('timestamp', { ascending: false });

        if (alertsError) throw alertsError;

        if (alertsData) {
          const mappedAlerts = alertsData.map(a => ({
            id: String(a.id),
            title: a.title,
            severity: a.severity,
            message: a.message,
            affectedArea: a.affected_area,
            timestamp: a.timestamp,
            isActive: a.is_active,
            createdBy: a.created_by,
            broadcastSMS: a.broadcast_sms
          }));
          setAlerts(mappedAlerts);
        }

        // 2. Fetch Hazard Reports (with nested Comments) from Supabase
        const { data: reportsData, error: reportsError } = await supabase
          .from('hazard_reports')
          .select(`
            *,
            comments (*)
          `)
          .order('timestamp', { ascending: false });

        if (reportsError) throw reportsError;

        if (reportsData) {
          const mappedReports = reportsData.map(r => ({
            id: String(r.id),
            category: r.category,
            title: r.title,
            description: r.description,
            reporterName: r.reporter_name,
            reporterPhone: r.reporter_phone,
            locationName: r.location_name,
            latitude: r.latitude,
            longitude: r.longitude,
            status: r.status,
            priority: r.priority,
            assignedResponder: r.assigned_responder,
            affectedFamiliesCount: r.affected_families_count,
            damageCostEstimated: r.damage_cost_estimated,
            timestamp: r.timestamp,
            comments: (r.comments || []).map(c => ({
              id: String(c.id),
              author: c.author,
              role: c.role,
              text: c.text,
              timestamp: c.timestamp
            }))
          }));
          setReports(mappedReports);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local storage:", err);
        const savedAlerts = localStorage.getItem('bdrrmc_alerts');
        setAlerts(savedAlerts ? JSON.parse(savedAlerts) : INITIAL_ALERTS);
        const savedReports = localStorage.getItem('bdrrmc_reports');
        setReports(savedReports ? JSON.parse(savedReports) : INITIAL_HAZARD_REPORTS);
      }
    };

    fetchBackendData();
  }, []);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('bdrrmc_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('bdrrmc_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('bdrrmc_evacuation_centers', JSON.stringify(evacuationCenters));
  }, [evacuationCenters]);

  useEffect(() => {
    localStorage.setItem('bdrrmc_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('bdrrmc_stockpile', JSON.stringify(stockpile));
  }, [stockpile]);

  useEffect(() => {
    localStorage.setItem('bdrrmc_vulnerability_registry', JSON.stringify(vulnerabilityRegistry));
  }, [vulnerabilityRegistry]);

  useEffect(() => {
    localStorage.setItem('bdrrmc_distributions', JSON.stringify(distributions));
  }, [distributions]);

  // MUTATION WORKFLOW 1: Direct SOS Panic Trigger Action
  const handleTriggerSOS = (category, locationName, notes, waterLevel = 'Adequate', taskUrgency = 'High', fireAlarmLevel = 'First Alarm') => {
    const finalDescription = notes && notes.trim() !== '' ? notes : 'cause: Under Investigation';

    const newReport = {
      id: `rep-sos-${Date.now()}`,
      category,
      title: `⚡ SOS DISTRESS: ${category} reported at ${locationName}`,
      description: finalDescription,
      reporterName: 'Resident SOS Emergency Trigger',
      reporterPhone: '0911-SOS-911',
      locationName,
      latitude: 14.6225 + (Math.random() - 0.5) * 0.005,
      longitude: 121.0963 + (Math.random() - 0.5) * 0.005,
      status: IncidentStatus.DISPATCHED, // Instantly dispatched in simulated command
      priority: PriorityLevel.HIGH,
      timestamp: new Date().toISOString(),
      waterLevel,
      taskUrgency,
      fireAlarmLevel,
      comments: [
        {
          id: `comm-sos-${Date.now()}`,
          author: 'BDRRMC Autonomous Command',
          role: 'Admin',
          text: `⚡ EMERGENCY SOS DETECTED! Water Level Supply: ${waterLevel}. Urgency: ${taskUrgency}. Alarm Level: ${fireAlarmLevel}. Responders and paramedic sirens dispatched. Detail cause: ${finalDescription}`,
          timestamp: new Date().toISOString()
        }
      ],
      assignedResponder: 'Barangay Rescue Alpha & Paramedic Unit'
    };

    setReports([newReport, ...reports]);

    // Send the SOS details and location in real-time to the inter-department system
    try {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Load current logs
      let currentLogs = [];
      const savedLogs = localStorage.getItem('bdrrmc_ids_logs');
      if (savedLogs) {
        currentLogs = JSON.parse(savedLogs);
      } else {
        currentLogs = [
          { id: 'log-1', time: '12:40 PM', departmentId: 'rescue', message: 'Evacuation Sweep Team Alpha successfully evacuated 4 bedridden elderly from outer Solis sector.', type: 'success' },
          { id: 'log-2', time: '12:35 PM', departmentId: 'bfp', message: 'BFP Engine 5 reports flame spread hazard on wood frame structure has been partially checked.', type: 'info' },
          { id: 'log-3', time: '12:30 PM', departmentId: 'medics', message: 'Medic unit set up an additional oxygen booster station near Maypajo Secondary Space.', type: 'dispatch' }
        ];
      }

      // Prepend dynamic SOS logs
      const sosLog = {
        id: `sos-warn-${Date.now()}`,
        time: timeNow,
        departmentId: 'rescue',
        message: `🚨 RESIDENT SOS: [${category}] at [${locationName}]. [Water: ${waterLevel}] [Urgency: ${taskUrgency}] [Alarm: ${fireAlarmLevel}] - Details: ${finalDescription}`,
        type: 'warning'
      };

      const dispatchLog = {
        id: `sos-disp-${Date.now()}`,
        time: timeNow,
        departmentId: 'bfp',
        message: `🚚 BFP RESPONSE: Engaged with [Fire Alarm: ${fireAlarmLevel}] at [${locationName}]. Water supply: ${waterLevel}.`,
        type: 'dispatch'
      };

      const rescueLog = {
        id: `sos-rescue-${Date.now()}`,
        time: timeNow,
        departmentId: 'rescue',
        message: `🚑 MEDICAL DEPLOYMENT: Urgency [${taskUrgency}] triggered. Ambulance and evacuation squads heading to [${locationName}] instantly.`,
        type: 'success'
      };

      const updatedLogs = [sosLog, dispatchLog, rescueLog, ...currentLogs];
      localStorage.setItem('bdrrmc_ids_logs', JSON.stringify(updatedLogs));

      // Append new Action Deployments to Departments so responders can "Take Action"
      let currentDepts = [];
      const savedDepts = localStorage.getItem('bdrrmc_ids_departments');
      if (savedDepts) {
        currentDepts = JSON.parse(savedDepts);
      } else {
        currentDepts = [
          {
            id: 'bfp',
            name: 'Bureau of Fire Protection (BFP) Maypajo',
            leader: 'SFO4 Juan Dela Cruz',
            personnelActive: 18,
            status: 'Suppressing Secondary Fires',
            color: 'border-red-600 bg-red-50/50 hover:bg-red-50',
            deployments: []
          },
          {
            id: 'rescue',
            name: 'Barangay Rescue & Evacuation Squad',
            leader: 'Kagawad Jaime Ortiz',
            personnelActive: 12,
            status: 'Conducting House Sweep Search',
            color: 'border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50',
            deployments: []
          }
        ];
      }

      const updatedDepts = currentDepts.map((dept) => {
        if (dept.id === 'bfp') {
          const bfpAssetPool = [
            'BFP SOS Fast-Response Engine 4',
            'BFP Support Tanker 1',
            'BFP Specialized Pumper Truck 8',
            'BFP Escalation Ladder 12',
            'BFP Water Tanker 3'
          ];
          const bfpCount = (dept.deployments || []).length;
          const assignedName = bfpAssetPool[bfpCount % bfpAssetPool.length];

          return {
            ...dept,
            status: `Suppressing active SOS report at ${locationName}`,
            deployments: [
              {
                id: `dep-sos-bfp-${Date.now()}`,
                teamName: assignedName,
                location: locationName,
                task: `Immediate containment and extinguishing of reported ${category.toLowerCase()} crisis.`,
                timeSent: timeNow,
                fireAlarmLevel: fireAlarmLevel,
                taskUrgency: taskUrgency,
                waterLevel: waterLevel,
                timelineHistory: [
                  `${timeNow} - Dispatched ➡️ En route`,
                  `${timeNow} - Active Suppression Initiated`
                ]
              },
              ...(dept.deployments || [])
            ]
          };
        }
        if (dept.id === 'rescue') {
          const rescueAssetPool = [
            'Barangay Rescue Quick-Alpha Squad',
            'Maypajo Medical Ambulance 2',
            'Barangay House Sweep Team Bravo',
            'BDRRMC Rescue Action Squad 1'
          ];
          const rescueCount = (dept.deployments || []).length;
          const assignedName = rescueAssetPool[rescueCount % rescueAssetPool.length];

          return {
            ...dept,
            status: `Evacuation and shelter transport at ${locationName}`,
            deployments: [
              {
                id: `dep-sos-rescue-${Date.now()}`,
                teamName: assignedName,
                location: locationName,
                task: `Sweeping sector, guiding families to primary evac centers, and administering emergency aid.`,
                timeSent: timeNow,
                fireAlarmLevel: fireAlarmLevel,
                taskUrgency: taskUrgency,
                waterLevel: waterLevel,
                timelineHistory: [
                  `${timeNow} - Dispatched ➡️ Mobilizing Medics`,
                  `${timeNow} - Active Evacuation Launch`
                ]
              },
              ...(dept.deployments || [])
            ]
          };
        }
        return dept;
      });

      localStorage.setItem('bdrrmc_ids_departments', JSON.stringify(updatedDepts));

      // Trigger custom window event to instantly redraw components that display these datasets
      window.dispatchEvent(new CustomEvent('bdrrmc-sos-triggered', {
        detail: { location: locationName, category }
      }));
    } catch (e) {
      console.error('Failed to sync SOS with inter-department records:', e);
    }
  };

  // MUTATION WORKFLOW 2: Hazard/Incident Report Submission
  const handleSubmitReport = (newReportData) => {
    const newReport = {
      ...newReportData,
      id: `rep-usr-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: IncidentStatus.PENDING,
      comments: []
    };

    setReports([newReport, ...reports]);
  };

  // MUTATION WORKFLOW 3: Add Comment thread Update (Dispatched enroute logs)
  const handleAddComment = (reportId, text) => {
    const updatedReports = reports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          comments: [
            ...r.comments,
            {
              id: `comm-${Date.now()}`,
              author: userRole === 'Admin' ? 'Punong Brgy Santos' : userRole === 'Responder' ? 'SFO1 Michael Abad' : 'Reporter Residente',
              role: userRole,
              text,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return r;
    });

    setReports(updatedReports);
  };

  // MUTATION WORKFLOW 4: Modify Incident Status Code (Official enforcers only)
  const handleUpdateReportStatus = (reportId, status) => {
    if (userRole !== 'Admin' && userRole !== 'SuperAdmin') return;

    const updatedReports = reports.map(r => {
      if (r.id === reportId) {
        const commentAuthor = currentUser?.name || 'BDRRMC Center Dispatcher';
        const statusNotes = `Status updated to [${status}] by ${userRole === 'SuperAdmin' ? 'Barangay SuperAdmin' : 'BDRRMC officials'}.`;
        
        return {
          ...r,
          status,
          comments: [
            ...r.comments,
            {
              id: `comm-stat-${Date.now()}`,
              author: commentAuthor,
              role: userRole,
              text: statusNotes,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return r;
    });

    setReports(updatedReports);
  };

  // MUTATION WORKFLOW 5: Quick Warning Broadcast (Front side trigger)
  const handleQuickBroadcast = (title, message, severity) => {
    const newAlert = {
      id: `alt-q-${Date.now()}`,
      title,
      severity,
      message,
      affectedArea: 'Main Barangay Purok zones',
      timestamp: new Date().toISOString(),
      isActive: true,
      createdBy: 'Barangay Office Command',
      broadcastSMS: true
    };

    setAlerts([newAlert, ...alerts]);
  };

  // MUTATION WORKFLOW 6: Full Broadcast warning form
  const handleAddAlert = (alertData) => {
    const newAlert = {
      ...alertData,
      id: `alt-full-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setAlerts([newAlert, ...alerts]);
  };

  // MUTATION WORKFLOW 7: Register Name to Seminars
  const handleRegisterForProgram = (programId, name) => {
    const updatedPrograms = programs.map(p => {
      if (p.id === programId) {
        return {
          ...p,
          registrantsCount: p.registrantsCount + 1,
          registeredUsers: [...p.registeredUsers, name]
        };
      }
      return p;
    });

    setPrograms(updatedPrograms);
  };

  // MUTATION WORKFLOW 8: Modify Stockpile values (Restock action)
  const handleModifyStockpile = (itemId, newQty) => {
    const updatedStockpile = stockpile.map(s => {
      if (s.id === itemId) {
        return {
          ...s,
          quantity: newQty,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    });

    setStockpile(updatedStockpile);
  };

  // MUTATION WORKFLOW 9: Add Household registry details
  const handleAddHouseholdVulnerability = (hhData) => {
    const newHH = {
      ...hhData,
      id: `hh-${Date.now()}`,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    setVulnerabilityRegistry([newHH, ...vulnerabilityRegistry]);
  };

  // MUTATION WORKFLOW 10: Victim intake report
  const handleAddVictimIntake = (victim) => {
    // Also simulate adding occupants to evacuation center
    if (victim.center !== 'home') {
      const updatedCenters = evacuationCenters.map(c => {
        if (c.name === victim.center) {
          return {
            ...c,
            currentOccupants: Math.min(c.maxCapacity, c.currentOccupants + victim.members)
          };
        }
        return c;
      });
      setEvacuationCenters(updatedCenters);
    }
  };

  // MUTATION WORKFLOW 11: Deploy Distribution relief goods batch
  const handleAddReliefDistribution = (newDist) => {
    setDistributions([newDist, ...distributions]);
  };

  const archiveDeletedItem = (category, item) => {
    try {
      const saved = localStorage.getItem('bdrrmc_archives_v1');
      let archivesObj = { users: [], reports: [], alerts: [], programs: [] };
      if (saved) {
        try {
          archivesObj = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
      
      const newArchiveRecord = {
        id: item.id || `rec-${Date.now()}`,
        type: category.slice(0, -1).toUpperCase(), // strip plural 's'
        name: item.title || item.locationName || item.message || `Deleted ${category}`,
        details: item,
        history: [
          {
            action: `${category.slice(0, -1).toUpperCase()} Deleted & Archived`,
            timestamp: new Date().toISOString(),
            details: `Entity [ID: ${item.id}] deleted and committed to coldbase under Category: ${category}.`
          }
        ],
        archivedAt: new Date().toISOString(),
        deletedBy: currentUser?.name || 'Administrator'
      };

      archivesObj[category] = [newArchiveRecord, ...(archivesObj[category] || [])];
      localStorage.setItem('bdrrmc_archives_v1', JSON.stringify(archivesObj));
      window.dispatchEvent(new CustomEvent('bdrrmc-archives-updated'));
    } catch (e) {
      console.error('Archival insertion failed:', e);
    }
  };

  const handleDeleteReport = (id) => {
    const reportToArchive = reports.find(r => r.id === id);
    if (reportToArchive) {
      archiveDeletedItem('reports', reportToArchive);
    }
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const handleDeleteAlert = (id) => {
    const alertToArchive = alerts.find(a => a.id === id);
    if (alertToArchive) {
      archiveDeletedItem('alerts', alertToArchive);
    }
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Counts for counts badge in Sidebar
  const activeAlertsCount = alerts.filter(a => a.isActive).length;
  const pendingReportsCount = reports.filter(r => r.status === IncidentStatus.PENDING).length;
  const activeExtremeAlertsExist = alerts.some(a => a.isActive && a.severity === AlertSeverity.EXTREME);

  return (
    <div className="min-h-screen text-slate-900 flex font-sans antialiased selection:bg-red-500 selection:text-white">
      
      {/* 1. SIDEBAR PANEL */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeAlertsCount={activeAlertsCount}
        pendingReportsCount={pendingReportsCount}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setShowAuthModal={setShowAuthModal}
        broadcastPublicMode={broadcastPublicMode}
      />

      {/* 2. MAIN APPMART CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        
        {/* TOP STATUSHEADER BAR */}
        <Header 
          userRole={userRole}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onTriggerSOS={handleTriggerSOS}
          alerts={alerts}
        />

        {/* COMPONENT TAB DETECTOR RENDER VIEWS */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView 
              userRole={userRole}
              currentUser={currentUser}
              setCurrentTab={setCurrentTab}
              alerts={alerts}
              reports={reports}
              evacuationCenters={evacuationCenters}
              programs={programs}
              stockpileItems={stockpile}
              onAddComment={handleAddComment}
              onUpdateReportStatus={handleUpdateReportStatus}
              onQuickBroadcast={handleQuickBroadcast}
              onDeleteReport={handleDeleteReport}
            />
          )}

          {currentTab === 'maps' && (
            <MapsView 
              evacuationCenters={evacuationCenters}
              hydrants={hydrants}
              reports={reports}
              vulnerabilityRegistry={vulnerabilityRegistry}
              onAddHouseholdVulnerability={handleAddHouseholdVulnerability}
              userRole={userRole}
              currentUser={currentUser}
              onUpdateReportStatus={handleUpdateReportStatus}
            />
          )}

           {currentTab === 'report' && (
            <ReportingView 
              userRole={userRole}
              reports={reports}
              onSubmitReport={handleSubmitReport}
              onAddComment={handleAddComment}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              setShowAuthModal={setShowAuthModal}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsView 
              userRole={userRole}
              currentUser={currentUser}
              alerts={alerts}
              onAddAlert={handleAddAlert}
              onDeleteAlert={handleDeleteAlert}
              onUpdateAlerts={setAlerts}
              broadcastPublicMode={broadcastPublicMode}
              onToggleBroadcastPublicMode={handleToggleBroadcastPublicMode}
            />
          )}

          {currentTab === 'interdepartment' && (
            <InterDepartmentView 
              userRole={userRole}
              currentUser={currentUser}
              usersList={usersList}
              setUsersList={setUsersList}
            />
          )}

          {currentTab === 'preparedness' && (
            <PreparednessView 
              userRole={userRole}
              currentUser={currentUser}
              programs={programs}
              stockpileItems={stockpile}
              onRegisterForProgram={handleRegisterForProgram}
              onModifyStockpile={handleModifyStockpile}
              onUpdatePrograms={setPrograms}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'gobag' && (
            <GoBagPlannerView 
              setCurrentTab={setCurrentTab}
              onTriggerSOS={handleTriggerSOS}
            />
          )}

          {currentTab === 'response' && (
            <ResponseRecoveryView 
              userRole={userRole}
              currentUser={currentUser}
              evacuationCenters={evacuationCenters}
              distributions={distributions}
              reports={reports}
              onAddVictimIntake={handleAddVictimIntake}
              onAddReliefDistribution={handleAddReliefDistribution}
            />
          )}
        </main>

        {/* VISUAL SITE FOOTER */}
        <footer className="py-4 text-center text-[10px] text-slate-600 font-mono border-t border-slate-300 bg-[#EFF2FE] mt-auto select-none">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div> System Online</span>
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Gov't Uplink Active</span>
            </div>
            <div>Barangay 35 Maypajo Caloocan Fire Preparedness & Emergency Portal © 2026 | Preparedness is Safety!</div>
          </div>
        </footer>

      </div>

      {/* 3. SIMULATED AUTHENTICATION ENTRY MODAL */}
              <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        usersList={usersList}
        setUsersList={setUsersList}
      />

    </div>
  );
}