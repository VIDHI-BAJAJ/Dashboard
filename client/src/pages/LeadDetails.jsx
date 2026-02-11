// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const LeadDetails = () => {
//   const { leadId } = useParams();
//   const navigate = useNavigate();
//   const [lead, setLead] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLead = async () => {
//       try {
//         // Use VITE_API_URL for production, fallback to relative path for local development
//         const apiUrl = import.meta.env.VITE_API_URL || '';
//         const response = await fetch(`${apiUrl}/api/leads`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch leads');
//         }
        
//         const leads = await response.json();
//         const foundLead = leads.find(l => l.id === leadId);
        
//         if (foundLead) {
//           setLead(foundLead);
//         } else {
//           setError('Lead not found');
//         }
//       } catch (err) {
//         console.error('Error fetching lead:', err);
//         setError('Error loading lead details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLead();
//   }, [leadId]);

//   const formatDate = (dateString) => {
//     if (!dateString) return '—';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading lead details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">{error}</p>
//           <button 
//             onClick={() => navigate('/leads')}
//             className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
//           >
//             Back to Leads
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!lead) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 mb-4">Lead not found</p>
//           <button 
//             onClick={() => navigate('/leads')}
//             className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
//           >
//             Back to Leads
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
//         <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//           <div className="flex items-center">
//             <button
//               onClick={() => navigate('/leads')}
//               className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               Back to Leads
//             </button>
//             <h1 className="text-xl font-semibold text-gray-900">
//               {lead.fields?.['Full Name'] || lead.fields?.Name || 'Lead Details'}
//             </h1>
//           </div>
//         </div>
//       </div>

//       <div className="px-4 sm:px-6 lg:px-8 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Lead Summary Card */}
//           <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-lg font-medium text-gray-900">Lead Information</h2>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Basic Info</h3>
//                   <dl className="space-y-2">
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Name</dt>
//                       <dd className="text-sm text-gray-900">
//                         {lead.fields?.['Full Name'] || lead.fields?.Name || '—'}
//                       </dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Phone</dt>
//                       <dd className="text-sm text-gray-900">
//                         {lead.fields?.Phone || '—'}
//                       </dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Email</dt>
//                       <dd className="text-sm text-gray-900">
//                         {lead.fields?.Email || '—'}
//                       </dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Lead ID</dt>
//                       <dd className="text-sm text-gray-900">
//                         {lead.fields?.['Lead ID'] || lead.id || '—'}
//                       </dd>
//                     </div>
//                   </dl>
//                 </div>
                
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Additional Details</h3>
//                   <dl className="space-y-2">
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Channel</dt>
//                       <dd className="text-sm text-gray-900">
//                         {lead.fields?.Channel || '—'}
//                       </dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Created</dt>
//                       <dd className="text-sm text-gray-900">
//                         {formatDate(lead.createdTime)}
//                       </dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Status</dt>
//                       <dd className="text-sm text-gray-900">
//                         {lead.fields?.Status || '—'}
//                       </dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Source</dt>
//                       <dd className="text-sm text-gray-900">
//                         {lead.fields?.Source || '—'}
//                       </dd>
//                     </div>
//                   </dl>
//                 </div>
//               </div>
              
//               {(lead.fields?.['Budget (Min)'] || lead.fields?.['Budget (Max)']) && (
//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Budget Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Minimum Budget</dt>
//                       <dd className="text-sm text-gray-900">
//                         {lead.fields?.['Budget (Min)'] 
//                           ? `₹${parseInt(lead.fields['Budget (Min)']).toLocaleString()}` 
//                           : '—'}
//                       </dd>
//                     </div>
//                     <div>
//                       <dt className="text-sm font-medium text-gray-500">Maximum Budget</dt>
//                       <dd className="text-sm text-gray-900">
//                         {lead.fields?.['Budget (Max)'] 
//                           ? `₹${parseInt(lead.fields['Budget (Max)']).toLocaleString()}` 
//                           : '—'}
//                       </dd>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {lead.fields?.Areas && Array.isArray(lead.fields.Areas) && (
//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Preferred Areas</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {lead.fields.Areas.map((area, index) => (
//                       <span 
//                         key={index}
//                         className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
//                       >
//                         {area}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Lead Fields Section */}
//           {Object.keys(lead.fields || {}).filter(key => 
//             !['Full Name', 'Name', 'Phone', 'Email', 'Lead ID', 'Channel', 'Status', 'Source', 'Budget (Min)', 'Budget (Max)', 'Areas'].includes(key)
//           ).length > 0 && (
//             <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//                 <h2 className="text-lg font-medium text-gray-900">Additional Information</h2>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {Object.keys(lead.fields || {})
//                     .filter(key => 
//                       !['Full Name', 'Name', 'Phone', 'Email', 'Lead ID', 'Channel', 'Status', 'Source', 'Budget (Min)', 'Budget (Max)', 'Areas'].includes(key)
//                     )
//                     .map((key, index) => (
//                       <div key={index}>
//                         <dt className="text-sm font-medium text-gray-500">{key}</dt>
//                         <dd className="mt-1 text-sm text-gray-900">
//                           {typeof lead.fields[key] === 'string' || typeof lead.fields[key] === 'number' 
//                             ? lead.fields[key] 
//                             : Array.isArray(lead.fields[key])
//                               ? lead.fields[key].join(', ')
//                               : JSON.stringify(lead.fields[key])
//                           }
//                         </dd>
//                       </div>
//                     ))
//                   }
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadDetails;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LeadDetails = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiUrl}/api/leads`);

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const leads = await response.json();
        const foundLead = leads.find((l) => l.id === leadId);

        if (foundLead) {
          setLead(foundLead);
        } else {
          setError("Lead not found");
        }
      } catch (err) {
        console.error("Error fetching lead:", err);
        setError("Error loading lead details");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [leadId]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Lead not found"}
          </p>
          <button
            onClick={() => navigate("/leads")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* 🔥 RESPONSIVE HEADER */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            {/* Lead Name */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {lead.fields?.["Full Name"] ||
                  lead.fields?.Name ||
                  "Lead Details"}
              </h1>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/leads")}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium w-full sm:w-auto"
            >
              Back to Leads
            </button>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Lead Information Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Lead Information
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Basic Info
                  </h3>

                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Name
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {lead.fields?.["Full Name"] ||
                          lead.fields?.Name ||
                          "—"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Phone
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {lead.fields?.Phone || "—"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {lead.fields?.Email || "—"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Lead ID
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {lead.fields?.["Lead ID"] ||
                          lead.id ||
                          "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Additional Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Additional Details
                  </h3>

                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Channel
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {lead.fields?.Channel || "—"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Created
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(lead.createdTime)}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Status
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {lead.fields?.Status || "—"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Source
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {lead.fields?.Source || "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
