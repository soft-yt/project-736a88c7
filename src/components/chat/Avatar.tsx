import { cn } from '../../utils/cn';
import type { MessageRole } from '../../types/chat';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  role: MessageRole;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export const Avatar = ({ role, size = 'md', className }: AvatarProps) => {
  if (role === 'user') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-medium',
          sizeStyles[size],
          className
        )}
        style={{ backgroundColor: 'var(--color-user-avatar)' }}
      >
        U
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full',
        sizeStyles[size],
        className
      )}
      style={{ backgroundColor: 'var(--color-accent)' }}
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
