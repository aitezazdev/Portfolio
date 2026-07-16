# Portfolio

A creative developer portfolio built with Next.js 15, GSAP, Three.js, and Lenis. It features scroll-driven animations, animated page transitions, 3D elements, smooth scrolling, and a working contact form.

**Live Site:** [aitezaz.xyz](https://aitezaz.xyz)

## Features

- Scroll-driven GSAP animations using ScrollTrigger
- Smooth scrolling powered by Lenis
- 3D rendering with React Three Fiber and Drei
- Animated page transitions using next-transition-router
- Custom cursor with interactive hover states
- Film grain overlay and marquee strips
- Contact form backed by Nodemailer with validation and spam checks
- Vercel Analytics and Google Analytics integration
- Fully typed with TypeScript

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/aitezazdev/Portfolio.git
cd Portfolio
npm install
```

Create a `.env.local` file in the root:

```env
GMAIL_APP_PASSWORD=your_gmail_app_password
```

Start the development server:

```bash
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |

## Project Structure

```
src/
├── app/                  # App Router pages, layouts, and API routes
│   ├── api/              # Backend handlers (contact form)
│   └── projects/         # Individual project pages
├── components/
│   ├── canvas/           # WebGL and 3D canvas components
│   ├── project/          # Project detail components
│   ├── providers/        # Lenis smooth scroll provider
│   ├── sections/         # Page sections (Banner, About, Projects, Contact)
│   ├── shared/           # Navbar, Footer, Preloader, Custom Cursor
│   └── ui/               # Animated text and button components
├── lib/                  # Metadata, navigation config, project data
└── utils/                # Utility functions
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT. See [LICENSE](LICENSE) for details.
