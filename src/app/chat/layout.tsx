// src/app/chat/layout.tsx

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // A CORREÇÃO ESTÁ AQUI: Trocamos 'h-[100dvh]' por 'h-full'.
    // h-full é mais consistente com a forma como os navegadores mobile
    // redimensionam a página quando o teclado aparece.
    <div className="h-full bg-background flex flex-col">
      {children}
    </div>
  );
}