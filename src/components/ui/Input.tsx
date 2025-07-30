
import React from "react";
interface InputProps {
  label?: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = ''
}: InputProps) {
  return (
    <div className={className}>
      {label && 
      (
        <label className="block text-sm text-gray-700 mb-1 font-medium ">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border rounded  border-gray-300 "
      />
    </div>
  );
}