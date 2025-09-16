// src/components/SkillsSection.tsx
"use client";

import { motion } from 'framer-motion';
import { skillsData } from '@/lib/skills-data';

// Variantes de animação para o container da seção
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Variantes para os cards de categoria
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SkillsSection() {
  return (
    <motion.section
      id="habilidades"
      className="py-24 bg-primary" // Fundo sutilmente diferente para destacar a seção
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="font-title text-4xl font-bold text-center mb-16">
          MINHAS HABILIDADES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsData.map((category) => (
            <motion.div
              key={category.title}
              className="bg-secondary p-8 rounded-lg border border-transparent hover:border-accent/50 transition-colors duration-300"
              variants={cardVariants}
            >
              <h3 className="font-title text-2xl font-bold text-accent mb-6">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    className="bg-primary text-text-muted text-sm font-medium px-4 py-2 rounded-full"
                    whileHover={{ scale: 1.1, y: -2, color: '#EAEAEA' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}