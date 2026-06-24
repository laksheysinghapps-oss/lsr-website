import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SECTOR_MAPS } from '../constants';
import SEO from '../components/SEO';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PAGE_TITLE = 'Gurgaon Sector Maps & Master Plan 2031 | LSR Realty';
const PAGE_DESCRIPTION = 'Explore sector wise maps of Gurugram, DLF phases, Golf Course Road, Dwarka Expressway, Sohna Road and the Gurgaon Manesar Master Plan 2031. View location guides and connect with LSR Realty on available inventory.';

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lsrrealty.com/' },
      { '@type': 'ListItem', position: 2, name: 'Gurgaon Sector Maps & Master Plan 2031', item: 'https://lsrrealty.com/maps' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Gurgaon Sector Maps & Location Guide',
    description: 'Comprehensive sector maps and location guides for all major investment corridors in Gurugram, Haryana, India.',
    url: 'https://lsrrealty.com/maps',
    publisher: { '@type': 'RealEstateAgent', name: 'LSR Realty', url: 'https://lsrrealty.com' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Map',
    name: 'Gurgaon Manesar Master Plan 2031',
    alternateName: 'Gurugram Manesar Master Plan 2031',
    description: 'The official Gurgaon Manesar Master Plan 2031, also known as the Gurugram Manesar Master Plan 2031, for the Gurugram Manesar Urban Complex, showing all sectors, land use zones, transport corridors and the proposed metro route.',
    image: `https://lsrrealty.com${SECTOR_MAPS[0].zoom}`,
    url: 'https://lsrrealty.com/maps',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Gurgaon Manesar Master Plan 2031 & Sector Maps',
    description: PAGE_DESCRIPTION,
    itemListElement: SECTOR_MAPS.map((sector, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://lsrrealty.com/maps/${sector.id}`,
      item: {
        '@type': 'Place',
        name: sector.name,
        description: sector.description,
        image: `https://lsrrealty.com${sector.zoom}`,
        url: `https://lsrrealty.com/maps/${sector.id}`,
        address: { '@type': 'PostalAddress', addressLocality: sector.name, addressRegion: 'Haryana', addressCountry: 'IN' },
      },
    })),
  },
];

const Maps: React.FC = () => {
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <SEO title={PAGE_TITLE} description={PAGE_DESCRIPTION} path="/maps" structuredData={structuredData} />

      <div className="max-w-7xl mx-auto px-6">
        <p className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Sector Intelligence</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Gurgaon Sector Maps &amp; Location Investment Guide</h1>
        <h2 className="text-lg text-gray-400 font-normal mb-10 leading-relaxed">
          Explore Gurugram's key micro markets, sector layouts, connectivity and investment potential in one place, including the Gurgaon Manesar Master Plan 2031.
        </h2>

        <div className="text-gray-400 leading-relaxed space-y-5 mb-4">
          <p className={!isContentExpanded ? 'line-clamp-1' : ''}>
            Gurgaon, officially Gurugram, is divided into more than a hundred numbered sectors spread across a handful of major investment corridors: Golf Course Road, Golf Course Extension Road, Dwarka Expressway, Sohna Road, NH 48 and Southern Peripheral Road (SPR). Understanding where a sector sits within this structure, and what is happening there in terms of infrastructure, connectivity and inventory, is the first step to making an informed property decision.
          </p>
          {isContentExpanded && (
            <>
              <p>
                The Gurgaon Manesar Master Plan 2031 is the official blueprint that governs land use across the entire Gurugram Manesar Urban Complex. It defines which areas are zoned residential, commercial or industrial, and maps the road network and planned metro extensions that influence how a location develops over time. We cover the full master plan, along with location specific sector maps, below.
              </p>
              <p>
                <strong className="text-white">Golf Course Road</strong> is home to Gurgaon's oldest established luxury enclaves, including the DLF Phase I to V developments and Sushant Lok, and remains the city's most aspirational residential address.
              </p>
              <p>
                <strong className="text-white">Golf Course Extension Road and Southern Peripheral Road</strong> form a newer, fast developing corridor with premium high rise residential and commercial projects from several major developers, sitting between the older Golf Course Road sectors and the Dwarka Expressway belt.
              </p>
              <p>
                <strong className="text-white">Dwarka Expressway</strong>, formally the Northern Peripheral Road, became a fully operational expressway in 2024 and anchors New Gurgaon's growth, with several major developers active across its adjoining sectors.
              </p>
              <p>
                <strong className="text-white">Sohna Road</strong> is an established residential belt with a strong school catchment and a long track record of end user and rental demand.
              </p>
              <p>
                Use the sector maps below to identify the right location for your investment. Our advisors are available to walk you through micro market analysis for any sector, get in touch to book a consultation.
              </p>
            </>
          )}
        </div>
        <button
          onClick={() => setIsContentExpanded(v => !v)}
          className="flex items-center gap-1.5 gold-gradient-text text-sm font-semibold mb-8 hover:opacity-80 transition-opacity"
        >
          {isContentExpanded ? 'Show Less' : 'Read More'}
          {isContentExpanded ? <ChevronUp size={16} className="text-lsr-gold" /> : <ChevronDown size={16} className="text-lsr-gold" />}
        </button>

        <section aria-label="Gurugram sector and location maps" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {SECTOR_MAPS.map(sector => (
            <article key={sector.id} className="border border-white/10 hover:border-lsr-gold/40 transition-all duration-300 flex flex-col">
              <h2 className="text-lg font-sans font-semibold text-white px-6 pt-6 pb-3">
                <Link to={`/maps/${sector.id}`} className="hover:text-lsr-gold transition-colors">{sector.name}</Link>
              </h2>
              <Link to={`/maps/${sector.id}`} aria-label={`View full ${sector.name} layout map`} className="relative h-48 overflow-hidden block">
                <img
                  src={sector.thumb}
                  alt={`${sector.name} Gurugram, official approved layout map`}
                  title={`${sector.name} approved layout map`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={1000}
                  height={496}
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                />
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-6">{sector.description}</p>
                <div className="flex gap-3">
                  <Link
                    to={`/maps/${sector.id}`}
                    className="flex-1 border border-lsr-gold gold-gradient-text px-3 py-2 text-[10px] uppercase tracking-wide font-bold whitespace-nowrap hover:border-white transition-colors text-center"
                  >
                    View Sector Map
                  </Link>
                  <Link
                    to={`/maps/${sector.id}`}
                    className="flex-1 bg-lsr-gold text-black px-3 py-2 text-[10px] uppercase tracking-wide font-bold whitespace-nowrap hover:opacity-90 transition-opacity text-center"
                  >
                    View Inventory
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Maps;
