import { Car, FuelRecord, MaintenanceRecord, Reminder } from './types';

export const calculateAverageFuelConsumption = (carId: number, fuelRecords: FuelRecord[]): string | null => {
  const carFuel = fuelRecords
    .filter((f) => f.carId === carId)
    .sort((a, b) => a.mileage - b.mileage);

  if (carFuel.length < 2) return null;

  let totalKm = 0;
  let totalLiters = 0;

  for (let i = 1; i < carFuel.length; i++) {
    const km = carFuel[i].mileage - carFuel[i - 1].mileage;
    totalKm += km;
    totalLiters += carFuel[i].liters;
  }

  if (totalKm === 0) return null;
  return ((totalLiters / totalKm) * 100).toFixed(1);
};

export const getReminders = (cars: Car[], maintenance: MaintenanceRecord[]): Reminder[] => {
  const today = new Date();
  const reminders: Reminder[] = [];

  maintenance.forEach((m) => {
    const car = cars.find((c) => c.id === m.carId);
    if (!car) return;

    if (m.nextDate) {
      const nextDate = new Date(m.nextDate);
      const daysLeft = Math.floor((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft >= 0 && daysLeft <= 30) {
        reminders.push({
          id: `date-${m.id}`,
          carId: car.id,
          text: `${car.brand} ${car.model}: Service due in ${daysLeft} days`,
          severity: daysLeft < 7 ? 'critical' : 'warning',
        });
      }
    }

    if (m.nextMileage) {
      const kmLeft = m.nextMileage - car.mileage;
      if (kmLeft >= 0 && kmLeft <= 1000) {
        reminders.push({
          id: `km-${m.id}`,
          carId: car.id,
          text: `${car.brand} ${car.model}: Service due in ${kmLeft} km`,
          severity: kmLeft < 200 ? 'critical' : 'warning',
        });
      }
    }
  });

  return reminders;
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(val);
};