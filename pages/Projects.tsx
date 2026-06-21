import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, ArrowUpRight, X, Search } from 'lucide-react';
import { PROJECTS } from '../constants';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../types';

const Projects: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalProject, setModalProject] = useState<{ name: string; image: string; loc: string; options: Project[] } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const segments = location.pathname.replace(/^\/projects\/?/, '').split('/').filter(Boolean);
  const categorySlug = segments[0];
  const subCategorySlug = segments[1];
  const segmentSlug = segments[2];

  const category = categorySlug === 'leasing' ? 'Leasing' : categorySlug === 'investment' ? 'Investment' : 'All';
  const subCategory = subCategorySlug === 'commercial' ? 'Commercial' : subCategorySlug === 'residential' ? 'Residential' : 'All';
  const segment = segmentSlug === 'corporate' ? 'Corporate' : segmentSlug === 'retail' ? 'Retail' : 'All';

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return PROJECTS.filter(project => {
      if (category !== 'All' && project.category !== category) return false;
      if (subCategory !== 'All' && project.subCategory !== subCategory) return false;
      if (subCategory === 'Commercial' && segment !== 'All' && project.segment !== segment) return false;
      if (q && !project.name.toLowerCase().includes(q) && !project.location.toLowerCase().includes(q) && !project.developer.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, subCategory, segment, searchQuery]);

  // Deduplicated list for "All" view
  const allViewProjects = useMemo(() => {
    if (category !== 'All') return filteredProjects;
    const seen = new Map<string, Project[]>();
    for (const p of filteredProjects) {
      const key = p.name;
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push(p);
    }
    // Return one representative per name
    return Array.from(seen.values()).map(group => group[0]);
  }, [category, filteredProjects]);

  // Map name -> all variants (for modal detection)
  const projectVariants = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const p of filteredProjects) {
      if (!map.has(p.name)) map.set(p.name, []);
      map.get(p.name)!.push(p);
    }
    return map;
  }, [filteredProjects]);

  const handleAllCardClick = (project: Project) => {
    const variants = projectVariants.get(project.name) || [];
    if (variants.length > 1) {
      setModalProject({ name: project.name, image: project.image, loc: project.location, options: variants });
    } else {
      navigate(`/projects/${project.id}`);
      window.scrollTo(0, 0);
    }
  };

  const filterButtonClass = (active: boolean) =>
    `px-5 py-2 text-sm uppercase tracking-widest border transition-all duration-300 ${
      active
        ? 'bg-lsr-gold text-black border-lsr-gold'
        : 'border-white/20 text-gray-300 hover:border-lsr-gold hover:text-lsr-gold'
    }`;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Category Selection Modal */}
      {modalProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={() => setModalProject(null)}
        >
          <div
            className="bg-lsr-charcoal border border-white/10 max-w-md w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img src={modalProject.image} alt={modalProject.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <button
                className="absolute top-3 right-3 text-white hover:text-lsr-gold transition-colors"
                onClick={() => setModalProject(null)}
              >
                <X size={20} />
              </button>
            </div>
            {/* Content */}
            <div className="p-8">
              <h3 className="text-2xl font-serif text-white mb-1">{modalProject.name}</h3>
              <div className="flex items-center space-x-2 text-gray-400 text-sm mb-6">
                <MapPin size={13} className="text-lsr-gold" />
                <span>{modalProject.loc}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">This property is available under multiple categories. Please select how you'd like to explore it:</p>
              <div className="flex flex-col gap-3">
                {modalProject.options.map(opt => (
                  <button
                    key={opt.id}
                    className="flex items-center justify-between px-5 py-4 border border-white/10 hover:border-lsr-gold/60 transition-all duration-300 group"
                    onClick={() => {
                      setModalProject(null);
                      navigate(`/projects/${opt.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="text-left">
                      <div className="text-white text-sm font-medium group-hover:text-lsr-gold transition-colors uppercase tracking-wider">{opt.category}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{opt.status}</div>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-500 group-hover:text-lsr-gold transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="gold-gradient-border relative h-[75vh] overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Portfolio Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 px-6 pt-32 md:pt-40">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Portfolio</h1>
          <p className="text-gray-400 max-w-2xl text-lg mx-auto">
            A curated selection of Gurgaon's finest opportunities, vetted for legal compliance, construction quality, and appreciation potential.
          </p>
        </div>
      </section>

      <section className="py-8 max-w-7xl mx-auto px-6 border-b border-white/5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-gray-500 w-20 shrink-0">Category</span>
            <button onClick={() => navigate('/projects')} className={filterButtonClass(category === 'All')}>All</button>
            <button onClick={() => navigate('/projects/leasing')} className={filterButtonClass(category === 'Leasing')}>Leasing</button>
            <button onClick={() => navigate('/projects/investment')} className={filterButtonClass(category === 'Investment')}>Investment</button>
            {/* Search Box */}
            <div className="ml-auto flex items-center border border-white/20 hover:border-lsr-gold/50 transition-colors duration-300 bg-black/40">
              <Search size={14} className="text-gray-500 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Project"
                className="bg-transparent text-white text-sm px-3 py-2 w-56 outline-none placeholder-gray-600"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="mr-3 text-gray-500 hover:text-white transition-colors">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {category !== 'All' && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-gray-500 w-20 shrink-0">Type</span>
              <button onClick={() => navigate(`/projects/${categorySlug}`)} className={filterButtonClass(subCategory === 'All')}>All</button>
              <button onClick={() => navigate(`/projects/${categorySlug}/commercial`)} className={filterButtonClass(subCategory === 'Commercial')}>Commercial</button>
              <button onClick={() => navigate(`/projects/${categorySlug}/residential`)} className={filterButtonClass(subCategory === 'Residential')}>Residential</button>
            </div>
          )}

          {category !== 'All' && subCategory === 'Commercial' && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-gray-500 w-20 shrink-0">Segment</span>
              <button onClick={() => navigate(`/projects/${categorySlug}/commercial`)} className={filterButtonClass(segment === 'All')}>All</button>
              <button onClick={() => navigate(`/projects/${categorySlug}/commercial/corporate`)} className={filterButtonClass(segment === 'Corporate')}>Office</button>
              <button onClick={() => navigate(`/projects/${categorySlug}/commercial/retail`)} className={filterButtonClass(segment === 'Retail')}>Retail</button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        {searchQuery.trim() && (
          <div className="flex items-center gap-3 mb-8">
            <Search size={14} className="text-lsr-gold" />
            <span className="text-xs uppercase tracking-widest text-gray-500">Search Results for</span>
            <span className="gold-gradient-text text-sm font-medium">"{searchQuery.trim()}"</span>
            <span className="text-gray-600 text-xs">{(category === 'All' ? allViewProjects : filteredProjects).length} found</span>
          </div>
        )}
        {category === 'All' ? (
          allViewProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allViewProjects.map(project => {
                const isDual = (projectVariants.get(project.name)?.length ?? 1) > 1;
                return (
                  <div
                    key={project.name}
                    className="group bg-lsr-charcoal border border-white/5 hover:border-lsr-gold/50 transition-all duration-500 cursor-pointer overflow-hidden relative"
                    onClick={() => handleAllCardClick(project)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 bg-lsr-gold text-black text-xs font-bold px-4 py-2 uppercase tracking-widest">
                        {isDual ? 'Available for Lease & Sale' : project.status}
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-serif text-white group-hover:text-lsr-gold transition-colors mb-2">{project.name}</h3>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <MapPin size={14} className="text-lsr-gold" />
                        <span>{project.location}</span>
                      </div>
                      {isDual && (
                        <p className="text-gray-500 text-xs mt-4 uppercase tracking-widest">Click to select category →</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">No projects found in this category yet.</p>
          )
        ) : (
          filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">No projects found in this category yet.</p>
          )
        )}
      </section>
    </div>
  );
};

export default Projects;
