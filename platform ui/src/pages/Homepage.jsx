import React, { useState, useRef, useEffect } from 'react';
import '../styles/Homepage.css';

const assistants = [
  { name: 'Tech-Buddy', image: '/assets/bot1.jpg', intro: "Hi! I'm Tech-Buddy, your coding assistant." },
  { name: 'Code-Mate', image: '/assets/bot2.jpg', intro: "Hello! Code-Mate here to help you write better code." },
  { name: 'Project-Pal', image: '/assets/bot3.jpg', intro: "Hey there! Project-Pal at your service for all project queries." },
  { name: 'Study-Buddy', image: '/assets/bot4.jpg', intro: "Hi! Study-Buddy will help you with study tips and explanations." },
];

const TechTutor = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMessages = [...messages, { from: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: 'This is a response from AI.' }]);
    }, 500);
  };

  const chooseBot = (bot) => {
    setSelectedBot(bot);
    setMessages([{ from: 'bot', text: bot.intro }]);
  };

  const resetBot = () => {
    setSelectedBot(null);
    setMessages([]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="smartbot-wrapper">
      <main className="main-section">
        <h1 className="main-title">SmartBot<span className="dot-ai">.ai</span></h1>
        <p className="subtitle">(Your smart coding assistant for quick help & inspiration)</p>

        {!selectedBot ? (
          <div className="assistant-list">
            {assistants.map((assistant, index) => (
              <div key={index} className="assistant-card" onClick={() => chooseBot(assistant)}>
                <img src={assistant.image} alt={assistant.name} />
                <p>{assistant.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="chat-section">
            <div className="chat-header">
              <button className="model-btn" onClick={resetBot}>Switch Assistant</button>
            </div>

            <div className="chat-box">
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
              <button className="send-btn" onClick={sendMessage}>➤</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TechTutor;
