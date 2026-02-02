import React, { useMemo, useState } from "react";
import { IconChat, IconRefresh } from "./UIComponents";
import ConversationDetails from "./ConversationDetails";

export default function ConversationsPage({ data, loading, refreshing, fetchAll, timeAgo, isLightMode = false, initialSelectedContact = null, onContactSelect }) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const conversationsPerPage = 8;

  // Process conversations data
  const convRows = useMemo(() => {
    return (data.conversations || []).map((rec) => {
      const f = rec?.fields || rec || {};
      return {
        id: rec?.id ?? f.id ?? "",
        name: safeString(f["Full Name"] ?? f["Name"] ?? f["Lead Name"]),
        phone: safeString(f["Phone"]),
        channel: safeString(f["Channel"] ?? f["Source"] ?? f["Lead Source"]),
        lastMessageAt: safeDate(f["Last Message At"] ?? f.lastMessageAt ?? f.last_message_at ?? rec?.createdTime),
        snippet: safeString(f["Last Message"] ?? f["Message"] ?? f["Snippet"]),
        direction: safeString(f["Direction"]), // Inbound = we sent message (right side), Outbound = they replied (left side)
        message: safeString(f["Body Text"] ?? f["Message"] ?? f["Last Message"] ?? f["Snippet"]),
      };
    });
  }, [data.conversations]);

  // Group conversations by contact
  const groupedConversations = useMemo(() => {
    const groups = {};
    convRows.forEach(conv => {
      const key = conv.name || conv.phone || 'Unknown';
      if (!groups[key]) {
        groups[key] = {
          name: conv.name,
          phone: conv.phone,
          conversations: [],
          lastMessageAt: null,
          snippet: '',
          channel: conv.channel,
        };
      }
      groups[key].conversations.push(conv);
      
      // Update group's last message info if this conversation is more recent
      if (!groups[key].lastMessageAt || (conv.lastMessageAt && conv.lastMessageAt > groups[key].lastMessageAt)) {
        groups[key].lastMessageAt = conv.lastMessageAt;
        groups[key].snippet = conv.snippet;
        groups[key].channel = conv.channel;
      }
    });
    return Object.values(groups);
  }, [convRows]);

  // Get current grouped conversations for the page
  const indexOfLastGroup = currentPage * conversationsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - conversationsPerPage;
  const currentGroups = groupedConversations.slice(indexOfFirstGroup, indexOfLastGroup);
  
  // Calculate total pages for grouped conversations
  const totalGroupPages = Math.ceil(groupedConversations.length / conversationsPerPage);

  // Get current conversations for the page
  const indexOfLastConversation = currentPage * conversationsPerPage;
  const indexOfFirstConversation = indexOfLastConversation - conversationsPerPage;
  const currentConversations = convRows.slice(indexOfFirstConversation, indexOfLastConversation);
  
  // Calculate total pages for ungrouped conversations
  const totalPages = Math.ceil(convRows.length / conversationsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next page
  const goToNextPage = () => {
    if (currentPage < totalGroupPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // State for selected contact
  const [selectedContact, setSelectedContact] = useState(initialSelectedContact);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Conversations</h1>
          <p className={`mt-1 ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Track all customer communications</p>
        </div>
        <button
          type="button"
          onClick={() => fetchAll({ isRefresh: true })}
          disabled={loading || refreshing}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
            isLightMode
              ? 'border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
          }`}
        >
          <IconRefresh className={`${(loading || refreshing) ? 'animate-spin' : ''}`} />
          {(loading || refreshing) ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-300/80'}`}>Total Conversations</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{convRows.length}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-300/80'}`}>WhatsApp</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            {convRows.filter(c => c.channel?.toLowerCase().includes('whatsapp')).length}
          </div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-300/80'}`}>Email</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            {convRows.filter(c => c.channel?.toLowerCase().includes('email')).length}
          </div>
        </div>
      </div>

      {!selectedContact && (
        <>
          {/* Conversations List */}
          <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
            isLightMode
              ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
              : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
          }`}>
            <div className={`p-5 border-b ${isLightMode ? 'border-gray-200/40' : 'border-white/10'}`}>
              <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Conversations</h2>
            </div>
            <div className={isLightMode ? 'divide-y divide-gray-200' : 'divide-y divide-white/10'}>
              {currentGroups.map((group) => (
                <div 
                  key={group.name || group.phone || group.conversations[0]?.id} 
                  className={`p-5 transition-colors cursor-pointer ${isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}
                  onClick={() => setSelectedContact(group)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          isLightMode ? 'bg-blue-100' : 'bg-blue-500/20'
                        }`}>
                          <span className={`font-medium ${isLightMode ? 'text-blue-700' : 'text-blue-300'}`}>
                            {group.name?.charAt(0)?.toUpperCase() || group.phone?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <h3 className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{group.name || group.phone || "Unknown Contact"}</h3>
                          <p className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-400'}`}>{group.phone || "-"}</p>
                        </div>
                      </div>
                      <div className="ml-13">
                        <p className={`text-sm mb-2 ${isLightMode ? 'text-black' : 'text-gray-300'}`}>{group.snippet || "No message content"}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {group.channel || "Unknown"}
                          </span>
                          {group.lastMessageAt && (
                            <span>{timeAgo(group.lastMessageAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {groupedConversations.length === 0 && (
              <div className={`p-10 text-center ${isLightMode ? 'text-black' : 'text-gray-400'}`}>
                No conversations found
              </div>
            )}
            {/* Pagination */}
            {groupedConversations.length > 0 && (
              <div className={`p-4 border-t ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-300'} text-center sm:text-left`}>
                    Showing <span className="font-medium">{indexOfFirstGroup + 1}</span> to {' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastGroup, groupedConversations.length)}
                    </span> of <span className="font-medium">{groupedConversations.length}</span> contacts
                  </div>
                  <div className="flex items-center flex-wrap justify-center sm:justify-end gap-1 sm:gap-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? 'cursor-not-allowed opacity-50 '
                          : isLightMode
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <span className="sm:hidden">&lt;</span>
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    
                    {totalGroupPages <= 7 ? (
                      // Show all pages if total pages is 7 or less
                      [...Array(totalGroupPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={index}
                            onClick={() => paginate(pageNumber)}
                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                              currentPage === pageNumber
                                ? isLightMode
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-blue-500 text-white'
                                : isLightMode
                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })
                    ) : (
                      // Show abbreviated version for more pages
                      <>
                        {/* First page */}
                        <button
                          onClick={() => paginate(1)}
                          className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                            currentPage === 1
                              ? isLightMode
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-500 text-white'
                              : isLightMode
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          1
                        </button>
                        
                        {/* Ellipsis after first page */}
                        {currentPage > 3 && <span className={`px-1 text-xs sm:text-sm ${isLightMode ? 'text-black' : 'text-gray-400'}`}>...</span>}
                        
                        {/* Pages around current page */}
                        {currentPage > 2 && currentPage < totalGroupPages && (
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                              isLightMode
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {currentPage - 1}
                          </button>
                        )}
                        
                        {/* Current page */}
                        <button
                          onClick={() => paginate(currentPage)}
                          className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                            isLightMode
                              ? 'bg-blue-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          {currentPage}
                        </button>
                        
                        {/* Pages around current page */}
                        {currentPage < totalGroupPages - 1 && (
                          <button
                            onClick={() => paginate(currentPage + 1)}
                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                              isLightMode
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {currentPage + 1}
                          </button>
                        )}
                        
                        {/* Ellipsis before last page */}
                        {currentPage < totalGroupPages - 2 && <span className={`px-1 text-xs sm:text-sm ${isLightMode ? 'text-black' : 'text-gray-400'}`}>...</span>}
                        
                        {/* Last page */}
                        <button
                          onClick={() => paginate(totalGroupPages)}
                          className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                            currentPage === totalGroupPages
                              ? isLightMode
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-500 text-white'
                              : isLightMode
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {totalGroupPages}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalGroupPages || totalGroupPages === 0}
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        currentPage === totalGroupPages || totalGroupPages === 0
                          ? 'cursor-not-allowed opacity-50 '
                          : isLightMode
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <span className="sm:hidden">&gt;</span>
                      <span className="hidden sm:inline">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {selectedContact && (
        <ConversationDetails
          contact={selectedContact}
          onBack={() => setSelectedContact(null)}
          loading={loading}
          refreshing={refreshing}
          fetchAll={fetchAll}
          timeAgo={timeAgo}
          isLightMode={isLightMode}
        />
      )}
    </div>
  );
}

// Utility functions
function safeString(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function safeDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : null;
}