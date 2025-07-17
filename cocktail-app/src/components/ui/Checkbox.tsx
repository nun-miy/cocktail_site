import React from 'react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 transition-colors duration-200';
  const checkboxClasses = 'w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 transition-all duration-200';
  const labelClasses = 'text-sm font-medium text-gray-700 cursor-pointer select-none';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div className={`${baseClasses} ${disabledClasses} ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={checkboxClasses}
      />
      <label htmlFor={id} className={labelClasses}>
        {checked && <span className="mr-1">✓</span>}
        {label}
      </label>
    </div>
  );
};