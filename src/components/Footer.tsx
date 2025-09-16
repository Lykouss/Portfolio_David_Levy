// src/components/Footer.tsx

import Image from 'next/image';
import Link from 'next/link';
import SocialIcons from './SocialIcons'; // Reutilizando nosso componente de ícones

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-secondary/50 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/logos/favicon.png"
              alt="Logo David Levy"
              width={35}
              height={35}
            />
          </Link>
          <div className="text-sm text-text-muted">
            <p className="font-bold text-text">David Levy</p>
            <p>&copy; {currentYear} Todos os direitos reservados.</p>
          </div>
        </div>

        <SocialIcons />
      </div>
    </footer>
  );
}