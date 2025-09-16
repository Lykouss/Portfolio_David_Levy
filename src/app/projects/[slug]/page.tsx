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

// Definindo o tipo manualmente (sem PageProps do Next)
type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}
