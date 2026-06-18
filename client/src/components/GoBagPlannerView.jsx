import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  GlassWater, 
  Heart, 
  Shirt, 
  Wrench, 
  PhoneCall, 
  Plus, 
  Check, 
  Trash2, 
  ShieldAlert,
  Flame
} from 'lucide-react';

const DEFAULT_GO_BAG_ITEMS = [
  // 1. Documents
  { 
    id: 'gb-doc-1', 
    title: 'Nation ID or passport', 
    detail: 'Photocopy + original in waterproof pouch', 
    category: 'Documents', 
    priority: 'Urgent', 
    checked: true 
  },
  { 
    id: 'gb-doc-2', 
    title: 'Barangay clearance / certificate', 
    detail: 'Needed for relief assistance', 
    category: 'Documents', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-doc-3', 
    title: 'Birth certificate', 
    detail: 'Keep photocopies in a zip-lock bag', 
    category: 'Documents', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-doc-4', 
    title: 'Insurance documents', 
    detail: 'Health, life, property insurance card', 
    category: 'Documents', 
    priority: 'Important', 
    checked: false 
  },
  { 
    id: 'gb-doc-5', 
    title: 'Land title / lease contract', 
    detail: 'Photocopy is fine for proof of residence', 
    category: 'Documents', 
    priority: 'Optional', 
    checked: false 
  },

  // 2. Water & Food
  { 
    id: 'gb-wf-1', 
    title: 'Bottled drinking water', 
    detail: '1.5 liters per adult per day, minimum 3 days (4.5L minimum)', 
    category: 'Water & Food', 
    priority: 'Urgent', 
    checked: true 
  },
  { 
    id: 'gb-wf-2', 
    title: 'Non-perishable ready-to-eat cans', 
    detail: 'Sardines, meat rolls with built-in self-opening keys', 
    category: 'Water & Food', 
    priority: 'Urgent', 
    checked: true 
  },
  { 
    id: 'gb-wf-3', 
    title: 'High-energy bars & crackers', 
    detail: 'Dry biscuits, high-density calorie bars for immediate stamina', 
    category: 'Water & Food', 
    priority: 'Important', 
    checked: false 
  },
  { 
    id: 'gb-wf-4', 
    title: 'Portable eating utensils & opener', 
    detail: 'Foldable plastic spoon/fork and secure manual can opener', 
    category: 'Water & Food', 
    priority: 'Optional', 
    checked: false 
  },

  // 3. Medical
  { 
    id: 'gb-med-1', 
    title: 'Burn relief spray/ointments', 
    detail: 'Silver sulfadiazine gel and organic soothing aloe vera', 
    category: 'Medical', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-med-2', 
    title: 'First Aid Emergency Bandage Kit', 
    detail: 'Sterile surgical pads, cotton rolls, betadine, alcohol 70%', 
    category: 'Medical', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-med-3', 
    title: 'Prescribed maintenance medicines', 
    detail: '7-day personal supply of blood pressure/asthma drugs', 
    category: 'Medical', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-med-4', 
    title: 'N95 Respirator Face Masks', 
    detail: 'Essential protection against toxic dense fire smoke inhalation', 
    category: 'Medical', 
    priority: 'Important', 
    checked: false 
  },

  // 4. Clothing
  { 
    id: 'gb-clo-1', 
    title: 'Sturdy thick-soled shoes', 
    detail: 'Protect feet from dangerous loose nails, sharp debris, and embers', 
    category: 'Clothing', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-clo-2', 
    title: 'Thick working leather gloves', 
    detail: 'Essential for twisting hot door handles or clearing rubble safely', 
    category: 'Clothing', 
    priority: 'Important', 
    checked: false 
  },
  { 
    id: 'gb-clo-3', 
    title: 'Spare long-sleeve cotton shirts', 
    detail: '100% thick cotton clothing to guard limbs against radiant thermal heat', 
    category: 'Clothing', 
    priority: 'Important', 
    checked: false 
  },
  { 
    id: 'gb-clo-4', 
    title: 'Light windbreakers & rain coats', 
    detail: 'Protection from weather, rain, or soot accumulation', 
    category: 'Clothing', 
    priority: 'Optional', 
    checked: false 
  },

  // 5. Tools & Safety
  { 
    id: 'gb-tool-1', 
    title: 'High-lumen battery flashlight', 
    detail: 'Guaranteed local grid outages occur during fires', 
    category: 'Tools & Safety', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-tool-2', 
    title: 'Loud survival distress whistle', 
    detail: 'Used to alert search/rescue personnel if trapped in rooms', 
    category: 'Tools & Safety', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-tool-3', 
    title: 'Fireproof thermal escape blanket', 
    detail: 'Special retardant wrap to cross light flame blockades safely', 
    category: 'Tools & Safety', 
    priority: 'Important', 
    checked: false 
  },
  { 
    id: 'gb-tool-4', 
    title: 'Heavy duty pocket utility knife', 
    detail: 'Swiss multi-tool with rope cutters and screwdriver heads', 
    category: 'Tools & Safety', 
    priority: 'Optional', 
    checked: false 
  },

  // 6. Communications
  { 
    id: 'gb-com-1', 
    title: 'High-capacity full Powerbank', 
    detail: '20,000mAh backup to recharge tracking and emergency phones', 
    category: 'Communications', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-com-2', 
    title: 'Transistor AM/FM pocket radio', 
    detail: 'Monitor BDRRMC broadcast updates even when cell towers fail', 
    category: 'Communications', 
    priority: 'Urgent', 
    checked: false 
  },
  { 
    id: 'gb-com-3', 
    title: 'Physical emergency contact board', 
    detail: 'Handwritten cards containing BFP Caloocan, Red Cross, Barangay numbers', 
    category: 'Communications', 
    priority: 'Important', 
    checked: false 
  },
  { 
    id: 'gb-com-4', 
    title: 'Permanent thick marker and note pad', 
    detail: 'Used to write temporary distress markers or leaving logs', 
    category: 'Communications', 
    priority: 'Optional', 
    checked: false 
  }
];

export default function GoBagPlannerView({ setCurrentTab, onTriggerSOS }) {
  // Load initial Go Bag items state from localStorage if available
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('bdrrmc_gobag_planner_v2');
    return saved ? JSON.parse(saved) : DEFAULT_GO_BAG_ITEMS;
  });

  const [activeCategory, setActiveCategory] = useState('Documents');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states for adding items
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDetail, setNewItemDetail] = useState('');
  const [newItemPriority, setNewItemPriority] = useState('Urgent');

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('bdrrmc_gobag_planner_v2', JSON.stringify(items));
  }, [items]);

  // Categories list with Icons
  const categories = [
    { name: 'Documents', icon: FileText },
    { name: 'Water & Food', icon: GlassWater },
    { name: 'Medical', icon: Heart },
    { name: 'Clothing', icon: Shirt },
    { name: 'Tools & Safety', icon: Wrench },
    { name: 'Communications', icon: PhoneCall },
  ];

  // Calculations for current category & global scores
  const categoryItems = items.filter(item => item.category === activeCategory);
  
  // Total stats across the entire bag
  const totalItemsCount = items.length;
  const packedItemsCount = items.filter(i => i.checked).length;
  const stillNeededCount = totalItemsCount - packedItemsCount;
  const readinessPercent = totalItemsCount > 0 ? Math.round((packedItemsCount / totalItemsCount) * 100) : 0;

  // Toggle checklist check status
  const handleToggleItem = (itemId) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Delete an item from the checklist
  const handleDeleteItem = (itemId, e) => {
    e.stopPropagation(); // Prevent toggling when clicking delete
    if (window.confirm('Are you sure you want to delete this survival item?')) {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  // Add a brand new item to the active category
  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem = {
      id: `custom-gb-${Date.now()}`,
      title: newItemTitle.trim(),
      detail: newItemDetail.trim() || 'Custom emergency equipment',
      category: activeCategory,
      priority: newItemPriority,
      checked: false
    };

    setItems(prevItems => [...prevItems, newItem]);
    setNewItemTitle('');
    setNewItemDetail('');
    setNewItemPriority('Urgent');
    setShowAddForm(false);
  };

  // Handle default list restoration
  const handleRestoreDefaults = () => {
    if (window.confirm('Reset all items back to standard BDRRMC fire-safety recommended guidelines? This will delete custom items.')) {
      setItems(DEFAULT_GO_BAG_ITEMS);
    }
  };

  const [sosStatus, setSosStatus] = useState(null);

  // Trigger quick panic SOS
  const handleQuickSOS = () => {
    if (onTriggerSOS) {
      onTriggerSOS('FIRE', 'Barangay 35 (Active Go Bag Workspace)', 'IMMEDIATE SOS FIRE FIGHTING TRUCK DISPATCH REQUEST - GO BAG PLANNER SCREEN PANIC BUTTON');
      setSosStatus('🚒 EMERGENCY SOS DIRECTED! Local responders have been alerted of your exact Go-Bag workspace location.');
    } else {
      setSosStatus('🚒 SOS Simulation triggered successfully! Local fire crews notified.');
    }
    setTimeout(() => setSosStatus(null), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {sosStatus && (
        <div id="gobag-sos-notice" className="bg-[#EF4444] text-white p-3 px-4 rounded-2xl text-xs font-bold text-center animate-pulse border-2 border-red-700 shadow-md flex items-center justify-center gap-2">
          <Flame className="w-4 h-4 text-yellow-300 animate-bounce fill-yellow-300" />
          <span>{sosStatus}</span>
        </div>
      )}
      {/* 2. SUB HEADER CONTENT BANNER (Matches format from image) */}
      <div className="bg-[#A3B3F9] p-5 rounded-3xl text-slate-900 border border-indigo-200/50 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Abstract design elements to make it look highly stylized */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-indigo-400/10 pointer-events-none transform skew-x-12"></div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
            Your 72-hrs emergency go-bag
          </h2>
          <p className="text-xs text-indigo-950 font-semibold tracking-wide italic">
            Pack for fire evacuation — enough for 3 days per person
          </p>
        </div>
        <button
          onClick={handleRestoreDefaults}
          className="relative z-10 self-start md:self-center py-1.5 px-3.5 bg-slate-900/10 hover:bg-slate-900/25 border border-slate-900/20 text-slate-950 text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer"
        >
          Reset To Standard Guidelines
        </button>
      </div>

      {/* 3. DYNAMIC METRIC FEEDBACK AREA */}
      {readinessPercent < 40 ? (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
          <span>
            ⚠️ <strong>Low Evacuation Readiness:</strong> You have only packed {packedItemsCount} of {totalItemsCount} checklist items. We highly suggest preparing crucial civil documents and burn medicines today.
          </span>
        </div>
      ) : readinessPercent < 80 ? (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            👍 <strong>Satisfactory Preparedness:</strong> Your Go-Bag kit is {readinessPercent}% parsed! Keep it up. Double check expiration dates on food canned preserves and medicine items.
          </span>
        </div>
      ) : (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            🎉 <strong>Outstanding Civil Defense Preparedness:</strong> Your household is {readinessPercent}% fully equipped for instant fire evacuation. Share this knowledge with neighbors inside your Purok!
          </span>
        </div>
      )}

      {/* 4. MAIN INTERACTIVE SPLIT HUB (Left sub-sidebar, Right main container) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* SUB-SIDEBAR (Categories Selector) */}
        <div className="lg:col-span-1 bg-[#EEF2FC]/70 border border-indigo-100 p-4 rounded-3xl space-y-2">
          <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase block pb-1 px-1">
            Survival Core Category
          </span>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.name;
              const catTotal = items.filter(i => i.category === cat.name).length;
              const catChecked = items.filter(i => i.category === cat.name && i.checked).length;

              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setShowAddForm(false);
                  }}
                  className={`flex items-center gap-3 py-2.5 px-3.5 rounded-2xl text-left transition-all text-xs font-bold shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-white text-indigo-950 shadow-sm border-l-4 border-indigo-600 font-black' 
                      : 'hover:bg-white/50 text-slate-600'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="truncate flex-1">{cat.name}</span>
                  {catTotal > 0 && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-indigo-50 text-indigo-850' : 'bg-slate-200/60 text-slate-600'
                    }`}>
                      {catChecked}/{catTotal}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTAINER AND DETAIL PANEL */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* CATEGORY WORKSPACE BOX */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs space-y-4">
            
            {/* Active Category Title & Add Item Action */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {categories.find(c => c.name === activeCategory) && React.createElement(categories.find(c => c.name === activeCategory).icon, {
                  className: "w-5 h-5 text-indigo-700"
                })}
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {activeCategory}
                </h3>
              </div>

              {/* "+ Add Item" Button formatted like the image */}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="py-1.5 px-4 bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 hover:text-slate-950 font-black italic rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 text-xs tracking-wider cursor-pointer font-serif"
              >
                <Plus className="w-4 h-4 text-slate-900 stroke-[3px]" />
                Add item
              </button>
            </div>

            {/* Inline Toggleable Add Item Form */}
            {showAddForm && (
              <form onSubmit={handleAddItemSubmit} className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl shadow-inner space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                  Add custom survival item in {activeCategory}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-505 uppercase">Survival Item Title</label>
                    <input 
                      type="text"
                      required
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder="e.g., Photocopy of Barangay Cert"
                      className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-505 uppercase">Quantity / Packing instructions</label>
                    <input 
                      type="text"
                      value={newItemDetail}
                      onChange={(e) => setNewItemDetail(e.target.value)}
                      placeholder="e.g., Laminated, 2 copies"
                      className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div>
                    <span className="block text-[10px] font-extrabold text-slate-505 uppercase">Item Priority Tag</span>
                    <div className="flex gap-2 mt-1">
                      {['Urgent', 'Important', 'Optional'].map(prio => (
                        <button
                          key={prio}
                          type="button"
                          onClick={() => setNewItemPriority(prio)}
                          className={`py-1 px-3 text-[10px] font-bold rounded-full border transition-all cursor-pointer ${
                            newItemPriority === prio
                              ? prio === 'Urgent' ? 'bg-red-500 border-red-600 text-white font-black'
                                : prio === 'Important' ? 'bg-amber-400 border-amber-500 text-slate-950 font-black'
                                : 'bg-slate-500 border-slate-600 text-white font-black'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-205'
                          }`}
                        >
                          {prio}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="py-1.5 px-3 text-xs font-extrabold text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-1.5 px-4 bg-indigo-600 text-white text-xs font-black rounded-lg shadow-xs hover:bg-indigo-700 transition"
                    >
                      Save Item
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Checklist Items list */}
            <div className="space-y-3">
              {categoryItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-450 italic">
                  No items listed yet in {activeCategory}. Click "Add item" to insert!
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {categoryItems.map((item) => {
                    const isChecked = item.checked;
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleItem(item.id)}
                        className={`group relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 select-none ${
                          isChecked 
                            ? 'bg-indigo-50/50 border-indigo-300 shadow-xs' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-350'
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4 flex-1">
                          
                          {/* Checkbox (Formatted like the image: empty rounded box or ticked check) */}
                          <div className={`mt-0.5 h-5 w-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked 
                              ? 'bg-slate-900 border-slate-900 text-white' 
                              : 'border-slate-400 bg-white group-hover:border-slate-600'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                          </div>

                          <div className="space-y-0.5">
                            <span className={`text-xs sm:text-sm font-black tracking-tight block ${
                              isChecked ? 'text-indigo-950/70 line-through' : 'text-slate-900'
                            }`}>
                              {item.title}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-500 font-medium block">
                              {item.detail}
                            </span>
                          </div>
                        </div>

                        {/* Priority level Tag (Matches style in reference image) */}
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-center select-none shrink-0 ${
                            item.priority === 'Urgent' 
                              ? 'bg-red-50 text-red-550 border border-red-200' 
                              : item.priority === 'Important'
                                ? 'bg-amber-50 text-amber-600 border border-amber-300'
                                : 'bg-slate-100 text-slate-500 border border-slate-250'
                          }`}>
                            {item.priority}
                          </span>

                          {/* Quick delete for custom/user item adjustments */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bag Summary Area (Matches style in reference image) */}
            <div className="bg-[#2E2E32] rounded-3xl p-5 text-white space-y-4">
              <h4 className="text-[10px] sm:text-xs font-black uppercase text-slate-400 font-mono tracking-widest">
                Bag Summary
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Block 1: Packed */}
                <div className="bg-slate-100/10 hover:bg-slate-100/15 transition duration-150 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[9px] font-extrabold uppercase text-slate-350 tracking-wider">
                    Packed
                  </span>
                  <span className="text-xl font-black font-sans text-emerald-400">
                    {packedItemsCount} / {totalItemsCount}
                  </span>
                  <span className="text-[9px] text-slate-400">Items Packed</span>
                </div>

                {/* Block 2: Still Needed (Big bold number) */}
                <div className="bg-[#1F1F22] p-4 rounded-2xl border-2 border-red-500/20 flex flex-col items-center justify-center text-center space-y-0.5">
                  <span className="text-3xl font-black font-sans text-red-500 animate-pulse">
                    {stillNeededCount}
                  </span>
                  <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">
                    Still needed
                  </span>
                </div>

                {/* Block 3: Completed */}
                <div className="bg-slate-100/10 hover:bg-slate-100/15 transition duration-150 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-[9px] font-extrabold uppercase text-slate-350 tracking-wider">
                    Completed Status
                  </span>
                  <span className="text-xl font-black font-sans text-indigo-400">
                    {readinessPercent}%
                  </span>
                  <span className="text-[9px] text-slate-400">Kit Evac Ready</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
