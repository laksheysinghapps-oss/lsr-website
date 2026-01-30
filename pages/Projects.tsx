import React from 'react';
import { PROJECTS } from '../constants';
import ProjectCard from '../components/ProjectCard';

const Projects: React.FC = () => {
  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <section className="py-16 bg-lsr-charcoal border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Portfolio</h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            A curated selection of Gurgaon's finest residential opportunities, vetted for legal compliance, construction quality, and appreciation potential.
          </p>
        </div>
      </section>
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
