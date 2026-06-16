import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Package, 
  CheckSquare, 
  Clock, 
  Users, 
  Plus, 
  PlusCircle, 
  HelpCircle, 
  Check, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { GO_BAG_CHECKLIST } from '../data/mockData';
import { ProgramType } from '../types';

export default function PreparednessView({
  userRole,
  currentUser,
  programs,
  stockpileItems,
  onRegisterForProgram,
  onModifyStockpile,
  onUpdatePrograms,
  language,
  t,
  setCurrentTab
}) {
  
  const isDeptAdmin = currentUser?.department && 
    (currentUser.department.toLowerCase() === 'bfp' || 
     currentUser.department.toLowerCase() === 'pnp' || 
     currentUser.department.toLowerCase() === 'medics');
     
  const hasPreparednessAdminPrivilege = userRole === 'Admin' && !isDeptAdmin;

  // Go-Bag interactive state
  const [checkedItems, setCheckedItems] = useState(['gb-1', 'gb-2']);
  
  // Registration State
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [registrantName, setRegistrantName] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Admin Activity Form States
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Drill');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formHost, setFormHost] = useState('');
  const [formStatus, setFormStatus] = useState('Upcoming');

  const handleOpenAddActivity = () => {
    setEditingProgramId(null);
    setFormTitle('');
    setFormType('Drill');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('9:05 AM - 11:30 AM');
    setFormLocation('Barangay 35 Covered Court');
    setFormDescription('');
    setFormHost('BDRRMC Response Officers');
    setFormStatus('Upcoming');
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (program) => {
    setEditingProgramId(program.id);
    setFormTitle(program.title);
    setFormType(program.type);
    setFormDate(program.date);
    setFormTime(program.time);
    setFormLocation(program.location);
    setFormDescription(program.description);
    setFormHost(program.host);
    setFormStatus(program.status);
    setIsActivityModalOpen(true);
  };

  const handleActivityFormSubmit = (e) => {
    e.preventDefault();
    if (!onUpdatePrograms) return;

    if (editingProgramId) {
      // Edit mode
      const updated = programs.map(p => {
        if (p.id === editingProgramId) {
          return {
            ...p,
            title: formTitle,
            type: formType,
            date: formDate,
            time: formTime,
            location: formLocation,
            description: formDescription,
            host: formHost,
            status: formStatus
          };
        }
        return p;
      });
      onUpdatePrograms(updated);
    } else {
      // Add mode
      const newProgram = {
        id: `prog-usr-${Date.now()}`,
        title: formTitle,
        type: formType,
        date: formDate,
        time: formTime,
        location: formLocation,
        description: formDescription,
        host: formHost,
        status: formStatus,
        registrantsCount: 0,
        registeredUsers: []
      };
      onUpdatePrograms([newProgram, ...programs]);
    }
    setIsActivityModalOpen(false);
  };

  const handleDeleteActivity = (programId) => {
    if (!onUpdatePrograms) return;
    if (window.confirm('Sigurado ka ba na nais mong i-delete ang aktibidad na ito?')) {
      const updated = programs.filter(p => p.id !== programId);
      onUpdatePrograms(updated);
    }
  };

  // New Stockpile item state (Official actions)
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [addQtyValue, setAddQtyValue] = useState(50);

  // Go bag score calc
  const totalItemsCount = GO_BAG_CHECKLIST.length;
  const checkedItemsCount = checkedItems.length;
  const preparednessScore = Math.round((checkedItemsCount / totalItemsCount) * 105); // cap at 100 max
  const finalScore = preparednessScore > 100 ? 100 : preparednessScore;

  const handleToggleGoBagItem = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(i => i !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const handleProgramRegisterSubmit = (e) => {
    e.preventDefault();
    if (!selectedProgramId || !registrantName) return;

    onRegisterForProgram(selectedProgramId, registrantName);
    setRegSuccess(true);
    setTimeout(() => {
      setRegistrantName('');
      setRegSuccess(false);
      setSelectedProgramId(null);
    }, 2000);
  };

  const handleUpdateStockSubmit = (itemId) => {
    if (addQtyValue <= 0) return;
    const targetItem = stockpileItems.find(i => i.id === itemId);
    if (!targetItem) return;

    onModifyStockpile(itemId, targetItem.quantity + addQtyValue);
    setSelectedStockId(null);
    setAddQtyValue(50);
  };

  return (
    <div className="space-y-6">
      
      {/* MODULE MAIN HEADER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black uppercase text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500 animate-pulse" />
            Preparedness & Capacity Building Hub
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Maging handa bago pa man dumating ang sakuna. Suriin ang Go-Bag, sumali sa mga Barangay drills, at subaybayan ang suplay.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COL 1 & 2: GO-BAG INTERACTIVE CHECKLIST & DRILLS SCHEDULER */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A. GO-BAG CHECKLIST INTERACTIVE SYSTEM */}
          <div className="bg-[#EEF2FC]/70 p-6 rounded-3xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-black uppercase font-mono text-[#4f46e5] tracking-widest block">Survival Resource Portal</span>
              <h3 className="font-extrabold text-slate-950 text-base sm:text-lg tracking-tight uppercase flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500 animate-pulse shrink-0" />
                Family Emergency Go Bag Planner
              </h3>
              <p className="text-xs text-slate-700 font-medium max-w-md leading-relaxed">
                We have separated the Go-Bag tracking into a dedicated, multi-category checklist manager. Track items for Documents, Food, Medical, Clothing, Tools, and Communications!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab('gobag')}
              className="py-2.5 px-5 bg-indigo-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer select-none active:scale-95 transition-all flex items-center gap-2"
            >
              Launch Go Bag Planner
            </button>
          </div>

          {/* B. DISASTER PROGRAMS & SKILLS DRILLS RESERVATION */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="border-b border-slate-150 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rose-500" />
                  Community Drills & Seminars Schedule
                </h3>
                <p className="text-xs text-slate-550 font-medium">Join the free fire preparedness and rescue training seminars conducted by BDRRMC and the Bureau of Fire Protection.</p>
              </div>

              {hasPreparednessAdminPrivilege && (
                <button
                  type="button"
                  onClick={handleOpenAddActivity}
                  className="py-1.5 px-3 bg-indigo-650 hover:bg-slate-900 text-white text-xs font-black rounded-lg shadow-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add Activity
                </button>
              )}
            </div>

            <div className="space-y-4">
              {programs.map((prog) => (
                <div 
                  key={prog.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                        prog.type === ProgramType.FIRE_SAFETY
                          ? 'bg-red-100 text-red-800'
                          : 'bg-sky-100 text-sky-850'
                      }`}>
                        {prog.type}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-semibold rounded ${
                        prog.status === 'Upcoming' ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {prog.status}
                      </span>
                    </div>

                    <h4 className="font-black text-xs text-slate-900 pt-1">{prog.title}</h4>
                    <p className="text-xs text-slate-705 leading-snug font-medium max-w-xl">{prog.description}</p>
                    
                    <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 font-mono pt-1.5 font-bold">
                      <span>📅 Petsa: <strong>{prog.date} ({prog.time})</strong></span>
                      <span>📍 Lugar: <strong>{prog.location}</strong></span>
                      <span>👤 Host: <strong>{prog.host}</strong></span>
                    </div>
                  </div>

                  {/* Options Option */}
                  <div className="flex flex-col justify-end items-start md:items-end shrink-0 gap-2">
                    <span className="text-[11px] font-black text-slate-650 font-mono">
                      {prog.registrantsCount} Residente ang Kasali
                    </span>

                    {hasPreparednessAdminPrivilege ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditActivity(prog)}
                          className="py-1 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black rounded-md shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteActivity(prog.id)}
                          className="py-1 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 hover:text-rose-800 text-[11px] font-bold rounded-md border border-rose-200 active:scale-95 transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      prog.status === 'Upcoming' && (
                        <button
                          onClick={() => setSelectedProgramId(prog.id)}
                          className="py-1.5 px-3.5 bg-indigo-650 hover:bg-slate-900 text-white text-[11px] font-black rounded-lg shadow-sm transition-all active:scale-95 text-center cursor-pointer"
                        >
                          I-register Aking Pangalan
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* COL 3: STOCKPILE RELIEF SUPPLY BAR & LOGISTICS COUNTERS */}
        <div className="space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 pb-3 mb-4">
              <Package className="w-4 h-4 text-rose-500" />
              Barangay relief / Stockpile Inventory
            </h3>

            <p className="text-[11px] text-slate-550 font-medium leading-relaxed mb-4">
              Pag-monitor sa mga nakaimbak na relief goods at disaster preparedness supplies sa Barangay center warehouse.
            </p>

            <div className="space-y-4">
              {stockpileItems.map((item) => {
                const isCritical = item.quantity <= item.minimumLevel;
                const ratio = Math.min(100, Math.round((item.quantity / (item.minimumLevel * 2)) * 100));

                return (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-150"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div>
                        <h4 className="font-bold text-xs text-slate-905">{item.name}</h4>
                        <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider uppercase block">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right font-black">
                        <span className="font-black text-xs block text-slate-900">
                          {item.quantity} {item.unit}
                        </span>
                        {isCritical ? (
                          <span className="text-[8px] font-black uppercase text-red-600 animate-pulse block">
                            ⚠️ CRITICAL WARNING
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono text-emerald-600 block">
                            Sapat (Adequate)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Stock bar */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
                      <div 
                        className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-500 font-bold font-mono">
                      <span>Min Safe: {item.minimumLevel} {item.unit}</span>
                      <span>Last Refil: {item.lastUpdated}</span>
                    </div>

                    {/* OFFICIAL BACKEND SUPPLY ADD RESTOCK BUTTON */}
                    {hasPreparednessAdminPrivilege && (
                      <div className="mt-2 pt-2 border-t border-dashed border-slate-200 flex justify-end">
                        {selectedStockId === item.id ? (
                          <div className="flex items-center gap-1.5 w-full">
                            <input
                              type="number"
                              required
                              value={addQtyValue}
                              onChange={(e) => setAddQtyValue(Number(e.target.value))}
                              placeholder="Qty"
                              className="w-1/2 text-[10px] p-1.5 rounded-lg border border-slate-250 bg-white"
                            />
                            <button
                              onClick={() => handleUpdateStockSubmit(item.id)}
                              className="text-[10px] font-black bg-rose-600 rounded-lg text-white py-1.5 px-3 text-center cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => setSelectedStockId(null)}
                              className="text-[10px] text-slate-400 py-1 font-bold px-1.5 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedStockId(item.id);
                              setAddQtyValue(50);
                            }}
                            className="text-[10px] font-black text-rose-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> RESTOCK
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* DRILL / PROGRAM REGISTRATION DIALOG SCREEN */}
      {selectedProgramId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full shadow-2xl relative p-5">
            
            <h3 className="font-extrabold text-slate-950 text-sm tracking-tight uppercase flex items-center gap-1.5 mb-2">
              📝 Register for Training Session
            </h3>
            
            <p className="text-xs text-slate-500 font-medium mb-4">
              Magrehistro rito upang ma-reserve ang inyong slot at certificate ng pagdalo sa piling pagsasanay.
            </p>

            {regSuccess ? (
              <div className="text-center py-4">
                <span className="text-2xl">🎉</span>
                <h4 className="text-sm font-black text-emerald-600 mt-2 uppercase">NAKA-REHISTRO NA PO KASALI KANA!</h4>
                <button
                  onClick={() => setSelectedProgramId(null)}
                  className="mt-4 px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleProgramRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-700">
                    Siyang Dadalo (Full name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrantName}
                    onChange={(e) => setRegistrantName(e.target.value)}
                    placeholder="Hal: Juan Dela Cruz"
                    className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProgramId(null)}
                    className="w-1/2 py-2 text-xs font-extrabold rounded-lg bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-black rounded-lg bg-indigo-600 hover:bg-slate-900 text-white cursor-pointer"
                  >
                    Confirm Register
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* DRILL / PROGRAM ADD AND EDIT DIALOG SCREEN */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in text-left">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl relative p-5 max-h-[90vh] overflow-y-auto">
            
            <h3 className="font-extrabold text-slate-950 text-sm tracking-tight uppercase flex items-center gap-1.5 mb-2">
              {editingProgramId ? '📝 Change Drill / Activity Details' : '➕ Add New Drill / Activity'}
            </h3>
            
            <p className="text-xs text-slate-500 font-medium mb-4">
              Maaaring punan ang mga detalye sa ibaba upang magdagdag o mag-edit ng aktibidad para sa kaligtasan ng pamayanan.
            </p>

            <form onSubmit={handleActivityFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-705">
                  Pamagat ng Aktibidad (Activity Title) *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Hal: Purok 2 Fire Drill at Suppression Seminar"
                  className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-705">
                    Uri ng Activity (Type)
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-bold cursor-pointer"
                  >
                    <option value={ProgramType.DRILL}>🚨 Emergency Drill</option>
                    <option value={ProgramType.FIRE_SAFETY}>🔥 Fire Safety Seminar</option>
                    <option value={ProgramType.SEMINAR}>📖 Preparedness Seminar</option>
                    <option value={ProgramType.TRAINING}>🩹 First Aid Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-705">
                    Katayuan (Status)
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-bold cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-705">
                    Petsa (Date) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="Hal: June 20, 2026"
                    className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-705">
                    Oras (Time Schedule) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="Hal: 1:00 PM - 4:00 PM"
                    className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-705">
                  Lugar ng Pagsasagawa (Location) *
                </label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Hal: Purok 3 Covered Court"
                  className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-705">
                  Host / Tagapagsalita (Organizer) *
                </label>
                <input
                  type="text"
                  required
                  value={formHost}
                  onChange={(e) => setFormHost(e.target.value)}
                  placeholder="Hal: BFP Maypajo Personnel"
                  className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-705">
                  Detalyadong Paglalarawan (Description) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ilarawan ang layunin ng pagsasanay, mga dadalo, at iba pang kailangang dalahin..."
                  className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 leading-relaxed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="w-1/2 py-2 text-xs font-extrabold rounded-lg bg-slate-100 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-black rounded-lg bg-indigo-650 hover:bg-slate-900 text-white cursor-pointer"
                >
                  {editingProgramId ? 'Save Changes' : 'Create Activity'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
