// src/components/ProjectsSection.tsx
"use client";

import { motion } from 'framer-motion';
import { projectsData } from '@/lib/projects-data';
import ProjectCard from './ProjectCard';

// Variantes para animar o container da seção
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Atraso entre a animação de cada card
    },
  },
};

export default function ProjectsSection() {
  return (
    <motion.section
      id="projetos"
      className="min-h-screen py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} // Animação dispara quando 10% da seção estiver visível
    >
      <div className="container mx-auto px-4">
        <h2 className="font-title text-4xl font-bold text-center mb-16">
          PROJETOS EM DESTAQUE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}