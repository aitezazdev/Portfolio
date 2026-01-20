import ProjectDetails from '@/components/ProjectDetails';
import { getProjectBySlug, getAllProjects } from '@/lib/projects';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const project = getProjectBySlug(params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} - Aitezaz Sikandar`,
      description: project.description,
      images: [
        {
          url: project.hoverImage || project.images[0],
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - Aitezaz Sikandar`,
      description: project.description,
      images: [project.hoverImage || project.images[0]],
    },
  };
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({ params }) {
  const project = getProjectBySlug(params.slug);
  
  if (!project) notFound();
  
  return <ProjectDetails project={project} />;
}