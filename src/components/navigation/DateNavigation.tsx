
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
    <div className="bg-white border-b border-gray-100">
      {/* Mobile: scroll horizontal, Desktop: distributed spacing */}
      <div className="flex overflow-x-auto md:overflow-x-visible md:justify-between items-center px-4 py-3 w-full md:gap-4">
        {dateItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(item)}
            className={`
              flex flex-col items-center py-3 px-3 rounded-xl transition-all duration-200
              flex-shrink-0 md:flex-1 min-w-[70px] md:min-w-0
              ${isSelected(item) 
                ? 'border-2 border-blue-500 bg-blue-50 text-blue-700 font-medium shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
              }
            `}
          >
            <span className={`text-xs md:text-sm mb-2 ${isSelected(item) ? 'opacity-90' : 'opacity-70'}`}>
              {item.day}
            </span>
            <span className={`text-lg md:text-2xl ${isSelected(item) ? 'font-bold' : 'font-semibold'}`}>
              {item.date}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateNavigation;
