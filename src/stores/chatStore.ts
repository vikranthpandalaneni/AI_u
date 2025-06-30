import { create } from 'zustand'
import { realtime } from '../lib/supabase'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: string
  worldId: string
  userId?: string
}

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  isConnected: boolean
  currentWorldId: string | null
  
  // Actions
  sendMessage: (content: string, worldId: string, userId?: string) => Promise<void>
  addMessage: (message: ChatMessage) => void
  setTyping: (isTyping: boolean) => void
  setConnected: (isConnected: boolean) => void
  connectToWorld: (worldId: string) => void
  disconnectFromWorld: () => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  isConnected: false,
  currentWorldId: null,

  sendMessage: async (content: string, worldId: string, userId?: string) => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      worldId,
      userId
    }

    // Add user message immediately
    get().addMessage(message)

    // Send to other users via realtime
    await realtime.sendChatMessage(worldId, message)

    // REAL AI INTEGRATION: Replace with actual OpenAI/Claude API call
    set({ isTyping: true })
    
    try {
      // TODO: Implement real AI chat integration
      // This should make an authenticated server-side call to OpenAI/Claude
      // For now, using enhanced mock responses
      
      const aiResponse = await generateAIResponse(content)
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        worldId,
      }

      get().addMessage(assistantMessage)
      set({ isTyping: false })
    } catch (error) {
      console.error('AI response error:', error)
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
        worldId,
      }

      get().addMessage(errorMessage)
      set({ isTyping: false })
    }
  },

  addMessage: (message: ChatMessage) => {
    set(state => ({
      messages: [...state.messages, message]
    }))
  },

  setTyping: (isTyping: boolean) => set({ isTyping }),
  setConnected: (isConnected: boolean) => set({ isConnected }),

  connectToWorld: (worldId: string) => {
    const { currentWorldId, disconnectFromWorld } = get()
    
    // Disconnect from previous world if any
    if (currentWorldId && currentWorldId !== worldId) {
      disconnectFromWorld()
    }

    set({ currentWorldId: worldId, isConnected: true })

    // Subscribe to real-time chat updates
    realtime.subscribeToChat(worldId, (payload) => {
      if (payload.payload && payload.payload.id) {
        get().addMessage(payload.payload)
      }
    })
  },

  disconnectFromWorld: () => {
    set({ 
      currentWorldId: null, 
      isConnected: false,
      messages: []
    })
  },

  clearMessages: () => set({ messages: [] })
}))

// Enhanced AI response generator (to be replaced with real AI integration)
async function generateAIResponse(userMessage: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  const lowerMessage = userMessage.toLowerCase()
  
  // Context-aware responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! Welcome to this AI World. I'm here to help you explore and learn. What would you like to know about?"
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return "I can help you with a variety of tasks! I can answer questions, provide explanations, help with creative writing, solve problems, or just have a conversation. What specific area would you like assistance with?"
  }
  
  if (lowerMessage.includes('create') || lowerMessage.includes('build') || lowerMessage.includes('make')) {
    return "I'd love to help you create something! Whether it's writing, planning a project, brainstorming ideas, or building something specific, I'm here to assist. What did you have in mind?"
  }
  
  if (lowerMessage.includes('explain') || lowerMessage.includes('how does') || lowerMessage.includes('what is')) {
    return "I'm great at explaining complex topics in simple terms! Feel free to ask me about any concept, process, or idea you'd like to understand better. What would you like me to explain?"
  }
  
  if (lowerMessage.includes('ai universe') || lowerMessage.includes('this world')) {
    return "AI Universe is a platform where creators can build personalized AI-powered experiences! This world you're in was created using our no-code tools, featuring AI chat, voice interactions, and much more. Each world is unique and tailored to its creator's vision."
  }
  
  // Intelligent responses based on content
  const responses = [
    "That's a fascinating perspective! I'd love to explore this topic further with you. What specific aspect interests you most?",
    "I find that really intriguing. Based on what you've shared, I think we could dive deeper into several related areas. Which direction appeals to you?",
    "Great question! This touches on some important concepts. Let me share some thoughts and then I'd love to hear your perspective.",
    "I appreciate you bringing this up. It's a topic that has many layers to it. What's your experience been with this?",
    "That's an excellent point to consider. There are several ways to approach this, and I think your insight could help us find the best path forward.",
    "I'm really glad you asked about this. It's something that many people wonder about, and there are some interesting angles we could explore together.",
    "This is definitely worth discussing in detail. I think there are some practical applications here that might be really valuable for you.",
    "You've touched on something really important here. Let me share some thoughts, and then I'd love to get your take on it."
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}