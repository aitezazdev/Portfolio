import ProjectDetails from '@/components/project/ProjectDetails';
import { getProjectBySlug, getAllProjects } from '@/lib/projects';
import { notFound } from 'next/navigation';
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Aitezaz Sikandar`,
      description: project.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Aitezaz Sikandar`,
      description: project.description,
    },
  };
}
export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetails key={project.slug} project={project} />;
}
