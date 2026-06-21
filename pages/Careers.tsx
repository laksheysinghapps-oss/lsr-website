import React, { useState } from 'react';
import CareerModal from '../components/CareerModal';
import { MapPin, Briefcase, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const OPEN_POSITIONS = [
  {
    id: 2,
    title: 'Sales Telecaller Intern – Real Estate',
    location: 'Gurgaon, Haryana',
    industry: 'Real Estate',
    type: 'Internship (3–6 Months)',
    about: 'We are looking for enthusiastic and confident Male & Female Interns to join our Real Estate Sales Team as Sales Telecallers. The role involves connecting with potential customers, generating leads, scheduling site visits, and supporting the sales team in converting prospects into clients.',
    responsibilities: [
      'Make outbound calls to prospective customers from provided databases.',
      'Explain project details, pricing, and ongoing offers to potential buyers.',
      'Qualify leads and understand customer requirements.',
      'Schedule site visits and meetings for the sales team.',
      'Follow up regularly with interested prospects.',
      'Maintain accurate records of customer interactions in CRM/Excel.',
      'Coordinate with the sales team for lead closures.',
      'Achieve daily and weekly calling and lead generation targets.',
    ],
    requirements: [
      'Graduate, Undergraduate, or pursuing a degree in any discipline.',
      'Excellent communication skills in Hindi and basic English.',
      'Strong interpersonal and persuasion skills.',
      'Comfortable making high-volume outbound calls.',
      'Basic knowledge of MS Excel and CRM tools is an advantage.',
      'Interest in Sales, Real Estate, and Customer Relations.',
    ],
    desiredSkills: [
      'Positive attitude and willingness to learn.',
      'Strong negotiation and follow-up abilities.',
      'Self-motivated and target-oriented mindset.',
    ],
    benefits: [
      'Hands-on experience in Real Estate Sales.',
      'Exposure to lead generation and customer relationship management.',
      'Opportunity for a full-time role based on performance.',
      'Sales and communication skill development.',
      'Incentives for achieving targets.',
    ],
    mustHave: '',
    skills: 'Telecalling / Lead Generation',
    gender: 'Open to Male & Female Candidates',
    stipend: 'As per company policy + Performance Incentives',
  },
  {
    id: 1,
    title: 'Sales Runner',
    location: 'Gurgaon',
    industry: 'Real Estate',
    type: 'Full-Time',
    about: 'We are looking for an energetic and proactive Sales Runner to support our sales team by managing site visits, client coordination, lead follow-ups, and on-ground sales activities. The ideal candidate should have excellent communication skills, a customer-focused approach, and the ability to work in a fast-paced environment.',
    responsibilities: [
      'Coordinate and schedule client site visits.',
      'Accompany clients during property visits and provide basic project information.',
      'Assist the sales team in lead management and follow-ups.',
      'Maintain accurate records of customer interactions and visit reports.',
      'Coordinate with internal teams to ensure smooth client servicing.',
      'Support sales executives in documentation and booking processes.',
      'Conduct regular follow-ups with prospective customers.',
      'Ensure timely sharing of project updates, offers, and inventory availability with clients.',
      'Assist in organizing sales events, open houses, and promotional activities.',
      'Collect market feedback and competitor insights.',
    ],
    requirements: [
      'Graduate in any discipline.',
      '0–2 years of experience in sales, customer service, or real estate (Freshers can apply).',
      'Good communication and interpersonal skills.',
      'Presentable personality with a customer-centric attitude.',
      'Basic knowledge of MS Office and CRM tools is preferred.',
      'Willingness to travel for site visits and client meetings.',
      'Valid driving license is an added advantage.',
    ],
    desiredSkills: [
      'Strong follow-up and coordination abilities.',
      'Positive attitude and eagerness to learn.',
      'Ability to work under targets and deadlines.',
      'Team player with excellent organizational skills.',
    ],
    benefits: [
      'Competitive Salary + Performance Incentives',
      'Career Growth Opportunities',
      'Training and Development Support',
      'Dynamic and Professional Work Environment',
    ],
    mustHave: '2-Wheeler Driving Licence and Bike',
    skills: 'Inventory Sourcing',
    gender: '',
    stipend: '',
  },
];

const Careers: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  return (
    <div className="bg-black text-white pt-20 md:pt-24 min-h-screen">
      {showModal && <CareerModal onClose={() => setShowModal(false)} />}

      {/* Hero */}
      <section className="py-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <h4 className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Join The Team</h4>
          <h1 className="text-5xl font-serif mb-6">Build a Career in Institutional Real Estate</h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Work alongside leadership from Cornell University and Hines. We are looking for analytical, driven professionals who want to move beyond traditional brokerage into true investment advisory.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-white">Why Join LSR?</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Mentorship from industry veterans</li>
              <li>• Access to high-quality HNI inventory</li>
              <li>• Professional, corporate culture</li>
              <li>• Competitive compensation structures</li>
            </ul>
          </div>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" alt="Team" className="w-full h-80 object-cover object-top grayscale" />
        </div>
      </section>

      {/* Open Positions */}
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="pt-8" style={{borderTop: '1px solid transparent', borderImage: 'linear-gradient(90deg, #dcc87a 0%, #f2e49e 18%, #c9a54a 52%, #7c5212 100%) 1'}}>
          <h2 className="text-3xl font-serif mb-2">Open Positions</h2>
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-10">{OPEN_POSITIONS.length} Opening{OPEN_POSITIONS.length !== 1 ? 's' : ''} Available</p>

          <div className="space-y-4">
            {OPEN_POSITIONS.map(job => (
              <div key={job.id} className="border border-white/10 hover:border-lsr-gold/40 transition-all duration-300">
                {/* Job Header */}
                <div
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 cursor-pointer"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  <div>
                    <h3 className="text-xl font-serif text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-lsr-gold" />{job.location}</span>
                      <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-lsr-gold" />{job.industry}</span>
                      <span className="flex items-center gap-1.5"><Clock size={13} className="text-lsr-gold" />{job.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <button
                      onClick={e => { e.stopPropagation(); setShowModal(true); }}
                      className="bg-lsr-gold text-black px-6 py-2 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                      Apply Now
                    </button>
                    {expandedJob === job.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>

                {/* Job Details */}
                {expandedJob === job.id && (
                  <div className="px-6 pb-8 border-t border-white/10 pt-6 space-y-6">
                    <div>
                      <h4 className="gold-gradient-text text-xs uppercase tracking-widest mb-3">About the Role</h4>
                      <p className="text-gray-400 leading-relaxed">{job.about}</p>
                    </div>

                    <div>
                      <h4 className="gold-gradient-text text-xs uppercase tracking-widest mb-3">Key Responsibilities</h4>
                      <ul className="space-y-2">
                        {job.responsibilities.map((r, i) => (
                          <li key={i} className="text-gray-400 flex items-start gap-2"><span className="text-lsr-gold mt-1">•</span>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="gold-gradient-text text-xs uppercase tracking-widest mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((r, i) => (
                          <li key={i} className="text-gray-400 flex items-start gap-2"><span className="text-lsr-gold mt-1">•</span>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="gold-gradient-text text-xs uppercase tracking-widest mb-3">Desired Skills</h4>
                        <ul className="space-y-2">
                          {job.desiredSkills.map((s, i) => (
                            <li key={i} className="text-gray-400 flex items-start gap-2"><span className="text-lsr-gold mt-1">•</span>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="gold-gradient-text text-xs uppercase tracking-widest mb-3">Compensation & Benefits</h4>
                        <ul className="space-y-2">
                          {job.benefits.map((b, i) => (
                            <li key={i} className="text-gray-400 flex items-start gap-2"><span className="text-lsr-gold mt-1">•</span>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-2 border-t border-white/10">
                      {job.mustHave && <div>
                        <span className="text-xs uppercase tracking-widest text-gray-500">Must Have</span>
                        <p className="text-white text-sm mt-1">{job.mustHave}</p>
                      </div>}
                      {job.skills && <div>
                        <span className="text-xs uppercase tracking-widest text-gray-500">Skills</span>
                        <p className="text-white text-sm mt-1">{job.skills}</p>
                      </div>}
                      {job.gender && <div>
                        <span className="text-xs uppercase tracking-widest text-gray-500">Gender</span>
                        <p className="text-white text-sm mt-1">{job.gender}</p>
                      </div>}
                      {job.stipend && <div>
                        <span className="text-xs uppercase tracking-widest text-gray-500">Stipend</span>
                        <p className="text-white text-sm mt-1">{job.stipend}</p>
                      </div>}
                    </div>

                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-lsr-gold text-black px-8 py-3 text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
                    >
                      Apply for this Position
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
