// src/components/Header.tsx

"use client"; // Necessário para usar hooks

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  // Efeito que monitora a posição do scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Limpa o evento ao desmontar o componente
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Sobre', href: '/#sobre' },
    { name: 'Projetos', href: '/#projetos' },
    { name: 'Habilidades', href: '/#habilidades' },
  ];

  return (
    // A classe do header agora muda dinamicamente
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-primary/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="font-title text-2xl font-bold text-accent hover:text-accent-hover transition-colors">
          <Image
            src="/logos/favicon.png"
            alt="Logo David Levy"
            width={40} 
            height={40} 
            className="h-auto" 
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-text-muted hover:text-text transition-colors">
              {link.name}
            </Link>
          ))}
          <Link href="/#contato" className="bg-accent hover:bg-accent-hover text-background font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105">
            Contato
          </Link>
        </nav>
        <div className="md:hidden">
          <button className="text-text text-2xl">☰</button>
        </div>
      </div>
    </header>
  );
}