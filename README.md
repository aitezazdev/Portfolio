# Portfolio

The personal portfolio of [**Aitezaz Sikandar**](https://github.com/aitezazdev), a full-stack engineer from Pakistan. Built with Next.js 15, React 19, GSAP and Lenis, with a cream paper and warm near-black design accented in vermilion.

**Live site:** [aitezazdev.vercel.app](https://aitezazdev.vercel.app)

---

## Features

- **Katana intro loader:** a short cinematic intro where a blade cuts the screen open. It plays in full on a first visit, runs a quicker version after a while, and is skipped for people who prefer reduced motion.
- **Smooth scroll and motion:** Lenis scrolling with GSAP ScrollTrigger reveals, pinned sections and a cursor-reactive hero name.
- **Projects:** a numbered project list on desktop and a stacking card layout on mobile, with a case study page for every project at `/projects/[slug]`.
- **Contact form:** emails delivered through Resend, with Gmail SMTP as a fallback, plus input validation and rate limiting. In development without credentials, messages are saved to `messages.txt`.
- **Aitezaz portrait:** the About photo is drawn on canvas as a pixel-art image that builds itself with a vermilion scan line when it scrolls into view. All tone mapping, lighting and pixel mapping happen in code, so any photo works.
- **Self-hosted fonts:** Geist, Geist Mono and Fraunces, with no third-party font requests.
- **SEO and sharing:** structured metadata, Open Graph image, sitemap, robots file, web manifest and a full set of app icons.
- **Accessible by default:** keyboard friendly navigation, readable contrast and `prefers-reduced-motion` support.

---

## Using your own portrait

The About section turns `public/portrait/photo.webp` into a pixel-art portrait at runtime.

- Replace that file with your own photo. A cut-out with a transparent background (PNG or WebP) works best, roughly 4:5, with your face in the upper half.
- Delete the file and the section falls back to the animated flow field, so the site never breaks.
- Levels, side lighting, shadow fade and the pixel pattern are all in `src/components/canvas/AitezazPortrait.tsx`.

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [GSAP](https://gsap.com/) and [Lenis](https://lenis.darkroom.engineering/)
- **Page transitions:** [next-transition-router](https://github.com/madebyconor/next-transition-router)
- **Typography:** Geist, Geist Mono and Fraunces via [Fontsource](https://fontsource.org/)
- **Icons:** [Lucide React](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/)
- **Email:** [Resend](https://resend.com/) and [Nodemailer](https://nodemailer.com/)
- **Analytics:** [@vercel/analytics](https://vercel.com/analytics) and optional Google Analytics

---

## Getting Started

### Prerequisites

- Node.js 18.17 or newer
- npm, pnpm or yarn

### Installation

```bash
git clone https://github.com/aitezazdev/Portfolio.git
cd Portfolio
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

All variables are optional, so the site runs locally without any of them.

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key (`re_...`). Main way contact messages are emailed. Works over HTTPS, so it also works on networks that block mail ports. |
| `GMAIL_APP_PASSWORD` | Gmail App Password, used as the fallback sender. Needs 2-step verification on the Google account. |
| `CONTACT_EMAIL` | Where messages are delivered. Defaults to the email in `src/lib/site.ts`. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (`G-XXXXXXXXXX`). Analytics is skipped when this is empty. |

**Good to know**

- Resend's free test sender can only deliver to the email address you used to sign up to Resend. Use the same address as `CONTACT_EMAIL`, or verify your own domain.
- In development, if sending fails or no keys are set, the message is saved to `messages.txt` and the form still shows success. Check that file if nothing arrives.
- After changing variables on Vercel, redeploy so they take effect.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format files with Prettier |

---

## Project Structure

```
src/
├── app/
│   ├── api/contact/        # Contact form endpoint
│   ├── projects/[slug]/    # Project case study pages
│   ├── icon.png            # Favicon and app icons
│   ├── manifest.ts         # Web app manifest
│   ├── globals.css         # Tailwind v4 theme tokens and global styles
│   ├── layout.tsx          # Root layout, fonts and analytics
│   └── page.tsx            # Home page
├── components/
│   ├── canvas/             # Hero aurora, flow field and portrait
│   ├── home/               # Scroll orchestration
│   ├── project/            # Project detail page
│   ├── providers/          # Smooth scroll provider
│   ├── sections/           # Hero, About, Services, Projects, Tech stack, Contact
│   ├── shared/             # Navbar, footer, cursor, preloader
│   └── ui/                 # Small animated building blocks
├── lib/                    # Site data, project list, metadata, GSAP setup
└── utils/                  # Helpers
public/
├── fonts/                  # Self-hosted font files
├── Projects/ Services/     # Images
└── og-image.png            # Social sharing image
```

---

## Contributing

Issues and suggestions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

Released under the MIT License. See [LICENSE](LICENSE).
