# Portfolio

The personal portfolio of [**Aitezaz Sikandar**](https://github.com/aitezazdev). Built with **Next.js 15**, **React 19**, **GSAP 3**, and **Lenis**, featuring hardware-accelerated motion choreography, interactive HTML5 canvas simulations, seamless page transitions, and an emerald-accented dark editorial design.

**Live Site:** [aitezazdev.vercel.app](https://aitezazdev.vercel.app)

---

## Features

- **Kinetic Motion & Smooth Scroll:** 60fps buttery scrolling powered by Lenis, coupled with ScrollTrigger parallax and delta-time compensated physics.
- **Persistent Curve Navigation:** Dennis Snellenberg-inspired full-screen menu with dynamic SVG curve morphing and GPU-composited drawer transitions.
- **Generative HTML5 Canvases:** Dual interactive canvas backgrounds including a constellation node mesh (`AmbientGeometry`) and a Perlin noise particle flow field (`FlowField`).
- **Resilient Contact Form:** Multi-channel email delivery using Resend API with Gmail SMTP fallback, honeypot spam protection, rate limiting, and a local dev file-logger (`messages.txt`).
- **Editorial Brutalist Design:** Void Emerald high-contrast palette pairing deep forest inky blacks (`#0A0F0D`) with radiant emerald highlights (`#34D399`) and Space Grotesk / Instrument Serif typography tokens.
- **Type-Safe Dynamic Routing:** Next.js App Router with Static Site Generation (SSG) for all project case studies (`/projects/[slug]`).
- **Accessible & Performance-First:** Native `prefers-reduced-motion` compliance, accessible keyboard drawer traps, and zero third-party render-blocking dependencies.

---

## Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Core Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [GSAP 3](https://gsap.com/) & [@gsap/react](https://gsap.com/resources/React)
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/)
- **Page Transitions:** [next-transition-router](https://github.com/madebyconor/next-transition-router)
- **Typography:** Geist Sans, Geist Mono, Space Grotesk, Instrument Serif
- **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Email Delivery:** [Nodemailer](https://nodemailer.com/) & [Resend](https://resend.com/)
- **Analytics:** [@vercel/analytics](https://vercel.com/analytics) & [@next/third-parties (Google Analytics)](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)

---

## Environment Variables

All environment variables are **completely optional** for local development. Anyone cloning or forking this repository can run the project immediately without configuring any environment variables.

| Variable | Type | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_GA_ID` | Optional | `undefined` | Google Analytics Measurement ID (`G-XXXXXXXXXX`). When omitted, Google Analytics is cleanly skipped with zero network requests and zero runtime errors. |
| `RESEND_API_KEY` | Optional | `undefined` | Resend REST API key (`re_...`). Primary delivery provider for contact inquiries. |
| `GMAIL_APP_PASSWORD` | Optional | `undefined` | Gmail SMTP 16-character App Password. Used as fallback email delivery via Nodemailer. |
| `CONTACT_EMAIL` | Optional | `site.email` | Destination email address for contact form submissions. Defaults to `aitezazsikandar@gmail.com`. |

> **Note for forks & clones:** In development (`NODE_ENV === 'development'`), if neither `RESEND_API_KEY` nor `GMAIL_APP_PASSWORD` is configured, form submissions are logged locally to `messages.txt` in the project root so the UI can be tested end-to-end without real email credentials.

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or 20+
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aitezazdev/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. *(Optional)* Create a `.env.local` file by copying the template:
   ```bash
   cp .env.example .env.local
   ```
   Add your keys if you want to test live email delivery or Google Analytics.

4. Start the local development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack / Next.js |
| `npm run build` | Create production build with static pre-rendering |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm run lint:fix` | Automatically fix fixable ESLint errors |
| `npm run format` | Format files using Prettier |

---

## Project Structure

```
src/
├── app/
│   ├── api/contact/        # Contact form endpoint (Resend + Nodemailer)
│   ├── projects/[slug]/    # Dynamic SSG project showcase routes
│   ├── globals.css         # Tailwind v4 @theme tokens & layer styles
│   ├── layout.tsx          # Root layout, typography, analytics
│   └── page.tsx            # Main single-page scroll orchestrator
├── components/
│   ├── canvas/             # HTML5 Canvas visual systems (AmbientGeometry, FlowField)
│   ├── home/               # Section orchestrator & transition controllers
│   ├── project/            # Project showcase details & gallery modals
│   ├── providers/          # Smooth scroll (Lenis) context providers
│   ├── sections/           # Modular page sections (Banner, About, Projects, etc.)
│   ├── shared/             # Global components (Navbar, CustomCursor, Preloader)
│   └── ui/                 # Atomic animated primitives (Buttons, Dividers, Links)
├── lib/                    # Configuration, project catalog, GSAP setup
└── utils/                  # Client storage & helper utilities
```

---

## Contributing

Contributions, issues, and feature requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
