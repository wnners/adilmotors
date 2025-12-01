import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Droplets, Gauge, Calendar, Car as CarIcon } from 'lucide-react';
import { Car, Reminder, FuelRecord } from '../types';
import { calculateAverageFuelConsumption } from '../utils';

interface CarListProps {
  cars: Car[];
  reminders: Reminder[];
  fuelRecords: FuelRecord[];
  onSelectCar: (id: number) => void;
  onAddCar: () => void;
}

export const CarList: React.FC<CarListProps> = ({ cars, reminders, fuelRecords, onSelectCar, onAddCar }) => {
  return (
    <div className="p-6 pb-24 space-y-6">
      
      {/* Reminders Section */}
      {reminders.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Attention Needed</h3>
          {reminders.map((reminder) => (
            <div 
              key={reminder.id}
              className={`p-4 rounded-2xl border ${
                reminder.severity === 'critical' 
                  ? 'bg-red-50 border-red-100 text-red-800' 
                  : 'bg-amber-50 border-amber-100 text-amber-800'
              } flex items-start gap-3 shadow-sm`}
            >
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${reminder.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
              <p className="text-sm font-medium leading-relaxed">{reminder.text}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Cars List */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 mb-3">Your Fleet</h3>
        
        {cars.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-3xl shadow-sm border border-pink-50"
          >
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CarIcon className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No cars yet</h3>
            <p className="text-slate-500 mb-6">Add your first vehicle to get started</p>
            <button onClick={onAddCar} className="text-pink-600 font-semibold hover:underline">
              Add Car Now
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {cars.map((car, index) => {
              const avg = calculateAverageFuelConsumption(car.id, fuelRecords);
              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCar(car.id)}
                  className="bg-white p-5 rounded-3xl shadow-lg shadow-pink-900/5 border border-white cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{car.brand} {car.model}</h3>
                      <p className="text-slate-500 text-sm font-medium">{car.licensePlate}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700">{car.mileage.toLocaleString()} km</span>
                    </div>
                    {avg && (
                        <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-semibold text-emerald-700">{avg} L/100</span>
                        </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};