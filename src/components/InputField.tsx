import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  icon,
  label,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-brown-800 text-xl mb-2 font-bold">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
        <input
          className={`w-full px-5 py-4 ${icon ? 'pl-14' : 'pl-6'} 
            rounded-full bg-white border-2 border-amber-200
            text-brown-900 placeholder-amber-400 text-lg
            focus:outline-none focus:border-orange-400 
            ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputField;