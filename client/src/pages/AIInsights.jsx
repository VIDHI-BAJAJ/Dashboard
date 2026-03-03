import { useState, useRef, useEffect } from "react";



const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);



export default function AIInsight() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (showWelcome) setShowWelcome(false);

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px",
        position: "relative",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{
              fontSize: "17px",
              fontWeight: "600",
              color: "#1a1a1a",
              letterSpacing: "-0.3px",
            }}>
              Harbour AI
            </span>
            <span style={{
              fontSize: "11px",
              color: "#888",
              fontWeight: "400",
              letterSpacing: "0.2px",
            }}>
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}>
        {showWelcome ? (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "40px 24px",
            animation: "fadeIn 0.4s ease",
          }}>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
              ::-webkit-scrollbar { width: 4px; }
              ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: #d0cac4; border-radius: 2px; }
            `}</style>
            <h1 style={{
              fontSize: "26px",
              fontWeight: "500",
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
              margin: 0,
              textAlign: "center",
            }}>
              How can I help, User?
            </h1>
            <p style={{
              fontSize: "14px",
              color: "#999",
              margin: 0,
              fontWeight: "400",
            }}>
              Ask me anything about your leads.
            </p>
          </div>
        ) : (
          <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
              ::-webkit-scrollbar { width: 4px; }
              ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: #d0cac4; border-radius: 2px; }
            `}</style>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                animation: "fadeIn 0.3s ease",
              }}>
                {msg.role === "assistant" && (
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#004f98",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    flexShrink: 0,
                    marginTop: "4px",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
                      <path d="M14 3 L14 22 M7 10 L14 3 L21 10 M5 18 Q14 14 23 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div style={{
                  maxWidth: "75%",
                  padding: "11px 15px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#1a1a1a",
                  background: msg.role === "user" ? "#004f98" : "white",
                  color: msg.role === "user" ? "white" : "#1a1a1a",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  fontWeight: "400",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", animation: "fadeIn 0.3s ease" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", background: "#004f98",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginRight: "10px", flexShrink: 0, marginTop: "4px",
                }}>
                  <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
                    <path d="M14 3 L14 22 M7 10 L14 3 L21 10 M5 18 Q14 14 23 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{
                  background: "white",
                  padding: "12px 16px",
                  borderRadius: "18px 18px 18px 4px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: "#004f98",
                      animation: `blink 1.2s ${d}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        padding: "12px 16px 20px",
        background: "#faf9f7",
        borderTop: showWelcome ? "none" : "1px solid #e8e4df",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "white",
          borderRadius: "28px",
          border: "1px solid #e0dbd5",
          padding: "8px 8px 8px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.2s",
        }}>
          <input
            type="text"
            placeholder="Ask anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              color: "#1a1a1a",
              padding: "4px 0",
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: input.trim() ? "#1a1a1a" : "#d0cac4",
              border: "none",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}