// src/app/chat/layout.tsx

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // A CORREÇÃO ESTÁ AQUI
    // Usar 'h-[100dvh]' (altura dinâmica da janela de visualização) garante que
    // o layout se redimensiona corretamente quando o teclado do telemóvel aparece.
    <div className="h-[100dvh] bg-background flex flex-col">
      {children}
    </div>
  );
}