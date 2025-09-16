// src/app/projects/[slug]/page.tsx

import { projectsData } from "@/lib/projects-data";
import { notFound } from "next/navigation";
import ProjectPageClient from "./ProjectPageClient";

// Geração estática dos slugs
export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

// Aqui aceitamos params normal OU Promise
type ProjectPageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Garante que params é resolvido mesmo se vier como Promise
  const { slug } = await Promise.resolve(params);

  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}
