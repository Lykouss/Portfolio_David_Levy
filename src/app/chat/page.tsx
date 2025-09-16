// src/app/chat/page.tsx
"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import AuthScreen from "@/components/chat/AuthScreen";
import ChatInterface from "@/components/chat/ChatInterface"; // 1. Importe a interface

function ChatPageContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-accent"></div>
      </div>
    );
  }

  // 2. Renderiza a ChatInterface se o usuário estiver logado
  return user ? <ChatInterface /> : <AuthScreen />;
}

export default function ChatPage() {
  return (
    <AuthProvider>
      <ChatPageContent />
    </AuthProvider>
  );
}