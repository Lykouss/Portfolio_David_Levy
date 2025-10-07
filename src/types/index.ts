// src/types/index.ts
import { Timestamp } from "firebase/firestore";

// Representa o perfil de um usuário
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  userType: 'recruiter' | 'client' | 'admin';
  company?: string;
  project?: string;
  createdAt: Timestamp;
}

// Representa uma única mensagem dentro de um chat
export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp;
  isRead: boolean;
}

// Representa o status de presença de um usuário no Realtime Database
export interface PresenceStatus {
  isOnline: boolean;
  lastSeen?: number; // Usaremos um timestamp numérico do RTDB
}

// Representa um documento de chat na coleção 'chats'
export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    text: string;
    createdAt: Timestamp;
    senderId: string;
  };
  unreadCount: {
    [key: string]: number; // ex: { uid1: 0, uid2: 3 }
  };
  // Adicionamos os perfis dos participantes para facilitar o acesso
  participantProfiles: {
    [key: string]: UserProfile;
  };
}