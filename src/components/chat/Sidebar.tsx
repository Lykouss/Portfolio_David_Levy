// src/components/chat/Sidebar.tsx
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types'; // 1. Importando nosso novo tipo

const ADMIN_UID = "CPfFfTlIlGTEbrSm5MfmHJtePTE2"; // Lembre-se de colocar seu UID

// 2. Usando o tipo UserProfile nas props e no estado
export default function Sidebar({ onSelectChat }: { onSelectChat: (user: UserProfile) => void }) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="h-full overflow-y-auto bg-primary">
      <div className="p-4 border-b border-secondary">
        <h2 className="font-title text-xl">Conversas</h2>
      </div>
      <ul>
        {users.map(user => (
          <li
            key={user.uid}
            onClick={() => onSelectChat(user)}
            className="p-4 border-b border-secondary hover:bg-secondary cursor-pointer transition-colors duration-200"
          >
            <p className="font-bold text-text truncate">{user.displayName}</p>
            <p className="text-sm text-text-muted truncate">
              {user.userType === 'recruiter' ? `Empresa: ${user.company || 'Não informado'}` : `Projeto: ${user.project || 'Não informado'}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}