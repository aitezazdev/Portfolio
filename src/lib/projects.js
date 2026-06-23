const projects = [
  {
    id: 1,
    slug: 'c-study',
    title: 'Collaborative Study Platform',
    year: '2025',
    tech: ['React', 'Node.js', 'Express', 'Socket.io', 'MongoDB', 'Gemini AI', 'Tailwind CSS'],
    description:
      'A real-time collaborative study platform featuring interactive classrooms, PDF/slide rendering, AI-powered study assistance, and text-to-speech learning aids. Students can join virtual study rooms to collaborate on documents and query the AI study companion for instant summaries, while teachers can upload lecture resources and comment in peer-to-peer discussion threads.',
    myRole: [
      'Designed and implemented real-time classroom state synchronization and live chat using Express and Socket.io.',
      'Integrated Google Gemini and Groq AI SDKs to build an automated AI Study Assistant capable of generating lecture summaries, flashcards, and quizzes.',
      'Configured a backend document processor using libreoffice-convert to transform DOCX/PPTX slides into PDFs for frontend rendering.',
      'Implemented multi-format PDF rendering using React PDF and PDF.js to support interactive whiteboard and text highlighting features.',
      'Integrated Cloudinary for persistent media assets and Firebase SDK for secure file hosting and user authentication.',
      'Built responsive student and teacher dashboard layouts featuring smooth micro-animations using React, Tailwind CSS v4, and Framer Motion.',
    ],
    images: [
      '/Projects/c-study/c-study-1.webp',
      '/Projects/c-study/c-study-2.webp',
      '/Projects/c-study/c-study-3.webp',
      '/Projects/c-study/c-study-4.webp',
    ],
    hoverImage: '/Projects/c-study/c-study-1.webp',
    github: 'https://github.com/aitezazdev/collaborative-study-platform',
    liveUrl: '',
  },
  {
    id: 2,
    slug: 'blog',
    title: 'Blog App',
    year: '2025',
    tech: ['React', 'Express', 'Node.js', 'Mongodb', 'Tailwind CSS'],
    description:
      'A blog platform where users can create posts, upload images, comment, and search content.',
    myRole: [
      'Built the frontend and backend using the MERN stack.',
      'Implemented post creation, commenting, image uploads, and search.',
      'Designed a clean, readable layout for posts.',
    ],
    images: [
      '/Projects/blogsite/blog-site.webp',
      '/Projects/blogsite/blog-site-2.webp',
      '/Projects/blogsite/blog-site-3.webp',
      '/Projects/blogsite/blog-site-4.webp',
    ],
    hoverImage: '/Projects/blogsite/blog-site.webp',
    github: 'https://github.com/aitezazdev/Blog-App-Mern',
    liveUrl: 'https://aitezazdev-blog-app.vercel.app/',
  },
  {
    id: 3,
    slug: 'ecommerce',
    title: 'Ecommerce-Next.js',
    year: '2025',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Redux Toolkit', 'Stripe', 'MongoDB', 'Tailwind CSS'],
    description:
      'A full-stack, responsive e-commerce web application featuring robust authentication, dynamic product cataloging, cart state persistence, and Stripe checkout integration. Users can browse products by category, filter by search criteria, and securely check out using Stripe, all while benefiting from optimized skeleton loading screens and real-time state synchronization.',
    myRole: [
      'Built the full-stack architecture using Next.js App Router, TypeScript, and MongoDB with Mongoose database models.',
      'Implemented client-side and backend form validation utilizing React Hook Form paired with Zod schemas for type-safe requests.',
      'Configured global state management for the shopping cart and user sessions using Redux Toolkit.',
      'Integrated the Stripe API to create secure checkout sessions and handle payment events.',
      'Designed a responsive, premium storefront layout using Tailwind CSS with custom dark mode colors and React Icons.',
      'Utilized React Loading Skeleton and React Spinners to maintain smooth, placeholder-based user feedback during product transitions and async operations.',
    ],
    images: [
      '/Projects/ecommerce/ecommerce-1.webp',
      '/Projects/ecommerce/ecommerce-2.webp',
      '/Projects/ecommerce/ecommerce-3.webp',
      '/Projects/ecommerce/ecommerce-4.webp',
      '/Projects/ecommerce/ecommerce-5.webp',
      '/Projects/ecommerce/ecommerce-6.webp',
    ],
    hoverImage: '/Projects/ecommerce/ecommerce-1.webp',
    github: 'https://github.com/aitezazdev/Next.js-Ecommerce',
    liveUrl: 'https://aitezazdev-ecommerce.vercel.app/',
  },
  {
    id: 4,
    slug: 'finance',
    title: 'Finance Tracker',
    year: '2023',
    tech: ['React', 'Express', 'Node.js', 'Mongodb', 'JWT Auth', 'Recharts.js', 'Tailwind CSS'],
    description:
      'A finance tracking app where users can log income and expenses, set savings goals, and view their financial data in interactive charts.',
    myRole: [
      'Built the frontend and backend using the MERN stack.',
      'Implemented user authentication and JWT-based authorization.',
      'Created interactive charts for visualizing income and expenses using Recharts.js.',
      'Developed a dashboard for managing transactions and tracking savings goals.',
    ],
    images: [
      '/Projects/financeTracker/finance-tracker-1.webp',
      '/Projects/financeTracker/finance-tracker-2.webp',
      '/Projects/financeTracker/finance-tracker-3.webp',
      '/Projects/financeTracker/finance-tracker-4.webp',
      '/Projects/financeTracker/finance-tracker-5.webp',
    ],
    hoverImage: '/Projects/financeTracker/finance-tracker-1.webp',
    github: 'https://github.com/aitezazdev/Finance-Tracker-Mern',
    liveUrl: 'https://aitezazdev-finance-tracker.vercel.app/',
  },
  {
    id: 5,
    slug: 'hms',
    title: 'Hospital Management System',
    year: '2023',
    tech: ['React', 'Express', 'Node.js', 'Mongodb', 'Context API', 'Tailwind CSS'],
    description:
      'A hospital management system where patients can register and book appointments, doctors can view and approve them, and admins can manage staff, verify doctors, and access a global searchable list of records.',
    myRole: [
      'Built the full-stack application using the MERN stack.',
      'Developed APIs for patient registration, appointments, and staff management.',
      'Implemented approval workflows for doctors and appointments.',
      'Created global search functionality for admins to manage records efficiently.',
      'Designed responsive dashboards for patients, doctors, and admins using Tailwind CSS.',
    ],
    images: [
      '/Projects/HMS/hospital-1.webp',
      '/Projects/HMS/hospital-2.webp',
      '/Projects/HMS/hospital-3.webp',
      '/Projects/HMS/hospital-4.webp',
      '/Projects/HMS/hospital-5.webp',
      '/Projects/HMS/hospital-6.webp',
    ],
    hoverImage: '/Projects/HMS/hospital-3.webp',
    github: 'https://github.com/aitezazdev/Hospital-Mangment-System',
    liveUrl: 'https://aitezazdev-medicore.vercel.app/',
  },
];
export function getAllProjects() {
  return projects;
}
export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}
