import { cn } from '../../utils/cn';
import type { MessageRole } from '../../types/chat';

interface AvatarProps {
  role: MessageRole;
  className?: string;
}

export const Avatar = ({ role, className }: AvatarProps) => {
  if (role === 'user') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full w-8 h-8 text-white font-medium',
          className
        )}
        style={{ backgroundColor: '#5436DA' }}
      >
        U
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full w-8 h-8 text-white',
        className
      )}
      style={{ backgroundColor: '#19C37D' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
        <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
        <path d="M9 14l1.5 1.5L15 11" />
      </svg>
    </div>
  );
};
