'use client';

import { Avatar } from '@/ui/avatar';
import { BotAvatar } from './BotAvatar';

export type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
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
          <BotAvatar className="h-10 w-10 bg-[#EBF4FF] shadow-sm" />
        </div>
      )}

      <div
        className={`max-w-[75%] md:max-w-[60%] ${
          isBot ? '' : 'order-first mr-3'
        }`}
      >
        <div
          className={`px-5 py-3.5 rounded-2xl ${
            isBot
              ? 'bg-white border border-[#E8E8EC] shadow-sm text-[#1C2024]'
              : 'bg-[#0F6FDE] text-white shadow-sm'
          }`}
        >
          <p className="text-base leading-relaxed">{message.text}</p>
        </div>
        <p className="text-xs text-[#606466] mt-1.5 ml-1.5 font-light">
          {message.timestamp}
        </p>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 mt-1">
          <Avatar
            initials="U"
            className="h-10 w-10 bg-[#F0F0F3] text-[#60646C] shadow-sm"
            alt="User"
          />
        </div>
      )}
    </div>
  );
}
