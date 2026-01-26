import './Sidebar.css'
import { useState, useEffect } from 'react'

function Sidebar({ conversations, currentConversationId, onNewChat, onSelectConversation, onDeleteConversation, isOpen, onToggleSidebar }) {
  const [contextMenu, setContextMenu] = useState(null)

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    }
  }

  const handleContextMenu = (e, convId) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      convId: convId
    })
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  const handleDelete = () => {
    if (contextMenu) {
      onDeleteConversation(contextMenu.convId)
      setContextMenu(null)
    }
  }

  const handleFavorite = () => {
    // TODO: 实现收藏功能
    console.log('收藏对话:', contextMenu?.convId)
    setContextMenu(null)
  }

  // 点击其他地方关闭菜单
  useEffect(() => {
    if (contextMenu) {
      const handleClick = () => handleCloseContextMenu()
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [contextMenu])

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>新对话</span>
          </button>
          <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="15" y1="3" x2="15" y2="21"></line>
              <line x1="10" y1="8" x2="6" y2="12"></line>
              <line x1="10" y1="16" x2="6" y2="12"></line>
            </svg>
          </button>
        </div>
        <div className="conversations-list">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`conversation-item ${currentConversationId === conv.id ? 'active' : ''}`}
              onClick={() => onSelectConversation(conv.id)}
              onContextMenu={(e) => handleContextMenu(e, conv.id)}
            >
              <div className="conversation-content">
                <div className="conversation-text">
                  {conv.messages[0]?.question}
                </div>
              </div>
              <div className="conversation-time">
                {formatTime(conv.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {contextMenu && (
        <div 
          className="context-menu"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="context-menu-item" onClick={handleFavorite}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>收藏</span>
          </button>
          <button className="context-menu-item danger" onClick={handleDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>删除</span>
          </button>
        </div>
      )}
    </>
  )
}

export default Sidebar
