import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { Check, Download, MapPin, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/submitLead';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const found = PROJECTS.find(p => p.id === id);
    if (found) {
      setProject(found);
    } else {
      navigate('/projects');
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await submitLead({
      ...formData,
      project: project?.name || 'Unknown Project',
      source: `Project Page - ${project?.name}`
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } else {
      setSubmitStatus('error');
    }
  };

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

      {/* Key Metrics Bar */}
      <div className="bg-lsr-charcoal border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Price Range</p>
              <p className="text-lsr-gold font-semibold">{project.priceRange}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Size Range</p>
              <p className="text-white font-semibold">{project.sizeRange}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Possession</p>
              <p className="text-white font-semibold">{project.possessionDate}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Developer</p>
              <p className="text-white font-semibold">{project.developer}</p>
            </div>
            {project.landArea && (
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Land Area</p>
                <p className="text-white font-semibold">{project.landArea}</p>
              </div>
            )}
            {project.towers && (
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Towers</p>
                <p className="text-white font-semibold">{project.towers} Towers{project.floors ? ` | G+${project.floors}` : ''}</p>
              </div>
            )}
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

            {submitStatus === 'success' ? (
              <div className="bg-green-900/30 border border-green-500/50 p-6 text-center">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-400 font-semibold">Thank you!</p>
                <p className="text-gray-400 text-sm mt-1">We'll contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-lsr-gold"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-lsr-gold"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-lsr-gold"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Message / Specific Requirements"
                  rows={3}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-lsr-gold"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-lsr-gold text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Inquiry'
                  )}
                </button>
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col space-y-4">
              <button className="flex items-center justify-center space-x-2 w-full border border-white/20 py-3 text-sm text-gray-300 hover:text-white hover:border-white transition-colors">
                <Download size={16} />
                <span>Download Brochure</span>
              </button>
               <a
                href="https://wa.me/919999315702"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 w-full border border-[#25D366] text-[#25D366] py-3 text-sm hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {project.rera && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">RERA Registration</p>
                <p className="text-xs text-gray-400 font-mono">{project.rera}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
