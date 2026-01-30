import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-lsr-charcoal pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="space-y-6">
          <div>
            <img
              src="/images/Logo2.png"
              alt="LSR Realty"
              className="h-auto w-48"
            />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Gurgaon's most trusted, data-driven real estate investment advisor. 
            Bridging the gap between institutional expertise and individual investors.
          </p>
          <div className="flex space-x-4">
            <Linkedin className="w-5 h-5 text-gray-400 hover:text-lsr-gold cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 text-gray-400 hover:text-lsr-gold cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 text-gray-400 hover:text-lsr-gold cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-serif text-lg mb-6">Explore</h3>
          <ul className="space-y-4">
            {NAV_ITEMS.map(item => (
              <li key={item.path}>
                <NavLink to={item.path} className="text-gray-400 hover:text-lsr-gold text-sm transition-colors">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-serif text-lg mb-6">Expertise</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>Investment Advisory</li>
            <li>Portfolio Structuring</li>
            <li>Market Intelligence</li>
            <li>NRI Services</li>
            <li>Resale Advisory</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-serif text-lg mb-6">Contact</h3>
          <ul className="space-y-6 text-sm text-gray-400">
            <li className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-lsr-gold shrink-0" />
              <span>911, Magnum Global Towers, Gurgaon, India</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-lsr-gold shrink-0" />
              <span>+918448660818</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-lsr-gold shrink-0" />
              <span>marketing@lsrrealty.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} LSR Realty. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Disclaimer</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
