import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import BrochureModal from '../components/BrochureModal';
import SEO from '../components/SEO';

const FAQS = [{q:"What services does LSR Realty offer in Gurgaon?",a:"LSR Realty provides institutional-grade real estate advisory in Gurgaon, including residential and commercial investment advisory, office and retail leasing, market research, deal structuring, portfolio structuring, and a dedicated NRI investment desk."},{q:"Does LSR Realty help NRIs invest in Gurgaon property?",a:"Yes. Our NRI Investment Desk supports Non Resident Indians with property selection, Power of Attorney assistance, tax and repatriation advisory, and tenant management and resale, so you can invest in Gurgaon real estate remotely with confidence."},{q:"Which areas of Gurgaon does LSR Realty cover?",a:"We advise on property across Gurugram, including the DLF phases, Golf Course Road, Golf Course Extension Road, Dwarka Expressway, Sohna Road, Southern Peripheral Road and the newer sectors, as well as the wider Delhi NCR market."},{q:"How does LSR Realty select projects for investors?",a:"Every project is vetted against the Gurgaon Manesar Master Plan 2031, RERA registration, developer track record, construction quality, legal compliance and long-term capital appreciation potential before we recommend it."},{q:"How do I get started with LSR Realty?",a:"Book a consultation through our contact page or call +91 8448660019. Our advisory team will understand your investment goals and walk you through the most suitable opportunities in Gurgaon."}]; const serviceNames = ["Residential Investment Advisory","Commercial Investment Advisory","Office Leasing","Retail Leasing","Market Research and Intelligence","Deal Structuring","Portfolio Structuring","NRI Investment Services"]; const structuredData = [{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://lsrrealty.com/"},{"@type":"ListItem","position":2,"name":"Services","item":"https://lsrrealty.com/services"}]},{"@context":"https://schema.org","@type":"ItemList","name":"Real Estate Advisory Services in Gurgaon","itemListElement":serviceNames.map((name,i)=>({"@type":"ListItem","position":i+1,"item":{"@type":"Service","name":name,"serviceType":"Real estate advisory","areaServed":{"@type":"City","name":"Gurugram"},"provider":{"@type":"RealEstateAgent","name":"LSR Realty","url":"https://lsrrealty.com/"}}}))},{"@context":"https://schema.org","@type":"FAQPage","mainEntity":FAQS.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))}]; const Services: React.FC = () => {
  const navigate = useNavigate();
  const [showNRIModal, setShowNRIModal] = useState(false);

  return (
    <div className="bg-black text-white pt-32 md:pt-40">
      <SEO
        title="Real Estate Consultants & Advisory Services in Gurgaon | LSR Realty"
        description="LSR Realty is a real estate consulting company in Gurgaon offering office leasing, retail leasing, investment advisory, market research, deal structuring and NRI services."
        keywords="real estate advisory services Gurgaon, office leasing Gurgaon, retail leasing Gurgaon, NRI investment services, deal structuring Gurgaon, real estate market research Gurgaon"
        path="/services" structuredData={structuredData}
      />
      {showNRIModal && (
        <BrochureModal
          projectName="NRI Investment Desk"
          onClose={() => setShowNRIModal(false)}
          title="Contact NRI Desk"
          subtitle="Share your details and our NRI specialist will reach out to assist you with your Indian real estate assets."
          source="NRI Desk Enquiry"
          successMessage="Our NRI specialist will be in touch with you shortly."
          buttonLabel="Submit Enquiry"
        />
      )}
      <section className="py-20 bg-lsr-charcoal border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h4 className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Our Expertise</h4>
          <h1 className="text-5xl font-serif mb-6">Real Estate Advisory Services in Gurgaon</h1>
          <p className="text-xl text-gray-400 font-light">
            We support HNIs, NRIs, and Family Offices throughout the entire real estate investment lifecycle.
          </p>
        </div>
      </section>
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {SERVICES.map((service, idx) => (
            <div
              key={idx}
              onClick={service.link ? () => navigate(service.link!) : undefined}
              className={`p-10 border border-white/10 hover:border-lsr-gold group transition-all duration-300 bg-lsr-charcoal/50 ${service.link ? 'cursor-pointer' : ''}`}
            >
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
      <section className="py-24 bg-lsr-charcoal border-t border-white/10">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">NRI Investment Desk</h2>
               <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                 Managing Indian assets remotely is complex. We provide a seamless, high touch service for Non Resident Indians looking to capitalize on Gurgaon's growth story.</p>
               <ul className="space-y-4 mb-8 text-gray-300 font-medium">
                 <li>• Power of Attorney (POA) Assistance</li>
                 <li>• Tax Repatriation Advisory</li>
                 <li>• Tenant Management & Resale</li>
               </ul>
               <button onClick={() => setShowNRIModal(true)} className="bg-lsr-gold text-black px-8 py-3 uppercase tracking-widest text-sm font-bold hover:opacity-90 transition-opacity">
                 Contact NRI Desk
               </button>
            </div>
            <div>
               <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop" alt="Global Connectivity" className="w-full h-auto grayscale" />

            </div>
         </div>
      </section>
      <section className="py-24 max-w-4xl mx-auto px-6"><h2 className="text-3xl md:text-4xl font-serif text-white mb-10">Frequently Asked Questions</h2><div className="space-y-8">{FAQS.map(f => (<div key={f.q} className="border-b border-white/10 pb-6"><h3 className="text-lg font-bold text-white mb-2">{f.q}</h3><p className="text-gray-400 leading-relaxed">{f.a}</p></div>))}</div></section>
    </div>
  );
};
export default Services;
