import React from 'react';
import { INSIGHTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';

const Insights: React.FC = () => {
  return (
    <div className="bg-black text-white pt-24 min-h-screen">
      <section className="py-16 bg-lsr-charcoal border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">LSR Insights</h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Market reports, infrastructure analysis, and investment guides for the Gurgaon real estate market.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INSIGHTS.map((insight) => (
            <div key={insight.id} className="group cursor-pointer">
              <div className="overflow-hidden mb-6 h-64 border border-white/10">
                <img src={insight.image} alt={insight.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex items-center space-x-4 mb-4">
                 <span className="text-lsr-gold text-xs uppercase tracking-widest">{insight.category}</span>
                 <span className="text-gray-600 text-xs">|</span>
                 <span className="text-gray-500 text-xs">{insight.date}</span>
              </div>
              <h3 className="text-2xl font-serif mb-3 group-hover:text-lsr-gold transition-colors">{insight.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{insight.summary}</p>
              <button className="flex items-center space-x-2 text-xs uppercase tracking-widest text-white group-hover:text-lsr-gold">
                <span>Read Report</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Insights;