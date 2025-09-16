// src/components/AboutSection.tsx
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

// Variantes de animação para os elementos
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      when: "beforeChildren", // Anima os filhos depois que o container aparecer
      staggerChildren: 0.3, // Adiciona um atraso entre a animação dos filhos
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export default function AboutSection() {
  return (
    <motion.section
      id="sobre"
      className="min-h-screen py-24 flex items-center"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // A animação dispara quando 30% da seção estiver visível
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="font-title text-4xl font-bold text-center mb-16"
          variants={itemVariants}
        >
          SOBRE MIM
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          {/* Coluna da Imagem com Efeito de Sobreposição */}
          <motion.div
            className="md:col-span-2 relative flex justify-center"
            variants={itemVariants}
          >
            {/* Card de fundo */}
            <div className="absolute w-4/5 h-full bg-primary rounded-lg -rotate-6 transition-transform duration-500 group-hover:rotate-0"></div>

            {/* Imagem */}
            <div className="relative group w-full max-w-sm">
              <Image
                src="/images/profile-photo.jpg" // Caminho para sua foto
                alt="Foto de David Levy"
                width={400}
                height={400}
                className="rounded-lg object-cover w-full h-full border-2 border-secondary shadow-glow group-hover:scale-105 transition-transform duration-500"
                style={{ aspectRatio: '1 / 1' }} // Garante que a imagem seja sempre quadrada
              />
            </div>
          </motion.div>

          {/* Coluna do Texto */}
          <motion.div className="md:col-span-3 space-y-4 text-lg text-text-muted" variants={itemVariants}>
            <p>
              Olá! Sou David Levy, um apaixonado por tecnologia e programação de jogos. Aos 17 anos, estou no início da minha jornada profissional e busco uma oportunidade de estágio para aplicar meu conhecimento, enfrentar novos desafios e, acima de tudo, aprender continuamente.
            </p>
            <p>
              Minha principal ferramenta é a <strong className="text-accent">Unity</strong>, onde utilizo <strong className="text-accent">C#</strong> para dar vida às minhas ideias. Também tenho uma base sólida em <strong className="text-accent">Java</strong> e já explorei diversas outras linguagens como Lua, C, Python, PHP e JavaScript.
            </p>
            <p>
              Além dos jogos, tenho grande interesse em desenvolvimento web, com vários projetos criados usando HTML, CSS, JavaScript e <strong className="text-accent">Firebase</strong>, que utilizo para banco de dados, autenticação e hosting. Essa versatilidade me permite pensar em soluções completas e integradas.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}