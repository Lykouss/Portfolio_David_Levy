// src/components/chat/AuthScreen.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const GoogleIcon = () => ( <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.92C34.553 6.184 29.623 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l6.54-6.6C34.553 6.184 29.623 4 24 4C16.633 4 10.158 8.121 6.306 14.691z"></path><path fill="#4CAF50" d="m24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025A20.01 20.01 0 0 0 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.417 44 30.632 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg> );

export default function AuthScreen() {
  const [userType, setUserType] = useState<"recruiter" | "client" | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [error, setError] = useState("");

  const saveUserData = async (user: User, additionalData: object) => {
    const userRef = doc(db, "users", user.uid);
    const dataToSave = {
      uid: user.uid,
      email: user.email,
      displayName: name || user.displayName,
      createdAt: serverTimestamp(),
      ...additionalData,
    };
    await setDoc(userRef, dataToSave, { merge: true });
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setError("");
    const additionalData = userType === 'recruiter' ? { userType, company } : { userType, project };

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserData(userCredential.user, additionalData);
      }
    } catch (err: unknown) { // **CORREÇÃO 1: 'any' trocado por 'unknown'**
      console.error("Erro na autenticação por e-mail:", err);
      if (err instanceof Error) {
        // Mapeia erros do Firebase para mensagens amigáveis
        if (err.message.includes("auth/invalid-credential")) {
            setError("E-mail ou senha inválidos.");
        } else if (err.message.includes("auth/email-already-in-use")) {
            setError("Este e-mail já está em uso. Tente fazer login.");
        } else {
            setError("Ocorreu um erro. Verifique os dados e tente novamente.");
        }
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!name) { // Simplificado para pedir o nome sempre
        setError("Por favor, preencha seu nome antes de continuar.");
        return;
    }
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const additionalData = userType === 'recruiter' ? { userType, company } : { userType, project };
      await saveUserData(result.user, additionalData);
    } catch (err: unknown) { // **CORREÇÃO 2: Adicionado log do erro e tipo 'unknown'**
      console.error("Erro no login com Google:", err);
      setError("Falha ao entrar com Google. Tente novamente.");
    }
  };

  // Primeira tela: Seleção de Perfil
  if (!userType) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-title text-4xl text-center mb-2">Bem-vindo ao Chat</h1>
          <p className="text-text-muted text-center mb-8">Para começar, identifique-se:</p>
        </motion.div>
        <div className="flex flex-col sm:flex-row gap-6">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
            onClick={() => setUserType("recruiter")}
            className="bg-primary p-8 rounded-lg border border-secondary text-center w-64 sm:w-48"
          >
            <span className="text-5xl">💼</span>
            <h2 className="font-title text-xl mt-4">Sou Recrutador</h2>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
            onClick={() => setUserType("client")}
            className="bg-primary p-8 rounded-lg border border-secondary text-center w-64 sm:w-48"
          >
            <span className="text-5xl">💡</span>
            <h2 className="font-title text-xl mt-4">Tenho um Projeto</h2>
          </motion.button>
        </div>
      </div>
    );
  }

  // Segunda tela: Formulário de Login/Registro
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          key={userType}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-primary p-8 rounded-lg border border-secondary"
        >
          <button onClick={() => setUserType(null)} className="text-sm text-text-muted hover:text-text mb-4">&larr; Voltar</button>
          <h2 className="font-title text-3xl mb-2 text-center">
            {isLogin ? "Entrar" : "Criar Conta"}
          </h2>
          <p className="text-center text-text-muted mb-6 text-sm">
            Como <span className="font-bold text-accent">{userType === 'recruiter' ? 'Recrutador' : 'Cliente'}</span>
          </p>
          
          <form onSubmit={handleAuthAction} className="space-y-4">
            {!isLogin && (<input type="text" placeholder="*Seu nome completo" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" required />)}
            { isLogin && (<input type="text" placeholder="*Seu nome (para o Google)" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" required />)}

            {userType === "recruiter" && <input type="text" placeholder="Nome da empresa (opcional)" value={company} onChange={e => setCompany(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" />}
            {userType === "client" && <input type="text" placeholder="Nome do seu projeto (opcional)" value={project} onChange={e => setProject(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" />}

            <div className="flex items-center gap-2 pt-4">
                <hr className="w-full border-secondary"/><span className="text-text-muted text-xs">LOGIN</span><hr className="w-full border-secondary"/>
            </div>

            <button type="button" onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold p-3 rounded-md hover:bg-gray-200 transition-colors">
                <GoogleIcon /> Continuar com Google
            </button>

            <input type="email" placeholder="*E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" required />
            <input type="password" placeholder="*Senha (mínimo 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" required />
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button type="submit" className="w-full bg-accent text-background font-bold p-3 rounded-md hover:bg-accent-hover transition-colors">
              {isLogin ? "Entrar" : "Criar Conta"}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
            <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="font-semibold text-accent hover:underline ml-1">
              {isLogin ? "Registre-se" : "Entre"}
            </button>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}