import {
  IncidentCategory,
  IncidentStatus,
  PriorityLevel,
  AlertSeverity,
  ProgramType
} from '../types';

// Barangay 35 Maypajo Caloocan, Metro Manila location coordinates
export const BARANGAY_CENTER_LAT = 14.64028;
export const BARANGAY_CENTER_LNG = 120.97082;

export const INITIAL_ALERTS = [
  {
    id: 'alt-1',
    title: 'OVERHEAT ELECTRICAL GRID ADVISORY',
    severity: AlertSeverity.WARNING,
    message: 'High electrical loads registered in Purok 4 J.P. Rizal St. residents are advised to limit heavy appliance usage to prevent transformer spark fires.',
    affectedArea: 'Purok 4 - Sawata Area',
    timestamp: '2026-06-12T11:30:00-07:00',
    isActive: true,
    createdBy: 'BDRRMC Caloocan Dispatch',
    broadcastSMS: true
  },
  {
    id: 'alt-2',
    title: 'FIRE PREVENTION ACTION: Clean LPG Connections',
    severity: AlertSeverity.ADVISORY,
    message: 'Residents must check their kitchen gas hoses and regulator systems for any signs of decay. Safe soap bubble leak tests are advised this weekend.',
    affectedArea: 'All Puroks (1-5), Barangay 35',
    timestamp: '2026-06-11T10:00:00-07:00',
    isActive: true,
    createdBy: 'BFP Caloocan Liaison Office',
    broadcastSMS: false
  },
  {
    id: 'alt-3',
    title: 'SIMULATED FIRE DRILL TODAY',
    severity: AlertSeverity.ADVISORY,
    message: 'The annual community fire response training will begin at Maypajo Elementary School. Practice emergency escape protocols immediately.',
    affectedArea: 'M.St. Corner Solis Area',
    timestamp: '2026-06-10T09:00:00-07:00',
    isActive: false,
    createdBy: 'Barangay Captain Noel Aguilar',
    broadcastSMS: true
  }
];

export const INITIAL_HAZARD_REPORTS = [
  {
    id: 'rep-fire-1',
    category: IncidentCategory.FIRE,
    title: 'Active Kitchen Fire - Solis Alleyway',
    description: 'A grease/oil cooking fire occurred in a residential kitchen. Smoke is heavy and residents are starting to evacuate the immediate structures. Dry chemical extinguishers are being deployed by volunteers.',
    reporterName: 'Carlos Mendiola',
    reporterPhone: '0917-882-3344',
    locationName: 'Purok 3, Solis Street (Near Maypajo Public Market)',
    latitude: 14.6398,
    longitude: 120.9712,
    status: IncidentStatus.DISPATCHED,
    priority: PriorityLevel.HIGH,
    timestamp: '2026-06-12T12:15:00-07:00',
    comments: [
      {
        id: 'comm-1',
        author: 'Caloocan Fire Main',
        role: 'Responder',
        text: 'Bureau of Fire Protection (BFP) Maypajo Sub-station dispatched a standard chemical fire engine en route to Solis Street.',
        timestamp: '2026-06-12T12:18:00-07:00'
      }
    ],
    assignedResponder: 'BFP Maypajo Sub-station & Barangay Emergency Crew Alpha',
    affectedFamiliesCount: 2,
    damageCostEstimated: 75000
  },
  {
    id: 'rep-fire-2',
    category: IncidentCategory.FIRE,
    title: 'Overheated Sub-meter Sparking',
    description: 'An old electric meter is heavily sparking and producing smoldering plastic smoke over J.P. Rizal St. corner. Local utility company has been emergency called for line cutoff.',
    reporterName: 'Lina Almonte',
    reporterPhone: '0918-776-5544',
    locationName: 'Purok 4, J.P. Rizal St. Corner (Sawata Area)',
    latitude: 14.6415,
    longitude: 120.9701,
    status: IncidentStatus.VERIFIED,
    priority: PriorityLevel.HIGH,
    timestamp: '2026-06-12T11:45:00-07:00',
    comments: [
      {
        id: 'comm-2',
        author: 'Disaster Command Desk',
        role: 'Admin',
        text: 'Meralco emergency dispatch is notified. Power cutoff line isolation is currently in progress.',
        timestamp: '2026-06-12T11:55:00-07:00'
      }
    ],
    assignedResponder: 'Meralco Utility Dispatch & Fire Patrol volunteers'
  },
  {
    id: 'rep-fire-3',
    category: IncidentCategory.FIRE,
    title: 'Smoldering Wire Accumulation Hazards',
    description: 'Tangled, dense low-hanging service lines are getting compressed near a residential wooden balcony. Smoke was briefly seen. This poses a major brush-fire danger.',
    reporterName: 'Danilo Cruz',
    reporterPhone: '0915-443-2211',
    locationName: 'Purok 1, Maypajo Elementary School Area',
    latitude: 14.6385,
    longitude: 120.9723,
    status: IncidentStatus.PENDING,
    priority: PriorityLevel.MEDIUM,
    timestamp: '2026-06-12T12:02:00-07:00',
    comments: []
  },
  {
    id: 'rep-fire-4',
    category: IncidentCategory.FIRE,
    title: 'Rubbish Fire Near School Perimeter Wall',
    description: 'Garbage and plastic waste illegally burned near concrete perimeter wall. Smoke resolved by barangay volunteers with buckets of sand. Closed out.',
    reporterName: 'Nita Reyes',
    reporterPhone: '0922-334-5566',
    locationName: 'Purok 2, Behind Barangay 35 Daycare Centre',
    latitude: 14.6409,
    longitude: 120.9732,
    status: IncidentStatus.RESOLVED,
    priority: PriorityLevel.LOW,
    timestamp: '2026-06-11T16:10:00-07:00',
    comments: [],
    assignedResponder: 'Barangay Clean-up crew',
    affectedFamiliesCount: 0,
    damageCostEstimated: 200
  }
];

export const INITIAL_EVACUATION_CENTERS = [
  {
    id: 'evac-1',
    name: 'Maypajo Elementary School (Bldg A)',
    locationName: 'Rizal Avenue Ext, Maypajo, Caloocan',
    currentOccupants: 35,
    maxCapacity: 250,
    status: 'Active',
    contactPerson: 'Principal Josefa De Leon',
    phone: '0915-111-2233',
    hasMedicalSupply: true,
    hasRestrooms: true,
    hasKitchen: true,
    latitude: 14.6388,
    longitude: 120.9721
  },
  {
    id: 'evac-2',
    name: 'Barangay 35 Covered Court Complex',
    locationName: 'Chapel Lane, Purok 2, Caloocan',
    currentOccupants: 12,
    maxCapacity: 400,
    status: 'Active',
    contactPerson: 'Kagawad Elena Roxas',
    phone: '0935-444-5566',
    hasMedicalSupply: true,
    hasRestrooms: true,
    hasKitchen: true,
    latitude: 14.6410,
    longitude: 120.9715
  },
  {
    id: 'evac-3',
    name: 'Maypajo Health Center Secondary Space',
    locationName: 'J.P. Rizal St. Block 2',
    currentOccupants: 0,
    maxCapacity: 100,
    status: 'Inactive',
    contactPerson: 'Dr. Arthur Singson',
    phone: '0919-666-7788',
    hasMedicalSupply: true,
    hasRestrooms: true,
    hasKitchen: false,
    latitude: 14.6425,
    longitude: 120.9698
  }
];

export const INITIAL_PROGRAMS = [
  {
    id: 'prog-1',
    title: 'Barangay Fire Response Training',
    type: ProgramType.FIRE_SAFETY,
    date: '2026-06-18',
    time: '2:00 PM - 5:00 PM',
    location: 'Barangay 35 Covered Court',
    description: 'Learn the proper usage of a Fire Extinguisher (PASS Method). Hands-on simulation guided by Caloocan Fire Department. Free snacks and safety certificates will be provided.',
    host: 'Bureau of Fire Protection (BFP) Caloocan',
    status: 'Upcoming',
    registrantsCount: 55,
    registeredUsers: ['Carlos Mendiola', 'Lina Almonte']
  },
  {
    id: 'prog-2',
    title: 'Quarterly Fire Awareness Seminar by BFP',
    type: ProgramType.FIRE_SAFETY,
    date: '2026-06-25',
    time: '8:00 AM - 12:00 PM',
    location: 'Maypajo Elementary School gym',
    description: 'BFP Officers will detail safety guidelines regarding electrical safety, LPG connections, and optimal family fire evacuation mapping rules for tightly populated puroks.',
    host: 'BFP Caloocan District 2',
    status: 'Upcoming',
    registrantsCount: 89,
    registeredUsers: []
  },
  {
    id: 'prog-3',
    title: 'Fire Safety Seminar: Prevent Hazards In Your Business',
    type: ProgramType.SEMINAR,
    date: '2026-06-29',
    time: '1:00 PM - 3:30 PM',
    location: 'Barangay Function Hall',
    description: 'Interactive session detailing how to identify hot plugs, low submeter capacity limitations, and affordable home smoke alarm units install tips for residents.',
    host: 'Volunteers for Safe Caloocan',
    status: 'Upcoming',
    registrantsCount: 22,
    registeredUsers: []
  },
  {
    id: 'prog-4',
    title: 'Fire Safety Drill Seminar and Fire Drill - June 2, 2026',
    type: ProgramType.TRAINING,
    date: '2026-06-02',
    time: '9:00 AM',
    location: 'Main Hydrant Station, J.P. Rizal St',
    description: 'A complete walkthrough on how to operate fire hydrants, hose pressure relief systems, and how to coordinate with initial BFP responder trucks during emergencies.',
    host: 'Caloocan Fire Volunteers Club',
    status: 'Completed',
    registrantsCount: 41,
    registeredUsers: []
  }
];

export const INITIAL_STOCKPILE = [
  {
    id: 'st-1',
    name: 'Dry Powder Chemical Fire Extinguisher (10 lbs)',
    category: 'Fire fighting tools',
    quantity: 50,
    unit: 'units',
    minimumLevel: 30,
    lastUpdated: '2026-06-11'
  },
  {
    id: 'st-2',
    name: 'Heavy Duty Nomex Fire Escape Safety Blanket',
    category: 'Rescue Equipment',
    quantity: 120,
    unit: 'units',
    minimumLevel: 50,
    lastUpdated: '2026-06-11'
  },
  {
    id: 'st-3',
    name: 'Emergency Burn Relief Gel & Dressing Packs',
    category: 'Medical Kits',
    quantity: 150,
    unit: 'boxes',
    minimumLevel: 80,
    lastUpdated: '2026-06-10'
  },
  {
    id: 'st-4',
    name: 'Barangay Volunteer Brass Hydrant Nozzles (2.5 inch)',
    category: 'Fire fighting tools',
    quantity: 18,
    unit: 'pcs',
    minimumLevel: 10,
    lastUpdated: '2026-06-08'
  },
  {
    id: 'st-5',
    name: 'Emergency Water Bottles for Fire evacuees (5 Liters)',
    category: 'Potable Water',
    quantity: 350,
    unit: 'bottles',
    minimumLevel: 200,
    lastUpdated: '2026-06-11'
  },
  {
    id: 'st-6',
    name: 'Barangay Fire Patrol High-intensity Megaphone',
    category: 'Rescue Equipment',
    quantity: 14,
    unit: 'units',
    minimumLevel: 10,
    lastUpdated: '2026-06-05'
  }
];

export const INITIAL_VULNERABILITY_REGISTRY = [
  {
    id: 'vul-1',
    familyName: 'Mendiola Household',
    headOfHousehold: 'Carlos Mendiola',
    membersCount: 5,
    address: 'Purok 3, Solis Street (Near Public Market)',
    vulnerableMembers: ['Elderly'],
    hazardExposure: ['High Fire Risk'],
    notified: true,
    registeredDate: '2026-05-18'
  },
  {
    id: 'vul-2',
    familyName: 'Valdez Family',
    headOfHousehold: 'Federico Valdez',
    membersCount: 7,
    address: 'Purok 4, Sawata Compound (Low Height Wood Alley)',
    vulnerableMembers: ['Infant', 'Elderly'],
    hazardExposure: ['High Fire Risk'],
    notified: true,
    registeredDate: '2026-06-01'
  },
  {
    id: 'vul-3',
    familyName: 'Nolasco Household',
    headOfHousehold: 'Teresa Nolasco',
    membersCount: 4,
    address: 'Purok 1, Chapel Side St',
    vulnerableMembers: ['Disabled'],
    hazardExposure: ['High Fire Risk'],
    notified: false,
    registeredDate: '2026-06-10'
  }
];

export const HYDRANTS_DATA = [
  {
    id: 'hyd-1',
    name: 'Sawata Alley Main Hydrant',
    locationName: 'Entrance of Sawata Area, J.P. Rizal St',
    status: 'Operational',
    latitude: 14.6416,
    longitude: 120.9702
  },
  {
    id: 'hyd-2',
    name: 'Maypajo School Frontage Hydrant',
    locationName: 'Directly in front of School gate',
    status: 'Operational',
    latitude: 14.6384,
    longitude: 120.9722
  },
  {
    id: 'hyd-3',
    name: 'Solis-Market Block Hydrant',
    locationName: 'Solis St corner J. Aguilar St',
    status: 'Operational',
    latitude: 14.6401,
    longitude: 120.9711
  },
  {
    id: 'hyd-4',
    name: 'Barangay 35 Hall Hydrant',
    locationName: 'Side of Barangay Hall Compound Gate',
    status: 'Operational',
    latitude: 14.6412,
    longitude: 120.9716
  },
  {
    id: 'hyd-5',
    name: 'Chapel Alley Backup Hydrant',
    locationName: 'Solis St. Inner Block 4',
    status: 'Low Pressure',
    latitude: 14.6392,
    longitude: 120.9705
  }
];

export const RELIEF_DISTRIBUTION_MOCK = [
  {
    id: 'dist-1',
    centerId: 'evac-1',
    batchName: 'Solis Fire First Assistance Wave',
    itemsDistributed: 'Burn Ointment creams, Cotton packs, Rice sacks, Blankets',
    familiesServed: 5,
    date: '2026-06-12',
    status: 'Completed'
  },
  {
    id: 'dist-2',
    centerId: 'evac-2',
    batchName: 'Purok 4 Pre-positioned Extinguishers',
    itemsDistributed: 'Portable ABC Extinguisher Kits, Smoke alarms',
    familiesServed: 25,
    date: '2026-06-11',
    status: 'Completed'
  }
];

export const FIRE_SAFETY_TIPS = [
  {
    id: 'fs-1',
    tag: 'Home Appliance',
    title: 'Proper Electrical Usage (Overload Prevention)',
    description: 'Avoid daisy-chaining multi-sockets or extension lines. Unplug ironers, microwave ovens, or other heavy appliances when not in active use.'
  },
  {
    id: 'fs-2',
    tag: 'Kitchen Safety',
    title: 'LPG Gas Tank Security Check',
    description: 'Verify gas hoses and pressure valves weekly for structural visual cracks. Turn off the gas cylinder regulator knob whenever exiting the home.'
  },
  {
    id: 'fs-3',
    tag: 'PASS Method',
    title: 'How to use a fire extinguisher properly',
    description: 'P-A-S-S: (P) Pull the safety pin; (A) Aim the hose nozzle at the extreme base of the fire; (S) Squeeze the lever; (S) Sweep side-to-side.'
  },
  {
    id: 'fs-4',
    tag: 'Smoke Safety',
    title: 'Low crawling escape during heavy smoke',
    description: 'Hot air, CO gas, and chemicals pool high first near ceiling heights. Keep your head low to the ground and put wet tissue/cloth over mouth.'
  }
];

export const GO_BAG_CHECKLIST = [
  { id: 'gb-1', text: 'Scans of ID & Birth Certificates inside dry waterproof pouch', category: 'Documents', required: true },
  { id: 'gb-2', text: 'Bottled drinking water (1.5 liters per adult per day, minimum 3 days)', category: 'Essentials', required: true },
  { id: 'gb-3', text: 'Non-perishable shelf goods (ready-to-eat sardines, meat rolls with keys)', category: 'Essentials', required: true },
  { id: 'gb-4', text: 'Burn relief sprays, bandage pads, cotton, betadine, alcohol', category: 'Medical', required: true },
  { id: 'gb-5', text: 'Battery flashlight, small emergency whistling tube, and full Powerbank', category: 'Safety Tools', required: true },
  { id: 'gb-6', text: 'Foldable light fireproof escape canvas blanket', category: 'Safety Tools', required: false }
];
