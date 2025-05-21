'use client';

import { chatService } from '@/app/lib/chatService';
import { useEffect, useRef, useState } from 'react';
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
      const response = await chatService.sendMessage(text);

      // Process streaming response
      let fullText = '';
      await chatService.processStream(response, (chunk) => {
        fullText += chunk;
        // Update message with received chunk
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const botMessageIndex = newMessages.findIndex(
            (msg) => msg.id === botPlaceholder.id
          );

          if (botMessageIndex !== -1) {
            newMessages[botMessageIndex] = {
              ...newMessages[botMessageIndex],
              text: fullText,
              isLoading: false,
            };
          }

          return newMessages;
        });
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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-[#E8E8EC] px-4 md:px-8 py-3 flex items-center shadow-sm">
        <div className="h-8 w-8 rounded-full bg-[#0F6FDE] flex items-center justify-center mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="font-medium text-[#082F63]">Time Assistant</p>
      </div>

      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-1 bg-[#F9F9FB]"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="border-t border-[#E8E8EC] bg-white py-4 px-4 md:px-8 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
