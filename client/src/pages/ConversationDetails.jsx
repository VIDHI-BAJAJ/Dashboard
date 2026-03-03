import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ConversationDetails = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [contactConversations, setContactConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // ✅ Normalize phone numbers (India logic)
  const normalizeNumber = (num) => {
    if (!num) return "";

    let cleaned = num.toString().replace(/\D/g, "");

    // Remove leading 0
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    // If 10 digits, add 91
    if (cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }

    return cleaned;
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiUrl}/api/conversations`);

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const allConversations = await response.json();

        const urlWaId = normalizeNumber(conversationId);

        // ✅ Filter using normalized WA ID
        const filteredConversations = allConversations.filter((c) => {
          const recordWaId = normalizeNumber(
            c.fields?.["WA ID"] || c.fields?.WA_ID
          );

          return recordWaId === urlWaId;
        });

        // Sort oldest → newest
        filteredConversations.sort((a, b) => {
          const dateA = new Date(a.createdTime);
          const dateB = new Date(b.createdTime);
          return dateA - dateB;
        });

        setContactConversations(filteredConversations);
      } catch (err) {
        console.error(err);
        setError("Error loading conversation details");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [conversationId]);

  const formatTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        alert("API URL not configured");
        return;
      }

      const rawWaId =
        contactConversations[0]?.fields?.["WA ID"] ||
        contactConversations[0]?.fields?.WA_ID;

      const waId = normalizeNumber(rawWaId);

      if (!waId) {
        alert("WA ID not found");
        return;
      }

      // ✅ Send to WhatsApp
      const whatsappResponse = await fetch(
        `${apiUrl}/api/send-whatsapp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: waId,
            message: newMessage,
          }),
        }
      );

      const whatsappData = await whatsappResponse.json();
      console.log("WhatsApp API response:", whatsappData);

      if (!whatsappResponse.ok || whatsappData.error) {
        alert("WhatsApp sending failed");
        return;
      }

      // ✅ Save to Airtable
      const messageData = {
        fields: {
          Name: contactConversations[0]?.fields?.Name,
          "Message ID": `msg_${Date.now()}`,
          "WA ID": waId,
          Direction: "Outbound",
          Channel: "WhatsApp",
          "Message Type": "text",
          "Body Text": newMessage,
          Timestamp: new Date().toISOString(),
        },
      };

      const airtableResponse = await fetch(
        `${apiUrl}/api/conversations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
        }
      );

      if (!airtableResponse.ok) {
        alert("Sent to WhatsApp but failed to save");
        return;
      }

      const responseData = await airtableResponse.json();

      const newConvEntry = {
        id: responseData.id,
        fields: messageData.fields,
        createdTime: responseData.createdTime,
      };

      setContactConversations((prev) => [...prev, newConvEntry]);
      setNewMessage("");

    } catch (err) {
      console.error(err);
      alert(`Error sending message: ${err.message}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
            onClick={() => navigate("/conversations")}
            className="px-4 py-2 bg-[#004f98] text-white rounded-lg hover:bg-gray-800 transition-colors"
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
          <p className="text-gray-600 mb-4">
            No conversations found for this contact
          </p>
          <button
            onClick={() => navigate("/conversations")}
            className="px-4 py-2 bg-[#004f98] text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Conversations
          </button>
        </div>
      </div>
    );
  }

  const firstConversation = contactConversations[0];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* HEADER */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {firstConversation.fields?.Name || "Conversation"}
              </h1>
              <p className="text-sm text-gray-500">
                {firstConversation.fields?.Channel || "Channel"} •{" "}
                {normalizeNumber(
                  firstConversation.fields?.["WA ID"] ||
                  firstConversation.fields?.WA_ID
                )}
              </p>
            </div>

            <button
              onClick={() => navigate("/conversations")}
              className="px-4 py-2 bg-[#004f98] text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium w-42 sm:w-auto"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {contactConversations.map((conv, index) => (
            <div
              key={conv.id || index}
              className={`flex ${
                conv.fields?.Direction === "Outbound"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                  conv.fields?.Direction === "Outbound"
                    ? "bg-gray-200 text-gray-900 rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <div className="text-sm">
                  {conv.fields?.["Body Text"]}
                </div>
                <div className="text-xs opacity-70 mt-1 text-right">
                {formatTime(conv.fields?.Timestamp, conv.createdTime)}
                  <span className="ml-2">
                    {conv.fields?.Direction === "Outbound"
                      ? "→ Sent"
                      : "← Received"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MESSAGE INPUT */}
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
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="ml-2 px-4 py-2 bg-[#004f98] text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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