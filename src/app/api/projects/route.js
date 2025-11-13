export async function GET() {
  const projects = [
    {
      id: 1,
      slug: "blog-app",
      title: "Blog App",
      year: "2025",
      tech: ["React", "Express", "Node.js", "Mongodb", "Tailwind CSS"],
      description:
        "A modern and fully responsive blog platform built with MERN Stack. It supports Markdown-based posts, SEO optimization, and fast static rendering for better performance. The site is designed for writers who value simplicity, speed, and a clean reading experience.",
      myRole: [
        "Developed the entire frontend using React and Tailwind CSS.",
        "Implemented Markdown rendering with syntax highlighting.",
        "Added SEO-friendly routing with dynamic metadata and server actions.",
        "Designed a minimal yet elegant interface for smooth content reading.",
      ],
      images: [
        "/Projects/blogsite/blog-site-2.png",
        "/Projects/blogsite/blog-site-3.png",
      ],
      hoverImage: "/Projects/blogsite/blog-site.png",
      liveUrl: "https://epikcart.vercel.app",
      github: "https://github.com/aitezazdev/blog-app-mern",
    },
    {
      id: 2,
      slug: "e-marketana",
      title: "E-Marketana",
      year: "2023",
      tech: ["React", "Tailwind CSS", "Redux", "API Integration"],
      description:
        "E-Marketana is a sleek frontend prototype for an e-commerce marketplace built entirely with React. It features smooth category-based product listings, responsive layouts, and clean animations for a polished user experience. The project focuses on UI consistency and component reusability.",
      myRole: [
        "Built the frontend using React and Tailwind CSS.",
        "Integrated REST APIs for fetching and displaying product data.",
        "Created a dynamic product grid with debounced search functionality.",
        "Implemented subtle page transitions using Framer Motion.",
      ],
      images: [
        "/Projects/emarketana/emarketana-2.png",
        "/Projects/emarketana/emarketana-3.png",
      ],
      hoverImage: "/Projects/emarketana/emarketana-1.png",
      liveUrl: "https://epikcart.vercel.app",
      github: "https://github.com/yourusername/epikcart",
    },
    {
      id: 3,
      slug: "finance-tracker",
      title: "Finance Tracker",
      year: "2023",
      tech: ["React", "Express", "Node.js", "Mongodb", "JWT Auth", "Recharts.js", "Tailwind CSS"],
      description:
        "A secure and intuitive finance tracking web app that helps users monitor expenses, income, and savings goals. It features visual charts, authentication, and real-time data updates for efficient personal finance management.",
      myRole: [
        "Developed both backend and frontend using the MERN stack.",
        "Implemented user authentication and JWT-based authorization.",
        "Integrated Chart.js for dynamic expense and income visualization.",
        "Built a dashboard for managing transactions and tracking savings goals.",
      ],
      images: [
        "/Projects/financeTracker/finance-tracker-2.png",
        "/Projects/financeTracker/finance-tracker-3.png",
      ],
      hoverImage: "/Projects/financeTracker/finance-tracker-1.png",
      liveUrl: "https://epikcart.vercel.app",
      github: "https://github.com/yourusername/epikcart",
    },
    {
      id: 4,
      slug: "hospital-management-system",
      title: "Hospital Management System",
      year: "2023",
      tech: ["React", "Express", "Node.js", "Mongodb", "Context API", "Tailwind CSS"],
      description:
        "A full-featured hospital management platform that simplifies appointment scheduling, patient records, and doctor management. The system is designed to improve hospital workflows with secure data handling and responsive dashboards.",
      myRole: [
        "Developed the full-stack architecture using MERN technologies.",
        "Created APIs for patient management, appointments, and staff operations.",
        "Integrated Redux for global state management and scalability.",
        "Designed responsive admin and doctor dashboards with Tailwind CSS.",
      ],
      images: [
        "/Projects/HMS/hospital-1.png",
        "/Projects/HMS/hospital-2.png",
      ],
      hoverImage: "/Projects/HMS/hospital-3.png",
      liveUrl: "https://epikcart.vercel.app",
      github: "https://github.com/yourusername/epikcart",
    },
  ];

  return Response.json(projects);
}
