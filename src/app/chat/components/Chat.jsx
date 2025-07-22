'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your chatbot.' },
  ])
  
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
  
    try {
      const res = await axios.post('/api/gemini', { prompt: input });
      const { reply } = res.data;
      console.log('Gemini reply:', reply); // Check if this logs the expected reply
  
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: reply },
      ]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Error: Failed to fetch response.' },
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded max-w-xs ${
              msg.role === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border-amber-400 border-2 text-black rounded"
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded disabled:opacity-50 "
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
