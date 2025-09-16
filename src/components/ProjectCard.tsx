// src/components/ProjectCard.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Project } from '@/lib/projects-data'; // Importa a interface que definimos

// Variantes de animação para o card individual
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-lg bg-primary border border-secondary shadow-lg transition-all duration-300 group-hover:shadow-glow group-hover:scale-[1.02]">
          {/* Imagem com Overlay no Hover */}
          <div className="relative h-56 w-full overflow-hidden"> 
            <Image
              src={project.imageUrl}
              alt={`Imagem do projeto ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center">
              <span className="text-accent font-title text-lg border-2 border-accent py-2 px-4 rounded">
                VER PROJETO
              </span>
            </div>
          </div>

          {/* Conteúdo de Texto */}
          <div className="p-6">
            <h3 className="font-title text-xl font-bold text-text mb-2">{project.title}</h3>
            <p className="text-text-muted text-sm mb-4 line-clamp-3">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-secondary text-text-muted text-xs font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}