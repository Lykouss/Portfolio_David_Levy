// src/app/chat/layout.tsx

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // CORREÇÃO: Usar 'h-screen' cria um contêiner de altura total mais estável.
    // O 'flex-grow' no filho (ChatInterface) vai funcionar corretamente a partir daqui.
    <div className="h-screen bg-background flex flex-col">
      {children}
    </div>
  );
}