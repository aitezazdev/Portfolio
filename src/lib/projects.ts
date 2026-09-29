export interface ProjectStat {
  value: string;
  label: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  type: string;
  role: string;
  tech: string[];
  description: string;
  overview: string;
  architecture: string;
  implementation: string;
  stats: ProjectStat[];
  accent: string;
  myRole: string[];
  images: string[];
  hoverImage: string;
  github: string;
  liveUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    slug: 'c-study',
    title: 'Collaborative Study Platform',
    type: 'Real-time Learning Platform',
    role: 'Full Stack Developer',
    tech: ['React 19', 'Node.js', 'Express 5', 'Socket.io', 'MongoDB', 'LibreOffice', 'pdfjs-dist', 'Cloudinary', 'Firebase', 'Groq', 'Google Gemini'],
    description:
      'A real-time collaborative learning platform featuring interactive slide presentations, live canvas annotations, AI study assistance with token streaming, automated quiz generation, and draggable video calls.',
    overview:
      'A virtual classroom platform where teachers and students share lecture materials and interact in real time. Instead of relying on static file downloads, classrooms load documents directly onto synchronized canvases with live pen strokes, instant page flips, audio transcription, and an embedded AI study assistant.',
    architecture:
      'Instructors upload course files in PPTX, DOCX, or PDF format. The backend spawns a headless LibreOffice process to convert presentations into standardized PDF documents, with an in-memory pdf-lib generator handling plain text and fallback scenarios. Output buffers are saved directly to Cloudinary raw storage. On the client, pdfjs-dist renders pages onto HTML5 canvases with offscreen neighbor pre-rendering to keep transitions fluid. A coordinate-normalized overlay canvas captures drawing strokes, highlighters, and page changes, broadcasting them through Socket.io room hierarchies and persisting notes per user and page in MongoDB.',
    implementation:
      'The AI study assistant uses a dual-engine streaming architecture. It primarily streams responses from Groq using Llama models, automatically falling back to Google Gemini when rate limits or quotas are reached. Express delivers tokens via Server-Sent Events to the active user while simultaneously relaying chunks over Socket.io to peers. An automated quiz generator scans slide text directly in the browser, creates multiple-choice or short-answer assessments, and evaluates written student submissions with fractional grading against reference answers. Jitsi Meet runs inside a floating, draggable picture-in-picture frame so participants can talk over video without losing their place in the slides.',
    stats: [
      { value: '<200ms', label: 'Real-time sync latency' },
      { value: '7+', label: 'File formats converted' },
      { value: 'Dual-LLM', label: 'Groq & Gemini fallback' },
    ],
    accent: '#34D399',
    myRole: [
      'Built the real-time presentation engine using Express and Socket.io with dedicated room hierarchies for page flips and live pen coordinates.',
      'Implemented the server-side document conversion pipeline using headless LibreOffice and in-memory pdf-lib for PPTX, DOCX, and PDF uploads.',
      'Engineered the dual-model AI study assistant using Groq and Google Gemini with token streaming over Server-Sent Events and Socket.io.',
      'Created the HTML5 canvas annotation overlay with coordinate normalization, highlighters, and per-user persistent MongoDB storage.',
      'Built the AI quiz generator and semantic short-answer evaluation system with automatic scoring and class performance tracking.',
      'Integrated Jitsi Meet inside a persistent floating picture-in-picture container to allow simultaneous video calls and slide navigation.',
    ],
    images: [
      '/Projects/c-study/02_CSP.webp',
      '/Projects/c-study/01_CSP.webp',
      '/Projects/c-study/03_CSP.webp',
      '/Projects/c-study/04_CSP.webp',
      '/Projects/c-study/06_CSP.webp',
    ],
    hoverImage: '/Projects/c-study/02_CSP.webp',
    github: 'https://github.com/aitezazdev/collaborative-study-platform',
    liveUrl: 'https://collaborative-study-platform-uni.vercel.app/',
  },
  {
    id: 2,
    slug: 'hms',
    title: 'Hospital Management System',
    type: 'Full Stack Healthcare Platform',
    role: 'Full Stack Developer',
    tech: ['React 19', 'Vite', 'Node.js', 'Express 5', 'MongoDB', 'Mongoose', 'Google Gemini', 'Redux Toolkit', 'Tailwind CSS', 'Ant Design', 'Nodemailer'],
    description:
      'A full stack clinical platform featuring dedicated portals for patients, doctors, and administrators with automated appointment booking, schedule management, email confirmations, and AI clinical summaries.',
    overview:
      'A comprehensive medical workflow system called MediCore built to handle clinic administration, patient scheduling, and physician workflows. It separates responsibilities into three dedicated portals, giving patients an intuitive booking experience, doctors a structured appointment and schedule manager, and administrators complete oversight.',
    architecture:
      'Built with React 19 and Express using dual-token JWT authentication with short-lived access tokens and 7-day httpOnly refresh cookies. An Axios response interceptor queues concurrent requests during token renewal so sessions never drop mid-action. When new doctors sign up, their profiles remain unapproved and hidden from public search until administrators verify their qualifications in the admin dashboard. Doctors set their weekly schedule, slot durations, and daily patient quotas. Patients search by medical specialty, location, or consultation fee, and the backend verifies open capacity before confirming bookings to eliminate double-booking.',
    implementation:
      'Integrated an AI clinical assistant powered by Google Gemini with a 5-tier model fallback chain and an offline simulation mode. Patients can describe symptoms in plain language to get suggested specialist categories and self-care recommendations. For physicians, the system synthesizes patient medical history and current appointment notes into a concise pre-consultation brief, and suggests prescription drafts that cross-check recorded conditions. The backend includes security hardening with Helmet, response compression, and custom recursive NoSQL injection sanitizers that strip MongoDB operator characters from incoming requests.',
    stats: [
      { value: '3', label: 'Role-based portals' },
      { value: '5-Tier', label: 'Gemini model fallback' },
      { value: '0', label: 'Double-booking conflicts' },
    ],
    accent: '#2E7D6B',
    myRole: [
      'Architected the three role-based portals for patients, doctors, and administrators using React 19, Tailwind CSS, and Ant Design.',
      'Built the dual-token JWT authentication system with httpOnly cookies and an Axios concurrency queue for silent token refreshing.',
      'Implemented the doctor availability engine with weekly schedule configuration, daily patient limits, and atomic slot validation.',
      'Developed the AI clinical assistant using Google Gemini with sequential model fallbacks and an offline simulation mode.',
      'Created automated transactional email workflows using Nodemailer for appointment confirmations, cancellations, and account approvals.',
      'Implemented recursive NoSQL injection sanitization and role-based route guards across all Express API endpoints.',
    ],
    images: [
      '/Projects/HMS/hospital-1.webp',
      '/Projects/HMS/hospital-2.webp',
      '/Projects/HMS/hospital-3.webp',
      '/Projects/HMS/hospital-4.webp',
      '/Projects/HMS/hospital-5.webp',
      '/Projects/HMS/hospital-6.webp',
      '/Projects/HMS/hospital-7.webp',
      '/Projects/HMS/hospital-8.webp',
    ],
    hoverImage: '/Projects/HMS/hospital-1.webp',
    github: 'https://github.com/aitezazdev/Hospital-Mangment-System',
    liveUrl: 'https://aitezazdev-medicore.vercel.app/',
  },
  {
    id: 3,
    slug: 'ecommerce',
    title: 'E-Commerce Store',
    type: 'SSR Commerce Application',
    role: 'Full Stack Developer',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Stripe', 'MongoDB', 'Mongoose', 'Zod'],
    description:
      'A high performance online storefront built on the Next.js App Router and React 19 featuring server-side catalog rendering, optimistic shopping cart updates, Stripe checkout sessions, and connection resilience guards.',
    overview:
      'A dark-themed modern retail storefront called Zaz Store engineered for fast catalog browsing and zero-delay shopping cart interactions. It pairs server-rendered category and product pages with client-side optimistic UI updates, ensuring the interface responds instantly to user clicks while maintaining strict database consistency.',
    architecture:
      'The catalog, category routes, and product detail pages are async Server Components that query MongoDB directly with URL-driven search parameters and price sorting. When customers modify quantities or add items to their cart, a custom React hook combines React 19 useOptimistic and startTransition with Redux Toolkit thunks. The interface updates locally with zero delay; if the network fails, the hook catches the rejection and rolls back to the last confirmed server state. Cart data persists to MongoDB per authenticated user, with handlers automatically cleaning up references if a product is removed from the catalog.',
    implementation:
      'Engineered a resilient database layer featuring connection pooling, a 10-second failure cooldown circuit breaker, and automatic fallback to an in-memory mock catalog. If MongoDB experiences an outage, the storefront continues serving catalog pages without throwing 500 error pages. Checkout security enforces prices strictly on the server: POST requests to the checkout endpoint pull verified amounts from the database, build Stripe Hosted Checkout Sessions, and log immutable order records upon return while clearing the active cart. Server-to-client session hydration decodes JWT cookies in the root layout to prevent unauthenticated layout flashes.',
    stats: [
      { value: '0ms', label: 'Optimistic cart latency' },
      { value: 'SSR', label: 'Server-rendered catalog' },
      { value: 'Stripe', label: 'Hosted checkout sessions' },
    ],
    accent: '#34D399',
    myRole: [
      'Built the server-side catalog and product detail pages using Next.js App Router with dynamic category routes and URL search params.',
      'Implemented optimistic cart mutations using React 19 useOptimistic and useTransition hooks backed by Redux Toolkit thunks.',
      'Built the Stripe Checkout Session integration with server-enforced pricing and post-payment order verification.',
      'Configured a resilient Mongoose connection pool with a 10-second failure cooldown circuit breaker and mock data fallbacks.',
      'Designed server-to-client session hydration via HTTP-only JWT cookies to eliminate authentication layout flashes.',
      'Created responsive zinc-dark loading skeletons and error boundaries with retry buttons across all core routes.',
    ],
    images: [
      '/Projects/ecommerce/1.webp',
      '/Projects/ecommerce/2.webp',
      '/Projects/ecommerce/3.webp',
      '/Projects/ecommerce/4.webp',
      '/Projects/ecommerce/5.webp',
      '/Projects/ecommerce/6.webp',
    ],
    hoverImage: '/Projects/ecommerce/1.webp',
    github: 'https://github.com/aitezazdev/Next.js-Ecommerce',
    liveUrl: 'https://aitezazdev-ecommerce.vercel.app/',
  },
  {
    id: 4,
    slug: 'finance',
    title: 'Personal Finance Tracker',
    type: 'Financial Analytics Dashboard',
    role: 'Full Stack Developer',
    tech: ['React 19', 'Vite', 'Tailwind CSS', 'Redux Toolkit', 'Recharts', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT'],
    description:
      'A personal finance tracking application featuring segregated income and expense management, inline transaction editing, duplicate entry prevention, and MongoDB aggregation pipelines powering Recharts visualizations.',
    overview:
      'A personal finance manager designed to give users clear visibility into daily cash flow and spending patterns. It combines quick transaction entry with interactive data visualizations, helping individuals track where their money goes through automated category breakdowns, monthly comparisons, and daily spending trendlines.',
    architecture:
      'The frontend is built with React 19 and Redux Toolkit for authentication, communicating with an Express API through Axios request and response interceptors. The backend maintains separate MongoDB collections for expenses and incomes, linked to user documents. Users log transactions with amount, category, date, and description. A duplicate detection check queries existing records before saving to prevent accidental double-submits. The transaction ledger supports in-place inline row editing, allowing users to modify dates, categories, or amounts directly within the table view without opening modal dialogs.',
    implementation:
      'Built three distinct MongoDB aggregation pipelines to convert raw transaction dates and amounts into actionable visualizations. Using toDate conversions and dateTrunc operators, the backend computes monthly spending totals, category distributions, and daily spending trendlines. The frontend renders these datasets using Recharts bar and line charts, complete with dynamic year filters, highest and lowest spending indicators, and average spending calculations. When a user requests account deletion, a cascading database routine purges the user profile alongside all associated income and expense records.',
    stats: [
      { value: '3', label: 'Aggregation pipelines' },
      { value: 'Recharts', label: 'Interactive analytics' },
      { value: 'CRUD', label: 'Inline editable ledger' },
    ],
    accent: '#B08968',
    myRole: [
      'Built the full stack ledger application using React 19, Tailwind CSS, Express, and MongoDB.',
      'Designed MongoDB aggregation pipelines using toDate and dateTrunc to group transaction records for analytics.',
      'Implemented interactive visual dashboards using Recharts with monthly bar charts, category distributions, and daily trendlines.',
      'Created in-place inline editing for transaction rows and mobile-friendly card views.',
      'Configured JWT authentication with Axios request interceptors and automatic session-expiry handling.',
      'Implemented duplicate transaction detection and cascading account deletion across income and expense collections.',
    ],
    images: [
      '/Projects/financeTracker/1.webp',
      '/Projects/financeTracker/2.webp',
      '/Projects/financeTracker/3.webp',
      '/Projects/financeTracker/4.webp',
      '/Projects/financeTracker/5.webp',
      '/Projects/financeTracker/6.webp',
    ],
    hoverImage: '/Projects/financeTracker/1.webp',
    github: 'https://github.com/aitezazdev/Expense-Tracker_Mern',
    liveUrl: 'https://aitezazdev-finance-tracker.vercel.app/',
  },
  {
    id: 5,
    slug: 'blog',
    title: 'Modern Blog Space',
    type: 'Content & Publishing Platform',
    role: 'Full Stack Developer',
    tech: ['React 19', 'Vite', 'Tailwind CSS', 'Redux Toolkit', 'React Router', 'Node.js', 'Express', 'MongoDB', 'Cloudinary', 'Docker', 'AWS EC2'],
    description:
      'A modern content publishing platform called ZazBlog featuring article authoring, Cloudinary media lifecycle management, in-place comments, bookmark reading lists, debounced search, and Dockerized AWS EC2 deployment.',
    overview:
      'A full-featured publishing web platform built for writers and readers. It offers a clean, typography-focused reading experience with article authoring, image uploads, categorized tag navigation, reader comments, personal bookmark reading lists, and a containerized deployment setup.',
    architecture:
      'Built with React 19 and Express with JWT authentication, using Redux Toolkit to manage authentication and saved post states. Authors publish articles with images handled through Multer disk storage and Cloudinary. The backend enforces strict filesystem hygiene: temporary local uploads are immediately unlinked upon completion or error, and replaced or deleted images are purged from Cloudinary using public IDs to prevent storage leaks. Readers can leave comments with in-place editing, toggle article likes, and manage a personal bookmarks list synchronized across views.',
    implementation:
      'Implemented article search using a MongoDB aggregation pipeline with lookup joining author profiles and regex filtering across titles, tags, and author names. The frontend search input includes a 500ms debounce handler to minimize server requests. Engineered relational cascade deletions: deleting an article automatically removes its comments, clears references from every user reading list, and deletes its Cloudinary asset; deleting an account cascades through all authored posts, comments, comments on authored posts, and likes. In the DevOps setup, Docker Compose orchestrates frontend and backend containers, with a multi-stage Alpine Nginx Dockerfile handling client-side SPA routing and GitHub Actions deploying to AWS EC2.',
    stats: [
      { value: 'NoSQL', label: 'Relational cascade cleanup' },
      { value: 'Docker', label: 'Multi-stage Nginx container' },
      { value: 'CDN', label: 'Cloudinary asset lifecycle' },
    ],
    accent: '#5B7DB1',
    myRole: [
      'Built the full stack publishing application using React 19, Tailwind CSS, Express, and MongoDB.',
      'Implemented full asset lifecycle management with Multer and Cloudinary, including local file unlinking and remote asset destruction.',
      'Designed real-time article search using MongoDB aggregation pipelines with lookup across author profiles and debounced frontend input.',
      'Built in-place comment editing and global bookmark state management using Redux Toolkit.',
      'Engineered relational cascade deletions across posts, comments, bookmarks, likes, and user profiles.',
      'Created Docker Compose configurations, multi-stage Alpine Nginx Dockerfiles, and GitHub Actions CI/CD for AWS EC2 deployment.',
    ],
    images: [
      '/Projects/blogsite/1.webp',
      '/Projects/blogsite/2.webp',
      '/Projects/blogsite/3.webp',
      '/Projects/blogsite/4.webp',
      '/Projects/blogsite/5.webp',
      '/Projects/blogsite/6.webp',
    ],
    hoverImage: '/Projects/blogsite/1.webp',
    github: 'https://github.com/aitezazdev/Blog-App-MERN',
    liveUrl: 'https://aitezazdev-blog-app.vercel.app/',
  },
];
export function getAllProjects(): Project[] {
  return projects;
}
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
export function getAdjacentProjects(slug: string): { prev?: Project; next?: Project } {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return {
    prev: projects[(idx - 1 + projects.length) % projects.length],
    next: projects[(idx + 1) % projects.length],
  };
}
