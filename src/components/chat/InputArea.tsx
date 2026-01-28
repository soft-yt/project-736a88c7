import { useState } from 'react';
import { cn } from '../../utils/cn';
import { SendIcon, AttachIcon } from '../ui/Icons';

interface InputAreaProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export const InputArea = ({ onSendMessage, disabled = false, className }: InputAreaProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage?.(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('border-t border-[var(--color-border)]', className)}>
      <div className="max-w-3xl mx-auto p-4">
        {/* Input Container */}
        <div className="relative flex items-end gap-2 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border)] p-3">
          <button
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            disabled={disabled}
          >
            <AttachIcon className="w-5 h-5" />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            disabled={disabled}
            rows={1}
            className={cn(
              'flex-1 bg-transparent text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] resize-none outline-none max-h-48 overflow-y-auto'
            )}
            style={{
              minHeight: '24px',
            }}
          />

          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className={cn(
              'p-2 rounded transition-colors',
              input.trim() && !disabled
                ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-main)] hover:bg-white'
                : 'text-[var(--color-text-secondary)] cursor-not-allowed'
            )}
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-[var(--color-text-secondary)] text-center mt-2">
          ChatGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};
