// src/app/projects/[slug]/page.tsx

import { projectsData } from "@/lib/projects-data";
import { notFound } from "next/navigation";
import ProjectPageClient from "./ProjectPageClient";

// 1. Definindo um tipo mais completo e explícito para as props da página
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Esta função ajuda o Next.js a saber quais páginas gerar estaticamente
export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

// 2. Usando a nossa nova interface 'PageProps'
export default function ProjectPage({ params }: PageProps) {
  const { slug } = params;
  const project = projectsData.find((p) => p.slug === slug);

  // Se o projeto não for encontrado, exibe uma página 404
  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}