import React from "react";

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  percentage, 
  active = false,
  isLoading, 
  error 
}) {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[140px] flex flex-col ${active ? 'bg-blue-50' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[140px] flex flex-col ${active ? 'bg-blue-50' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-medium text-black tracking-wide">
              {title}
            </h3>
          </div>
          <div className="text-gray-400 cursor-pointer hover:text-gray-600">⋯</div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="text-gray-400 text-sm mb-1">Error</div>
          <div className="text-red-500 text-xs">Failed to load</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 min-h-[120px] sm:min-h-[140px] flex flex-col hover:shadow-md transition-shadow duration-200 ${active ? 'bg-blue-50' : ''}`}>
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium text-black tracking-wide truncate">
            {title}
          </h3>
        </div>
        <div className="text-gray-400 cursor-pointer hover:text-gray-600 text-lg">⋯</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
          {value}
           {percentage !== undefined && (
           <span className="text-black text-xs font-medium ml-2">↑ {percentage}%</span>
          )}
        </div>
      </div>
      
      {subtitle && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500 truncate">{subtitle}</span>
        </div>
      )}
    </div>
  );
}