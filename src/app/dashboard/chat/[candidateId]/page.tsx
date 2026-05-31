"use client";

import React, { useState, use, useEffect, useRef } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Paperclip,
  Send,
  FolderOpen,
  Image as ImageIcon,
  FileText,
  Video,
  Smile,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ChatPage({ params }: { params: Promise<{ candidateId: string }> }) {
  const resolvedParams = use(params);
  const { candidates, messages, sendMessage } = useData();
  const { role } = useAuth();
  
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const candidateId = resolvedParams.candidateId;
  const activeCandidate = candidates.find(c => c.id === candidateId) || candidates[0];
  const candidateMessages = messages[candidateId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [candidateMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeCandidate) return;
    
    // Always send as the current logged-in role
    sendMessage(activeCandidate.id, inputText, role || "RECRUITER");
    setInputText("");
  };

  if (!activeCandidate) return <div className="p-8 text-white">Loading chat...</div>;

  return (
    <div className="min-h-screen flex bg-zinc-950 theme-dark overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Column - Chat List */}
        <div className="w-80 border-r border-white/5 bg-zinc-950 flex flex-col">
          <div className="p-6 border-b border-white/5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-6">
              <Link href={`/dashboard/session/${activeCandidate.id}`}>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h2 className="text-lg font-semibold text-white">Chat</h2>
              <div className="w-8" />
            </div>
            
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
                {activeCandidate.avatar}
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{activeCandidate.name}</h3>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> available
            </div>
          </div>

          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-zinc-900 border-none rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Last chats</span>
              <button className="text-indigo-400 hover:text-indigo-300">
                <span className="text-lg">+</span>
              </button>
            </div>

            {candidates.map(c => (
              <Link key={c.id} href={`/dashboard/chat/${c.id}`}>
                <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${c.id === candidateId ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`text-sm font-medium truncate ${c.id === candidateId ? 'text-indigo-400' : 'text-zinc-200'}`}>{c.name}</p>
                      <span className="text-[10px] text-zinc-500">{c.time.split(' ')[0]} {c.time.split(' ')[1]}</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{c.role}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Column - Chat Area */}
        <div className="flex-1 flex flex-col bg-zinc-900/30">
          <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Group Chat</h2>
            <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-white/5">
              <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-indigo-500/10 text-indigo-400 shadow-sm">Messages</button>
              <button className="px-4 py-1.5 text-sm font-medium rounded-md text-zinc-400 hover:text-zinc-200 transition-colors">Participants</button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {candidateMessages.map((msg) => {
              // The "sender" logic depends on who is viewing the page. 
              // If I am RECRUITER and msg.senderRole is RECRUITER, it's MY message.
              // If I am CANDIDATE and msg.senderRole is CANDIDATE, it's MY message.
              const isMine = role === msg.senderRole;
              
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    {!isMine && <span className="text-xs font-medium text-zinc-400">{msg.senderRole === "RECRUITER" ? "Recruiter" : activeCandidate.name}</span>}
                    <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                  </div>
                  <div 
                    className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      isMine 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-zinc-800 border border-white/5 text-zinc-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 bg-zinc-950/50 border-t border-white/5 backdrop-blur-xl">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Write your message..."
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-4 pr-32 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button type="button" className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 ml-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Shared Files */}
        <div className="hidden lg:flex w-72 border-l border-white/5 bg-zinc-950 flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Shared files</h2>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </Button>
          </div>
          
          <div className="p-6 flex flex-col items-center border-b border-white/5">
            <div className="w-24 h-24 rounded-full border-4 border-zinc-800 overflow-hidden mb-4 relative bg-zinc-900">
               {/* Mock image placeholder for "project" */}
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-emerald-500 opacity-20" />
               <FolderOpen className="w-8 h-8 text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Interview Assets</h3>
            <p className="text-xs text-zinc-500">10 files attached</p>
          </div>

          <div className="p-6 grid grid-cols-2 gap-3 border-b border-white/5">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-2">
                <FolderOpen className="w-3 h-3" /> All files
              </div>
              <p className="text-2xl font-bold text-white">23</p>
            </div>
            <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex flex-col">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold mb-2">
                <Paperclip className="w-3 h-3" /> Links
              </div>
              <p className="text-2xl font-bold text-white">4</p>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">File type</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">Documents</p>
                    <p className="text-[10px] text-zinc-500">12 files, 1.9MB</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">Photos</p>
                    <p className="text-[10px] text-zinc-500">5 files, 3.2MB</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>

              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">Recordings</p>
                    <p className="text-[10px] text-zinc-500">3 files, 210MB</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
