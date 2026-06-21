import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SECTOR_MAPS, SectorMap } from '../constants';
import BrochureModal from '../components/BrochureModal';
import SEO from '../components/SEO';
import { ChevronLeft } from 'lucide-react';

const MapDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sector, setSector] = useState<SectorMap | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
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
  const pageTitle = isMasterPlan
    ? `${sector.name} (Gurugram Manesar Master Plan 2031) | LSR Realty`
    : `${sector.name} Map | Gurgaon Manesar Master Plan 2031 | LSR Realty`;
  const pageDescription = isMasterPlan
    ? `${sector.description} Also known as the Gurugram Manesar Master Plan 2031.`
    : `${sector.description} View the official, government approved layout map for ${sector.name}, part of the Gurgaon Manesar Master Plan 2031 (Gurugram Manesar Master Plan 2031).`;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lsrrealty.com/' },
        { '@type': 'ListItem', position: 2, name: 'Gurgaon Manesar Master Plan 2031 & Sector Maps', item: 'https://lsrrealty.com/maps' },
        { '@type': 'ListItem', position: 3, name: sector.name, item: `https://lsrrealty.com/maps/${sector.id}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: sector.name,
      description: sector.description,
      image: `https://lsrrealty.com${sector.zoom}`,
      url: `https://lsrrealty.com/maps/${sector.id}`,
      address: { '@type': 'PostalAddress', addressLocality: sector.name, addressRegion: 'Haryana', addressCountry: 'IN' },
    },
  ];

  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <SEO title={pageTitle} description={pageDescription} path={`/maps/${sector.id}`} structuredData={structuredData} />

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

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <Link to="/maps" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-lsr-gold transition-colors mb-8">
          <ChevronLeft size={16} /> Back to Gurgaon Manesar Master Plan 2031 & Sector Maps
        </Link>

        <p className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Sector Intelligence</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-6">{sector.name}</h1>
        <p className="text-gray-400 text-lg max-w-3xl mb-2 leading-relaxed">{sector.description}</p>
        <p className="text-gray-500 text-sm mb-10">Source: {sector.source}</p>

        <div className="border border-white/10 overflow-hidden">
          <div className="overflow-auto max-h-[75vh] bg-black" style={{ touchAction: 'pinch-zoom' }}>
            <img
              src={sector.zoom}
              alt={`${sector.name} Gurugram, full resolution official approved layout map, source: ${sector.source}`}
              className={isZoomed ? 'h-auto cursor-zoom-out' : 'w-full h-auto cursor-zoom-in'}
              style={{ width: isZoomed ? '220%' : '100%', maxWidth: 'none' }}
              onClick={() => setIsZoomed(z => !z)}
            />
          </div>
          <p className="text-center text-xs text-gray-500 py-2 border-t border-white/10">Click the image to zoom in / out</p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowInventoryModal(true)}
            className="flex-1 bg-lsr-gold text-black px-6 py-4 text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
          >
            View Inventory in {sector.name}
          </button>
          <Link
            to="/maps"
            className="flex-1 border border-lsr-gold gold-gradient-text px-6 py-4 text-sm uppercase tracking-widest font-bold hover:border-white transition-colors text-center"
          >
            View All Sector Maps
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MapDetail;
