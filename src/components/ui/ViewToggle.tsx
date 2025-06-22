
import React, { useState } from 'react';

interface ViewToggleProps {
  label?: string;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
}

const ViewToggle = ({ 
  label = "Vista Compacta", 
  defaultValue = false,
  onChange,
  className = ""
}: ViewToggleProps) => {
  const [isToggled, setIsToggled] = useState(defaultValue);

  const handleToggle = () => {
    const newValue = !isToggled;
    setIsToggled(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`bg-white px-6 py-4 flex justify-end items-center gap-3 border-b border-gray-100 ${className}`}>
      <span className="text-sm text-gray-600 font-medium">
        {label}
      </span>
      <button
        onClick={handleToggle}
        className={`
          relative w-12 h-7 rounded-full transition-all duration-300 ease-in-out
          ${isToggled 
            ? 'bg-green-500' 
            : 'bg-gray-300'
          }
        `}
        aria-label={`${label} ${isToggled ? 'ativado' : 'desativado'}`}
      >
        <div
          className={`
            absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ease-in-out
            ${isToggled 
              ? 'translate-x-6' 
              : 'translate-x-1'
            }
          `}
        />
      </button>
    </div>
  );
};

export default ViewToggle;
