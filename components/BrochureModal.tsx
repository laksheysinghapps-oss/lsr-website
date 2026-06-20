import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/submitLead';

interface BrochureModalProps {
  projectName: string;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  source?: string;
  successMessage?: string;
  buttonLabel?: string;
}

const BrochureModal: React.FC<BrochureModalProps> = ({
  projectName,
  onClose,
  title = 'Download Brochure',
  subtitle = 'Share your details and we\'ll send the brochure directly to you.',
  source,
  successMessage = 'Our team will share the brochure with you shortly.',
  buttonLabel = 'Request Brochure',
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitLead({
      ...formData,
      project: projectName,
      source: source ?? `Brochure Request - ${projectName}`,
      message: source ? 'Requested pricing details' : 'Requested brochure download',
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-lsr-charcoal border border-white/10 max-w-md w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <h3 className="text-xl font-serif text-white">{title}</h3>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{projectName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-900/30 border border-green-500/40 flex items-center justify-center mb-4">
                <Check className="text-green-400 w-7 h-7" />
              </div>
              <p className="text-white font-semibold mb-1">Request Received!</p>
              <p className="text-gray-400 text-sm">{successMessage}</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 border border-white/20 text-sm text-gray-300 hover:border-white hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6">{subtitle}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600"
                />
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="consent-brochure"
                    required
                    className="mt-1 w-4 h-4 accent-lsr-gold cursor-pointer shrink-0"
                  />
                  <label htmlFor="consent-brochure" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                    I authorize LSR Realty and its representative to contact me with updates and notifications via Email, SMS, RCS, WhatsApp, and Call. This will override the registry on DND/NDNC.
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-lsr-gold text-black font-bold uppercase tracking-widest py-4 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    buttonLabel
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrochureModal;
