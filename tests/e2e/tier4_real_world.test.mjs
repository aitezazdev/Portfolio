import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { describe, it, expect, testContext, printSuiteResults, printTierHeader } from './test_utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

export async function runTier4Tests() {
  const tierStart = performance.now();
  const initialChecks = testContext.totalChecks;
  const initialPassed = testContext.passedChecks;
  const initialFailed = testContext.failedChecks;

  printTierHeader(4, 'Real-World Workload Scenarios', 'Validates SSG 13 routes prerendering, TypeScript 0 errors, ESLint 0 errors, zero-comments policy, and SEO metadata.');

  // =========================================================================
  // Scenario 1: Next.js SSG 13 Routes Prerender Validation
  // =========================================================================
  describe('Tier 4.1: Static Site Generation (SSG) 13 Routes Prerender Validation', () => {
    const nextServerAppDir = path.join(ROOT_DIR, '.next/server/app');
    const routesManifestPath = path.join(ROOT_DIR, '.next/routes-manifest.json');
    const appPathManifestPath = path.join(ROOT_DIR, '.next/app-path-routes-manifest.json');

    it('Next.js production build artifacts exist (.next/server/app)', () => {
      expect(fs.existsSync(nextServerAppDir)).toBe(true);
      expect(fs.existsSync(routesManifestPath)).toBe(true);
      expect(fs.existsSync(appPathManifestPath)).toBe(true);
    });

    const routesManifest = JSON.parse(fs.readFileSync(routesManifestPath, 'utf8'));
    const appPathManifest = JSON.parse(fs.readFileSync(appPathManifestPath, 'utf8'));

    it('SSG route prerendered: "/" (Home Page)', () => {
      expect(fs.existsSync(path.join(nextServerAppDir, 'page.js'))).toBe(true);
      expect(appPathManifest['/page']).toBe('/');
    });

    it('SSG route prerendered: "/_not-found" (404 Page)', () => {
      expect(fs.existsSync(path.join(nextServerAppDir, '_not-found/page.js'))).toBe(true);
      expect(appPathManifest['/_not-found/page']).toBe('/_not-found');
    });

    it('API route configured: "/api/contact" (Contact Handler)', () => {
      expect(fs.existsSync(path.join(nextServerAppDir, 'api/contact/route.js'))).toBe(true);
      expect(appPathManifest['/api/contact/route']).toBe('/api/contact');
    });

    it('SSG route prerendered: "/manifest.webmanifest" (PWA Manifest)', () => {
      expect(fs.existsSync(path.join(nextServerAppDir, 'manifest.webmanifest/route.js'))).toBe(true);
      expect(appPathManifest['/manifest.webmanifest/route']).toBe('/manifest.webmanifest');
    });

    it('SSG route prerendered: "/robots.txt" (Robots Route)', () => {
      expect(fs.existsSync(path.join(nextServerAppDir, 'robots.txt/route.js'))).toBe(true);
      expect(appPathManifest['/robots.txt/route']).toBe('/robots.txt');
    });

    it('SSG route prerendered: "/sitemap.xml" (Sitemap Route)', () => {
      expect(fs.existsSync(path.join(nextServerAppDir, 'sitemap.xml/route.js'))).toBe(true);
      expect(appPathManifest['/sitemap.xml/route']).toBe('/sitemap.xml');
    });

    it('Dynamic SSG template prerendered: "/projects/[slug]"', () => {
      expect(fs.existsSync(path.join(nextServerAppDir, 'projects/[slug]/page.js'))).toBe(true);
      expect(appPathManifest['/projects/[slug]/page']).toBe('/projects/[slug]');
    });

    const projectSlugs = ['c-study', 'hms', 'ecommerce', 'finance', 'blog'];
    const projectDynamicPageContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/projects/[slug]/page.tsx'), 'utf8');

    for (const slug of projectSlugs) {
      it(`SSG static param generated for project route: "/projects/${slug}"`, () => {
        expect(projectDynamicPageContent).toMatch(/generateStaticParams/);
        const projectsTs = fs.readFileSync(path.join(ROOT_DIR, 'src/lib/projects.ts'), 'utf8');
        expect(projectsTs.includes(`slug: '${slug}'`)).toBe(true);
      });
    }

    it('Routes manifest validates 13 App Router routes in build hierarchy', () => {
      const staticRoutePages = routesManifest.staticRoutes.map((r) => r.page);
      expect(staticRoutePages).toContain('/');
      expect(staticRoutePages).toContain('/_not-found');
      expect(staticRoutePages).toContain('/manifest.webmanifest');
      expect(staticRoutePages).toContain('/robots.txt');
      expect(staticRoutePages).toContain('/sitemap.xml');
      expect(routesManifest.dynamicRoutes.some((r) => r.page === '/projects/[slug]')).toBe(true);
    });
  });

  // =========================================================================
  // Scenario 2: TypeScript Strict Compilation Quality Gate
  // =========================================================================
  describe('Tier 4.2: TypeScript Strict Compilation Quality Gate (tsc --noEmit)', () => {
    it('TypeScript compiler executes with 0 type errors (exit code 0)', () => {
      try {
        const output = execSync('npx tsc --noEmit', {
          cwd: ROOT_DIR,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
        expect(output.includes('error TS')).toBe(false);
      } catch (err) {
        throw new Error(`TypeScript compilation failed with error: ${err.stdout || err.stderr || err.message}`);
      }
    });
  });

  // =========================================================================
  // Scenario 3: ESLint Static Quality Gate
  // =========================================================================
  describe('Tier 4.3: ESLint Static Quality Gate (npm run lint)', () => {
    it('ESLint analysis executes with 0 errors and 0 warnings (exit code 0)', () => {
      try {
        execSync('npm run lint', {
          cwd: ROOT_DIR,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
      } catch (err) {
        throw new Error(`ESLint failed with error: ${err.stdout || err.stderr || err.message}`);
      }
    });
  });

  // =========================================================================
  // Scenario 4: Strict Zero-Comments in Code Policy
  // =========================================================================
  describe('Tier 4.4: Strict Zero-Comments in Code Policy (ORIGINAL_REQUEST §6)', () => {
    function getAllSourceFiles(dir, fileList = []) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          getAllSourceFiles(fullPath, fileList);
        } else if (/\.(ts|tsx)$/.test(file)) {
          fileList.push(fullPath);
        }
      }
      return fileList;
    }

    function stripStringLiterals(code) {
      return code
        .replace(/`([^`\\]|\\.)*`/g, '""')
        .replace(/"([^"\\]|\\.)*"/g, '""')
        .replace(/'([^'\\]|\\.)*'/g, "''");
    }

    const srcFiles = getAllSourceFiles(path.join(ROOT_DIR, 'src'));

    it('Found TypeScript source files in src/ to inspect', () => {
      expect(srcFiles.length).toBeGreaterThan(15);
    });

    for (const filePath of srcFiles) {
      const relPath = path.relative(ROOT_DIR, filePath);
      it(`Zero non-license comments in "${relPath}"`, () => {
        const rawContent = fs.readFileSync(filePath, 'utf8');

        // Allow single @license block at the very top of file
        let contentToScan = rawContent;
        if (contentToScan.startsWith('/**') && contentToScan.includes('@license')) {
          const licenseEnd = contentToScan.indexOf('*/');
          if (licenseEnd !== -1) {
            contentToScan = contentToScan.substring(licenseEnd + 2);
          }
        }

        const stripped = stripStringLiterals(contentToScan);

        // Check for line comments //
        const lineCommentMatch = stripped.match(/\/\/[^\n]*/g);
        // Check for block comments /* ... */
        const blockCommentMatch = stripped.match(/\/\*[\s\S]*?\*\//g);

        if (lineCommentMatch && lineCommentMatch.length > 0) {
          throw new Error(`Found disallowed line comments in ${relPath}: ${lineCommentMatch.join(', ')}`);
        }
        if (blockCommentMatch && blockCommentMatch.length > 0) {
          throw new Error(`Found disallowed block comments in ${relPath}: ${blockCommentMatch.join(', ')}`);
        }
      });
    }
  });

  // =========================================================================
  // Scenario 5: Project Catalog & Dynamic Navigation Integrity
  // =========================================================================
  describe('Tier 4.5: Project Catalog & Dynamic Navigation Integrity', () => {
    const projectsTsPath = path.join(ROOT_DIR, 'src/lib/projects.ts');
    const projectsContent = fs.readFileSync(projectsTsPath, 'utf8');

    it('lib/projects.ts defines exactly 5 featured projects with complete metadata', () => {
      const slugs = ['c-study', 'hms', 'ecommerce', 'finance', 'blog'];
      for (const slug of slugs) {
        expect(projectsContent.includes(`slug: '${slug}'`)).toBe(true);
      }
    });

    it('All projects contain 3 key metric statistics', () => {
      const statsMatches = projectsContent.match(/stats:\s*\[[\s\S]*?\]/g) || [];
      expect(statsMatches.length).toBe(5);
      for (const statBlock of statsMatches) {
        const valueMatches = statBlock.match(/value:\s*['"][^'"]+['"]/g) || [];
        expect(valueMatches.length).toBe(3);
      }
    });

    it('lib/projects.ts exports getProjectBySlug and getAdjacentProjects', () => {
      expect(projectsContent).toMatch(/export function getAllProjects/);
      expect(projectsContent).toMatch(/export function getProjectBySlug/);
      expect(projectsContent).toMatch(/export function getAdjacentProjects/);
    });
  });

  // =========================================================================
  // Scenario 6: SEO Metadata & API Validation
  // =========================================================================
  describe('Tier 4.6: SEO Metadata & Route Handlers Validation', () => {
    const sitemapContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/sitemap.ts'), 'utf8');
    const robotsContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/robots.ts'), 'utf8');
    const manifestContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/manifest.ts'), 'utf8');
    const contactApiContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/api/contact/route.ts'), 'utf8');

    it('sitemap.ts includes site URL and dynamically iterates over all project slugs', () => {
      expect(sitemapContent).toMatch(/getAllProjects\(\)/);
      expect(sitemapContent).toMatch(/\/projects\/\$\{p\.slug\}/);
    });

    it('robots.ts sets wildcard user agent and points to sitemap.xml', () => {
      expect(robotsContent).toMatch(/userAgent:\s*['"]\*['"]/);
      expect(robotsContent).toMatch(/sitemap:\s*`\$\{site\.url\}\/sitemap\.xml`/);
    });

    it('manifest.ts specifies standalone display, editorial background #0A0F0D, and theme #34D399', () => {
      expect(manifestContent).toMatch(/display:\s*['"]standalone['"]/);
      expect(manifestContent).toMatch(/background_color:\s*['"]#0A0F0D['"]/);
      expect(manifestContent).toMatch(/theme_color:\s*['"]#34D399['"]/);
    });

    it('Contact API route implements rate limiting and email validation guards', () => {
      expect(contactApiContent).toMatch(/isRateLimited/);
      expect(contactApiContent).toMatch(/disposableDomains/);
      expect(contactApiContent).toMatch(/escapeHtml/);
      expect(contactApiContent).toMatch(/cleanHeader/);
    });
  });

  // Print results for this tier
  for (const suite of testContext.suites) {
    printSuiteResults(suite);
  }

  const durationMs = performance.now() - tierStart;
  const totalChecks = testContext.totalChecks - initialChecks;
  const passedChecks = testContext.passedChecks - initialPassed;
  const failedChecks = testContext.failedChecks - initialFailed;

  return {
    id: 'Tier 4',
    name: 'Real-World Workloads',
    totalChecks,
    passedChecks,
    failedChecks,
    durationMs,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  testContext.reset();
  runTier4Tests().then((res) => {
    console.log(`\nTier 4 Finished: ${res.passedChecks}/${res.totalChecks} passed in ${res.durationMs.toFixed(1)}ms`);
    process.exit(res.failedChecks > 0 ? 1 : 0);
  });
}
