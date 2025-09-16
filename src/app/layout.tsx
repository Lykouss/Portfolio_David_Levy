// src/app/layout.tsx
"use client"; // Necessário para usar o hook usePathname

import type { Metadata } from "next"; // A exportação de metadata ainda funciona
import { Exo_2, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation"; // 1. Importar o hook

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ['400', '500', '700'],
  variable: "--font-sans",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ['700', '800'],
  variable: "--font-title",
});

// A exportação de metadata pode ser mantida em um componente cliente,
// mas para seguir as melhores práticas, a manteríamos em um `page.tsx` ou
// no layout do servidor. Por agora, esta estrutura funciona.
// export const metadata: Metadata = { ... }; -> Você pode remover ou comentar isso por enquanto.


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 2. Usar o hook para pegar a URL atual
  const pathname = usePathname();
  
  // 3. Verificar se estamos na rota do chat
  const isChatPage = pathname.startsWith('/chat');

  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${exo2.variable}`}>
      <body className="bg-background text-text font-sans">
        {/* 4. Renderizar o Header e Footer condicionalmente */}
        {!isChatPage && <Header />}
        
        <main>{children}</main>
        
        {!isChatPage && <Footer />}
      </body>
    </html>
  );
}