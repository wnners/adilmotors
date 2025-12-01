import React from 'react';
import { CarFront, Plus } from 'lucide-react';

interface HeaderProps {
  onAdd: () => void;
  showAdd?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onAdd, showAdd = true }) => {
  return (
    <header className="sticky top-0 z-30 pt-safe-top">
        <div className="px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-white/20 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg shadow-pink-500/30">
                    <CarFront className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 leading-none">AutoPeach</h1>
                    <span className="text-xs text-rose-500 font-medium">Fleet Manager</span>
                </div>
            </div>
            {showAdd && (
                <button 
                    onClick={onAdd}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-700"
                >
                    <Plus className="w-6 h-6" />
                </button>
            )}
        </div>
    </header>
  );
};