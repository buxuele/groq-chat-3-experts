const STORAGE_KEY = 'ai_think_tank_conversations'

export function saveConversation(conversation) {
  const conversations = getConversations()
  const index = conversations.findIndex(c => c.id === conversation.id)
  
  if (index >= 0) {
    conversations[index] = conversation
  } else {
    conversations.unshift(conversation)
  }
  
  if (conversations.length > 100) {
    conversations.splice(100)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
}

export function getConversations() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function getConversationById(id) {
  const conversations = getConversations()
  return conversations.find(c => c.id === id)
}

export function deleteConversation(id) {
  const conversations = getConversations()
  const filtered = conversations.filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function clearAllConversations() {
  localStorage.removeItem(STORAGE_KEY)
}

export function createConversation(question, responses) {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    messages: [{
      question,
      responses,
      timestamp: new Date().toISOString()
    }]
  }
}

export function appendToConversation(conversation, question, responses) {
  return {
    ...conversation,
    timestamp: new Date().toISOString(),
    messages: [
      ...conversation.messages,
      {
        question,
        responses,
        timestamp: new Date().toISOString()
      }
    ]
  }
}
