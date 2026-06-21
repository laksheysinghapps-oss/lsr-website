import React from 'react';
import { Link } from 'react-router-dom';
import { SECTOR_MAPS } from '../constants';
import SEO from '../components/SEO';

const PAGE_TITLE = 'Gurgaon Manesar Master Plan 2031 & Sector Maps | LSR Realty';
const PAGE_DESCRIPTION = 'View the official Gurgaon Manesar Master Plan 2031, also known as the Gurugram Manesar Master Plan 2031, along with approved sector layout maps for Golf Course Road, Sohna Road, MG Road, DLF Phase 2/Cybercity and Sectors 58 to 103, with live inventory access from LSR Realty.';

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lsrrealty.com/' },
      { '@type': 'ListItem', position: 2, name: 'Gurgaon Manesar Master Plan 2031 & Sector Maps', item: 'https://lsrrealty.com/maps' },
    ],
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
  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <SEO title={PAGE_TITLE} description={PAGE_DESCRIPTION} path="/maps" structuredData={structuredData} />

      <div className="max-w-7xl mx-auto px-6">
        <p className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Sector Intelligence</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-6">Sector Maps and Master Plan 2031</h1>
        <p className="text-gray-400 text-lg max-w-2xl mb-4 leading-relaxed">
          Explore approved sector layout maps and the Gurgaon Manesar Master Plan 2031 for Gurugram's key micro markets, including Golf Course Road, MG Road, Sohna Road, DLF Phase 2/Cybercity and Sectors 58 through 103.</p>
        <p className="text-gray-500 text-sm max-w-2xl mb-16 leading-relaxed">
          Source: Town &amp; Country Planning Department, Haryana (tcpharyana.gov.in) and Haryana Shehri Vikas Pradhikaran (hsvphry.org.in), official, government approved layout and sectoral plans.</p>

        <section aria-label="Gurugram sector and location maps" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {SECTOR_MAPS.map(sector => (
            <article key={sector.id} className="border border-white/10 hover:border-lsr-gold/40 transition-all duration-300 flex flex-col">
              <Link to={`/maps/${sector.id}`} aria-label={`View full ${sector.name} layout map`} className="relative h-48 overflow-hidden block">
                <img
                  src={sector.thumb}
                  alt={`${sector.name} Gurugram, official approved layout map`}
                  title={`${sector.name} approved layout map`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={1000}
                  height={496}
                />
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-lg font-sans font-semibold text-white mb-2">
                  <Link to={`/maps/${sector.id}`} className="hover:text-lsr-gold transition-colors">{sector.name}</Link>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-6">{sector.description}</p>
                <div className="flex gap-3">
                  <Link
                    to={`/maps/${sector.id}`}
                    className="flex-1 border border-lsr-gold gold-gradient-text px-4 py-2 text-xs uppercase tracking-widest font-bold hover:border-white transition-colors text-center"
                  >
                    View Sector Map
                  </Link>
                  <Link
                    to={`/maps/${sector.id}`}
                    className="flex-1 bg-lsr-gold text-black px-4 py-2 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity text-center"
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
