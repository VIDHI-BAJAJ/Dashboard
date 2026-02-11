import React, { useState, useEffect } from "react";
import ConversationsTable from "../components/ConversationsTable";

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiUrl}/api/conversations`);
        const data = await response.json();

        // ✅ Group ONLY by Name
        const groupedConversations = {};

        data.forEach((conv) => {
          const name = conv.fields?.Name?.trim();
          if (!name) return;

          if (!groupedConversations[name]) {
            groupedConversations[name] = {
              ...conv,
              _allConversations: [conv],
            };
          } else {
            groupedConversations[name]._allConversations.push(conv);

            const currentLatest = groupedConversations[name];
            const currentTime = new Date(
              conv.fields?.Timestamp || conv.createdTime
            );
            const latestTime = new Date(
              currentLatest.fields?.Timestamp ||
                currentLatest.createdTime
            );

            if (currentTime > latestTime) {
              groupedConversations[name] = {
                ...conv,
                _allConversations:
                  currentLatest._allConversations,
              };
            }
          }
        });

        const extractedConversations = Object.values(
          groupedConversations
        ).map((item) => {
          const { _allConversations, ...conversation } = item;
          return conversation;
        });

        // Sort latest first
        const sortedConversations =
          extractedConversations.sort((a, b) => {
            const dateA = new Date(
              a.fields?.Timestamp || a.createdTime
            );
            const dateB = new Date(
              b.fields?.Timestamp || b.createdTime
            );
            return dateB - dateA;
          });

        setConversations(sortedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
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
