"use client";

import { useState, useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";

export default function MessageInput({
    currentUser,
    selectedUser,
}: any) {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ dynamic room id
    const roomId = [currentUser._id, selectedUser._id]
        .sort()
        .join("_");

    // Listen for typing indicator
    useEffect(() => {
        socket.on("typing", (data) => {
            if (data.user !== currentUser.name) {
                setIsTyping(true);
            }
        });

        socket.on("stop_typing", () => {
            setIsTyping(false);
        });

        return () => {
            socket.off("typing");
            socket.off("stop_typing");
        }
    }, [currentUser.name]);

    const sendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!message.trim()) return;

        socket.emit("send_message", {
            senderId: currentUser._id,
            content: message,
            roomId,
        });

        socket.emit("stop_typing", { roomId });
        setMessage("");
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        
        socket.emit("typing", {
            roomId,
            user: currentUser.name,
        });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing", { roomId });
        }, 2000);
    };

    return (
        <div className="flex flex-col bg-zinc-100 dark:bg-zinc-900 border-t dark:border-zinc-800">
            <div className="h-6 flex items-end px-4">
                {isTyping && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium italic animate-pulse">
                        {selectedUser.name} is typing...
                    </span>
                )}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 p-3 md:p-4 pt-1 items-center shrink-0">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground shrink-0 rounded-full h-10 w-10"
                >
                    <Smile className="h-6 w-6" />
                </Button>
                
                <Input
                    className="flex-1 rounded-full px-4 border-none shadow-sm dark:bg-zinc-800 h-10"
                    placeholder="Type a message"
                    value={message}
                    onChange={handleTyping}
                />
                
                {message.trim() ? (
                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white h-10 w-10 shadow-sm transition-transform active:scale-95"
                    >
                        <Send className="h-4 w-4 ml-0.5" />
                        <span className="sr-only">Send</span>
                    </Button>
                ) : (
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="rounded-full shrink-0 h-10 w-10 text-muted-foreground"
                        disabled
                    >
                        <Send className="h-4 w-4 ml-0.5" />
                    </Button>
                )}
            </form>
        </div>
    );
}
