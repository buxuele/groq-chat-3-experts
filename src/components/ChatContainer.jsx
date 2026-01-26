import { useState, useRef, useEffect } from 'react'
import MessageList from './MessageList'
import InputBox from './InputBox'
import './ChatContainer.css'

function ChatContainer({ conversation, onSendMessage, sidebarOpen, onToggleSidebar }) {
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const handleSend = async (question) => {
    setLoading(true)
    await onSendMessage(question)
    setLoading(false)
  }

  return (
    <div className={`chat-container ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
      {!sidebarOpen && (
        <button className="floating-sidebar-toggle" onClick={onToggleSidebar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="14" y1="8" x2="18" y2="12"></line>
            <line x1="14" y1="16" x2="18" y2="12"></line>
          </svg>
          <span>对话历史</span>
        </button>
      )}
      <div className="messages-wrapper">
        {conversation ? (
          <MessageList messages={conversation.messages} />
        ) : (
          <div className="welcome">
            <h1>AI 智囊团</h1>
            <p>提出你的问题，从三位专家视角获取深度洞察</p>
          </div>
        )}
        {loading && (
          <div className="loading">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <InputBox onSend={handleSend} disabled={loading} sidebarOpen={sidebarOpen} />
    </div>
  )
}

export default ChatContainer
