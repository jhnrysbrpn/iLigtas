import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  PhoneCall, 
  CheckSquare, 
  Flame, 
  AlertTriangle, 
  Activity, 
  CheckCircle, 
  Users, 
  PlusCircle, 
  Package, 
  FileText,
  BarChart2
} from 'lucide-react';
import { IncidentCategory } from '../types';

export default function ResponseRecoveryView({
  userRole,
  evacuationCenters,
  distributions,
  reports,
  onAddVictimIntake,
  onAddReliefDistribution,
  t
}) {
  
  // Victim registration States
  const [victimFamilyName, setVictimFamilyName] = useState('');
  const [victimHead, setVictimHead] = useState('');
  const [purokArea, setPurokArea] = useState('Purok 3');
  const [familyMembers, setFamilyMembers] = useState(4);
  const [shelterCenterId, setShelterCenterId] = useState('evac-1');
  const [lossCategory, setLossCategory] = useState('Complete Fire Destruction');
  const [reliefRequest, setReliefRequest] = useState('Needs Food & Milk, Clothing, Bed Mats');
  const [victimRegisteredList, setVictimRegisteredList] = useState([
    { id: 'vic-1', name: 'Santos Family', head: 'Manuel Santos Jr.', members: 4, center: 'San Sebastian Covered Court', loss: 'Fire Damage - Kitchen Partial', request: 'Needs Fire Blankets & Cooking Sets', status: 'Assisted' },
    { id: 'vic-2', name: 'Alvarez Family', head: 'Gardo Alvarez', members: 6, center: 'San Sebastian Elementary School (Bldg A)', loss: 'Complete Flood submergence', request: 'Relief food, clean water, first aid', status: 'In Process' }
  ]);
  const [victimSuccess, setVictimSuccess] = useState(false);

  // New Distribution Batch States (Official actions)
  const [showDistForm, setShowDistForm] = useState(false);
  const [distBatchName, setDistBatchName] = useState('');
  const [distCenterId, setDistCenterId] = useState('evac-1');
  const [distItems, setDistItems] = useState('Food Packs, Bottled Water (5L)');
  const [distFamilies, setDistFamilies] = useState(10);
  const [distSuccess, setDistSuccess] = useState(false);

  const handleVictimSubmit = (e) => {
    e.preventDefault();
    if (!victimFamilyName || !victimHead) return;

    const matchedCenter = evacuationCenters.find(c => c.id === shelterCenterId);

    const newVictim = {
      id: `vic-${Date.now()}`,
      name: victimFamilyName,
      head: victimHead,
      members: familyMembers,
      center: matchedCenter ? matchedCenter.name : 'Home quarantine',
      loss: lossCategory,
      request: reliefRequest,
      status: 'In Process'
    };

    setVictimRegisteredList([newVictim, ...victimRegisteredList]);
    onAddVictimIntake(newVictim);
    setVictimSuccess(true);
    setTimeout(() => {
      setVictimFamilyName('');
      setVictimHead('');
      setReliefRequest('');
      setVictimSuccess(false);
    }, 2000);
  };

  const handleDistributionSubmit = (e) => {
    e.preventDefault();
    if (!distBatchName || !distItems) return;

    const newDist = {
      id: `dist-${Date.now()}`,
      centerId: distCenterId,
      batchName: distBatchName,
      itemsDistributed: distItems,
      familiesServed: Number(distFamilies),
      date: new Date().toISOString().split('T')[0],
      status: 'Scheduled'
    };

    onAddReliefDistribution(newDist);
    setDistSuccess(true);
    setTimeout(() => {
      setDistBatchName('');
      setDistItems('');
      setDistFamilies(10);
      setDistSuccess(false);
      setShowDistForm(false);
    }, 2000);
  };

  // Perform analytics counts from reports
  const totalIncidentsCount = reports.length;
  const fireReports = reports.filter(r => r.category === IncidentCategory.FIRE);
  const estimatedFireCost = fireReports.reduce((acc, r) => acc + (r.damageCostEstimated || 0), 0);
  const totalAffectedFamilies = fireReports.reduce((acc, r) => acc + (r.affectedFamiliesCount || 0), 0) + 12; // base offset representing offline stats

  return (
    <div className="space-y-6">
      
      {/* MODULE MAIN HEADER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black uppercase text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Response, Evacuation, and Recovery Log
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Monitor the status of evacuation centers, register for priority relief goods distribution, and audit historical disaster damage statistics.
          </p>
        </div>
      </div>

      {/* CORE TWO-COLUMN ACTION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: ACTIVE EVACUATION SANCTUARIES DETAILED LIST */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="border-b border-slate-150 pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Active Evacuation Centers Sanctuary Status Tracker
              </h3>
              <p className="text-xs text-slate-500">Live occupant capacity levels and direct administrative contact details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evacuationCenters.map(center => {
                const ratio = Math.round((center.currentOccupants / center.maxCapacity) * 100);
                const isFull = center.status === 'Full' || ratio >= 95;

                return (
                  <div 
                    key={center.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-left space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{center.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">📍 {center.locationName}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                        isFull ? 'bg-red-100 text-red-800 text-[10px] uppercase font-black' : 'bg-emerald-100 text-emerald-850'
                      }`}>
                        {isFull ? 'Siksikan (Full)' : 'May Bakante (Active)'}
                      </span>
                    </div>

                    {/* Progress Bar of Capacity */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 font-mono">
                        <span>Pamilyang Lumikas:</span>
                        <span>{center.currentOccupants} / {center.maxCapacity} Lax</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${ratio > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>

                    {/* Amenities quick tags list */}
                    <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-200">
                      {center.hasKitchen && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-50 text-amber-800">
                          🍲 Lutuan (Kitchen)
                        </span>
                      )}
                      {center.hasRestrooms && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-sky-50 text-sky-850">
                          🚻 Restrooms
                        </span>
                      )}
                      {center.hasMedicalSupply && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-50 text-emerald-850">
                          💊 Medical Cabinet
                        </span>
                      )}
                    </div>

                    {/* Admin Contact info */}
                    <div className="p-1.5 border border-slate-200 bg-white rounded text-[10px] font-mono flex items-center justify-between text-slate-600">
                      <span>In-Charge: {center.contactPerson}</span>
                      <a href={`tel:${center.phone}`} className="text-indigo-600 font-bold hover:underline">{center.phone}</a>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="border-b border-slate-150 pb-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-650 animate-pulse" />
                  Disaster Victim & Relief Assistance Registry
                </h3>
                <p className="text-xs text-slate-500">Submit family status records, structural damage assessments, and relief requests for your household</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Form */}
              <div className="md:col-span-1 border-r border-slate-150 pr-0 md:pr-4">
                {victimSuccess ? (
                  <div className="p-6 text-center text-xs bg-emerald-50 rounded-xl text-emerald-900 font-bold border border-emerald-250">
                    Thank you. Your family status and relief request have been successfully recorded!
                  </div>
                ) : (
                  <form onSubmit={handleVictimSubmit} className="space-y-3">
                    
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500">Family Last Name*</label>
                      <input
                        type="text"
                        required
                        value={victimFamilyName}
                        onChange={(e) => setVictimFamilyName(e.target.value)}
                        placeholder="e.g., Capistrano Family"
                        className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500">Head of Household*</label>
                      <input
                        type="text"
                        required
                        value={victimHead}
                        onChange={(e) => setVictimHead(e.target.value)}
                        placeholder="e.g., Jaime Capistrano"
                        className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-500">No. of Members</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={familyMembers}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setFamilyMembers(isNaN(val) ? '' : Math.max(0, val));
                          }}
                          className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-500">Purok Area</label>
                        <select
                          value={purokArea}
                          onChange={(e) => setPurokArea(e.target.value)}
                          className="mt-1 w-fit max-w-full text-xs py-2 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                          style={{ width: `calc(${(purokArea || '').length}ch + 3rem)` }}
                        >
                          <option value="Purok 1">Purok 1</option>
                          <option value="Purok 2">Purok 2</option>
                          <option value="Purok 3">Purok 3</option>
                          <option value="Purok 4">Purok 4 (Flood)</option>
                          <option value="Purok 5">Purok 5</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500">Evacuation Station</label>
                      <select
                        value={shelterCenterId}
                        onChange={(e) => setShelterCenterId(e.target.value)}
                        className="mt-1 w-fit max-w-full text-xs py-2 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                        style={{
                          width: `calc(${
                            (shelterCenterId === 'home' 
                              ? 'Home quarantine / Relatives' 
                              : (evacuationCenters.find(ec => ec.id === shelterCenterId)?.name || '')
                            ).length
                          }ch + 3rem)`
                        }}
                      >
                        {evacuationCenters.map(e => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                        <option value="home">Home quarantine / Relatives</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500">Incurred Damages / Loss</label>
                      <select
                        value={lossCategory}
                        onChange={(e) => setLossCategory(e.target.value)}
                        className="mt-1 w-fit max-w-full text-xs py-2 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                        style={{
                          width: `calc(${
                            ({
                              "Complete Fire Destruction": "Totally Destroyed (Fire)",
                              "Partial Fire kitchen damage": "Partially Damaged (Fire/Kitchen)",
                              "Complete Flood submergence": "Fully Submerged (Flood)",
                              "Partial storm damages": "Storm Damage (Roof/Structural)"
                            }[lossCategory] || lossCategory || '').length
                          }ch + 3rem)`
                        }}
                      >
                        <option value="Complete Fire Destruction">Totally Destroyed (Fire)</option>
                        <option value="Partial Fire kitchen damage">Partially Damaged (Fire/Kitchen)</option>
                        <option value="Complete Flood submergence">Fully Submerged (Flood)</option>
                        <option value="Partial storm damages">Storm Damage (Roof/Structural)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500">Requested Relief Assistance</label>
                      <textarea
                        required
                        rows={2}
                        value={reliefRequest}
                        onChange={(e) => setReliefRequest(e.target.value)}
                        className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
                        placeholder="Need baby diapers, blankets, mats, water, and first aid..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg font-black text-xs shadow-sm active:scale-95 transition-all"
                    >
                      REGISTER MY FAMILY
                    </button>

                  </form>
                )}
              </div>

              {/* Right Column: Active Registrants Lists */}
              <div className="md:col-span-2 space-y-3">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
                  Recently Registered Families (Assistance Board)
                </span>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {victimRegisteredList.map((vic, idx) => (
                    <div 
                      key={vic.id || idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-250"
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900">
                            {vic.name} ({vic.head})
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium">📍 Sentral shelter: {vic.center}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                          vic.status === 'Assisted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-80 * 2 font-bold'
                        }`}>
                          {vic.status}
                        </span>
                      </div>

                      <div className="mt-2 text-xs">
                        <p className="text-slate-800">
                          <strong>Damages:</strong> <span className="text-rose-600 font-semibold">{vic.loss}</span>
                        </p>
                        <p className="text-slate-500 text-[11px] italic mt-0.5">
                          <strong>Request:</strong> {vic.request}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RELIEF GOODS DISTRIBUTION TIMELINE & CHARTS */}
        <div className="space-y-6">
          
          {/* A. DAMAGE INCIDENT REVIEW & ANALYTICS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-205 shadow-xs">
            <h3 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 pb-3 mb-3">
              <BarChart2 className="w-4 h-4 text-rose-500 animate-pulse" />
              BDRRMC Post-Incident Review Analytics
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center mb-4">
              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Emergency / Fire Calls</span>
                <span className="text-2xl font-black text-rose-600 block mt-1">{fireReports.length}</span>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500">Affected Families</span>
                <span className="text-2xl font-black text-amber-600 block mt-1">{totalAffectedFamilies} Pax</span>
              </div>
            </div>

            {/* Financial cost of damage bar */}
            <div className="bg-[#EFF2FE] p-4 rounded-xl border border-slate-250 text-slate-900">
              <span className="text-[9px] font-black text-slate-550 uppercase tracking-widest block">Estimated Damage Cost:</span>
              <span className="text-lg font-black text-slate-950 block mt-1">
                ₱{estimatedFireCost.toLocaleString('en')}.05 PHP
              </span>
              <p className="text-[10px] italic text-slate-550 mt-1 font-medium">
                * Based on the assessment of our Barangay Captain and the Bureau of Fire Protection (BFP).
              </p>
            </div>

            {/* Safety Review notes */}
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed font-medium">
              <strong>Latest Response Report:</strong> After rigorous structural assessment at the Purok 3 residential area, local officers declared the establishment of a Purok Volunteer Fire Brigade to proactively mitigate rapid fire propagation while BFP firetrucks are in transit.
            </div>
          </div>

          {/* B. RELIEF DISTRIBUTION TRACKER */}
          <div className="bg-white p-5 rounded-2xl border border-slate-205 shadow-xs relative">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3 mb-3">
              <h3 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                Relief Goods Distribution Tracker
              </h3>

              {/* Official / Admin can deploy distribution */}
              {userRole === 'Admin' && (
                <button
                  onClick={() => setShowDistForm(!showDistForm)}
                  className="p-1 rounded text-rose-600 hover:bg-neutral-100 text-xs font-bold"
                >
                  {showDistForm ? 'View Logs' : '+ New Batch'}
                </button>
              )}
            </div>

            {showDistForm ? (
              <form onSubmit={handleDistributionSubmit} className="space-y-3 border-b border-dashed border-slate-200 pb-4 mb-4">
                {distSuccess ? (
                  <p className="text-xs text-emerald-600 font-bold p-2 text-center bg-emerald-50 rounded">
                    ✓ Distribution batch scheduled successfully!
                  </p>
                ) : (
                  <>
                    <input
                      type="text"
                      required
                      value={distBatchName}
                      onChange={(e) => setDistBatchName(e.target.value)}
                      placeholder="Relief Batch Name (e.g., Purok 3 Relief Pack)"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                    <select
                      value={distCenterId}
                      onChange={(e) => setDistCenterId(e.target.value)}
                      className="w-fit max-w-full text-xs py-2 px-3 pr-10 h-auto whitespace-normal wrap-break-word rounded-lg border border-slate-300 bg-white text-slate-900 cursor-pointer"
                      style={{
                        width: `calc(${
                          (evacuationCenters.find(ec => ec.id === distCenterId)?.name || '').length
                        }ch + 3rem)`
                      }}
                    >
                      {evacuationCenters.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      value={distItems}
                      onChange={(e) => setDistItems(e.target.value)}
                      placeholder="Mga kasamang item (e.g. Can goods, mat, blankets)"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        min={0}
                        value={distFamilies}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setDistFamilies(isNaN(val) ? '' : Math.max(0, val));
                        }}
                        className="w-1/2 text-xs p-2 rounded-lg border border-slate-300"
                        placeholder="Families count"
                      />
                      <button
                        type="submit"
                        className="w-1/2 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg text-xs font-bold"
                      >
                        I-release Batch
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : null}

            <div className="space-y-3.5">
              {distributions.map((dist) => (
                <div key={dist.id} className="relative pl-5 border-l-2 border-emerald-500 py-1">
                  
                  {/* Circle locator index */}
                  <span className="absolute -left-1.5 top-2.5 h-3 w-3 bg-emerald-500 rounded-full border border-white" />

                  <div className="flex justify-between items-start text-xs">
                    <h4 className="font-extrabold text-slate-900">{dist.batchName}</h4>
                    <span className="text-[10px] font-mono font-bold p-0.5 rounded bg-emerald-50 text-emerald-800">
                      {dist.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium mt-1">Included items: {dist.itemsDistributed}</p>
                  
                  <div className="flex justify-between text-[10px] text-slate-450 font-mono mt-1 pt-1.5 border-t border-slate-150">
                    <span>👨‍👩‍👧‍👦 {dist.familiesServed} Families Served</span>
                    <span>🗓️ Petsa: {dist.date}</span>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
