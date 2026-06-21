import React, { useState } from 'react';
import { SECTOR_MAPS } from '../constants';
import BrochureModal from '../components/BrochureModal';
import { X } from 'lucide-react';

const Maps: React.FC = () => {
  const [inventorySector, setInventorySector] = useState<string | null>(null);
  const [zoomedSector, setZoomedSector] = useState<{ name: string; zoom: string; source: string } | null>(null);

  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
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
                alt={zoomedSector.name}
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
        <h4 className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Sector Intelligence</h4>
        <h1 className="text-4xl md:text-5xl font-serif mb-6">Gurugram Sector Maps</h1>
        <p className="text-gray-400 text-lg max-w-2xl mb-4 leading-relaxed">
          Official DTCP/HUDA approved layout maps for the Gurugram micro-markets where LSR Realty has active projects and inventory.
        </p>
        <p className="text-gray-500 text-sm max-w-2xl mb-16 leading-relaxed">
          Source: Town &amp; Country Planning Department, Haryana (tcpharyana.gov.in) — official, government-approved Sectoral Plans.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {SECTOR_MAPS.map(sector => (
            <div key={sector.id} className="border border-white/10 hover:border-lsr-gold/40 transition-all duration-300 flex flex-col">
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => setZoomedSector({ name: sector.name, zoom: sector.zoom, source: sector.source })}
              >
                <img src={sector.thumb} alt={sector.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-serif text-white mb-2">{sector.name}</h3>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Maps;
