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
    priceRange: '₹ 9.3 Cr - ₹ 9.5 Cr',
    pricePerSqFt: '₹ 23,500 - 24,000/sq.ft',
    possessionDate: 'March 2030',
    type: 'Ultra Luxury Residential',
    status: 'Sold Out / Resale Only',
    image: '/images/IMG_4957.jpg',
    developer: 'DLF Ltd',
    rera: 'GGM/671/403/2023/15',
    totalUnits: 1137,
    towers: 5,
    floors: 38,
    landArea: '25 Acres',
    description: 'A masterpiece of low-density luxury living defined by expansive decks and state-of-the-art amenities. The Arbour represents the pinnacle of institutional-grade development in New Gurgaon with just 2 apartments per core.',
    highlights: ['Low Density Living', 'Expansive Decks', '1.25 Lakh Sq.Ft. Clubhouse', 'High Appreciation Potential'],
    amenities: ['Concierge Service', 'Temperature Controlled Pool', 'Private Elevator Lobbies', 'Business Center'],
    unitMix: [
      { type: '4 BHK + Staff', size: '3,900+ Sq. Ft.', price: '₹ 9.3 Cr onwards' }
    ],
    locationAdvantage: ['Connected to Golf Course Extn Road', 'Near Rapid Metro', 'Proximity to Cyber City']
  },
  {
    id: 'dlf-privana',
    name: 'DLF Privana South',
    location: 'Sector 76-77, Gurgaon',
    priceRange: '₹ 7.5 Cr Onwards',
    pricePerSqFt: '₹ 21,000/sq.ft',
    possessionDate: 'July 2029',
    type: 'Luxury Residential',
    status: 'Under Construction',
    image: '/images/Privana South.jpeg',
    developer: 'DLF Ltd',
    rera: 'HARERA/GGM/772/504/2023/116',
    totalUnits: 1113,
    towers: 7,
    floors: 40,
    landArea: '25 Acres',
    description: 'Overlooking the Aravallis, Privana South is a sanctuary of nature and luxury. Designed for the discerning investor looking for long-term value creation in an emerging micro-market.',
    highlights: ['Aravalli Views', 'Integrated Township', 'Sustainable Design', 'Strategic Connectivity'],
    amenities: ['Forest Trails', 'Sports Complex', 'Fine Dining', 'Wellness Spa'],
    unitMix: [
      { type: '4 BHK', size: '3,577 Sq. Ft.', price: '₹ 7.5 Cr*' },
      { type: 'Penthouse', size: '5,472 Sq. Ft.', price: '₹ 11.5 Cr*' }
    ],
    locationAdvantage: ['Direct Access to NH-8', 'Close to Manesar Industrial Hub', 'Future Growth Corridor']
  },
  {
    id: 'emaar-serenity',
    name: 'Emaar Serenity Hills',
    location: 'Sector 86, Gurgaon',
    priceRange: '₹ 2.95 Cr - ₹ 4.4 Cr',
    pricePerSqFt: '₹ 17,000 - 18,000/sq.ft',
    possessionDate: 'September 2030',
    type: 'Premium Residential',
    status: 'New Launch',
    image: 'https://picsum.photos/id/234/1200/800',
    developer: 'Emaar India',
    rera: 'GGM/993/725/2025/96',
    totalUnits: 1500,
    towers: 13,
    landArea: '25.9 Acres',
    description: 'Modern architecture meets serene landscapes. An ideal investment for those seeking rental yield and steady capital appreciation backed by the global Emaar brand.',
    highlights: ['Efficient Layouts', 'Global Brand', 'High Rental Yield Potential', 'Community Living'],
    amenities: ['Retail Plaza', 'Kids Play Areas', 'Gymnasium', 'Swimming Pool'],
    unitMix: [
      { type: '3 BHK', size: '1,700 Sq. Ft.', price: '₹ 2.95 Cr*' },
      { type: '4 BHK', size: '2,800 Sq. Ft.', price: '₹ 4.4 Cr*' }
    ],
    locationAdvantage: ['Easy Access to Dwarka Expressway', 'Established Social Infrastructure', 'Near IGI Airport']
  },
  {
    id: 'westin-residences',
    name: 'The Westin Residences',
    location: 'Sector 103, Dwarka Expressway',
    priceRange: '₹ 6.75 Cr - ₹ 12 Cr',
    pricePerSqFt: '₹ 25,750 - 26,750/sq.ft',
    possessionDate: 'December 2029',
    type: 'Branded Residences',
    status: 'Under Construction',
    image: '/images/westin-residences.png',
    developer: 'Whiteland Corporation x Westin Hotels',
    rera: 'RC/REP/HARERA/GGM/65,66,67/2024',
    towers: 6,
    floors: 49,
    landArea: '21 Acres',
    description: 'The epitome of hotel-integrated living. 5-star Westin hospitality services within your private residence. A trophy asset for the ultra-HNI portfolio with 75,000 sq.ft. clubhouse.',
    highlights: ['5-Star Westin Hospitality', 'Concierge & Valet', '75,000 Sq.Ft. Clubhouse', 'G+49 Towers'],
    amenities: ['Housekeeping', 'In-residence Dining', 'Spa & Sauna', 'Multi-cuisine Restaurants'],
    unitMix: [
      { type: '3 BHK', size: '2,693 - 2,939 Sq. Ft.', price: '₹ 6.75 Cr*' },
      { type: '4 BHK', size: '3,750 - 4,329 Sq. Ft.', price: '₹ 10.03 Cr*' }
    ],
    locationAdvantage: ['Direct Dwarka Expressway Access', 'Near IGI Airport', 'Connected to Golf Course Road']
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