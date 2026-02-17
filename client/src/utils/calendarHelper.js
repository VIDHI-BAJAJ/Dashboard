/**
 * Helper functions to convert API data to calendar events
 */

// Function to generate calendar events from leads data
export const generateCalendarEvents = (leads = []) => {
  const events = [];
  
  leads.forEach(lead => {
    if (lead.createdTime) {
      events.push({
        date: new Date(lead.createdTime).toISOString().split('T')[0],
        type: 'lead_created',
        title: 'Lead Created',
        leadId: lead.id
      });
    }
    
    // If there's a follow-up date in the fields
    if (lead.fields && lead.fields['Next Action Date']) {
      events.push({
        date: lead.fields['Next Action Date'],
        type: 'follow_up',
        title: 'Follow-up',
        leadId: lead.id
      });
    }
    
    // If there's a status indicating conversion
    if (lead.fields && lead.fields.Status === 'Converted') {
      // Use the date when the lead was converted if available
      events.push({
        date: new Date(lead.createdTime).toISOString().split('T')[0], // fallback to created date
        type: 'deal_closed',
        title: 'Deal Closed',
        leadId: lead.id
      });
    }
  });
  
  return events;
};

// Function to generate chart data from leads data
// export const generateChartData = (leads = [], timeRange = 'this-month') => {
//   const now = new Date();
//   let result = [];
  
//   if (timeRange === 'this-week') {
//     // For this week: show each day
//     const days = [];
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(now);
//       date.setDate(now.getDate() - i);
//       days.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
//     }
    
//     // Group leads by day
//     const dailyData = {};
//     leads.forEach(lead => {
//       if (!lead.createdTime) return;
//       const leadDate = new Date(lead.createdTime);
//       const dateKey = `${leadDate.getFullYear()}-${String(leadDate.getMonth() + 1).padStart(2, '0')}-${String(leadDate.getDate()).padStart(2, '0')}`;
      
//       if (!dailyData[dateKey]) {
//         dailyData[dateKey] = { totalLeads: 0, convertedLeads: 0 };
//       }
//       dailyData[dateKey].totalLeads++;
//     });
    
//     // Build result for the past 7 days
//     days.forEach(day => {
//       const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
//       const dayStr = day.toLocaleDateString('en-US', { weekday: 'short' });
//       result.push({
//         time: dayStr,
//         totalLeads: dailyData[dateKey]?.totalLeads || 0,
//         convertedLeads: 0  // We're not showing converted leads but keeping the structure
//       });
//     });
//   } else if (timeRange === 'this-month') {
//     // For this month: show each day
//     const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
//     const days = [];
//     for (let i = 1; i <= daysInMonth; i++) {
//       const date = new Date(now.getFullYear(), now.getMonth(), i);
//       days.push(date);
//     }
    
//     // Group leads by day
//     const dailyData = {};
//     leads.forEach(lead => {
//       if (!lead.createdTime) return;
//       const leadDate = new Date(lead.createdTime);
//       const dateKey = `${leadDate.getFullYear()}-${String(leadDate.getMonth() + 1).padStart(2, '0')}-${String(leadDate.getDate()).padStart(2, '0')}`;
      
//       if (!dailyData[dateKey]) {
//         dailyData[dateKey] = { totalLeads: 0, convertedLeads: 0 };
//       }
//       dailyData[dateKey].totalLeads++;
//     });
    
//     // Build result for the current month
//     days.forEach(day => {
//       const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
//       result.push({
//         time: day.getDate(),
//         totalLeads: dailyData[dateKey]?.totalLeads || 0,
//         convertedLeads: 0  // We're not showing converted leads but keeping the structure
//       });
//     });
//   } else { // this-year
//     // For this year: show last 12 months including current month
//     const months = [];
//     for (let i = 11; i >= 0; i--) {
//       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       months.push(date);
//     }
    
//     // Group leads by month
//     const monthlyData = {};
//     leads.forEach(lead => {
//       if (!lead.createdTime) return;
//       const leadDate = new Date(lead.createdTime);
//       const monthKey = `${leadDate.getFullYear()}-${String(leadDate.getMonth() + 1).padStart(2, '0')}`;
      
//       if (!monthlyData[monthKey]) {
//         monthlyData[monthKey] = { totalLeads: 0, convertedLeads: 0 };
//       }
//       monthlyData[monthKey].totalLeads++;
//     });
    
//     // Build result for the last 12 months
//     months.forEach(month => {
//       const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
//       const monthName = month.toLocaleString('default', { month: 'short' });
//       result.push({
//         time: `${monthName} ${month.getFullYear()}`,
//         totalLeads: monthlyData[monthKey]?.totalLeads || 0,
//         convertedLeads: 0  // We're not showing converted leads but keeping the structure
//       });
//     });
//   }
  
//   return result;
// };


export const generateChartData = (leads = [], timeRange = "this-month") => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  let grouped = {};

  // ---------- YEAR VIEW (12 MONTHS) ----------
  if (timeRange === "this-year") {
    // Initialize all 12 months with 0
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(currentYear, i).toLocaleDateString("en-IN", {
        month: "short",
      });
      grouped[monthName] = 0;
    }

    leads.forEach((lead) => {
      const nextDate = lead.fields?.["Next Action Date"];
      if (!nextDate) return;

      const dateObj = new Date(nextDate);

      if (dateObj.getFullYear() === currentYear) {
        const monthName = dateObj.toLocaleDateString("en-IN", {
          month: "short",
        });
        grouped[monthName] += 1;
      }
    });

    return Object.keys(grouped).map((month) => ({
      time: month,
      totalLeads: grouped[month],
    }));
  }

  // ---------- MONTH VIEW (ALL DAYS OF CURRENT MONTH) ----------
  if (timeRange === "this-month") {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      grouped[i] = 0;
    }

    leads.forEach((lead) => {
      const nextDate = lead.fields?.["Next Action Date"];
      if (!nextDate) return;

      const dateObj = new Date(nextDate);

      if (
        dateObj.getFullYear() === currentYear &&
        dateObj.getMonth() === currentMonth
      ) {
        grouped[dateObj.getDate()] += 1;
      }
    });

    return Object.keys(grouped).map((day) => ({
      time: day,
      totalLeads: grouped[day],
    }));
  }

  // ---------- WEEK VIEW (CURRENT WEEK ONLY) ----------
  if (timeRange === "this-week") {
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const d = new Date(firstDayOfWeek);
      d.setDate(firstDayOfWeek.getDate() + i);

      const label = d.toLocaleDateString("en-IN", {
        weekday: "short",
      });

      grouped[label] = 0;
    }

    leads.forEach((lead) => {
      const nextDate = lead.fields?.["Next Action Date"];
      if (!nextDate) return;

      const dateObj = new Date(nextDate);

      const start = new Date(firstDayOfWeek);
      const end = new Date(firstDayOfWeek);
      end.setDate(start.getDate() + 6);

      if (dateObj >= start && dateObj <= end) {
        const label = dateObj.toLocaleDateString("en-IN", {
          weekday: "short",
        });
        grouped[label] += 1;
      }
    });

    return Object.keys(grouped).map((day) => ({
      time: day,
      totalLeads: grouped[day],
    }));
  }

  return [];
};
