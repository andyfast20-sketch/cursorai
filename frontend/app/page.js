"use client";
import "../style.css";
import { useState } from "react";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendQuestion() {
    if (!question.trim()) return;

    // Add the user’s message to the list
    const userMessage = { content: question, type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      // Call your existing backend endpoint
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      const answer = data?.answer ?? "No response";
      const botMessage = { content: answer, type: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { content: "Error: " + err.message, type: "error" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendQuestion();
  }

  return (
    <div className="container">
      <header>
        <h1>DeepSeek Chat</h1>
        <p className="subtitle">
          Ask anything and get intelligent responses
        </p>
      </header>
      <main>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="empty-state">
                Start a conversation by asking a question below 🤓
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-label">
                  {msg.type === "user" ? "You" : "DeepSeek"}
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="loader">
                <span className="spinner"></span>
              </div>
            )}
          </div>
        </div>
        <form className="input-container" onSubmit={handleSubmit}>
          <textarea
            id="question-input"
            placeholder="Type your question here..."
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="ask-button" disabled={loading}>
            Ask DeepSeek
          </button>
        </form>
      </main>
    </div>
  );
}
