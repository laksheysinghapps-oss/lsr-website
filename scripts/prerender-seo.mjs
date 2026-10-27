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
function renderRoute({ route, title, description, image, keywords, ogType, structuredData, breadcrumbs, articleMeta, preloadImage, imageAlt }) {
  const url = `${SITE_URL}${route}`;
  const ogImage = image ?? `${SITE_URL}/images/Logo2.png`;
  // Short alt for image tags: strip "| LSR Realty" suffix from title, fallback to explicit imageAlt
  const shortImageAlt = imageAlt || title.replace(/\s*\|[^|]*LSR Realty.*$/i, '').trim() || 'LSR Realty — Real Estate Advisory Gurgaon';
  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  if (keywords) html = html.replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`);
  html = html.replace(/hreflang="en-IN" href=".*?" \/>/, `hreflang="en-IN" href="${url}" />`);
  html = html.replace(/hreflang="en" href=".*?" \/>/, `hreflang="en" href="${url}" />`);
  // x-default always points to homepage
  html = html.replace(/hreflang="x-default" href=".*?" \/>/, `hreflang="x-default" href="${SITE_URL}/" />`);
  if (ogType) html = html.replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="${ogType}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${ogImage}" />`);
  html = html.replace(/<meta property="og:image:alt" content=".*?" \/>/, `<meta property="og:image:alt" content="${escapeHtml(shortImageAlt)}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${ogImage}" />`);
  html = html.replace(/<meta name="twitter:image:alt" content=".*?" \/>/, `<meta name="twitter:image:alt" content="${escapeHtml(shortImageAlt)}" />`);

  // Article Open Graph meta tags (for blog posts)
  if (ogType === 'article' && articleMeta) {
    const tagLines = (articleMeta.tags || []).map(t => `  <meta property="article:tag" content="${escapeHtml(t)}" />`);
    const articleTags = [
      `  <meta property="article:published_time" content="${articleMeta.publishedTime}" />`,
      `  <meta property="article:modified_time" content="${articleMeta.modifiedTime || articleMeta.publishedTime}" />`,
      `  <meta property="article:author" content="${escapeHtml(articleMeta.author)}" />`,
      `  <meta property="article:section" content="${escapeHtml(articleMeta.section)}" />`,
      ...tagLines,
    ].join('\n');
    html = html.replace('</head>', `${articleTags}\n</head>`);
  }

  // Preload hero image for LCP improvement
  if (preloadImage) {
    const preloadTag = `  <link rel="preload" as="image" href="${preloadImage}" fetchpriority="high">`;
    html = html.replace('</head>', `${preloadTag}\n</head>`);
  }

  // If page has its own FAQPage, remove the global homepage FAQPage from the template
  const hasFaq = structuredData && structuredData.some(sd => sd['@type'] === 'FAQPage');
  if (hasFaq) {
    html = html.replace(/<!--global-faq-start-->[\s\S]*?<!--global-faq-end-->/g, '');
  }

  // Strip recharts modulepreload from pages that don't render charts (charts only on / and /blog*)
  if (!route.startsWith('/blog')) {
    html = html.replace(/<link rel="modulepreload" crossorigin href="[^"]*recharts[^"]*">\n?/g, '');
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

  // Inject geo meta tags on all prerendered pages (the whole site represents the Gurgaon business)
  const geoTags = [
    '  <meta name="geo.region" content="IN-HR" />',
    '  <meta name="geo.placename" content="Gurugram, Haryana, India" />',
    '  <meta name="geo.position" content="28.4091;77.0517" />',
    '  <meta name="ICBM" content="28.4091, 77.0517" />',
  ].join('\n');
  html = html.replace('</head>', `${geoTags}\n</head>`);

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
    title: 'About LSR Realty | Real Estate Broker & Consultant Gurgaon | HNI & NRI Advisory',
    description: 'LSR Realty is Gurgaon\'s trusted real estate broker, consultant and authorised channel partner — the investment advisory arm of LSR Group. Institutional-grade, research-backed advisory for HNI, UHNI and NRI investors.',
    keywords: 'LSR Realty, LSR, LSR Reality, LSR Broker, LSR Agent, LSR Real Estate, LSR Company, LSR Real Estate Gurgaon, LSR Realty Gurgaon, about LSR Realty, LSR Group real estate, real estate broker Gurgaon, real estate consultant Gurgaon, property dealer Gurgaon, real estate agent Gurgaon, channel partner Gurgaon, what is channel partner real estate, RERA registered channel partner Gurgaon, real estate company Gurgaon, best real estate broker Gurgaon, top real estate company Gurgaon 2026, institutional real estate advisory Gurgaon, HNI NRI real estate advisory Gurgaon, flat for sale Gurgaon, property in Gurgaon, real estate investment advisory India, property advisory services Gurgaon',
    breadcrumbs: [HOME, { name: 'About LSR Realty', url: `${SITE_URL}/about` }],
    structuredData: [{
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      url: `${SITE_URL}/about`,
      name: 'About LSR Realty — Institutional Real Estate Advisory, Gurgaon',
      description: 'LSR Realty is the investment advisory arm of LSR Group, bringing institutional-grade, research-backed real estate advisory to HNI, UHNI and NRI investors in Gurgaon.',
      // Reference the canonical entity already defined in index.html — avoids duplicate schemas
      mainEntity: { '@id': `${SITE_URL}/#organization` },
    }, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Where is LSR Realty\'s office in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty\'s office is located at Unit 911, 9th Floor, Magnum Global Park, Sector 58, Golf Course Extension Road, Gurugram, Haryana 122098. The office is easily accessible from Golf Course Extension Road and is close to Sector 58 Metro Station. You can reach us on +91 8448660019 or email marketing@lsrrealty.com to schedule a meeting or free consultation.' },
        },
        {
          '@type': 'Question',
          name: 'How is LSR Realty different from other real estate companies in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty takes an institutional approach to real estate advisory: every recommendation is backed by micro-market data, RERA compliance verification, legal due diligence, and financial modelling. Unlike traditional brokerage firms that push high-commission projects, LSR Realty aligns its advice with the investor\'s return objectives and risk tolerance. The firm is also authorised to advise across residential, commercial, and retail — giving investors one point of contact for a diversified Gurgaon property portfolio.' },
        },
        {
          '@type': 'Question',
          name: 'Does LSR Realty charge an upfront fee for real estate advisory?',
          acceptedAnswer: { '@type': 'Answer', text: 'For property transactions (purchase, leasing, investment in developer projects), LSR Realty\'s fee is a developer or landlord-paid brokerage — investors and tenants pay no upfront fee. For standalone advisory mandates such as portfolio reviews, NRI investment planning, or independent due diligence, fees are structured separately and agreed before engagement. Contact marketing@lsrrealty.com or call +91 8448660019 to discuss your requirements.' },
        },
      ],
    }],
  },
  {
    route: '/blog',
    title: 'Gurgaon Real Estate Blog | Market Intelligence | LSR Realty',
    description: 'Expert insights on Gurgaon real estate investment, market trends, location guides and NRI advisory from LSR Realty.',
    keywords: 'Gurgaon real estate blog, Gurugram property market insights, Gurgaon investment guide, real estate news Gurgaon, property prices Gurgaon 2026, flat for sale Gurgaon 2026, apartment rates Gurgaon, best areas to buy property Gurgaon, property investment tips Gurgaon, real estate market Gurgaon, property price per sqft Gurgaon 2026, Gurgaon property market 2026, Golf Course Extension Road investment, Dwarka Expressway property 2026, best sector to invest Gurgaon, property appreciation Gurgaon, NRI property guide India, luxury real estate trends Gurgaon, RERA Haryana news, real estate capital gains Gurgaon, resale property Gurgaon, under construction property Gurgaon, channel partner meaning real estate, home loan Gurgaon guide, stamp duty Gurgaon 2026, circle rate Gurgaon 2026, GST property purchase India, OC occupancy certificate property, carpet area built-up area difference, buy vs rent Gurgaon, capital gains tax property India, LTCG property 2026, Grade A office Gurgaon guide, rental yield property Gurgaon, vastu flat Gurgaon, property registration process Haryana, builder buyer agreement India',
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
        keywords: ({
          'golf-course-extension-road-vs-golf-course-road-gurgaon': 'Golf Course Extension Road, GCER Gurgaon, Golf Course Road Gurgaon, DLF Arbour Sector 63, DLF Privana Gurgaon, Gurgaon real estate investment, GCER vs GCR Gurgaon, property rates GCER 2026',
          'gurgaon-manesar-master-plan-2031-explained': 'Gurgaon Manesar Master Plan 2031, Gurgaon Master Plan 2031 explained, DTCP Haryana master plan, Gurgaon land use zones, Gurugram development plan 2031, property investment Gurugram',
          'nri-real-estate-buying-guide-gurgaon': 'NRI property investment India, NRI buying property Gurgaon, FEMA NRI real estate, NRE NRO account property investment, NRI home loan India, RERA NRI buyer, NRI buying guide Gurugram 2026',
          'dlf-arbour-vs-dlf-privana-gurgaon': 'DLF Arbour vs DLF Privana South, DLF Arbour Sector 63 resale price, DLF Privana South price 2026, GCER luxury apartments, Golf Course Extension Road property, luxury 4 BHK Gurgaon',
        })[p.id] || `${p.category}, Gurgaon real estate, Gurugram investment`,
      })),
    }],
  },
  {
    route: '/services',
    title: 'Real Estate Services Gurgaon | Broker, Channel Partner & Consultant | LSR Realty',
    description: 'LSR Realty provides real estate brokerage, channel partner advisory and consultancy services in Gurgaon: office leasing, retail leasing, HNI and NRI investment advisory, market research and deal structuring.',
    keywords: 'real estate broker Gurgaon, real estate channel partner Gurgaon, property broker Gurgaon, real estate consultant Gurgaon, property dealer Gurgaon, DLF channel partner Gurgaon, Elan channel partner Gurgaon, AIPL channel partner Gurgaon, M3M channel partner Gurgaon, Godrej channel partner Gurgaon, Sobha channel partner Gurgaon, Signature Global channel partner Gurgaon, office leasing Gurgaon, office space for rent Gurgaon, office space sector 44 Gurgaon, Grade A office Udyog Vihar, office space Cyber City Gurgaon, retail leasing Gurgaon, shop for lease Gurgaon, flat for sale Gurgaon, villa for sale Gurgaon, property for sale Gurgaon, property for rent Gurgaon, apartment for sale Gurgaon, 3 BHK flat Sector 65 Gurgaon, 4 BHK flat Golf Course Extension Road, residential property Gurgaon, commercial property Gurgaon, NRI investment services Gurgaon, NRI power of attorney India, NRI home loan India, RERA registered projects Gurgaon, HRERA approved projects, eco-friendly apartments Gurgaon, IGBC certified Gurgaon, smart home Gurgaon, HNI real estate advisory Gurgaon, luxury property advisory Gurgaon, deal structuring Gurgaon, highest ROI property Gurgaon, best sector to invest Gurgaon, Dwarka Expressway investment 2026, LSR Realty services',
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
    }, {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Lease Office Space in Gurgaon',
      description: 'Step-by-step process for leasing Grade A office space in Gurgaon through LSR Realty. No upfront cost — our fee is landlord-paid.',
      totalTime: 'P30D',
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '0', description: 'No upfront cost to tenant. LSR Realty fee is landlord-paid.' },
      supply: [{ '@type': 'HowToSupply', name: 'Workspace brief with team size, budget and location requirements' }],
      tool: [{ '@type': 'HowToTool', name: 'LSR Realty office leasing advisory' }],
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Define workspace requirements', text: 'Document your team size, budget, preferred location in Gurgaon (Golf Course Road, Udyog Vihar, Cyber City, GCER, SPR, or Dwarka Expressway), fit-out preferences, and growth plan for the next 3 years.' },
        { '@type': 'HowToStep', position: 2, name: 'Survey Grade A options', text: 'LSR Realty shortlists Grade A office spaces matching your brief across Gurgaon\'s prime commercial corridors. Each option is evaluated on rent per sqft, CAM charges, fit-out allowance, lease tenure, and exit flexibility.' },
        { '@type': 'HowToStep', position: 3, name: 'Conduct site visits', text: 'Visit shortlisted properties with LSR Realty. Evaluate building quality, parking, floor plate efficiency, connectivity, power backup, and surrounding amenities. Most corporate tenants shortlist 3 to 5 spaces before deciding.' },
        { '@type': 'HowToStep', position: 4, name: 'Negotiate lease terms', text: 'LSR Realty negotiates on rent, rent-free period, annual escalation (typically 5% per year or 15% every 3 years), security deposit (3 to 6 months), lock-in period, and restoration obligations at lease end.' },
        { '@type': 'HowToStep', position: 5, name: 'Legal review and execution', text: 'A qualified property lawyer reviews the lease deed for liability clauses, sub-letting rights, and exit conditions. Once satisfied, both parties execute the lease deed and the tenant pays the security deposit to take possession.' },
      ],
    }, {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Invest in Luxury Real Estate in Gurgaon',
      description: 'Step-by-step process for investing in luxury residential or commercial real estate in Gurgaon with LSR Realty\'s institutional advisory.',
      totalTime: 'P45D',
      tool: [{ '@type': 'HowToTool', name: 'LSR Realty investment advisory' }],
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Define investment goals and budget', text: 'Establish your budget, investment horizon (short-term capital appreciation vs long-term rental yield), asset type preference (luxury residential, Grade A office, or retail), and target micro-market in Gurgaon.' },
        { '@type': 'HowToStep', position: 2, name: 'Select the right micro-market', text: 'Golf Course Extension Road (Sectors 58–65) for capital appreciation. Golf Course Road for established luxury. Dwarka Expressway for new residential with metro access. Sohna Road and SPR for rental yield. LSR Realty provides data-backed micro-market analysis.' },
        { '@type': 'HowToStep', position: 3, name: 'Verify RERA registration', text: 'Confirm the project is registered on the RERA Haryana portal (harerait.org.in). Cross-check the RERA number, registered carpet area, declared completion timeline, and escrow account details.' },
        { '@type': 'HowToStep', position: 4, name: 'Conduct legal due diligence', text: 'A qualified property lawyer conducts a title search to verify the chain of ownership, check for encumbrances, litigation, and confirm land-use designation under the Gurgaon Manesar Master Plan 2031.' },
        { '@type': 'HowToStep', position: 5, name: 'Structure the transaction', text: 'Plan stamp duty (5-7% in Haryana), registration charges, and capital gains tax implications on exit. For NRI investors, structure funding via NRE account for clean repatriation. LSR Realty coordinates with tax and legal advisors.' },
        { '@type': 'HowToStep', position: 6, name: 'Execute agreement and register', text: 'Sign the builder buyer agreement (BBA) or sale deed. Pay the allotment amount as per payment plan. Complete property registration at the local Sub-Registrar\'s office. Take possession after RERA Occupancy Certificate is issued.' },
      ],
    }, {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Invest in Gurgaon Real Estate as an NRI',
      description: 'Complete process for NRI investors to buy residential or commercial property in Gurgaon from abroad, under FEMA guidelines.',
      totalTime: 'P60D',
      tool: [{ '@type': 'HowToTool', name: 'LSR Realty NRI Desk' }, { '@type': 'HowToTool', name: 'NRE bank account' }, { '@type': 'HowToTool', name: 'Power of Attorney' }],
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Open or activate NRE account', text: 'Fund the purchase through an NRE (Non Resident External) account for clean repatriation on exit. NRO account funds carry repatriation limits. Most major Indian banks including HDFC, SBI, and ICICI offer NRE accounts for overseas Indians.' },
        { '@type': 'HowToStep', position: 2, name: 'Identify FEMA-eligible properties', text: 'NRIs can purchase residential and commercial properties in India under FEMA without RBI approval. Agricultural land, plantation property, and farmhouses are restricted. Verify land-use zoning before proceeding, particularly for plotted developments in outer Gurgaon sectors.' },
        { '@type': 'HowToStep', position: 3, name: 'Execute Power of Attorney', text: 'Appoint a trusted representative in India via a limited, specific Power of Attorney to sign documents, make payments, and register the property on your behalf. The PoA must be executed in your country of residence and apostilled (for Hague Convention countries) or attested by the Indian consulate.' },
        { '@type': 'HowToStep', position: 4, name: 'Conduct remote due diligence', text: 'LSR Realty coordinates remote RERA verification, legal title search, and video walkthroughs of shortlisted projects. Verify the project\'s RERA escrow compliance — 70% of buyer funds must be held in a project-specific escrow account.' },
        { '@type': 'HowToStep', position: 5, name: 'Transfer funds and make payment', text: 'Transfer funds from your NRE account via wire transfer, NEFT, or RTGS to the developer\'s designated bank account. Cash payments are not permitted under FEMA for property transactions. Retain all banking records for future repatriation.' },
        { '@type': 'HowToStep', position: 6, name: 'Complete registration', text: 'Your PoA holder completes property registration at the local Sub-Registrar\'s office in Gurugram. Stamp duty and registration charges are payable at this stage. After the developer receives RERA Occupancy Certificate, possession is taken through your PoA holder.' },
      ],
    }],
  },
  {
    route: '/projects',
    title: 'Curated Property Investment & Leasing Opportunities Gurgaon | LSR Realty',
    description: 'Browse LSR Realty\'s curated portfolio of vetted property investment and leasing opportunities across Gurgaon and Gurugram — luxury residential, Grade A office and premium retail.',
    keywords: 'property in Gurgaon, property in Gurugram, flat for sale Gurgaon, apartment for sale Gurgaon, 2 BHK flat Gurgaon, 3 BHK flat Gurgaon, 4 BHK flat Gurgaon, villa for sale Gurgaon, plot for sale Gurgaon, ready to move flats Gurgaon, new launch property Gurgaon, pre-launch property Gurgaon, luxury property Gurgaon, buy flat in Gurgaon, residential property for sale Gurgaon, office space for lease Gurgaon, shop for lease Gurgaon, retail space Gurgaon, commercial property Gurgaon, Gurgaon real estate projects, Gurgaon investment properties, Gurgaon leasing opportunities, residential projects Gurgaon, commercial projects Gurgaon, DLF property Gurgaon, Elan project Gurgaon, Emaar property Gurgaon, AIPL project Gurgaon, M3M Gurgaon property, M3M Golf Estate Sector 65, M3M Heights Sector 65 Gurgaon, Godrej Properties Gurgaon, Sobha Realty Gurgaon, Signature Global Gurgaon, Signature Global Park Gurgaon, Mahindra Lifespaces Gurgaon, Whiteland Corporation Gurgaon, Smartworld Developers Gurgaon, Smartworld The Edition Gurgaon, Central Park Resorts Gurgaon, BPTP Gurgaon, Krisumi Waterfall Residences Gurgaon, Vatika Group Gurgaon, Raheja Developers Gurgaon, Eldeco Fairway Reserve Gurgaon, 3 BHK ready to move Gurgaon, 4 BHK ready to move Gurgaon, 5 BHK luxury apartment Gurgaon, property with best ROI Gurgaon, best real estate investment Gurgaon, property price appreciation Gurgaon, rental yield property Gurgaon, RERA registered projects Gurgaon, HRERA approved flats Gurgaon, eco-friendly apartments Gurgaon, IGBC certified apartments Gurgaon, smart home Gurgaon, Sector 65 property Gurgaon, Sector 58 property Gurgaon, Sector 82 property Gurgaon, Sector 86 property Gurgaon, Sector 89 property Gurgaon, Sector 102 property Gurgaon, Sector 103 property Gurgaon, Sector 57 property Gurgaon, Sector 43 Gurgaon property, best sector to invest Gurgaon, which sector is best Gurgaon, highest appreciation area Gurgaon, LSR Realty projects',
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
    }, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What types of properties does LSR Realty advise on in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty advises on luxury residential (4 and 5 BHK apartments, villas), Grade A commercial office spaces, and premium retail (high street, mall retail, mixed-use) across all major Gurgaon corridors. The portfolio covers projects by DLF, Emaar, Elan, Godrej, Vatika, AIPL, Magnum, and other leading developers across Golf Course Extension Road, Golf Course Road, Dwarka Expressway, Sohna Road, and SPR.' },
        },
        {
          '@type': 'Question',
          name: 'How many real estate projects does LSR Realty cover in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: `LSR Realty actively advises on over ${PROJECTS.length} investment and leasing projects in Gurgaon, covering luxury residential, Grade A office, and premium retail segments. Projects span all major Gurugram corridors from Golf Course Extension Road and Golf Course Road to Dwarka Expressway, Sohna Road, and SPR. Contact LSR Realty at +91 8448660019 for current inventory and pricing.` },
        },
        {
          '@type': 'Question',
          name: 'Does LSR Realty charge buyers or tenants for real estate advisory in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'For residential investment and commercial leasing transactions, LSR Realty\'s fee is a brokerage arrangement with the developer or landlord. Buyers and tenants pay no upfront advisory fee. For standalone investment consultancy or portfolio structuring assignments, fees are agreed case-by-case. Contact marketing@lsrrealty.com to discuss your requirements.' },
        },
      ],
    }],
  },
  {
    route: '/maps',
    title: 'Gurgaon Sector Maps & Layout Plans | Free PDF Download | LSR Realty',
    description: 'Free Gurgaon sector layout maps and the Gurgaon Manesar Master Plan 2031. High-resolution PDF downloads for 75+ sectors across GCER, Golf Course Road, Dwarka Expressway and Sohna Road.',
    keywords: 'Gurgaon sector maps, Gurugram sector layout plans, Gurgaon map download, DTCP Haryana maps, Gurgaon Master Plan 2031, sector layout Gurgaon, Gurugram map, property location Gurgaon, plot map Gurgaon, residential sector Gurgaon, Golf Course Extension Road map, Dwarka Expressway sector map, Sohna Road sector map, free sector map Gurgaon, Gurgaon sector 58 map, Sector 65 map Gurgaon, Sector 82 map Gurgaon, Sector 86 map Gurgaon, Sector 103 map Gurgaon, Sector 57 Gurgaon map, Sector 67 Gurgaon layout, Sector 37 map Gurgaon, Sector 47 Gurgaon map, Sector 76 Gurgaon map, Sector 77 map Gurgaon, Gurgaon zone map download, Gurugram plot layout free download, Master Plan 2031 PDF download, Gurgaon layout plan DTCP, HRERA zone map, Gurgaon land use map, Pace City II sector map Gurgaon, Nirvana Country map Gurgaon',
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
      dateModified: '2026-10-21',
    }, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Where can I find official Gurgaon sector layout maps?',
          acceptedAnswer: { '@type': 'Answer', text: 'Official approved sector layout plans for Gurugram (Gurgaon) are available on lsrrealty.com/maps. The page hosts high-resolution layout maps for 75+ sectors and the complete Gurgaon Manesar Master Plan 2031, all approved by DTCP Haryana (Department of Town and Country Planning). Maps are free to view and download without registration.' },
        },
        {
          '@type': 'Question',
          name: 'Are the Gurgaon sector maps on LSR Realty free to download?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. All sector layout maps on lsrrealty.com/maps are free to view and download, including the full-resolution Gurgaon Manesar Master Plan 2031 map. No registration or payment is required. Maps are sourced from DTCP Haryana\'s official approved plans and cover all major Gurgaon sectors, including Golf Course Extension Road sectors (58–65), Golf Course Road, Dwarka Expressway, Sohna Road, and SPR.' },
        },
        {
          '@type': 'Question',
          name: 'Which sectors are covered in the Gurgaon Master Plan 2031 map?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Gurgaon Manesar Master Plan 2031 covers the entire Gurugram-Manesar Urban Complex, including all residential and commercial sectors up to Sector 115 and the Manesar IMT industrial zone. The plan designates land use zones (residential R1–R4, commercial, industrial, green/recreational), major road corridors, metro alignments, and development control norms (FAR, coverage, setbacks). Individual sector layout plans show plot boundaries, road widths, and land use within each sector.' },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between a Gurgaon sector layout plan and the Master Plan 2031?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Gurgaon Manesar Master Plan 2031 is the macro-level land use document for the entire 33,872-hectare Gurugram-Manesar Urban Complex, showing broad zones (residential, commercial, industrial, green belt) across all sectors. A sector layout plan is the detailed, sector-specific drawing that shows individual plot boundaries, internal road widths, park locations, and land use designations within one sector. Before buying property, investors should verify both: the Master Plan to confirm zone designation, and the sector layout plan to confirm plot boundaries and road widths.' },
        },
        {
          '@type': 'Question',
          name: 'Which Gurgaon sectors are on Golf Course Extension Road?',
          acceptedAnswer: { '@type': 'Answer', text: 'Golf Course Extension Road (GCER) runs through Sectors 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, and 70 in Gurugram. The key investment sectors on GCER are Sector 58 (commercial hub, Magnum Global Park), Sector 65 (luxury residential — DLF, Emaar, Elan), and Sectors 62–63 (mixed residential and commercial). GCER is among the most active real estate corridors in Gurgaon, with strong capital appreciation and rental demand.' },
        },
        {
          '@type': 'Question',
          name: 'What does a DTCP-approved sector map mean in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'A DTCP-approved map is a sector layout plan or zoning map officially sanctioned by the Department of Town and Country Planning, Haryana. DTCP approval means the plan is legally binding — land uses shown on the map (residential, commercial, park, utility) cannot be changed without a formal amendment. For property investors, a DTCP-approved layout plan confirms that a plot\'s designated use is legally recognised, which is essential for RERA registration, bank loans, and future resale. All maps on lsrrealty.com/maps are sourced from DTCP Haryana\'s official approved plans.' },
        },
        {
          '@type': 'Question',
          name: 'How do I read a Gurgaon sector layout plan?',
          acceptedAnswer: { '@type': 'Answer', text: 'A Gurgaon sector layout plan shows: (1) Plot boundaries — each plot is numbered and its area is marked in square metres or square yards; (2) Road widths — colour-coded lines indicate the width of each road (wider roads carry more commercial value); (3) Land use — residential plots (R), commercial plots (C), parks (P), schools (S), and utility sites are marked with standard abbreviations; (4) Sector boundaries — the outer boundary shows how the sector connects to neighbouring sectors and main roads. When evaluating a property, check that the plot number on your sale deed matches the layout plan, and verify the designated land use (residential, commercial, mixed) before purchasing.' },
        },
        {
          '@type': 'Question',
          name: 'Which Gurgaon sectors are best for real estate investment?',
          acceptedAnswer: { '@type': 'Answer', text: 'Based on the Gurgaon Master Plan 2031 and current market data, the top sectors for real estate investment are: Sector 65 (Golf Course Extension Road) — luxury residential, strong capital appreciation; Sector 58 (GCER) — Grade A commercial, high rental yields; Sectors 82–83 (Dwarka Expressway) — new residential with metro access, upcoming infrastructure; Sector 57 (Golf Course Road) — established luxury residential; Sectors 47–48 (Sohna Road) — mid-premium residential, improving connectivity. LSR Realty provides micro-market analysis across all these corridors to help investors identify the right sector for their budget and return objectives.' },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between the Gurgaon Master Plan 2031 and Master Plan 2041?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Gurgaon Manesar Master Plan 2031 is the current operative land-use plan for Gurugram, prepared by DTCP Haryana and legally in force for all RERA registrations, development approvals and property transactions. The Gurgaon Master Plan 2041 is a future plan being prepared by GMDA (Gurugram Metropolitan Development Authority) to accommodate 55 lakh projected population by 2041. As of October 2026, the 2041 plan has not been formally notified — only the 2031 plan is legally binding. LSR Realty tracks the 2041 plan\'s status at lsrrealty.com/gurgaon-master-plan-2041.' },
        },
        {
          '@type': 'Question',
          name: 'Where can I download the Gurgaon Master Plan 2031 map for free?',
          acceptedAnswer: { '@type': 'Answer', text: 'The official Gurgaon Master Plan 2031 zone map is available as a free high-resolution download at lsrrealty.com/maps/gurgaon-manesar-master-plan. The map is sourced from DTCP Haryana\'s approved plan and shows all land use zones, sector boundaries, metro corridors and transport routes across the Gurugram Manesar Urban Complex. No registration or payment required.' },
        },
      ],
    }],
  },
  {
    route: '/careers',
    title: 'Careers at LSR Realty | Real Estate Jobs Gurgaon',
    description: 'Join LSR Realty\'s advisory team in Gurgaon. We hire for real estate sales, leasing, client advisory and operations roles. View current openings.',
    keywords: 'LSR Realty careers, real estate jobs Gurgaon, leasing manager Gurgaon, commercial real estate jobs, sales jobs Gurgaon, real estate agent jobs Gurgaon, property consultant jobs Gurgaon, real estate sales jobs Gurgaon, channel partner jobs Gurgaon, business development real estate Gurgaon, real estate company jobs Gurugram, commercial leasing jobs Gurgaon, real estate internship Gurgaon, work in real estate Gurgaon, telecaller real estate Gurgaon, LSR Realty jobs, property sales jobs Gurgaon, real estate career Gurgaon, real estate jobs Gurugram, join real estate company Gurgaon',
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
        datePosted: '2026-07-01',
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
        datePosted: '2026-07-01',
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
    title: 'Contact LSR Realty | Real Estate Broker & Consultant Gurgaon',
    description: 'Speak with LSR Realty — Gurgaon\'s trusted real estate broker, consultant and authorised channel partner. Free initial consultation for investment advisory, office leasing, retail leasing and NRI services.',
    keywords: 'contact LSR Realty, LSR Realty contact number, LSR Realty Gurgaon, LSR contact, LSR Reality contact, LSR Broker contact, LSR Agent contact, LSR Real Estate contact, real estate broker contact Gurgaon, real estate consultant Gurgaon contact, property dealer Gurgaon contact, channel partner Gurgaon, book consultation Gurgaon real estate, flat for sale Gurgaon enquiry, office space lease Gurgaon enquiry, property for sale Gurgaon enquiry',
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
        alternateName: ['LSR', 'LSR Realty Gurgaon', 'LSR Realty Advisory', 'LSR Group Real Estate'],
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
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: 5.0,
          reviewCount: 2,
          bestRating: 5,
          worstRating: 1,
        },
      },
    }, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How can I contact LSR Realty for real estate advisory in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'You can reach LSR Realty at +91 8448660019 or email marketing@lsrrealty.com. The office is at 911, Magnum Global Park, Sector 58, Gurugram, Haryana 122098. Office hours are Monday to Friday 10 AM to 7 PM and Saturday to Sunday 10 AM to 5 PM. You can also submit an inquiry through the contact form at lsrrealty.com/contact.' },
        },
        {
          '@type': 'Question',
          name: 'Does LSR Realty offer free real estate consultation in Gurgaon?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. LSR Realty offers a free initial consultation for residential investment, office leasing, retail leasing, and NRI advisory. For property transactions (purchases, leasing), our advisory is at no upfront cost to you — our fee is a brokerage arrangement with the developer or landlord. Call +91 8448660019 or email marketing@lsrrealty.com to schedule a consultation.' },
        },
        {
          '@type': 'Question',
          name: "Where is LSR Realty's office located in Gurgaon?",
          acceptedAnswer: { '@type': 'Answer', text: "LSR Realty's office is located at 911, Magnum Global Park, Sector 58, Golf Course Extension Road, Gurugram, Haryana 122098. Magnum Global Park is on Golf Course Extension Road (GCER), easily accessible from Golf Course Road, Sohna Road, and NH 48. The nearest landmark is the Sector 58 Rapid Metro Station, approximately 1 km away." },
        },
      ],
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
    title: 'Gurgaon Master Plan 2041: Status, Map & PDF | LSR Realty',
    description: 'Gurgaon Master Plan 2041 tracker: latest status, map and PDF download guidance, 55 lakh population projection, and how 2041 compares to the current Master Plan 2031.',
    keywords: 'Gurgaon Master Plan 2041, Gurugram Master Plan 2041, Gurgaon Master Plan 2041 map, Gurgaon Master Plan 2041 PDF, Gurgaon Master Plan 2041 PDF download, Gurgaon Master Plan 2041 free download, Gurgaon 2041 master plan status, Gurgaon master plan 2041 latest news 2026, GMDA 2041 master plan, Gurgaon 2041 infrastructure plan, Gurgaon master plan 2041 vs 2031, Gurgaon 2041 investment zones, Gurugram 2041 development plan, Gurgaon next master plan, DTCP Haryana 2041 plan, Gurgaon Master Plan 2041 when released',
    breadcrumbs: [HOME, { name: 'Gurgaon Master Plan 2041', url: `${SITE_URL}/gurgaon-master-plan-2041` }],
    structuredData: [{
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/gurgaon-master-plan-2041`,
      name: 'Gurgaon Master Plan 2041: Status, Map & Infrastructure Roadmap',
      description: 'Detailed tracker for the Gurgaon Master Plan 2041 by GMDA (Gurugram Metropolitan Development Authority). Covers status update, population projection of 55 lakh, new sector development, metro corridors and investment implications.',
      url: `${SITE_URL}/gurgaon-master-plan-2041`,
      dateModified: '2026-09-05',
      significantLink: [`${SITE_URL}/maps/gurgaon-manesar-master-plan`, `${SITE_URL}/blog/gurgaon-manesar-master-plan-2031-explained`, `${SITE_URL}/contact`],
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
    }, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the Gurgaon Master Plan 2041?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Gurgaon Master Plan 2041 is the upcoming long-term urban development plan for Gurugram, being prepared by GMDA (Gurugram Metropolitan Development Authority). It will supersede the current Gurgaon Manesar Master Plan 2031 and cover a projected population of 55 lakh by 2041. The plan is expected to extend the planning boundary to new sectors, designate new infrastructure corridors including metro extensions, and create new residential and commercial zones.' },
        },
        {
          '@type': 'Question',
          name: 'When will the Gurgaon Master Plan 2041 be released?',
          acceptedAnswer: { '@type': 'Answer', text: 'As of mid-2026, the Gurgaon Master Plan 2041 has not been finalised or officially notified by the Haryana government. GMDA is preparing the draft plan. Until it is formally notified, the existing Gurgaon Manesar Master Plan 2031 remains the operative legal document for all land use, RERA registrations, and development approvals in Gurugram.' },
        },
        {
          '@type': 'Question',
          name: 'How will the Gurgaon Master Plan 2041 affect real estate investment?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Gurgaon Master Plan 2041 is expected to open up new development zones in outer Gurugram sectors, extending infrastructure to areas currently under or undeveloped. Properties in sectors earmarked for new residential or commercial designation under the 2041 plan, and along new metro corridors, typically see price appreciation once zones are formally notified. Investors tracking the 2041 plan should monitor GMDA announcements and compare proposed zoning changes against current land holdings. LSR Realty provides investment advisory guided by both the current 2031 plan and the emerging 2041 framework.' },
        },
      ],
    }],
  },
];

for (const r of staticRoutes) renderRoute(r);

// ── Project FAQ schemas — per-project FAQPage for rich snippet eligibility ────
const PROJECT_FAQ_SCHEMAS = {
  'dlf-arbour': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the price of DLF The Arbour in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF The Arbour is currently available on the resale market at ₹23,500 to ₹24,000 per sqft. A 4 BHK plus staff unit of 3,900+ sqft is priced between ₹9.3 crore and ₹9.5 crore. The project is fully sold out from the developer. Contact LSR Realty at +91 8448660019 for verified resale inventory and current pricing.' } },
      { '@type': 'Question', name: 'Is DLF The Arbour sold out?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, DLF The Arbour in Sector 63, Golf Course Extension Road, Gurgaon, is fully sold out at the developer level. All available units are on the secondary resale market. LSR Realty can connect buyers with verified resale inventory across preferred towers and floors.' } },
      { '@type': 'Question', name: 'What is the RERA number of DLF The Arbour?', acceptedAnswer: { '@type': 'Answer', text: 'The RERA registration number for DLF The Arbour is GGM/671/403/2023/15, registered with HARERA (Haryana Real Estate Regulatory Authority). Buyers can verify project details, escrow compliance, and builder information on the HRERA portal at harerait.org.in.' } },
      { '@type': 'Question', name: 'When is DLF Arbour possession date?', acceptedAnswer: { '@type': 'Answer', text: 'DLF The Arbour has a declared possession date of March 2030. The project is currently under construction in Sector 63, Golf Course Extension Road, Gurgaon. For resale purchases, buyers are typically transferring ownership of a unit that will be delivered at the same March 2030 timeline.' } },
      { '@type': 'Question', name: 'What makes DLF Arbour unique compared to other luxury projects in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF The Arbour offers just 2 apartments per core across 38 floors — an exceptional level of privacy unmatched by almost any other project in Gurgaon. The 1.25 lakh sqft clubhouse, private elevator lobbies, concierge service, and temperature-controlled pools set it apart. At 3,900+ sqft per unit, it is one of the largest ultra-luxury 4 BHK configurations available on Golf Course Extension Road.' } },
    ],
  },
  'dlf-privana': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the price of DLF Privana South in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Privana South is priced at ₹21,000 per sqft. A 4 BHK of 3,577 sqft starts at ₹7.5 crore, and a penthouse of 5,472 sqft is priced at approximately ₹11.5 crore. The project is under construction in Sectors 76–77, Golf Course Extension Road, Gurgaon, with possession expected in July 2029. Contact LSR Realty at +91 8448660019 for current pricing and availability.' } },
      { '@type': 'Question', name: 'When is DLF Privana South possession?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Privana South has a declared possession date of July 2029. The project is RERA-registered under HARERA/GGM/772/504/2023/116 and is under active construction in Sectors 76–77, Golf Course Extension Road, Gurgaon.' } },
      { '@type': 'Question', name: 'What is the RERA number of DLF Privana South?', acceptedAnswer: { '@type': 'Answer', text: 'The RERA registration number for DLF Privana South is HARERA/GGM/772/504/2023/116, registered with the Haryana Real Estate Regulatory Authority. Project details including escrow compliance can be verified at harerait.org.in.' } },
      { '@type': 'Question', name: 'Is DLF Privana South a good investment in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Privana South at ₹21,000 per sqft in an emerging sector with direct NH 48 access and Aravalli views is considered a strong appreciation play by LSR Realty\'s advisory team. The Sectors 76–80 corridor is being built out as an integrated DLF township. Investors with a 3-year-plus horizon and comfort with under-construction risk from DLF\'s proven delivery record are well-positioned. Contact LSR Realty for a detailed investment analysis.' } },
      { '@type': 'Question', name: 'What is the difference between DLF Privana South and DLF Privana West?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Privana South is located in Sectors 76–77, Golf Course Extension Road, with Aravalli views and direct NH 48 access. DLF Privana West is a separate parcel within the larger DLF Privana township cluster in the Sectors 76–80 zone. Both are part of DLF\'s integrated township vision for New Gurgaon. Contact LSR Realty for a comparison of pricing, unit configurations, and investment potential across both projects.' } },
    ],
  },
  'emaar-serenity': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the price of Emaar Serenity Hills in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Emaar Serenity Hills is priced at ₹17,000 to ₹18,000 per sqft. A 3 BHK of 1,700 sqft starts at ₹2.95 crore and a 4 BHK of 2,800 sqft is priced at ₹4.4 crore. The project is a new launch in Sector 86, Dwarka Expressway, Gurgaon, with possession expected in September 2030. Contact LSR Realty at +91 8448660019 for current pricing and availability.' } },
      { '@type': 'Question', name: 'Where is Emaar Serenity Hills located?', acceptedAnswer: { '@type': 'Answer', text: 'Emaar Serenity Hills is located in Sector 86, Dwarka Expressway, Gurgaon. Sector 86 offers easy access to Dwarka Expressway, established social infrastructure, and proximity to IGI Airport, making it a well-connected location for premium residential investment.' } },
      { '@type': 'Question', name: 'Is Emaar Serenity Hills RERA registered?', acceptedAnswer: { '@type': 'Answer', text: 'Emaar Serenity Hills in Sector 86, Gurgaon is developed by Emaar India, a subsidiary of Emaar Properties (Dubai). Buyers should verify the current RERA registration on the HRERA portal at harerait.org.in before proceeding. LSR Realty is an authorised advisor for Emaar Serenity Hills and can share verified RERA details. Contact marketing@lsrrealty.com.' } },
    ],
  },
  'westin-residences': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the price of The Westin Residences Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'The Westin Residences on Dwarka Expressway are priced at ₹25,750 to ₹26,750 per sqft. A 3 BHK of 2,693 to 2,939 sqft starts at ₹6.75 crore and a 4 BHK of 3,750 to 4,329 sqft starts at ₹10.03 crore. Possession is expected in December 2029. Contact LSR Realty at +91 8448660019 for current pricing and payment plan details.' } },
      { '@type': 'Question', name: 'What are branded residences and how does Westin differ from regular luxury apartments?', acceptedAnswer: { '@type': 'Answer', text: 'Branded residences are luxury homes co-developed with a global hospitality brand — in this case, Westin by Marriott International. Residents receive hotel-standard services including housekeeping, in-residence dining, spa and sauna, and concierge support as part of living in the building. The Westin Residences differ from regular luxury apartments in that the brand\'s operational standards, design guidelines, and service delivery are maintained by the hotel group, not just a residential management company.' } },
      { '@type': 'Question', name: 'Where is The Westin Residences located in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'The Westin Residences is located in Sector 103, Dwarka Expressway, Gurgaon. Sector 103 offers direct Dwarka Expressway access, proximity to IGI Airport (approximately 15 km), and connectivity to Golf Course Road and NH 48. The location is ideal for senior corporate professionals and NRI buyers seeking proximity to the airport.' } },
    ],
  },
  'elan-paradise': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Elan Paradise in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Paradise is a luxury retail and entertainment complex in Sector 50, Nirvana Country, Gurugram. Developed by Elan Group, it offers retail units, double height units, and F&B / restaurant spaces in a premium catchment surrounded by established residential communities on Golf Course Extension Road. The project is ready to occupy and available for lease through LSR Realty.' } },
      { '@type': 'Question', name: 'How can I lease retail space in Elan Paradise Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'To lease retail space in Elan Paradise, Sector 50, Gurgaon, contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com. LSR Realty is an authorised leasing advisor for Elan Paradise and can provide available unit sizes, lease pricing, fit-out allowances, and current tenant mix information.' } },
    ],
  },
  'aipl-joy-street': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Joy Street in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Joy Street is a high-street retail development by Advance India Projects Limited (AIPL) on Golf Course Extension Road, Gurgaon. It offers retail units across ground and upper floors in a walkable street-retail format designed for F&B, fashion, wellness, and lifestyle brands. LSR Realty is an authorised leasing advisor. Contact +91 8448660019 for available units and lease pricing.' } },
      { '@type': 'Question', name: 'How do I lease a shop in AIPL Joy Street Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com to enquire about available units in AIPL Joy Street, Golf Course Extension Road, Gurgaon. LSR Realty is an authorised advisor for AIPL projects and can provide unit availability, current asking rents, fit-out conditions, and nearby tenant mix information.' } },
    ],
  },
  'dlf-magnolias': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is DLF The Magnolias in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF The Magnolias is an ultra-luxury residential project by DLF on Golf Course Road, Sector 42, Gurgaon. It is one of DLF\'s most prestigious addresses, offering large-format 4 and 5 BHK luxury apartments with expansive floor plates, dedicated service areas, and a world-class clubhouse. The project is delivered and available on the resale market.' } },
      { '@type': 'Question', name: 'What is the current resale price of DLF Magnolias in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF The Magnolias on Golf Course Road, Gurgaon is available on the resale market. Pricing varies significantly by floor, tower, and view. Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for verified current resale pricing and available inventory.' } },
    ],
  },
  'elan-town-centre': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Elan Town Centre in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Town Centre is a premium retail and commercial development by Elan Group in Sector 67, Sohna Road, Gurugram. It offers retail units, F&B spaces, and office floors in a high-footfall corridor surrounded by large residential townships. LSR Realty is an authorised advisor for Elan Town Centre leasing.' } },
      { '@type': 'Question', name: 'How do I lease space in Elan Town Centre Sector 67 Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'To lease retail or commercial space in Elan Town Centre, Sector 67, Sohna Road, Gurgaon, contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com. We are an authorised leasing advisor for Elan projects and can provide unit availability, current asking rents, and fit-out conditions.' } },
      { '@type': 'Question', name: 'Where is Elan Town Centre located in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Town Centre is located in Sector 67, Sohna Road, Gurugram. The location offers strong catchment from neighbouring residential sectors, SEZs, IT parks, and prominent schools. It has easy access to NH 48 via Rajiv Chowk and Golf Course Extension Road.' } },
    ],
  },
  'elan-miracle': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Elan Miracle in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Miracle is a mixed-use commercial project by Elan Group in Sector 84, Dwarka Expressway, Gurugram. It offers retail shops, food and beverage outlets, and office spaces targeting the growing residential catchment along the Dwarka Expressway corridor. LSR Realty is an authorised leasing advisor.' } },
      { '@type': 'Question', name: 'Is Elan Miracle on Dwarka Expressway a good investment?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Miracle in Sector 84, Dwarka Expressway benefits from the rapid growth of the Dwarka Expressway corridor since the expressway\'s inauguration and the large residential population in nearby sectors. Retail and commercial spaces in high-footfall locations along this corridor have shown strong rental appreciation. Contact LSR Realty at +91 8448660019 for an investment analysis specific to your budget and objectives.' } },
      { '@type': 'Question', name: 'How can I book or lease space in Elan Miracle Sector 84?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for leasing and investment enquiries for Elan Miracle, Sector 84, Dwarka Expressway. LSR Realty is an authorised channel partner for Elan Group and can guide you on available units, pricing, and payment terms.' } },
    ],
  },
  'elan-mercado': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Elan Mercado in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Mercado is a flagship retail and food court destination by Elan Group in Sector 80, NH 8, Gurugram — a landmark commercial project in New Gurgaon. It serves the large residential catchment across New Gurugram sectors and benefits from direct NH 8 visibility and proximity to IMT Manesar.' } },
      { '@type': 'Question', name: 'What types of shops and spaces are available in Elan Mercado?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Mercado offers retail shops, food and beverage units, entertainment zones, and high-street commercial spaces in Sector 80, NH 8. Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com to enquire about current availability, unit sizes, lease rents, and investment options.' } },
      { '@type': 'Question', name: 'Where is Elan Mercado located?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Mercado is located in Sector 80, right on NH 8 (Delhi-Jaipur Highway), Gurugram. It is 5 minutes from IMT Manesar, connected to Dwarka Expressway and Golf Course Extension Road, and surrounded by large residential townships in New Gurugram.' } },
    ],
  },
  'elan-epic': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Elan Epic in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Epic is a mixed-use commercial project by Elan Group in Sector 70, Southern Peripheral Road (SPR), Gurugram. It includes retail units, office spaces, and food and beverage zones in a growing corridor between Golf Course Extension Road and Sohna Road.' } },
      { '@type': 'Question', name: 'How to lease space in Elan Epic Sector 70 Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty is an authorised leasing and investment advisor for Elan Epic, Sector 70, Southern Peripheral Road. Contact us at +91 8448660019 or marketing@lsrrealty.com for available unit details, current asking rents, investment pricing, and lease terms.' } },
    ],
  },
  'aipl-joy-district': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Joy District in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Joy District is a commercial and retail development by AIPL (Advance India Projects Limited) in Sector 88, Gurugram. It is part of the AIPL Joy series of retail and commercial properties on Dwarka Expressway and the adjoining corridors, targeting the large residential population in New Gurugram sectors.' } },
      { '@type': 'Question', name: 'Is AIPL Joy District on Dwarka Expressway a good retail investment?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Joy District in Sector 88 benefits from proximity to Dwarka Expressway, KMP Expressway connectivity, and the dense residential catchment of New Gurugram. As a ready project in an established AIPL township, it offers immediate rental income potential. Contact LSR Realty at +91 8448660019 for a current investment analysis and available units.' } },
      { '@type': 'Question', name: 'How do I lease or invest in AIPL Joy District Sector 88?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for leasing and investment enquiries for AIPL Joy District, Sector 88, Gurugram. As an authorised AIPL channel partner, LSR Realty can provide unit details, pricing, lease terms, and investment outlook for this project.' } },
    ],
  },
  'aipl-joy-square': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Joy Square in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Joy Square is a high-street retail and commercial development by AIPL in Sector 63A, Golf Course Extension Road, Gurugram. It caters to the premium residential communities surrounding GCER and offers retail shops, F&B units, and commercial office floors in a well-connected micro-market.' } },
      { '@type': 'Question', name: 'What types of spaces are available in AIPL Joy Square Sector 63A?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Joy Square offers retail shops at ground and upper level, food and beverage units, and commercial spaces targeting Golf Course Extension Road\'s premium residential catchment. Contact LSR Realty at +91 8448660019 for current unit availability, lease rents, and investment pricing.' } },
      { '@type': 'Question', name: 'Where is AIPL Joy Square located?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Joy Square is located in Sector 63A, off Golf Course Extension Road, Gurugram. It is close to DLF The Arbour, M3M Golf Estate, and over 18 educational institutions. The Sector 55-56 Rapid Metro station is approximately 4.8 km away.' } },
    ],
  },
  'aipl-joy-central': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Joy Central in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Joy Central is a prominent retail mall and commercial hub by AIPL in Sector 65, Golf Course Extension Road, Gurugram. Located 0.3 km from the main GCER artery, it offers retail units, food and beverage zones, entertainment, and office spaces in one of GCER\'s highest-footfall locations.' } },
      { '@type': 'Question', name: 'How do I lease a retail shop in AIPL Joy Central Sector 65?', acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty is an authorised leasing advisor for AIPL Joy Central, Sector 65, Golf Course Extension Road. Call +91 8448660019 or email marketing@lsrrealty.com for available units, current asking rents, fit-out conditions, and current tenant mix details.' } },
      { '@type': 'Question', name: 'Is AIPL Joy Central a good investment in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Joy Central in Sector 65 commands one of the most active retail catchments on Golf Course Extension Road, with 18+ hospitals and schools nearby and a large premium residential population. As a stabilised mall with existing footfall, it offers investors the opportunity for rental income. For a current investment analysis and available units, contact LSR Realty at +91 8448660019.' } },
    ],
  },
  'aipl-joy-gallery': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Joy Gallery in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Joy Gallery is a high-street retail development by AIPL in Sector 66, Golf Course Extension Road, Gurugram. Located near AIPL Joy Central and M3M Golf Estates, it targets the dense premium residential community on GCER and offers retail units designed for lifestyle, fashion, and F&B brands.' } },
      { '@type': 'Question', name: 'How can I lease space in AIPL Joy Gallery Sector 66?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for leasing and investment in AIPL Joy Gallery, Sector 66, Golf Course Extension Road. LSR Realty is an authorised AIPL advisor and can provide unit sizes, current asking rents, lease terms, and occupancy information.' } },
    ],
  },
  'gardencity-arcade': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is DLF Gardencity Arcade in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Gardencity Arcade is a neighbourhood retail and commercial development by DLF in Sector 92, Gurugram, within the large DLF Gardencity township. It serves the residential population of DLF Gardencity and surrounding New Gurugram sectors and offers retail units, food and beverage spaces, and commercial offices.' } },
      { '@type': 'Question', name: 'Is DLF Gardencity Arcade a good investment?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Gardencity Arcade in Sector 92 benefits from a captive residential catchment within the DLF Gardencity township, with IMT Manesar and DLF Corporate Greens nearby. As the area develops with proposed metro connectivity, commercial assets here may see increasing footfall. Contact LSR Realty at +91 8448660019 for current investment pricing and rental yield analysis.' } },
      { '@type': 'Question', name: 'How do I reach DLF Gardencity Arcade from Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Gardencity Arcade is in Sector 92, Gurugram, approximately 8 km from NH 48 and 7 km from Dwarka Expressway (NPR). It is within the DLF Gardencity township, accessible from Pataudi Road and the Sector 92 internal road network.' } },
    ],
  },
  'landmark-one': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Landmark One in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Landmark One is a premium commercial and retail development in Sector 67, Golf Course Extension Road, Gurugram. It offers office and retail spaces starting at ₹3 crore, positioned to serve the dense premium residential and corporate population on GCER. LSR Realty is an authorised advisor for Landmark One.' } },
      { '@type': 'Question', name: 'What is the price of Landmark One Sector 67 Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Landmark One in Sector 67, Golf Course Extension Road, Gurugram is priced starting at ₹3 crore onwards. Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for current unit pricing, floor availability, and investment analysis.' } },
      { '@type': 'Question', name: 'Is Landmark One Sector 67 a good commercial investment in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Landmark One in Sector 67 sits on Golf Course Extension Road, one of Gurgaon\'s highest-appreciation commercial corridors. With Sector 55-56 Rapid Metro nearby and strong connectivity to NH 48 and Sohna Road, it is well-positioned for commercial investment. Call LSR Realty at +91 8448660019 for a detailed investment analysis.' } },
    ],
  },
  'emaar-ibc': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Emaar India Business Centre in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Emaar India Business Centre (IBC) is a Grade A commercial office development by Emaar India in Sector 65, Golf Course Extension Road, Gurugram. Developed by one of the world\'s largest real estate developers, it offers premium office floors in a prime GCER corporate corridor with proximity to Rapid Metro and major residential communities.' } },
      { '@type': 'Question', name: 'How do I lease office space at Emaar India Business Centre Sector 65?', acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty is an authorised leasing advisor for Emaar India Business Centre, Sector 65, Golf Course Extension Road. Contact us at +91 8448660019 or marketing@lsrrealty.com for available floors, current lease rents per sqft, lock-in period terms, and fit-out allowance details.' } },
      { '@type': 'Question', name: 'Is Emaar India Business Centre a good office investment in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Emaar India Business Centre on Golf Course Extension Road, Sector 65, offers Grade A office floors from an internationally recognised developer with a strong track record in India. GCER\'s prime corridor connectivity, Rapid Metro proximity, and premium tenant profile make this a solid commercial investment option. Contact LSR Realty at +91 8448660019 for current investment pricing and rental yield data.' } },
    ],
  },
  'dlf-cybercity': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is DLF Cybercity in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Cybercity is one of India\'s most iconic integrated business districts, developed by DLF in DLF Phase 2, Gurugram. It houses the headquarters and India offices of global technology, consulting, and financial services companies. DLF CyberHub — one of Delhi NCR\'s top dining and entertainment destinations — is located within the Cybercity campus.' } },
      { '@type': 'Question', name: 'How do I lease office space in DLF Cybercity Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Office space in DLF Cybercity is leased through authorised advisors. Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com to enquire about available floors, current lease rents, unit sizes, and lease terms within the DLF Cybercity campus.' } },
      { '@type': 'Question', name: 'What companies are in DLF Cybercity Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Cybercity, Gurugram houses the offices of numerous Fortune 500 and global companies including American Express, Hewitt, Sapient, and many financial services, technology, and consulting firms. The Cybercity campus is walking distance from Cybercity Metro Station (Yellow Line) and directly adjacent to DLF CyberHub.' } },
    ],
  },
  'godrej-gcr': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Godrej GCR in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Godrej GCR is a Grade A commercial office development by Godrej Properties on Golf Course Road, Gurugram. Located in the heart of Gurgaon\'s established business district, it offers premium office floors with excellent metro and road connectivity, proximity to luxury hospitality, and a premium tenant profile.' } },
      { '@type': 'Question', name: 'How do I lease office space in Godrej GCR Golf Course Road?', acceptedAnswer: { '@type': 'Answer', text: 'LSR Realty is an authorised advisor for Godrej GCR, Golf Course Road, Gurgaon. Contact us at +91 8448660019 or email marketing@lsrrealty.com for available floor details, current lease rents per sqft, lock-in period terms, and handover conditions.' } },
      { '@type': 'Question', name: 'Is Godrej GCR a good commercial investment on Golf Course Road?', acceptedAnswer: { '@type': 'Answer', text: 'Godrej GCR on Golf Course Road offers Grade A office space from India\'s most trusted developer brand in Gurgaon\'s premier corporate corridor. Golf Course Road\'s mature commercial ecosystem, strong metro connectivity, and premium tenant base make it one of Gurgaon\'s most liquid commercial investment markets. Contact LSR Realty at +91 8448660019 for investment analysis and current pricing.' } },
    ],
  },
  'vatika-first-india-place': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Vatika First India Place in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Vatika First India Place is a premium Grade A office complex by Vatika Group on MG Road (Mehrauli-Gurgaon Road), Gurugram. Located in central Gurgaon, it is one of the most prestigious office addresses on MG Road with excellent metro connectivity and proximity to Delhi.' } },
      { '@type': 'Question', name: 'How do I lease office space at Vatika First India Place MG Road?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com for office leasing in Vatika First India Place, MG Road, Gurugram. LSR Realty can provide available floor details, current rents, lease terms, and handover conditions.' } },
      { '@type': 'Question', name: 'Is MG Road Gurgaon good for office investment?', acceptedAnswer: { '@type': 'Answer', text: 'MG Road is one of Gurgaon\'s most established commercial corridors, offering strong metro connectivity (Sikanderpur and MG Road stations on the Yellow Line) and proximity to both Cyber City and the Delhi border. Grade A offices here command stable rental yields from established multinational tenants. Contact LSR Realty for a current investment and lease analysis.' } },
    ],
  },
  'vatika-business-park': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Vatika Business Park in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Vatika Business Park is a Grade A commercial office development by Vatika Group on Sohna Road, Gurugram. It offers premium office floors with good connectivity to NH 48, Golf Course Extension Road, and Sohna Road\'s growing corporate and residential ecosystem.' } },
      { '@type': 'Question', name: 'How do I lease office space at Vatika Business Park Sohna Road?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com to enquire about office leasing in Vatika Business Park, Sohna Road, Gurugram. We can provide current floor availability, lease rent per sqft, and lease term details.' } },
    ],
  },
  'vatika-professional-point': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Vatika Professional Point in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Vatika Professional Point is a premium office complex by Vatika Group at the Golf Course Extension Road and Sohna Road junction, Gurugram. The dual road frontage and proposed metro station walking distance make it one of the best-connected commercial addresses in GCER.' } },
      { '@type': 'Question', name: 'How do I lease or invest in Vatika Professional Point Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com for leasing and investment in Vatika Professional Point at Golf Course Extension Road and Sohna Road junction. LSR Realty is an authorised Vatika advisor and can provide available floors, lease rents, and investment pricing.' } },
      { '@type': 'Question', name: 'Is Vatika Professional Point a good investment at the GCER Sohna Road junction?', acceptedAnswer: { '@type': 'Answer', text: 'Vatika Professional Point sits at the intersection of Golf Course Extension Road and Sohna Road, two of Gurgaon\'s highest-traffic corridors, with a proposed metro station walking distance. This dual connectivity — combined with Vatika\'s established tenancy track record — makes it an attractive commercial investment. Contact LSR Realty for current pricing and rental yield data.' } },
    ],
  },
  'magnum-one-lease': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Magnum One in Faridabad?', acceptedAnswer: { '@type': 'Answer', text: 'Magnum One is a Grade A commercial office complex in Sector 37, Mathura Road, Faridabad, walking distance from Badarpur Metro Station (Delhi Metro Violet Line). It offers premium office floors in one of Faridabad\'s most accessible corporate locations, with excellent connectivity to south Delhi and the NCR.' } },
      { '@type': 'Question', name: 'How do I lease office space in Magnum One Faridabad?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com to enquire about office leasing in Magnum One, Sector 37, Mathura Road, Faridabad. LSR Realty can provide available floor sizes, current lease rents, and lease term details.' } },
    ],
  },
  'magnum-one-invest': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is Magnum One Faridabad a good commercial investment?', acceptedAnswer: { '@type': 'Answer', text: 'Magnum One in Sector 37, Mathura Road, Faridabad is walking distance from Badarpur Metro Station, 300 metres from Mohan Cooperative Industrial Estate, and offers access to the south Delhi corporate belt. Commercial office assets with metro proximity in this corridor have shown stable rental yields. Contact LSR Realty at +91 8448660019 for current investment pricing and rental yield analysis.' } },
      { '@type': 'Question', name: 'What is the investment price for office space in Magnum One Faridabad?', acceptedAnswer: { '@type': 'Answer', text: 'Investment pricing for office space in Magnum One, Sector 37, Faridabad is available on request. Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for current per-sqft investment pricing, available floor plans, and rental yield projections.' } },
    ],
  },
  'magnum-global-park-lease': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Magnum Global Park in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Magnum Global Park is a premium Grade A office complex in Sector 58, Golf Course Extension Road, Gurugram. It is the home of LSR Realty\'s own office (Unit 911, 9th Floor) and one of the most active office leasing markets on GCER. The building offers flexible floor plates, Rapid Metro access within 1 km, and proximity to the GCER corporate corridor.' } },
      { '@type': 'Question', name: 'How do I lease office space in Magnum Global Park Sector 58?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com to enquire about office leasing in Magnum Global Park, Sector 58, Golf Course Extension Road, Gurugram. We are based in this building and have direct knowledge of current availability, lease rents, and floor conditions.' } },
      { '@type': 'Question', name: 'What is the location of Magnum Global Park on Golf Course Extension Road?', acceptedAnswer: { '@type': 'Answer', text: 'Magnum Global Park is in Sector 58, Golf Course Extension Road, Gurugram, approximately 1 km from the Sector 55-56 Rapid Metro station. It has direct NH 48 and Cyber City access and is surrounded by a dense cluster of multinational companies, hospitality, and educational institutions.' } },
    ],
  },
  'magnum-global-park-invest': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is Magnum Global Park a good commercial investment in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Magnum Global Park in Sector 58, Golf Course Extension Road, is a stabilised Grade A office building with strong demand from MNCs and corporate occupiers. Its Rapid Metro proximity, GCER corridor positioning, and established tenant profile make it a liquid commercial investment. Contact LSR Realty at +91 8448660019 — we are based in this building — for current investment pricing and rental yield data.' } },
      { '@type': 'Question', name: 'What is the investment price per sqft for Magnum Global Park?', acceptedAnswer: { '@type': 'Answer', text: 'Investment pricing for Magnum Global Park, Sector 58, Golf Course Extension Road, Gurugram is available on request. Call LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for current per-sqft investment price, available floor plans, rental yield, and lock-in period details.' } },
    ],
  },
  'dlf-corporate-greens-lease': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is DLF Corporate Greens in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Corporate Greens is a premium Grade A IT/ITES park by DLF in Sector 74A, Southern Peripheral Road, Gurugram. Spread across a large campus with green landscaping and world-class amenities, it houses global MNC tenants and is one of the flagship office destinations on SPR with easy access to NH 48 and Dwarka Expressway.' } },
      { '@type': 'Question', name: 'How do I lease office space at DLF Corporate Greens SPR Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com to enquire about office leasing in DLF Corporate Greens, Sector 74A, Southern Peripheral Road. LSR Realty is an authorised DLF channel partner and can provide available floor sizes, lease rents, handover conditions, and lease terms.' } },
      { '@type': 'Question', name: 'Is DLF Corporate Greens on Southern Peripheral Road a premium office location?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, DLF Corporate Greens in Sector 74A is a flagship DLF campus with LEED-certified buildings, large floor plates suitable for MNC headquarters, and easy access to both NH 48 and the upcoming SPR-Dwarka Expressway metro. Global technology and consulting companies have leased significant space here. Contact LSR Realty at +91 8448660019 for current leasing details.' } },
    ],
  },
  'dlf-corporate-greens-invest': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is DLF Corporate Greens Sector 74A a good investment?', acceptedAnswer: { '@type': 'Answer', text: 'DLF Corporate Greens on Southern Peripheral Road is a campus-format Grade A office complex with MNC tenants, LEED certification, and upcoming metro connectivity. DLF\'s track record as India\'s largest real estate developer adds investment-grade quality to the asset. Contact LSR Realty at +91 8448660019 for current investment pricing, available floor details, and rental yield projections.' } },
      { '@type': 'Question', name: 'What is the investment price for DLF Corporate Greens Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Investment pricing for office floors in DLF Corporate Greens, Sector 74A, Southern Peripheral Road, Gurugram is available on request. Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for current per-sqft pricing, available floor plans, and anticipated rental yield.' } },
    ],
  },
  'aipl-business-club-lease': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Business Club in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Business Club is a premium Grade A office complex by AIPL in Sector 62, Golf Course Extension Road, Gurugram. Adjacent to Artemis Hospital and positioned on GCER, it offers office floors with flexible configurations ranging from single floors to multi-floor blocks, targeting corporate occupiers and investors.' } },
      { '@type': 'Question', name: 'How do I lease office space in AIPL Business Club Sector 62?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com for leasing enquiries at AIPL Business Club, Sector 62, Golf Course Extension Road. LSR Realty is an authorised AIPL advisor and can provide current availability, lease rents per sqft, and lock-in period terms.' } },
    ],
  },
  'aipl-business-club-invest': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is AIPL Business Club Sector 62 a good commercial investment?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Business Club in Sector 62, Golf Course Extension Road is positioned near Artemis Hospital and 20 metres from Imperia Mindspace, in a densely developed GCER micro-market. As a ready-to-occupy office building with active leasing demand, it offers immediate rental income potential. Contact LSR Realty at +91 8448660019 for investment pricing and rental yield analysis.' } },
      { '@type': 'Question', name: 'What is the price to buy office space in AIPL Business Club Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Investment pricing for AIPL Business Club, Sector 62, Golf Course Extension Road, Gurugram is available on request. Call LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for current per-sqft pricing and available floor plans.' } },
    ],
  },
  'aipl-statement-lease': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Statement in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Statement is a premium Grade A office complex by AIPL in Sector 66, Golf Course Extension Road, Gurugram. The building offers large floor plates of 24,000 to 30,000 sqft per floor, suitable for corporate headquarters and large teams. It is ready to occupy and available through LSR Realty.' } },
      { '@type': 'Question', name: 'How do I lease office space in AIPL Statement Sector 66?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com to enquire about office leasing in AIPL Statement, Sector 66, Golf Course Extension Road. We are an authorised AIPL advisor and can provide available floors, current lease rents, lock-in period details, and fit-out allowance.' } },
    ],
  },
  'aipl-statement-invest': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is AIPL Statement Sector 66 a good commercial investment?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Statement in Sector 66, Golf Course Extension Road, offers large 24,000 to 30,000 sqft floor plates in a ready building near AIPL Joy Central and Grand Hyatt. Ready-to-occupy offices in GCER with established amenities and corporate neighbours typically command strong rental yields. Contact LSR Realty at +91 8448660019 for investment pricing and available floor details.' } },
      { '@type': 'Question', name: 'What is the investment price for AIPL Statement Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Investment pricing for AIPL Statement, Sector 66, Golf Course Extension Road is available on request. Call LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for current per-sqft pricing, available floor plans, anticipated yield, and lock-in period details.' } },
    ],
  },
  'aipl-autograph-lease': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Autograph in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Autograph is a flagship Grade A office complex by AIPL in Sector 66, Golf Course Extension Road, Gurugram. It offers large floor plates of 25,000 to 50,000 sqft per floor — among the largest available on GCER — suitable for large corporate headquarters. It is ready to occupy and available for leasing.' } },
      { '@type': 'Question', name: 'How do I lease office space in AIPL Autograph Sector 66?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com to enquire about office leasing in AIPL Autograph, Sector 66, Golf Course Extension Road. LSR Realty is an authorised AIPL advisor and can provide available floors, current lease rents, and handover terms.' } },
    ],
  },
  'aipl-autograph-invest': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is AIPL Autograph Sector 66 a good office investment in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Autograph in Sector 66 offers some of the largest floor plates on Golf Course Extension Road (25,000 to 50,000 sqft), appealing to corporate HQ occupiers. Located near AIPL Joy Central, Sector 55-56 Metro at 5.6 km, and CK Birla Hospital, it is in a well-developed micro-market. Contact LSR Realty at +91 8448660019 for investment pricing and rental yield analysis.' } },
      { '@type': 'Question', name: 'What is the price to buy office in AIPL Autograph Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Investment pricing for AIPL Autograph, Sector 66, GCER is available on request. Call LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for current per-sqft investment price and available floor details.' } },
    ],
  },
  'aipl-signature-lease': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Signature in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Signature is a premium Grade A office building by AIPL in Sector 65, Golf Course Extension Road, Gurugram. Adjacent to AIPL Joy Gallery (350 metres) and close to 18+ hospitals including CK Birla, Artemis, and Medanta, it targets corporate occupiers seeking a central GCER address.' } },
      { '@type': 'Question', name: 'How do I lease office space in AIPL Signature Sector 65?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com to enquire about office leasing in AIPL Signature, Sector 65, Golf Course Extension Road. We are an authorised AIPL advisor and can provide available floors, current lease rents per sqft, and lease terms.' } },
    ],
  },
  'aipl-signature-invest': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is AIPL Signature Sector 65 a good commercial investment?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Signature in Sector 65, Golf Course Extension Road, is close to AIPL Joy Gallery, DPS, St Xavier\'s, and 18+ hospitals, in one of the most active corporate micro-markets on GCER. Ready-to-occupy offices here offer investors immediate rental income. Contact LSR Realty at +91 8448660019 for current investment pricing and rental yield projections.' } },
      { '@type': 'Question', name: 'What is the investment price for office in AIPL Signature Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Investment pricing for AIPL Signature, Sector 65, Golf Course Extension Road, is available on request. Call LSR Realty at +91 8448660019 or email marketing@lsrrealty.com for current pricing, available floor plans, and rental yield data.' } },
    ],
  },
  'vatika-inxt-city-centre': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Vatika INXT City Centre in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Vatika INXT City Centre is a premium Grade A office complex by Vatika Group in Sector 83, at the NH 48 and Dwarka Expressway intersection, Gurugram. It is part of the 550-acre Vatika India Next township, adjacent to Hyatt Regency Hotel, and near a proposed ISBT and Metro Hub. A 25-minute signal-free drive to IGI Airport makes it ideal for aviation-adjacent corporate occupiers.' } },
      { '@type': 'Question', name: 'How do I lease office space in Vatika INXT City Centre Sector 83?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com to enquire about office leasing in Vatika INXT City Centre, Sector 83, NH 48, Gurugram. Floor sizes range from 16,000 to 26,000 sqft per floor. LSR Realty can provide available floors, current rents, and lease terms.' } },
      { '@type': 'Question', name: 'Is Vatika INXT City Centre on NH 48 good for office investment?', acceptedAnswer: { '@type': 'Answer', text: 'Vatika INXT City Centre at Sector 83, NH 48, is part of a 550-acre integrated township with hospitality (Hyatt Regency), retail, and residential components. The NH 48 and Dwarka Expressway intersection position, airport proximity, and proposed Metro Hub make it a strong long-term commercial investment. Contact LSR Realty at +91 8448660019 for current pricing.' } },
    ],
  },
  'vatika-one-on-one': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Vatika One On One in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Vatika One On One is a premium standalone Grade A office building by Vatika Group in Sector 16, right on NH 48, Gurugram. Adjacent to The Westin Hotel and 16 km from IGI Airport, it occupies a flagship NH 48 corporate corridor position and is one of Gurgaon\'s most visible commercial addresses on the Delhi-Jaipur Highway.' } },
      { '@type': 'Question', name: 'How do I lease office space in Vatika One On One Sector 16?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com to enquire about office leasing in Vatika One On One, Sector 16, NH 48, Gurugram. LSR Realty is an authorised Vatika advisor and can provide available floors, current lease rents, and lease terms.' } },
      { '@type': 'Question', name: 'What are the main connectivity advantages of Vatika One On One on NH 48?', acceptedAnswer: { '@type': 'Answer', text: 'Vatika One On One on NH 48, Sector 16, Gurugram, is 16 km from IGI Airport on a signal-free drive, adjacent to The Westin Hotel, and directly on the Delhi-Jaipur Highway with excellent visibility. The location suits companies needing frequent air connectivity, international client visits, or NH 48 brand presence.' } },
    ],
  },
  'elan-empire': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is Elan Empire in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Empire is a large-format mixed-use development by Elan Group in Sector 66, Golf Course Extension Road, Gurugram. It combines retail, office, and F&B / restaurant spaces in a ready-to-occupy structure positioned 2 minutes from Sohna Road and 5 minutes from NH 8, in a densely populated premium GCER micro-market.' } },
      { '@type': 'Question', name: 'How do I lease space in Elan Empire Sector 66 Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or marketing@lsrrealty.com for leasing and investment enquiries for Elan Empire, Sector 66, Golf Course Extension Road. LSR Realty is an authorised Elan channel partner and can provide available unit sizes, lease rents, and investment pricing for retail, office, and F&B spaces.' } },
      { '@type': 'Question', name: 'Is Elan Empire Sector 66 a good commercial investment in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'Elan Empire in Sector 66 offers a mixed-use format — retail, office, F&B — in a prime GCER location with a dense premium residential catchment and proximity to major arterial roads. Ready-to-occupy mixed-use assets in GCER\'s core micro-markets have shown stable leasing demand. Contact LSR Realty at +91 8448660019 for current investment pricing and rental yield analysis.' } },
    ],
  },
  'aipl-masterpiece': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is AIPL Masterpiece in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Masterpiece is a premium Grade A commercial office development by AIPL on Golf Course Road, Gurugram. Located in Gurgaon\'s established commercial district, it offers office spaces of 6,000 to 40,000 sqft and is ready to occupy, targeting corporate tenants seeking Golf Course Road prestige with excellent metro and road connectivity.' } },
      { '@type': 'Question', name: 'How do I lease office space in AIPL Masterpiece Golf Course Road?', acceptedAnswer: { '@type': 'Answer', text: 'Contact LSR Realty at +91 8448660019 or email marketing@lsrrealty.com to enquire about office leasing in AIPL Masterpiece, Golf Course Road, Gurugram. LSR Realty is an authorised AIPL advisor and can provide available floor details, current lease rents per sqft, lock-in period terms, and handover conditions.' } },
      { '@type': 'Question', name: 'Is AIPL Masterpiece on Golf Course Road a good investment in Gurgaon?', acceptedAnswer: { '@type': 'Answer', text: 'AIPL Masterpiece on Golf Course Road, Gurugram benefits from one of Gurgaon\'s most prestigious office addresses with strong metro connectivity, proximity to luxury hospitality, and a blue-chip tenant ecosystem. Golf Course Road Grade A offices have historically commanded strong rental yields and capital appreciation. Contact LSR Realty at +91 8448660019 for current investment pricing.' } },
    ],
  },
};

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
    datePosted: '2026-07-01',
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
      project.category === 'Leasing'
        ? `office space for lease Gurgaon, shop for lease Gurgaon, retail space Gurgaon, commercial property for lease Gurgaon, ${project.name} lease, ${project.name} rent`
        : `flat for sale Gurgaon, apartment for sale Gurgaon, property for sale Gurgaon, buy property Gurgaon, ${project.name} for sale`,
      'Gurgaon real estate investment',
      `real estate ${project.category === 'Leasing' ? 'leasing' : 'investment'} Gurgaon`,
      'LSR Realty channel partner',
      'real estate broker Gurgaon',
      `${project.developer} Gurgaon`,
      `${project.developer} channel partner`,
      project.category === 'Leasing'
        ? 'commercial property Gurgaon, Grade A office Gurgaon, retail leasing Gurgaon'
        : `luxury property Gurgaon, buy property Gurgaon 2026, property investment ROI Gurgaon, property price appreciation Gurgaon`,
    ].filter(Boolean).join(', '),
    image: projectImage,
    breadcrumbs: [
      HOME,
      { name: 'Projects', url: `${SITE_URL}/projects` },
      { name: project.name, url: projectUrl },
    ],
    structuredData: PROJECT_FAQ_SCHEMAS[project.id] ? [realEstateSchema, PROJECT_FAQ_SCHEMAS[project.id]] : [realEstateSchema],
    preloadImage: project.image?.startsWith('/') ? project.image : undefined,
  });
}

// ── Map detail pages ──────────────────────────────────────────────────────────

// Generic FAQPage for every sector map — creates People Also Ask opportunities
function makeSectorFAQ(sector) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I download the ${sector.name} layout map for free?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${sector.name} Gurgaon layout plan is available for free download at lsrrealty.com/maps/${sector.id}. The high-resolution map shows official DTCP Haryana approved plot boundaries, road widths, land use zones and park locations. No registration required — open the page, click to view full resolution and save it to your device.`,
        },
      },
      {
        '@type': 'Question',
        name: `What does the ${sector.name} Gurgaon layout plan show?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${sector.name} layout plan shows plot numbers and areas, internal road widths, land use designations (residential, commercial, institutional, park and utility sites), and sector boundary connections to neighbouring sectors. It is sourced from the DTCP Haryana approved plan and forms part of the Gurgaon Manesar Master Plan 2031. Use it to verify plot boundaries and land use before purchasing property in ${sector.name}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${sector.name} Gurgaon a good area for property investment?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Investment potential in ${sector.name} Gurgaon depends on its corridor, connectivity, planned infrastructure under the Gurgaon Master Plan 2031, and current market pricing. LSR Realty provides free micro-market analysis for investors evaluating ${sector.name}. Contact +91 8448660019 or visit lsrrealty.com/contact for a free consultation.`,
        },
      },
    ],
  };
}

// Per-sector FAQ overrides for the most-searched sectors
const SECTOR_MAP_FAQS = {
  'gurgaon-manesar-master-plan': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I download the Gurgaon Master Plan 2031 PDF for free?',
        acceptedAnswer: { '@type': 'Answer', text: 'The official Gurgaon Master Plan 2031 (Gurugram Manesar Urban Complex) is available as a free high-resolution download at lsrrealty.com/maps/gurgaon-manesar-master-plan. The map is sourced from the DTCP Haryana approved plan and shows all land use zones, sector boundaries, transport corridors and metro alignments across the entire urban complex. No registration or payment required.' },
      },
      {
        '@type': 'Question',
        name: 'What sectors does the Gurgaon Master Plan 2031 cover?',
        acceptedAnswer: { '@type': 'Answer', text: 'The Gurgaon Manesar Master Plan 2031 covers the entire Gurugram-Manesar Urban Complex — all residential sectors from 1 to 115, the Manesar IMT industrial zone, DLF Cyber City, Udyog Vihar, all corridors (Golf Course Road, Golf Course Extension Road, Dwarka Expressway, Sohna Road, Southern Peripheral Road), and the proposed metro routes. The plan designates land use zones (R1–R4 residential, commercial, industrial, green belt) across 33,872 hectares.' },
      },
      {
        '@type': 'Question',
        name: 'Is the Gurgaon Master Plan 2031 or 2041 in force?',
        acceptedAnswer: { '@type': 'Answer', text: 'As of October 2026, the Gurgaon Manesar Master Plan 2031 is the operative legal document for all land use, RERA registrations and development approvals in Gurugram. The Gurgaon Master Plan 2041 is being prepared by GMDA (Gurugram Metropolitan Development Authority) but has not yet been formally notified. Until it is notified, the 2031 plan governs all property transactions.' },
      },
      {
        '@type': 'Question',
        name: 'How do I read land use zones on the Gurgaon Master Plan 2031?',
        acceptedAnswer: { '@type': 'Answer', text: 'On the Gurgaon Master Plan 2031 map, zones are colour-coded: yellow/beige indicates residential zones (R1–R4), red indicates commercial and business zones, purple or hatched areas indicate industrial zones (including Manesar IMT), green indicates recreational and green belt areas, and blue indicates public/semi-public or utility land. Road widths are shown by line thickness — a wider line means a more important road corridor. Verify the zone designation of any plot before purchasing.' },
      },
    ],
  },
};

for (const sector of SECTOR_MAPS) {
  const isMasterPlan = sector.id === 'gurgaon-manesar-master-plan';
  // "Free download" in suffix targets download-intent searches
  const descSuffix = ` DTCP-approved layout — free high-resolution download. Part of Gurgaon Master Plan 2031.`;
  const mapTitle = isMasterPlan
    ? 'Gurgaon Master Plan 2031 Map | Free PDF Download | All Sectors | LSR Realty'
    : `${sector.name} Map Gurgaon | Free Layout Plan Download | LSR Realty`;
  const mapDesc = isMasterPlan
    ? 'Gurgaon Master Plan 2031 (Gurugram Manesar Urban Complex) — official DTCP Haryana zone map, free PDF download. All sectors, land use zones, transport corridors and metro routes.'
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
    dateModified: '2026-10-21',
    potentialAction: {
      '@type': 'DownloadAction',
      name: isMasterPlan ? 'Download Gurgaon Master Plan 2031 Map' : `Download ${sector.name} Layout Map`,
      target: `${SITE_URL}${sector.zoom}`,
      object: { '@type': 'ImageObject', url: `${SITE_URL}${sector.zoom}`, name: isMasterPlan ? 'Gurgaon Manesar Master Plan 2031 High-Resolution Map' : `${sector.name} Official Layout Plan, Gurgaon` },
    },
  };

  const sectorFAQ = SECTOR_MAP_FAQS[sector.id] || makeSectorFAQ(sector);

  renderRoute({
    route: `/maps/${sector.id}`,
    title: mapTitle,
    description: mapDesc,
    keywords: isMasterPlan
      ? 'Gurgaon Master Plan 2031, Gurgaon Master Plan 2031 PDF, Gurgaon Master Plan 2031 free download, Gurgaon Master Plan 2031 map download, Gurgaon Master Plan 2031 PDF download, Gurgaon Master Plan 2031 zone map, Gurgaon Master Plan 2031 land use, Gurugram Manesar Urban Complex map, DTCP Haryana Master Plan, Gurgaon Master Plan 2031 all sectors, Gurgaon sector map download, Gurugram Master Plan 2031, Gurgaon master plan 2031 2026, DTCP Haryana master plan download, Gurgaon land use map 2031, Gurugram development plan 2031, Gurgaon zone map free download'
      : `${sector.name} map, ${sector.name} map download, ${sector.name} Gurgaon, ${sector.name} layout plan, ${sector.name} free download, ${sector.name} PDF download, ${sector.name} official layout, ${sector.name} DTCP approved, Gurgaon sector map, Gurugram sector map, DTCP Haryana layout, free Gurgaon sector map download, sector map PDF Gurgaon, Gurgaon layout plan free download`,
    image: `${SITE_URL}${sector.zoom}`,
    breadcrumbs: [
      HOME,
      { name: 'Gurgaon Maps', url: `${SITE_URL}/maps` },
      { name: sector.name, url: `${SITE_URL}/maps/${sector.id}` },
    ],
    structuredData: [mapSchema, sectorFAQ],
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
  'nri-real-estate-buying-guide-gurgaon': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can NRIs buy property in India without visiting the country?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. NRIs can complete the entire property purchase process remotely through a properly structured Power of Attorney (PoA). The PoA is executed and apostilled in the NRI\'s country of residence, then registered in India, allowing a trusted representative to sign documents, make payments, and complete registration. LSR Realty handles NRI transactions for clients in the US, UK, UAE, Singapore, Canada, and Australia without a single India visit required.' },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between NRE and NRO accounts for NRI property investment in India?',
        acceptedAnswer: { '@type': 'Answer', text: 'An NRE (Non-Resident External) account is funded with money remitted from abroad and is fully repatriable — principal and interest can be moved back out of India without limit, and interest is tax-free in India. An NRO (Non-Resident Ordinary) account is funded with India-sourced income such as rent or dividends. NRO funds carry a USD 1 million per year repatriation cap and are subject to Indian income tax. NRIs should route fresh property investments through NRE for clean repatriation on exit.' },
      },
      {
        '@type': 'Question',
        name: 'Is RERA registration mandatory for NRI property investments in Gurugram?',
        acceptedAnswer: { '@type': 'Answer', text: 'RERA registration is the developer\'s statutory obligation. NRI buyers should refuse to proceed with any project that is not RERA registered and should be. RERA provides three key protections: 70% escrow protection on buyer funds; compensation rights for delivery delays; and a formal grievance mechanism. These protections are particularly important for NRI buyers who cannot monitor construction in person.' },
      },
      {
        '@type': 'Question',
        name: 'How much TDS does an NRI pay when selling property in India?',
        acceptedAnswer: { '@type': 'Answer', text: 'When an NRI sells property, the buyer must deduct TDS at 20% for long-term capital gains (property held more than 24 months) or 30% for short-term gains. The NRI seller also pays LTCG tax at 20% on the indexed gain. DTAA treaties with the US, UK, UAE, Singapore, and Canada may reduce effective tax. Capital gains can be deferred by reinvesting in a new residential property under Section 54 or in capital gains bonds under Section 54EC (up to ₹50 lakh) within prescribed timelines.' },
      },
      {
        '@type': 'Question',
        name: 'What documents does an NRI need to buy property in India?',
        acceptedAnswer: { '@type': 'Answer', text: 'Key documents include: valid passport and visa; PAN card (mandatory for property transactions above ₹50 lakh); NRE or NRO bank account details; OCI or PIO card if applicable; Power of Attorney (apostilled from country of residence); address proof from country of residence; and Form 60 if PAN is not yet available at booking. The Sub-Registrar also requires proof that all payments were routed through NRE or NRO banking channels.' },
      },
      {
        '@type': 'Question',
        name: 'How can NRIs repatriate money from a property sale in India?',
        acceptedAnswer: { '@type': 'Answer', text: 'NRI repatriation depends on how the purchase was funded: NRE-funded property allows full proceeds to be repatriated after paying applicable LTCG tax; NRO-funded property is capped at USD 1 million per financial year. A CA certificate in Form 15CB and Form 15CA filing are required before the bank releases the remittance. Repatriation should be planned before the sale, not after, especially if DTAA treaty benefits or Section 54 reinvestment deferral are involved.' },
      },
    ],
  },
  'dlf-arbour-vs-dlf-privana-gurgaon': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is DLF Arbour better than DLF Privana South?',
        acceptedAnswer: { '@type': 'Answer', text: 'Neither is objectively better. DLF The Arbour is the superior product in terms of privacy, density, and finish, and suits buyers prioritising end use and product quality. DLF Privana South offers stronger appreciation potential at a lower entry price and suits investors with a 3-year horizon. The right choice depends on your objective and timeline.' },
      },
      {
        '@type': 'Question',
        name: 'What is the current resale price of DLF Arbour in Gurgaon?',
        acceptedAnswer: { '@type': 'Answer', text: 'DLF The Arbour is currently trading on the resale market at ₹23,500 to ₹24,000 per sqft. A 4 BHK plus staff unit of 3,900 sqft is priced between ₹9.3 crore and ₹9.5 crore. The project is fully sold out from the developer; all purchases are through the resale market.' },
      },
      {
        '@type': 'Question',
        name: 'What is the current price of DLF Privana South?',
        acceptedAnswer: { '@type': 'Answer', text: 'DLF Privana South is currently priced at ₹21,000 per sqft. A 4 BHK of 3,577 sqft starts at ₹7.5 crore, and a penthouse of 5,472 sqft is priced at approximately ₹11.5 crore. The project is under construction with possession expected in July 2029 and is RERA-registered under HARERA/GGM/772/504/2023/116.' },
      },
      {
        '@type': 'Question',
        name: 'Can I still buy DLF Arbour from the developer?',
        acceptedAnswer: { '@type': 'Answer', text: 'No. DLF The Arbour is sold out at the developer level. All available units are through the resale market. LSR Realty can connect you with verified resale inventory across specific towers and preferred floors based on your requirements.' },
      },
      {
        '@type': 'Question',
        name: 'Which DLF project has better resale value in Gurgaon?',
        acceptedAnswer: { '@type': 'Answer', text: 'DLF The Arbour currently has a stronger established resale market given that it is a completed and delivered product with a track record. DLF Privana South\'s resale market will mature at and after possession in July 2029. For long-term resale value potential, both projects carry the DLF brand premium, but Privana South\'s appreciation from current prices has more room to grow before it is fully priced in.' },
      },
    ],
  },
};

// article:tag OG meta per blog post — improves social sharing and topic signals
const BLOG_ARTICLE_TAGS = {
  'golf-course-extension-road-vs-golf-course-road-gurgaon': ['Golf Course Extension Road', 'Golf Course Road', 'Gurgaon real estate investment', 'GCER Gurgaon', 'property investment Gurgaon', 'luxury apartments GCER'],
  'gurgaon-manesar-master-plan-2031-explained': ['Gurgaon Master Plan 2031', 'Gurugram Master Plan 2031', 'DTCP Haryana', 'property investment Gurgaon', 'Gurgaon real estate', 'land use Gurgaon'],
  'nri-real-estate-buying-guide-gurgaon': ['NRI property investment India', 'NRI buying property Gurugram', 'FEMA NRI property', 'NRE NRO account property', 'NRI real estate Gurgaon', 'NRI power of attorney India', 'NRI home loan India', 'RERA NRI buyer'],
  'dlf-arbour-vs-dlf-privana-gurgaon': ['DLF Arbour Sector 63', 'DLF Privana South', 'DLF Privana Gurgaon', 'GCER luxury apartments', 'Gurgaon real estate investment', 'luxury apartments Gurgaon 2026', 'DLF resale Gurgaon', 'Gurgaon HNI property'],
};

// SEO-optimised short titles for blog posts whose full title exceeds 65 chars
const BLOG_TITLE_OVERRIDES = {
  'golf-course-extension-road-vs-golf-course-road-gurgaon': 'GCER vs Golf Course Road: Gurgaon Investment Guide | LSR Realty',
  'gurgaon-manesar-master-plan-2031-explained': 'Gurgaon Master Plan 2031 Explained | Property Guide | LSR Realty',
  'nri-real-estate-buying-guide-gurgaon': 'NRI Property Buying Guide Gurgaon | FEMA & RERA | LSR Realty',
  'dlf-arbour-vs-dlf-privana-gurgaon': 'DLF Arbour vs DLF Privana South Gurgaon 2026 | LSR Realty',
};

// Per-blog keyword sets — specific long-tail keywords per post rather than generic cross-post keywords
const BLOG_KEYWORDS = {
  'golf-course-extension-road-vs-golf-course-road-gurgaon':
    'Golf Course Extension Road, GCER Gurgaon, Golf Course Road Gurgaon, Golf Course Extension Road property rates, DLF Arbour Sector 63, DLF Privana Gurgaon, Gurgaon luxury residential 2026, Gurgaon real estate investment, GCER vs GCR Gurgaon, property rates GCER 2026, LSR Realty',
  'gurgaon-manesar-master-plan-2031-explained':
    'Gurgaon Manesar Master Plan 2031, Gurgaon Master Plan 2031 explained, DTCP Haryana master plan, Gurgaon land use zones, Gurugram development plan 2031, Gurgaon property zones, Gurgaon master plan 2031 vs 2041, Gurgaon real estate, property investment Gurugram, LSR Realty',
  'nri-real-estate-buying-guide-gurgaon':
    'NRI property investment India, NRI buying property Gurgaon, FEMA NRI real estate, NRE NRO account property investment, NRI real estate Gurugram, NRI home loan India, RERA NRI buyer, Power of Attorney NRI India, NRI property tax India, repatriation NRI property sale, NRI buying guide Gurugram 2026, LSR Realty',
  'dlf-arbour-vs-dlf-privana-gurgaon':
    'DLF Arbour vs DLF Privana South, DLF Arbour Sector 63 resale price, DLF Privana South price 2026, DLF Arbour investment, DLF Privana Gurgaon, GCER luxury apartments, Golf Course Extension Road property, DLF resale Gurgaon, luxury 4 BHK Gurgaon, Gurgaon HNI property investment, LSR Realty',
};

// Per-blog significantLink — cross-links between posts signal topical authority clusters to Google
const BLOG_SIGNIFICANT_LINKS = {
  'golf-course-extension-road-vs-golf-course-road-gurgaon': [
    `${SITE_URL}/blog/gurgaon-manesar-master-plan-2031-explained`,
    `${SITE_URL}/projects`,
    `${SITE_URL}/services`,
    `${SITE_URL}/contact`,
  ],
  'gurgaon-manesar-master-plan-2031-explained': [
    `${SITE_URL}/gurgaon-master-plan-2041`,
    `${SITE_URL}/maps/gurgaon-manesar-master-plan`,
    `${SITE_URL}/blog/golf-course-extension-road-vs-golf-course-road-gurgaon`,
    `${SITE_URL}/services`,
    `${SITE_URL}/contact`,
  ],
  'nri-real-estate-buying-guide-gurgaon': [
    `${SITE_URL}/blog/gurgaon-manesar-master-plan-2031-explained`,
    `${SITE_URL}/blog/golf-course-extension-road-vs-golf-course-road-gurgaon`,
    `${SITE_URL}/services`,
    `${SITE_URL}/contact`,
  ],
  'dlf-arbour-vs-dlf-privana-gurgaon': [
    `${SITE_URL}/blog/golf-course-extension-road-vs-golf-course-road-gurgaon`,
    `${SITE_URL}/projects/dlf-arbour`,
    `${SITE_URL}/projects/dlf-privana`,
    `${SITE_URL}/services`,
    `${SITE_URL}/contact`,
  ],
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
    dateModified: post.dateModifiedISO || isoDate,
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
    significantLink: BLOG_SIGNIFICANT_LINKS[post.id] || [`${SITE_URL}/services`, `${SITE_URL}/contact`],
    wordCount: wordCount || undefined,
    keywords: BLOG_KEYWORDS[post.id] || `${post.category}, Gurgaon real estate, Gurugram property investment, LSR Realty`,
    isPartOf: { '@type': 'Blog', '@id': `${SITE_URL}/blog`, name: 'LSR Realty — Gurgaon Real Estate Blog', url: `${SITE_URL}/blog` },
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
    keywords: BLOG_KEYWORDS[post.id] || `${post.category}, Gurgaon real estate, Gurugram investment, LSR Realty`,
    image: postImage,
    ogType: 'article',
    articleMeta: {
      publishedTime: `${isoDate}T00:00:00+05:30`,
      modifiedTime: `${post.dateModifiedISO || isoDate}T00:00:00+05:30`,
      author: 'LSR Realty Advisory Team',
      section: post.category,
      tags: BLOG_ARTICLE_TAGS[post.id] || [],
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
