import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../constants';
import ProjectCard from '../components/ProjectCard';

type Category = 'All' | 'Leasing' | 'Investment';
type SubCategory = 'All' | 'Commercial' | 'Residential';
type Segment = 'All' | 'Corporate' | 'Retail';

const Projects: React.FC = () => {
  const [category, setCategory] = useState<Category>('All');
  const [subCategory, setSubCategory] = useState<SubCategory>('All');
  const [segment, setSegment] = useState<Segment>('All');

  const handleCategory = (value: Category) => {
    setCategory(value);
    setSubCategory('All');
    setSegment('All');
  };

  const handleSubCategory = (value: SubCategory) => {
    setSubCategory(value);
    setSegment('All');
  };

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
        ? 'bg-lsr-gold text-black border-lsr-gold'
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

      <section className="py-10 max-w-7xl mx-auto px-6 border-b border-white/5">
        <div className="flex flex-wrap gap-3 mb-4">
          {(['All', 'Leasing', 'Investment'] as Category[]).map(option => (
            <button key={option} onClick={() => handleCategory(option)} className={filterButtonClass(category === option)}>
              {option}
            </button>
          ))}
        </div>

        {category !== 'All' && (
          <div className="flex flex-wrap gap-3 mb-4">
            {(['All', 'Commercial', 'Residential'] as SubCategory[]).map(option => (
              <button key={option} onClick={() => handleSubCategory(option)} className={filterButtonClass(subCategory === option)}>
                {option}
              </button>
            ))}
          </div>
        )}

        {category !== 'All' && subCategory === 'Commercial' && (
          <div className="flex flex-wrap gap-3">
            {(['All', 'Corporate', 'Retail'] as Segment[]).map(option => (
              <button key={option} onClick={() => setSegment(option)} className={filterButtonClass(segment === option)}>
                {option}
              </button>
            ))}
          </div>
        )}
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
