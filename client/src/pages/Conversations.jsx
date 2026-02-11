import React, { useState, useEffect } from "react";
import ConversationsTable from "../components/ConversationsTable";

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Use VITE_API_URL for production, fallback to relative path for local development
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/conversations`);
        const data = await response.json();
        
        // Group conversations by contact (prefer WA ID, fallback to Name)
        const groupedConversations = {};
        data.forEach(conv => {
          // Primary identifier: WA ID
          const waId = conv.fields?.['WA ID'] || conv.fields?.WA_ID;
          const name = conv.fields?.Name;
          
          // Use WA ID if available, otherwise use Name
          const contactIdentifier = waId || name;
          
          if (contactIdentifier) { // Only process if we have a valid identifier
            if (!groupedConversations[contactIdentifier]) {
              // Store the conversation for this contact
              groupedConversations[contactIdentifier] = {
                ...conv,
                _allConversations: [conv] // Keep track of all conversations
              };
            } else {
              // Add to existing contact's conversation list
              groupedConversations[contactIdentifier]._allConversations.push(conv);
              
              // If this conversation is more recent, update the displayed one
              const currentLatest = groupedConversations[contactIdentifier];
              const currentConvTime = new Date(conv.fields?.Timestamp || conv.createdTime);
              const latestTime = new Date(currentLatest.fields?.Timestamp || currentLatest.createdTime);
              
              if (currentConvTime > latestTime) {
                groupedConversations[contactIdentifier] = {
                  ...conv,
                  _allConversations: currentLatest._allConversations
                };
              }
            }
          }
        });
        
        // Extract just the conversation objects for display
        const extractedConversations = Object.values(groupedConversations).map(item => {
          // Remove the temporary _allConversations property
          const { _allConversations, ...conversation } = item;
          return conversation;
        });
        
        // Sort by latest activity
        const sortedConversations = extractedConversations.sort((a, b) => {
          const dateA = new Date(a.fields?.Timestamp || a.createdTime);
          const dateB = new Date(b.fields?.Timestamp || b.createdTime);
          return dateB - dateA; // Descending order (latest first)
        });
        
        setConversations(sortedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  return (
    <div className="w-full">
      <ConversationsTable 
        conversations={conversations} 
        loading={loading}
        totalCount={conversations.length}
      />
    </div>
  );
}
