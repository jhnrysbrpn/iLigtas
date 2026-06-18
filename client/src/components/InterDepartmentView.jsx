import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Users, 
  Compass, 
  Clock, 
  Plus, 
  MapPin, 
  ShieldAlert, 
  Send, 
  Activity, 
  Info,
  Truck,
  HeartHandshake,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export default function InterDepartmentView({ userRole, currentUser, t, usersList = [], setUsersList }) {
  
  // 1. Core State with LocalStorage persistence for realistic usage
  const [disasterStatus, setDisasterStatus] = useState(() => {
    const saved = localStorage.getItem('bdrrmc_ids_disaster_status');
    return saved ? JSON.parse(saved) : {
      level: 'CODE RED - MULTIPLE ALARMS',
      summary: 'Ongoing structural residential fire near Solis Alleyway and Purok 3. High wind spreading concern. Fire containment in progress.',
      lastUpdated: '12:35 PM'
    };
  });

  const [departments, setDepartments] = useState(() => {
    const defaultDepts = [
      {
        id: 'bfp',
        name: 'Bureau of Fire Protection (BFP) Maypajo',
        leader: 'SFO1 Michael Abad',
        personnelActive: 14,
        status: 'Fully Deployed / Suppressing',
        color: 'border-red-500 bg-red-50/50 hover:bg-red-50',
        deployments: [
          { id: 'dep-1', teamName: 'BFP Engine 5 Crew', location: 'Purok 3 Narrow Alleyways', task: 'Direct flame suppression & deck wetting', timeSent: '12:15 PM' },
          { id: 'dep-2', teamName: 'BFP Alpha Rescue Tanker', location: 'Solis Main Public Hydrant', task: 'Water line pressurization & boost supply', timeSent: '12:18 PM' }
        ]
      },
      {
        id: 'volunteers',
        name: 'Barangay 35 Fire Volunteer Brigade',
        leader: 'Captain Noel Aguilar',
        personnelActive: 22,
        status: 'Active Fire-lines & Guarding',
        color: 'border-amber-500 bg-amber-50/50 hover:bg-amber-50',
        deployments: [
          { id: 'dep-3', teamName: 'volunteer Hose Unit A', location: 'Purok 3 North Perimeter', task: 'Creating protective wall cooling on wooden balconies', timeSent: '12:20 PM' },
          { id: 'dep-4', teamName: 'Volunteers Runner Squad', location: 'Purok 4 Rizal St', task: 'Assisting in clear pathway access for big BFP trucks', timeSent: '12:25 PM' }
        ]
      },
      {
        id: 'medics',
        name: 'Maypajo Health & Red Cross Medic Unit',
        leader: 'Dr. Arthur Singson',
        personnelActive: 8,
        status: 'Triage Center Operational',
        color: 'border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50',
        deployments: [
          { id: 'dep-5', teamName: 'Medic Triage Team 1', location: 'Maypajo Elementary Evac Center', task: 'Treating smoke inhalation, minor burns & trauma', timeSent: '12:22 PM' },
          { id: 'dep-6', teamName: 'Ambulance Unit B', location: 'Rizal Ave Perimeter Standby', task: 'Emergency patient transport & oxygen station', timeSent: '12:30 PM' }
        ]
      },
      {
        id: 'rescue',
        name: 'Barangay Rescue & Evacuation Squad',
        leader: 'Kagawad Jaime Ortiz',
        personnelActive: 12,
        status: 'Conducting House Sweep Search',
        color: 'border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50',
        deployments: [
          { id: 'dep-7', teamName: 'Evacuation Sweep Team Alpha', location: 'Sawata Boundary Lanes', task: 'Moving elderly, disable, and kids to safe school zone', timeSent: '12:16 PM' },
          { id: 'dep-8', teamName: 'Relief Prep Squad', location: 'Barangay Covered Court', task: 'Setting up clean rest mats & dry go-bag distributions', timeSent: '12:40 PM' }
        ]
      }
    ];
    const saved = localStorage.getItem('bdrrmc_ids_departments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = [...parsed];
        defaultDepts.forEach(dd => {
          if (!merged.some(d => d.id === dd.id)) {
            merged.push(dd);
          }
        });
        return merged;
      } catch (e) {
        return defaultDepts;
      }
    }
    return defaultDepts;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('bdrrmc_ids_logs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'log-1', time: '12:40 PM', departmentId: 'rescue', message: 'Evacuation Sweep Team Alpha successfully evacuated 4 bedridden elderly from outer Solis sector.', type: 'success' },
      { id: 'log-2', time: '12:35 PM', departmentId: 'bfp', message: 'BFP Engine 5 reports flame spread hazard on wood frame structure has been partially checked.', type: 'info' },
      { id: 'log-3', time: '12:30 PM', departmentId: 'medics', message: 'Medic unit set up an additional oxygen booster station near Maypajo Secondary Space.', type: 'dispatch' },
      { id: 'log-4', time: '12:25 PM', departmentId: 'volunteers', message: 'Meralco utility emergency response vehicle arrived on site. High voltage power grid cut-off confirmed for Purok 3.', type: 'warning' },
      { id: 'log-5', time: '12:15 PM', departmentId: 'bfp', message: 'BFP Incident Command post established at Solis corner J. Aguilar St.', type: 'info' }
    ];
  });

  // 2. Synchronize states with local storage
  useEffect(() => {
    localStorage.setItem('bdrrmc_ids_disaster_status', JSON.stringify(disasterStatus));
  }, [disasterStatus]);

  useEffect(() => {
    localStorage.setItem('bdrrmc_ids_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('bdrrmc_ids_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    const handleSOSUpdate = () => {
      const savedLogs = localStorage.getItem('bdrrmc_ids_logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
      const savedDepts = localStorage.getItem('bdrrmc_ids_departments');
      if (savedDepts) {
        setDepartments(JSON.parse(savedDepts));
      }
    };
    window.addEventListener('bdrrmc-sos-triggered', handleSOSUpdate);
    window.addEventListener('storage', handleSOSUpdate);
    return () => {
      window.removeEventListener('bdrrmc-sos-triggered', handleSOSUpdate);
      window.removeEventListener('storage', handleSOSUpdate);
    };
  }, []);

  // 3. Admin Control form inputs states
  const [newDisasterLevel, setNewDisasterLevel] = useState(disasterStatus.level);
  const [newDisasterSummary, setNewDisasterSummary] = useState(disasterStatus.summary);

  const [selectedDeptId, setSelectedDeptId] = useState(() => {
    return currentUser?.department?.toLowerCase() || 'bfp';
  });

  const isDeptLocked = !!(currentUser && currentUser.department && currentUser.username !== 'admin');

  const isSelectableDept = (deptId) => {
    if (!currentUser || currentUser.username === 'admin' || !currentUser.department) return true;
    return deptId.toLowerCase() === currentUser.department.toLowerCase();
  };

  const activeDeptId = isDeptLocked ? currentUser.department.toLowerCase() : selectedDeptId;

  const [deptLeader, setDeptLeader] = useState('');
  const [deptPersonnel, setDeptPersonnel] = useState('');
  const [deptStatusTxt, setDeptStatusTxt] = useState('');

  const [deployTeamName, setDeployTeamName] = useState('');
  const [deployLocation, setDeployLocation] = useState('');
  const [deployTask, setDeployTask] = useState('');

  const [logMsg, setLogMsg] = useState('');
  const [logType, setLogType] = useState('info');

  // Keep selectedDeptId synced if the department is locked
  useEffect(() => {
    if (isDeptLocked && currentUser?.department) {
      setSelectedDeptId(currentUser.department.toLowerCase());
    }
  }, [isDeptLocked, currentUser]);

  // Pre-fill fields on department change in dropdown
  useEffect(() => {
    const dept = departments.find(d => d.id === selectedDeptId);
    if (dept) {
      setDeptLeader(dept.leader);
      setDeptPersonnel(String(dept.personnelActive));
      setDeptStatusTxt(dept.status);
    }
  }, [selectedDeptId, departments]);

  // 4. Form Actions
  const handleUpdateDisasterGlobal = (e) => {
    e.preventDefault();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDisasterStatus({
      level: newDisasterLevel.toUpperCase(),
      summary: newDisasterSummary,
      lastUpdated: timeNow
    });
    
    // Auto-inject timeline log about disaster change
    const newLog = {
      id: `log-ast-${Date.now()}`,
      time: timeNow,
      departmentId: 'system',
      message: `🚨 DISASTER COMMAND HUB UPDATE: Status changed to [${newDisasterLevel.toUpperCase()}]. Notes: "${newDisasterSummary}"`,
      type: 'warning'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateDeptStatus = (e) => {
    e.preventDefault();
    const parsedPersonnel = parseInt(deptPersonnel) || 0;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDepartments(prev => prev.map(d => {
      if (d.id === activeDeptId) {
        return {
          ...d,
          leader: deptLeader,
          personnelActive: parsedPersonnel,
          status: deptStatusTxt
        };
      }
      return d;
    }));

    const deptName = departments.find(d => d.id === activeDeptId)?.name || 'Department';
    // Auto timeline log entry
    const newLog = {
      id: `log-dept-${Date.now()}`,
      time: timeNow,
      departmentId: activeDeptId,
      message: `${deptName} updated officer-in-charge to ${deptLeader}. Active Personnel: ${parsedPersonnel}. Status: ${deptStatusTxt}`,
      type: 'info'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Deploy Team (Who, What Team is sent to where, doing what)
  const handleDeployTeam = (e) => {
    e.preventDefault();
    if (!deployTeamName || !deployLocation || !deployTask) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newDeployment = {
      id: `dep-${Date.now()}`,
      teamName: deployTeamName,
      location: deployLocation,
      task: deployTask,
      timeSent: timeNow
    };

    setDepartments(prev => prev.map(d => {
      if (d.id === activeDeptId) {
        return {
          ...d,
          deployments: [newDeployment, ...d.deployments]
        };
      }
      return d;
    }));

    const deptName = departments.find(d => d.id === activeDeptId)?.name || 'Department';
    // Create timeline log entry
    const newLogDeploy = {
      id: `log-dep-${Date.now()}`,
      time: timeNow,
      departmentId: activeDeptId,
      message: `🚚 DISPATCH: ${deptName} deployed [${deployTeamName}] to ${deployLocation} for task: "${deployTask}"`,
      type: 'dispatch'
    };
    setLogs(prev => [newLogDeploy, ...prev]);

    // Reset fields
    setDeployTeamName('');
    setDeployLocation('');
    setDeployTask('');
  };

  // Add custom manual log to timeline
  const handleAddManualLog = (e) => {
    e.preventDefault();
    if (!logMsg.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLogManual = {
      id: `log-man-${Date.now()}`,
      time: timeNow,
      departmentId: activeDeptId,
      message: logMsg,
      type: logType
    };

    setLogs(prev => [newLogManual, ...prev]);
    setLogMsg('');
  };

  // Revoke/Delete Deployment
  const handleRecallTeam = (deptId, depId) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetDept = departments.find(d => d.id === deptId);
    const targetDep = targetDept?.deployments.find(dp => dp.id === depId);

    setDepartments(prev => prev.map(d => {
      if (d.id === deptId) {
        return {
          ...d,
          deployments: d.deployments.filter(dp => dp.id !== depId)
        };
      }
      return d;
    }));

    if (targetDep) {
      const newLogRecall = {
        id: `log-recall-${Date.now()}`,
        time: timeNow,
        departmentId: deptId,
        message: `🔄 RECALLED: ${targetDep.teamName} has completed their assignment at ${targetDep.location} and is returning to standby.`,
        type: 'success'
      };
      setLogs(prev => [newLogRecall, ...prev]);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Do you want to reset all Inter-Department databases to initial values?')) {
      localStorage.removeItem('bdrrmc_ids_disaster_status');
      localStorage.removeItem('bdrrmc_ids_departments');
      localStorage.removeItem('bdrrmc_ids_logs');
      window.location.reload();
    }
  };

  const handleApproveUser = (username, approvedType) => {
    if (!usersList || !setUsersList) return;
    const updated = usersList.map(u => {
      if (u && u.username && u.username.toLowerCase() === username.toLowerCase()) {
        const approvedRole = approvedType === 'approve' ? (u.requestedRole || 'Admin') : 'Resident';
        return {
          ...u,
          approved: true,
          role: approvedRole,
          requestedRole: undefined
        };
      }
      return u;
    });
    setUsersList(updated);
    localStorage.setItem('_users_list', JSON.stringify(updated));
  };

  const handleUpdateMemberRole = (username, nextRole) => {
    if (!usersList || !setUsersList) return;
    const updated = usersList.map(u => {
      if (u && u.username && u.username.toLowerCase() === username.toLowerCase()) {
        return {
          ...u,
          role: nextRole,
          approved: true
        };
      }
      return u;
    });
    setUsersList(updated);
    localStorage.setItem('_users_list', JSON.stringify(updated));
  };

  const getDeptLabelClean = (dept) => {
    if (!dept) return 'Citizen Division';
    switch (dept.toLowerCase()) {
      case 'bfp': return 'Bureau of Fire Protection Maypajo';

      case 'volunteers': return 'Barangay 35 Fire Volunteer Brigade';
      case 'medics': return 'Maypajo Health & Red Cross Medic Unit';
      case 'rescue': return 'Barangay Rescue & Evacuation Squad';
      default: return dept.toUpperCase();
    }
  };

  const isAdminOrResponderOrOfficial = userRole === 'Admin' || userRole === 'Responder' || userRole === 'SuperAdmin';

  return (
    <div id="inter-department-portal" className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-300 pb-5">
        <div>
          <span className="text-[10px] font-black tracking-widest text-red-600 bg-red-100 border border-red-300 px-3 py-1 rounded-md font-mono uppercase">
            🔥 OFFICIAL INTER-DEPARTMENT COOPERATION
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 uppercase italic font-sans mt-2">
            Fire Dispatch & Command Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium max-w-2xl">
            Live cross-communication nexus and emergency squad assignments for Barangay 35 fire brigades, responders, and administrative dispatch.
          </p>
        </div>

        <button
          onClick={handleResetData}
          title="Reset Portal State"
          className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-300 select-none shadow-xs font-mono font-bold cursor-pointer transition-all active:scale-95 text-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Logs
        </button>
      </div>

      {/* Main Fire Disaster Overall Status Card */}
      <div className="relative p-6 rounded-2xl bg-linear-to-r from-red-600 to-orange-700 text-white shadow-lg overflow-hidden border border-red-800">
        <div className="absolute top-0 right-0 p-8 opacity-10 select-none pointer-events-none">
          <Flame className="w-40 h-40 fill-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
              <span className="text-[10px] font-black tracking-widest bg-black/30 border border-white/20 px-2 py-0.5 rounded font-mono uppercase">
                {disasterStatus.level}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase italic leading-tight">
              LIVE FIRE DISASTER INCIDENT REGISTER
            </h2>
            <p className="text-sm text-balance text-red-50 font-medium max-w-3xl">
              {disasterStatus.summary}
            </p>
          </div>
          <div className="bg-black/25 backdrop-blur-xs p-4 rounded-xl border border-white/20 min-w-50 text-left">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-200 font-mono">Incident Level</span>
              <span className="text-xs font-black text-yellow-300">CODE RED</span>
            </div>
            <p className="text-[10px] text-red-100 uppercase font-black font-mono">Last Dispatch Update</p>
            <p className="text-lg font-black text-white font-mono mt-0.5">{disasterStatus.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* 🛡️ SuperAdmin Department Personnel & Approvals Panel */}
      {userRole === 'SuperAdmin' && currentUser?.department && (() => {
        const myDept = currentUser.department;
        const myDeptLabel = getDeptLabelClean(myDept);
        
        // Filter department users
        const deptPending = (usersList || []).filter(u => u.department === myDept && u.approved === false);
        const deptMembers = (usersList || []).filter(u => u.department === myDept && u.approved !== false && u.username !== currentUser.username);

        return (
          <div className="p-6 rounded-2xl bg-white border-2 border-slate-900/10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-205 pb-3 gap-2">
              <div>
                <span className="text-[9px] font-black tracking-widest text-[#4f46e5] bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded font-mono uppercase">
                  OIC CONTROL CENTER
                </span>
                <h4 className="text-lg font-black uppercase text-slate-900 tracking-tight mt-1 font-sans">
                  🛡️ {myDeptLabel} Personnel Registry
                </h4>
                <p className="text-xs text-slate-500 font-medium font-mono mt-0.5">
                  Authority Limited to {myDept.toUpperCase()} | Verification Code: {currentUser.departmentId || 'OIC-911'}
                </p>
              </div>

              <span className="text-[10px] bg-emerald-100 border border-emerald-300 text-emerald-950 font-extrabold px-3 py-1 rounded inline-flex items-center gap-1.5 uppercase font-mono shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Administrator Access
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Pending Approvals */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h5 className="text-[10px] font-black tracking-wider uppercase text-slate-500 font-mono">
                    Pending Credentials Verification ({deptPending.length})
                  </h5>
                  <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-bold uppercase font-mono">
                    REQUIRES AUTHS
                  </span>
                </div>

                {deptPending.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-center flex flex-col items-center justify-center space-y-2">
                    <HeartHandshake className="w-8 h-8 text-slate-400" />
                    <p className="text-xs font-bold leading-relaxed">No pending authorization requests.</p>
                    <p className="text-[9.5px] text-slate-400 font-mono max-w-60">All department applicant records are currently synchronized & verified.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
                    {deptPending.map((p) => (
                      <div key={p.username} className="p-4 rounded-xl bg-amber-50/70 border border-amber-250 shadow-2xs space-y-2.5 text-left transition-all hover:shadow-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-extrabold text-slate-900 leading-none">{p.name}</p>
                            <p className="text-[9px] text-slate-500 font-mono font-bold mt-1 uppercase bg-slate-200/60 inline-block px-1 rounded">@{p.username}</p>
                          </div>
                          <span className="text-[9px] font-black tracking-widest text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded font-mono uppercase">
                            Requested: {p.requestedRole || 'Admin'}
                          </span>
                        </div>

                        <div className="p-2 bg-white rounded-lg border border-amber-200 space-y-0.5 font-mono text-[9px] text-slate-600">
                          <p>📧 Email: <span className="font-bold text-slate-850 select-text">{p.email}</span></p>
                          <p>📞 Phone: <span className="font-bold text-slate-850 select-text">{p.phone}</span></p>
                          <p>🆔 Verification Card ID: <span className="font-bold text-[#b45309]">{p.departmentId || 'None'}</span></p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleApproveUser(p.username, 'approve')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase py-1.5 rounded border border-emerald-700 shadow-2xs cursor-pointer tracking-wider transition-colors"
                          >
                            Approve Elevated Role
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveUser(p.username, 'deny')}
                            className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-extrabold text-[9px] uppercase py-1.5 rounded border border-red-300 shadow-2xs cursor-pointer tracking-wider transition-colors"
                          >
                            Deny & Keep Resident
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Active Member Roles */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h5 className="text-[10px] font-black tracking-wider uppercase text-slate-500 font-mono">
                    Authorized Agency Personnel ({deptMembers.length + 1})
                  </h5>
                  <span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded font-bold uppercase font-mono">
                    VERIFIED ROSTER
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-205 rounded-xl bg-slate-50">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-250/50 border-b border-slate-200 text-[9px] text-slate-500 font-black tracking-widest font-mono uppercase">
                        <th className="py-2.5 px-3">MEMBER & CONTACT</th>
                        <th className="py-2.5 px-3 w-40">ACTIVE ASSIGNED ROLE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {/* Self Master Row */}
                      <tr className="bg-emerald-50/40 font-bold">
                        <td className="py-3 px-3">
                          <p className="text-slate-900 font-extrabold">{currentUser.name} (YOU)</p>
                          <p className="text-[9.5px] text-slate-500 font-mono font-bold mt-0.5 leading-none bg-emerald-100 border border-emerald-300 inline-block px-1 rounded">@{currentUser.username}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] bg-emerald-250 text-emerald-950 border border-emerald-400 font-black px-2 py-0.5 rounded font-mono uppercase">
                            SuperAdmin (OIC)
                          </span>
                        </td>
                      </tr>

                      {deptMembers.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="py-8 text-center text-slate-400 italic font-mono text-[10px]">
                            No other squad members registered. Create an account to test or simulate recruitment.
                          </td>
                        </tr>
                      ) : (
                        deptMembers.map((m) => (
                          <tr key={m.username} className="bg-white hover:bg-slate-50/80">
                            <td className="py-2.5 px-3">
                              <p className="font-extrabold text-slate-900 leading-none">{m.name}</p>
                              <div className="flex flex-wrap gap-x-2 text-[9px] text-slate-500 mt-1 font-mono">
                                <span>📧 {m.email}</span>
                                <span>📞 {m.phone}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <select
                                value={m.role}
                                onChange={(e) => handleUpdateMemberRole(m.username, e.target.value)}
                                className="text-[10px] font-bold py-1.5 px-2 pr-8 h-auto whitespace-normal wrap-break-word rounded border border-slate-300 bg-white text-slate-950 font-mono cursor-pointer uppercase shadow-3xs focus:outline-none focus:border-indigo-500 w-fit max-w-full"
                                style={{
                                  width: `calc(${
                                    ({
                                      "SuperAdmin": "👮 SuperAdmin",
                                      "Admin": "🛠️ Admin",
                                      "Responder": "🚒 Responder",
                                      "Resident": "🏠 Resident"
                                    }[m.role] || m.role || '').length
                                  }ch + 3rem)`
                                }}
                              >
                                <option value="SuperAdmin">👮 SuperAdmin</option>
                                <option value="Admin">🛠️ Admin</option>
                                <option value="Responder">🚒 Responder</option>
                                <option value="Resident">🏠 Resident</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Grid of department response statuses (who & what team is deployed to which locations) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-extrabold uppercase italic relative text-slate-900 tracking-tight">
            Department Allocation & Assigned Locations
          </h3>
        </div>
        
        <p className="text-xs text-slate-500 max-w-3xl">
          Visualizing active squads, current deployment spots, and tactical tasks assigned for containment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => {
            const isBfp = dept.id === 'bfp';
            return (
              <div 
                key={dept.id} 
                className={`p-5 rounded-2xl border-2 shadow-sm transition-all flex flex-col justify-between ${dept.color}`}
              >
                <div>
                  {/* Department Title bar */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-300/30 pb-3 mb-4">
                    <div className="text-left space-y-1">
                      <h4 className="font-black text-slate-950 text-sm leading-tight uppercase font-sans">
                        {dept.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-650">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>Lead: <strong className="text-slate-900">{dept.leader}</strong></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-500 font-mono">Active Personnel</span>
                      <span className="text-lg font-black text-slate-900 font-mono">{dept.personnelActive} Pax</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 bg-white/70 border border-slate-250 py-1.5 px-3 rounded-lg mb-4 text-left select-none">
                    <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
                    <div>
                      <span className="text-[8px] font-bold block uppercase tracking-wide text-slate-400 font-mono">Current Status</span>
                      <p className="text-[11px] font-black text-slate-900 uppercase leading-none">{dept.status}</p>
                    </div>
                  </div>

                  {/* Deployments Stream (WHO is sent to WHERE and WHAT task) */}
                  <div className="space-y-2.5">
                    <p className="text-[10px] font-black font-mono uppercase tracking-wider text-slate-500 text-left">
                      📍 ACTIVE TEAM SQUAD LOCATIONS
                    </p>

                    {dept.deployments.length === 0 ? (
                      <div className="p-4 rounded-lg bg-slate-100/40 border border-slate-200 text-slate-400 text-xs italic text-center">
                        No active location deployments logged for this squad at this moment.
                      </div>
                    ) : (
                      <div className={`space-y-2 ${dept.deployments.length > 2 ? 'max-h-48.75 overflow-y-auto pr-1.5' : ''}`}>
                        {dept.deployments.map((dep) => (
                          <div 
                            key={dep.id} 
                            className="bg-white/85 border border-slate-300/50 p-3 rounded-xl flex flex-col justify-between text-left relative overflow-hidden shadow-xs hover:border-slate-400 transition-all"
                          >
                            <div className="absolute top-0 right-0 pt-2 pr-3 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-[8.5px] font-bold text-slate-400 font-mono">{dep.timeSent}</span>
                            </div>

                            <div className="pr-12">
                              <h5 className="text-[11px] font-black text-slate-950 uppercase flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-rose-600" />
                                {dep.teamName}
                              </h5>
                              
                              <p className="text-xs font-bold text-red-700 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-red-500 fill-red-100" />
                                {dep.location}
                              </p>

                              <p className="text-[11px] text-slate-600 font-mono leading-tight mt-1.5 bg-slate-50 p-1.5 border border-slate-200 rounded">
                                Task: {dep.task}
                              </p>
                            </div>

                            {/* Recall / Finish button when Official/Admin logged in */}
                            {isAdminOrResponderOrOfficial && (() => {
                              const isDeptOwn = !currentUser?.department || 
                                                currentUser.username === 'admin' ||
                                                currentUser.department.toLowerCase() === dept.id.toLowerCase();
                              if (isDeptOwn) {
                                return (
                                  <div className="mt-2.5 border-t border-dashed border-slate-200 pt-2 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => handleRecallTeam(dept.id, dep.id)}
                                      className="text-[9.5px] font-black text-emerald-700 hover:text-emerald-900 bg-emerald-100/60 hover:bg-emerald-200/80 px-2.5 py-1 rounded-lg border border-emerald-300 transition-colors uppercase font-mono cursor-pointer"
                                    >
                                      Mark Complete & Recall Squad
                                    </button>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="mt-2.5 border-t border-dashed border-slate-200 pt-2 flex justify-end">
                                    <span className="text-[8.5px] font-bold text-slate-400 bg-slate-100 border border-slate-300/60 px-2 py-0.5 rounded font-mono uppercase">
                                      Recall Restricted to {dept.id.toUpperCase()}
                                    </span>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Timeline and Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Real-time Dispatch Event Timeline (Logs of details) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-300">
            <Clock className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-extrabold uppercase italic text-slate-900 tracking-tight">
              Disaster Operational Chronology & Details Log
            </h3>
          </div>

          <p className="text-xs text-slate-500 text-left">
            Chronological log of event updates, line operations, power cut-offs, and volunteer action milestones.
          </p>

          <div className="relative border-l-2 border-neutral-300 pl-4 ml-3 pt-2 space-y-4 max-h-145rflow-y-auto no-scrollbar">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No timeline updates logged yet.</p>
            ) : (
              logs.map((lg) => {
                const isSystem = lg.departmentId === 'system';
                const isBfp = lg.departmentId === 'bfp';
                const isVol = lg.departmentId === 'volunteers';
                const isMed = lg.departmentId === 'medics';
                const isRescue = lg.departmentId === 'rescue';

                let dotColor = 'bg-slate-400';
                let tagText = 'SYS';
                let alertClass = 'bg-slate-50 border-slate-200 text-slate-800';

                if (lg.type === 'warning') {
                  dotColor = 'bg-red-500 animate-ping';
                  tagText = 'WARNING';
                  alertClass = 'bg-red-55 border-red-200 text-red-950';
                } else if (lg.type === 'dispatch') {
                  dotColor = 'bg-indigo-500';
                  tagText = 'DISPATCH';
                  alertClass = 'bg-indigo-55 border-indigo-200 text-indigo-950';
                } else if (lg.type === 'success') {
                  dotColor = 'bg-emerald-500';
                  tagText = 'SUCCESS';
                  alertClass = 'bg-emerald-55 border-emerald-200 text-emerald-950';
                } else {
                  dotColor = 'bg-amber-500';
                  tagText = 'INFO';
                  alertClass = 'bg-amber-55 border-amber-200 text-amber-950';
                }

                // Department Name helper
                let labelDept = 'SYSTEM COMMAND';
                if (isBfp) labelDept = 'BFP COMMAND';
                if (isVol) labelDept = 'VOLUNTEERS';
                if (isMed) labelDept = 'HEALTH & MEDIC';
                if (isRescue) labelDept = 'RESCUE & EVAC';

                return (
                  <div key={lg.id} className="relative text-left group">
                    {/* Ring dot handle */}
                    <span className={`absolute -left-5.75 top-1.5 w-2 h-2 rounded-full ${dotColor} ring-4 ring-white`} />
                    
                    <div className={`p-3.5 rounded-xl border shadow-2xs transition-all hover:shadow-xs ${alertClass}`}>
                      <div className="flex items-center justify-between text-[10px] font-mono font-black mb-1.5">
                        <span className="flex items-center gap-1">
                          <span className="text-slate-400">[{lg.time}]</span>
                          <span className="uppercase tracking-tight text-slate-705">{labelDept}</span>
                        </span>
                        <span className="text-[9px] uppercase tracking-widest leading-none bg-slate-200 px-1.5 py-0.5 rounded font-black font-mono">
                          {tagText}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed font-mono font-bold text-slate-900">
                        {lg.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Command Control Console: Admin and Officers Input Side */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-300">
            <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
            <h3 className="text-lg font-extrabold uppercase italic text-slate-900 tracking-tight">
              Command Control Center
            </h3>
          </div>

          <p className="text-xs text-slate-500 text-left">
            Authorized portal dashboard to write logs, align personnel, status and map new response deployments to active locations.
          </p>

          {/* Authorization Check sandbox simulation */}
          {!isAdminOrResponderOrOfficial ? (
            <div className="p-6 rounded-2xl bg-[#EFF2FE] border-2 border-dashed border-slate-400 text-slate-600 text-center space-y-3">
              <Info className="w-8 h-8 text-indigo-650 mx-auto" />
              <h4 className="font-extrabold text-sm uppercase text-slate-950">REstricted to Responders & Admins</h4>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                As a <strong>Citizen Resident</strong>, you have high-fidelity read permissions to inspect response logs. Log in to an Administrative or Responder account to post status changes or dispatch squads.
              </p>
              
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Demo Mock Accounts</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs mt-1.5 font-mono">
                  <p>👤 <strong>Barangay Admin (admin):</strong> `admin` | `admin`</p>
                  <p>🔥 <strong>BFP Admin (admin):</strong> `bfpadmin` | `bfpadmin`</p>
                  <p>🏥 <strong>Health Admin (admin):</strong> `healthadmin` | `healthadmin`</p>
                  <p>🛠️ <strong>Super Admin (developer):</strong> `supadmin` | `supadmin`</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Display role badge */}
              <div className="bg-emerald-100/80 border border-emerald-300 p-3 rounded-xl text-left select-none flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <p className="text-xs font-black text-emerald-900 uppercase">
                  ACTIVE COMMAND AUTHORIZED: <span className="underline">{userRole.toUpperCase()} USER</span>
                </p>
              </div>

              {/* 1. Global Disaster Incident Status update */}
              {(userRole === 'Admin' || userRole === 'SuperAdmin') && (() => {
                const isBarangayCentral = !currentUser?.departmentId || 
                                          currentUser?.departmentId === 'rescue' || 
                                          currentUser?.departmentId === 'volunteers';
                if (!isBarangayCentral) {
                  return (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-left space-y-2.5 shadow-xs">
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-amber-800 font-mono flex items-center gap-1.5 border-b border-amber-200 pb-1.5">
                        <Flame className="w-3.5 h-3.5 fill-amber-200 text-amber-650" />
                        Overall Fire disaster status
                      </h4>
                      <p className="text-xs text-amber-900 font-bold leading-relaxed">
                        ⚠️ Privilege Limit Enforced: Global disaster alert codes and summaries are managed exclusively by the Barangay Central Rescue command.
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="p-4 rounded-xl bg-white border border-slate-300 text-left space-y-3 shadow-xs">
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-red-600 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <Flame className="w-3.5 h-3.5 fill-red-200 text-red-500" />
                      Overall Fire disaster status (Barangay Central)
                    </h4>
                    
                    <form onSubmit={handleUpdateDisasterGlobal} className="space-y-2.5">
                      <div>
                        <label className="block text-[9px] font-extrabold uppercase text-slate-500">Incident Code/Label</label>
                        <input 
                          type="text" 
                          required
                          value={newDisasterLevel} 
                          onChange={(e) => setNewDisasterLevel(e.target.value)}
                          placeholder="EX: CODE RED - LEVEL 3 ALARM"
                          className="w-full text-xs p-2 rounded border border-slate-300 bg-slate-50 text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-extrabold uppercase text-slate-500">Global Tactical Summary</label>
                        <textarea 
                          required
                          rows={2}
                          value={newDisasterSummary} 
                          onChange={(e) => setNewDisasterSummary(e.target.value)}
                          placeholder="Detail containment lines, hazard zones..."
                          className="w-full text-xs p-2 rounded border border-slate-300 bg-slate-50 text-slate-900 leading-relaxed"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-1.5 bg-rose-650 hover:bg-rose-700 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-md shadow-xs active:scale-95 transition-all text-center cursor-pointer"
                      >
                        Broaden Disaster Incident Code
                      </button>
                    </form>
                  </div>
                );
              })()}

              {/* 2. Department readiness alignment */}
              <div className="p-4 rounded-xl bg-white border border-slate-300 text-left space-y-3 shadow-xs">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-amber-600 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  Department Personnel & Status alignment
                </h4>

                <form onSubmit={handleUpdateDeptStatus} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="block text-[9px] font-extrabold uppercase text-slate-500">Select Dept</label>
                        {isDeptLocked ? (
                          <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300 font-mono">LOCKED TO {currentUser.department.toUpperCase()}</span>
                        ) : (
                          (userRole === 'Admin' || userRole === 'SuperAdmin') && (
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-255 font-mono">OFFICIAL PRIVILEGE</span>
                          )
                        )}
                      </div>
                      <select 
                        value={selectedDeptId} 
                        disabled={isDeptLocked}
                        onChange={(e) => setSelectedDeptId(e.target.value)}
                        className={`w-fit max-w-full text-xs py-2 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded border border-slate-300 bg-slate-50 text-slate-900 font-bold ${
                          isDeptLocked ? 'opacity-85 cursor-not-allowed bg-slate-100 border-amber-400 text-amber-800' : 'cursor-pointer'
                        }`}
                        style={{
                          width: `calc(${
                            ({
                              "bfp": "BFP Station",
                              "pnp": "PNP Maypajo",
                              "volunteers": "Barangay Volunteers",
                              "medics": "Medic Team",
                              "rescue": "Rescue Evacuation"
                            }[selectedDeptId] || selectedDeptId || '').length
                          }ch + 3.5rem)`
                        }}
                      >
                        {isSelectableDept("bfp") && <option value="bfp">BFP Station</option>}
                        {isSelectableDept("pnp") && <option value="pnp">PNP Maypajo</option>}
                        {isSelectableDept("volunteers") && <option value="volunteers">Barangay Volunteers</option>}
                        {isSelectableDept("medics") && <option value="medics">Medic Team</option>}
                        {isSelectableDept("rescue") && <option value="rescue">Rescue Evacuation</option>}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-500">Active Personnel Count</label>
                      <input 
                        type="number" 
                        required
                        min={0}
                        value={deptPersonnel} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setDeptPersonnel(isNaN(val) ? '' : Math.max(0, val));
                        }}
                        className="w-full text-xs p-1.5 rounded border border-slate-300 bg-slate-50 text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-500">Lead Officer / Commander</label>
                      <input 
                        type="text" 
                        required
                        value={deptLeader} 
                        onChange={(e) => setDeptLeader(e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-slate-300 bg-slate-50 text-slate-900 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-500">Status Headline</label>
                      <input 
                        type="text" 
                        required
                        value={deptStatusTxt} 
                        onChange={(e) => setDeptStatusTxt(e.target.value)}
                        placeholder="EX: Suppressing fire"
                        className="w-full text-xs p-1.5 rounded border border-slate-300 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 border border-amber-600 text-slate-950 font-black text-[10px] tracking-wider uppercase rounded-md shadow-xs active:scale-95 transition-all text-center cursor-pointer"
                  >
                    Sync {currentUser?.departmentId ? 'My Department' : 'Department'} Headcount & Status
                  </button>
                </form>
              </div>

              {/* 3. Squad location deployment (WHO is sent to WHERE to do WHAT) */}
              <div className="p-4 rounded-xl bg-white border border-slate-300 text-left space-y-2.5 shadow-xs">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-indigo-650 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-600" />
                  Deploy Squad to Location
                </h4>

                <form onSubmit={handleDeployTeam} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="block text-[9px] font-extrabold uppercase text-slate-500">Deploying Dept</label>
                        {isDeptLocked ? (
                          <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300 font-mono">LOCKED TO {currentUser.department.toUpperCase()}</span>
                        ) : (
                          (userRole === 'Admin' || userRole === 'SuperAdmin') && (
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-255 font-mono">OFFICIAL PRIVILEGE</span>
                          )
                        )}
                      </div>
                      <select 
                        value={selectedDeptId} 
                        disabled={isDeptLocked}
                        onChange={(e) => setSelectedDeptId(e.target.value)}
                        className={`w-fit max-w-full text-xs py-2 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded border border-slate-300 bg-slate-50 text-slate-900 font-bold ${
                          isDeptLocked ? 'opacity-85 cursor-not-allowed bg-slate-100 border-amber-400 text-amber-800' : 'cursor-pointer'
                        }`}
                        style={{
                          width: `calc(${
                            ({
                              "bfp": "BFP Station",
                              "pnp": "PNP Maypajo",
                              "volunteers": "Barangay Volunteers",
                              "medics": "Medic Team",
                              "rescue": "Rescue Evacuation"
                            }[selectedDeptId] || selectedDeptId || '').length
                          }ch + 3.5rem)`
                        }}
                      >
                        {isSelectableDept("bfp") && <option value="bfp">BFP Station</option>}
                        {isSelectableDept("pnp") && <option value="pnp">PNP Maypajo</option>}
                        {isSelectableDept("volunteers") && <option value="volunteers">Barangay Volunteers</option>}
                        {isSelectableDept("medics") && <option value="medics">Medic Team</option>}
                        {isSelectableDept("rescue") && <option value="rescue">Rescue Evacuation</option>}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-500">Squad/Unit Name</label>
                      <input 
                        type="text" 
                        required
                        value={deployTeamName} 
                        onChange={(e) => setDeployTeamName(e.target.value)}
                        placeholder="E.g. Hose Crew Alpha / Med van 2"
                        className="w-full text-xs p-1.5 rounded border border-slate-300 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-500">Destination Location</label>
                      <input 
                        type="text" 
                        required
                        value={deployLocation} 
                        onChange={(e) => setDeployLocation(e.target.value)}
                        placeholder="E.g. Purok 3 Solis Alleyway"
                        className="w-full text-xs p-1.5 rounded border border-slate-300 bg-slate-50 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-slate-500">Assigned Tactical Mission</label>
                      <input 
                        type="text" 
                        required
                        value={deployTask} 
                        onChange={(e) => setDeployTask(e.target.value)}
                        placeholder="E.g. Hose containment of wooden grid"
                        className="w-full text-xs p-1.5 rounded border border-slate-300 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2 bg-indigo-650 hover:bg-slate-950 hover:text-white text-indigo-950 font-black text-[10px] tracking-wider uppercase rounded-md shadow-xs active:scale-95 transition-all text-center cursor-pointer border border-indigo-400"
                  >
                    🚀 Trigger {currentUser?.departmentId ? 'My Department' : 'Official'} Location Deployment
                  </button>
                </form>
              </div>

              {/* 4. Timeline direct update message log */}
              <div className="p-4 rounded-xl bg-white border border-slate-300 text-left space-y-3 shadow-xs">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-rose-650 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Send className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  Post timeline log bulletin
                </h4>

                <form onSubmit={handleAddManualLog} className="space-y-2.5">
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="block text-[9px] font-extrabold uppercase text-slate-500">Select Publishing Station</label>
                      {isDeptLocked ? (
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-305 font-mono">LOCKED TO {currentUser.department.toUpperCase()}</span>
                      ) : (
                        (userRole === 'Admin' || userRole === 'SuperAdmin') && (
                          <span className="text-[8px] uppercase tracking-wider font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-255 font-mono">OFFICIAL PRIVILEGE</span>
                        )
                      )}
                    </div>
                    <select 
                      value={selectedDeptId} 
                      disabled={isDeptLocked}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className={`w-fit max-w-full text-xs py-2 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded border border-slate-300 bg-slate-50 text-slate-900 font-bold ${
                        isDeptLocked ? 'opacity-85 cursor-not-allowed bg-slate-100 border-amber-400 text-amber-800' : 'cursor-pointer'
                      }`}
                      style={{
                        width: `calc(${
                          ({
                            "bfp": "BFP Maypajo Substation",
                            "volunteers": "Barangay Fire Volunteers",
                            "medics": "Red Cross Medical Hub",
                            "rescue": "Evac & Rescue Dispatch"
                          }[selectedDeptId] || selectedDeptId || '').length
                        }ch + 3.5rem)`
                      }}
                    >
                      {isSelectableDept("bfp") && <option value="bfp">BFP Maypajo Substation</option>}
                      {isSelectableDept("pnp") && <option value="pnp">PNP Maypajo Police Precinct</option>}
                      {isSelectableDept("volunteers") && <option value="volunteers">Barangay Fire Volunteers</option>}
                      {isSelectableDept("medics") && <option value="medics">Red Cross Medical Hub</option>}
                      {isSelectableDept("rescue") && <option value="rescue">Evac & Rescue Dispatch</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold uppercase text-slate-500">Log Type Severity</label>
                    <select 
                      value={logType} 
                      onChange={(e) => setLogType(e.target.value)}
                      className="w-fit max-w-full text-xs py-2 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded border border-slate-300 bg-slate-50 text-slate-900 font-bold cursor-pointer"
                      style={{
                        width: `calc(${
                          ({
                            "info": "💡 General Info Update",
                            "dispatch": "🚚 Deployment / Squad Move",
                            "warning": "🚨 Major Hazard / Incident warning",
                            "success": "✅ Goal Achieved / Hazard cleared"
                          }[logType] || logType || '').length
                        }ch + 3.5rem)`
                      }}
                    >
                      <option value="info">💡 General Info Update</option>
                      <option value="dispatch">🚚 Deployment / Squad Move</option>
                      <option value="warning">🚨 Major Hazard / Incident warning</option>
                      <option value="success">✅ Goal Achieved / Hazard cleared</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold uppercase text-slate-500">Update Bulletin Text</label>
                    <input 
                      type="text" 
                      required
                      value={logMsg} 
                      onChange={(e) => setLogMsg(e.target.value)}
                      placeholder="E.g. LPG tank removed safely from kitchen zone."
                      className="w-full text-xs p-1.5 rounded border border-slate-300 bg-slate-50 text-slate-900 font-mono"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-1.5 bg-rose-600 hover:bg-red-700 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-md shadow-xs active:scale-95 transition-all text-center cursor-pointer"
                  >
                    Post Log Bulletin Entry
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
