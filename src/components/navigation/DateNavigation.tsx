
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
    console.log('[Calendar] Date selected:', dateItem.fullDate);
    onDateSelect?.(dateItem.fullDate);
  };

  const isSelected = (dateItem: DateItem) => {
    if (!selectedDate) return dateItem.isToday;
    return selectedDate.toDateString() === dateItem.fullDate.toDateString();
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="w-full px-4 md:px-8 py-3">
        <div className="flex justify-between items-center w-full md:grid md:grid-cols-7 md:gap-4">
          {dateItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(item)}
              className={`
                flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-200
                flex-1 mx-1 min-w-0 md:mx-0 md:px-4 md:py-4
                ${isSelected(item) 
                  ? 'bg-gray-100 text-gray-900 border-2 border-blue-500' 
                  : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                }
              `}
            >
              <span className={`text-xs md:text-sm mb-2 ${isSelected(item) ? 'opacity-80 font-medium' : 'opacity-70'}`}>
                {item.day}
              </span>
              <span className={`text-lg md:text-2xl ${isSelected(item) ? 'font-bold' : 'font-semibold'}`}>
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
