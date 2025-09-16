// src/components/chat/Sidebar.tsx
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types'; 
import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';

const ADMIN_UID = "CPfFfTlIlGTEbrSm5MfmHJtePTE2"; // Lembre-se de colocar seu UID

// 2. Usando o tipo UserProfile nas props e no estado
export default function Sidebar({ onSelectChat }: { onSelectChat: (user: UserProfile) => void }) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    if (!currentUser) return;

    const usersRef = collection(db, 'users');
    let q;

    if (currentUser.uid === ADMIN_UID) {
      // Ordena os usuários mais recentes primeiro
      q = query(usersRef, where('uid', '!=', ADMIN_UID), orderBy('createdAt', 'desc'));
    } else {
      q = query(usersRef, where('uid', '==', ADMIN_UID));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Garantimos que os dados correspondem ao nosso tipo UserProfile
      const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <div className="p-4 text-text-muted">Carregando contatos...</div>;
  }
  
  if (users.length === 0) {
    return <div className="p-4 text-text-muted">Nenhum contato encontrado.</div>
  }

  const getUserSubtitle = (user: UserProfile) => {
    if (user.userType === 'admin') return 'Proprietário';
    if (user.userType === 'recruiter') return `Empresa: ${user.company || 'Não informado'}`;
    return `Projeto: ${user.project || 'Não informado'}`;
  };

  return (
    <div className="h-full flex flex-col bg-primary">
      <div className="p-4 border-b border-secondary flex justify-between items-center">
        <h2 className="font-title text-xl">Conversas</h2>
        <button onClick={handleLogout} title="Sair da conta" className="text-text-muted hover:text-accent transition-colors">
          <LogOut size={20} />
        </button>
      </div>
      <ul className="flex-grow overflow-y-auto">
        {users.map(user => (
          <li
            key={user.uid}
            onClick={() => onSelectChat(user)}
            className="p-4 border-b border-secondary hover:bg-secondary cursor-pointer transition-colors duration-200"
          >
            <p className="font-bold text-text truncate">{user.displayName}</p>
            <p className="text-sm text-text-muted truncate">
              {getUserSubtitle(user)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}