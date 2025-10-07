// src/app/chat/layout.tsx

// Vamos remover o "use client" e o javascript. Não é necessário.
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // CORREÇÃO:
    // 'h-screen' força a div a ter a altura total da tela do dispositivo.
    // 'flex flex-col' garante que os filhos (nosso ChatInterface)
    // se organizarão verticalmente e poderão crescer para preencher este espaço.
    <div className="h-screen bg-background flex flex-col">
      {children}
    </div>
  );
}