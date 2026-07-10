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
const { PROJECTS, SECTOR_MAPS, BLOG_POSTS } = await import(`${pathToFileURL(bundlePath)}?t=${Date.now()}`);
fs.unlinkSync(bundlePath);

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

function renderRoute({ route, title, description, image, keywords }) {
  const url = `${SITE_URL}${route}`;
  const ogImage = image ?? `${SITE_URL}/images/Logo2.png`;
  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  if (keywords) html = html.replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`);
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
  { route: '/about', title: "About LSR Realty | Real Estate Advisory Gurgaon", description: "LSR Realty is the investment advisory arm of LSR Group, bringing institutional grade real estate advisory to HNI and NRI investors in Gurgaon.", keywords: "LSR Realty about us, LSR Group, institutional real estate advisory Gurgaon, real estate advisory company Gurgaon" },
  { route: '/blog', title: "Gurgaon Real Estate Blog | LSR Realty", description: "Expert insights on Gurgaon real estate investment, market trends, location guides and NRI advisory from LSR Realty.", keywords: "Gurgaon real estate blog, Gurugram property market insights, Gurgaon investment guide, real estate news Gurgaon" },
  { route: '/services', title: "Real Estate Advisory Services Gurgaon | LSR Realty", description: "LSR Realty offers real estate advisory in Gurgaon: office and retail leasing, investment advisory, market research and NRI services.", keywords: "real estate advisory services Gurgaon, office leasing Gurgaon, retail leasing Gurgaon, NRI investment services, deal structuring Gurgaon, real estate market research Gurgaon" },
  { route: '/projects', title: "Gurgaon Investment & Leasing Projects | LSR Realty", description: "Browse LSR Realty's curated portfolio of Gurgaon investment and leasing opportunities, vetted for legal compliance and quality.", keywords: "Gurgaon real estate projects, Gurgaon investment properties, Gurgaon leasing opportunities, residential projects Gurgaon, commercial projects Gurgaon" },
  { route: '/maps', title: "Gurgaon Map & Sector Layout Plans | LSR Realty", description: "Explore Gurgaon map and sector layout plans for Gurugram, including the Gurgaon Manesar Master Plan 2031.", keywords: "Gurgaon map, Gurugram map, Gurgaon layout plan, Gurgaon lay out plan, Gurgaon sector maps, Gurugram sector map, Master Plan 2031" },
  { route: '/careers', title: "Careers at LSR Realty | Gurgaon Real Estate Jobs", description: "Explore open roles at LSR Realty, including Sales Runner and Telecaller Intern positions in Gurgaon real estate advisory.", keywords: "LSR Realty careers, real estate jobs Gurgaon, sales jobs Gurgaon, real estate advisory careers" },
  { route: '/contact', title: "Contact LSR Realty | Gurgaon Real Estate Investment Advisory", description: "Get in touch with LSR Realty for a 15 minute consultation on real estate investment advisory, portfolio structuring or NRI services in Gurgaon.", keywords: "contact LSR Realty, real estate consultation Gurgaon, book consultation Gurgaon real estate" },
  { route: '/privacy-policy', title: "Privacy Policy | LSR Realty", description: "Read LSR Realty's privacy policy covering how we collect, use and protect your personal information." },
  { route: '/gurgaon-master-plan-2041', title: "Gurgaon Master Plan 2041: Status & Map | LSR Realty", description: "Gurgaon Master Plan 2041 tracker: latest status, GMDA infrastructure roadmap, and how it differs from the 2031 plan.", keywords: "Gurgaon Master Plan 2041, Gurugram Master Plan 2041, Gurgaon Master Plan 2041 map, Gurgaon layout plan, Gurgaon map" },
];

for (const r of staticRoutes) renderRoute(r);

// Project detail pages — mirrors pages/ProjectDetail.tsx's pageTitle/pageDescription.
for (const project of PROJECTS) {
  renderRoute({
    route: `/projects/${project.id}`,
    title: `${project.name} — ${project.category === 'Leasing' ? 'For Lease' : 'Investment'} | LSR Realty`,
    description: `${project.name}, ${project.location}. ${project.priceRange}. ${project.status}.`,
    keywords: `${project.name}, ${project.location}, ${project.name} price, ${project.name} floor plan, Gurgaon real estate investment`,
    image: project.image?.startsWith('http') ? project.image : `${SITE_URL}${project.image}`,
  });
}

// Map detail pages — mirrors pages/MapDetail.tsx's pageTitle/pageDescription.
for (const sector of SECTOR_MAPS) {
  const isMasterPlan = sector.id === 'gurgaon-manesar-master-plan';
  const descSuffix = ` Official ${sector.name} layout map, part of Gurgaon Manesar Master Plan 2031.`;
  renderRoute({
    route: `/maps/${sector.id}`,
    title: isMasterPlan
      ? 'Gurgaon Master Plan 2031 Map & Download | LSR Realty'
      : `${sector.name} | Layout Map | LSR Realty`,
    description: isMasterPlan
      ? 'Official Gurgaon Master Plan 2031 (Gurugram Manesar Urban Complex) map — all sectors, land use zones, metro routes. Free download.'
      : sector.description.length + descSuffix.length > 160
        ? `${sector.description.slice(0, Math.max(157 - descSuffix.length, 0)).trim()}...${descSuffix}`
        : `${sector.description}${descSuffix}`,
    keywords: `${sector.name} layout plan, ${sector.name} lay out plan, ${sector.name} map, ${sector.name}, Gurgaon map, Gurugram map, Gurugram sector map, Gurgaon layout`,
    image: `${SITE_URL}${sector.zoom}`,
  });
}

// Blog detail pages — mirrors pages/BlogDetail.tsx's shortHeadline/pageTitle/metaDescription logic.
const publishedPosts = BLOG_POSTS.filter(p => p.published);
for (const post of publishedPosts) {
  const shortHeadline = post.title.includes(':') ? post.title.split(':')[0].trim() : post.title;
  const postTitle = shortHeadline.length + 13 <= 60
    ? `${shortHeadline} | LSR Realty`
    : `${shortHeadline.slice(0, 44).trim()}... | LSR Realty`;
  const postDescription = post.excerpt.length > 158
    ? `${post.excerpt.slice(0, 155).replace(/\s+\S*$/, '')}...`
    : post.excerpt;
  renderRoute({
    route: `/blog/${post.id}`,
    title: postTitle,
    description: postDescription,
    keywords: `${post.title}, ${post.category}, Gurgaon real estate, Gurugram investment`,
    image: post.image?.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
  });
}

console.log(`Prerendered SEO HTML for ${staticRoutes.length + PROJECTS.length + SECTOR_MAPS.length + publishedPosts.length} routes.`);
