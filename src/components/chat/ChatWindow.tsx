// src/components/chat/ChatWindow.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, ChatMessage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

export default function ChatWindow({ selectedUser }: { selectedUser: UserProfile }) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Efeito para buscar as mensagens em tempo real
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    // Cria um ID de chat consistente, ordenando os UIDs
    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [currentUser, selectedUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  if (!selectedUser) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Cabeçalho da Janela de Chat */}
      <div className="p-4 border-b border-secondary flex items-center gap-4">
        <h2 className="font-title text-xl font-bold">{selectedUser.displayName}</h2>
      </div>

      {/* Lista de Mensagens */}
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
                exit={{ opacity: 0, x: -20 }}
                className={`flex mb-4 ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isSentByMe ? 'bg-accent text-background' : 'bg-primary'}`}>
                  <p>{msg.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Formulário de Envio */}
      <div className="p-4 border-t border-secondary">
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