import { useState, useEffect, useRef } from 'react'
import { Plus, MessageSquare, Trash2, Star, X, Brain, PanelLeft, PanelLeftClose } from 'lucide-react'

function Sidebar({ conversations, currentConversationId, onNewChat, onSelectConversation, onDeleteConversation, isOpen, onToggleSidebar }) {
  const [contextMenu, setContextMenu] = useState(null)
  const sidebarRef = useRef(null)

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

  const handleDelete = (e, convId) => {
    e.stopPropagation()
    onDeleteConversation(convId)
    setContextMenu(null)
  }

  const handleFavorite = () => {
    console.log('收藏对话:', contextMenu?.convId)
    setContextMenu(null)
  }

  useEffect(() => {
    if (contextMenu) {
      const handleClick = () => handleCloseContextMenu()
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [contextMenu])

  // 点击外部关闭移动端侧边栏
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth < 768 && isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onToggleSidebar()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggleSidebar])

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggleSidebar}
      />

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`
          fixed md:relative z-40 h-full flex flex-col
          bg-white/20 backdrop-blur-2xl border-r border-white/30
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:border-none md:opacity-0'}
          ${isOpen ? 'w-[280px] opacity-100' : ''}
        `}
      >
        <div className="p-4 min-w-[280px]">
          <div className="flex items-center gap-2">
            {/* New Chat Button */}
            <button 
              onClick={onNewChat}
              className="flex-1 flex items-center gap-3 px-3 py-3 rounded-xl bg-white/30 hover:bg-white/40 border border-white/40 transition-all text-sm font-medium text-gray-900 group"
            >
              <div className="p-1.5 rounded-full bg-white/40 group-hover:bg-white/50 transition-colors">
                <Plus size={18} />
              </div>
              <span>新对话</span>
            </button>
            
            {/* Toggle Sidebar Button - Desktop only */}
            <button 
              onClick={onToggleSidebar}
              className="hidden md:flex p-3 rounded-xl bg-white/30 hover:bg-white/40 border border-white/40 transition-colors text-gray-900"
              title={isOpen ? "收起侧边栏" : "展开侧边栏"}
            >
              {isOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            </button>
            
            {/* Mobile Close Button */}
            <button 
              onClick={onToggleSidebar}
              className="md:hidden p-3 rounded-xl bg-white/30 hover:bg-white/40 border border-white/40 transition-colors text-gray-900"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 min-w-[280px] no-scrollbar">
          <div className="text-xs font-semibold text-gray-700 mb-2 px-3 uppercase tracking-wider">历史对话</div>
          <div className="flex flex-col gap-1">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-600 text-sm">
                暂无对话记录
              </div>
            ) : (
              conversations.map((conv) => (
                <div 
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  onContextMenu={(e) => handleContextMenu(e, conv.id)}
                  className={`
                    group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all
                    ${currentConversationId === conv.id 
                      ? 'bg-white/40 text-gray-900 shadow-lg border border-white/50' 
                      : 'text-gray-800 hover:bg-white/30 hover:text-gray-900'}
                  `}
                >
                  <MessageSquare size={16} className={currentConversationId === conv.id ? "text-indigo-700" : "text-gray-600"} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm pr-6 font-medium">
                      {conv.messages[0]?.question || '新对话'}
                    </div>
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      {formatTime(conv.timestamp)}
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-700 hover:bg-red-100/50 rounded-lg transition-all"
                    title="删除对话"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/30 min-w-[280px]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 cursor-pointer transition-colors border border-white/30">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-gray-900">智囊团</div>
              <div className="text-[10px] text-gray-700">三位专家为您服务</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl p-1.5 z-50 min-w-[150px] shadow-2xl"
          style={{
            left: `${Math.min(contextMenu.x, window.innerWidth - 160)}px`,
            top: `${Math.min(contextMenu.y, window.innerHeight - 100)}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors text-sm text-gray-800"
            onClick={handleFavorite}
          >
            <Star size={14} />
            <span>收藏</span>
          </button>
          <button 
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm text-red-700"
            onClick={() => {
              onDeleteConversation(contextMenu.convId)
              setContextMenu(null)
            }}
          >
            <Trash2 size={14} />
            <span>删除</span>
          </button>
        </div>
      )}
    </>
  )
}

export default Sidebar
