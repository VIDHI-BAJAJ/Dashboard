import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConversationsTable = ({ conversations = [], loading = false, totalCount = 0 }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedConversations, setSelectedConversations] = useState(new Set());

  // Pagination logic - conversations are already sorted by the parent component
  const totalPages = Math.ceil(conversations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConversations = conversations.slice(startIndex, endIndex);

  // Handle selecting/deselecting all conversations
  const toggleSelectAll = () => {
    if (selectedConversations.size === currentConversations.length) {
      setSelectedConversations(new Set());
    } else {
      setSelectedConversations(new Set(currentConversations.map(conv => conv.id)));
    }
  };

  // Handle individual conversation selection
  const toggleSelectConversation = (convId) => {
    const newSelected = new Set(selectedConversations);
    if (newSelected.has(convId)) {
      newSelected.delete(convId);
    } else {
      newSelected.add(convId);
    }
    setSelectedConversations(newSelected);
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    
    return date.toLocaleDateString();
  };

  // Get direction indicator
  const getDirectionIndicator = (direction) => {
    if (!direction) return null;
    return direction === 'Outbound' ? '→' : '←';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
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
      {/* Table Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
          <div className="text-sm text-gray-500">
            {totalCount} total
          </div>
        </div>
      </div>
      
      {/* Responsive Table Container - Scrollable on mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Phone
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Last Message
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Preview
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentConversations.map((conversation, index) => (
                  <tr 
                    key={conversation.id || index} 
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => navigate(`/conversations/${conversation.id}`)}
                  >    
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                        {conversation.fields?.Name || '—'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-700 truncate max-w-[100px]">
                        {conversation.fields?.['WA ID'] || conversation.fields?.WA_ID || '—'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${
                          conversation.fields?.Channel === 'WhatsApp' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-gray-800 text-white'
                        }`}>
                          {getDirectionIndicator(conversation.fields?.Channel)} {conversation.fields?.Channel || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                      {conversation.fields?.Timestamp 
                        ? formatRelativeTime(conversation.fields.Timestamp)
                        : formatRelativeTime(conversation.createdTime)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 max-w-[100px] sm:max-w-xs truncate hidden lg:table-cell">
                      {conversation.fields?.['Body Text'] || conversation.fields?.body || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
            Showing {startIndex + 1} to {Math.min(endIndex, conversations.length)} of {conversations.length} contacts
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

      {currentConversations.length === 0 && !loading && (
        <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
          <p className="text-gray-500 text-sm sm:text-base">No conversations found</p>
        </div>
      )}
    </div>
  );
};

export default ConversationsTable;