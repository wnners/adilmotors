import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Fuel, Wrench, Calendar, Gauge, TrendingUp, DollarSign } from 'lucide-react';
import { Car, MaintenanceRecord, FuelRecord } from '../types';
import { calculateAverageFuelConsumption, formatCurrency } from '../utils';
import { Button } from '../components/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CarDetailProps {
  car: Car;
  maintenance: MaintenanceRecord[];
  fuelRecords: FuelRecord[];
  onBack: () => void;
  onAddMaintenance: () => void;
  onAddFuel: () => void;
}

export const CarDetail: React.FC<CarDetailProps> = ({ 
  car, 
  maintenance, 
  fuelRecords, 
  onBack, 
  onAddMaintenance, 
  onAddFuel 
}) => {
  const avgConsumption = calculateAverageFuelConsumption(car.id, fuelRecords);
  
  // Sort records
  const sortedMaintenance = [...maintenance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedFuel = [...fuelRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Chart Data (Last 5 fuel records)
  const chartData = [...sortedFuel].reverse().slice(-5).map(r => ({
    date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    price: Math.round(r.cost / r.liters)
  }));

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Detail Header */}
      <div className="bg-white pb-6 pt-safe-top rounded-b-[2.5rem] shadow-xl shadow-pink-900/5 relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-rose-50/50 to-white pointer-events-none"></div>
        
        <div className="px-6 pt-4 pb-2 relative z-20">
          <button 
            onClick={onBack} 
            className="flex items-center gap-1 text-slate-500 mb-4 hover:text-slate-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-slate-800">{car.brand} {car.model}</h1>
            <p className="text-slate-500 font-medium mb-6">{car.licensePlate} • {car.year}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Mileage</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-slate-800">{car.mileage.toLocaleString()}</span>
                        <span className="text-xs text-slate-500">km</span>
                    </div>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                     <p className="text-xs font-bold text-rose-400 uppercase mb-1">Avg Consumption</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-rose-600">{avgConsumption || '—'}</span>
                        <span className="text-xs text-rose-500">L/100</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <Button onClick={onAddMaintenance} className="flex-1 shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-400 to-orange-500 border-none text-white">
                    <Wrench className="w-5 h-5" /> Service
                </Button>
                <Button onClick={onAddFuel} className="flex-1 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-400 to-teal-500 border-none text-white">
                    <Fuel className="w-5 h-5" /> Fuel
                </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-24">
        
        {/* Chart Section */}
        {chartData.length > 1 && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100"
            >
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Fuel Price Trend
                </h3>
                <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                                ))}
                            </Bar>
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0.8}/>
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        )}

        {/* History Lists */}
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 mb-3">Service History</h3>
                <div className="space-y-3">
                    {sortedMaintenance.length === 0 ? (
                        <p className="text-center text-slate-400 text-sm py-4 italic">No maintenance records</p>
                    ) : sortedMaintenance.map((m) => (
                        <motion.div 
                            key={m.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                    <Wrench className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{m.type}</p>
                                    <p className="text-xs text-slate-500">{new Date(m.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-800">{formatCurrency(m.cost)}</p>
                                <p className="text-xs text-slate-500">{m.mileage.toLocaleString()} km</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 mb-3">Fuel History</h3>
                <div className="space-y-3">
                    {sortedFuel.length === 0 ? (
                        <p className="text-center text-slate-400 text-sm py-4 italic">No fuel records</p>
                    ) : sortedFuel.map((f) => (
                        <motion.div 
                            key={f.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                                    <Fuel className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{f.liters} L</p>
                                    <p className="text-xs text-slate-500">{new Date(f.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-800">{formatCurrency(f.cost)}</p>
                                <p className="text-xs text-slate-500">{f.mileage.toLocaleString()} km</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};