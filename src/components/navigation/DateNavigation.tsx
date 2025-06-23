
import React, { useState, useEffect } from 'react';

interface DateItem {
  day: string;
  date: number;
  isToday: boolean;
  fullDate: Date;
}

interface DateNavigationProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

const DateNavigation = ({ onDateSelect, selectedDate }: DateNavigationProps) => {
  const [dateItems, setDateItems] = useState<DateItem[]>([]);

  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const dates: DateItem[] = [];
      
      // Gera 7 dias (6 anteriores + hoje)
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const dayNames = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
        const isToday = i === 0;
        
        dates.push({
          day: isToday ? 'Hoje' : dayNames[date.getDay()],
          date: date.getDate(),
          isToday,
          fullDate: date
        });
      }
      
      setDateItems(dates);
    };

    generateDates();
  }, []);

  const handleDateClick = (dateItem: DateItem) => {
    onDateSelect?.(dateItem.fullDate);
  };

  const isSelected = (dateItem: DateItem) => {
    if (!selectedDate) return dateItem.isToday;
    return selectedDate.toDateString() === dateItem.fullDate.toDateString();
  };

  return (
    <div className="w-full bg-white border-b border-gray-100">
      {/* Mobile: Fit all days without scroll */}
      <div className="md:hidden px-3 py-3">
        <div className="flex justify-between items-center w-full">
          {dateItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(item)}
              className={`
                flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-200
                flex-1 mx-0.5 min-w-0
                ${isSelected(item) 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span className={`text-xs mb-1 ${isSelected(item) ? 'opacity-80' : 'opacity-70'} truncate w-full text-center`}>
                {item.day}
              </span>
              <span className="text-base font-semibold">
                {item.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Todos os dias visíveis */}
      <div className="hidden md:flex justify-center items-center px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center w-full max-w-2xl">
          {dateItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(item)}
              className={`
                flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200
                flex-1 mx-1 min-w-0
                ${isSelected(item) 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span className={`text-sm mb-2 ${isSelected(item) ? 'opacity-80' : 'opacity-70'}`}>
                {item.day}
              </span>
              <span className="text-xl lg:text-2xl font-semibold">
                {item.date}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateNavigation;
