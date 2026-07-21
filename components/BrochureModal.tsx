import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Loader2, ArrowLeft } from 'lucide-react';
import { submitLead } from '../lib/submitLead';

interface BrochureModalProps {
  projectName: string;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  source?: string;
  successMessage?: string;
  buttonLabel?: string;
  downloadUrl?: string;
}

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const RESEND_COOLDOWN = 30;

type Step = 'details' | 'otp' | 'success';

const BrochureModal: React.FC<BrochureModalProps> = ({
  projectName,
  onClose,
  title = 'Download Brochure',
  subtitle = 'Share your details and we\'ll send the brochure directly to you.',
  source,
  successMessage = 'Our team will share the brochure with you shortly.',
  buttonLabel = 'Request Brochure',
  downloadUrl,
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [step, setStep] = useState<Step>('details');
  const [phoneError, setPhoneError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  const startCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: digitsOnly }));
      if (phoneError) setPhoneError('');
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    if (!INDIAN_MOBILE_REGEX.test(formData.phone)) {
      setPhoneError('Please enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.');
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        setPhoneError(data.error ?? 'Failed to send OTP. Please try again.');
      } else {
        setStep('otp');
        startCooldown();
      }
    } catch {
      setPhoneError('Network error. Please check your connection and try again.');
    }
    setIsSendingOtp(false);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (downloadUrl) {
      await sendOtp();
    } else {
      // No OTP needed for non-download forms
      setIsSendingOtp(true);
      await submitLead({
        ...formData,
        project: projectName,
        source: source ?? `Brochure Request - ${projectName}`,
        message: source ? 'Requested pricing details' : 'Requested brochure download',
      });
      setIsSendingOtp(false);
      setStep('success');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otpValue)) {
      setOtpError('Please enter the 6-digit OTP.');
      return;
    }
    setIsVerifying(true);
    setOtpError('');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp: otpValue }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        setOtpError(data.error ?? 'Verification failed. Please try again.');
      } else {
        await submitLead({
          ...formData,
          project: projectName,
          source: source ?? `Map Download - ${projectName}`,
          message: 'Verified via OTP and downloaded map',
        });
        if (downloadUrl) {
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = '';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setStep('success');
      }
    } catch {
      setOtpError('Network error. Please check your connection and try again.');
    }
    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtpValue('');
    setOtpError('');
    await sendOtp();
  };

  const maskedPhone = `+91 XXXXXX${formData.phone.slice(6)}`;

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
          <div className="flex items-center gap-3">
            {step === 'otp' && (
              <button
                onClick={() => { setStep('details'); setOtpValue(''); setOtpError(''); }}
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h3 className="text-xl font-serif text-white">{title}</h3>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{projectName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8">
          {step === 'success' ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-900/30 border border-green-500/40 flex items-center justify-center mb-4">
                <Check className="text-green-400 w-7 h-7" />
              </div>
              <p className="text-white font-semibold mb-1">
                {downloadUrl ? 'Download Started!' : 'Request Received!'}
              </p>
              <p className="text-gray-400 text-sm">{successMessage}</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 border border-white/20 text-sm text-gray-300 hover:border-white hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          ) : step === 'otp' ? (
            <>
              <p className="text-gray-400 text-sm mb-1">
                We've sent a 6-digit OTP to
              </p>
              <p className="text-white text-sm font-semibold mb-6">{maskedPhone}</p>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpValue}
                  onChange={e => {
                    setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (otpError) setOtpError('');
                  }}
                  placeholder="Enter 6-digit OTP"
                  autoFocus
                  className={`w-full bg-black border px-4 py-3 text-white text-sm tracking-[0.3em] focus:outline-none placeholder-gray-600 placeholder:tracking-normal ${otpError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-lsr-gold'}`}
                />
                {otpError && <p className="text-red-500 text-xs">{otpError}</p>}
                <button
                  type="submit"
                  disabled={isVerifying || otpValue.length < 6}
                  className="w-full bg-lsr-gold text-black font-bold uppercase tracking-widest py-4 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                  ) : (
                    'Verify & Download'
                  )}
                </button>
                <p className="text-center text-xs text-gray-500">
                  Didn't receive it?{' '}
                  {resendCooldown > 0 ? (
                    <span className="text-gray-600">Resend in {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-lsr-gold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </form>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6">{subtitle}</p>
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
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
                <div>
                  <input
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-Digit Mobile Number"
                    required
                    className={`w-full bg-black border px-4 py-3 text-white text-sm focus:outline-none placeholder-gray-600 ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-lsr-gold'}`}
                  />
                  {phoneError && <p className="text-red-500 text-xs mt-2">{phoneError}</p>}
                </div>
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
                  disabled={isSendingOtp}
                  className="w-full bg-lsr-gold text-black font-bold uppercase tracking-widest py-4 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSendingOtp ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP...</>
                  ) : (
                    downloadUrl ? 'Send OTP to Download' : buttonLabel
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
