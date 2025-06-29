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

    // Simulate AI response (replace with actual AI integration)
    set({ isTyping: true })
    
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        content: generateAIResponse(content),
        role: 'assistant',
        timestamp: new Date().toISOString(),
        worldId,
      }

      get().addMessage(aiResponse)
      set({ isTyping: false })
    }, 1000 + Math.random() * 2000)
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

// Simple AI response generator (replace with actual AI integration)
function generateAIResponse(userMessage: string): string {
  const responses = [
    "That's an interesting perspective! Tell me more about what you're thinking.",
    "I understand what you're saying. How can I help you explore this further?",
    "Great question! Let me think about that for a moment...",
    "I see where you're coming from. What would you like to know more about?",
    "That's a fascinating topic. Would you like me to elaborate on any particular aspect?",
    "Thanks for sharing that with me. What's your main goal here?",
    "I appreciate you bringing this up. How can I best assist you with this?",
    "That's definitely worth exploring. What's the most important part for you?",
  ]

  // Simple keyword-based responses
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! Welcome to this AI World. How can I help you today?"
  }
  
  if (lowerMessage.includes('help')) {
    return "I'm here to help! You can ask me questions, have a conversation, or explore the features of this AI World. What would you like to do?"
  }
  
  if (lowerMessage.includes('what') && lowerMessage.includes('do')) {
    return "In this AI World, you can chat with me, explore different features, create content, and connect with other users. What interests you most?"
  }

  return responses[Math.floor(Math.random() * responses.length)]
}