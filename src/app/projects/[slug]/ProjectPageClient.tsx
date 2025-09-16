// src/app/projects/[slug]/ProjectPageClient.tsx
"use client";

import { Project } from "@/lib/projects-data";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github, HardDriveDownload } from "lucide-react";

export default function ProjectPageClient({ project }: { project: Project }) {
  const hasLongDescription = project.longDescriptionHtml && project.longDescriptionHtml.length > 0;
  // Verifica se existe pelo menos um link para mostrar a seção de acesso
  const hasLinks = project.githubUrl || project.liveUrl || project.downloadUrl;

  return (
    <motion.div
      className="container mx-auto px-4 py-24 pt-32 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Cabeçalho do Projeto */}
      <div className="text-center mb-12">
        <h1 className="font-title text-5xl md:text-6xl font-extrabold text-accent">{project.title}</h1>
        <p className="text-lg text-text-muted mt-4 max-w-2xl mx-auto">{project.description}</p>
        <div className="flex justify-center flex-wrap gap-2 mt-6">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-secondary text-text-muted text-sm font-medium px-4 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Imagem Principal */}
      <motion.div
        className="relative w-full h-auto max-w-4xl mx-auto rounded-lg overflow-hidden shadow-glow mb-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Image
          src={project.imageUrl}
          alt={`Imagem principal do projeto ${project.title}`}
          width={1200}
          height={675}
          className="w-full h-auto"
        />
      </motion.div>

      {/* Seção de Descrição Detalhada e Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
        <div className="lg:col-span-2 space-y-6 text-text-muted text-lg leading-relaxed">
          <h2 className="font-title text-3xl font-bold text-text border-b-2 border-accent pb-2">Visão Geral do Projeto</h2>
          {hasLongDescription ? (
            <div dangerouslySetInnerHTML={{ __html: project.longDescriptionHtml! }} />
          ) : (
            <p>A descrição detalhada deste projeto está sendo preparada. Volte em breve!</p>
          )}
        </div>
        
        {/* Barra Lateral com Links (Renderizada condicionalmente) */}
        {hasLinks && (
          <aside className="lg:col-span-1">
            <div className="bg-primary p-6 rounded-lg sticky top-28">
              <h3 className="font-title text-2xl font-bold mb-4">Acesse o Projeto</h3>
              <div className="space-y-4">

                {/* Botão GitHub condicional */}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-secondary hover:bg-accent hover:text-background transition-colors duration-300 w-full text-left p-4 rounded-md">
                    <Github size={24} />
                    <span className="font-semibold">Ver no GitHub</span>
                  </a>
                )}

                {/* Botão Ver Online condicional */}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-secondary hover:bg-accent hover:text-background transition-colors duration-300 w-full text-left p-4 rounded-md">
                    <ExternalLink size={24} />
                    <span className="font-semibold">Ver Online</span>
                  </a>
                )}

                {/* Botão Download condicional */}
                {project.downloadUrl && (
                  <a href={project.downloadUrl} download className="flex items-center gap-3 bg-secondary hover:bg-accent hover:text-background transition-colors duration-300 w-full text-left p-4 rounded-md">
                    <HardDriveDownload size={24} />
                    <span className="font-semibold">Fazer Download</span>
                  </a>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </motion.div>
  );
}