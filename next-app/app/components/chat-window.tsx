"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatWindow({ messages, currentUser }: any) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const formatTime = (dateString?: string) => {
    if (!dateString) return format(new Date(), "p") // fallback
    try {
      return format(new Date(dateString), "p")
    } catch {
      return format(new Date(), "p")
    }
  }

  return (
    <ScrollArea className="flex-1 bg-[#efeae2] p-4 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 pb-4">
        {messages.map((msg: any, i: number) => {
          const isMe = msg.sender === currentUser._id
          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative flex max-w-[85%] flex-col px-3 py-1.5 shadow-sm md:max-w-[75%] ${
                  isMe
                    ? "rounded-2xl rounded-tr-sm bg-emerald-100 text-zinc-900 dark:bg-emerald-900 dark:text-emerald-50"
                    : "rounded-2xl rounded-tl-sm bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                <span className="pr-12 text-[15px] leading-relaxed break-words">
                  {msg.content}
                </span>
                <span className="absolute right-2 bottom-1.5 text-[10px] text-zinc-500 select-none dark:text-emerald-200/70">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </motion.div>
          )
        })}
        {/* Invisible element to scroll to */}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  )
}
