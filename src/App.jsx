import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatContainer from './components/ChatContainer'
import { getAllExpertResponses } from './services/groqService'
import { 
  getConversations, 
  getConversationById, 
  saveConversation, 
  deleteConversation as deleteConv,
  createConversation,
  appendToConversation
} from './services/storageService'

function App() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [currentConversation, setCurrentConversation] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  useEffect(() => {
    loadConversations()
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (currentConversationId) {
      const conv = getConversationById(currentConversationId)
      setCurrentConversation(conv)
    }
  }, [currentConversationId])

  const loadConversations = () => {
    setConversations(getConversations())
  }

  const handleNewChat = () => {
    setCurrentConversationId(null)
    setCurrentConversation(null)
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  const handleSelectConversation = (id) => {
    setCurrentConversationId(id)
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  const handleDeleteConversation = (id) => {
    deleteConv(id)
    loadConversations()
    if (currentConversationId === id) {
      handleNewChat()
    }
  }

  const handleSendMessage = async (question) => {
    try {
      if (!apiKey) {
        throw new Error('请配置 GROQ_API_KEY')
      }
      
      const responses = await getAllExpertResponses(question, apiKey)
      
      let conversation
      if (currentConversationId) {
        const existing = getConversationById(currentConversationId)
        conversation = appendToConversation(existing, question, responses)
      } else {
        conversation = createConversation(question, responses)
      }
      
      saveConversation(conversation)
      setCurrentConversationId(conversation.id)
      setCurrentConversation(conversation)
      loadConversations()
      
      return { success: true, conversation_id: conversation.id, responses }
    } catch (error) {
      console.error('发送消息失败:', error)
      throw error
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-[1.02]"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')`, 
          filter: 'brightness(0.8)'
        }}
      />
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      {/* Main Content */}
      <div className="absolute inset-0 z-10 flex flex-col">
        <div className="flex h-full w-full relative text-gray-900 overflow-hidden">
          <Sidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            isOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          
          <ChatContainer
            conversation={currentConversation}
            onSendMessage={handleSendMessage}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>
    </div>
  )
}

export default App
