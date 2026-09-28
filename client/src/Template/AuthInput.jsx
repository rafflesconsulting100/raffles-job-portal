import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function AuthInput({
  label,
  rightLabelAction,
  icon: Icon,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  inputClassName = '',
  prefix = '',
  error = ''
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={className}>
      {(label || rightLabelAction) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
              {label}
            </label>
          )}
          {rightLabelAction && <div>{rightLabelAction}</div>}
        </div>
      )}
      <div
        className={`flex items-center border rounded-xl px-4 h-12 bg-white transition ${
          error ? 'border-red-400 focus-within:border-red-500' : 'border-gray-300 focus-within:border-[#2B2A8C]'
        }`}
      >
        {Icon && <Icon className="text-gray-400 w-4 h-4 mr-2 shrink-0" />}
        {prefix && (
          <span className="text-sm font-bold text-gray-500 mr-2 shrink-0 select-none">{prefix}</span>
        )}
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-transparent text-sm outline-none font-medium ${isPassword && !showPassword ? 'tracking-widest' : ''} ${inputClassName}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 ml-2 focus:outline-none"
          >
            {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs font-semibold text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  );
}
