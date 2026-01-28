import { useState } from 'react'
import './styles/theme.css'
import './styles/scrollbar.css'
import { Sidebar } from './components/layout/Sidebar'
import { MessageBubble } from './components/chat/MessageBubble'
import { InputArea } from './components/chat/InputArea'
import { MenuIcon } from './components/ui/Icons'
import type { Message, ChatHistory } from './types/chat'

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m ChatGPT. How can I help you today?',
      timestamp: Date.now()
    }
  ])
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Previous conversation' },
    { id: '2', title: 'Help with coding' },
    { id: '3', title: 'Creative writing' }
  ])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated response. In a real application, this would be connected to an AI API.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 500)
  }

  const handleNewChat = () => {
    setMessages([])
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
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-[var(--color-hover)] rounded"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">ChatGPT</h1>
          <div className="w-10" />
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-[var(--color-text-secondary)]">Start a new conversation</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))
          )}
        </div>

        {/* Input Area */}
        <InputArea onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default App
