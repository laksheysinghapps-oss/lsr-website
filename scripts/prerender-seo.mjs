// Bakes the correct <title>/<meta description>/<link canonical>/OG/Twitter/JSON-LD tags into a
// static dist/<route>/index.html for every route, so crawlers and social bots that only read
// raw HTML see the right metadata instead of always falling back to the homepage defaults.
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const SITE_URL = 'https://lsrrealty.com';

const bundlePath = path.join(root, '.prerender-constants.mjs');
execSync(
  `"${path.join(root, 'node_modules/.bin/esbuild')}" constants.tsx --bundle --platform=node --format=esm --outfile="${bundlePath}"`,
  { cwd: root, stdio: 'inherit' }
);
const { PROJECTS, SECTOR_MAPS, BLOG_POSTS } = await import(`${pathToFileURL(bundlePath)}?t=${Date.now()}`);
fs.unlinkSync(bundlePath);

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

function renderRoute({ route, title, description, image, keywords, ogType, structuredData }) {
  const url = `${SITE_URL}${route}`;
  const ogImage = image ?? `${SITE_URL}/images/Logo2.png`;
  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  if (keywords) html = html.replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`);
  if (ogType) html = html.replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="${ogType}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${ogImage}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${ogImage}" />`);

  // Inject additional structured data blocks before </head>
  if (structuredData && structuredData.length > 0) {
    const jsonLdBlocks = structuredData
      .map(sd => `  <script type="application/ld+json">${JSON.stringify(sd)}</script>`)
      .join('\n');
    html = html.replace('</head>', `${jsonLdBlocks}\n</head>`);
  }

  const outDir = path.join(distDir, route.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Static pages
const staticRoutes = [
  { route: '/about', title: "LSR Realty | Institutional Real Estate Advisory Gurgaon", description: "LSR Realty is the investment advisory arm of LSR Group, bringing institutional-grade, research-backed real estate advisory to HNI, UHNI and NRI investors in Gurgaon.", keywords: "LSR Realty about, LSR Group, institutional real estate advisory Gurgaon, HNI NRI real estate advisory" },
  { route: '/blog', title: "Gurgaon Real Estate Blog | Market Intelligence | LSR Realty", description: "Expert insights on Gurgaon real estate investment, market trends, location guides and NRI advisory from LSR Realty.", keywords: "Gurgaon real estate blog, Gurugram property market insights, Gurgaon investment guide, real estate news Gurgaon" },
  { route: '/services', title: "Real Estate Advisory Services Gurgaon | LSR Realty", description: "LSR Realty offers real estate advisory in Gurgaon: office and retail leasing, investment advisory, market research and NRI services.", keywords: "real estate advisory services Gurgaon, office leasing Gurgaon, retail leasing Gurgaon, NRI investment services, deal structuring Gurgaon" },
  { route: '/projects', title: "Gurgaon Investment & Leasing Projects | LSR Realty", description: "Browse LSR Realty's curated portfolio of Gurgaon investment and leasing opportunities, vetted for legal compliance and quality.", keywords: "Gurgaon real estate projects, Gurgaon investment properties, Gurgaon leasing opportunities, residential projects Gurgaon, commercial projects Gurgaon" },
  { route: '/maps', title: "Gurgaon Map & Sector Layout Plans | LSR Realty", description: "Explore Gurgaon sector maps and layout plans, including the Gurgaon Manesar Master Plan 2031 for the Gurugram Urban Complex.", keywords: "Gurgaon map, Gurugram map, Gurgaon layout plan, Gurgaon sector maps, Gurugram sector map, Master Plan 2031" },
  { route: '/careers', title: "Careers at LSR Realty | Real Estate Jobs Gurgaon", description: "Join LSR Realty's advisory team in Gurgaon. We hire for real estate sales, leasing, client advisory and operations roles. View current openings.", keywords: "LSR Realty careers, real estate jobs Gurgaon, leasing manager Gurgaon, commercial real estate jobs, sales jobs Gurgaon" },
  { route: '/contact', title: "Contact LSR Realty | Gurgaon Real Estate Advisory", description: "Get in touch with LSR Realty for a consultation on real estate investment advisory, portfolio structuring or NRI services in Gurgaon.", keywords: "contact LSR Realty, real estate consultation Gurgaon, book consultation Gurgaon real estate" },
  { route: '/privacy-policy', title: "Privacy Policy | LSR Realty", description: "Read LSR Realty's privacy policy covering how we collect, use and protect your personal information." },
  { route: '/gurgaon-master-plan-2041', title: "Gurgaon Master Plan 2041: Status & Map | LSR Realty", description: "Gurgaon Master Plan 2041 tracker: latest status, GMDA infrastructure roadmap, and how it differs from the 2031 plan.", keywords: "Gurgaon Master Plan 2041, Gurugram Master Plan 2041, Gurgaon Master Plan 2041 map, GMDA infrastructure" },
];

for (const r of staticRoutes) renderRoute(r);

// Project detail pages
for (const project of PROJECTS) {
  renderRoute({
    route: `/projects/${project.id}`,
    title: `${project.name} — ${project.category === 'Leasing' ? 'For Lease' : 'Investment'} | LSR Realty`,
    description: `${project.name}, ${project.location}. ${project.priceRange}. ${project.status}. View inventory, pricing and investment analysis with LSR Realty.`,
    keywords: `${project.name}, ${project.location}, ${project.name} price, ${project.name} floor plan, Gurgaon real estate investment`,
    image: project.image?.startsWith('http') ? project.image : `${SITE_URL}${project.image}`,
  });
}

// Map detail pages
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
    keywords: `${sector.name} layout plan, ${sector.name} map, ${sector.name}, Gurgaon map, Gurugram map, Gurugram sector map`,
    image: `${SITE_URL}${sector.zoom}`,
  });
}

// Blog detail pages — injects og:type=article and Article+BreadcrumbList schema into static HTML
const publishedPosts = BLOG_POSTS.filter(p => p.published);
for (const post of publishedPosts) {
  const postDescription = post.metaDescription || post.excerpt;
  const postImage = post.image?.startsWith('http') ? post.image : `${SITE_URL}${post.image}`;
  const postUrl = `${SITE_URL}/blog/${post.id}`;
  const isoDate = post.dateISO || '2026-07-03';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: postDescription,
    image: postImage,
    datePublished: isoDate,
    dateModified: isoDate,
    author: {
      '@type': 'Organization',
      name: 'LSR Realty Advisory Team',
      url: 'https://lsrrealty.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LSR Realty',
      url: 'https://lsrrealty.com',
      logo: { '@type': 'ImageObject', url: 'https://lsrrealty.com/images/Logo2.png', width: 600, height: 60 },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    articleSection: post.category,
    inLanguage: 'en-IN',
    url: postUrl,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lsrrealty.com/' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Blog', item: 'https://lsrrealty.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  renderRoute({
    route: `/blog/${post.id}`,
    title: `${post.title} | LSR Realty`,
    description: postDescription,
    keywords: `${post.category}, Gurgaon real estate, Gurugram investment, LSR Realty`,
    image: postImage,
    ogType: 'article',
    structuredData: [articleSchema, breadcrumbSchema],
  });
}

console.log(`Prerendered SEO HTML for ${staticRoutes.length + PROJECTS.length + SECTOR_MAPS.length + publishedPosts.length} routes.`);
