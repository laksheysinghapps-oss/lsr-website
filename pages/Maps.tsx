import React, { useState, useMemo } from 'react';
import { SECTOR_MAPS } from '../constants';
import BrochureModal from '../components/BrochureModal';
import SEO from '../components/SEO';
import { X } from 'lucide-react';

const PAGE_TITLE = 'Gurugram Sector Maps — Golf Course Road, Sohna Road, MG Road & DLF Cybercity | LSR Realty';
const PAGE_DESCRIPTION = 'Official DTCP & HSVP approved layout maps for Gurugram\'s key micro-markets — Sectors 58 to 103, Golf Course Road, MG Road, Sohna Road and DLF Phase 2/Cybercity — with live inventory access from LSR Realty.';

const Maps: React.FC = () => {
  const [inventorySector, setInventorySector] = useState<string | null>(null);
  const [zoomedSector, setZoomedSector] = useState<{ name: string; zoom: string; source: string } | null>(null);

  const structuredData = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lsrrealty.com/' },
        { '@type': 'ListItem', position: 2, name: 'Gurugram Sector Maps', item: 'https://lsrrealty.com/maps' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Gurugram Sector Maps',
      description: PAGE_DESCRIPTION,
      itemListElement: SECTOR_MAPS.map((sector, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Place',
          name: sector.name,
          description: sector.description,
          image: `https://lsrrealty.com${sector.zoom}`,
          address: { '@type': 'PostalAddress', addressLocality: sector.name, addressRegion: 'Haryana', addressCountry: 'IN' },
        },
      })),
    },
  ], []);

  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <SEO title={PAGE_TITLE} description={PAGE_DESCRIPTION} path="/maps" structuredData={structuredData} />

      {inventorySector && (
        <BrochureModal
          projectName={inventorySector}
          onClose={() => setInventorySector(null)}
          title="Request Inventory"
          subtitle="Share your details and our team will share live inventory and pricing for this location."
          source={`Sector Map Inventory - ${inventorySector}`}
          successMessage="Our team will share the available inventory with you shortly."
          buttonLabel="Request Inventory"
        />
      )}

      {zoomedSector && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-8"
          onClick={() => setZoomedSector(null)}
        >
          <div
            className="bg-lsr-charcoal border border-white/10 w-full max-w-5xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-serif text-white">{zoomedSector.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{zoomedSector.source}</p>
              </div>
              <button onClick={() => setZoomedSector(null)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-auto max-h-[75vh] bg-black" style={{ touchAction: 'pinch-zoom' }}>
              <img
                src={zoomedSector.zoom}
                alt={`${zoomedSector.name} Gurugram — full resolution official approved layout map, source: ${zoomedSector.source}`}
                className="w-full h-auto cursor-zoom-in"
                onClick={e => {
                  const img = e.currentTarget;
                  img.style.maxWidth = img.style.maxWidth === 'none' ? '100%' : 'none';
                }}
              />
            </div>
            <p className="text-center text-xs text-gray-500 py-2 border-t border-white/10">Click the image to zoom in / out</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <p className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Sector Intelligence</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-6">Gurugram Sector Maps</h1>
        <p className="text-gray-400 text-lg max-w-2xl mb-4 leading-relaxed">
          Official DTCP and HSVP approved layout maps for the Gurugram micro-markets where LSR Realty has active projects and inventory — including Golf Course Road, MG Road, Sohna Road, DLF Phase 2/Cybercity and Sectors 58 through 103.
        </p>
        <p className="text-gray-500 text-sm max-w-2xl mb-16 leading-relaxed">
          Source: Town &amp; Country Planning Department, Haryana (tcpharyana.gov.in) and Haryana Shehri Vikas Pradhikaran (hsvphry.org.in) — official, government-approved layout and sectoral plans.
        </p>

        <section aria-label="Gurugram sector and location maps" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {SECTOR_MAPS.map(sector => (
            <article key={sector.id} className="border border-white/10 hover:border-lsr-gold/40 transition-all duration-300 flex flex-col">
              <button
                type="button"
                aria-label={`View full ${sector.name} layout map`}
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => setZoomedSector({ name: sector.name, zoom: sector.zoom, source: sector.source })}
              >
                <img
                  src={sector.thumb}
                  alt={`${sector.name} Gurugram — official approved layout map`}
                  title={`${sector.name} approved layout map`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={1000}
                  height={496}
                />
              </button>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-lg font-serif text-white mb-2">{sector.name}</h2>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-6">{sector.description}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setZoomedSector({ name: sector.name, zoom: sector.zoom, source: sector.source })}
                    className="flex-1 border border-lsr-gold gold-gradient-text px-4 py-2 text-xs uppercase tracking-widest font-bold hover:border-white transition-colors"
                  >
                    View Sector Map
                  </button>
                  <button
                    onClick={() => setInventorySector(sector.name)}
                    className="flex-1 bg-lsr-gold text-black px-4 py-2 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
                  >
                    View Inventory
                  </button>
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
