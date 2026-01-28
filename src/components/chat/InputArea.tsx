import { useState } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
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
      <div className="max-w-3xl mx-auto py-lg px-lg">
        {/* Input Container */}
        <div className="relative flex items-end gap-md bg-[var(--color-bg-main)] rounded-md border border-[var(--color-border)] py-md px-md">
          <button
            className="p-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
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
            style={{ minHeight: '24px' }}
          />

          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            size="sm"
            leftIcon={<SendIcon className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-[var(--color-text-secondary)] text-center mt-md">
          ChatGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};
