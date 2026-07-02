import React from 'react';

export interface Project {
  id: string;
  name: string;
  location: string;
  priceRange: string;
  pricePerSqFt: string;
  sizeRange: string;
  possessionDate: string;
  type: string;
  status: string;
  category: 'Leasing' | 'Investment';
  subCategory: 'Commercial' | 'Residential';
  segment?: 'Corporate' | 'Retail';
  image: string;
  description: string;
  developer: string;
  rera?: string;
  totalUnits?: number;
  towers?: number;
  floors?: number;
  landArea?: string;
  mapQuery?: string;
  highlights: string[];
  amenities: string[];
  unitMix: { type: string; size: string; price: string }[];
  locationAdvantage: string[];
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Insight {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  image: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
  featured?: boolean;
  published: boolean;
}