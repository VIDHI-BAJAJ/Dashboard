import React, { useState } from 'react';

const CalendarComponent = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formatDateHeader = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const days = getDaysInMonth(currentDate);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
            {formatDateHeader(currentDate)}
          </span>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          
          return (
            <div 
              key={index} 
              className={`min-h-10 p-1 border border-gray-100 rounded flex flex-col ${
                day ? 'hover:bg-gray-50' : ''
              }`}
            >
              {day && (
                <div className={`text-right text-xs p-1 ${
                  isToday(day) 
                    ? 'bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center ml-auto' 
                    : 'text-gray-700'
                }`}>
                  {day.getDate()}
                </div>
              )}
              
              {dayEvents.length > 0 && (
                <div className="flex justify-center mt-auto pb-1">
                  <div className="flex gap-1">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div 
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          event.type === 'lead_created' ? 'bg-gray-400' :
                          event.type === 'follow_up' ? 'bg-gray-600' : 
                          event.type === 'deal_closed' ? 'bg-gray-800' : 'bg-gray-400'
                        }`}
                      ></div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-400">+{dayEvents.length - 3}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    
    </div>
  );
};

export default CalendarComponent;