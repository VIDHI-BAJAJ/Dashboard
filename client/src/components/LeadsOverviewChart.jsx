import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LeadsOverviewChart = ({ data = [], timeRange = 'this-month', onTimeRangeChange = () => {} }) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const timeRangeOptions = [
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'this-year', label: 'This Year' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-90">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Leads Overview</h3>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
   <ResponsiveContainer width="100%" height="85%">
  <LineChart
    data={data}
    margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
  >
    <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="2 2" />

    <XAxis
      dataKey="time"
      tick={{ fontSize: 12 }}
      angle={-35}
      textAnchor="end"
      height={45}
      axisLine={false}
      tickLine={false}
    />

    <YAxis
      width={30}
      tick={{ fontSize: 12 }}
      axisLine={false}
      tickLine={false}
    />

    <Tooltip content={<CustomTooltip />} />

    <Line
      type="monotone"
      dataKey="totalLeads"
      stroke="#111111"
      strokeWidth={2}
      dot={{ r: 4 }}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ResponsiveContainer>
    </div>
  );
};

export default LeadsOverviewChart;