import React from 'react';
import { Award, Briefcase, BookOpen } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-black text-white pt-32 md:pt-40">
      {/* Header */}
      <section className="py-20 bg-lsr-charcoal border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h4 className="text-lsr-gold uppercase tracking-[0.2em] text-sm mb-4">Who We Are</h4>
          <h1 className="text-5xl font-serif mb-8">Bridging Institutional Expertise & Individual Investment</h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            LSR Realty is the investment advisory arm of LSR Group. We are built on the belief that Indian real estate 
            deserves a structured, research-backed, and transparent approach.
          </p>
        </div>
      </section>

      {/* Founder / Story */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
           <img 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop" 
            alt="Office meeting" 
            className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-serif mb-6">The LSR Story</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Beginning with bespoke builder-floor development in 2020, LSR Group quickly recognized a gap in the market: 
            High Net Worth Individuals lacked the data-driven advisory services available to institutional investors.
          </p>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Founded by an Ivy League alumni with deep operational experience at Hines (New York), LSR Realty brings global best practices 
            to the Gurgaon micro-market.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
               <div className="bg-lsr-charcoal p-3 rounded-none border border-white/10">
                 <BookOpen className="text-lsr-gold w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-white font-serif text-lg">Cornell University</h4>
                 <p className="text-sm text-gray-500">Master's in Real Estate - Anchoring our analytical approach.</p>
               </div>
            </div>
            <div className="flex items-start space-x-4">
               <div className="bg-lsr-charcoal p-3 rounded-none border border-white/10">
                 <Briefcase className="text-lsr-gold w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-white font-serif text-lg">Hines Experience</h4>
                 <p className="text-sm text-gray-500">Trained at one of the world's top real estate investment managers.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Guidance */}
      <section className="py-24 bg-lsr-charcoal">
        <div className="max-w-5xl mx-auto px-6 text-center">
           <Award className="w-16 h-16 text-lsr-gold mx-auto mb-8" />
           <h2 className="text-3xl font-serif mb-6">Strategic Guidance</h2>
           <blockquote className="text-xl md:text-2xl font-light text-gray-300 italic mb-8">
             "Guided by the wisdom of 40+ years in real estate leadership."
           </blockquote>
           <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
             The company is strategically guided by <strong>Mr. Devinder Singh</strong>, CEO & MD of DLF Ltd. 
             With over 40 years of leadership, he has been instrumental in Gurgaon's early growth—contributing to critical infrastructure including roads, metro developments, and landscaping. His legacy provides the moral and strategic compass for our fiduciary standards.
           </p>
        </div>
      </section>
      
       {/* Values */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-white/10 hover:border-lsr-gold transition-colors">
              <h3 className="text-xl font-serif text-white mb-4">Transparency</h3>
              <p className="text-gray-400 text-sm">No hidden agendas. We present the risks as clearly as the returns.</p>
            </div>
            <div className="p-8 border border-white/10 hover:border-lsr-gold transition-colors">
              <h3 className="text-xl font-serif text-white mb-4">Analytics</h3>
              <p className="text-gray-400 text-sm">We don't follow the herd. We follow the data, demographics, and infrastructure.</p>
            </div>
            <div className="p-8 border border-white/10 hover:border-lsr-gold transition-colors">
              <h3 className="text-xl font-serif text-white mb-4">Long Term</h3>
              <p className="text-gray-400 text-sm">We build relationships measured in decades, not transactions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
