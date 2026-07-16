# nextjs-3d-gsap-portfolio

nextjs-3d-gsap-portfolio is a premium creative developer portfolio website built with Next.js, GSAP, and Three.js. The codebase is structured to support fluid transitions, hardware-accelerated animations, and responsive layout designs.

## Technical Stack & Key Features

* **GSAP Animations**—configured with ScrollTrigger and `@gsap/react` hooks to control scroll-driven timelines. Scroll actions map directly to animation parameters to maintain frame rates.
* **Smooth Scrolling**—powered by Lenis. It intercepts native scroll inputs to deliver uniform scroll speeds across different input devices—such as trackpads and mouse wheels—while syncing directly with the GSAP ticker.
* **WebGL & 3D Rendering**—integrates Three.js through React Three Fiber (`@react-three/fiber` and `@react-three/drei`). The workspace is configured to compile and render interactive 3D geometries and shader materials.
* **Page Transitions**—uses `next-transition-router` paired with custom GSAP timelines. It tracks path changes to animate full-screen transition overlays, manages layout scroll restoration points, and prevents layout shift during rendering.
* **Contact System**—built as a Next.js API route (`/api/contact`) backed by Nodemailer. It implements email validation, disposable domain checks, name character validation, and spam-prevention rules. In local development environments, it supports a fallback mechanism that writes submissions to `messages.txt` if SMTP connections fail.
* **Next.js & TypeScript Architecture**—set up under the App Router model using TypeScript. Layouts, loading states, and page structures are divided into modular client and server components.
* **Analytics Integration**—features out-of-the-box tracking configuration using Vercel Analytics and Google Analytics (via `@next/third-parties/google`).

## Repository Layout

The workspace is organized into a clean directory structure:

```
portfolio-root/
├── public/                 # Static assets, project images, and resumes
├── src/
│   ├── app/                # Next.js App Router entry points and API routes
│   │   ├── api/            # Backend API handlers (e.g., /api/contact)
│   │   ├── projects/       # Detail pages for selected works
│   │   ├── layout.tsx      # Main layout setting up fonts and global analytics
│   │   └── providers.tsx   # Global TransitionRouter and scroll lock providers
│   ├── components/
│   │   ├── canvas/         # Canvas drawing systems (e.g., AmbientGeometry)
│   │   ├── project/        # Project-specific subcomponents
│   │   ├── providers/      # Lenis smooth scroll wrapping context
│   │   ├── sections/       # Layout sections (About, Projects, Contact, Banner)
│   │   ├── shared/         # Reusable global elements (Navbar, Footer, Preloader)
│   │   └── ui/             # Typographic and button micro-interaction components
│   └── lib/                # Static data configurations and metadata utilities
├── .env.local              # Local environment credentials
├── next.config.mjs         # Next.js configuration settings
├── package.json            # Scripts, dependencies, and configuration metadata
└── tsconfig.json           # Typechecking configurations for TypeScript compiler
```

## Setup & Installation

Follow these steps to run the project locally.

### 1. Prerequisites
Ensure you have Node.js (version 18 or higher) and npm installed on your system.

### 2. Clone and Install
Clone the repository to your local directory and install the package dependencies:
```bash
git clone <repository-url>
cd nextjs-3d-gsap-portfolio
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory. Configure your Gmail App Password to enable the contact form SMTP transport:
```env
GMAIL_APP_PASSWORD=your_gmail_app_password
```

### 4. Running Scripts
Run the following npm scripts to build, test, or run the application:

* **Development Server**—launches the dev server with hot-reloading:
  ```bash
  npm run dev
  ```
* **Production Build**—compiles and optimizes the code for production deployment:
  ```bash
  npm run build
  ```
* **Start Server**—starts the built production application:
  ```bash
  npm run start
  ```
* **Linting**—checks the project for linting issues using ESLint:
  ```bash
  npm run lint
  ```
* **Auto-Formatting**—formats the entire codebase using Prettier:
  ```bash
  npm run format
  ```

## Licensing

This project is licensed under the MIT License. Feel free to modify and redistribute it according to the license guidelines.
