import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
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
import './App.css'

function App() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [currentConversation, setCurrentConversation] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  useEffect(() => {
    loadConversations()
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
  }

  const handleSelectConversation = (id) => {
    setCurrentConversationId(id)
  }

  const handleDeleteConversation = (id) => {
    deleteConv(id)
    loadConversations()
    if (currentConversationId === id) {
      handleNewChat()
    }
  }

  const handleSendMessage = async (question) => {
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
  }

  return (
    <div className="app">
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
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
  )
}

export default App
