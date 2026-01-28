import React, { useState } from 'react';
import { COMPANY_DETAILS } from '../constants';
import { MapPin, Phone, Mail, Check, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/submitLead';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: 'Investment Advisory',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      project: formData.interest,
      message: formData.message,
      source: 'Contact Page'
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        interest: 'Investment Advisory',
        message: ''
      });
    } else {
      setSubmitStatus('error');
    }
  };

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
                <a href={`tel:${COMPANY_DETAILS.phone.replace(/\s/g, '')}`} className="text-gray-400 hover:text-lsr-gold transition-colors">
                  {COMPANY_DETAILS.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="text-lsr-gold w-6 h-6 mt-1" />
              <div>
                <h3 className="text-lg font-serif text-white">Email</h3>
                <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-gray-400 hover:text-lsr-gold transition-colors">
                  {COMPANY_DETAILS.email}
                </a>
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

          <h2 className="text-2xl font-serif mb-1">I authorize LSR Realty and its representative to contact me with updates and notifications via Email, SMS, RCS, WhatsApp, and Call. This will override the registry on DND/NDNC. Privacy Policy</h2>
          {submitStatus === 'success' ? (
            <div className="bg-green-900/30 border border-green-500/50 p-8 text-center">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-green-400 font-semibold text-xl">Thank you!</p>
              <p className="text-gray-400 mt-2">We've received your message and will get back to you within 24 hours.</p>
              <button
                onClick={() => setSubmitStatus('idle')}
                className="mt-6 text-lsr-gold hover:text-white transition-colors text-sm uppercase tracking-widest"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Interest</label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors"
                >
                  <option>Investment Advisory</option>
                  <option>New Project Inquiry</option>
                  <option>NRI Services</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2 pt-4">
                <label className="text-xs uppercase tracking-widest text-gray-500">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-lsr-gold transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-lsr-gold text-black uppercase tracking-widest font-bold py-4 hover:bg-white transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
              {submitStatus === 'error' && (
                <p className="text-red-400 text-sm text-center">Something went wrong. Please try again or contact us directly.</p>
              )}
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;
