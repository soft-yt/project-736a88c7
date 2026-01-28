import { useState } from 'react'
import './styles/theme.css'
import './styles/scrollbar.css'
import { Sidebar } from './components/layout/Sidebar'
import { ChatArea } from './components/chat/ChatArea'
import { InputArea } from './components/chat/InputArea'
import { useChat } from './hooks/useChat'
import { initialChats } from './data/mockData'
import type { ChatHistory } from './types/chat'

function App() {
  const { messages, isStreaming, sendMessage } = useChat()
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(initialChats)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNewChat = () => {
    // Reset messages - in real app would create new chat
    window.location.reload()
  }

  const handleSelectChat = (id: string) => {
    // In a real app, this would load the chat history
    console.log('Selected chat:', id)
  }

  const handleDeleteChat = (id: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id))
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg-main)] text-[var(--color-text-primary)]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 md:static md:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform`}>
        <Sidebar
          chatHistory={chatHistory}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea
          messages={messages}
          isStreaming={isStreaming}
          onMobileMenuClick={() => setSidebarOpen(true)}
        />
        <InputArea onSendMessage={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  )
}

export default App
