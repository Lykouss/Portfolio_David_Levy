// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Importa nossa instância do Firebase Auth

// Define a "forma" do nosso contexto
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

// Cria o contexto com um valor padrão
const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

// Cria o "Provedor" que irá envolver nossa aplicação de chat
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // O onAuthStateChanged é um "ouvinte" do Firebase que nos diz
    // se o usuário está logado, deslogado ou se o estado mudou.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Limpa o ouvinte quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Cria um "hook" customizado para facilitar o uso do contexto
export const useAuth = () => useContext(AuthContext);