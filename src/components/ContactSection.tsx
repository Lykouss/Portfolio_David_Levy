// src/components/ContactSection.tsx
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
    },
  },
};

export default function ContactSection() {
  return (
    <motion.section
      id="contato"
      className="py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-title text-4xl font-bold mb-4">
          VAMOS CONVERSAR?
        </h2>
        <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto">
          Estou sempre aberto a novas oportunidades e desafios. Seja para uma vaga de estágio ou um projeto freelancer, adoraria ouvir sobre suas ideias.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/chat" passHref>
            <motion.button
              className="bg-accent hover:bg-accent-hover text-background font-bold text-lg py-4 px-10 rounded-lg transition-all duration-300 shadow-glow w-full sm:w-auto"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              INICIAR CHAT
            </motion.button>
          </Link>
          <a
            href="mailto:levyd1794@gmail.com"
            className="text-accent hover:underline font-semibold"
          >
            ou envie um e-mail diretamente
          </a>
        </div>
      </div>
    </motion.section>
  );
}