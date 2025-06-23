
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
    <div className="flex justify-between md:justify-center items-center px-4 md:px-0 py-3 overflow-x-auto transition-all duration-300">
      <div className="flex items-center gap-2 md:gap-4 min-w-max md:min-w-0">
        {dateItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(item)}
            className={`
              flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200
              min-w-[3rem] flex-shrink-0
              ${isSelected(item) 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <span className={`text-xs mb-1 transition-opacity duration-200 ${isSelected(item) ? 'opacity-80' : 'opacity-70'}`}>
              {item.day}
            </span>
            <span className="text-lg font-semibold transition-all duration-200">
              {item.date}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateNavigation;
