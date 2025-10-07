// src/components/chat/AuthScreen.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ArrowLeft } from "lucide-react";

// --- Ícones ---
const GoogleIcon = () => ( <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.92C34.553 6.184 29.623 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l6.54-6.6C34.553 6.184 29.623 4 24 4C16.633 4 10.158 8.121 6.306 14.691z"></path><path fill="#4CAF50" d="m24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025A20.01 20.01 0 0 0 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.417 44 30.632 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg> );

// --- Tipos e Estados ---
type UserType = 'recruiter' | 'client';
type AuthStep = 'userType' | 'method' | 'emailForm' | 'profileCompletion';

// --- Animações ---
const variants = {
  hidden: { opacity: 0, x: 200 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -200 },
};

export default function AuthScreen() {
  const [step, setStep] = useState<AuthStep>('userType');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  
  // Dados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [error, setError] = useState("");

  // Guarda o usuário do Google temporariamente antes de salvar o perfil
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  const handleSetUserType = (type: UserType) => {
    setUserType(type);
    setStep('method');
  };

  const goBack = () => {
    setError("");
    if (step === 'profileCompletion') setStep('method');
    else if (step === 'emailForm') setStep('method');
    else if (step === 'method') setStep('userType');
  };
  
  // Função para salvar dados do usuário no Firestore
  const saveUserData = async (user: User, additionalData: object) => {
    const userRef = doc(db, "users", user.uid);
    const dataToSave = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || name,
      createdAt: serverTimestamp(),
      ...additionalData,
    };
    await setDoc(userRef, dataToSave, { merge: true });
  };

  // Lógica para login com Google
  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);

      // Se o usuário já existe no Firestore, o login está completo.
      if (userSnap.exists()) {
        // O onAuthStateChanged cuidará do resto
        return; 
      }
      
      // Se for um novo usuário, guarda os dados e avança para completar o perfil
      setGoogleUser(result.user);
      setStep('profileCompletion');

    } catch (err) {
      console.error("Erro no login com Google:", err);
      setError("Falha ao entrar com Google. Tente novamente.");
    }
  };
  
  // Lógica para formulário de completar perfil (pós-Google)
  const handleProfileCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser || !name) {
      setError("Por favor, preencha seu nome.");
      return;
    }
    setError("");
    const additionalData = userType === 'recruiter' ? { userType, company } : { userType, project };
    try {
      await saveUserData(googleUser, { ...additionalData, displayName: name });
    } catch (err) {
      console.error("Erro ao salvar dados do perfil:", err);
      setError("Não foi possível salvar seu perfil. Tente novamente.");
    }
  };


  // Lógica para autenticação com Email/Senha
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setError("");
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const additionalData = userType === 'recruiter' ? { userType, company } : { userType, project };
        await saveUserData(userCredential.user, additionalData);
      }
    } catch (err: unknown) {
      console.error("Erro na autenticação por e-mail:", err);
      if (err instanceof Error) {
        if (err.message.includes("auth/invalid-credential") || err.message.includes("auth/wrong-password")) {
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


  // --- Renderização dos Componentes de Etapa ---

  const renderUserTypeStep = () => (
    <motion.div key="userType" variants={variants} initial="hidden" animate="visible" exit="exit" className="text-center">
      <h1 className="font-title text-4xl mb-2">Bem-vindo ao Chat</h1>
      <p className="text-text-muted mb-8">Para começar, identifique-se:</p>
      <div className="flex flex-col sm:flex-row gap-6">
        <motion.button whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} onClick={() => handleSetUserType("recruiter")} className="bg-primary p-8 rounded-lg border border-secondary text-center w-64 sm:w-48">
          <span className="text-5xl">💼</span>
          <h2 className="font-title text-xl mt-4">Sou Recrutador</h2>
        </motion.button>
        <motion.button whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} onClick={() => handleSetUserType("client")} className="bg-primary p-8 rounded-lg border border-secondary text-center w-64 sm:w-48">
          <span className="text-5xl">💡</span>
          <h2 className="font-title text-xl mt-4">Tenho um Projeto</h2>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderMethodStep = () => (
    <motion.div key="method" variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-sm">
      <button onClick={goBack} className="text-sm text-text-muted hover:text-text mb-4 flex items-center gap-2"><ArrowLeft size={16}/> Voltar</button>
      <div className="bg-primary p-8 rounded-lg border border-secondary text-center">
          <h2 className="font-title text-3xl mb-6">Como deseja entrar?</h2>
          <div className="space-y-4">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold p-3 rounded-md hover:bg-gray-200 transition-colors">
                  <GoogleIcon /> Continuar com Google
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => setStep('emailForm')} className="w-full bg-secondary text-text font-semibold p-3 rounded-md hover:bg-opacity-80 transition-colors">
                  Continuar com E-mail
              </motion.button>
          </div>
      </div>
    </motion.div>
  );
  
  const renderEmailFormStep = () => (
    <motion.div key="emailForm" variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-sm">
        <button onClick={goBack} className="text-sm text-text-muted hover:text-text mb-4 flex items-center gap-2"><ArrowLeft size={16}/> Voltar</button>
        <div className="bg-primary p-8 rounded-lg border border-secondary">
          <h2 className="font-title text-3xl mb-2 text-center">{isLogin ? "Entrar" : "Criar Conta"}</h2>
          <p className="text-center text-text-muted mb-6 text-sm">
            Como <span className="font-bold text-accent">{userType === 'recruiter' ? 'Recrutador' : 'Cliente'}</span>
          </p>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (<input type="text" placeholder="*Seu nome completo" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" required />)}
            {userType === "recruiter" && !isLogin && <input type="text" placeholder="Nome da empresa (opcional)" value={company} onChange={e => setCompany(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" />}
            {userType === "client" && !isLogin && <input type="text" placeholder="Nome do seu projeto (opcional)" value={project} onChange={e => setProject(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" />}

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
        </div>
    </motion.div>
  );

  const renderProfileCompletionStep = () => (
    <motion.div key="profileCompletion" variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-sm">
      <button onClick={goBack} className="text-sm text-text-muted hover:text-text mb-4 flex items-center gap-2"><ArrowLeft size={16}/> Voltar</button>
      <div className="bg-primary p-8 rounded-lg border border-secondary">
        <h2 className="font-title text-3xl mb-2 text-center">Complete seu Perfil</h2>
        <p className="text-center text-text-muted mb-6 text-sm">
          Falta pouco! Só precisamos de mais algumas informações.
        </p>
        <form onSubmit={handleProfileCompletion} className="space-y-4">
          <input type="text" placeholder="*Seu nome completo" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" required />
          {userType === "recruiter" && <input type="text" placeholder="Nome da empresa (opcional)" value={company} onChange={e => setCompany(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" />}
          {userType === "client" && <input type="text" placeholder="Nome do seu projeto (opcional)" value={project} onChange={e => setProject(e.target.value)} className="w-full p-3 bg-background border border-secondary rounded-md" />}
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button type="submit" className="w-full bg-accent text-background font-bold p-3 rounded-md hover:bg-accent-hover transition-colors">
            Concluir e Entrar
          </button>
        </form>
      </div>
    </motion.div>
  );


  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'userType' && renderUserTypeStep()}
        {step === 'method' && renderMethodStep()}
        {step === 'emailForm' && renderEmailFormStep()}
        {step === 'profileCompletion' && renderProfileCompletionStep()}
      </AnimatePresence>
    </div>
  );
}