
import React from 'react';

interface StreakBadgeProps {
  days?: number;
  label?: string;
  className?: string;
}

const StreakBadge = ({ 
  days = 0, 
  label = "Hoje",
  className = ""
}: StreakBadgeProps) => {
  return (
    <div className={`
      bg-gray-900 text-white px-4 py-2 rounded-full
      flex items-center gap-2 text-sm font-medium
      ${className}
    `}>
      <span className="text-base">🔥</span>
      <span>{label}</span>
      {days > 0 && (
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
          {days}
        </span>
      )}
    </div>
  );
};

export default StreakBadge;
