// Bakes the correct <title>/<meta description>/<link canonical>/OG/Twitter tags into a
// static dist/<route>/index.html for every route, so crawlers and SEO tools that only read
// raw HTML (no JS execution) see the right canonical per page instead of always falling
// back to the homepage. Vercel serves a matching static file before applying the SPA
// rewrite (vercel.json), so this works with zero hosting config changes.
//
// Without this, SEO.tsx's client-side useEffect only fixes the DOM after React hydrates,
// which crawlers reading the initial HTML response never see.
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const SITE_URL = 'https://lsrrealty.com';

// Transpile + bundle constants.tsx to plain ESM so we can read PROJECTS / SECTOR_MAPS data.
const bundlePath = path.join(root, '.prerender-constants.mjs');
execSync(
  `"${path.join(root, 'node_modules/.bin/esbuild')}" constants.tsx --bundle --platform=node --format=esm --outfile="${bundlePath}"`,
  { cwd: root, stdio: 'inherit' }
);
const { PROJECTS, SECTOR_MAPS } = await import(`${pathToFileURL(bundlePath)}?t=${Date.now()}`);
fs.unlinkSync(bundlePath);

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

function renderRoute({ route, title, description, image }) {
  const url = `${SITE_URL}${route}`;
  const ogImage = image ?? `${SITE_URL}/images/Logo2.png`;
  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${ogImage}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${ogImage}" />`);

  const outDir = path.join(distDir, route.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Static pages — keep these in sync with each page's <SEO title=... description=... /> props.
const staticRoutes = [
  { route: '/about', title: "About LSR Realty | Institutional Real Estate Advisory in Gurgaon", description: "LSR Realty is the investment advisory arm of LSR Group, bringing institutional grade, research backed, and transparent real estate advisory to HNI and NRI investors in Gurgaon." },
  { route: '/services', title: "Real Estate Advisory Services in Gurgaon | LSR Realty", description: "LSR Realty offers institutional grade real estate advisory in Gurgaon: office leasing, retail leasing, investment advisory, market research, deal structuring and NRI services." },
  { route: '/projects', title: "Projects | Gurgaon Investment & Leasing Opportunities | LSR Realty", description: "Browse LSR Realty's curated portfolio of Gurgaon real estate investment and leasing opportunities, vetted for legal compliance, construction quality and appreciation potential." },
  { route: '/maps', title: "Gurgaon Sector Maps & Master Plan 2031 | LSR Realty", description: "Explore sector wise maps of Gurugram, DLF phases, Golf Course Road, Dwarka Expressway, Sohna Road and the Gurgaon Manesar Master Plan 2031. View location guides and connect with LSR Realty on available inventory." },
  { route: '/careers', title: "Careers at LSR Realty | Join Gurgaon's Premier Real Estate Advisory", description: "Explore open roles at LSR Realty, including Sales Runner and Sales Telecaller Intern positions in Gurgaon. Build a career in institutional-grade real estate investment advisory." },
  { route: '/contact', title: "Contact LSR Realty | Gurgaon Real Estate Investment Advisory", description: "Get in touch with LSR Realty for a 15 minute consultation on real estate investment advisory, portfolio structuring or NRI services in Gurgaon." },
  { route: '/privacy-policy', title: "Privacy Policy | LSR Realty", description: "Read LSR Realty's privacy policy covering how we collect, use and protect your personal information." },
];

for (const r of staticRoutes) renderRoute(r);

// Project detail pages — mirrors pages/ProjectDetail.tsx's pageTitle/pageDescription.
for (const project of PROJECTS) {
  renderRoute({
    route: `/projects/${project.id}`,
    title: `${project.name} | ${project.location} | LSR Realty`,
    description: `${project.name} in ${project.location}, ${project.priceRange}. ${project.type}. ${project.status}. View inventory, pricing and floor plans with LSR Realty.`,
    image: project.image?.startsWith('http') ? project.image : `${SITE_URL}${project.image}`,
  });
}

// Map detail pages — mirrors pages/MapDetail.tsx's pageTitle/pageDescription.
for (const sector of SECTOR_MAPS) {
  const isMasterPlan = sector.id === 'gurgaon-manesar-master-plan';
  renderRoute({
    route: `/maps/${sector.id}`,
    title: isMasterPlan
      ? `${sector.name} (Gurugram Manesar Master Plan 2031) | LSR Realty`
      : `${sector.name} Map | Gurgaon Manesar Master Plan 2031 | LSR Realty`,
    description: isMasterPlan
      ? `${sector.description} Also known as the Gurugram Manesar Master Plan 2031.`
      : `${sector.description} View the official, government approved layout map for ${sector.name}, part of the Gurgaon Manesar Master Plan 2031 (Gurugram Manesar Master Plan 2031).`,
    image: `${SITE_URL}${sector.zoom}`,
  });
}

console.log(`Prerendered SEO HTML for ${staticRoutes.length + PROJECTS.length + SECTOR_MAPS.length} routes.`);
