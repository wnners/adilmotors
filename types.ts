export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  mileage: number;
}

export interface MaintenanceRecord {
  id: number;
  carId: number;
  date: string;
  type: string;
  mileage: number;
  cost: number;
  nextMileage?: number | null;
  nextDate?: string | null;
}

export interface FuelRecord {
  id: number;
  carId: number;
  date: string;
  liters: number;
  cost: number;
  mileage: number;
}

export type ViewState = 'list' | 'add-car' | 'car-detail' | 'add-maintenance' | 'add-fuel';

export interface Reminder {
  id: string;
  carId: number;
  text: string;
  severity: 'warning' | 'critical';
}