import React from 'react';

const Careers: React.FC = () => {
  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h4 className="text-lsr-gold uppercase tracking-[0.2em] text-sm mb-4">Join The Team</h4>
          <h1 className="text-5xl font-serif mb-6">Build a Career in Institutional Real Estate</h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Work alongside leadership from Cornell University and Hines. We are looking for analytical, driven professionals who want to move beyond traditional brokerage into true investment advisory.
          </p>
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-serif text-white">Why Join LSR?</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Mentorship from industry veterans</li>
              <li>• Access to high-quality HNI inventory</li>
              <li>• Professional, corporate culture</li>
              <li>• Competitive compensation structures</li>
            </ul>
          </div>
          <a 
            href="https://www.linkedin.com/company/lsr-realty/jobs/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-lsr-gold text-black px-8 py-4 uppercase tracking-widest font-bold text-sm hover:bg-white transition-colors"
          >
            View Open Positions
          </a>
        </div>
        <div className="relative border border-white/10 p-4">
           <div className="absolute top-0 left-0 w-full h-full border border-lsr-gold/20 transform translate-x-4 translate-y-4 -z-10"></div>
           <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" alt="Team" className="w-full h-auto grayscale" />
        </div>
      </section>
    </div>
  );
};

export default Careers;
