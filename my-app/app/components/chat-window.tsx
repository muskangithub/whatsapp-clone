"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ChatWindow({ messages, currentUser }: any) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const formatTime = (dateString?: string) => {
        if (!dateString) return format(new Date(), "p"); // fallback
        try {
            return format(new Date(dateString), "p");
        } catch {
            return format(new Date(), "p");
        }
    };

    return (
        <ScrollArea className="flex-1 p-4 bg-[#efeae2] dark:bg-zinc-950">
            <div className="flex flex-col gap-2 pb-4 max-w-4xl mx-auto w-full">
                {messages.map((msg: any, i: number) => {
                    const isMe = msg.sender === currentUser._id;
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            key={i}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`relative max-w-[85%] md:max-w-[75%] px-3 py-1.5 shadow-sm flex flex-col ${
                                    isMe
                                        ? "bg-emerald-100 dark:bg-emerald-900 text-zinc-900 dark:text-emerald-50 rounded-2xl rounded-tr-sm"
                                        : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl rounded-tl-sm"
                                }`}
                            >
                                <span className="text-[15px] leading-relaxed break-words pr-12">
                                    {msg.content}
                                </span>
                                <span className="absolute bottom-1.5 right-2 text-[10px] text-zinc-500 dark:text-emerald-200/70 select-none">
                                    {formatTime(msg.createdAt)}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
                {/* Invisible element to scroll to */}
                <div ref={scrollRef} />
            </div>
        </ScrollArea>
    );
}
