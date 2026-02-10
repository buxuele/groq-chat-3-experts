import { useState, useRef, useEffect } from 'react'
import { PanelLeft, Loader2, Lightbulb } from 'lucide-react'
import MessageList from './MessageList'
import InputBox from './InputBox'

function ChatContainer({ conversation, onSendMessage, sidebarOpen, onToggleSidebar }) {
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)

  // 检测用户是否滚动到底部
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
      setShouldScrollToBottom(isAtBottom)
    }
  }

  // 自动滚动到底部
  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversation, loading, shouldScrollToBottom])

  const handleSend = async (question) => {
    setLoading(true)
    setShouldScrollToBottom(true) // 发送新消息时始终滚动到底部
    try {
      await onSendMessage(question)
    } catch (error) {
      console.error('发送消息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col h-full relative w-full min-w-0 bg-transparent">
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button - Show when sidebar is collapsed on desktop */}
          {!sidebarOpen && (
            <button 
              onClick={onToggleSidebar}
              className="hidden md:flex p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-gray-900 transition-colors backdrop-blur-md border border-white/30"
              title="展开侧边栏"
            >
              <PanelLeft size={20} />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 drop-shadow-sm">AI 智囊团</span>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/30 text-gray-800 border border-white/40">3位专家</span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-6 no-scrollbar"
      >
        <div className="max-w-3xl mx-auto w-full pt-20 pb-36 flex flex-col gap-6">
          {conversation ? (
            <MessageList messages={conversation.messages} />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/25 backdrop-blur-xl border border-white/40 flex items-center justify-center mb-6 shadow-2xl">
                <Lightbulb className="w-10 h-10 text-gray-900" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 drop-shadow-sm">AI 智囊团</h1>
              <p className="text-gray-800 text-base max-w-sm leading-relaxed font-medium">
                提出你的问题，从三位专家视角获取深度洞察
              </p>
            </div>
          )}
          
          {loading && (
            <div className="flex w-full justify-start">
              <div className="relative overflow-hidden rounded-2xl bg-white/25 backdrop-blur-2xl border border-white/40 shadow-xl p-4">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/40 border border-white/50 flex items-center justify-center">
                    <Loader2 className="text-gray-900 w-4 h-4 animate-spin" />
                  </div>
                  <span className="text-gray-800 text-sm font-semibold">三位专家正在思考...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <InputBox onSend={handleSend} disabled={loading} />
    </main>
  )
}

export default ChatContainer
