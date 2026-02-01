import React from "react";
import { IconChat, IconRefresh } from "./UIComponents";

export default function ConversationDetails({ contact, onBack, loading, refreshing, fetchAll, timeAgo, isLightMode = false }) {
  if (!contact) {
    return (
      <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl p-10 text-center ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl'
      }`}>
        <p className={isLightMode ? 'text-gray-500' : 'text-gray-400'}>
          No contact selected
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            Conversation with {contact.name || contact.phone || 'Unknown'}
          </h1>
          <p className={`mt-1 ${isLightMode ? 'text-black' : 'text-gray-400'}`}>
            View all messages exchanged with this contact
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => fetchAll({ isRefresh: true })}
            disabled={loading || refreshing}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 min-w-[100px] ${
              isLightMode
                ? 'border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
            }`}
          >
            <IconRefresh className={`${(loading || refreshing) ? 'animate-spin' : ''}`} />
            {(loading || refreshing) ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 min-w-[120px] ${
              isLightMode
                ? 'border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
            }`}
          >
            ← Back to Chats
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl transition-all duration-300 ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl'
      }`}>
        <div className={`p-5 border-b ${isLightMode ? 'border-gray-200/40' : 'border-white/10'}`}>
          <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            Messages
          </h2>
        </div>
        <div className={`p-5 max-h-[500px] overflow-y-auto ${isLightMode ? 'divide-y divide-gray-200' : 'divide-y divide-white/10'}`}>
          {contact.conversations && contact.conversations.length > 0 ? (
            [...contact.conversations].sort((a, b) => new Date(a.lastMessageAt) - new Date(b.lastMessageAt)).map((conv, index) => (
              <div key={index} className={`py-4 ${index === 0 ? 'pt-0' : ''} ${index === contact.conversations.length - 1 ? 'pb-0' : ''}`}>
                <div className={`flex ${conv.direction === 'Inbound' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    conv.direction === 'Inbound'
                      ? isLightMode
                        ? 'bg-blue-100 text-gray-800 rounded-br-none'
                        : 'bg-blue-500/20 text-gray-100 rounded-br-none'
                      : isLightMode
                        ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                        : 'bg-white/10 text-gray-100 rounded-bl-none'
                  }`}>
                    <div className="font-medium text-xs mb-1 opacity-70">
                      {conv.direction === 'Inbound' ? 'Sent' : 'Received'} • {conv.channel || 'Channel Unknown'}
                    </div>
                    <div className="text-sm">{conv.message || conv.snippet || 'No message content'}</div>
                    {conv.lastMessageAt && (
                      <div className="text-xs mt-1 opacity-60">
                        {timeAgo(new Date(conv.lastMessageAt))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`p-10 text-center ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No messages found for this contact
            </div>
          )}
        </div>
      </div>
    </div>
  );
}