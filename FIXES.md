# Audit fixes (Nov 2026)

**Security / contact**
- Rate limiter no longer trusts a spoofable `x-forwarded-for` (uses platform headers first); added global cap, honeypot field, body-size and type validation, Resend failure logging. Still in-memory: for a hard limit use Upstash/Vercel KV.
- Form: stale server error cleared on edit/resubmit, clipboard failures handled, lowercase email + `mailto:` link, valid `<button>` markup, `role="alert"` on errors.
- `.env.local` and `messages.txt` removed from the package. **Rotate your Gmail app password and Resend key if the old zip was shared.**
- New optional env var `CONTACT_FROM` (see `.env.example`). Removed the broken `npm test` script.

**Theme / contrast**
- All leftover terracotta/warm-grey hex values replaced with theme tokens. New tokens: `accent-deep`, `on-accent`.
- Buttons use dark text on green; hero ticker, serif headings and project text on cream use `accent-deep`; dim labels on dark use `warm-light`/`gray-soft`; placeholders lightened. Hero dots darkened so they're visible on cream.

**Animation / motion**
- Word reveal no longer double-dims (was ~5% visible). Reduced motion respected by GSAP sections, Lenis, preloader and page transitions.
- Preloader: once per 12h (localStorage), skip button, proper Urdu/Hindi/Arabic/Pashto fonts + lang/dir, body scroll lock now actually applied.
- Cursor hidden until first mouse move; Lenis only disabled for coarse pointers (not touch laptops); hero intro de-duplicated, no flash on repeat visits, no listener leak; orchestrator only dispatches on state change; dividers animate via transform; tech filter refreshes ScrollTrigger; tech icon hover is a lift not a spin; marquee pauses off-screen and no longer polls.

**Design / content**
- Project pages now show type, role, description and stat tiles; desktop project rows show thumbnails; marquee text no longer repeats "available for work"; credential titles smaller/looser; About copy references real projects (please personalise).

**A11y / SEO / perf**
- Menu: dialog semantics, focus moves in/out, Tab trap, real links, `h-dvh`. `alt=""` on decorative tech icons, `aria-pressed` on filters, focus-visible parity on button/link hover effects.
- Real 1200x630 OG image, per-project generated OG images, PNG icons + apple-touch-icon + manifest, JSON-LD Person, theme-color, static sitemap date, no `priority` on hidden preview images, `safeSessionStorage` everywhere, figma icon 1200px -> 128px.

**Not changed**
- Duplicated hidden desktop/mobile headings in Projects (guarding them risks unrevealed headings after a resize).
- Tech icon PNG/SVG sources that are only ~58px: replace with SVGs for crisper retina rendering.

## Redesign: Vermilion + Bone, Apple-style typography
- New palette: bone `#F3EEE5`, warm ink `#11100E`, vermilion `#FF4D2E` (contrast-checked; ink on vermilion 5.75:1).
- Fonts: Geist (display/body), Geist Mono, Fraunces italic for serif accents. Still loaded via `next/font/google`.
- Headings are sentence case, semibold, tight tracking (`AnimateHeading`, hero, About, Tech, Projects, project pages).
- Services: rounded stacked cards (the GSAP pin behaviour is unchanged).
- Project page: the first screenshot sits in a browser frame with a soft vermilion glow.
- Regenerated `og-image.png`, `icon-192/512.png` and `apple-touch-icon.png` in the new palette.
- Not done: full bento grid for Tech Stack and a cursor-tilt project index (the existing project list is kept).

## Hero backdrop (HeroAurora)
- Replaced the constellation-of-dots background with a slow "sunrise" gradient (vermilion, amber, rose) on bone paper.
- Added fine grain, a faint hairline 6-column grid, and mouse parallax on the colour blobs.
- It is pure CSS plus one small pointer handler (no canvas). It is static under reduced motion.
- Files: `components/canvas/HeroAurora.tsx` and the "Hero aurora" block in `globals.css`. The old `AmbientGeometry` is no longer used in the hero.

## Design pass 3
- Tech Stack is a bento grid of rounded category cards with different column spans (cards fill the width when a filter is active).
- Navbar links sit in a frosted-glass pill.
- About timeline entries are rounded cards on desktop.
- The footer opens with a large "Aitezaz Sikandar" wordmark.
- A thin vermilion reading-progress line runs along the top (`components/ui/ScrollProgress.tsx`).
- The project list already had cursor-following previews and mono numbers, so it was only restyled.

## Projects list and project page audit
- Home project list: removed the always-visible small thumbnail. The preview now shows only on hover.
- Project page: fixed a sideways-scroll bug on phones (the glow behind the browser frame stuck out past the page).
- Project page: hero and gallery screenshots use the images' real 1919x923 shape, so nothing is cropped or zoomed. Parallax cropping was removed.
- Project page: the browser frame shows the real live-site host instead of a made-up ".app" address.
- Project page: the Previous/Next titles are sentence case, "Key moves" text is larger on phones, and the numbers line up with the text.
- Project page: the scroll-to-top button sits below the email on phones and beside it on larger screens.

## Responsive pass (15 screen sizes)
Tested home and project pages at 320, 360, 375, 390, 412 and 430 wide phones, phone landscape (844x390), iPad mini, iPad Air and iPad Pro, 1280, 1366, 1512, 1920 and 2560 wide screens. There is no horizontal overflow and no console errors at any size.
- Timeline dates on phones now sit beside the label (e.g. "Industry · 2026") instead of colliding with it.
- Tech bento: cards are two across on tablets and full width on small phones, and tile names are no longer cut off.
- Contact: the outer and inner card padding is smaller on small phones so fields are wider, and the email address now scales to fit instead of breaking mid-word.
- Hero name is larger on phones. The gaps between Services and Tech are tighter on phones.
- Footer links and email links have bigger tap areas on touch devices (44px).
- Project list rows show their tech chips on touch tablets (there is no hover).
- Project card tags on phones are 10px (was 9px) and the other tiny mono labels are 11px.
- The About image card no longer has a green tint (FlowField trail colour).
- The hero glow no longer uses a heavy blur filter, which slowed large screens.

## Fonts and mobile text fixes
- Geist, Geist Mono and Fraunces are now self-hosted from npm (`@fontsource-variable/*`, imported at the top of `globals.css`) instead of `next/font/google`. They no longer fall back to Arial/Times when Google Fonts can't be reached. **Run `npm install` after replacing the project.**
- The hero role line (e.g. "MERN STACK DEVELOPER") had a fixed width, so on small screens it wrapped and overlapped itself. It is now full width, single-line, and smaller on phones.
- The footer name no longer wraps onto two lines. It sits on one line and scales with the screen (about 24px at 320 wide up to 184px at 1920).
- Font sizes and weights were checked at 320, 375, 390, 430, 768, 1024, 1440 and 1920 wide. Section headings go 40px to 104px (semibold), body text 16px to 20px (regular), card titles 24px to 48px (semibold), and tech tile names are 13px (medium).

## Storm loader (superseded by the katana loader in Round 5)

- `GlobalPreloader.tsx`: a quiet wordmark ("Aitezaz" sans + "Sikandar" serif italic, the same pair as the hero) with a hairline progress bar under slanted rain. When the page is ready: stillness, then a thin dim leader finds its way down, the return stroke lights the scene (one flash + one soft echo, photosensitivity-safe), the bolt flickers, the screen splits along it, the cut edge glows molten and the halves fall away to the hero.
- Lightning is generated with midpoint displacement (real branching), cool blue-white with only a faint warm halo; the vermilion appears only on the cut edge.
- Removed: Skip button, multilingual greeting cycling, "LOADING %" HUD, speed lines, glint orb, confetti sparks. Progress is written straight to the DOM (no per-frame React re-renders).
- First visit: full loader (about 3.5s). Returning after 12h: short version. Within 12h or reduced motion: skipped.
- Sound is synthesized (crack + rolling thunder), off by default, toggled by the small "Sound" label.
- Pre-paint dark layer (`html.pl`) removes the white flash before hydration. Top scroll-progress line removed.
- If you haven't yet, run `npm install` (self-hosted fontsource packages).

## Colour decision (kept warm black, removed purple)

- Tried an indigo-tinted dark theme and rejected it: navy/violet surfaces with a violet glow are the most recognisable "AI-generated" palette. Final palette is paper cream `#F3EEE5`, warm near-black `#11100E` / `#0D0C0B`, and one vermilion accent `#FF4D2E`.
- Hero sun is warm only: an ember core fading to a burnt-sienna rim (no pink or violet blobs). Loader background is warm near-black `#0C0B0A` with cool blue-white lightning as the only cold element.
- Small vermilion text on cream uses the deep tone `#B8300F` (5.2:1); body greys on cream are above 6:1.

## Extra audit pass (axe, keyboard, SEO, robustness)

- Skip link: `<main id="main-content">` is now focusable (`tabIndex={-1}`), and the logo's `/#top` link now has a real `id="top"` target on the hero.
- Keyboard: the floating menu button used to receive focus while hidden at the top of the page; it now uses `autoAlpha`, so it is out of the tab order until it appears.
- Screen readers: the hover-reveal title overlay in the project list is `aria-hidden`, so project names are no longer announced twice.
- Added a branded `not-found.tsx` (404) and `error.tsx` (runtime error with a Try again button).
- Security headers in `next.config.mjs`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Removed the unused Noto Arabic/Devanagari Google fonts (they only served the old loader greetings). The site now makes no Google Fonts requests at all, and builds without internet access.
- Verified: axe-core reports 0 violations on the project page and none on the home page apart from one false positive (the off-screen hover line of the rolling-text buttons); Tab order is logical with a visible focus ring on every stop; first load JS is 205 kB.
- Known, not changed: the in-memory contact-form rate limiter is per serverless instance (use Upstash/Redis for a hard limit); tech icons are ~58px rasters (a touch soft on 3x screens); the Vercel analytics script 404s locally only.
- Mobile polish from the same pass: project-card tech chips are 11px (were 10px) and the "or open in your mail app" link is a 44px tap target. Re-ran the 15-viewport matrix: no horizontal overflow and no console errors on any page.

## Identity pass (voice, cursor-reactive surname, Urdu name)

- Copy rewritten in Aitezaz's voice, built only from facts in the project data: the recurring theme is things that keep working when something breaks (Groq to Gemini fallback, 5-tier Gemini fallback + offline mode, DB circuit breaker with a mock catalog). New hero line, About text, Services, project card descriptions, section headings ("Who's behind the code", "How I work", "What I reach for", "Things I've shipped"), Contact line and SEO descriptions. Please read it once and change anything that isn't true to you.
- Cursor-reactive "Sikandar" (`components/ui/ReactiveSerif.tsx`): each letter moves along Fraunces' weight / softness / wonk axes by its distance to the cursor; one wave runs through it after the loader (so touch screens get it too). Off for reduced motion; screen readers get the text once; growth is capped on phones so nothing overflows.
- Urdu / Pashto script name (اعتزاز سکندر) in the footer, in Nastaliq (Noto Nastaliq Urdu, SIL OFL, subset to the name = 38 KB; licence in `public/fonts`).
- Kept the rotating "available for work" badge and the scroll-reactive marquee (it speeds up and skews with scroll, so it is not a stock marquee). The marquee now pauses on hover (WCAG 2.2.2) and its keywords were rewritten.
- Removed meaningless numbering and "(Label)" mono captions: service card numbers and bullet numbers, "(Overview)/(Architecture)/(Engineering)", numbered "Key moves", "(About Me)", "(Experience)", "(Services)". The project list index (01-05) stays, because it is a curated order.


## Copy rewrite (human voice pass)
- All visible copy rewritten in plain first-person language: no em/en dashes, no "not X but Y" lines, no forced triplets, no hype words. Hero, About, Services, TechStack, Contact (including form messages), marquee, project card text, 404/error pages and SEO descriptions. Only facts from your projects and credentials are used. Please read it once and change anything that doesn't sound like you.


## Round 4
- Services: stacked cards now have equal space above and below each title.
- Hero: sun lowered, tagline darker, outline/light buttons given a solid paper fill so everything reads over the glow.
- Copy: no contractions in body text (headings keep them), About rewritten around you (studies, SMIT, e-strats, what you like building) with no tool name-dropping. GPA 3.65.
- Loader: slower and staged. Wordmark settles, glow rises, faint distant flash, held pause, bolt stays visible about half a second, the cut glows, halves part over 1.5s. Returning visitors still get the short version.

## Round 5: katana loader
- Thunder strike replaced by a katana cut: embers drift under a low sun, a blade glint twinkles, one fast tapered stroke with sparks, a held beat with the hairline glowing, then the screen and the wordmark are sliced in two and the halves slide apart. Flash kept dim (photosensitivity-safe). Sound toggle now plays a shing and a soft thud.

## Round 6: final review pass
- Unknown project slugs now return a real 404. Page titles use "|" instead of a spaced hyphen. Contact and API messages reworded. Bigger tap targets on filter pills and the back link. Tech icons slightly desaturated until hover. Removed an unused component and stale loader notes.

## Round 7: mobile projects
- Phones now show the first project as a featured card (image, number chip, title, two to three line description, tags) and the other four as compact rows (thumbnail, number, title, tags, arrow). Section is about half as tall. Desktop is unchanged.

- Round 7 update: all five mobile project cards are now the same size and stack as you scroll (each new card slides up over the previous one, which stays peeking behind). The compact layout was dropped.

## Round 8: merged copy
- Took the best of the Gemini suggestions: contact line and message placeholder, the titles Frontend Engineering and Reliability & Performance, and Full-Stack Engineer in the rotating role. Kept the rest of the copy because the suggested text overclaimed (traffic, dozens of screens, production systems), misspelled e-strats and sounded like a CV.

- Round 9: hero line is now "Full-stack engineer building fast, scalable, and reliable web applications." (also site.tagline, so it feeds the manifest).

- Round 10: Services cards have a serif one-liner in the empty left column, project rows have "View project" on the title line, hero line is larger.

## Round 11: Favicon and app icons

- The tab icon was blank because icon-192, icon-512 and apple-touch-icon were flat cream squares, and metadata also pointed at the old logo.webp.
- New mark: serif A with a vermilion dot on warm black. Added src/app/icon.png, apple-icon.png and favicon.ico (Next serves them automatically), refreshed the public PNGs, and added a padded maskable icon for the manifest.
- Removed the old logo.webp and the manual icons block in metadata.

## Round 12: Contact form

- Restored the original working contact API route from the first zip.
- Removed the hidden "website" honeypot field, which browser autofill can fill and make the server silently drop a real message.
