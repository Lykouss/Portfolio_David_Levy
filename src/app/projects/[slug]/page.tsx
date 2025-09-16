// src/app/projects/[slug]/page.tsx

import { projectsData } from "@/lib/projects-data";
import { notFound } from "next/navigation";
import ProjectPageClient from "./ProjectPageClient";

// 1. Definindo o tipo correto para as props da página
type Props = {
  params: { slug: string };
};

// Esta função ajuda o Next.js a saber quais páginas gerar estaticamente
export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

// 2. Usando o tipo 'Props' que definimos
export default function ProjectPage({ params }: Props) {
  const { slug } = params;
  const project = projectsData.find((p) => p.slug === slug);

  // Se o projeto não for encontrado, exibe uma página 404
  if (!project) {
    notFound();
  }

  // Passamos os dados do projeto para um Componente de Cliente para poder animar
  return <ProjectPageClient project={project} />;
}