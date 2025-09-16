// src/components/chat/ChatInterface.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { AnimatePresence, motion } from "framer-motion";

export default function ChatInterface() {
  const { user } = useAuth();
  const [selectedChatUser, setSelectedChatUser] = useState<UserProfile | null>(null);

  if (!user) return null;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <AnimatePresence>
        {/* Sidebar */}
        <motion.div
          key="sidebar"
          className={`w-full md:w-1/3 lg:w-1/4 flex-shrink-0 bg-primary border-r border-secondary ${selectedChatUser ? 'hidden md:flex' : 'flex'}`}
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Sidebar onSelectChat={setSelectedChatUser} />
        </motion.div>
      </AnimatePresence>

      {/* Janela de Chat */}
      <div className={`w-full flex-grow flex-col ${selectedChatUser ? 'flex' : 'hidden md:flex'}`}>
        {selectedChatUser ? (
          <ChatWindow selectedUser={selectedChatUser} onBack={() => setSelectedChatUser(null)} />
        ) : (
          <div className="hidden md:flex flex-grow flex-col items-center justify-center text-center p-4">
            <span className="text-6xl mb-4">👋</span>
            <h2 className="font-title text-2xl text-text">Selecione uma conversa</h2>
            <p className="text-text-muted">Escolha um contato na barra lateral para ver as mensagens.</p>
          </div>
        )}
      </div>
    </div>
  );
}