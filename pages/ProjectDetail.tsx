import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { Check, Download, MapPin, Share2 } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const found = PROJECTS.find(p => p.id === id);
    if (found) {
      setProject(found);
    } else {
      navigate('/projects');
    }
  }, [id, navigate]);

  if (!project) return null;

  return (
    <div className="bg-black text-white pt-20">
      {/* Hero */}
      <div className="relative h-[60vh] md:h-[80vh]">
        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <span className="bg-lsr-gold text-black px-4 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block">
              {project.status}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">{project.name}</h1>
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="text-lsr-gold" />
              <span className="text-lg">{project.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Overview */}
          <section>
            <h3 className="text-2xl font-serif text-lsr-gold mb-6 border-b border-white/10 pb-4">Investment Thesis</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {project.description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {project.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <Check size={20} className="text-lsr-gold shrink-0 mt-1" />
                  <span className="text-gray-400">{highlight}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Unit Mix Table */}
          <section>
            <h3 className="text-2xl font-serif text-lsr-gold mb-6 border-b border-white/10 pb-4">Configuration & Pricing</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-4 text-gray-400 font-normal uppercase text-sm tracking-wider">Type</th>
                    <th className="py-4 text-gray-400 font-normal uppercase text-sm tracking-wider">Size</th>
                    <th className="py-4 text-gray-400 font-normal uppercase text-sm tracking-wider">Price Estimate</th>
                  </tr>
                </thead>
                <tbody>
                  {project.unitMix.map((unit, idx) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 font-medium">{unit.type}</td>
                      <td className="py-4 text-gray-400">{unit.size}</td>
                      <td className="py-4 text-lsr-gold">{unit.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h3 className="text-2xl font-serif text-lsr-gold mb-6 border-b border-white/10 pb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {project.amenities.map((amenity, idx) => (
                <div key={idx} className="p-4 bg-lsr-charcoal text-center border border-white/5">
                  <span className="text-sm text-gray-300">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

           {/* Location */}
           <section>
            <h3 className="text-2xl font-serif text-lsr-gold mb-6 border-b border-white/10 pb-4">Location Advantage</h3>
             <ul className="space-y-3">
              {project.locationAdvantage.map((loc, idx) => (
                 <li key={idx} className="flex items-center space-x-3 text-gray-400">
                    <div className="w-1.5 h-1.5 bg-lsr-gold rounded-full" />
                    <span>{loc}</span>
                 </li>
              ))}
             </ul>
          </section>

        </div>

        {/* Sidebar Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-lsr-charcoal p-8 border border-white/10">
            <h3 className="text-xl font-serif text-white mb-2">Request Priority Access</h3>
            <p className="text-sm text-gray-400 mb-6">Get the brochure, floor plans, and latest payment plans.</p>
            
            <form className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-lsr-gold" />
              <input type="email" placeholder="Email Address" className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-lsr-gold" />
              <input type="tel" placeholder="Phone Number" className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-lsr-gold" />
              <textarea placeholder="Message / Specific Requirements" rows={3} className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-lsr-gold"></textarea>
              <button className="w-full bg-lsr-gold text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors">
                Submit Inquiry
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col space-y-4">
              <button className="flex items-center justify-center space-x-2 w-full border border-white/20 py-3 text-sm text-gray-300 hover:text-white hover:border-white transition-colors">
                <Download size={16} />
                <span>Download Brochure</span>
              </button>
               <a 
                href="https://wa.me/919810000000" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 w-full border border-[#25D366] text-[#25D366] py-3 text-sm hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;