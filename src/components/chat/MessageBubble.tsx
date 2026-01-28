import { cn } from '../../utils/cn';
import { Avatar } from './Avatar';
import type { MessageRole } from '../../types/chat';

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  className?: string;
}

export const MessageBubble = ({ role, content, className }: MessageBubbleProps) => {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'py-6 border-b border-[var(--color-border)]',
        isUser && 'bg-[var(--color-bubble-user)]',
        !isUser && 'bg-[var(--color-bubble-ai)]',
        className
      )}
    >
      <div className="max-w-3xl mx-auto px-4 flex gap-4">
        {!isUser && <Avatar role="assistant" />}
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              'text-[var(--color-text-primary)] whitespace-pre-wrap'
            )}
          >
            {content}
          </div>
        </div>
        {isUser && <Avatar role="user" />}
      </div>
    </div>
  );
};
