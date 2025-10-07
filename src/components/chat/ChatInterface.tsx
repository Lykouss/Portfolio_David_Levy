// src/components/chat/ChatInterface.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ADMIN_UID = "CPfFfTlIlGTEbrSm5MfmHJtePTE2";

export default function ChatInterface() {
  const { user } = useAuth();
  const [selectedChatUser, setSelectedChatUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const checkIsAdmin = user.uid === ADMIN_UID;
    setIsAdmin(checkIsAdmin);

    if (!checkIsAdmin) {
      const getAdminProfile = async () => {
        const adminDoc = await getDoc(doc(db, "users", ADMIN_UID));
        if (adminDoc.exists()) {
          setSelectedChatUser(adminDoc.data() as UserProfile);
        } else {
          console.error("Perfil do admin não encontrado.");
        }
        setIsLoading(false);
      };
      getAdminProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-grow items-center justify-center">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-accent"></div>
      </div>
    );
  }

  // --- LÓGICA DE LAYOUT CORRIGIDA E SIMPLIFICADA ---

  return (
    // O contêiner principal agora é um simples flex row que ocupa todo o espaço
    <div className="flex h-full w-full flex-grow overflow-hidden">
      {isAdmin ? (
        // Layout para Admin
        <>
          {/* Sidebar */}
          <div className={`
            flex-shrink-0 flex-col border-r border-secondary bg-primary
            ${selectedChatUser ? 'hidden w-0 md:flex md:w-1/3 lg:w-1/4' : 'flex w-full'}
          `}>
            <Sidebar onSelectChat={setSelectedChatUser} />
          </div>

          {/* Área do Chat */}
          <div className={`flex-grow flex-col ${selectedChatUser ? 'flex' : 'hidden'}`}>
            {selectedChatUser && <ChatWindow selectedUser={selectedChatUser} onBack={() => setSelectedChatUser(null)} />}
          </div>

           {/* Placeholder para Desktop quando nenhum chat está selecionado */}
           {!selectedChatUser && (
              <div className="hidden h-full flex-grow flex-col items-center justify-center p-4 text-center md:flex">
                <span className="mb-4 text-6xl">👋</span>
                <h2 className="font-title text-2xl text-text">Selecione uma conversa</h2>
                <p className="text-text-muted">Escolha um contato na barra lateral para ver as mensagens.</p>
              </div>
            )}
        </>
      ) : (
        // Layout para Cliente (Apenas ChatWindow)
        <div className="h-full w-full">
          {selectedChatUser ? (
            <ChatWindow selectedUser={selectedChatUser} onBack={() => {}} />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-accent"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}