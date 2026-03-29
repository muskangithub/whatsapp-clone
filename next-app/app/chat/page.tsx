"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Sidebar from "../components/sidebar";
import ChatWindow from "../components/chat-window";
import MessageInput from "../components/message-input";
import { socket } from "@/lib/socket";

export default function ChatPage() {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // 🔐 Auth check + get user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        // ❌ if not logged in → redirect
        if (!storedUser || !token) {
            router.replace("/login");
            return;
        }

        setCurrentUser(JSON.parse(storedUser));
    }, []);

    // 🟢 Fetch users
    useEffect(() => {
        if (!currentUser?._id) return;

        fetch(`http://localhost:5000/api/users?userId=${currentUser._id}`)
            .then((res) => res.json())
            .then(setUsers);
    }, [currentUser]);

    // 🟢 Join room when user selected
    useEffect(() => {
        if (!selectedUser || !currentUser) return;

        const roomId = [currentUser._id, selectedUser._id]
            .sort()
            .join("_");

        socket.emit("join_room", roomId);

        const token = localStorage.getItem("token");

        fetch(`http://localhost:5000/api/messages/${roomId}`, {
            headers: {
                Authorization: token || "",
            },
        })
            .then((res) => res.json())
            .then(setMessages);
    }, [selectedUser, currentUser]);

    // 🟢 Listen messages
    useEffect(() => {
        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
            {/* Sidebar */}
            <div className={`
                ${selectedUser ? 'hidden md:flex' : 'flex'} 
                w-full md:w-[320px] lg:w-[350px] shrink-0
            `}>
                <Sidebar
                    users={users}
                    currentUser={currentUser}
                    setSelectedUser={setSelectedUser}
                    selectedUser={selectedUser}
                />
            </div>

            {/* Main Chat Area */}
            <div className={`
                ${selectedUser ? 'flex' : 'hidden md:flex'} 
                flex-col flex-1 h-full max-w-full overflow-hidden
            `}>
                {selectedUser && currentUser ? (
                    <>
                        {/* Header */}
                        <div className="p-3 md:p-4 border-b bg-white dark:bg-zinc-950 flex items-center gap-3 shrink-0 shadow-sm z-10">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                            >
                                <ChevronLeft className="h-6 w-6" />
                                <span className="sr-only">Back</span>
                            </button>
                            <div className="h-10 w-10 flex shrink-0 rounded-full bg-primary/10 items-center justify-center text-primary font-semibold">
                                {selectedUser.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-semibold leading-none">{selectedUser.name}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <p className="text-xs text-muted-foreground">Online</p>
                                </div>
                            </div>
                        </div>

                        <ChatWindow
                            messages={messages}
                            currentUser={currentUser}
                        />

                        <MessageInput
                            currentUser={currentUser}
                            selectedUser={selectedUser}
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-zinc-50 dark:bg-zinc-900 border-l dark:border-zinc-800 hidden md:flex">
                        <div className="h-24 w-24 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                            <span className="text-zinc-400 text-4xl">💬</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">WhatsApp for Web</h2>
                        <p className="text-zinc-500 max-w-md">
                            Send and receive messages seamlessly. Select a chat from the sidebar to begin conversing.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
