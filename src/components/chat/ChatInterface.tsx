// src/components/chat/ChatInterface.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow"; // 1. Importe o ChatWindow

export default function ChatInterface() {
  const { user } = useAuth();
  const [selectedChatUser, setSelectedChatUser] = useState<UserProfile | null>(null);

  if (!user) return null;

  return (
    <div className="flex h-screen w-full">
      {/* Barra Lateral */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-primary border-r border-secondary flex-shrink-0">
        <Sidebar onSelectChat={setSelectedChatUser} />
      </div>

      {/* Janela Principal */}
      <div className="hidden md:flex flex-grow flex-col">
        {selectedChatUser ? (
          // 2. Renderize o ChatWindow passando o usuário selecionado
          <ChatWindow selectedUser={selectedChatUser} />
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <span className="text-6xl mb-4">👋</span>
            <h2 className="font-title text-2xl text-text">Selecione uma conversa</h2>
            <p className="text-text-muted">Escolha um contato na barra lateral para ver as mensagens.</p>
          </div>
        )}
      </div>
    </div>
  );
}