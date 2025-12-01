import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3.5 px-6 rounded-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-sm";
  
  const variants = {
    primary: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/30 hover:shadow-pink-500/40",
    secondary: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50",
    outline: "border-2 border-pink-500 text-pink-600 hover:bg-pink-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100/50 shadow-none"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};