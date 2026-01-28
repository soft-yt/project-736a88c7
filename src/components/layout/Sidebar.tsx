import { cn } from '../../utils/cn';
import { PlusIcon, TrashIcon } from '../ui/Icons';
import type { ChatHistory } from '../../types/chat';

interface SidebarProps {
  chatHistory: ChatHistory[];
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
  onDeleteChat?: (id: string) => void;
  className?: string;
}

export const Sidebar = ({
  chatHistory,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  className,
}: SidebarProps) => {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col w-64 bg-[var(--color-bg-sidebar)] text-[var(--color-text-primary)]',
        className
      )}
    >
      {/* New Chat Button */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-md border border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm">New chat</span>
        </button>
      </div>

      {/* Chat History List */}
      <nav className="flex-1 overflow-y-auto py-2">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className="group flex items-center gap-2 px-3 py-2 mx-2 rounded-md hover:bg-[var(--color-hover)] cursor-pointer"
            onClick={() => onSelectChat?.(chat.id)}
          >
            <span className="flex-1 text-sm truncate">{chat.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat?.(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
};
