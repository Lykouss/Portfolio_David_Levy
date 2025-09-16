// src/components/chat/ChatInterface.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function ChatInterface() {
  const { user } = useAuth();
  const [selectedChatUser, setSelectedChatUser] = useState<UserProfile | null>(null);

  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - Em telemóveis, ocupa a tela toda; em desktop, a lateral */}
      {/* Usamos classes 'hidden' e 'flex' para controlar a visibilidade */}
      <div className={`w-full md:w-1/3 lg:w-1/4 flex-shrink-0 transition-all duration-300 ${selectedChatUser ? 'hidden md:flex' : 'flex'}`}>
        <Sidebar onSelectChat={setSelectedChatUser} />
      </div>

      {/* Janela de Chat - Ocupa a tela toda em telemóveis quando uma conversa é selecionada */}
      <div className={`w-full flex-grow flex-col transition-all duration-300 ${selectedChatUser ? 'flex' : 'hidden md:flex'}`}>
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