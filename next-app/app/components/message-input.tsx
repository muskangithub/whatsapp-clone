"use client"

import { useState, useEffect, useRef } from "react"
import { socket } from "@/lib/socket"
import { Send, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MessageInput({ currentUser, selectedUser }: any) {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ✅ dynamic room id
  const roomId = [currentUser._id, selectedUser._id].sort().join("_")

  // Listen for typing indicator
  useEffect(() => {
    socket.on("typing", (data) => {
      if (data.user !== currentUser.name) {
        setIsTyping(true)
      }
    })

    socket.on("stop_typing", () => {
      setIsTyping(false)
    })

    return () => {
      socket.off("typing")
      socket.off("stop_typing")
    }
  }, [currentUser.name])

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!message.trim()) return

    socket.emit("send_message", {
      senderId: currentUser._id,
      content: message,
      roomId,
    })

    socket.emit("stop_typing", { roomId })
    setMessage("")
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)

    socket.emit("typing", {
      roomId,
      user: currentUser.name,
    })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { roomId })
    }, 2000)
  }

  return (
    <div className="flex flex-col border-t bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-6 items-end px-4">
        {isTyping && (
          <span className="animate-pulse text-xs font-medium text-emerald-600 italic dark:text-emerald-400">
            {selectedUser.name} is typing...
          </span>
        )}
      </div>
      <form
        onSubmit={sendMessage}
        className="flex shrink-0 items-center gap-2 p-3 pt-1 md:p-4"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
        >
          <Smile className="h-6 w-6" />
        </Button>

        <Input
          className="h-10 flex-1 rounded-full border-none px-4 shadow-sm dark:bg-zinc-800"
          placeholder="Type a message"
          value={message}
          onChange={handleTyping}
        />

        {message.trim() ? (
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full bg-emerald-600 text-white shadow-sm transition-transform hover:bg-emerald-700 active:scale-95"
          >
            <Send className="ml-0.5 h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-10 w-10 shrink-0 rounded-full text-muted-foreground"
            disabled
          >
            <Send className="ml-0.5 h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  )
}
