'use client';

import { useEffect, useRef, useState } from 'react';
import { chatService } from '../app/lib/chatService';
import { Button } from '../ui/button';
import { ChatInput } from './ChatInput';
import { ChatMessage, MessageType } from './ChatMessage';

export function ChatContainer() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 'welcome',
      text: 'How can I help you with your time management today?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    try {
      // Add user message
      const userMessage: MessageType = {
        id: `user-${Date.now()}`,
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Add placeholder for bot response
      const botPlaceholder: MessageType = {
        id: `bot-${Date.now()}`,
        text: '',
        sender: 'bot',
        isLoading: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, userMessage, botPlaceholder]);

      // Send message to agent
      const responseText = await chatService.sendMessage(text);

      // Update the bot message with the response
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        const botMessageIndex = newMessages.findIndex(
          (msg) => msg.id === botPlaceholder.id
        );

        if (botMessageIndex !== -1) {
          newMessages[botMessageIndex] = {
            ...newMessages[botMessageIndex],
            text: responseText,
            isLoading: false,
          };
        }

        return newMessages;
      });
    } catch (error) {
      console.error('Error handling message:', error);
      // Update error state in the bot message
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        const botMessageIndex = newMessages.findIndex(
          (msg) => msg.isLoading === true
        );

        if (botMessageIndex !== -1) {
          newMessages[botMessageIndex] = {
            ...newMessages[botMessageIndex],
            text: 'Sorry, there was an error processing your request. Please try again later.',
            isLoading: false,
          };
        }

        return newMessages;
      });
    }
  };

  const clearChat = () => {
    chatService.createNewThread();

    const welcomeMessage: MessageType = {
      id: `welcome-${Date.now()}`,
      text: 'How can I help you with your time management today?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Clear chat button in top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <Button onClick={clearChat} color="white" className="text-sm shadow-sm">
          Clear Chat
        </Button>
      </div>

      {/* Messages container */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-28 space-y-2 mt-10"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Floating input at the bottom */}
      <div className="fixed bottom-6 left-0 right-0 px-4 py-3 md:px-8 md:py-4 z-10">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-blue-100">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
