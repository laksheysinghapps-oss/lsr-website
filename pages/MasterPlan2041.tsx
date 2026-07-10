import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FAQS = [
  {
    q: 'When will the Gurgaon Master Plan 2041 be released?',
    a: 'The Gurgaon Master Plan 2041 has not been released yet. The statutory Final Development Plan 2041 for the Gurgaon-Manesar Urban Complex is still under preparation by GMDA and the Town and Country Planning Department, Haryana. There is no official notification date yet. Until it is notified, the Gurgaon Master Plan 2031 remains the operative development plan for all land use in Gurugram and Manesar. We update this page with the latest news and status as announcements are made.',
  },
  {
    q: 'Where can I download the Gurgaon Master Plan 2041 map or PDF?',
    a: 'The official Gurgaon Master Plan 2041 map and PDF are not yet available for download because the 2041 plan is still in preparation and has not been notified. Until the 2041 map is published, the operative document is the Gurgaon Master Plan 2031 (Gurugram Manesar Urban Complex) map, which you can view and download free, in high resolution, on our maps page.',
  },
  {
    q: 'What is the difference between the Gurgaon Master Plan 2031 and 2041?',
    a: 'The Gurgaon Master Plan 2031 is the current notified plan, designed for a population of about 42.5 lakh. The Gurgaon Master Plan 2041 is the next horizon plan, projected for around 55 lakh people, with expanded infrastructure (healthcare, schools, parks, mobility) and updated land use across the Gurgaon-Manesar Urban Complex. Sector-level differences will only be confirmed when the 2041 draft is published for objections and suggestions.',
  },
  {
    q: 'What is GMDA’s role in the Gurgaon Master Plan 2041?',
    a: 'The Gurugram Metropolitan Development Authority (GMDA), together with the Town and Country Planning Department, Haryana, is preparing the Gurgaon Master Plan 2041. GMDA has already produced supporting studies, including a Social Infrastructure Development Plan for the urban complex covering the city’s needs through the 2041 horizon.',
  },
  {
    q: 'What population is the Gurgaon 2041 plan designed for?',
    a: 'Planning documents prepared for the 2041 horizon project Gurugram’s population growing to around 55 lakh by 2041, up from the 42.5 lakh planned for under the 2031 plan.',
  },
  {
    q: 'Is there a Gurugram Master Plan 2041 map available now?',
    a: 'No. Gurgaon and Gurugram are the same city, and the Gurugram Master Plan 2041 (also written Gurgaon Haryana Master Plan 2041) is the same document that is still under preparation. Until it is released, the current Gurgaon Master Plan 2031 map is the one to consult, available free on our maps page.',
  },
];

const MasterPlan2041: React.FC = () => {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lsrrealty.com/' },
        { '@type': 'ListItem', position: 2, name: 'Gurgaon Manesar Master Plan 2031 & Sector Maps', item: 'https://lsrrealty.com/maps' },
        { '@type': 'ListItem', position: 3, name: 'Gurgaon Master Plan 2041', item: 'https://lsrrealty.com/gurgaon-master-plan-2041' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Gurgaon Master Plan 2041 - Status, Map, PDF Download & Latest News',
      description: 'Gurgaon Master Plan 2041 (Gurugram) tracker: latest status and news, draft timeline, GMDA infrastructure roadmap for a 55 lakh population, map and PDF download guidance, and how 2041 differs from 2031.',
      keywords: 'Gurgaon master plan 2041, Gurugram master plan 2041, Gurgaon Haryana master plan 2041, Gurgaon master plan 2041 map, Gurgaon master plan 2041 pdf, Gurgaon master plan 2041 download, Gurugram master plan pdf download, Gurgaon master plan 2041 status, Gurgaon master plan 2041 latest news, Gurgaon master plan 2041 draft, GMDA master plan 2041, Gurgaon development plan 2041, Gurgaon 2041 population, Gurgaon master plan 2041 vs 2031',
      author: { '@type': 'Organization', name: 'LSR Realty', url: 'https://lsrrealty.com/' },
      publisher: {
        '@type': 'Organization',
        name: 'LSR Realty',
        logo: { '@type': 'ImageObject', url: 'https://lsrrealty.com/images/Logo2.png' },
      },
      datePublished: '2026-07-04',
      dateModified: '2026-07-07',
      mainEntityOfPage: 'https://lsrrealty.com/gurgaon-master-plan-2041',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  const h2Class = 'text-2xl md:text-3xl font-serif mb-6 text-white';
  const h3Class = 'text-lg font-bold text-white mb-2';
  const pClass = 'text-gray-400 leading-relaxed';

  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <SEO
        title="Gurgaon Master Plan 2041: Status, Map & PDF Download | LSR Realty"
        description="Gurgaon Master Plan 2041 (Gurugram) tracker: latest status and news, draft timeline, GMDA infrastructure roadmap for a 55 lakh population, and how 2041 differs from 2031. View and download the current Gurgaon master plan map and PDF free."
        keywords="Gurgaon Master Plan 2041, Gurugram Master Plan 2041, Gurgaon Master Plan 2041 map, Gurgaon layout plan, Gurgaon map"
        path="/gurgaon-master-plan-2041"
        structuredData={structuredData}
      />

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <p className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Sector Intelligence</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-6">Gurgaon Master Plan 2041</h1>
        <p className="text-gray-400 text-lg max-w-3xl mb-10 leading-relaxed">
          The Gurgaon Master Plan 2041 - also written as the Gurugram Master Plan 2041 or Gurgaon Haryana Master Plan 2041 - is the next development blueprint for the city. This page is a live tracker of its status, latest news and draft timeline, with clear guidance on the 2041 map and PDF download, what GMDA has planned so far, and how the 2041 plan differs from the current Master Plan 2031. We update it as official announcements are made.
        </p>

        <div className="max-w-3xl">
          <section className="border-t border-white/10 pt-12">
            <h2 className={h2Class}>Latest News and Status of the Gurgaon Master Plan 2041</h2>
            <div className="space-y-5">
              <p className={pClass}>
                As of July 2026, the statutory Final Development Plan 2041 for the Gurgaon-Manesar Urban Complex has not yet been notified, so there is no official release date for the Gurgaon Master Plan 2041 yet. The <Link to="/maps/gurgaon-manesar-master-plan" className="gold-gradient-text hover:underline">Gurgaon Master Plan 2031</Link> - in force since November 2012 - remains the operative legal document governing land use across Gurugram and Manesar.
              </p>
              <p className={pClass}>
                Preparatory work for the 2041 horizon is well underway. The Gurugram Metropolitan Development Authority (GMDA) has prepared a Social Infrastructure Development Plan for the urban complex - drafted with the School of Planning and Architecture and approved by the state government - that maps the city's infrastructure needs through 2041. This is the clearest official signal so far of what the Gurgaon development plan 2041 will prioritise.
              </p>
            </div>
          </section>

          <section className="pt-12">
            <h2 className={h2Class}>Gurgaon Master Plan 2041 Map and PDF Download</h2>
            <div className="space-y-5">
              <p className={pClass}>
                Many people search for a Gurgaon Master Plan 2041 map or a 2041 PDF download. To be clear: the official Gurugram Master Plan 2041 map and PDF are not yet available, because the 2041 plan is still in preparation and has not been published for public objections. Any file circulating online claiming to be the 2041 map is not an official, notified document.
              </p>
              <p className={pClass}>
                Until the 2041 map is released, the document that actually governs your property is the current <Link to="/maps/gurgaon-manesar-master-plan" className="gold-gradient-text hover:underline">Gurgaon Master Plan 2031 map</Link>, which you can view and download free in high resolution on our website. It covers every sector, land use zone and transport corridor across the Gurgaon-Manesar Urban Complex, and it is the correct basis for any buying decision today.
              </p>
            </div>
          </section>

          <section className="pt-12">
            <h2 className={h2Class}>What the 2041 Planning Documents Reveal</h2>
            <div className="space-y-5">
              <p className={pClass}>
                The GMDA's 2041-horizon studies project Gurugram's population growing to roughly <strong className="text-white">55 lakh by 2041</strong>, up from the 42.5 lakh the 2031 plan was designed for. To support that growth, the infrastructure roadmap envisions around 210 speciality hospitals and diagnostic centres, 250 dispensaries and clinics, four district parks, 26 community parks and over 700 neighbourhood parks, alongside new sports facilities.
              </p>
              <p className={pClass}>
                For investors, the direction is clear: the next plan will push urbanisation deeper into New Gurgaon, the Dwarka Expressway corridor, Manesar and the peripheral sectors - the same corridors where the 2031 plan reserved land for future growth.
              </p>
            </div>
          </section>

          <section className="pt-12">
            <h2 className={h2Class}>Gurgaon Master Plan 2041 vs 2031: What to Expect</h2>
            <div className="space-y-5">
              <p className={pClass}>
                The key difference between the Master Plan 2031 and 2041 is scale. The 2031 plan is the current notified plan for a 42.5 lakh population; the 2041 plan is the next horizon, projected for around 55 lakh, with expanded infrastructure and updated land use. Every revision of Gurugram's master plan has followed the same pattern: higher population targets, expanded urbanisable area, and re-planning of land whose earlier designation no longer matched market reality (the 2031 plan itself exists largely because SEZ land from the 2025 plan found no takers). The 2041 plan is expected to continue that pattern - with particular focus on mobility (metro expansion, the Haryana Orbital Rail Corridor), civic infrastructure, and the integration of Manesar's industrial belt with residential growth.
              </p>
              <p className={pClass}>
                Sector-level details - which villages get new sectors, where land use changes - will only be known when the draft plan is published for public objections and suggestions. That draft publication is the moment property markets react. We will update this page the day it happens.
              </p>
            </div>
          </section>

          <section className="pt-12">
            <h2 className={h2Class}>What Buyers Should Do Until Then</h2>
            <p className={pClass}>
              Until the 2041 plan is notified, every purchase decision should be read against the current <Link to="/maps/gurgaon-manesar-master-plan" className="gold-gradient-text hover:underline">Gurgaon Master Plan 2031 map</Link>: confirm the sector's land use zoning, the width and status of roads serving it, and what is reserved around it. Our <Link to="/maps" className="gold-gradient-text hover:underline">sector maps library</Link> covers the official layout plans for over a hundred Gurugram locations, and our <Link to="/services" className="gold-gradient-text hover:underline">advisory team</Link> reads every project against the plan before recommending it.
            </p>
          </section>

          <section className="pt-12">
            <h2 className={h2Class}>Frequently Asked Questions</h2>
            <div className="space-y-8">
              {FAQS.map(f => (
                <div key={f.q}>
                  <h3 className={h3Class}>{f.q}</h3>
                  <p className={pClass}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-16 flex flex-col sm:flex-row gap-4">
            <Link
              to="/maps/gurgaon-manesar-master-plan"
              className="flex-1 bg-lsr-gold text-black px-6 py-4 text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-opacity text-center"
            >
              View & Download the Master Plan 2031 Map
            </Link>
            <Link
              to="/contact"
              className="flex-1 border border-lsr-gold gold-gradient-text px-6 py-4 text-sm uppercase tracking-widest font-bold hover:border-white transition-colors text-center"
            >
              Talk to Our Advisory Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterPlan2041;
