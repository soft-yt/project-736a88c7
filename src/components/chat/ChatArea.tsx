import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { MessageBubble } from './MessageBubble';
import { MenuIcon } from '../ui/Icons';
import type { Message } from '../../types/chat';

interface ChatAreaProps {
  messages: Message[];
  isStreaming?: boolean;
  onMobileMenuClick?: () => void;
  className?: string;
}

export const ChatArea = ({
  messages,
  isStreaming = false,
  onMobileMenuClick,
  className
}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Автоскролл вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div className={cn('flex-1 flex flex-col min-w-0', className)}>
      {/* Mobile Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] md:hidden">
        <button
          onClick={onMobileMenuClick}
          className="p-2 hover:bg-[var(--color-hover)] rounded"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">ChatGPT</h1>
        <div className="w-10" />
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <h1 className="text-lg font-semibold">ChatGPT</h1>
      </header>

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[var(--color-text-secondary)]">Start a new conversation</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}
            {isStreaming && (
              <div className="py-6 border-b border-[var(--color-border)]">
                <div className="max-w-3xl mx-auto px-4 flex gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[var(--color-text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[var(--color-text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[var(--color-text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};
