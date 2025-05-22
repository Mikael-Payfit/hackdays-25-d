'use client';

import Image from 'next/image';

type UserAvatarProps = {
  className?: string;
};

export function UserAvatar({ className = '' }: UserAvatarProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-blue-50 border-2 border-white ${className}`}
    >
      <Image
        src="/person.svg"
        alt="User avatar"
        width={48}
        height={48}
        className="h-full w-full scale-110 p-0.5"
        priority
      />
    </div>
  );
}
