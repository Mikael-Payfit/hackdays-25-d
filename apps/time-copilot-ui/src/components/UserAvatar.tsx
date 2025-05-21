'use client';

type UserAvatarProps = {
  className?: string;
};

export function UserAvatar({ className = '' }: UserAvatarProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${className}`}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <circle cx="20" cy="20" r="20" fill="#F0F0F3" />
        <path
          d="M20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10Z"
          fill="#60646C"
        />
        <path
          d="M12 30C12 25.5817 15.5817 22 20 22C24.4183 22 28 25.5817 28 30H12Z"
          fill="#60646C"
        />
      </svg>
    </div>
  );
}
