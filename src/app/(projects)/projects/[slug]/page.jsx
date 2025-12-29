import ProjectDetails from '@/components/ProjectDetails';
import { getProjectBySlug } from '@/lib/projects';
import { notFound } from 'next/navigation';

export default function ProjectPage({ params }) {
  const project = getProjectBySlug(params.slug);

  if (!project) notFound();

  return <ProjectDetails project={project} />;
}
