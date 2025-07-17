import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'search' | 'email' | 'password';
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'w-full px-4 py-3 border-2 border-white/30 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90 backdrop-blur-sm';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'hover:bg-white focus:bg-white';
  
  const combinedClasses = `${baseClasses} ${disabledClasses} ${className}`;

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={combinedClasses}
    />
  );
};