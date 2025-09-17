// src/components/chat/Sidebar.tsx
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore'; // orderBy foi removido
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, Chat } from '@/types';
import { signOut } from 'firebase/auth';
import { LogOut, User as UserIcon, Home } from 'lucide-react';
import Link from 'next/link';

// Hook useOtherParticipant permanece o mesmo
const useOtherParticipant = (chat: Chat, currentUserId: string | undefined) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  useEffect(() => {
    if (!chat || !currentUserId) return;
    const otherUserId = chat.participants.find(uid => uid !== currentUserId);
    if (!otherUserId) return;
    const userRef = doc(db, 'users', otherUserId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      setUser(doc.data() as UserProfile);
    });
    return () => unsubscribe();
  }, [chat, currentUserId]);
  return user;
};

// Componente ChatListItem permanece o mesmo
const ChatListItem = ({ chat, onSelectChat, currentUserId }: { chat: Chat, onSelectChat: (user: UserProfile) => void, currentUserId: string }) => {
  const otherUser = useOtherParticipant(chat, currentUserId);
  const unreadCount = chat.unreadCount?.[currentUserId] || 0;
  if (!otherUser) return null;
  return (
    <div
      onClick={() => onSelectChat(otherUser)}
      className="w-full flex items-center gap-3 p-4 border-b border-secondary/50 hover:bg-secondary cursor-pointer transition-colors"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
          <UserIcon className="text-text-muted" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-text truncate">{otherUser.displayName}</h3>
        {chat.lastMessage && (
          <p className={`text-sm truncate ${unreadCount > 0 ? 'text-text font-semibold' : 'text-text-muted'}`}>
            {chat.lastMessage.senderId === currentUserId && "Você: "}{chat.lastMessage.text}
          </p>
        )}
      </div>
      {unreadCount > 0 && (
        <div className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-background">
          {unreadCount}
        </div>
      )}
    </div>
  );
};


export default function Sidebar({ onSelectChat }: { onSelectChat: (user: UserProfile) => void }) {
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [adminProfile, setAdminProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => { await signOut(auth); };

  useEffect(() => {
    if (!currentUser) return;

    // A CORREÇÃO ESTÁ AQUI: A consulta foi simplificada
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', currentUser.uid)
      // A linha orderBy foi removida daqui
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Chat);
      
      // E a ordenação é feita aqui, no lado do cliente
      chatsData.sort((a, b) => {
        const dateA = a.lastMessage?.createdAt?.toDate() || new Date(0);
        const dateB = b.lastMessage?.createdAt?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Efeito para garantir que o admin está sempre visível (sem alterações)
  useEffect(() => {
    if (!currentUser || currentUser.uid === "CPfFfTlIlGTEbrSm5MfmHJtePTE2") return;
    const adminRef = doc(db, 'users', "CPfFfTlIlGTEbrSm5MfmHJtePTE2");
    const unsubscribe = onSnapshot(adminRef, (doc) => {
      if (doc.exists()) {
        setAdminProfile(doc.data() as UserProfile);
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  const chatWithAdminExists = chats.some(chat => chat.participants.includes("CPfFfTlIlGTEbrSm5MfmHJtePTE2"));

  return (
    // O JSX permanece o mesmo da versão anterior
    <div className="h-full w-full flex flex-col bg-primary">
      <div className="p-4 border-b border-secondary flex justify-between items-center flex-shrink-0">
        <Link href="/" title="Voltar ao Portfólio" className="text-text-muted hover:text-accent transition-colors">
          <Home size={22} />
        </Link>
        <h2 className="font-title text-xl">Conversas</h2>
        <button onClick={handleLogout} title="Sair da conta" className="text-text-muted hover:text-accent transition-colors">
          <LogOut size={20} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {loading && <p className="p-4 text-text-muted">A carregar...</p>}
        {!loading && chats.length === 0 && !adminProfile && <p className="p-4 text-text-muted">Nenhuma conversa encontrada.</p>}
        {chats.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            onSelectChat={onSelectChat}
            currentUserId={currentUser!.uid}
          />
        ))}
        {currentUser && currentUser.uid !== "CPfFfTlIlGTEbrSm5MfmHJtePTE2" && !chatWithAdminExists && adminProfile && (
           <div
            onClick={() => onSelectChat(adminProfile)}
            className="w-full flex items-center gap-3 p-4 border-b border-secondary/50 hover:bg-secondary cursor-pointer transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <UserIcon className="text-text-muted" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-text truncate">{adminProfile.displayName}</h3>
              <p className="text-sm text-text-muted truncate">Proprietário</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}