import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ConversationDetails = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [contactConversations, setContactConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Use VITE_API_URL for production, fallback to relative path for local development
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/conversations`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        
        const allConversations = await response.json();
        
        // Find the specific conversation record to get the contact identifier
        const currentConversation = allConversations.find(c => c.id === conversationId);
        if (!currentConversation) {
          setError('Conversation not found');
          return;
        }
        
        // Get the contact identifier from the current conversation
        const contactId = currentConversation.fields?.['WA ID'] || currentConversation.fields?.WA_ID;
        const contactName = currentConversation.fields?.Name;
        
        // Filter all conversations for the same contact (based on WA ID or Name)
        let filteredConversations = [];
        if (contactId) {
          filteredConversations = allConversations.filter(c => 
            (c.fields?.['WA ID'] === contactId || c.fields?.WA_ID === contactId)
          );
        } else if (contactName) {
          filteredConversations = allConversations.filter(c => 
            c.fields?.Name === contactName
          );
        }
        
        // Sort conversations chronologically (oldest first, so they appear in order)
        filteredConversations.sort((a, b) => {
          const dateA = new Date(a.fields?.Timestamp || a.createdTime);
          const dateB = new Date(b.fields?.Timestamp || b.createdTime);
          return dateA - dateB; // Ascending order (oldest first)
        });
        
        setContactConversations(filteredConversations);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Error loading conversation details');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [conversationId]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/conversations')}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Conversations
          </button>
        </div>
      </div>
    );
  }

  if (contactConversations.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No conversations found for this contact</p>
          <button 
            onClick={() => navigate('/conversations')}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Conversations
          </button>
        </div>
      </div>
    );
  }

  // Get the contact info from the first conversation
  const firstConversation = contactConversations[0];

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      // For POST requests, always use the full API URL to bypass potential proxy issues
      // Use VITE_API_URL for production, fallback to explicit localhost for development
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Prepare the new message data
      const messageData = {
        fields: {
          Name: firstConversation.fields?.Name,
          'Message ID': `msg_${Date.now()}`, // Generate a unique message ID
          'WA ID': firstConversation.fields?.['WA ID'] || firstConversation.fields?.WA_ID,
          Direction: 'Outbound',
          Channel: firstConversation.fields?.Channel || 'WhatsApp',
          'Message Type': 'text',
          'Body Text': newMessage,
          Timestamp: new Date().toISOString(),
        }
      };
      
      console.log('Sending message data:', messageData); // Debug log
      
      // Send the message to the backend
      const response = await fetch(`${apiUrl}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      console.log('Response status:', response.status); // Debug log
      const responseData = await response.json();
      console.log('Response data:', responseData); // Debug log
      
      if (response.ok) {
        // Add the new message to the conversation
        const newConvEntry = {
          id: responseData.id,
          fields: {
            ...messageData.fields,
            Direction: 'Outbound',
          },
          createdTime: responseData.createdTime,
        };
        
        setContactConversations(prev => [...prev, newConvEntry]);
        setNewMessage('');
        console.log('Message successfully added to Airtable');
      } else {
        console.error('Failed to send message to Airtable:', responseData);
        alert(`Failed to send message: ${responseData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert(`Error sending message: ${err.message}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/conversations')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Conversations
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {firstConversation.fields?.Name || 'Conversation'}
              </h1>
              <p className="text-sm text-gray-500">
                {firstConversation.fields?.Channel || 'Channel'} • {firstConversation.fields?.['WA ID'] || firstConversation.fields?.WA_ID || 'Contact'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
        {contactConversations.map((conv, index) => (
  <div 
    key={conv.id || index}
    className={`flex ${conv.fields?.Direction === 'Outbound' ? 'justify-end' : 'justify-start'}`}
  >
    <div 
      className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
        conv.fields?.Direction === 'Outbound' 
          ? 'bg-gray-200 text-gray-900 rounded-br-none' 
          : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
      }`}
    >
      <div className="text-sm">{conv.fields?.['Body Text']}</div>
      <div className="text-xs opacity-70 mt-1 text-right">
        {formatTime(conv.fields?.Timestamp)}
        <span className="ml-2">
          {conv.fields?.Direction === 'Outbound' ? '→ Sent' : '← Received'}
        </span>
      </div>
    </div>
  </div>
))}
        </div>
      </div>

      {/* Message input area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end border border-gray-300 rounded-lg p-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border-0 focus:ring-0 focus:outline-none resize-none py-2 px-3 text-sm"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="ml-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetails;