'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 w-full px-3 py-2"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full py-4 px-6 bg-transparent border-none focus:outline-none focus:ring-0 text-[#1C2024] text-base placeholder:text-[#8B8D98] placeholder:font-light"
          placeholder="Type your message..."
        />
      </div>
      <div className="flex-shrink-0">
        <Button
          type="submit"
          disabled={!inputValue.trim()}
          plain
          className="rounded-full h-12 w-12 p-0 flex items-center justify-center border-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
