"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Sidebar({ users, currentUser, setSelectedUser, selectedUser }: any) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = users?.filter((u: any) => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-zinc-950 border-r dark:border-zinc-800">
            {/* Header: Current User */}
            <div className="p-3 md:p-4 flex flex-shrink-0 items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden hidden md:flex">
                        <h2 className="font-semibold text-sm leading-tight truncate">{currentUser?.name}</h2>
                        <p className="text-xs text-muted-foreground truncate w-[150px]">{currentUser?.email}</p>
                    </div>
                </div>
                <ModeToggle />
            </div>
            
            <Separator />

            {/* Search Bar */}
            <div className="p-3 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search or start a new chat" 
                        className="pl-9 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl h-9 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 h-full px-2">
                    <div className="flex flex-col pb-4">
                        {filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No users found.
                            </div>
                        ) : (
                            filteredUsers.map((user: any, idx: number) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => setSelectedUser(user)}
                                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                                            selectedUser?._id === user._id 
                                            ? "bg-zinc-100 dark:bg-zinc-800" 
                                            : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                                        } rounded-lg`}
                                    >
                                        <div className="relative shrink-0">
                                            <Avatar className="h-12 w-12">
                                                <AvatarFallback className={selectedUser?._id === user._id ? "bg-primary text-primary-foreground" : "bg-zinc-200 dark:bg-zinc-800"}>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-950 bg-emerald-500"></span>
                                        </div>
                                        
                                        <div className="flex flex-col flex-1 overflow-hidden">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-[15px] font-medium leading-none truncate">{user.name}</span>
                                                <span className="text-xs text-muted-foreground shrink-0">{idx % 2 === 0 ? '12:45 PM' : 'Yesterday'}</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-2">
                                                <span className="text-sm text-muted-foreground truncate flex-1 leading-snug">
                                                    {idx % 3 === 0 ? 'Sounds good!' : 'Are we still on for later?'}
                                                </span>
                                                {idx % 4 === 0 && (
                                                    <Badge className="h-5 w-5 flex items-center justify-center p-0 rounded-full bg-emerald-500 hover:bg-emerald-600 font-normal text-white text-[10px] shrink-0">
                                                        {idx + 1}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {idx !== filteredUsers.length - 1 && (
                                        <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800/50 ml-[72px]" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
