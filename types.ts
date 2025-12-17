import React from 'react';

export interface Project {
  id: string;
  name: string;
  location: string;
  priceRange: string;
  type: string;
  status: string;
  image: string;
  description: string;
  developer: string;
  highlights: string[];
  amenities: string[];
  unitMix: { type: string; size: string; price: string }[];
  locationAdvantage: string[];
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
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