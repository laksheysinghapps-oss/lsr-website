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
function renderRoute({ route, title, description, image, keywords, ogType, structuredData, breadcrumbs, articleMeta, preloadImage }) {
  const url = `${SITE_URL}${route}`;
  const ogImage = image ?? `${SITE_URL}/images/Logo2.png`;
  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  if (keywords) html = html.replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`);
  html = html.replace(/hreflang="en-IN" href=".*?" \/>/, `hreflang="en-IN" href="${url}" />`);
  html = html.replace(/hreflang="en" href=".*?" \/>/, `hreflang="en" href="${url}" />`);
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

  // Preload hero image for LCP improvement
  if (preloadImage) {
    const preloadTag = `  <link rel="preload" as="image" href="${preloadImage}" fetchpriority="high">`;
    html = html.replace('</head>', `${preloadTag}\n</head>`);
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
    description: 'LSR Realty — investment advisory arm of LSR Group. Institutional-grade, research-backed real estate advisory for HNI, UHNI and NRI investors in Gurgaon.',
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
    structuredData: [{
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'LSR Realty — Gurgaon Real Estate Blog',
      description: 'Expert market intelligence, investment analysis, location guides and NRI advisory from LSR Realty, Gurgaon\'s institutional real estate advisory firm.',
      url: `${SITE_URL}/blog`,
      publisher: { '@type': 'Organization', name: 'LSR Realty', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/Logo2.png` } },
      inLanguage: 'en-IN',
      about: [{ '@type': 'City', name: 'Gurugram' }, { '@type': 'City', name: 'Gurgaon' }],
      hasPart: BLOG_POSTS.filter(p => p.published).map(p => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: `${SITE_URL}/blog/${p.id}`,
        datePublished: p.dateISO ? `${p.dateISO}T00:00:00+05:30` : undefined,
        description: p.metaDescription ?? p.excerpt,
        image: p.image?.startsWith('http') ? p.image : `${SITE_URL}${p.image}`,
        author: { '@type': 'Organization', name: 'LSR Realty Advisory Team', url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'LSR Realty', url: SITE_URL },
        keywords: `${p.category}, Gurgaon real estate, Gurugram investment`,
      })),
    }],
  },
  {
    route: '/services',
    title: 'Real Estate Advisory Services Gurgaon | LSR Realty',
    description: 'LSR Realty offers real estate advisory in Gurgaon: office and retail leasing, investment advisory, market research and NRI services.',
    keywords: 'real estate advisory services Gurgaon, office leasing Gurgaon, retail leasing Gurgaon, NRI investment services, deal structuring Gurgaon',
    breadcrumbs: [HOME, { name: 'Our Services', url: `${SITE_URL}/services` }],
    structuredData: [servicesSchema, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What real estate advisory services does LSR Realty offer in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty offers seven core services in Gurgaon: (1) Office Leasing Advisory — Grade A office spaces across Golf Course Road, Udyog Vihar, Cyber City and SPR; (2) Retail Leasing — high street and mall retail in prime Gurgaon catchments; (3) Investment Advisory — bespoke portfolio strategies for HNI and NRI investors; (4) Market Research — institutional-grade reports on Gurgaon micro-markets; (5) Deal Structuring — negotiation, legal due diligence and financial structuring; (6) NRI Services — end-to-end FEMA-compliant investment management for overseas Indians; (7) Inventory Sourcing — off-market and pre-launch inventory via exclusive developer relationships.' },
        },
        {
          '@type': 'Question',
          name: 'How does LSR Realty\'s office leasing advisory work in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty\'s office leasing process starts with a detailed brief on team size, budget, workplace requirements and growth plans. We then shortlist Grade A office spaces across Gurgaon\'s key corridors — Golf Course Road, Udyog Vihar, Cyber City, Dwarka Expressway and SPR — negotiate terms, and manage the entire transaction through to lease execution. Our fee is typically a landlord-paid transaction commission, so tenants pay nothing.' },
        },
        {
          '@type': 'Question',
          name: 'Does LSR Realty handle NRI property investments in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. LSR Realty operates a dedicated NRI Desk that manages the complete investment process for overseas Indian investors under FEMA guidelines. Services include property identification and due diligence, builder coordination, NRE/NRO account compliance, power of attorney structuring, rental management, and exit advisory. Everything is managed remotely so NRI clients can invest from any country.' },
        },
        {
          '@type': 'Question',
          name: 'What is the cost of LSR Realty\'s investment advisory services?',
          acceptedAnswer: { '@type': 'Answer', text: 'For residential and commercial property transactions, LSR Realty\'s fee is a brokerage arrangement with the developer or landlord — investors pay no upfront advisory fee. For standalone consultancy assignments (portfolio review, market entry strategy, independent due diligence), fees are agreed case-by-case. Contact marketing@lsrrealty.com for a consultation.' },
        },
        {
          '@type': 'Question',
          name: 'Which areas of Gurgaon does LSR Realty cover for real estate services?',
          acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty covers all major Gurgaon real estate corridors: Golf Course Extension Road (Sectors 58–65), Golf Course Road, Dwarka Expressway, Sohna Road, Southern Peripheral Road (SPR), Udyog Vihar, Cyber City, and New Gurgaon/Manesar. We advise on both residential (luxury apartments, villas) and commercial (Grade A office, high-street retail, mall retail) assets across these micro-markets.' },
        },
      ],
    }],
  },
  {
    route: '/projects',
    title: 'Gurgaon Investment & Leasing Projects | LSR Realty',
    description: 'Browse LSR Realty\'s curated portfolio of Gurgaon investment and leasing opportunities, vetted for legal compliance and quality.',
    keywords: 'Gurgaon real estate projects, Gurgaon investment properties, Gurgaon leasing opportunities, residential projects Gurgaon, commercial projects Gurgaon',
    breadcrumbs: [HOME, { name: 'Projects & Listings', url: `${SITE_URL}/projects` }],
    structuredData: [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Gurgaon Real Estate Investment & Leasing Projects — LSR Realty',
      description: 'Curated portfolio of Gurgaon investment and leasing opportunities including luxury residential, Grade A office and premium retail across all major Gurugram corridors.',
      url: `${SITE_URL}/projects`,
      numberOfItems: PROJECTS.length,
      about: { '@type': 'City', name: 'Gurugram', alternateName: 'Gurgaon' },
      publisher: { '@type': 'Organization', name: 'LSR Realty', url: SITE_URL },
      hasPart: PROJECTS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: `${SITE_URL}/projects/${p.id}`,
        image: p.image?.startsWith('http') ? p.image : `${SITE_URL}${p.image}`,
      })),
    }],
  },
  {
    route: '/maps',
    title: 'Gurgaon Sector Maps & Layout Plans — Free Download | LSR Realty',
    description: 'Free Gurgaon sector layout maps and the Gurgaon Manesar Master Plan 2031. High-resolution downloads for 75+ sectors: GCER, GCR, Dwarka Expressway, Sohna Road.',
    keywords: 'Gurgaon sector maps, Gurugram sector layout plans, Gurgaon map download, DTCP Haryana maps, Gurgaon Master Plan 2031, sector layout Gurgaon, Gurugram map',
    breadcrumbs: [HOME, { name: 'Gurgaon Maps', url: `${SITE_URL}/maps` }],
    structuredData: [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Gurgaon Sector Maps & Layout Plans Library',
      description: '75+ approved sector layout plans for Gurugram, including the official Gurgaon Manesar Master Plan 2031. Maintained by LSR Realty for property investors and planners.',
      url: `${SITE_URL}/maps`,
      numberOfItems: SECTOR_MAPS.length,
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
        '@type': ['LocalBusiness', 'RealEstateAgent'],
        '@id': `${SITE_URL}/#local-business`,
        name: 'LSR Realty',
        alternateName: 'LSR Realty Advisory',
        telephone: '+918448660019',
        email: 'marketing@lsrrealty.com',
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/Logo2.png` },
        image: `${SITE_URL}/images/Logo2.png`,
        priceRange: '₹₹₹₹',
        currenciesAccepted: 'INR',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '911, Magnum Global Park, Sector 58',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122098',
          addressCountry: 'IN',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 28.4091, longitude: 77.0517 },
        hasMap: 'https://share.google/PrY10KLQgFzg35x1W',
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '10:00', closes: '19:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday','Sunday'], opens: '10:00', closes: '17:00' },
        ],
        contactPoint: [
          { '@type': 'ContactPoint', contactType: 'sales', telephone: '+918448660019', email: 'marketing@lsrrealty.com', availableLanguage: ['English', 'Hindi'] },
        ],
        sameAs: [
          'https://www.linkedin.com/company/lsr-realty/',
          'https://www.instagram.com/lsrrealty/',
          'https://www.facebook.com/profile.php?id=61586950558326',
          'https://www.crunchbase.com/organization/lsr-realty',
          'https://in.pinterest.com/lsrrealty/',
          'https://www.hotfrog.in/company/afbcfb081d69d2b906f5180911b4704f/lsr-realty',
          'https://www.brownbook.net/business/55272361/lsr-realty',
        ],
        areaServed: [
          { '@type': 'City', name: 'Gurugram' },
          { '@type': 'Place', name: 'Golf Course Extension Road, Gurgaon' },
          { '@type': 'Place', name: 'Golf Course Road, Gurgaon' },
          { '@type': 'Place', name: 'Dwarka Expressway, Gurgaon' },
          { '@type': 'Place', name: 'Sohna Road, Gurgaon' },
          { '@type': 'Place', name: 'Southern Peripheral Road, Gurgaon' },
        ],
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
    title: 'Gurgaon Master Plan 2041: Status & Infrastructure | LSR Realty',
    description: 'Gurgaon Master Plan 2041 tracker: GMDA status, infrastructure projects, 55 lakh population projection, and investment zones compared to Master Plan 2031.',
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
      ...(project.landArea ? [{ '@type': 'PropertyValue', name: 'Land Area', value: project.landArea }] : []),
      ...(project.towers ? [{ '@type': 'PropertyValue', name: 'Towers', value: String(project.towers) }] : []),
      ...(project.floors ? [{ '@type': 'PropertyValue', name: 'Floors', value: String(project.floors) }] : []),
      ...(project.pricePerSqFt ? [{ '@type': 'PropertyValue', name: 'Price Per Sq Ft', value: project.pricePerSqFt }] : []),
    ],
    ...(project.amenities?.length || project.highlights?.length ? {
      amenityFeature: [
        ...(project.highlights ?? []).map(h => ({ '@type': 'LocationFeatureSpecification', name: h, value: true })),
        ...(project.amenities ?? []).map(a => ({ '@type': 'LocationFeatureSpecification', name: a, value: true })),
      ],
    } : {}),
    ...(project.unitMix?.length ? {
      accommodationFloorPlan: project.unitMix.map(u => ({
        '@type': 'FloorPlan',
        name: u.type,
        floorSize: { '@type': 'QuantitativeValue', value: u.size, unitText: 'sqft' },
        ...(u.price ? { numberOfRooms: { '@type': 'QuantitativeValue', value: u.type.replace(/[^0-9]/g, '') || undefined } } : {}),
      })),
    } : {}),
  };

  const locationNoComma = project.location.replace(/,/g, '');
  const unitType = project.unitMix?.[0]?.type ?? '';
  renderRoute({
    route: `/projects/${project.id}`,
    title: (() => {
      const unitSuffix = unitType ? ` ${unitType}` : '';
      const action = project.category === 'Leasing' ? 'For Lease' : 'Investment';
      const base = `${project.name}${unitSuffix} — ${action} in Gurgaon | LSR Realty`;
      return base.length <= 65 ? base : `${project.name} — ${action} in Gurgaon | LSR Realty`;
    })(),
    description: (() => {
      const base = `${project.name}, ${project.location}. ${project.priceRange}. ${project.developer}.`;
      const suffix = ` ${project.category === 'Leasing' ? 'Leasing' : 'Investment'} advisory by LSR Realty, Gurgaon.`;
      const full = base + suffix;
      return full.length <= 160 ? full : (base.length <= 157 ? base + '...' : base.slice(0, 157) + '...');
    })(),
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
    preloadImage: project.image?.startsWith('/') ? project.image : undefined,
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
    : sector.description.length + descSuffix.length > 156
      ? `${sector.description.slice(0, Math.max(153 - descSuffix.length, 0)).trim()}...${descSuffix}`
      : `${sector.description}${descSuffix}`;

  const mapSchema = {
    '@context': 'https://schema.org',
    '@type': 'Map',
    name: mapTitle.replace(' | LSR Realty', ''),
    description: mapDesc,
    url: `${SITE_URL}/maps/${sector.id}`,
    image: { '@type': 'ImageObject', url: `${SITE_URL}${sector.zoom}`, name: `${sector.name} Layout Plan`, description: mapDesc },
    about: {
      '@type': 'Place',
      name: sector.name,
      containedInPlace: {
        '@type': 'City',
        name: 'Gurugram',
        alternateName: 'Gurgaon',
        containedInPlace: { '@type': 'State', name: 'Haryana', containedInPlace: { '@type': 'Country', name: 'India' } },
      },
    },
    publisher: { '@type': 'Organization', name: 'LSR Realty', url: SITE_URL },
    mapType: isMasterPlan ? 'https://schema.org/ZoningMap' : 'https://schema.org/UrbanMap',
    license: 'https://dtcpharyana.gov.in/',
    dateModified: '2026-07-16',
    ...(isMasterPlan ? {
      potentialAction: {
        '@type': 'DownloadAction',
        name: 'Download Gurgaon Master Plan 2031 Map',
        target: `${SITE_URL}${sector.zoom}`,
        object: { '@type': 'ImageObject', url: `${SITE_URL}${sector.zoom}`, name: 'Gurgaon Manesar Master Plan 2031 High-Resolution Map' },
      },
    } : {}),
  };

  renderRoute({
    route: `/maps/${sector.id}`,
    title: mapTitle,
    description: mapDesc,
    keywords: isMasterPlan
      ? 'Gurgaon Master Plan 2031 map, Gurgaon Master Plan 2031 PDF download, Gurugram Manesar Urban Complex map, DTCP Haryana Master Plan, Gurgaon Master Plan 2031 land use, Gurgaon sector map download, Gurugram Master Plan 2031'
      : `${sector.name} layout plan, ${sector.name} map, ${sector.name} Gurgaon, ${sector.name} plot layout, Gurgaon sector map, Gurugram sector map, DTCP Haryana layout`,
    image: `${SITE_URL}${sector.zoom}`,
    breadcrumbs: [
      HOME,
      { name: 'Gurgaon Maps', url: `${SITE_URL}/maps` },
      { name: sector.name, url: `${SITE_URL}/maps/${sector.id}` },
    ],
    structuredData: [mapSchema],
  });
}

// ── Blog detail pages ─────────────────────────────────────────────────────────
const publishedPosts = BLOG_POSTS.filter(p => p.published);
// FAQ schemas per blog post — injected as FAQPage structured data for rich snippet eligibility
const BLOG_FAQ_SCHEMAS = {
  'golf-course-extension-road-vs-golf-course-road-gurgaon': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Golf Course Extension Road better than Golf Course Road for property investment?',
        acceptedAnswer: { '@type': 'Answer', text: 'GCER (Golf Course Extension Road, Sectors 58–65) has outperformed Golf Course Road in price appreciation since 2020. One LSR Realty client property on GCER rose from ₹4.68 Cr in September 2021 to ₹17 Cr in 2026, a gain of 263% in under five years. New supply on GCR is limited while GCER has active development with projects like DLF Privana, DLF Arbour, and Emaar Serenity. Current prices on GCER are ₹15,000 to ₹25,000 per sqft versus ₹18,000 to ₹30,000 per sqft on GCR. GCER is the preferred corridor for capital appreciation; GCR is preferred for established luxury and Grade A commercial.' },
      },
      {
        '@type': 'Question',
        name: 'What is the price per sqft on Golf Course Extension Road in 2026?',
        acceptedAnswer: { '@type': 'Answer', text: 'Golf Course Extension Road (GCER, Sectors 58–65) prices in 2026 range from ₹15,000 to ₹25,000 per sqft for luxury residential projects. DLF Arbour is priced at approximately ₹23,500 to ₹24,000 per sqft. DLF Privana South is priced at ₹7.5 Cr and above for 4 BHK. Emaar Serenity and newer Elan projects on GCER range from ₹15,000 to ₹19,000 per sqft. Contact LSR Realty at +91 8448660019 for current project-specific pricing.' },
      },
      {
        '@type': 'Question',
        name: 'Which luxury residential projects are available on Golf Course Extension Road, Gurgaon?',
        acceptedAnswer: { '@type': 'Answer', text: 'Active luxury projects on Golf Course Extension Road (GCER) in 2026 include DLF The Arbour (Sector 63, ultra-luxury 4 BHK, resale only), DLF Privana South (Sector 76–77, luxury 4 BHK), Emaar Serenity (Sector 65, 3 and 4 BHK), Elan Paradise (Sector 50), and AIPL Joy Street (high-street retail). LSR Realty is an authorised advisor for all these projects. Contact +91 8448660019 or marketing@lsrrealty.com.' },
      },
    ],
  },
  'gurgaon-manesar-master-plan-2031-explained': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the Gurgaon Manesar Master Plan 2031?',
        acceptedAnswer: { '@type': 'Answer', text: 'The Gurgaon Manesar Master Plan 2031 is the official land use and development plan for the Gurgaon-Manesar Urban Complex, prepared by the Department of Town and Country Planning (DTCP), Haryana. It covers Gurugram district up to Sector 115 and the Manesar IMT zone. The plan defines residential, commercial, industrial, and green zones, designates major road corridors, and specifies floor-area-ratio (FAR) norms. It is the statutory basis for all development approvals, RERA registrations, and land-use changes in Gurgaon.' },
      },
      {
        '@type': 'Question',
        name: 'How does the Gurgaon Master Plan 2031 affect property investment?',
        acceptedAnswer: { '@type': 'Answer', text: 'The Gurgaon Master Plan 2031 determines where new residential and commercial development can occur, what FSI developers can build to, and which corridors receive infrastructure investment. Sectors zoned Residential R3 have seen new apartment supply under RERA. Corridors designated for metro extension have seen property price premiums near proposed stations. Investors should cross-reference any project\'s land parcel against the Master Plan 2031 zone to verify legality and growth outlook.' },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between Gurgaon Master Plan 2031 and Master Plan 2041?',
        acceptedAnswer: { '@type': 'Answer', text: 'The Gurgaon Manesar Master Plan 2031 is the current operative land-use plan, in force and the basis for all RERA registrations in Gurugram. The Master Plan 2041 is under preparation by GMDA (Gurugram Metropolitan Development Authority) and has not been finalised. It is expected to extend the planning boundary, account for a projected population of 55 lakh by 2041, and add new infrastructure corridors. Until the 2041 plan is formally notified by the Haryana government, the 2031 plan remains the legal reference for property transactions.' },
      },
    ],
  },
};

// SEO-optimised short titles for blog posts whose full title exceeds 65 chars
const BLOG_TITLE_OVERRIDES = {
  'golf-course-extension-road-vs-golf-course-road-gurgaon': 'GCER vs Golf Course Road: Gurgaon Investment Guide | LSR Realty',
  'gurgaon-manesar-master-plan-2031-explained': 'Gurgaon Master Plan 2031: Property Investor Guide | LSR Realty',
};

for (const post of publishedPosts) {
  const postDescription = post.metaDescription || post.excerpt;
  const postImage = post.image?.startsWith('http') ? post.image : `${SITE_URL}${post.image}`;
  const postUrl = `${SITE_URL}/blog/${post.id}`;
  const isoDate = post.dateISO || '2026-07-03';

  const wordCount = post.content ? post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length : 0;

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
      url: `${SITE_URL}/about`,
      knowsAbout: ['real estate investment Gurgaon', 'office leasing Gurgaon', 'NRI property investment India'],
    },
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
    wordCount: wordCount || undefined,
    keywords: `${post.category}, Gurgaon real estate, Gurugram property investment, LSR Realty`,
    audience: { '@type': 'Audience', audienceType: 'Real estate investors, HNI, NRI, property buyers in Gurgaon' },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.article-lead', '[data-speakable]'],
      xpath: ['/html/head/title', "/html/head/meta[@name='description']/@content"],
    },
  };

  renderRoute({
    route: `/blog/${post.id}`,
    title: BLOG_TITLE_OVERRIDES[post.id] || `${post.title} | LSR Realty`,
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
    structuredData: BLOG_FAQ_SCHEMAS[post.id] ? [articleSchema, BLOG_FAQ_SCHEMAS[post.id]] : [articleSchema],
    preloadImage: post.image?.startsWith('/') ? post.image : undefined,
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
console.log(`✓ Prerendered ${totalRoutes} routes: BreadcrumbList, RealEstateListing, Article, ItemList, Blog, Map, WebPage, JobPosting, FAQPage, CollectionPage schemas.`);
console.log(`✓ Image sitemap: ${imageEntries.length} images across ${imageEntries.length} pages.`);
