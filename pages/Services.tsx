import React from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <div className="bg-black text-white pt-32 md:pt-40">
      <section className="py-20 bg-lsr-charcoal border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h4 className="text-lsr-gold uppercase tracking-[0.2em] text-sm mb-4">Our Expertise</h4>
          <h1 className="text-5xl font-serif mb-6">Comprehensive Advisory Services</h1>
          <p className="text-xl text-gray-400 font-light">
            We support HNIs, NRIs, and Family Offices throughout the entire real estate investment lifecycle.
          </p>
        </div>
      </section>
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {SERVICES.map((service, idx) => (
            <div key={idx} className="p-10 border border-white/10 hover:border-lsr-gold group transition-all duration-300 bg-lsr-charcoal/50">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <h3 className="text-2xl font-serif text-white mb-4">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
              <ul className="text-sm text-gray-500 space-y-2">
                 <li className="flex items-center space-x-2">
                   <div className="w-1 h-1 bg-lsr-gold rounded-full"></div>
                   <span>Strategic Planning</span>
                 </li>
                 <li className="flex items-center space-x-2">
                   <div className="w-1 h-1 bg-lsr-gold rounded-full"></div>
                   <span>Execution & Management</span>
                 </li>
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 bg-white text-black">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-3xl md:text-5xl font-serif mb-6">NRI Investment Desk</h2>
               <p className="text-gray-800 text-lg mb-8 leading-relaxed">
                 Managing Indian assets remotely is complex. We provide a seamless, high-touch service for Non-Resident Indians looking to capitalize on Gurgaon's growth story.
               </p>
               <ul className="space-y-4 mb-8 font-medium">
                 <li>• Power of Attorney (POA) Assistance</li>
                 <li>• Tax Repatriation Advisory</li>
                 <li>• Tenant Management & Resale</li>
               </ul>
               <button className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-lsr-gold hover:text-black transition-colors">
                 Contact NRI Desk
               </button>
            </div>
            <div>
               <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop" alt="Global Connectivity" className="w-full h-auto grayscale" />
            </div>
         </div>
      </section>
    </div>
  );
};

export default Services;
