import React from 'react';
import { Project } from '../types';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const isMaxEstate59 = project.id === 'max-estate-59';
  const cardClass = "group bg-lsr-charcoal border border-white/5 hover:border-lsr-gold/50 transition-all duration-500 cursor-pointer overflow-hidden relative block";

  const cardContent = (
    <>
      <div className="relative h-64 overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-lsr-gold text-black text-xs font-bold px-4 py-2 uppercase tracking-widest">
          {project.status}
        </div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-serif text-white group-hover:text-lsr-gold transition-colors">{project.name}</h3>
        </div>

        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-6">
          <MapPin size={14} className="text-lsr-gold" />
          <span>{project.location}</span>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-sm border-b border-white/10 pb-2">
            <span className="text-gray-500">Developer</span>
            <span className="text-gray-200">{project.developer}</span>
          </div>
          <div className="flex justify-between text-sm border-b border-white/10 pb-2">
            <span className="text-gray-500">Price Range</span>
            <span className="gold-gradient-text font-medium">{project.priceRange}</span>
          </div>
          <div className="flex justify-between text-sm border-b border-white/10 pb-2">
            <span className="text-gray-500">Size Range</span>
            <span className="text-gray-200">{project.sizeRange}</span>
          </div>
          <div className="flex justify-between text-sm border-b border-white/10 pb-2">
            <span className="text-gray-500">Possession</span>
            <span className="text-gray-200">{project.possessionDate}</span>
          </div>
          <div className="flex justify-between text-sm border-b border-white/10 pb-2">
            <span className="text-gray-500">Type</span>
            <span className="text-gray-200">{project.type}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-white group-hover:text-lsr-gold transition-colors">
          <span>{isMaxEstate59 ? 'More Details' : 'View Investment Memo'}</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </>
  );

  if (isMaxEstate59) {
    return (
      <a
        href="/projects/max-estate-59"
        className={cardClass}
        onClick={() => window.scrollTo(0, 0)}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link
      to={`/projects/${project.id}`}
      className={cardClass}
      onClick={() => window.scrollTo(0, 0)}
    >
      {cardContent}
    </Link>
  );
};

export default ProjectCard;