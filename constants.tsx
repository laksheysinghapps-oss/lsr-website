import React from 'react';
import { Project, Service, TeamMember, Insight, NavItem } from './types';
import { LineChart, PieChart, Shield, Globe, Landmark, TrendingUp, Search, Briefcase, BarChart3, Handshake } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Projects', path: '/projects' },
  { label: 'Insights', path: '/insights' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact', path: '/contact' },
];

export const PROJECTS: Project[] = [
  {
    id: 'dlf-arbour',
    name: 'DLF The Arbour',
    location: 'Sector 63, Gurgaon',
    priceRange: '₹ 8.5 Cr - ₹ 9.5 Cr',
    type: 'Ultra Luxury Residential',
    status: 'Sold Out / Resale Only',
    image: 'https://picsum.photos/id/122/1200/800',
    developer: 'DLF Ltd',
    description: 'A masterpiece of low-density luxury living defined by expansive decks and state-of-the-art amenities. The Arbour represents the pinnacle of institutional-grade development in New Gurgaon.',
    highlights: ['Low Density Living', 'Expansive Decks', 'Unmatched Club Facilities', 'High Appreciation Potential'],
    amenities: ['Concierge Service', 'Temperature Controlled Pool', 'Private Elevator Lobbies', 'Business Center'],
    unitMix: [
      { type: '4 BHK + Staff', size: '3956 Sq. Ft.', price: '₹ 8.5 Cr*' }
    ],
    locationAdvantage: ['Connected to Golf Course Extn Road', 'Near Rapid Metro', 'Proximity to Cyber City']
  },
  {
    id: 'dlf-privana',
    name: 'DLF Privana South',
    location: 'Sector 77, Gurgaon',
    priceRange: '₹ 6.5 Cr Onwards',
    type: 'Luxury Residential',
    status: 'New Launch',
    image: 'https://picsum.photos/id/193/1200/800',
    developer: 'DLF Ltd',
    description: 'Overlooking the Aravallis, Privana South is a sanctuary of nature and luxury. Designed for the discerning investor looking for long-term value creation in an emerging micro-market.',
    highlights: ['Aravalli Views', 'Integrated Township', 'Sustainable Design', 'Strategic Connectivity'],
    amenities: ['Forest Trails', 'Sports Complex', 'Fine Dining', 'Wellness Spa'],
    unitMix: [
      { type: '4 BHK', size: '3577 Sq. Ft.', price: '₹ 6.5 Cr*' }
    ],
    locationAdvantage: ['Direct Access to NH-8', 'Close to Manesar Industrial Hub', 'Future Growth Corridor']
  },
  {
    id: 'emaar-serenity',
    name: 'Emaar Serenity Hills',
    location: 'Sector 82, Gurgaon',
    priceRange: '₹ 3.2 Cr - ₹ 4.5 Cr',
    type: 'Premium Residential',
    status: 'Under Construction',
    image: 'https://picsum.photos/id/234/1200/800',
    developer: 'Emaar India',
    description: 'Modern architecture meets serene landscapes. An ideal investment for those seeking rental yield and steady capital appreciation backed by the global Emaar brand.',
    highlights: ['Efficient Layouts', 'Global Brand', 'High Rental Yield Potential', 'Community Living'],
    amenities: ['Retail Plaza', 'Kids Play Areas', 'Gymnasium', 'Swimming Pool'],
    unitMix: [
      { type: '3 BHK', size: '2200 Sq. Ft.', price: '₹ 3.2 Cr*' },
      { type: '4 BHK', size: '2800 Sq. Ft.', price: '₹ 4.1 Cr*' }
    ],
    locationAdvantage: ['Easy Access to Dwarka Expressway', 'Established Social Infrastructure', 'Near IGI Airport']
  },
  {
    id: 'westin-residences',
    name: 'Westin Residences',
    location: 'Sector 53, Gurgaon',
    priceRange: '₹ 12 Cr Onwards',
    type: 'Branded Residences',
    status: 'Exclusive',
    image: 'https://picsum.photos/id/217/1200/800',
    developer: 'Westin / Proprietary',
    description: 'The epitome of hotel-integrated living. 5-star hospitality services within your private residence. A trophy asset for the ultra-HNI portfolio.',
    highlights: ['5-Star Hospitality', 'Concierge & Valet', 'Exclusive Westin Club', 'Prime Golf Course Road'],
    amenities: ['Housekeeping', 'In-residence Dining', 'Spa & Sauna', 'Helipad Access'],
    unitMix: [
      { type: '3 BHK', size: '3200 Sq. Ft.', price: '₹ 12 Cr*' },
      { type: 'Penthouse', size: '6000 Sq. Ft.', price: 'POA' }
    ],
    locationAdvantage: ['Heart of Golf Course Road', 'Walking distance to Metro', 'Surrounded by Corporate Hubs']
  },
];

export const SERVICES: Service[] = [
  {
    title: 'Investment Advisory',
    description: 'Bespoke portfolio strategies based on risk appetite and IRR targets.',
    icon: <TrendingUp className="w-8 h-8 text-lsr-gold" />
  },
  {
    title: 'Market Research',
    description: 'Institutional-grade reports on micro-markets, price trends, and infrastructure.',
    icon: <BarChart3 className="w-8 h-8 text-lsr-gold" />
  },
  {
    title: 'Deal Structuring',
    description: 'Negotiation, legal due diligence, and financial structuring for complex transactions.',
    icon: <Handshake className="w-8 h-8 text-lsr-gold" />
  },
  {
    title: 'NRI Services',
    description: 'End-to-end management for global investors, from acquisition to exit.',
    icon: <Globe className="w-8 h-8 text-lsr-gold" />
  },
];

export const INSIGHTS: Insight[] = [
  {
    id: '1',
    title: 'Gurgaon Market Report Q3 2024',
    category: 'Market Analysis',
    date: 'Oct 15, 2024',
    summary: 'An in-depth look at price appreciation in the Dwarka Expressway corridor and rental yield shifts.',
    image: 'https://picsum.photos/id/342/800/600'
  },
  {
    id: '2',
    title: 'The Rise of Branded Residences',
    category: 'Trend Watch',
    date: 'Sep 28, 2024',
    summary: 'Why UHNIs are shifting capital towards service-integrated luxury assets like Westin Residences.',
    image: 'https://picsum.photos/id/433/800/600'
  },
  {
    id: '3',
    title: 'Infrastructure Impact: Clover Leaf',
    category: 'Infrastructure',
    date: 'Sep 10, 2024',
    summary: 'Analyzing the connectivity boost for SPR and NPR projects following the opening of the Clover Leaf.',
    image: 'https://picsum.photos/id/550/800/600'
  },
];

export const COMPANY_DETAILS = {
  address: "911, Magnum Global Towers, Gurgaon, India",
  phone: "+91 98100 00000",
  email: "invest@lsr-realty.com",
  founder: "Founder Name",
  tagline: "Gurgaon's Premier Real Estate Investment Advisory",
  subTagline: "Data-driven. Transparent. Institutional-quality.",
};