import React, { useState, useRef, useEffect } from 'react';
import '../styles/Homepage.css';

import bot1 from '../assets/bot1.jpg';
import bot2 from '../assets/bot2.jpg';
import bot3 from '../assets/bot3.jpg';
import bot4 from '../assets/bot4.jpg';

const assistants = [
  { name: 'Tech-Buddy', image: bot1, intro: "Hi! I'm Tech-Buddy, your coding assistant." },
  { name: 'Code-Mate', image: bot2, intro: "Hello! Code-Mate here to help you write better code." },
  { name: 'Project-Pal', image: bot3, intro: "Hey there! Project-Pal at your service for all project queries." },
  { name: 'Study-Buddy', image: bot4, intro: "Hi! Study-Buddy will help you with study tips and explanations." },
];

const TechTutor = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);
  const chatEndRef = useRef(null);
const sendMessage = async () => {
  const trimmed = input.trim();
  if (!trimmed) return;

  const newMessages = [...messages, { from: 'user', text: trimmed }];
  setMessages(newMessages);
  setInput('');

  const streamURLMap = {
    "Tech-Buddy": "http://127.0.0.1:8080/chat/stream",
    "Code-Mate": "http://127.0.0.1:8010/chat/stream",
    "Project-Pal": "http://127.0.0.1:8110/chat/stream",
    "Study-Buddy": "http://127.0.0.1:8060/chat/stream",
  };

  const url = streamURLMap[selectedBot?.name];
  if (!url) {
    setMessages((prev) => [...prev, { from: 'bot', text: `This is a response from ${selectedBot?.name}.` }]);
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: trimmed }),
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.from === 'bot') {
          return [...prev.slice(0, -1), { from: 'bot', text: fullText }];
        } else {
          return [...prev, { from: 'bot', text: fullText }];
        }
      });
    }

  } catch (error) {
    console.error(error);
    setMessages((prev) => [...prev, { from: 'bot', text: "⚠️ Oops! Failed to stream response from the server." }]);
  }
};


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessages((prev) => [
        ...prev,
        { from: 'user', text: `📁 Uploaded: ${file.name}` },
        { from: 'bot', text: 'File received! I will process it soon.' }
      ]);
    }
  };

  const chooseBot = (bot) => {
    setSelectedBot(bot);
    setMessages([{ from: 'bot', text: bot.intro }]);
    document.body.style.overflow = 'hidden';
  };

  const resetBot = () => {
    setSelectedBot(null);
    setMessages([]);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="tech-tutor-root">
      {!selectedBot && (
        <div className="smartbot-wrapper">
          <h1 className="main-title">SmartBot<span className="dot-ai">.ai</span></h1>
          <p className="subtitle">(Your smart coding assistant for quick help & inspiration)</p>
          <div className="assistant-list">
            {assistants.map((assistant, index) => (
              <div key={index} className="assistant-card" onClick={() => chooseBot(assistant)}>
                <img src={assistant.image} alt={assistant.name} />
                <p>{assistant.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBot && (
        <div className="chat-full-wrapper smartbot-wrapper">
          <div className="chat-section">
            <div className="chat-header">
              <button className="model-btn" onClick={resetBot}>Switch Assistant</button>
            </div>

            <div className="chat-box scrollable-box">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.from}`}>
                  <div className={`chat-bubble ${msg.from}`}>{msg.text}</div>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder={`Ask ${selectedBot.name} anything :)`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <>
                <label htmlFor="file-upload" className="file-upload-label">📁 Upload</label>
                <input id="file-upload" type="file" onChange={handleFileUpload} />
              </>
              <button className="send-btn" onClick={sendMessage}>➔</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechTutor;
