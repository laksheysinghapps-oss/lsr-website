import React, { useState, useRef } from 'react';
import { X, Check, Loader2, Paperclip } from 'lucide-react';

interface CareerModalProps {
  onClose: () => void;
}

const WEB3FORMS_ACCESS_KEY = 'b5516625-b8dc-4873-b3a7-c5ac7e266605';

const CareerModal: React.FC<CareerModalProps> = ({ onClose }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    jobRole: '',
    experience: '',
    location: '',
    message: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const emailBody = [
        `Candidate Name: ${formData.name}`,
        `Mobile Number: ${formData.phone}`,
        `Email ID: ${formData.email}`,
        `Job Role: ${formData.jobRole}`,
        `Experience: ${formData.experience}`,
        `Job Location: ${formData.location}`,
        resumeFile ? `Resume File: ${resumeFile.name} (candidate will email separately)` : 'Resume: Not attached',
        formData.message ? `\nMessage:\n${formData.message}` : '',
      ].filter(Boolean).join('\n');

      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Job Application — ${formData.jobRole} | ${formData.name}`,
        from_name: 'LSR Realty Careers',
        cc: 'lakshey@lsrrealty.com,raghvendra@lsrrealty.com',
        message: emailBody,
        replyto: formData.email,
      };

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setError(`Submission failed: ${json.message || 'Please try again.'}`);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      <div
        className="bg-lsr-charcoal border border-white/10 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-4 shrink-0">
          <div>
            <h3 className="text-xl font-serif text-white">Apply Now</h3>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">LSR Realty — Careers</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors mt-1">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="px-8 pb-8 overflow-y-auto">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-900/30 border border-green-500/40 flex items-center justify-center mb-4">
                <Check className="text-green-400 w-7 h-7" />
              </div>
              <p className="text-white font-semibold mb-1">Application Submitted!</p>
              <p className="text-gray-400 text-sm">Our team will review your profile and reach out if there's a fit.</p>
              {resumeFile && (
                <p className="text-gray-500 text-xs mt-2">Please also email your resume to <span className="text-lsr-gold">saboori@lsrrealty.com</span></p>
              )}
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 border border-white/20 text-sm text-gray-300 hover:border-white hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Candidate Name"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Mobile Number"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email ID"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600"
              />
              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                placeholder="Job Role (e.g. Investment Advisor)"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600"
              />
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Experience (e.g. 3 Years)"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Job Location Preference"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600"
              />

              {/* Resume upload */}
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-left flex items-center gap-3 hover:border-lsr-gold/50 transition-colors"
                >
                  <Paperclip size={14} className="text-gray-500 shrink-0" />
                  <span className={resumeFile ? 'text-white' : 'text-gray-600'}>
                    {resumeFile ? resumeFile.name : 'Attach Resume (PDF / DOC / DOCX)'}
                  </span>
                </button>
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message (Optional)"
                rows={3}
                className="w-full bg-black border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-lsr-gold placeholder-gray-600 resize-none"
              />

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="consent-career"
                  required
                  className="mt-1 w-4 h-4 accent-lsr-gold cursor-pointer shrink-0"
                />
                <label htmlFor="consent-career" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                  I authorize LSR Realty to contact me regarding my application via Email, SMS, WhatsApp, and Call.
                </label>
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

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
                  'Submit Application'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerModal;
