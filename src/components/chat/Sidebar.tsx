// src/components/chat/Sidebar.tsx
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, Chat } from '@/types'; // Importamos o novo tipo 'Chat'
import { signOut } from 'firebase/auth';
import { LogOut, User as UserIcon, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';

// SEU UID DE ADMIN PRECISA DE ESTAR AQUI
const ADMIN_UID = "CPfFfTlIlGTEbrSm5MfmHJtePTE2";

// Novo componente para cada item da lista de chat
const ChatListItem = ({ chat, onSelectChat, currentUserUid }: { chat: Chat, onSelectChat: (user: UserProfile) => void, currentUserUid: string }) => {
  // Encontra o outro participante da conversa
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
        {/* Futuramente, aqui podemos adicionar o status online */}
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
          <p className={`text-sm truncate ${unreadMessages > 0 ? 'text-text' : 'text-text-muted'}`}>
            {chat.lastMessage?.text || 'Nenhuma mensagem ainda.'}
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
    if (!currentUser) return;

    // Se o usuário NÃO for o admin, busca apenas o perfil do admin para iniciar a conversa
    if (currentUser.uid !== ADMIN_UID) {
      const getAdminProfile = async () => {
        const adminDoc = await getDoc(doc(db, 'users', ADMIN_UID));
        if (adminDoc.exists()) {
          onSelectChat(adminDoc.data() as UserProfile); // Abre o chat com o admin diretamente
        } else {
          console.error("Perfil do admin não encontrado.");
        }
        setLoading(false);
      };
      getAdminProfile();
      return; // Encerra o useEffect aqui para não buscar outras conversas
    }

    // Se o usuário FOR o admin, busca todas as conversas em que ele participa
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid), orderBy('lastMessage.createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = await Promise.all(snapshot.docs.map(async (docData) => {
        const chat = { id: docData.id, ...docData.data() } as Omit<Chat, 'participantProfiles'>;
        
        // Busca os perfis de cada participante
        const participantProfiles: { [key: string]: UserProfile } = {};
        for (const uid of chat.participants) {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            participantProfiles[uid] = userDoc.data() as UserProfile;
          }
        }
        
        return { ...chat, participantProfiles } as Chat;
      }));
      
      setChats(chatsData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar conversas:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser, onSelectChat]);


  // Se não for admin, a sidebar fica vazia (ou mostra uma tela de carregamento)
  // pois o chat já foi aberto diretamente
  if (currentUser && currentUser.uid !== ADMIN_UID) {
    return (
      <div className="h-full w-full flex flex-col bg-primary items-center justify-center text-text-muted">
         <Loader2 className="animate-spin" size={24} />
         <p className="mt-2">Carregando...</p>
      </div>
    );
  }

  // Renderização da sidebar para o ADMIN
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
          <p className="p-4 text-center text-text-muted">
            Nenhuma conversa foi iniciada ainda.
          </p>
        )}
        
        <AnimatePresence>
          {chats.map(chat => (
             <motion.div
              key={chat.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ChatListItem chat={chat} onSelectChat={onSelectChat} currentUserUid={currentUser!.uid} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}