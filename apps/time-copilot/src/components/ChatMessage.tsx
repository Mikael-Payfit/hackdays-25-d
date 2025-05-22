'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BotAvatar } from './BotAvatar';
import { UserAvatar } from './UserAvatar';

export type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
};

type ChatMessageProps = {
  message: MessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  return (
    <div
      className={`flex w-full ${
        isBot ? 'justify-start' : 'justify-end'
      } mb-5 message-appear`}
    >
      {isBot && (
        <div className="mr-3 flex-shrink-0 mt-1">
          <BotAvatar className="h-10 w-10 shadow-sm" />
        </div>
      )}

      <div
        className={`max-w-[80%] md:max-w-[70%] lg:max-w-[60%] ${
          isBot ? '' : 'order-first mr-3'
        }`}
      >
        <div
          className={`px-5 py-3.5 rounded-2xl ${
            isBot
              ? 'bg-white/90 backdrop-blur-sm border border-blue-100/60 shadow-sm text-[#1C2024]'
              : 'bg-gradient-to-br from-[#2A80E8] to-[#1969CC] text-white shadow-md'
          }`}
        >
          {message.isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-2.5 w-2.5 bg-blue-300/70 rounded-full animate-bounce"></div>
              <div
                className="h-2.5 w-2.5 bg-blue-300/70 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="h-2.5 w-2.5 bg-blue-300/70 rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          ) : isBot ? (
            <div className="markdown-content prose max-w-none text-base leading-relaxed overflow-x-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-base leading-relaxed">{message.text}</p>
          )}
        </div>
        <p className="text-xs text-[#606466] mt-1.5 ml-1.5 font-light">
          {message.timestamp}
        </p>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 mt-1">
          <UserAvatar className="h-12 w-12 shadow-sm" />
        </div>
      )}
    </div>
  );
}
