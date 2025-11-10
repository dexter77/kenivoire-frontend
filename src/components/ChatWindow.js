import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";

function ChatWindow({ conversationId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const ws = useRef(null);

  // Charger les anciens messages
  useEffect(() => {
    api.get(`/conversations/${conversationId}/messages/`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, [conversationId]);

  // Connexion WebSocket
  useEffect(() => {
    const socketUrl = `ws://127.0.0.1:8000/ws/chat/${conversationId}/`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages(prev => [...prev, data]);
      }
    };

    ws.current.onclose = () => console.log("WebSocket fermé");

    return () => ws.current.close();
  }, [conversationId]);

  // Envoi d’un message
  const sendMessage = (e) => {
    e.preventDefault();
    if (ws.current && newMessage.trim() !== "") {
      ws.current.send(JSON.stringify({ message: newMessage }));
      setNewMessage("");
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === currentUser ? "sent" : "received"}
          >
            <p>{msg.message}</p>
            <small>{msg.timestamp}</small>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="chat-input">
        <input
          type="text"
          placeholder="Écrire un message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default ChatWindow;
