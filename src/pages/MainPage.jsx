import { useState, useRef, useEffect } from "react";
import { aiService } from "../services/aiService";
import "./../styles/MainPage.css";

const MainPage = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  
  const responseRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to response when new response arrives
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [response]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const askAI = async () => {
    if (!prompt.trim()) {
      setError("Please enter a question or message");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse("");

    // Add user message to chat history
    const userMessage = { role: "user", content: prompt };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const aiResponse = await aiService.sendMessage(prompt);
      setResponse(aiResponse);
      
      // Add AI response to chat history
      const aiMessage = { role: "assistant", content: aiResponse };
      setChatHistory((prev) => [...prev, aiMessage]);
      
      setPrompt(""); // Clear input after successful send
    } catch (err) {
      setError(err.message || "Failed to get response from AI. Please try again.");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setResponse("");
    setError(null);
    setPrompt("");
  };

  const copyToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      // Optional: Show a temporary notification
      const notification = document.createElement("div");
      notification.textContent = "Copied to clipboard!";
      notification.className = "copy-notification";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    }
  };

  return (
    <div className="main-container">
      <div className="chat-wrapper">
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="ai-icon">🤖</div>
            <div>
              <h1>AI Chat Assistant</h1>
              <p>Powered by Advanced AI - Ask me anything!</p>
            </div>
          </div>
          <button onClick={clearChat} className="clear-btn" title="Clear chat">
            🗑️ Clear
          </button>
        </div>

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="chat-history">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className="message-content">
                  <div className="message-role">
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </div>
                  <div className="message-text">{msg.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current Response (if not in history) */}
        {response && chatHistory[chatHistory.length - 1]?.content !== response && (
          <div className="response-container">
            <div className="response-header">
              <span>🤖 AI Response</span>
              <button onClick={copyToClipboard} className="copy-btn" title="Copy response">
                📋 Copy
              </button>
            </div>
            <div className="response-content" ref={responseRef}>
              {response.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>AI is thinking...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">
              ✕
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="input-container">
          <textarea
            ref={textareaRef}
            className="prompt-input"
            rows="1"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask the AI something... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
          />
          <button
            onClick={askAI}
            className={`send-btn ${!prompt.trim() || isLoading ? "disabled" : ""}`}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? "Sending..." : "Send ✨"}
          </button>
        </div>

        {/* Tips */}
        <div className="tips">
          <span>💡 Tips:</span>
          <span>Press Enter to send</span>
          <span>•</span>
          <span>Shift+Enter for new line</span>
          <span>•</span>
          <span>Ask about anything!</span>
        </div>
      </div>
    </div>
  );
};

export default MainPage;