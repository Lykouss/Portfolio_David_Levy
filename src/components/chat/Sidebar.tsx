// src/components/chat/Sidebar.tsx
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types';
import { signOut } from 'firebase/auth';
import { LogOut, User as UserIcon, Home } from 'lucide-react';
import Link from 'next/link';

// SEU UID DE ADMIN PRECISA DE ESTAR AQUI
const ADMIN_UID = "CPfFfTlIlGTEbrSm5MfmHJtePTE2";

export default function Sidebar({ onSelectChat }: { onSelectChat: (user: UserProfile) => void }) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    if (!currentUser) return;

    // Lógica Híbrida e Funcional:
    const usersRef = collection(db, 'users');
    let q;

    // Se for o admin, busca todos os outros utilizadores.
    if (currentUser.uid === ADMIN_UID) {
      q = query(usersRef, where('uid', '!=', ADMIN_UID), orderBy('createdAt', 'desc'));
    } 
    // Se for um visitante, busca APENAS o perfil do admin para poder iniciar a conversa.
    else {
      q = query(usersRef, where('uid', '==', ADMIN_UID));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar utilizadores:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const getUserSubtitle = (user: UserProfile) => {
    if (user.uid === ADMIN_UID || user.userType === 'admin') return 'Proprietário';
    if (user.userType === 'recruiter') return `Empresa: ${user.company || 'Não informado'}`;
    return `Projeto: ${user.project || 'Não informado'}`;
  };

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
        {loading && <p className="p-4 text-text-muted">A carregar...</p>}
        {!loading && users.length === 0 && (
          <p className="p-4 text-text-muted">
            {currentUser?.uid === ADMIN_UID ? "Nenhum utilizador registado ainda." : "Não foi possível carregar o contato."}
          </p>
        )}
        
        {users.map(user => (
          <div
            key={user.uid}
            onClick={() => onSelectChat(user)}
            className="w-full flex items-center gap-3 p-4 border-b border-secondary/50 hover:bg-secondary cursor-pointer transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <UserIcon className="text-text-muted" />
              </div>
            </div>
            {/* Layout Corrigido e Final */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-text truncate">{user.displayName}</h3>
              <p className="text-sm text-text-muted truncate">{getUserSubtitle(user)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}