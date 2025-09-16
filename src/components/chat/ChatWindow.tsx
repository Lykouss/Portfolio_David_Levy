// src/components/chat/ChatWindow.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
// 1. Importar o tipo Timestamp
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, writeBatch, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, ChatMessage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface ChatWindowProps {
  selectedUser: UserProfile;
  onBack: () => void;
}

export default function ChatWindow({ selectedUser, onBack }: ChatWindowProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // 2. Corrigido o 'any' para o tipo 'Timestamp'
  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), 'HH:mm');
  };
  
  // ... (useEffect para buscar mensagens permanece o mesmo) ...
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];
      setMessages(fetchedMessages);

      const unreadMessagesQuery = query(messagesRef, where('senderId', '==', selectedUser.uid), where('isRead', '==', false));
      const unreadSnapshot = await getDocs(unreadMessagesQuery);
      if (!unreadSnapshot.empty) {
        const batch = writeBatch(db);
        unreadSnapshot.docs.forEach(doc => {
          batch.update(doc.ref, { isRead: true });
        });
        await batch.commit();
      }
    });

    return () => unsubscribe();
  }, [currentUser, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
      isRead: false,
    });

    setNewMessage("");
  };

  if (!selectedUser) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* ... (código do cabeçalho, lista de mensagens e formulário permanece o mesmo) ... */}
      <div className="p-4 border-b border-secondary flex items-center gap-4 flex-shrink-0">
        <button onClick={onBack} className="md:hidden text-text-muted hover:text-accent">
          <ArrowLeft />
        </button>
        <h2 className="font-title text-xl font-bold">{selectedUser.displayName}</h2>
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
                  <div className="flex-shrink-0 text-xs opacity-70">
                    {msg.createdAt && formatTimestamp(msg.createdAt)}
                    {isSentByMe && (msg.isRead ? <CheckCheck size={16} className="inline-block ml-1"/> : <Check size={16} className="inline-block ml-1"/>)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-secondary flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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