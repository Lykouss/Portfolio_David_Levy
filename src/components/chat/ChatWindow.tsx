// src/components/chat/ChatWindow.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, writeBatch, where, getDocs, Timestamp, doc, setDoc, increment, getDoc } from 'firebase/firestore';
import { ref, onValue, set, onDisconnect, serverTimestamp as rtdbServerTimestamp } from "firebase/database";
import { db, rtdb } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, ChatMessage, PresenceStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Check, CheckCheck, Loader2 } from 'lucide-react';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatWindowProps {
  selectedUser: UserProfile;
  onBack: () => void;
}

// Hook para verificar a presença do usuário (online/offline)
const usePresence = (uid: string | undefined): PresenceStatus => {
  const [status, setStatus] = useState<PresenceStatus>({ isOnline: false });
  useEffect(() => {
    if (!uid) return;
    const userStatusRef = ref(rtdb, `/status/${uid}`);
    const unsubscribe = onValue(userStatusRef, (snapshot) => {
      setStatus(snapshot.val() || { isOnline: false });
    });
    return () => unsubscribe();
  }, [uid]);
  return status;
};

// Formata o "visto por último"
const formatLastSeen = (timestamp: number | undefined): string => {
  if (!timestamp) return "Offline";
  const date = new Date(timestamp);
  if (isToday(date)) {
    return `visto por último hoje às ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `visto por último ontem às ${format(date, 'HH:mm')}`;
  }
  return `visto por último em ${format(date, 'dd/MM/yy HH:mm', { locale: ptBR })}`;
};

export default function ChatWindow({ selectedUser, onBack }: ChatWindowProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const presenceStatus = usePresence(selectedUser?.uid);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Efeito para registrar a presença do usuário atual
  useEffect(() => {
    if (!currentUser) return;
    const userStatusRef = ref(rtdb, `/status/${currentUser.uid}`);
    const connectedRef = ref(rtdb, '.info/connected');

    const unsubscribe = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(userStatusRef, { isOnline: true, lastSeen: rtdbServerTimestamp() });
        onDisconnect(userStatusRef).set({ isOnline: false, lastSeen: rtdbServerTimestamp() });
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Efeito principal para buscar mensagens e marcar como lidas
  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    setLoading(true);

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ChatMessage[];
      setMessages(fetchedMessages);
      setLoading(false);

      // Lógica para marcar mensagens como lidas
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, { unreadCount: { [currentUser.uid]: 0 } }, { merge: true });

      const unreadMessagesQuery = query(messagesRef, where('senderId', '==', selectedUser.uid), where('isRead', '==', false));
      const unreadSnapshot = await getDocs(unreadMessagesQuery);

      if (!unreadSnapshot.empty) {
        const batch = writeBatch(db);
        unreadSnapshot.docs.forEach(doc => batch.update(doc.ref, { isRead: true }));
        await batch.commit();
      }
    });
    return () => unsubscribe();
  }, [currentUser, selectedUser]);

  // Scroll para o final da conversa
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Efeito para ouvir o status "digitando" do outro usuário
  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const typingRef = ref(rtdb, `/typing/${chatId}/${selectedUser.uid}`);
    const unsubscribe = onValue(typingRef, (snap) => {
      setIsTyping(snap.val()?.isTyping || false);
    });
    return () => unsubscribe();
  }, [currentUser, selectedUser]);
  
  // Lida com a atualização do status "digitando" do usuário atual
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!currentUser || !selectedUser) return;
    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const typingRef = ref(rtdb, `/typing/${chatId}/${currentUser.uid}`);
    
    // Se não estiver digitando, envia o status
    if (e.target.value.length > 0 && !typingTimeoutRef.current) {
        set(typingRef, { isTyping: true });
    }

    // Limpa o timeout anterior e cria um novo
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
        set(typingRef, { isTyping: false });
        typingTimeoutRef.current = null;
    }, 2000);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser || !selectedUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);
    const messagesRef = collection(chatRef, 'messages');
    
    const batch = writeBatch(db);

    const newMessageRef = doc(messagesRef);
    batch.set(newMessageRef, {
      text: newMessage,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
      isRead: false,
    });
    
    // Atualiza o documento principal do chat
    batch.set(chatRef, {
      participants: [currentUser.uid, selectedUser.uid],
      participantProfiles: { // Garante que os perfis estejam no doc do chat
        [currentUser.uid]: { displayName: currentUser.displayName, email: currentUser.email },
        [selectedUser.uid]: { displayName: selectedUser.displayName, email: selectedUser.email },
      },
      lastMessage: {
        text: newMessage,
        createdAt: serverTimestamp(),
        senderId: currentUser.uid,
      },
      unreadCount: {
        [selectedUser.uid]: increment(1)
      }
    }, { merge: true });

    await batch.commit();
    
    setNewMessage("");
    const typingRef = ref(rtdb, `/typing/${chatId}/${currentUser.uid}`);
    set(typingRef, { isTyping: false });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), 'HH:mm');
  };

  if (!selectedUser) return null;

  let lastMessageDate: Date | null = null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Cabeçalho */}
      <div className="p-4 border-b border-secondary flex items-center gap-4 flex-shrink-0">
        <button onClick={onBack} className="md:hidden text-text-muted hover:text-accent">
          <ArrowLeft />
        </button>
        <div>
          <h2 className="font-title text-xl font-bold">{selectedUser.displayName}</h2>
          <div className="flex items-center gap-2 text-xs text-text-muted h-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={presenceStatus.isOnline ? 'online' : (presenceStatus.lastSeen || 'offline')}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                {isTyping ? (
                    <span className="text-accent">digitando...</span>
                ) : presenceStatus.isOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Online
                  </>
                ) : (
                  formatLastSeen(presenceStatus.lastSeen)
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Corpo das Mensagens */}
      <div className="flex-grow p-4 overflow-y-auto">
        {loading ? (
            <div className="flex justify-center items-center h-full text-text-muted">
                <Loader2 className="animate-spin" size={24} />
            </div>
        ) : (
            <AnimatePresence>
              {messages.map((msg, index) => {
                const isSentByMe = msg.senderId === currentUser?.uid;
                const msgDate = msg.createdAt?.toDate();
                let dateSeparator = null;

                if (msgDate && (!lastMessageDate || !isSameDay(lastMessageDate, msgDate))) {
                    lastMessageDate = msgDate;
                    dateSeparator = (
                        <motion.div layout initial={{ opacity: 0}} animate={{ opacity: 1 }} className="text-center my-4">
                            <span className="bg-primary px-3 py-1 text-xs text-text-muted rounded-full">
                                {isToday(msgDate) ? 'Hoje' : isYesterday(msgDate) ? 'Ontem' : format(msgDate, "dd 'de' MMMM", { locale: ptBR })}
                            </span>
                        </motion.div>
                    );
                }

                return (
                  <div key={msg.id}>
                    {dateSeparator}
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex mb-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs md:max-w-md py-2 px-3 rounded-lg flex items-end gap-2 ${isSentByMe ? 'bg-accent text-background' : 'bg-primary'}`}>
                        <p className="break-words">{msg.text}</p>
                        <div className="flex-shrink-0 text-xs opacity-70 flex items-center" style={{ color: isSentByMe ? 'rgba(255,255,255,0.7)' : '' }}>
                          {formatTimestamp(msg.createdAt)}
                          {isSentByMe && (
                              <motion.div layout className="ml-1">
                                {msg.isRead ? <CheckCheck size={16} className="text-blue-400"/> : <Check size={16} />}
                              </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input de Mensagem */}
      <div className="p-4 border-t border-secondary flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Digite sua mensagem..."
            className="flex-grow p-3 bg-primary border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          />
          <motion.button 
            type="submit" 
            className="bg-accent text-background p-3 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:scale-100" 
            disabled={!newMessage.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send />
          </motion.button>
        </form>
      </div>
    </div>
  );
}