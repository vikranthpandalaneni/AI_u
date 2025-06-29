import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useChatStore } from '../../stores/chatStore'
import { useAuthStore } from '../../stores/authStore'
import { cn, formatDate, getInitials } from '../../lib/utils'
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2
} from 'lucide-react'

interface ChatInterfaceProps {
  worldId: string
  className?: string
}

export function ChatInterface({ worldId, className }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { user } = useAuthStore()
  const { 
    messages, 
    isTyping, 
    isConnected, 
    sendMessage, 
    connectToWorld,
    disconnectFromWorld 
  } = useChatStore()

  useEffect(() => {
    connectToWorld(worldId)
    return () => disconnectFromWorld()
  }, [worldId, connectToWorld, disconnectFromWorld])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return
    
    await sendMessage(message, worldId, user.id)
    setMessage('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement voice recording with ElevenLabs
  }

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking)
    // TODO: Implement text-to-speech
  }

  return (
    <div className={cn("flex flex-col h-full bg-background border rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="font-medium">AI Chat</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSpeaking}
            className={cn(
              "h-8 w-8",
              isSpeaking && "bg-primary text-primary-foreground"
            )}
          >
            {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start a conversation with the AI assistant!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 chat-bubble",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === 'assistant' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className={cn(
              "max-w-[80%] rounded-lg px-4 py-2",
              msg.role === 'user' 
                ? "bg-primary text-primary-foreground ml-auto" 
                : "bg-muted"
            )}>
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {msg.role === 'user' && user && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>
                  {getInitials(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            className={cn(
              "h-10 w-10",
              isRecording && "bg-red-500 text-white hover:bg-red-600"
            )}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={!isConnected}
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}