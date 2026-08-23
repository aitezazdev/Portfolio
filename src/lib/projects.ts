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
  challenge: string;
  solution: string;
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
    type: 'Real-time Web App',
    role: 'Full Stack Developer',
    tech: ['React', 'Node.js', 'Express', 'Socket.io', 'MongoDB', 'Study Assistant', 'Tailwind CSS'],
    description:
      'A real-time collaborative study platform featuring interactive classrooms, document rendering, and integrated study tools. Students can join virtual study rooms to collaborate on files, utilize text-to-speech learning aids, and query an automated assistant for summaries. Teachers can upload resource materials and participate in peer-to-peer discussions.',
    overview:
      'CSP turns scattered study material into *live*, shared classrooms. Students join a room, see the same document rendered *instantly*, and learn together — with an AI assistant generating summaries, flashcards and quizzes from whatever the class is reading.',
    challenge:
      'Keeping documents, chat and whiteboard state perfectly synchronized across dozens of concurrent users was the core problem. Documents arrive as DOCX/PPTX, need server-side conversion to PDF, then page-by-page rendering with text selection — all while Socket.io events fight to keep every client pixel-identical.',
    solution:
      'I built a room-state authority on Express + Socket.io with event-sourced sync so late joiners reconstruct exact state. A libreoffice-convert pipeline normalizes uploads to PDF, and React PDF/PDF.js renders interactive pages with highlighting. Cloudinary stores media; Firebase handles auth and file hosting.',
    stats: [
      { value: '<200ms', label: 'Sync latency across rooms' },
      { value: '5+', label: 'Document formats supported' },
      { value: '3-in-1', label: 'Summaries, cards & quizzes' },
    ],
    accent: '#C45D3E',
    myRole: [
      'Designed and implemented real-time classroom state synchronization and live chat using Express and Socket.io.',
      'Integrated text processing and search SDKs to build an automated Study Assistant capable of generating lecture summaries, flashcards, and quizzes.',
      'Configured a backend document processor using libreoffice-convert to transform DOCX/PPTX slides into PDFs for frontend rendering.',
      'Implemented multi-format PDF rendering using React PDF and PDF.js to support interactive whiteboard and text highlighting features.',
      'Integrated Cloudinary for persistent media assets and Firebase SDK for secure file hosting and user authentication.',
      'Built responsive student and teacher dashboard layouts featuring smooth micro-animations using React, Tailwind CSS v4, and Framer Motion.',
    ],
    images: [
      '/Projects/c-study/02_CSP.webp',
      '/Projects/c-study/01_CSP.webp',
      '/Projects/c-study/03_CSP.webp',
      '/Projects/c-study/04_CSP.webp',
      '/Projects/c-study/06_CSP.webp',
    ],
    hoverImage: '/Projects/c-study/02_CSP.webp',
    github: '',
    liveUrl: 'https://collaborative-study-platform-uni.vercel.app/',
  },
  {
    id: 2,
    slug: 'hms',
    title: 'Hospital Management System',
    type: 'Full Stack Platform',
    role: 'Full Stack Developer',
    tech: ['React', 'Express', 'Node.js', 'MongoDB', 'Clinical Assessment', 'Redux Toolkit', 'Tailwind CSS'],
    description:
      'A full stack hospital management system featuring dedicated, role based dashboards for patients, doctors, and system administrators. The platform integrates an automated clinical summary system to assist both patients and medical staff through an interactive symptom checker, pre appointment medical history summaries, and suggested prescription generators. Patients can find doctors by specialization, book consultation slots, and track booking statuses, while doctors can manage schedules, record clinical notes, and edit prescriptions. Administrators oversee doctor registrations, verify credentials, and manage patient records with a global search interface.',
    overview:
      '*MediCore* digitizes the hospital front desk: three role-based portals (patient, doctor, admin), appointment scheduling, credential verification, and an assistive layer that drafts pre-consultation summaries and prescription suggestions for clinicians.',
    challenge:
      'Healthcare workflows are unforgiving: booking races between patients for the same slot, role-based access must be airtight, and clinicians will not adopt anything that adds clicks. The system had to model approvals, schedule conflicts and verification states without becoming slow or confusing.',
    solution:
      'A MERN architecture with Redux Toolkit state slices per portal, atomic slot booking with conflict guards, and a verification pipeline for doctor registrations. The symptom advisor synthesizes structured history into a pre-visit brief so doctors start every consultation already *informed*.',
    stats: [
      { value: '3', label: 'Dedicated role portals' },
      { value: '0', label: 'Double-booked slots' },
      { value: '100%', label: 'Credential verification flow' },
    ],
    accent: '#2E7D6B',
    myRole: [
      'Built the full-stack healthcare workflow using React, Express, Node.js, and MongoDB, incorporating Redux Toolkit for state management.',
      'Integrated text analysis engines to implement a patient symptom advisor, pre-consultation medical history synthesis, and suggested prescriptions.',
      'Developed independent portals for patients, doctors, and admins with custom dashboards and schedule slot managers.',
      'Implemented doctor registration verification and appointment approval workflows.',
      'Created global patient and staff search functionality for administrative record management.',
      'Designed a fully responsive UI utilizing Tailwind CSS, Ant Design layouts, and custom loading states for text generation.',
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
    type: 'SSR Commerce App',
    role: 'Full Stack Developer',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Redux Toolkit', 'Stripe', 'MongoDB', 'Tailwind CSS'],
    description:
      'A high performance e-commerce platform built using the Next.js App Router and React 19 to provide a smooth, dark themed shopping experience. The storefront integrates server side rendering for catalog queries, category filters, and sorting parameters, allowing for fast initial loads and search optimization. A key feature is the database persisted shopping cart which uses React 19 transition states and optimistic updates to reflect quantity changes instantly, automatically rolling back to the cached Redux store if backend updates fail. Transactions are completed through a secure Stripe checkout session that collects delivery details, logs orders, and flushes cart states upon redirect confirmation. The backend includes database safeguards such as connection caching, a failure cooldown guard, and an offline mock dataset fallback to maintain stability.',
    overview:
      'A dark-themed storefront built on the Next.js App Router with SSR catalog queries, a database-persisted cart powered by React 19 optimistic updates, and a full Stripe checkout pipeline — engineered so the UI never waits on the network to feel *instant*.',
    challenge:
      'Commerce lives or dies on latency and trust. Cart mutations had to feel zero-latency without risking divergence from the database, checkout had to be PCI-safe via Stripe sessions, and the catalog needed SEO-friendly server rendering with filters that do not tank TTFB.',
    solution:
      '*Optimistic* cart updates through React 19 transitions with automatic rollback to the cached Redux store on failure; SSR for category/filter/sort routes; Zod-validated forms mirrored by API middleware; and a resilient Mongo connection wrapper with caching, cooldown locks and mock-data fallbacks for graceful degradation.',
    stats: [
      { value: '0ms', label: 'Perceived cart latency' },
      { value: 'SSR', label: 'SEO-ready catalog routes' },
      { value: 'Stripe', label: 'Secure hosted checkout' },
    ],
    accent: '#C45D3E',
    myRole: [
      'Architected the full-stack catalog using Next.js App Router, TypeScript, and MongoDB, employing server-side data fetching for category collections.',
      'Integrated React 19 optimistic updates and transition hooks inside a custom React Context provider to enable zero-latency cart modifications.',
      'Engineered an end-to-end checkout pipeline with Stripe Checkout Sessions, capturing payment events, user details, and order logging.',
      'Configured a resilient Mongoose database connection wrapper featuring caching, a 10-second failure cooldown lock, and mock data fallbacks.',
      'Implemented type-safe form validation using Zod and React Hook Form on the frontend and custom validation middleware on API routes.',
      'Designed a responsive, dark-themed user interface utilizing Tailwind CSS, custom loading spinners, and skeleton loaders to minimize layout shifts.',
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
    type: 'Analytics Dashboard',
    role: 'Full Stack Developer',
    tech: ['React', 'Express', 'Node.js', 'MongoDB', 'JWT Auth', 'Recharts.js', 'Tailwind CSS'],
    description:
      'A personal finance tracking application designed to help users log, organize, and review their daily incomes and expenses. The platform features an analytics dashboard that converts raw transaction feeds into interactive charts, including monthly spending comparisons, category breakdowns, and daily financial trends. Built with security in mind, the application secures all user records through JSON Web Tokens and bcrypt encryption. A global state store synchronizes transaction histories and user login states across the interface, utilizing request interceptors to automatically verify access tokens on outgoing API calls.',
    overview:
      'A personal finance app that transforms raw transaction logs into *living* dashboards — monthly comparisons, category breakdowns and trend lines — secured end-to-end with JWT auth and bcrypt hashing.',
    challenge:
      'Financial data demands both correctness and clarity: token expiry mid-session must never corrupt in-flight edits, and raw ledgers are useless until aggregated into honest, readable visualizations people actually check daily.',
    solution:
      'Axios interceptors handle *transparent* token refresh and session-expiry redirects; aggregation endpoints power Recharts dashboards fed by filtered, sorted CRUD APIs; Redux keeps transactions and auth state coherent across every view.',
    stats: [
      { value: 'JWT', label: 'Stateless secure sessions' },
      { value: '4+', label: 'Interactive chart types' },
      { value: 'CRUD', label: 'Filtered & sortable ledger' },
    ],
    accent: '#B08968',
    myRole: [
      'Developed the full stack application using the MERN stack and configured Redux Toolkit to manage global application states.',
      'Created interactive analytics dashboards using Recharts to visualize monthly income and expense metrics, category distributions, and spending trends.',
      'Implemented secure user authentication and authorization using JSON Web Tokens and bcrypt password hashing.',
      'Built transaction CRUD endpoints supporting dynamic category filtering and sorting by transaction amounts.',
      'Configured Axios interceptors to automatically append JWT bearer tokens to requests and handle session timeouts on 401 response codes.',
      'Designed a responsive client interface using Tailwind CSS, implementing alert notifications and table views for transaction management.',
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
    github: 'https://github.com/aitezazdev/Finance-Tracker-Mern',
    liveUrl: 'https://aitezazdev-finance-tracker.vercel.app/',
  },
  {
    id: 5,
    slug: 'blog',
    title: 'Modern Blog Space',
    type: 'Content Platform',
    role: 'Full Stack Developer',
    tech: ['React', 'Express', 'Node.js', 'MongoDB', 'JWT Auth', 'Cloudinary', 'Tailwind CSS'],
    description:
      'A full stack blogging application featuring a modern, responsive design and robust account management. The system implements secure JWT authentication, password encryption, and dynamic image uploads using Cloudinary. Users can publish articles, categorize posts with tags, interact through comments, save bookmarked reading lists, and manage their author profiles. Designed with performance in mind, the platform integrates MongoDB database indexes and an optimized connection cache to deliver fast, scalable query resolutions.',
    overview:
      'A publishing platform with JWT auth, *Cloudinary*-backed media, bookmarks, comments and author profiles — tuned with compound Mongo indexes and debounced search so it stays fast as content grows.',
    challenge:
      'User-generated platforms rot quickly: orphaned media after deletions, N+1 comment lookups, and search endpoints hammered by keystrokes. Account deletion especially needs to cascade cleanly across posts, comments, likes and CDN assets.',
    solution:
      'Text and compound indexes speed chronological queries; Multer-to-Cloudinary pipelines destroy replaced assets automatically; a cascading purge routine removes every trace of deleted accounts; *debounced* search protects the API from request storms.',
    stats: [
      { value: 'Indexed', label: 'Compound DB queries' },
      { value: 'Cascade', label: 'Clean account deletion' },
      { value: 'CDN', label: 'Cloudinary media pipeline' },
    ],
    accent: '#5B7DB1',
    myRole: [
      'Architected the full stack system using React, Express, Node.js, and MongoDB, enforcing a clean modular codebase.',
      'Integrated Cloudinary and Multer disk storage to support dynamic image uploads, incorporating automated asset destruction routines during post updates and deletions.',
      'Engineered complex Mongoose database schemas featuring text indexing on key query fields and compound indexes to speed up chronological lookups.',
      'Developed a stateless, token-based authentication system utilizing JSON Web Tokens and bcrypt password hashing.',
      'Built a real-time search interface on the frontend with a debounced input handler to limit API request frequencies.',
      'Implemented a cascading database purge workflow that automatically removes posts, comments, likes, and Cloudinary media assets upon account deletion.',
      'Configured centralized state management using Redux Toolkit to persist user authentication states and bookmarks across page reloads.',
      'Created Axios request and response interceptors to handle automatic token attachment and graceful session expiration redirects.',
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
    github: 'https://github.com/aitezazdev/Blog-App-Mern',
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
