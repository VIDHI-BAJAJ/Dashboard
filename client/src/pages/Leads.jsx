import React, { useState, useEffect } from "react";
import LeadsTable from "../components/LeadsTable";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Fetch leads data from the API
        const response = await fetch('http://localhost:5000/api/leads');
        const data = await response.json();
        setLeads(data);
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
