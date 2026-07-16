// Bakes <title>/<meta>/<link canonical>/OG/Twitter/JSON-LD into every route's static HTML.
// Runs after `npm run build` as a post-build step.
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const SITE_URL = 'https://lsrrealty.com';

// Bundle constants.tsx for Node consumption
const bundlePath = path.join(root, '.prerender-constants.mjs');
execSync(
  `"${path.join(root, 'node_modules/.bin/esbuild')}" constants.tsx --bundle --platform=node --format=esm --outfile="${bundlePath}"`,
  { cwd: root, stdio: 'inherit' }
);
const { PROJECTS, SECTOR_MAPS, BLOG_POSTS, SERVICES } = await import(`${pathToFileURL(bundlePath)}?t=${Date.now()}`);
fs.unlinkSync(bundlePath);

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function makeBreadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

// breadcrumbs: [{name, url}] — auto-generates BreadcrumbList and prepends to structuredData
// articleMeta: { publishedTime, modifiedTime, author, section } — for blog posts
function renderRoute({ route, title, description, image, keywords, ogType, structuredData, breadcrumbs, articleMeta }) {
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

  // Article Open Graph meta tags (for blog posts)
  if (ogType === 'article' && articleMeta) {
    const articleTags = [
      `  <meta property="article:published_time" content="${articleMeta.publishedTime}" />`,
      `  <meta property="article:modified_time" content="${articleMeta.modifiedTime || articleMeta.publishedTime}" />`,
      `  <meta property="article:author" content="${escapeHtml(articleMeta.author)}" />`,
      `  <meta property="article:section" content="${escapeHtml(articleMeta.section)}" />`,
    ].join('\n');
    html = html.replace('</head>', `${articleTags}\n</head>`);
  }

  // Collect all structured data: BreadcrumbList first, then page-specific schemas
  const allSchemas = [];
  if (breadcrumbs && breadcrumbs.length > 1) allSchemas.push(makeBreadcrumbSchema(breadcrumbs));
  if (structuredData) allSchemas.push(...structuredData);

  if (allSchemas.length > 0) {
    const jsonLdBlocks = allSchemas
      .map(sd => `  <script type="application/ld+json">${JSON.stringify(sd)}</script>`)
      .join('\n');
    html = html.replace('</head>', `${jsonLdBlocks}\n</head>`);
  }

  const outDir = path.join(distDir, route.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

const HOME = { name: 'Home', url: `${SITE_URL}/` };

// ── Static pages ──────────────────────────────────────────────────────────────
const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Real Estate Advisory Services in Gurgaon — LSR Realty',
  description: 'Comprehensive real estate advisory services for HNI, UHNI and NRI investors in Gurgaon and Gurugram.',
  numberOfItems: SERVICES.length,
  itemListElement: SERVICES.map((svc, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: svc.title,
      description: svc.description,
      url: svc.link ? `${SITE_URL}${svc.link}` : `${SITE_URL}/services`,
      provider: { '@type': 'LocalBusiness', name: 'LSR Realty', url: SITE_URL, telephone: '+918448660019' },
      areaServed: [{ '@type': 'City', name: 'Gurgaon' }, { '@type': 'City', name: 'Gurugram' }],
    },
  })),
};

const staticRoutes = [
  {
    route: '/about',
    title: 'LSR Realty | Institutional Real Estate Advisory Gurgaon',
    description: 'LSR Realty is the investment advisory arm of LSR Group, bringing institutional-grade, research-backed real estate advisory to HNI, UHNI and NRI investors in Gurgaon.',
    keywords: 'LSR Realty about, LSR Group, institutional real estate advisory Gurgaon, HNI NRI real estate advisory',
    breadcrumbs: [HOME, { name: 'About LSR Realty', url: `${SITE_URL}/about` }],
    structuredData: [{
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      url: `${SITE_URL}/about`,
      name: 'About LSR Realty — Institutional Real Estate Advisory, Gurgaon',
      description: 'LSR Realty is the investment advisory arm of LSR Group, bringing institutional-grade, research-backed real estate advisory to HNI, UHNI and NRI investors in Gurgaon.',
      mainEntity: {
        '@type': 'Organization',
        name: 'LSR Realty',
        url: SITE_URL,
        logo: `${SITE_URL}/images/Logo2.png`,
        telephone: '+918448660019',
        email: 'marketing@lsrrealty.com',
        foundingLocation: { '@type': 'Place', name: 'Gurugram, Haryana, India' },
        description: 'Institutional-grade real estate investment advisory for HNI, UHNI and NRI investors in Gurgaon. Covers residential luxury, commercial office, and retail leasing across all major Gurgaon corridors.',
        sameAs: ['https://www.linkedin.com/company/lsr-realty/', 'https://www.instagram.com/lsrrealty/', 'https://www.facebook.com/profile.php?id=61586950558326'],
      },
    }],
  },
  {
    route: '/blog',
    title: 'Gurgaon Real Estate Blog | Market Intelligence | LSR Realty',
    description: 'Expert insights on Gurgaon real estate investment, market trends, location guides and NRI advisory from LSR Realty.',
    keywords: 'Gurgaon real estate blog, Gurugram property market insights, Gurgaon investment guide, real estate news Gurgaon',
    breadcrumbs: [HOME, { name: 'Real Estate Blog', url: `${SITE_URL}/blog` }],
  },
  {
    route: '/services',
    title: 'Real Estate Advisory Services Gurgaon | LSR Realty',
    description: 'LSR Realty offers real estate advisory in Gurgaon: office and retail leasing, investment advisory, market research and NRI services.',
    keywords: 'real estate advisory services Gurgaon, office leasing Gurgaon, retail leasing Gurgaon, NRI investment services, deal structuring Gurgaon',
    breadcrumbs: [HOME, { name: 'Our Services', url: `${SITE_URL}/services` }],
    structuredData: [servicesSchema],
  },
  {
    route: '/projects',
    title: 'Gurgaon Investment & Leasing Projects | LSR Realty',
    description: 'Browse LSR Realty\'s curated portfolio of Gurgaon investment and leasing opportunities, vetted for legal compliance and quality.',
    keywords: 'Gurgaon real estate projects, Gurgaon investment properties, Gurgaon leasing opportunities, residential projects Gurgaon, commercial projects Gurgaon',
    breadcrumbs: [HOME, { name: 'Projects & Listings', url: `${SITE_URL}/projects` }],
  },
  {
    route: '/maps',
    title: 'Gurgaon Sector Maps & Layout Plans — Free Download | LSR Realty',
    description: 'Explore 75+ Gurgaon sector layout maps and the Gurgaon Manesar Master Plan 2031. Free high-resolution downloads for all sectors including GCER, GCR, Dwarka Expressway and Sohna Road.',
    keywords: 'Gurgaon sector maps, Gurugram sector layout plans, Gurgaon map download, DTCP Haryana maps, Gurgaon Master Plan 2031, sector layout Gurgaon, Gurugram map',
    breadcrumbs: [HOME, { name: 'Gurgaon Maps', url: `${SITE_URL}/maps` }],
    structuredData: [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Gurgaon Sector Maps & Layout Plans Library',
      description: '75+ approved sector layout plans for Gurugram, including the official Gurgaon Manesar Master Plan 2031. Maintained by LSR Realty for property investors and planners.',
      url: `${SITE_URL}/maps`,
      about: {
        '@type': 'Place',
        name: 'Gurugram',
        alternateName: 'Gurgaon',
        geo: { '@type': 'GeoCoordinates', latitude: 28.4091, longitude: 77.0517 },
        containedInPlace: { '@type': 'State', name: 'Haryana', containedInPlace: { '@type': 'Country', name: 'India' } },
      },
      publisher: { '@type': 'Organization', name: 'LSR Realty', url: SITE_URL },
      dateModified: '2026-07-16',
    }],
  },
  {
    route: '/careers',
    title: 'Careers at LSR Realty | Real Estate Jobs Gurgaon',
    description: 'Join LSR Realty\'s advisory team in Gurgaon. We hire for real estate sales, leasing, client advisory and operations roles. View current openings.',
    keywords: 'LSR Realty careers, real estate jobs Gurgaon, leasing manager Gurgaon, commercial real estate jobs, sales jobs Gurgaon',
    breadcrumbs: [HOME, { name: 'Careers', url: `${SITE_URL}/careers` }],
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: 'Leasing Manager — Commercial & Retail Real Estate',
        description: 'LSR Realty is looking for an experienced Leasing Manager to drive commercial and retail leasing across office spaces, retail outlets, high streets, malls, and mixed-use developments in Gurgaon.',
        datePosted: '2026-07-01',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: { '@type': 'Organization', name: 'LSR Realty', sameAs: SITE_URL, logo: `${SITE_URL}/images/Logo2.png` },
        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', streetAddress: '911, Magnum Global Park, Sector 58', addressLocality: 'Gurugram', addressRegion: 'Haryana', postalCode: '122098', addressCountry: 'IN' } },
        baseSalary: { '@type': 'MonetaryAmount', currency: 'INR', value: { '@type': 'QuantitativeValue', minValue: 600000, maxValue: 1200000, unitText: 'YEAR' } },
        experienceRequirements: '5 to 8 years in Commercial and Retail Leasing',
        qualifications: 'Strong network within the commercial real estate industry. Experience with office and retail leasing in Gurgaon.',
        skills: 'Commercial Leasing, Business Development, Lease Negotiations, Retail Leasing',
        industry: 'Real Estate',
        applicationContact: { '@type': 'ContactPoint', email: 'saboori@lsrrealty.com', contactType: 'Hiring' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: 'Sales Telecaller Intern — Real Estate',
        description: 'We are looking for enthusiastic Sales Telecaller Interns to join LSR Realty\'s Real Estate Sales Team in Gurgaon. The role involves lead generation, scheduling site visits, and supporting the sales team.',
        datePosted: '2026-01-01',
        validThrough: '2026-12-31',
        employmentType: 'INTERN',
        hiringOrganization: { '@type': 'Organization', name: 'LSR Realty', sameAs: SITE_URL, logo: `${SITE_URL}/images/Logo2.png` },
        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', streetAddress: '911, Magnum Global Park, Sector 58', addressLocality: 'Gurugram', addressRegion: 'Haryana', postalCode: '122098', addressCountry: 'IN' } },
        skills: 'Telecalling, Lead Generation, Communication',
        industry: 'Real Estate',
        applicationContact: { '@type': 'ContactPoint', email: 'marketing@lsrrealty.com', contactType: 'Hiring' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: 'Sales Runner — Real Estate',
        description: 'We are looking for an energetic Sales Runner to support LSR Realty\'s sales team in Gurgaon by managing site visits, client coordination, lead follow-ups, and on-ground sales activities.',
        datePosted: '2026-01-01',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: { '@type': 'Organization', name: 'LSR Realty', sameAs: SITE_URL, logo: `${SITE_URL}/images/Logo2.png` },
        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', streetAddress: '911, Magnum Global Park, Sector 58', addressLocality: 'Gurugram', addressRegion: 'Haryana', postalCode: '122098', addressCountry: 'IN' } },
        skills: 'Sales, Client Coordination, Lead Management, Site Visits',
        industry: 'Real Estate',
        applicationContact: { '@type': 'ContactPoint', email: 'marketing@lsrrealty.com', contactType: 'Hiring' },
      },
    ],
  },
  {
    route: '/contact',
    title: 'Contact LSR Realty | Gurgaon Real Estate Advisory',
    description: 'Get in touch with LSR Realty for a consultation on real estate investment advisory, portfolio structuring or NRI services in Gurgaon.',
    keywords: 'contact LSR Realty, real estate consultation Gurgaon, book consultation Gurgaon real estate',
    breadcrumbs: [HOME, { name: 'Contact Us', url: `${SITE_URL}/contact` }],
    structuredData: [{
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: `${SITE_URL}/contact`,
      name: 'Contact LSR Realty — Real Estate Advisory Gurgaon',
      mainEntity: {
        '@type': 'LocalBusiness',
        name: 'LSR Realty',
        telephone: '+918448660019',
        email: 'marketing@lsrrealty.com',
        url: SITE_URL,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '911, Magnum Global Park, Sector 58',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122098',
          addressCountry: 'IN',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 28.4091, longitude: 77.0517 },
        openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '10:00', closes: '19:00' },
      },
    }],
  },
  {
    route: '/privacy-policy',
    title: 'Privacy Policy | LSR Realty',
    description: 'Read LSR Realty\'s privacy policy covering how we collect, use and protect your personal information.',
    breadcrumbs: [HOME, { name: 'Privacy Policy', url: `${SITE_URL}/privacy-policy` }],
  },
  {
    route: '/gurgaon-master-plan-2041',
    title: 'Gurgaon Master Plan 2041: Status, Map & Infrastructure Roadmap | LSR Realty',
    description: 'Gurgaon Master Plan 2041 tracker: GMDA\'s current status, key infrastructure projects, population projections to 55 lakh, and investment zones compared to Master Plan 2031.',
    keywords: 'Gurgaon Master Plan 2041, Gurugram Master Plan 2041, Gurgaon 2041 master plan status, GMDA 2041, Gurugram infrastructure plan 2041, Gurgaon 2041 map, Gurgaon 2041 investment zones',
    breadcrumbs: [HOME, { name: 'Gurgaon Master Plan 2041', url: `${SITE_URL}/gurgaon-master-plan-2041` }],
    structuredData: [{
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/gurgaon-master-plan-2041`,
      name: 'Gurgaon Master Plan 2041: Status, Map & Infrastructure Roadmap',
      description: 'Detailed tracker for the Gurgaon Master Plan 2041 by GMDA (Gurugram Metropolitan Development Authority). Covers status update, population projection of 55 lakh, new sector development, metro corridors and investment implications.',
      url: `${SITE_URL}/gurgaon-master-plan-2041`,
      dateModified: '2026-07-16',
      publisher: { '@type': 'Organization', name: 'LSR Realty', url: SITE_URL, logo: `${SITE_URL}/images/Logo2.png` },
      author: { '@type': 'Organization', name: 'LSR Realty', url: SITE_URL },
      about: [
        {
          '@type': 'Place',
          name: 'Gurugram',
          alternateName: ['Gurgaon', 'Gurugram City'],
          geo: { '@type': 'GeoCoordinates', latitude: 28.4091, longitude: 77.0517 },
          containedInPlace: { '@type': 'AdministrativeArea', name: 'Haryana', containedInPlace: { '@type': 'Country', name: 'India' } },
        },
        {
          '@type': 'GovernmentOrganization',
          name: 'Gurugram Metropolitan Development Authority',
          alternateName: 'GMDA',
          url: 'https://gmda.gov.in',
          areaServed: { '@type': 'City', name: 'Gurugram' },
        },
      ],
      mentions: [
        { '@type': 'CreativeWork', name: 'Gurgaon Manesar Master Plan 2031', url: `${SITE_URL}/maps/gurgaon-manesar-master-plan` },
        { '@type': 'GovernmentOrganization', name: 'Haryana Urban Development Authority', alternateName: 'HUDA' },
        { '@type': 'GovernmentOrganization', name: 'DTCP Haryana', description: 'Department of Town and Country Planning, Haryana' },
      ],
      mainEntity: {
        '@type': 'GovernmentService',
        name: 'Gurgaon Master Plan 2041',
        description: 'Urban development plan for Gurugram district for the horizon year 2041, being prepared by GMDA. Targets 55 lakh projected population and extends planning area beyond the existing 2031 plan.',
        provider: { '@type': 'GovernmentOrganization', name: 'Gurugram Metropolitan Development Authority', alternateName: 'GMDA' },
        areaServed: { '@type': 'City', name: 'Gurugram' },
      },
    }],
  },
];

for (const r of staticRoutes) renderRoute(r);

// ── Project detail pages ──────────────────────────────────────────────────────
for (const project of PROJECTS) {
  const projectImage = project.image?.startsWith('http') ? project.image : `${SITE_URL}${project.image}`;
  const projectUrl = `${SITE_URL}/projects/${project.id}`;
  const isSoldOut = project.status?.toLowerCase().includes('sold');

  const realEstateSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.description,
    url: projectUrl,
    image: projectImage,
    datePosted: '2026-01-01',
    availableAtOrFrom: {
      '@type': 'Place',
      name: `${project.name}, ${project.location}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: project.location,
        addressLocality: 'Gurugram',
        addressRegion: 'Haryana',
        postalCode: '122001',
        addressCountry: 'IN',
      },
    },
    businessFunction: project.category === 'Leasing' ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
    seller: { '@type': 'RealEstateAgent', name: 'LSR Realty', url: SITE_URL, telephone: '+918448660019' },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Price Range', value: project.priceRange },
      { '@type': 'PropertyValue', name: 'Size Range', value: project.sizeRange },
      { '@type': 'PropertyValue', name: 'Developer', value: project.developer },
      { '@type': 'PropertyValue', name: 'Status', value: project.status },
      ...(project.rera ? [{ '@type': 'PropertyValue', name: 'RERA Number', value: project.rera }] : []),
      ...(project.possessionDate ? [{ '@type': 'PropertyValue', name: 'Possession Date', value: project.possessionDate }] : []),
      ...(project.totalUnits ? [{ '@type': 'PropertyValue', name: 'Total Units', value: String(project.totalUnits) }] : []),
    ],
  };

  const locationNoComma = project.location.replace(/,/g, '');
  const unitType = project.unitMix?.[0]?.type ?? '';
  renderRoute({
    route: `/projects/${project.id}`,
    title: `${project.name} — ${project.category === 'Leasing' ? 'For Lease in Gurgaon' : 'Investment in Gurgaon'} | LSR Realty`,
    description: `${project.name}, ${project.location}. ${project.priceRange}. ${project.status}. ${project.developer}. View inventory, pricing and investment analysis with LSR Realty.`,
    keywords: [
      project.name,
      `${project.name} price`,
      `${project.name} floor plan`,
      `${project.name} ${project.developer}`,
      project.location,
      locationNoComma,
      project.developer,
      project.type,
      unitType ? `${unitType} Gurgaon` : '',
      project.rera ? `${project.name} RERA` : '',
      'Gurgaon real estate investment',
      `real estate ${project.category === 'Leasing' ? 'leasing' : 'investment'} Gurgaon`,
    ].filter(Boolean).join(', '),
    image: projectImage,
    breadcrumbs: [
      HOME,
      { name: 'Projects', url: `${SITE_URL}/projects` },
      { name: project.name, url: projectUrl },
    ],
    structuredData: [realEstateSchema],
  });
}

// ── Map detail pages ──────────────────────────────────────────────────────────
for (const sector of SECTOR_MAPS) {
  const isMasterPlan = sector.id === 'gurgaon-manesar-master-plan';
  const descSuffix = ` Official ${sector.name} layout map, part of Gurgaon Manesar Master Plan 2031.`;
  const mapTitle = isMasterPlan
    ? 'Gurgaon Master Plan 2031 Map & Download | LSR Realty'
    : `${sector.name} | Layout Map | LSR Realty`;
  const mapDesc = isMasterPlan
    ? 'Official Gurgaon Master Plan 2031 (Gurugram Manesar Urban Complex) map — all sectors, land use zones, metro routes. Free download.'
    : sector.description.length + descSuffix.length > 160
      ? `${sector.description.slice(0, Math.max(157 - descSuffix.length, 0)).trim()}...${descSuffix}`
      : `${sector.description}${descSuffix}`;

  renderRoute({
    route: `/maps/${sector.id}`,
    title: mapTitle,
    description: mapDesc,
    keywords: `${sector.name} layout plan, ${sector.name} map, ${sector.name} Gurgaon, ${sector.name} plot layout, Gurgaon sector map, Gurugram sector map, DTCP Haryana layout`,
    image: `${SITE_URL}${sector.zoom}`,
    breadcrumbs: [
      HOME,
      { name: 'Gurgaon Maps', url: `${SITE_URL}/maps` },
      { name: sector.name, url: `${SITE_URL}/maps/${sector.id}` },
    ],
  });
}

// ── Blog detail pages ─────────────────────────────────────────────────────────
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
    author: { '@type': 'Organization', name: 'LSR Realty Advisory Team', url: `${SITE_URL}/about` },
    publisher: {
      '@type': 'Organization',
      name: 'LSR Realty',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/Logo2.png`, width: 600, height: 60 },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    articleSection: post.category,
    inLanguage: 'en-IN',
    url: postUrl,
  };

  renderRoute({
    route: `/blog/${post.id}`,
    title: `${post.title} | LSR Realty`,
    description: postDescription,
    keywords: `${post.category}, Gurgaon real estate, Gurugram investment, LSR Realty`,
    image: postImage,
    ogType: 'article',
    articleMeta: {
      publishedTime: `${isoDate}T00:00:00+05:30`,
      modifiedTime: `${isoDate}T00:00:00+05:30`,
      author: 'LSR Realty Advisory Team',
      section: post.category,
    },
    breadcrumbs: [
      HOME,
      { name: 'Real Estate Blog', url: `${SITE_URL}/blog` },
      { name: post.title, url: postUrl },
    ],
    structuredData: [articleSchema],
  });
}

// ── Image sitemap ─────────────────────────────────────────────────────────────
function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const imageEntries = [];

// Homepage logo
imageEntries.push({
  pageUrl: `${SITE_URL}/`,
  imageUrl: `${SITE_URL}/images/Logo2.png`,
  title: 'LSR Realty — Real Estate Investment Advisory Gurgaon',
  caption: 'LSR Realty logo — Gurgaon\'s leading real estate investment advisory firm for HNI, UHNI and NRI investors.',
});

// Project images
for (const project of PROJECTS) {
  if (!project.image) continue;
  const imageUrl = project.image.startsWith('http') ? project.image : `${SITE_URL}${project.image}`;
  imageEntries.push({
    pageUrl: `${SITE_URL}/projects/${project.id}`,
    imageUrl,
    title: `${project.name} — ${project.type} in ${project.location}`,
    caption: `${project.name} by ${project.developer}: ${project.type} project in ${project.location}. ${project.priceRange}. Advised by LSR Realty.`,
  });
}

// Map images
for (const sector of SECTOR_MAPS) {
  if (!sector.zoom) continue;
  imageEntries.push({
    pageUrl: `${SITE_URL}/maps/${sector.id}`,
    imageUrl: `${SITE_URL}${sector.zoom}`,
    title: `${sector.name} Layout Map — Gurgaon`,
    caption: `${sector.name} official layout map. Part of Gurgaon Manesar Master Plan 2031.`,
  });
}

// Blog images
for (const post of publishedPosts) {
  if (!post.image) continue;
  const imageUrl = post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`;
  imageEntries.push({
    pageUrl: `${SITE_URL}/blog/${post.id}`,
    imageUrl,
    title: post.title,
    caption: post.excerpt,
  });
}

const imageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries.map(e => `  <url>
    <loc>${xmlEscape(e.pageUrl)}</loc>
    <image:image>
      <image:loc>${xmlEscape(e.imageUrl)}</image:loc>
      <image:title>${xmlEscape(e.title)}</image:title>
      <image:caption>${xmlEscape(e.caption.slice(0, 200))}</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(distDir, 'sitemap-images.xml'), imageSitemapXml);

const totalRoutes = staticRoutes.length + PROJECTS.length + SECTOR_MAPS.length + publishedPosts.length;
console.log(`✓ Prerendered ${totalRoutes} routes with BreadcrumbList, RealEstateListing, Article, and Service schemas.`);
console.log(`✓ Image sitemap: ${imageEntries.length} images across ${imageEntries.length} pages.`);
