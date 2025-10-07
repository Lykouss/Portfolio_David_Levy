// src/components/chat/Sidebar.tsx
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, Chat } from '@/types';
import { signOut } from 'firebase/auth';
import { LogOut, User as UserIcon, Home, Loader2, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_UID = "CPfFfTlIlGTEbrSm5MfmHJtePTE2";

const ChatListItem = ({ chat, onSelectChat, currentUserUid }: { chat: Chat, onSelectChat: (user: UserProfile) => void, currentUserUid: string }) => {
  const otherParticipantUid = chat.participants.find(p => p !== currentUserUid);
  if (!otherParticipantUid) return null;

  const otherParticipantProfile = chat.participantProfiles[otherParticipantUid];
  if (!otherParticipantProfile) return null;

  const unreadMessages = chat.unreadCount?.[currentUserUid] || 0;

  const formatLastMessageTimestamp = () => {
    if (!chat.lastMessage?.createdAt) return '';
    return formatDistanceToNowStrict(chat.lastMessage.createdAt.toDate(), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  return (
    <div
      onClick={() => onSelectChat(otherParticipantProfile)}
      className="w-full flex items-center gap-3 p-4 border-b border-secondary/50 hover:bg-secondary cursor-pointer transition-colors"
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
          <UserIcon className="text-text-muted" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-text truncate">{otherParticipantProfile.displayName}</h3>
          {chat.lastMessage && (
            <span className="text-xs text-text-muted flex-shrink-0 ml-2">
              {formatLastMessageTimestamp()}
            </span>
          )}
        </div>
        <div className="flex justify-between items-start mt-1">
          <p className={`text-sm truncate ${unreadMessages > 0 ? 'text-text font-semibold' : 'text-text-muted'}`}>
            {chat.lastMessage?.text || 'Inicie a conversa!'}
          </p>
          {unreadMessages > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-accent text-background text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2"
            >
              {unreadMessages}
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Sidebar({ onSelectChat }: { onSelectChat: (user: UserProfile) => void }) {
  const { user: currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    if (!currentUser || currentUser.uid !== ADMIN_UID) {
      setLoading(false);
      return;
    };

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid), orderBy('lastMessage.createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsDataPromises = snapshot.docs.map(async (docData) => {
        const chat = { id: docData.id, ...docData.data() } as Omit<Chat, 'participantProfiles'>;
        
        const participantProfiles: { [key: string]: UserProfile } = {};
        for (const uid of chat.participants) {
          // Evita buscar o próprio perfil do admin repetidamente se já o tivermos
          if (uid === currentUser.uid) {
            // Pode ser útil ter os dados do usuário atual à mão
            // participantProfiles[uid] = { uid: currentUser.uid, displayName: currentUser.displayName || '', email: currentUser.email || '', userType: 'admin', createdAt: Timestamp.now() };
            continue;
          }
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            participantProfiles[uid] = userDoc.data() as UserProfile;
          }
        }
        return { ...chat, participantProfiles } as Chat;
      });
      
      const chatsData = await Promise.all(chatsDataPromises);
      setChats(chatsData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar conversas:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  return (
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
        {loading && (
          <div className="flex items-center justify-center p-8 text-text-muted">
            <Loader2 className="animate-spin mr-2" /> Carregando conversas...
          </div>
        )}
        {!loading && chats.length === 0 && (
          <div className="p-8 text-center text-text-muted flex flex-col items-center gap-4">
            <MessageSquareText size={40} />
            <p>Nenhuma conversa foi iniciada ainda.</p>
          </div>
        )}
        
        <AnimatePresence>
          {chats.map(chat => (
             <motion.div
              key={chat.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ChatListItem chat={chat} onSelectChat={onSelectChat} currentUserUid={currentUser!.uid} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}