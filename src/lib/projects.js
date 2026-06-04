const projects = [
  {
    id: 1,
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
    id: 2,
    slug: 'emarketana',
    title: 'E-Marketana',
    year: '2023',
    tech: ['React', 'Tailwind CSS', 'Redux', 'API Integration'],
    description:
      'A frontend e-commerce platform where users can browse products by category, search items, and view product details with responsive layouts and smooth transitions.',
    myRole: [
      'Built the frontend using React and Tailwind CSS.',
      'Integrated APIs to fetch and display product data.',
      'Created a dynamic product grid with search functionality.',
    ],
    images: [
      '/Projects/emarketana/emarketana-1.webp',
      '/Projects/emarketana/emarketana-2.webp',
      '/Projects/emarketana/emarketana-3.webp',
      '/Projects/emarketana/emarketana-4.webp',
      '/Projects/emarketana/emarketana-5.webp',
    ],
    hoverImage: '/Projects/emarketana/emarketana-1.webp',
    github: 'https://github.com/aitezazdev/React-E-Marketana',
    liveUrl: 'https://react-e-marketana-ecommerce.vercel.app/',
  },
  {
    id: 3,
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
    id: 4,
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
