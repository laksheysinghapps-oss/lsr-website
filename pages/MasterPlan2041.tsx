import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FAQS = [
  {
    q: 'Has the Gurgaon Master Plan 2041 been released?',
    a: 'Not yet. The statutory Final Development Plan 2041 for the Gurgaon-Manesar Urban Complex is under preparation. Until it is notified, the Gurgaon Master Plan 2031 remains the operative development plan for all land use in Gurugram and Manesar.',
  },
  {
    q: 'What population will the Gurgaon Master Plan 2041 be designed for?',
    a: 'Planning documents prepared for the 2041 horizon project Gurugram’s population to grow to around 55 lakh by 2041, up from the 42.5 lakh planned for under the 2031 plan.',
  },
  {
    q: 'Who is preparing the Gurugram 2041 plan?',
    a: 'The Gurugram Metropolitan Development Authority (GMDA), together with the Town and Country Planning Department, Haryana. GMDA has already prepared supporting studies, including a Social Infrastructure Development Plan for the 2041 horizon.',
  },
  {
    q: 'What will change compared to the Master Plan 2031?',
    a: 'The 2041 plan is expected to plan for a larger population, expanded infrastructure (healthcare, parks, mobility), and updated land use across the Gurgaon-Manesar Urban Complex. Specific sector-level changes will only be known when the draft is published for objections and suggestions.',
  },
  {
    q: 'Where can I see the current Gurgaon Master Plan?',
    a: 'The operative plan today is the Gurgaon Master Plan 2031. You can view and download the full high-resolution map on our Gurgaon Master Plan 2031 page.',
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
      headline: 'Gurgaon Master Plan 2041 - Status, Expected Changes & Timeline',
      description: 'Track the Gurgaon Master Plan 2041 (Gurugram 2041): current status, expected population and infrastructure planning, and how it will differ from Master Plan 2031.',
      author: { '@type': 'Organization', name: 'LSR Realty', url: 'https://lsrrealty.com/' },
      publisher: {
        '@type': 'Organization',
        name: 'LSR Realty',
        logo: { '@type': 'ImageObject', url: 'https://lsrrealty.com/images/Logo2.png' },
      },
      dateModified: '2026-07-04',
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
        title="Gurgaon Master Plan 2041 - Status, Changes & Timeline | LSR Realty"
        description="Gurgaon Master Plan 2041 tracker: current status, expected population growth to 55 lakh, GMDA infrastructure roadmap and how it differs from Master Plan 2031. Updated July 2026."
        path="/gurgaon-master-plan-2041"
        structuredData={structuredData}
      />

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <p className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Sector Intelligence</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-6">Gurgaon Master Plan 2041</h1>
        <p className="text-gray-400 text-lg max-w-3xl mb-10 leading-relaxed">
          The next development blueprint for Gurugram is coming. This page tracks the status of the Gurgaon Master Plan 2041 (Gurugram 2041), what is known so far, and what it means for property buyers and investors. We update it as official announcements are made.
        </p>

        <div className="max-w-3xl">
          <section className="border-t border-white/10 pt-12">
            <h2 className={h2Class}>Current Status: In Preparation</h2>
            <div className="space-y-5">
              <p className={pClass}>
                As of July 2026, the statutory Final Development Plan 2041 for the Gurgaon-Manesar Urban Complex has not yet been notified. The <Link to="/maps/gurgaon-manesar-master-plan" className="gold-gradient-text hover:underline">Gurgaon Master Plan 2031</Link> - in force since November 2012 - remains the operative legal document governing land use across Gurugram and Manesar.
              </p>
              <p className={pClass}>
                Preparatory work for the 2041 horizon is well underway. The Gurugram Metropolitan Development Authority (GMDA) has prepared a Social Infrastructure Development Plan for the urban complex - drafted with the School of Planning and Architecture and approved by the state government - that maps the city's infrastructure needs through 2041.
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
            <h2 className={h2Class}>Master Plan 2031 vs 2041: What to Expect</h2>
            <div className="space-y-5">
              <p className={pClass}>
                Every revision of Gurugram's master plan has followed the same pattern: higher population targets, expanded urbanisable area, and re-planning of land whose earlier designation no longer matched market reality (the 2031 plan itself exists largely because SEZ land from the 2025 plan found no takers). The 2041 plan is expected to continue that pattern - with particular focus on mobility (metro expansion, the Haryana Orbital Rail Corridor), civic infrastructure, and the integration of Manesar's industrial belt with residential growth.
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
              View the Current Master Plan 2031
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
