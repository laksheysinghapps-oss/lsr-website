import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../constants';
import ProjectCard from '../components/ProjectCard';

const Projects: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const segments = location.pathname.replace(/^\/projects\/?/, '').split('/').filter(Boolean);
  const categorySlug = segments[0]; // 'leasing' | 'investment' | undefined
  const subCategorySlug = segments[1]; // 'commercial' | 'residential' | undefined
  const segmentSlug = segments[2]; // 'corporate' | 'retail' | undefined

  const category = categorySlug === 'leasing' ? 'Leasing' : categorySlug === 'investment' ? 'Investment' : 'All';
  const subCategory = subCategorySlug === 'commercial' ? 'Commercial' : subCategorySlug === 'residential' ? 'Residential' : 'All';
  const segment = segmentSlug === 'corporate' ? 'Corporate' : segmentSlug === 'retail' ? 'Retail' : 'All';

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(project => {
      if (category !== 'All' && project.category !== category) return false;
      if (subCategory !== 'All' && project.subCategory !== subCategory) return false;
      if (subCategory === 'Commercial' && segment !== 'All' && project.segment !== segment) return false;
      return true;
    });
  }, [category, subCategory, segment]);

  const filterButtonClass = (active: boolean) =>
    `px-5 py-2 text-sm uppercase tracking-widest border transition-all duration-300 ${
      active
        ? 'filter-active bg-lsr-gold text-black border-lsr-gold'
        : 'border-white/20 text-gray-300 hover:border-lsr-gold hover:text-lsr-gold'
    }`;

  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <section className="py-16 bg-lsr-charcoal border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Portfolio</h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            A curated selection of Gurgaon's finest opportunities, vetted for legal compliance, construction quality, and appreciation potential.
          </p>
        </div>
      </section>

      <section className="py-8 max-w-7xl mx-auto px-6 border-b border-white/5">
        <div className="flex flex-col gap-4">

          {/* Row 1: Category */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-gray-500 w-20 shrink-0">Category</span>
            <button onClick={() => navigate('/projects')} className={filterButtonClass(category === 'All')}>All</button>
            <button onClick={() => navigate('/projects/leasing')} className={filterButtonClass(category === 'Leasing')}>Leasing</button>
            <button onClick={() => navigate('/projects/investment')} className={filterButtonClass(category === 'Investment')}>Investment</button>
          </div>

          {/* Row 2: Type — visible when a category is selected */}
          {category !== 'All' && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-gray-500 w-20 shrink-0">Type</span>
              <button onClick={() => navigate(`/projects/${categorySlug}`)} className={filterButtonClass(subCategory === 'All')}>All</button>
              <button onClick={() => navigate(`/projects/${categorySlug}/commercial`)} className={filterButtonClass(subCategory === 'Commercial')}>Commercial</button>
              <button onClick={() => navigate(`/projects/${categorySlug}/residential`)} className={filterButtonClass(subCategory === 'Residential')}>Residential</button>
            </div>
          )}

          {/* Row 3: Segment — visible when Commercial is selected */}
          {category !== 'All' && subCategory === 'Commercial' && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-gray-500 w-20 shrink-0">Segment</span>
              <button onClick={() => navigate(`/projects/${categorySlug}/commercial`)} className={filterButtonClass(segment === 'All')}>All</button>
              <button onClick={() => navigate(`/projects/${categorySlug}/commercial/corporate`)} className={filterButtonClass(segment === 'Corporate')}>Corporate</button>
              <button onClick={() => navigate(`/projects/${categorySlug}/commercial/retail`)} className={filterButtonClass(segment === 'Retail')}>Retail</button>
            </div>
          )}

        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">No projects found in this category yet.</p>
        )}
      </section>
    </div>
  );
};

export default Projects;
