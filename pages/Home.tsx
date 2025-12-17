import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS } from '../constants';
import ProjectCard from '../components/ProjectCard';
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { ArrowRight, Shield, Globe, TrendingUp, UserCheck, Handshake, Award } from 'lucide-react';

const mockChartData = [
  { name: '2020', ggn: 100, blr: 80 },
  { name: '2021', ggn: 120, blr: 95 },
  { name: '2022', ggn: 150, blr: 110 },
  { name: '2023', ggn: 185, blr: 125 },
  { name: '2024', ggn: 210, blr: 140 },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Skyline" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-lsr-gold text-sm md:text-base uppercase tracking-[0.4em] mb-6 animate-fade-in-up">
            Institutional Real Estate Advisory
          </h2>
          <h1 className="text-4xl md:text-7xl font-serif font-medium leading-tight mb-8">
            Gurgaon’s Premier <br />
            <span className="text-white">Investment Advisory</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
            Data-driven. Transparent. Institutional-quality. <br/>
            Strategically guided by industry leadership.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
            <button 
              onClick={() => navigate('/projects')}
              className="bg-lsr-gold text-black px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-white transition-colors min-w-[200px]"
            >
              View Projects
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="border border-white text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-white hover:text-black transition-colors min-w-[200px]"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </section>

      {/* The Edge / Stats - Brief Overview */}
      <section className="py-16 bg-lsr-charcoal border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-4">
              <div className="text-lsr-gold mb-4"><Globe size={32} /></div>
              <h3 className="text-xl font-serif text-white mb-2">Cornell & Hines</h3>
              <p className="text-sm text-gray-400">Global education and institutional training applied to local markets.</p>
            </div>
            <div className="p-4">
              <div className="text-lsr-gold mb-4"><TrendingUp size={32} /></div>
              <h3 className="text-xl font-serif text-white mb-2">Research First</h3>
              <p className="text-sm text-gray-400">Every recommendation is backed by micro-market analytics and ROI projections.</p>
            </div>
            <div className="p-4">
              <div className="text-lsr-gold mb-4"><Shield size={32} /></div>
              <h3 className="text-xl font-serif text-white mb-2">Fiduciary Standard</h3>
              <p className="text-sm text-gray-400">We advise, not sell. Transparent deal structuring and due diligence.</p>
            </div>
            <div className="p-4">
              <div className="text-lsr-gold mb-4"><UserCheck size={32} /></div>
              <h3 className="text-xl font-serif text-white mb-2">Industry Guidance</h3>
              <p className="text-sm text-gray-400">Mentored by Mr. Devinder Singh (CEO, DLF Ltd) with 40+ years experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart - Detailed Buyer Focus */}
      <section className="py-24 bg-black border-b border-white/5 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lsr-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h4 className="text-lsr-gold uppercase tracking-[0.2em] text-sm mb-4">The LSR Difference</h4>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">What Sets Us Apart?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              At LSR Realty, what truly sets us apart is trust, transparency, and deep-rooted credibility. 
              We aren't just brokers; we are genuine advisors ensuring you buy into the safest and strongest projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* 1. Transparency */}
            <div className="bg-lsr-charcoal p-8 border border-white/10 hover:border-lsr-gold/60 transition-all duration-500 group flex flex-col">
              <div className="mb-6">
                <Shield className="w-10 h-10 text-lsr-gold mb-4" />
                <h3 className="text-2xl font-serif text-white group-hover:text-lsr-gold transition-colors">Genuine Advising</h3>
                <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Not Salesmanship</p>
              </div>
              <div className="flex-grow space-y-4 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-6">
                 <p>Clients value honesty. We give clear, unbiased advice, even if it means suggesting <strong>not</strong> to buy something.</p>
                 <p>Our consultative approach focuses on understanding risks, returns, and providing absolute clarity on project approvals.</p>
                 <p className="italic text-gray-500">"Buyers trust us because they feel fully informed — not sold to."</p>
              </div>
            </div>

            {/* 2. Relationships */}
            <div className="bg-lsr-charcoal p-8 border border-white/10 hover:border-lsr-gold/60 transition-all duration-500 group flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Handshake size={150} className="text-white" />
               </div>
              <div className="mb-6 relative z-10">
                <Handshake className="w-10 h-10 text-lsr-gold mb-4" />
                <h3 className="text-2xl font-serif text-white group-hover:text-lsr-gold transition-colors">Developer Access</h3>
                <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">40+ Years of Legacy</p>
              </div>
              <div className="flex-grow space-y-4 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-6 relative z-10">
                 <p>Developers know our strategic mentor, <strong>Mr. Devinder Singh</strong>, who literally contributed to Gurgaon’s early growth—including roads, metro work, and landscaping.</p>
                 <p>Because of these relationships, our clients receive priority inventory access, better pricing leverage, and direct escalation support.</p>
              </div>
            </div>

            {/* 3. Institutional Trust */}
            <div className="bg-lsr-charcoal p-8 border border-white/10 hover:border-lsr-gold/60 transition-all duration-500 group flex flex-col">
              <div className="mb-6">
                <Award className="w-10 h-10 text-lsr-gold mb-4" />
                <h3 className="text-2xl font-serif text-white group-hover:text-lsr-gold transition-colors">Institutional Trust</h3>
                <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Global & Local</p>
              </div>
              <div className="flex-grow space-y-4 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-6">
                 <p>We combine 40+ years of family credibility with Ivy League education (Cornell) and institutional experience (Hines, NY).</p>
                 <p>Our clients receive the best of both worlds: local relationships they can trust, and global analytical expertise they can rely on.</p>
                 <p className="italic text-gray-500">"Guided by someone highly educated AND deeply connected."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Curated Opportunities</h2>
              <p className="text-gray-400">High-conviction residential assets in Gurgaon's prime sectors.</p>
            </div>
            <button onClick={() => navigate('/projects')} className="hidden md:flex items-center space-x-2 text-lsr-gold hover:text-white transition-colors uppercase text-sm tracking-widest">
              <span>View All</span> <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {PROJECTS.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Methodology & Data */}
      <section className="py-24 bg-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h4 className="text-lsr-gold uppercase tracking-[0.2em] text-sm mb-4">Our Methodology</h4>
            <h2 className="text-3xl md:text-4xl font-serif mb-6 leading-tight">Data-Driven Decision Making</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Unlike traditional brokers, we approach real estate with an investment banking mindset. 
              We track micro-market trends, infrastructure developments, and rental yields to forecast 
              capital appreciation with higher accuracy.
            </p>
            <ul className="space-y-4 mb-8">
              {['Proprietary Algo-based Valuation', 'Risk-Adjusted Return Analysis', 'Exit Strategy Planning'].map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-white">
                  <div className="w-1.5 h-1.5 bg-lsr-gold rounded-full" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/services')} className="border-b border-lsr-gold text-lsr-gold pb-1 hover:text-white hover:border-white transition-colors">
              Explore Our Advisory Process
            </button>
          </div>
          
          <div className="bg-black p-8 border border-white/5 rounded-sm relative">
            <h3 className="text-lg font-serif mb-6 text-gray-200">Gurgaon Capital Appreciation Index (Rebased)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <XAxis dataKey="name" stroke="#555" tick={{fill: '#888'}} />
                  <YAxis stroke="#555" tick={{fill: '#888'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="ggn" stroke="#C6A667" strokeWidth={2} dot={{fill: '#C6A667'}} />
                  <Line type="monotone" dataKey="blr" stroke="#333" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">*Illustrative data representing market outperformance</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black relative">
        <div className="absolute inset-0 bg-lsr-gold/5" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-serif text-white mb-6">Invest with Confidence</h2>
          <p className="text-xl text-gray-400 mb-10 font-light">
            Leverage our institutional expertise to build a high-performing real estate portfolio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a 
              href="https://wa.me/919810000000" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
            >
              WhatsApp Now
            </a>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-lsr-gold text-black px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-white transition-colors"
            >
              Schedule 15-Min Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;