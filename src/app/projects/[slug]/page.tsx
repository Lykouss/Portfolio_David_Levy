// src/app/projects/[slug]/page.tsx

import { projectsData } from "@/lib/projects-data";
import { notFound } from "next/navigation";
import ProjectPageClient from "./ProjectPageClient";

// Esta função ajuda o Next.js a saber quais páginas gerar estaticamente
export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

// A correção está aqui: definimos o tipo das props diretamente na assinatura da função.
// Esta é a forma mais robusta e evita conflitos com tipos auto-gerados.
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const project = projectsData.find((p) => p.slug === slug);

  // Se o projeto não for encontrado, exibe uma página 404
  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}