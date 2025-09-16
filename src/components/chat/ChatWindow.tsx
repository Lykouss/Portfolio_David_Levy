// src/components/chat/ChatWindow.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, writeBatch, where, getDocs, Timestamp, doc, setDoc, increment, getDoc } from 'firebase/firestore';
import { ref, onValue, set, onDisconnect, serverTimestamp as rtdbServerTimestamp } from "firebase/database";
import { db, rtdb } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, ChatMessage, PresenceStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatWindowProps {
  selectedUser: UserProfile;
  onBack: () => void;
}

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

const formatLastSeen = (timestamp: number | undefined): string => {
  if (!timestamp) return "Offline";
  const date = new Date(timestamp);
  if (isToday(date)) {
    return `Visto por último hoje às ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `Visto por último ontem às ${format(date, 'HH:mm')}`;
  }
  return `Visto por último em ${format(date, 'dd/MM/yy HH:mm', { locale: ptBR })}`;
};

export default function ChatWindow({ selectedUser, onBack }: ChatWindowProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const presenceStatus = usePresence(selectedUser?.uid);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), 'HH:mm');
  };

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ChatMessage[];
      setMessages(fetchedMessages);

      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      if (chatSnap.exists()) {
        await setDoc(chatRef, { unreadCount: { [currentUser.uid]: 0 } }, { merge: true });
      }

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
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const typingRef = ref(rtdb, `/typing/${chatId}/${selectedUser.uid}`);
    const unsubscribe = onValue(typingRef, (snap) => {
      setIsTyping(snap.val()?.isTyping || false);
    });
    return () => unsubscribe();
  }, [currentUser, selectedUser]);
  
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!currentUser) return;
    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const typingRef = ref(rtdb, `/typing/${chatId}/${currentUser.uid}`);
    set(typingRef, { isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => set(typingRef, { isTyping: false }), 2000);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser) return;

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

    batch.set(chatRef, {
      participants: [currentUser.uid, selectedUser.uid],
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


  if (!selectedUser) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-secondary flex items-center gap-4 flex-shrink-0">
        <button onClick={onBack} className="md:hidden text-text-muted hover:text-accent">
          <ArrowLeft />
        </button>
        <div>
          <h2 className="font-title text-xl font-bold">{selectedUser.displayName}</h2>
          <div className="flex items-center gap-2 text-xs text-text-muted h-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={presenceStatus.isOnline ? 'online' : 'offline'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                {presenceStatus.isOnline ? (
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

      <div className="flex-grow p-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((msg) => {
            const isSentByMe = msg.senderId === currentUser?.uid;
            return (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex mb-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md py-2 px-3 rounded-lg flex items-end gap-2 ${isSentByMe ? 'bg-accent text-background' : 'bg-primary'}`}>
                  <p className="break-words">{msg.text}</p>
                  <div className="flex-shrink-0 text-xs opacity-70 flex items-center">
                    {msg.createdAt && formatTimestamp(msg.createdAt)}
                    {isSentByMe && (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={msg.isRead ? 'read' : 'sent'}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {msg.isRead ? <CheckCheck size={16} className="inline-block ml-1 text-blue-400"/> : <Check size={16} className="inline-block ml-1"/>}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="p-3 rounded-lg bg-primary text-sm text-text-muted">Digitando...</div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-secondary flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Digite sua mensagem..."
            className="flex-grow p-3 bg-primary border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button type="submit" className="bg-accent text-background p-3 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50" disabled={!newMessage.trim()}>
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
}