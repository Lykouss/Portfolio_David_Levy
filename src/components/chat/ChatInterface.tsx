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

  // --- LAYOUT CORRIGIDO E SIMPLIFICADO ---
  return (
    <div className="flex h-full w-full flex-grow overflow-hidden">
      {isAdmin ? (
        <>
          {/* Admin: Sidebar */}
          <div
            className={`
              w-full flex-shrink-0 flex-col border-r border-secondary bg-primary 
              md:w-[350px]
              ${selectedChatUser ? 'hidden md:flex' : 'flex'}
            `}
          >
            <Sidebar onSelectChat={setSelectedChatUser} />
          </div>

          {/* Admin: Chat Window ou Placeholder */}
          <div className="flex-grow flex-col ${selectedChatUser ? 'flex' : 'hidden md:flex'}">
            {selectedChatUser ? (
              <ChatWindow selectedUser={selectedChatUser} onBack={() => setSelectedChatUser(null)} />
            ) : (
              <div className="hidden h-full flex-col items-center justify-center p-4 text-center md:flex">
                <span className="mb-4 text-6xl">👋</span>
                <h2 className="font-title text-2xl text-text">Selecione uma conversa</h2>
                <p className="text-text-muted">Escolha um contato na barra lateral.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        // Cliente: Apenas Chat Window
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