import React from 'react';
import { COMPANY_DETAILS } from '../constants';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-black text-white pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-8">Get In Touch</h1>
          <p className="text-gray-400 text-lg mb-12">
            Schedule a 15-minute consultation with our senior advisors to discuss your portfolio requirements.
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="text-lsr-gold w-6 h-6 mt-1" />
              <div>
                <h3 className="text-lg font-serif text-white">Office</h3>
                <p className="text-gray-400">{COMPANY_DETAILS.address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="text-lsr-gold w-6 h-6 mt-1" />
              <div>
                <h3 className="text-lg font-serif text-white">Phone</h3>
                <p className="text-gray-400">{COMPANY_DETAILS.phone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="text-lsr-gold w-6 h-6 mt-1" />
              <div>
                <h3 className="text-lg font-serif text-white">Email</h3>
                <p className="text-gray-400">{COMPANY_DETAILS.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-lsr-charcoal border border-white/5">
            <h3 className="text-xl font-serif mb-4">Office Hours</h3>
            <div className="flex justify-between text-gray-400 text-sm mb-2">
              <span>Monday - Saturday</span>
              <span>10:00 AM - 7:00 PM</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Sunday</span>
              <span>By Appointment Only</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-neutral-900 p-8 md:p-12 border border-white/10">
          <h2 className="text-2xl font-serif mb-8">Send a Message</h2>
          <form className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-xs uppercase tracking-widest text-gray-500">First Name</label>
                 <input type="text" className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors" />
               </div>
               <div className="space-y-2">
                 <label className="text-xs uppercase tracking-widest text-gray-500">Last Name</label>
                 <input type="text" className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors" />
               </div>
             </div>
             <div className="space-y-2">
                 <label className="text-xs uppercase tracking-widest text-gray-500">Email Address</label>
                 <input type="email" className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors" />
             </div>
             <div className="space-y-2">
                 <label className="text-xs uppercase tracking-widest text-gray-500">Phone</label>
                 <input type="tel" className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors" />
             </div>
             <div className="space-y-2">
                 <label className="text-xs uppercase tracking-widest text-gray-500">Interest</label>
                 <select className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors">
                   <option>Investment Advisory</option>
                   <option>New Project Inquiry</option>
                   <option>NRI Services</option>
                   <option>Other</option>
                 </select>
             </div>
             <div className="space-y-2 pt-4">
                 <label className="text-xs uppercase tracking-widest text-gray-500">Message</label>
                 <textarea rows={4} className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors"></textarea>
             </div>
             <button className="w-full bg-lsr-gold text-black uppercase tracking-widest font-bold py-4 hover:bg-white transition-colors mt-4">
               Submit Request
             </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;