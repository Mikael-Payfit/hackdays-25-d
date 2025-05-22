'use client';

import Image from 'next/image';

type UserAvatarProps = {
  className?: string;
};

export function UserAvatar({ className = '' }: UserAvatarProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-full bg-blue-50 border-2 border-white ${className}`}
    >
      <Image
        src="/nigel-profile.png"
        alt="User avatar"
        width={48}
        height={48}
        className="h-full w-full object-cover rounded-full"
        priority
      />
    </div>
  );
}
