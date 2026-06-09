import type { AuditType } from '@/types';

export const AIRPORT_CODE = 'CGK';
export const AIRPORT_NAME = 'Bandara Internasional Soekarno-Hatta';
export const AIRPORT_NAME_EN = 'Soekarno-Hatta International Airport';
export const ORGANIZATION_NAME = 'PT Angkasa Pura Indonesia (Persero)';
export const HEADER_ORG_TITLE = 'Airport Service Quality Control';
export const HEADER_ORG_LOCATION = 'Soekarno-Hatta International Airport';

export const FINDING_CATEGORIES = [
  'Service Quality',
  'Customer Experience',
  'Facility Quality',
  'Operational Readiness',
  'Safety Observation',
  'Security Observation',
  'Accessibility',
  'Cleanliness',
  'Wayfinding',
  'Queue Management',
  'Passenger Comfort',
  'Commercial Service',
  'Transportation Service',
  'Cargo Service',
];

export const RCA_CATEGORIES = ['Man', 'Machine', 'Method', 'Material', 'Environment', 'Management'];

export const TERMINALS = ['Terminal 1A', 'Terminal 1B', 'Terminal 1C', 'Terminal 2D', 'Terminal 2E', 'Terminal 2F', 'Terminal 3'];

const terminal1Structure = {
  'Airport Access & Landside': {
    'Airport Access Road': ['Main Road', 'Secondary Road'],
    'Curbside Departure': ['Drop Off Zone', 'Trolley Area', 'Pedestrian Walkway', 'Passenger Canopy Area', 'Wayfinding & Signage Area'],
    'Curbside Arrival': ['Pick Up Zone', 'Taxi Queue Area', 'Ride Hailing Area', 'Shuttle Bus Area', 'Arrival Trolley Area'],
  },
  'Departure Experience': {
    'Curbside Departure': ['Drop Off Zone', 'Trolley Area'],
    'Check-in Area': ['Check-in Counter', 'Self Check-in Kiosk', 'Baggage Drop'],
    'Security Check Point': ['Screening Lane', 'Queue Area'],
    'Boarding Lounge': ['Seating Area', 'Gate Area'],
    'Boarding Gate': ['Gate Counter', 'Waiting Area'],
  },
  'Arrival Experience': {
    'Curbside Arrival': ['Pick Up Zone', 'Taxi Queue Area', 'Ride Hailing Area'],
    'Arrival Corridor': ['Walkway', 'Travelator'],
    'Baggage Claim Area': ['Carousel', 'Waiting Area'],
    'Arrival Hall': ['Information Counter', 'Exit Area'],
  },
  'Passenger Facilities': {
    'Toilet Facility': ['Male', 'Female'],
    'Accessible Toilet': ['Accessible Unit'],
    'Baby Changing Room': ['Changing Station'],
    'Elevator': ['Elevator Unit'],
    'Escalator': ['Escalator Unit'],
    'Travelator': ['Travelator Unit'],
    'Prayer Room': ['Prayer Area'],
    'Smoking Room': ['Smoking Area'],
    'Charging Station': ['Charging Point'],
    'Passenger Seating Area': ['Seating Zone'],
    'Information Counter': ['Counter'],
    'FIDS': ['Display Board'],
    'Wayfinding & Signage': ['Signage Point'],
    'Public Announcement System': ['PA Zone'],
    'Coworking Space': ['Work Area'],
    'Other': ['Manual Input'],
  },
  'Commercial Services': {
    'Retail Area': ['Shop Unit'],
    'Food & Beverage Area': ['Outlet'],
    'ATM Area': ['ATM Machine'],
  },
};

const terminal3Structure = {
  'Airport Access & Landside': {
    'Airport Access Road': ['Main Road'],
    'Curbside Departure': ['Drop Off Zone', 'Trolley Area'],
    'Curbside Arrival': ['Pick Up Zone', 'Taxi Queue Area', 'Ride Hailing Area'],
  },
  'Domestic Departure': {
    'Check-in Area': ['Check-in Counter', 'Self Check-in Kiosk'],
    'Security Check Point': ['Screening Lane'],
    'Boarding Lounge': ['Seating Area'],
    'Boarding Gates': ['Gate Counter'],
  },
  'International Departure': {
    'International Check-in Area': ['Check-in Counter'],
    'Immigration Departure': ['Immigration Counter'],
    'Security Check Point International': ['Screening Lane'],
    'International Boarding Lounge': ['Lounge Area'],
  },
  'Domestic Arrival': {
    'Arrival Corridor': ['Walkway'],
    'Domestic Baggage Claim': ['Carousel'],
    'Arrival Hall': ['Exit Area'],
  },
  'International Arrival': {
    'Immigration Arrival': ['Immigration Counter'],
    'International Baggage Claim': ['Carousel'],
    'Customs Area': ['Customs Counter'],
    'Quarantine Area': ['Quarantine Counter'],
    'International Arrival Hall': ['Exit Area'],
  },
  'Transit & Transfer': {
    'Domestic Transfer Area': ['Transfer Zone'],
    'International Transfer Area': ['Transfer Zone'],
    'Transfer Desk': ['Desk Counter'],
    'Transit Lounge': ['Lounge Area'],
  },
  'Passenger Facilities': {
    'Toilet Facility': ['Male', 'Female'],
    'Accessible Toilet': ['Accessible Unit'],
    'Baby Changing Room': ['Changing Station'],
    'Elevator': ['Elevator Unit'],
    'Escalator': ['Escalator Unit'],
    'Travelator': ['Travelator Unit'],
    'Buggy Car': ['Buggy Station'],
    'Prayer Room': ['Prayer Area'],
    'Smoking Room': ['Smoking Area'],
    'Charging Station': ['Charging Point'],
    'Passenger Seating Area': ['Seating Zone'],
    'Information Counter': ['Counter'],
    'FIDS': ['Display Board'],
    'Wayfinding & Signage': ['Signage Point'],
    'Public Announcement System': ['PA Zone'],
    'Coworking Space': ['Work Area'],
    'Other': ['Manual Input'],
  },
  'Commercial Services': {
    'Duty Free Area': ['Shop Unit'],
    'Retail Area': ['Shop Unit'],
    'Food & Beverage Area': ['Outlet'],
    'Airline Lounge': ['Lounge'],
    'Executive Lounge': ['Lounge'],
    'Premium Lounge': ['Lounge'],
  },
  'Intermodal Transportation': {
    'Skytrain / APMS': ['Station'],
    'Airport Train Station': ['Platform'],
    'TOD': ['Transit Area'],
  },
  'Parking Area': {
    'Terminal 1 Parking Area': ['Parking Zone'],
    'Terminal 2 Parking Area': ['Parking Zone'],
    'Terminal 3 Parking Area': ['Parking Zone'],
    'Premium Parking': ['Premium Zone'],
    'Motorcycle Parking': ['Motorcycle Zone'],
  },
  'Cargo Area': {
    'Cargo Acceptance Area': ['Acceptance Zone'],
    'Cargo Warehouse': ['Warehouse'],
    'Cargo Storage Area': ['Storage Zone'],
    'Cargo Delivery Area': ['Delivery Zone'],
    'Cargo Loading Area': ['Loading Zone'],
    'Cargo Unloading Area': ['Unloading Zone'],
    'Cold Storage Area': ['Cold Storage'],
    'Dangerous Goods Area': ['DG Zone'],
  },
};

export const TERMINAL_STRUCTURES: Record<string, Record<string, Record<string, string[]>>> = {
  'Terminal 1A': terminal1Structure,
  'Terminal 1B': terminal1Structure,
  'Terminal 1C': terminal1Structure,
  'Terminal 2D': terminal1Structure,
  'Terminal 2E': terminal1Structure,
  'Terminal 2F': terminal1Structure,
  'Terminal 3': terminal3Structure,
};

export function getZones(terminal: string): string[] {
  return Object.keys(TERMINAL_STRUCTURES[terminal] || {});
}

export function getAreas(terminal: string, zone: string): string[] {
  return Object.keys(TERMINAL_STRUCTURES[terminal]?.[zone] || {});
}

export function getSubAreas(terminal: string, zone: string, area: string): string[] {
  return TERMINAL_STRUCTURES[terminal]?.[zone]?.[area] || [];
}

export const STAKEHOLDERS = [
  ORGANIZATION_NAME,
  'Garuda Indonesia',
  'Lion Air',
  'Citilink',
  'JAS (Jasa Angkasa Semesta)',
  'Gapura Angkasa',
  'PT Jasa Prima',
  'PT ISS Facility Services',
  'PT Securindo Packatama',
  'PT Cardig Aero Services',
  'PT Gapura Multi Purpose',
];

export const AUDIT_TYPES: { Regulatory: AuditType[]; Internal: AuditType[] } = {
  Regulatory: ['PM', 'KP', 'ICAO', 'IATA'],
  Internal: ['SOP', 'SLA', 'SLG', 'Service Standard'],
};

export const ALL_AUDIT_TYPES: AuditType[] = [...AUDIT_TYPES.Regulatory, ...AUDIT_TYPES.Internal];