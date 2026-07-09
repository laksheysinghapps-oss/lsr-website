import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SECTOR_MAPS, SectorMap } from '../constants';
import BrochureModal from '../components/BrochureModal';
import SEO from '../components/SEO';
import { ChevronLeft, Download } from 'lucide-react';

const MASTER_PLAN_FAQS = [
  {
    q: 'What is the Gurgaon Master Plan 2031?',
    a: 'It is the Final Development Plan for the Gurgaon-Manesar Urban Complex, notified by DTCP Haryana on 15 November 2012, planning land use for a population of 42.5 lakh across 33,872 hectares.',
  },
  {
    q: 'How do I download the Gurgaon Master Plan 2031 map?',
    a: 'Use the Download Map button on this page for the high-resolution map, sourced from the official plan issued by the Town and Country Planning Department, Haryana.',
  },
  {
    q: 'Are the Gurgaon Master Plan 2031 and Gurugram Master Plan 2031 different?',
    a: 'No - the city was renamed Gurugram in 2016, but the plan is the same document: the Gurgaon-Manesar Urban Complex Development Plan 2031 AD.',
  },
  {
    q: 'Does the master plan cover Manesar?',
    a: 'Yes. The plan covers the full Gurgaon-Manesar Urban Complex, including IMT Manesar and its industrial zone of 4,613 hectares, plus a proposed metro extension to Manesar.',
  },
  {
    q: 'Which sectors does the plan include?',
    a: 'Sectors up to 115, including new sectors 88A, 88B, 89A, 89B, 95A, 95B and 99A along Dwarka Expressway, New Gurgaon and Pataudi Road.',
  },
  {
    q: 'Has the Gurgaon Master Plan 2041 been released?',
    a: 'The 2041 plan is under preparation with DTCP Haryana. Until it is notified, the Gurgaon Master Plan 2031 remains the operative development plan.',
  },
];

const LAND_USE = [
  ['Residential', '16,021', '48.6%'],
  ['Industrial', '4,613', '14.0%'],
  ['Transport & communication', '4,428', '13.4%'],
  ['Open spaces', '2,928', '8.9%'],
  ['Public & semi-public', '2,027', '6.1%'],
  ['Commercial', '1,616', '4.9%'],
  ['Defence land', '633', '1.9%'],
  ['Public utilities', '608', '1.8%'],
  ['Special zone', '114', '0.3%'],
];

const MapDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sector, setSector] = useState<SectorMap | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const found = SECTOR_MAPS.find(s => s.id === id);
    if (found) {
      setSector(found);
      setIsZoomed(false);
    } else {
      navigate('/maps');
    }
  }, [id, navigate]);

  if (!sector) return null;

  const isMasterPlan = sector.id === 'gurgaon-manesar-master-plan';
  const isImtManesar = sector.id === 'imt-manesar';
  const pageTitle = isMasterPlan
    ? 'Gurgaon Master Plan 2031 - Map, Sectors & Free Download | LSR Realty'
    : `${sector.name} Layout Map | Gurgaon Manesar Master Plan 2031 | LSR Realty`;
  const pageDescription = isMasterPlan
    ? 'View the official Gurgaon Master Plan 2031 (Gurugram Manesar Urban Complex) map - all sectors, land use zones, metro routes and free download. Updated July 2026.'
    : `${sector.description} View the official, government approved ${sector.name} layout map, part of the Gurgaon map and Gurugram map series covering the Gurgaon Manesar Master Plan 2031 (Gurugram Manesar Master Plan 2031).`;
  const pageKeywords = `${sector.name} layout plan, ${sector.name} lay out plan, ${sector.name} map, ${sector.name}, Gurgaon map, Gurugram map, Gurugram sector map, Gurgaon layout`;

  const structuredData: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lsrrealty.com/' },
        { '@type': 'ListItem', position: 2, name: 'Gurgaon Manesar Master Plan 2031 & Sector Maps', item: 'https://lsrrealty.com/maps' },
        { '@type': 'ListItem', position: 3, name: sector.name, item: `https://lsrrealty.com/maps/${sector.id}` },
      ],
    },
  ];

  if (isMasterPlan) {
    structuredData.push(
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Gurgaon Master Plan 2031 - Map, Sectors & Free Download',
        description: pageDescription,
        image: `https://lsrrealty.com${sector.zoom}`,
        author: { '@type': 'Organization', name: 'LSR Realty', url: 'https://lsrrealty.com/' },
        publisher: {
          '@type': 'Organization',
          name: 'LSR Realty',
          logo: { '@type': 'ImageObject', url: 'https://lsrrealty.com/images/Logo2.png' },
        },
        dateModified: '2026-07-04',
        mainEntityOfPage: `https://lsrrealty.com/maps/${sector.id}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: MASTER_PLAN_FAQS.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    );
  } else {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: sector.name,
      description: sector.description,
      image: `https://lsrrealty.com${sector.zoom}`,
      url: `https://lsrrealty.com/maps/${sector.id}`,
      address: { '@type': 'PostalAddress', addressLocality: sector.name, addressRegion: 'Haryana', addressCountry: 'IN' },
    });
  }

  const h2Class = 'text-2xl md:text-3xl font-serif mb-6 text-white';
  const h3Class = 'text-lg font-bold text-white mb-2';
  const pClass = 'text-gray-400 leading-relaxed';

  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <SEO title={pageTitle} description={pageDescription} keywords={pageKeywords} path={`/maps/${sector.id}`} image={`https://lsrrealty.com${sector.zoom}`} structuredData={structuredData} />

      {showInventoryModal && (
        <BrochureModal
          projectName={sector.name}
          onClose={() => setShowInventoryModal(false)}
          title="Request Inventory"
          subtitle="Share your details and our team will share live inventory and pricing for this location."
          source={`Sector Map Inventory: ${sector.name}`}
          successMessage="Our team will share the available inventory with you shortly."
          buttonLabel="Request Inventory"
        />
      )}

      {showDownloadModal && (
        <BrochureModal
          projectName={sector.name}
          onClose={() => setShowDownloadModal(false)}
          title="Download the Map"
          subtitle="Share your details and your download will start right away."
          source={`Sector Map Download: ${sector.name}`}
          successMessage="Your download has started. Check your downloads folder."
          buttonLabel="Download Map"
          downloadUrl={sector.zoom}
        />
      )}

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <Link to="/maps" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-lsr-gold transition-colors mb-8">
          <ChevronLeft size={16} /> Back to Gurgaon Manesar Master Plan 2031 & Sector Maps
        </Link>

        <p className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Sector Intelligence</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-6">
          {isMasterPlan ? 'Gurgaon Master Plan 2031 (Gurugram Manesar Urban Complex)' : sector.name}
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mb-2 leading-relaxed">
          {isMasterPlan
            ? 'The official Gurgaon Master Plan 2031 - formally the Gurgaon-Manesar Urban Complex Final Development Plan 2031 AD - showing every sector, land use zone, transport corridor and the proposed metro route. Zoom into the map below or download the high-resolution version.'
            : sector.description}
        </p>
        <p className="text-gray-500 text-sm mb-10">Source: {sector.source}</p>

        <div className="border border-white/10 overflow-hidden">
          <div className="overflow-auto max-h-[75vh] bg-black" style={{ touchAction: 'pinch-zoom' }}>
            <img
              src={sector.zoom}
              alt={`${sector.name} map — Gurgaon layout plan, Gurugram map, full resolution official approved, source: ${sector.source}`}
              className={isZoomed ? 'h-auto cursor-zoom-out' : 'w-full h-auto cursor-zoom-in'}
              style={{ width: isZoomed ? '220%' : '100%', maxWidth: 'none' }}
              onClick={() => setIsZoomed(z => !z)}
              draggable={false}
              onContextMenu={e => e.preventDefault()}
            />
          </div>
          <p className="text-center text-xs text-gray-500 py-2 border-t border-white/10">Click the image to zoom in / out</p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-lsr-gold text-black px-6 py-4 text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
          >
            <Download size={16} /> Download Map
          </button>
          <button
            onClick={() => setShowInventoryModal(true)}
            className="flex-1 border border-lsr-gold gold-gradient-text px-6 py-4 text-sm uppercase tracking-widest font-bold hover:border-white transition-colors"
          >
            Check Inventory in {isMasterPlan ? 'Gurgaon' : sector.name}
          </button>
          <Link
            to="/maps"
            className="flex-1 border border-white/20 text-gray-300 px-6 py-4 text-sm uppercase tracking-widest font-bold hover:border-lsr-gold transition-colors text-center"
          >
            View All Sector Maps
          </Link>
        </div>

        {isMasterPlan && (
          <div className="max-w-3xl">
            <section className="border-t border-white/10 pt-16 mt-16">
              <h2 className={h2Class}>What is the Gurgaon Master Plan 2031?</h2>
              <div className="space-y-5">
                <p className={pClass}>
                  The Gurgaon Master Plan 2031 - officially the Gurgaon-Manesar Urban Complex (GMUC) Final Development Plan 2031 AD - was notified by the Town and Country Planning Department (DTCP), Haryana on 15 November 2012. It is the legal land-use framework for the entire urban complex, designed for a projected population of 42.5 lakh across a total planned area of 33,872 hectares. It defines exactly what can be built where: residential sectors, commercial belts, industrial estates, institutional land, green belts, agricultural zones and the road, metro and rail network that connects them.
                </p>
                <p className={pClass}>
                  Because Gurgaon was officially renamed Gurugram in 2016, the same document is also referred to as the Gurugram Master Plan 2031 or Gurugram Manesar Master Plan 2031 - they are all one and the same plan. For anyone buying property in Gurugram, this is the single most important document to consult: it shows not only what exists today, but what is formally planned around a property, which is what determines long-term appreciation.
                </p>
              </div>
            </section>

            <section className="pt-12">
              <h2 className={h2Class}>History: Master Plan 2021 → 2025 → 2031</h2>
              <div className="space-y-5">
                <p className={pClass}>
                  <strong className="text-white">Master Plan 2021</strong> was published on 5 February 2007 for a projected population of 37 lakh at a density of 80 persons per acre (PPA). Density norms were later raised to 120 PPA across Haryana, and the road network in Sectors 58-67 was re-planned.
                </p>
                <p className={pClass}>
                  <strong className="text-white">Master Plan 2025</strong> followed with a marginal increase (about 1.18%) in urbanisable area. Its defining feature was roughly 4,570 hectares earmarked for Special Economic Zones (SEZs).
                </p>
                <p className={pClass}>
                  <strong className="text-white">Master Plan 2031</strong>, notified on 15 November 2012, exists primarily because SEZ demand collapsed after 2008. Notified SEZ land had no takers, landowners demanded re-planning, and the government revised the entire development plan - raising the population target to 42.5 lakh and re-allocating former SEZ land to residential, commercial and industrial use.
                </p>
              </div>
            </section>

            <section className="pt-12">
              <h2 className={h2Class}>Land Use Distribution in the Gurgaon Master Plan 2031</h2>
              <div className="overflow-x-auto border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white uppercase tracking-wider text-xs">
                      <th className="px-4 py-3">Land use</th>
                      <th className="px-4 py-3">Area (hectares)</th>
                      <th className="px-4 py-3">Share</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    {LAND_USE.map(([use, area, share]) => (
                      <tr key={use} className="border-b border-white/5">
                        <td className="px-4 py-2">{use}</td>
                        <td className="px-4 py-2">{area}</td>
                        <td className="px-4 py-2">{share}</td>
                      </tr>
                    ))}
                    <tr className="border-b border-white/5 text-white font-bold">
                      <td className="px-4 py-2">Total urbanisable area</td>
                      <td className="px-4 py-2">32,988</td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-4 py-2">Existing town + village abadis</td>
                      <td className="px-4 py-2">884</td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className="text-white font-bold">
                      <td className="px-4 py-2">Grand total</td>
                      <td className="px-4 py-2">33,872</td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className={`${pClass} mt-5`}>
                Nearly half the planned area is residential - enough to house the 20.5 lakh additional residents projected beyond the roughly 22 lakh already accommodated when the plan was notified. New residential sectors follow the neighbourhood concept at a net density of 250 persons per hectare, with parks at a minimum of 2.5 sq m per person and internal roads no narrower than 12 metres.
              </p>
            </section>

            <section className="pt-12">
              <h2 className={h2Class}>Sectors Covered: Sector 1 to Sector 115</h2>
              <div className="space-y-5">
                <p className={pClass}>
                  The 2031 plan extends Gurugram's sector grid well beyond the established HUDA sectors, up to Sector 115. Key additions include Sectors 88A, 88B, 89A, 89B, 95A, 95B and 99A across New Gurgaon, Pataudi Road and the Dwarka Expressway corridor, covering land in villages such as Wazirpur, Hayatpur, Mohammadpur, Garauli Khurd, Garauli Kalan and Harsaru.
                </p>
                <p className={pClass}>
                  Notable sector-level reservations: about 48.5 hectares for wholesale markets in Sector 99A along the Delhi-Rewari railway line; 215 hectares for a university in Sector 68; public utility sites in Sectors 37D, 99A, 100, 101 and 107; a planned artificial water body in Sectors 72/72A for groundwater recharge and flood control; and a 200/172 metre wide institutional belt along the outer periphery road for government and semi-government offices.
                </p>
              </div>
            </section>

            <section className="pt-12">
              <h2 className={h2Class}>Manesar Master Plan 2031: IMT Manesar and the Industrial Zone</h2>
              <div className="space-y-5">
                <p className={pClass}>
                  Manesar is not a separate plan - the Manesar Master Plan 2031 is the industrial and southern half of the same GMUC document, and it is where much of Gurugram's future growth is concentrated. <Link to="/maps/imt-manesar" className="gold-gradient-text hover:underline">IMT Manesar</Link> was started in 1992 by HSIIDC, initially in collaboration with Japanese entrepreneurs, and its first 700 hectares anchored Gurugram's automobile and manufacturing economy.
                </p>
                <p className={pClass}>
                  Under the 2031 plan, 4,613 hectares are reserved for industry - targeted at software, automobile and non-polluting hi-tech units - with new industrial areas planned along the NH-48 expressway adjacent to IMT Manesar. Three transport reservations matter most for Manesar: the Kundli-Manesar-Palwal (KMP) Expressway, reserved as a 100 metre wide road with 100 metre green belts on both sides; the proposed metro extension from HUDA City Centre to Manesar via Sectors 43-44, 52-52A, 56-57, SPR and NH-48; and a 50 metre wide Orbital Rail Corridor reservation.
                </p>
                <p className={pClass}>
                  For investors, Manesar's combination of reserved industrial land, expressway connectivity and planned mass transit is what drives demand for plots, warehousing and workforce housing in the surrounding sectors.
                </p>
              </div>
            </section>

            <section className="pt-12">
              <h2 className={h2Class}>Metro, RRTS and Road Network in the 2031 Plan</h2>
              <div className="space-y-5">
                <p className={pClass}>
                  The plan proposes a metro extension from HUDA City Centre to Manesar, plus a second loop from Sikanderpur via Sector 25-25A extended to SPR through Golf Course Road. A Mass Rapid Transit corridor runs along the 150 metre northern link road from Dwarka to a proposed ISBT of about 162 hectares near Kherki Daula, and the Delhi-Alwar Regional Rapid Transit (RRTS) alignment follows NH-48. New Delhi links include 90 metre roads from Vasant Kunj and Andheria Mor, and the 150 metre Dwarka link road - today's Dwarka Expressway.
                </p>
                <p className={pClass}>
                  Roads follow a V-1 to V-4 hierarchy, from 150 metre arterials with 60 metre green belts down to 24 metre internal sector roads; sector-dividing roads in new areas are 75 and 60 metres wide. These widths matter: a plot facing a 75 metre sector road carries very different commercial potential from one on a 24 metre internal road.
                </p>
              </div>
            </section>

            <section className="pt-12">
              <h2 className={h2Class}>How Investors Should Read the Master Plan</h2>
              <div className="space-y-5">
                <p className={pClass}>
                  Before committing capital, verify three things on the map. First, land use zoning: confirm the sector is zoned for your intended use - residential, commercial or industrial. Buying "commercial potential" land that is actually zoned agricultural is the most common master-plan mistake. Second, confirmed connectivity: check the width and status of roads serving the sector, and its distance from the metro, RRTS or expressway reservations. Third, what surrounds the sector: green belts, utility sites, defence land buffers (a 900 metre no-construction strip surrounds the ammunition depot) and the Aravalli Natural Conservation Zone all constrain - or protect - future development around a property.
                </p>
                <p className={pClass}>
                  At LSR Realty we read every <Link to="/projects" className="gold-gradient-text hover:underline">project</Link> against the master plan before advising clients on residential, office and retail opportunities across Gurugram - from established corridors like Golf Course Road and MG Road to emerging sectors on Dwarka Expressway, SPR and Sohna Road. Learn more about our <Link to="/services" className="gold-gradient-text hover:underline">advisory services</Link>.
                </p>
              </div>
            </section>

            <section className="pt-12">
              <h2 className={h2Class}>Gurgaon Master Plan 2041: What Comes Next</h2>
              <p className={pClass}>
                Work on the next-horizon plan for Gurugram (Master Plan 2041) has been underway with DTCP Haryana. Until it is finally notified, the 2031 plan remains the operative legal document for all land use in the Gurgaon-Manesar Urban Complex. Track the latest status, expected changes and timeline on our dedicated <Link to="/gurgaon-master-plan-2041" className="gold-gradient-text hover:underline">Gurgaon Master Plan 2041</Link> page, which we update as official announcements are made.
              </p>
            </section>

            <section className="pt-12">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-8">
                {MASTER_PLAN_FAQS.map(f => (
                  <div key={f.q}>
                    <h3 className={h3Class}>{f.q}</h3>
                    <p className={pClass}>{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {isImtManesar && (
          <div className="max-w-3xl">
            <section className="border-t border-white/10 pt-16 mt-16">
              <h2 className={h2Class}>IMT Manesar and the Manesar Master Plan 2031</h2>
              <div className="space-y-5">
                <p className={pClass}>
                  IMT (Industrial Model Township) Manesar is the industrial anchor of the <Link to="/maps/gurgaon-manesar-master-plan" className="gold-gradient-text hover:underline">Gurgaon Master Plan 2031</Link>, the official development plan for the Gurgaon-Manesar Urban Complex notified by DTCP Haryana in November 2012. Development began in 1992, when HSIIDC - initially in collaboration with Japanese entrepreneurs - developed the first 700 hectares that went on to anchor Gurugram's automobile and manufacturing economy.
                </p>
                <p className={pClass}>
                  Under the 2031 plan, 4,613 hectares across the urban complex are reserved for industrial use, concentrated in and around IMT Manesar and targeted at software, automobile and non-polluting hi-tech industries. New industrial areas are planned along the NH-48 expressway adjacent to the township.
                </p>
                <p className={pClass}>
                  Three planned transport corridors define Manesar's investment case: the Kundli-Manesar-Palwal (KMP) Expressway, reserved as a 100 metre road with 100 metre green belts on both sides; the proposed metro extension from HUDA City Centre to Manesar via SPR and NH-48; and the 50 metre Orbital Rail Corridor reservation, now taking shape as the Haryana Orbital Rail Corridor. Together they connect Manesar's industrial base to Delhi, the airport and the wider NCR freight network.
                </p>
                <p className={pClass}>
                  For investors, this combination of reserved industrial land, expressway access and planned mass transit drives demand for industrial plots, warehousing and workforce housing in the sectors surrounding IMT Manesar. At LSR Realty we advise on <Link to="/projects" className="gold-gradient-text hover:underline">opportunities</Link> across this corridor - always read against the official master plan before committing capital.
                </p>
              </div>
            </section>
          </div>
        )}

        {!isMasterPlan && !isImtManesar && (
          <section className="max-w-3xl border-t border-white/10 pt-16 mt-16">
            <p className="text-gray-400 leading-relaxed">
              This map is part of the <Link to="/maps/gurgaon-manesar-master-plan" className="gold-gradient-text hover:underline">Gurgaon Master Plan 2031</Link> (Gurugram Manesar Urban Complex), the official development blueprint prepared by the Town and Country Planning Department, Haryana.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default MapDetail;
