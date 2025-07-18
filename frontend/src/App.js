import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Ask me anything.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage = { from: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: 'Oops, something went wrong.' },
      ]);
    }
    setInput('');
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>AI Chatbot</h1>
      <div
        style={{
          border: '1px solid #ccc',
          height: 400,
          overflowY: 'auto',
          padding: 10,
          marginBottom: 10,
          background: '#f9f9f9',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.from === 'user' ? 'right' : 'left',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: 12,
                background: msg.from === 'user' ? '#007bff' : '#e0e0e0',
                color: msg.from === 'user' ? 'white' : 'black',
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !loading) sendMessage();
        }}
        placeholder="Type your message..."
        disabled={loading}
        style={{ width: '80%', padding: 10 }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ padding: 10 }}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}

export default App;
