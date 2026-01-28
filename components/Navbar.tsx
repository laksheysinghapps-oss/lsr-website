import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-lsr-black/90 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <div onClick={() => handleNavClick('/')} className="cursor-pointer group">
          <img
  src="/images/Logo.png"
  alt="LSR Realty"
  className="h-[100px] md:h-[150px] w-auto transition-all duration-300"
/>

        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm uppercase tracking-widest hover:text-lsr-gold transition-colors ${isActive ? 'text-lsr-gold font-medium' : 'text-gray-300'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button onClick={() => handleNavClick('/contact')} className="border border-lsr-gold text-lsr-gold px-6 py-2 text-sm uppercase tracking-wider hover:bg-lsr-gold hover:text-black transition-all duration-300">
            Book Consult
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-lsr-charcoal border-t border-white/10 shadow-2xl">
          <div className="flex flex-col py-8 px-6 space-y-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-serif tracking-wide ${isActive ? 'text-lsr-gold' : 'text-white'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
             <button onClick={() => handleNavClick('/contact')} className="bg-lsr-gold text-black w-full py-3 uppercase tracking-widest font-medium">
              Book Consultation
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
