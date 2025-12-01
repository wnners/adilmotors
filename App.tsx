import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Car, FuelRecord, MaintenanceRecord, ViewState } from './types';
import { getReminders } from './utils';
import { Header } from './components/Header';
import { CarList } from './views/CarList';
import { CarDetail } from './views/CarDetail';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { X } from 'lucide-react';

// Mock Initial Data
const INITIAL_CARS: Car[] = [
  { id: 1, brand: 'Toyota', model: 'Camry', year: 2021, licensePlate: '123ABC01', mileage: 45000 }
];

const App: React.FC = () => {
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  // Forms State
  const [formData, setFormData] = useState<any>({});

  const selectedCar = useMemo(() => cars.find(c => c.id === selectedCarId), [cars, selectedCarId]);
  
  const reminders = useMemo(() => getReminders(cars, maintenance), [cars, maintenance]);

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    const newCar: Car = {
      id: Date.now(),
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year),
      licensePlate: formData.licensePlate,
      mileage: parseInt(formData.mileage) || 0,
    };
    setCars([...cars, newCar]);
    setCurrentView('list');
    setFormData({});
  };

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId) return;
    const newRecord: MaintenanceRecord = {
      id: Date.now(),
      carId: selectedCarId,
      date: formData.date,
      type: formData.type,
      mileage: parseInt(formData.mileage),
      cost: parseInt(formData.cost),
      nextMileage: formData.nextMileage ? parseInt(formData.nextMileage) : null,
      nextDate: formData.nextDate || null
    };
    setMaintenance([...maintenance, newRecord]);
    
    // Update car mileage if newer
    setCars(cars.map(c => c.id === selectedCarId && newRecord.mileage > c.mileage ? { ...c, mileage: newRecord.mileage } : c));
    
    setCurrentView('car-detail');
    setFormData({});
  };

  const handleAddFuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId) return;
    const newRecord: FuelRecord = {
      id: Date.now(),
      carId: selectedCarId,
      date: formData.date,
      liters: parseFloat(formData.liters),
      cost: parseInt(formData.cost),
      mileage: parseInt(formData.mileage)
    };
    setFuelRecords([...fuelRecords, newRecord]);

    // Update car mileage
    setCars(cars.map(c => c.id === selectedCarId && newRecord.mileage > c.mileage ? { ...c, mileage: newRecord.mileage } : c));
    
    setCurrentView('car-detail');
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Views Animation Variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-rose-50/50 text-slate-800 font-sans selection:bg-pink-200">
      
      {currentView === 'list' && (
        <>
          <Header onAdd={() => setCurrentView('add-car')} />
          <CarList 
            cars={cars} 
            reminders={reminders} 
            fuelRecords={fuelRecords}
            onSelectCar={(id) => { setSelectedCarId(id); setCurrentView('car-detail'); }}
            onAddCar={() => setCurrentView('add-car')}
          />
        </>
      )}

      <AnimatePresence mode='wait'>
        {currentView === 'car-detail' && selectedCar && (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-40 overflow-y-auto"
          >
            <CarDetail 
              car={selectedCar}
              maintenance={maintenance.filter(m => m.carId === selectedCar.id)}
              fuelRecords={fuelRecords.filter(f => f.carId === selectedCar.id)}
              onBack={() => setCurrentView('list')}
              onAddMaintenance={() => { 
                setFormData({ mileage: selectedCar.mileage, date: new Date().toISOString().split('T')[0] }); 
                setCurrentView('add-maintenance'); 
              }}
              onAddFuel={() => {
                setFormData({ mileage: selectedCar.mileage, date: new Date().toISOString().split('T')[0] });
                setCurrentView('add-fuel');
              }}
            />
          </motion.div>
        )}

        {/* Generic Modal Wrapper for Forms */}
        {(currentView === 'add-car' || currentView === 'add-maintenance' || currentView === 'add-fuel') && (
            <motion.div 
                key="modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/20 backdrop-blur-sm p-0 sm:p-4"
            >
                <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 border-b border-slate-100 flex justify-between items-center z-10">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            {currentView === 'add-car' ? 'Add Vehicle' : currentView === 'add-fuel' ? 'Add Fuel' : 'Add Service'}
                        </h2>
                        <button 
                            onClick={() => setCurrentView(currentView === 'add-car' ? 'list' : 'car-detail')}
                            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-6">
                        {currentView === 'add-car' && (
                            <form onSubmit={handleAddCar} className="space-y-4">
                                <Input id="brand" label="Brand" placeholder="Toyota" required onChange={handleInputChange} />
                                <Input id="model" label="Model" placeholder="Camry" required onChange={handleInputChange} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input id="year" label="Year" type="number" placeholder="2022" required onChange={handleInputChange} />
                                    <Input id="licensePlate" label="Plate" placeholder="123ABC01" required onChange={handleInputChange} />
                                </div>
                                <Input id="mileage" label="Current Mileage" type="number" placeholder="0" required onChange={handleInputChange} />
                                <Button type="submit" fullWidth className="mt-4">Save Vehicle</Button>
                            </form>
                        )}

                        {currentView === 'add-maintenance' && (
                            <form onSubmit={handleAddMaintenance} className="space-y-4">
                                <Input id="date" label="Date" type="date" value={formData.date} required onChange={handleInputChange} />
                                <Input id="type" label="Service Type" as="select" required onChange={handleInputChange}>
                                    <option value="">Select type...</option>
                                    <option value="Oil Change">Oil Change</option>
                                    <option value="Tire Rotation">Tire Rotation</option>
                                    <option value="Inspection">Annual Inspection</option>
                                    <option value="Repair">Repair</option>
                                    <option value="Other">Other</option>
                                </Input>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input id="mileage" label="Mileage" type="number" value={formData.mileage} required onChange={handleInputChange} />
                                    <Input id="cost" label="Cost (₸)" type="number" placeholder="0" required onChange={handleInputChange} />
                                </div>
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mt-4">
                                    <h4 className="text-amber-600 font-bold text-sm mb-3">Reminder Settings</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input id="nextMileage" label="Next Service (km)" type="number" placeholder="+10000" onChange={handleInputChange} className="bg-white" />
                                        <Input id="nextDate" label="Next Service (date)" type="date" onChange={handleInputChange} className="bg-white" />
                                    </div>
                                </div>
                                <Button type="submit" fullWidth className="mt-4 shadow-amber-500/20 from-amber-400 to-orange-500">Save Record</Button>
                            </form>
                        )}

                        {currentView === 'add-fuel' && (
                            <form onSubmit={handleAddFuel} className="space-y-4">
                                <Input id="date" label="Date" type="date" value={formData.date} required onChange={handleInputChange} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input id="liters" label="Liters" type="number" step="0.01" placeholder="45.5" required onChange={handleInputChange} />
                                    <Input id="cost" label="Total Cost (₸)" type="number" placeholder="10000" required onChange={handleInputChange} />
                                </div>
                                <Input id="mileage" label="Current Mileage" type="number" value={formData.mileage} required onChange={handleInputChange} />
                                <Button type="submit" fullWidth className="mt-4 shadow-emerald-500/20 from-emerald-400 to-teal-500">Save Fuel Log</Button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;