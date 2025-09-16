// src/app/chat/layout.tsx

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Garante que a área do chat ocupe a tela toda, sem o Header e Footer principais
    <div className="min-h-screen bg-background flex flex-col">
      {children}
    </div>
  );
}