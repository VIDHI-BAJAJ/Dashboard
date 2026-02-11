import React, { useState, useEffect } from "react";
import LeadsTable from "../components/LeadsTable";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeads = async () => {
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
        
        setLeads(sortedLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, []);
  
  return (
    <div className="w-full">
      <LeadsTable 
        leads={leads} 
        loading={loading}
        totalCount={leads.length}
      />
    </div>
  );
}
