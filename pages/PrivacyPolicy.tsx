import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <section className="py-20 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-center">Privacy Policy</h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <p>
            Privacy Policy is a legal document that stipulates the ways LSR Realty collects the data of the party, 
            discloses how and why their information will be used along with who has the access to it.
          </p>

          <p>
            This Privacy Policy provides you with particulars about the ways in which the data of the Visitor is 
            collected, stored & used by our website. You are advised to read this Privacy Policy carefully. By 
            visiting our website, you expressly give us consent to use & disclose your personal information in 
            accordance with this Privacy Policy. If you do not agree to the terms of the Policy, please do not 
            use or access our website.
          </p>

          <p>
            This Privacy Statement applies to LSR Realty website. Please note that our site may contain links to 
            other sites. LSR Realty is not responsible for the privacy practices, privacy statements, or content 
            regarding these other sites.
          </p>

          <div className="pt-8">
            <h2 className="text-2xl font-serif text-lsr-gold mb-4">Information Collection</h2>
            <p>
              When you voluntarily send us electronic mail, we will keep a record of this information so that we 
              can respond to you. We only collect information from you when you register on our site or fill out a 
              form. Also, when filling out a form on our site, you may be asked to enter your: name, e-mail address 
              or phone number. You may, however, visit our site anonymously.
            </p>
            <p className="mt-4 text-gray-400">
              In case you have submitted your personal information and contact details, we reserve the rights to 
              Call, SMS, Email or WhatsApp about our products and offers, even if your number has DND activated on it.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="text-2xl font-serif text-lsr-gold mb-4">Personal Information</h2>
            <p>
              We at LSR Realty respect the online privacy of the visitor and recognise the need for an appropriate 
              protection of any personal information you share with us. We do not collect any personal information 
              from a visitor to our site unless that visitor explicitly and intentionally provides it. Under no 
              circumstances do we collect any personal data revealing racial or ethnic origin, political opinions, 
              religious or philosophical beliefs, trade union membership, health, or sex life.
            </p>
            <p className="mt-4">
              If you are simply browsing our site, we do not gather any personal information about you. LSR Realty 
              does not disclose the personal data of the visitor for any secondary purposes.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="text-2xl font-serif text-lsr-gold mb-4">Statistical Information</h2>
            <p>
              When you visit our site, our computers may automatically collect statistics about your visit. This 
              information does not identify you personally, but rather about a visit to our site. We may monitor 
              statistics such as how many people visit our site, the user's IP address, which pages people visit, 
              from which domains our visitors come and which browsers people use. We use these statistics about your 
              visit for aggregation purposes only. These statistics are used to help us improve the performance of 
              our website.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="text-2xl font-serif text-lsr-gold mb-4">Communication & Updates</h2>
            <p>
              We generally respond to any E-mail questions, requests for product or service information, and other 
              inquiries that we receive. We may also retain this correspondence to improve our products, services, 
              and website, and for other disclosed purposes. Frequently we retain contact information for 
              communication to enable us to send individuals updates or other important information about our 
              services and products.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="text-2xl font-serif text-lsr-gold mb-4">Consent</h2>
            <p>
              By visiting our website, you consent to our Privacy Policy including but not limited to your consent 
              for sharing your information as per this Privacy Policy. This Policy may change from time to time.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="text-2xl font-serif text-lsr-gold mb-4">Changes to Privacy Policy</h2>
            <p>
              You may access a current version of the Privacy Policy from the LSR Realty website. We may update our 
              Privacy Policy from time to time. You are advised to review this Privacy Policy periodically for any 
              changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>

          <div className="pt-8 pb-12 border-t border-white/10 mt-12">
            <h2 className="text-2xl font-serif text-lsr-gold mb-4">Contact Us</h2>
            <p>
              If you have any query, requests or grievance with regard to this Privacy Policy, please contact us at{' '}
              <a href="tel:+918448660818" className="text-lsr-gold hover:text-white transition-colors">
                +91 844 866 0818
              </a>{' '}
              or email us at{' '}
              <a href="mailto:marketing@lsrrealty.com" className="text-lsr-gold hover:text-white transition-colors">
                marketing@lsrrealty.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
