import { useState, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatMessages as initialChatMessages } from '../data/dummyData';

export function useLiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMessage: ChatMessage = {
        id: String(Date.now()),
        userId: String(Math.floor(Math.random() * 3) + 1),
        content: `New message ${Date.now()}`,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = (content: string, userId: string) => {
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      userId,
      content,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return { messages, sendMessage };
}

