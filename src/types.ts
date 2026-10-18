export interface FuelPrices {
  Magna: number;
  Premium: number;
  Diesel: number;
  [key: string]: number;
}

export interface Pump {
  id: number | string;
  name: string;
  fuel: 'Magna' | 'Premium' | 'Diesel' | string;
  init: number;
  final: number;
  island?: string;
}

export interface BillDenominations {
  b1000: number;
  b500: number;
  b200: number;
  b100: number;
  b50: number;
  b20: number;
}

export interface PaymentsData {
  cash: number;
  coins: number;
  vouchers: number;
  cards: number;
  expenses: number;
  denominations?: BillDenominations;
}

export interface ShiftCutRecord {
  id: string;
  createdAt: number;
  dateStr: string;
  emp: string;
  shift: string;
  stationName?: string;
  prices: FuelPrices;
  pumps: Pump[];
  payments: PaymentsData;
  totalLiters: number;
  totalExpected: number;
  totalReceived: number;
  diff: number;
  status: 'exact' | 'surplus' | 'short';
  notes?: string;
}
