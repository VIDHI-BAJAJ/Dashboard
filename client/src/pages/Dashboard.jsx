import React, { useState, useEffect } from "react";
import MetricsGrid from "../components/MetricsGrid";
import LeadsOverviewChart from "../components/LeadsOverviewChart";
import CalendarComponent from "../components/CalendarComponent";
import LeadsTable from "../components/LeadsTable";
import { generateChartData, generateCalendarEvents } from "../utils/calendarHelper";

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('this-month');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leads data from the API
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`);
        const leads = await response.json();
        
        // Store leads data for the table
        setLeadsData(leads);
        
        // Generate chart data from leads based on time range
        const generatedChartData = generateChartData(leads, timeRange);
        setChartData(generatedChartData);
        
        // Generate calendar events from leads
        const generatedEvents = generateCalendarEvents(leads);
        setCalendarEvents(generatedEvents);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to empty arrays
        setChartData([]);
        setCalendarEvents([]);
        setLeadsData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <MetricsGrid />
      
      {/* Responsive Layout for Leads Overview and Calendar */}
      {/* Mobile: Stack vertically, Tablet: 60/40 split, Desktop: 70/30 split */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
        {/* Leads Overview Chart - 100% on mobile, 60% on tablet, 70% on desktop */}
        <div className="md:col-span-3">
          <LeadsOverviewChart 
            data={chartData} 
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
        
        {/* Calendar - 100% on mobile, 40% on tablet, 30% on desktop */}
        <div className="md:col-span-2">
          <CalendarComponent events={calendarEvents} />
        </div>
      </div>
      
      {/* Leads Table Section */}
      <div className="mt-8">
        <LeadsTable 
          leads={leadsData} 
          loading={loading}
          totalCount={leadsData.length}
        />
      </div>
    </div>
  );
}
