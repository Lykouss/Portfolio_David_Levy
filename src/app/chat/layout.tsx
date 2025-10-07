// src/app/chat/layout.tsx
"use client"; // Necessário para usar hooks (useEffect)

import { useEffect } from 'react';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Esta função ajusta a altura do nosso contêiner principal
    // para ser exatamente igual à altura da área visível na tela.
    const setViewportHeight = () => {
      // Usamos window.innerHeight, que é mais confiável em dispositivos móveis
      // para obter a altura que considera o teclado e a barra de endereço.
      const vh = window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Ajusta a altura assim que o componente é montado
    setViewportHeight();

    // Adiciona um "ouvinte" que reajusta a altura sempre que a janela muda de tamanho
    // (por exemplo, quando o teclado aparece/desaparece ou o celular é girado)
    window.addEventListener('resize', setViewportHeight);

    // Limpa o "ouvinte" quando o componente é desmontado para evitar vazamentos de memória
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  return (
    // Agora, em vez de 'h-screen' ou 'h-full', usamos nossa variável CSS '--vh'.
    // A sintaxe 'h-[var(--vh)]' é como o TailwindCSS usa variáveis customizadas.
    <div
      className="h-[var(--vh)] bg-background flex flex-col"
    >
      {children}
    </div>
  );
}