// src/types/index.ts
import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  userType: 'recruiter' | 'client' | 'admin';
  company?: string;
  project?: string;
  createdAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp;
  isRead: boolean;
}

export interface PresenceStatus {
  isOnline: boolean;
  lastSeen?: number; // Usaremos um timestamp numérico do RTDB
}

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
}