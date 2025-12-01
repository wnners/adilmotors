import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  as?: 'input' | 'select';
  children?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, as = 'input', children, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
        {label}
      </label>
      {as === 'select' ? (
        <select 
          className={`w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all ${className}`}
          {...props as React.SelectHTMLAttributes<HTMLSelectElement>}
        >
          {children}
        </select>
      ) : (
        <input 
          className={`w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all ${className}`}
          {...props as React.InputHTMLAttributes<HTMLInputElement>}
        />
      )}
    </div>
  );
};