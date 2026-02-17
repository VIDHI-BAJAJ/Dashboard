import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';

const LeadsTable = ({ leads = [], loading = false, totalCount = 0 }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [timeFilter, setTimeFilter] = useState('today'); // 'today', 'weekly', 'monthly', 'yearly'

  // Filter leads based on time period
  const getFilteredLeads = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return leads.filter(lead => {
      const leadDate = new Date(lead.createdTime || lead.fields?.['Last Message At']);
      
      switch (timeFilter) {
        case 'today':
          return leadDate >= startOfToday;
        case 'weekly':
          return leadDate >= startOfWeek;
        case 'monthly':
          return leadDate >= startOfMonth;
        case 'yearly':
          return leadDate >= startOfYear;
        default:
          return true;
      }
    });
  };

  const filteredLeads = getFilteredLeads();

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter]);

  // Handle selecting/deselecting all leads
  const toggleSelectAll = () => {
    if (selectedLeads.size === currentLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(currentLeads.map(lead => lead.id)));
    }
  };

  // Handle individual lead selection
  const toggleSelectLead = (leadId, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  // Navigate to lead detail page
  const handleRowClick = (leadId) => {
    navigate(`/leads/${leadId}`);
  };

  // Handle edit action
  const handleEdit = (leadId, e) => {
    e.stopPropagation();
    navigate(`/leads/${leadId}/edit`);
  };

  // Handle delete action
  const handleDelete = (leadId, e) => {
    e.stopPropagation();
    // Add your delete logic here
    console.log('Delete lead:', leadId);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'converted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Leads Overview</h3>
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-3 sm:p-4 border-b border-gray-100 animate-pulse">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded mr-3 sm:mr-4"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header with Time Filter Tabs */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Leads Overview</h3>
            {/* <p className="text-sm text-gray-500 mt-1">
              Lorem ipsum dolor sit amet consectetur sit amet ipsum dolor sit amet consectetur.
            </p> */}
          </div>
          
          {/* Time Filter Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                timeFilter === 'today'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('weekly')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                timeFilter === 'weekly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeFilter('monthly')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                timeFilter === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeFilter('yearly')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                timeFilter === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>
      
      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Serial No
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Phone number
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Area
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Intent
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLeads.map((lead, index) => {
                  const serialNo = String(startIndex + index + 1).padStart(2, '0');
                  const isSelected = selectedLeads.has(lead.id);
                  
                  return (
                    <tr 
                      key={lead.id || index} 
                      className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleRowClick(lead.id)}
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {serialNo}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.fields?.['Full Name'] || lead.fields?.Name || '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {lead.fields?.Phone || lead.fields?.['Phone Number'] || '—'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        {lead.fields?.Email || lead.fields?.['Email address'] || '—'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(lead.fields?.Status || 'Active')
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            lead.fields?.Status?.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></span>
                          {lead.fields?.Status || 'Active'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 hidden lg:table-cell">
                        {lead.fields?.Areas && Array.isArray(lead.fields.Areas) 
                          ? lead.fields.Areas.join(', ') 
                          : lead.fields?.Area || lead.fields?.Location || '—'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                        {lead.fields?.Intent || lead.fields?.['Lead Intent'] || '—'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleEdit(lead.id, e)}
                            className="text-gray-600 hover:text-blue-600 transition-colors p-1.5 hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(lead.id, e)}
                            className="text-gray-600 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} results
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 hidden sm:inline">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 w-full sm:w-auto"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
              >
                Previous
              </button>
              <span className="text-xs sm:text-sm text-gray-700 mx-1 sm:mx-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {currentLeads.length === 0 && !loading && (
        <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
          <p className="text-gray-500 text-sm sm:text-base">
            No leads found for {timeFilter === 'today' ? 'today' : timeFilter === 'weekly' ? 'this week' : timeFilter === 'monthly' ? 'this month' : 'this year'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;