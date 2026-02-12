import React, { useState, useEffect } from "react";
import MetricsGrid from "../components/MetricsGrid";
import LeadsOverviewChart from "../components/LeadsOverviewChart";
import CalendarComponent from "../components/CalendarComponent";
import LeadsTable from "../components/LeadsTable";
import LeadForm from "../components/LeadForm";
import { generateChartData, generateCalendarEvents } from "../utils/calendarHelper";
import RevenueCard from "../components/RevenueCard";

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('this-month');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Function to add a new lead
  const addLead = async (leadData) => {
    try {
      // Use VITE_API_URL for production, fallback to relative path for local development
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add lead');
      }
      
      const newLead = await response.json();
      
      // Update the leads data with the new lead
      setLeadsData(prevLeads => {
        const updatedLeads = [newLead, ...prevLeads];
        // Re-sort the leads
        return updatedLeads.sort((a, b) => {
          const dateA = new Date(a.fields?.['Last Message At'] || a.createdTime);
          const dateB = new Date(b.fields?.['Last Message At'] || b.createdTime);
          return dateB - dateA;
        });
      });
      
      // Update chart data
      const updatedChartData = generateChartData([newLead, ...leadsData], timeRange);
      setChartData(updatedChartData);
      
      // Update calendar events
      const updatedEvents = generateCalendarEvents([newLead, ...leadsData]);
      setCalendarEvents(updatedEvents);
      
      return newLead;
    } catch (error) {
      console.error('Error adding lead:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leads data from the API
        // Use VITE_API_URL for production, fallback to relative path for local development
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/leads`);
        const data = await response.json();
        
        // Sort leads by latest activity (most recent first)
        const sortedLeads = data.sort((a, b) => {
          // Prioritize 'Last Message At' if available, otherwise use createdTime
          const dateA = new Date(a.fields?.['Last Message At'] || a.createdTime);
          const dateB = new Date(b.fields?.['Last Message At'] || b.createdTime);
          return dateB - dateA; // Descending order (latest first)
        });
        
        // Store leads data for the table
        setLeadsData(sortedLeads);
        
        // Generate chart data from leads based on time range
        const generatedChartData = generateChartData(sortedLeads, timeRange);
        setChartData(generatedChartData);
        
        // Generate calendar events from leads
        const generatedEvents = generateCalendarEvents(sortedLeads);
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
    <div className="w-full relative">
      <MetricsGrid />
      
      {/* Responsive Layout for Leads Overview and Calendar */}
      {/* Mobile: Stack vertically, Tablet: 60/40 split, Desktop: 70/30 split */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 items-stretch">


  {/* Revenue */}
  <div className="lg:col-span-3">
    <RevenueCard />
  </div>

  {/* Leads Overview */}
  <div className="lg:col-span-6">
    <LeadsOverviewChart 
      data={chartData} 
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
    />
  </div>

  {/* Calendar */}
  <div className="lg:col-span-3">
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
      
      {/* Fixed Add Lead Button - Bottom Right Corner */}
     <button
  onClick={() => setIsFormOpen(true)}
  className="fixed bottom-20 sm:bottom-6 right-6 bg-gray-900 text-white p-4 rounded-full shadow-xl hover:bg-gray-800 transition-all duration-200 z-50 hover:scale-110"
  title="Add New Lead"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
</button>

      
      {/* Lead Form Modal */}
      <LeadForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddLead={addLead}
      />
    </div>
  );
}
