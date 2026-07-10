import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import SEO from '../components/SEO';
import { ArrowRight, TrendingUp, MapPin, Globe, BarChart3 } from 'lucide-react';

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lsrrealty.com/' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Blog', item: 'https://lsrrealty.com/blog' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'LSR Realty — Gurgaon Real Estate Market Intelligence Blog',
    description: 'Expert insights on Gurgaon real estate investment, commercial market trends, location analysis, NRI advisory, and Gurugram sector guides from LSR Realty.',
    url: 'https://lsrrealty.com/blog',
    inLanguage: 'en-IN',
    publisher: {
      '@type': 'Organization',
      name: 'LSR Realty',
      url: 'https://lsrrealty.com',
      logo: { '@type': 'ImageObject', url: 'https://lsrrealty.com/images/Logo2.png' },
    },
  },
];

const COMING_SOON_TOPICS = [
  {
    icon: <TrendingUp className="w-6 h-6 text-lsr-gold" />,
    title: 'Market Intelligence',
    description: 'Quarterly data on office absorption, residential launches, rental yields, and capital value trends across Gurugram\'s key micro markets.',
  },
  {
    icon: <MapPin className="w-6 h-6 text-lsr-gold" />,
    title: 'Location Guides',
    description: 'Sector-by-sector breakdowns of Golf Course Road, Golf Course Extension, Dwarka Expressway, Sohna Road, and Southern Peripheral Road.',
  },
  {
    icon: <Globe className="w-6 h-6 text-lsr-gold" />,
    title: 'NRI Advisory',
    description: 'FEMA compliance, repatriation planning, Power of Attorney logistics, and tax structuring for Non Resident Indians investing in Gurgaon.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-lsr-gold" />,
    title: 'Investment Advisory',
    description: 'Asset class comparisons, deal structuring frameworks, and portfolio construction guidance for HNI and family office real estate investors.',
  },
];

interface CardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

const BlogCard: React.FC<CardProps> = ({ id, title, excerpt, category, date, image }) => (
  <article className="group flex flex-col bg-[#111] rounded-2xl overflow-hidden hover:shadow-[0_8px_40px_rgba(198,166,103,0.12)] transition-shadow duration-300">
    {/* Image */}
    <Link to={`/blog/${id}`} className="block overflow-hidden h-52 flex-shrink-0">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        draggable={false}
        onContextMenu={e => e.preventDefault()}
      />
    </Link>

    {/* Body */}
    <div className="flex flex-col flex-1 p-5">
      <p className="text-xs text-gray-500 mb-3">
        {date}&nbsp;&nbsp;·&nbsp;&nbsp;<span className="text-lsr-gold">{category}</span>
      </p>
      <h2 className="text-white text-base leading-snug mb-2 group-hover:text-lsr-gold transition-colors duration-200">
        <Link to={`/blog/${id}`}>{title}</Link>
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">{excerpt}</p>
      <Link
        to={`/blog/${id}`}
        className="inline-flex items-center gap-1 mt-4 text-lsr-gold text-xs font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity"
      >
        Read More <ArrowRight size={12} />
      </Link>
    </div>
  </article>
);

const Blog: React.FC = () => {
  const publishedPosts = BLOG_POSTS.filter(p => p.published);

  return (
    <div className="bg-black text-white min-h-screen">
      <SEO
        title="Gurgaon Real Estate Blog | LSR Realty"
        description="Expert insights on Gurgaon real estate investment, market trends, location guides and NRI advisory from LSR Realty."
        keywords="Gurgaon real estate blog, Gurugram property market insights, Gurgaon investment guide, real estate news Gurgaon"
        path="/blog"
        structuredData={structuredData}
      />

      {/* Hero Banner */}
      <section className="gold-gradient-border relative h-[75vh] overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="LSR Realty Blogs"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 px-6 pt-32 md:pt-40">
          <p className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Market Intelligence</p>
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Real Estate Insights &amp; Advisory</h1>
          <p className="text-gray-400 max-w-2xl text-lg mx-auto">
            Data-driven perspectives on Gurgaon real estate investment, commercial market trends, sector location guides, and NRI advisory from LSR Realty.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24 pt-16">

        {publishedPosts.length === 0 ? (
          /* ── Coming Soon ── */
          <div>
            <div className="border border-white/10 bg-lsr-charcoal/30 p-10 md:p-16 text-center mb-16">
              <p className="gold-gradient-text uppercase tracking-[0.2em] text-xs mb-5">Launching Soon</p>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-snug">
                Institutional-Grade Insights on Gurgaon Real Estate
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                We are preparing a curated library of market intelligence reports, investment guides, location analyses, and NRI advisory articles on Gurugram real estate.
              </p>
              <p className="text-gray-500 text-sm mb-10">
                In the meantime, speak directly with our advisors for personalised Gurgaon market intelligence.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-lsr-gold text-black px-8 py-3 text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
              >
                Speak to an Advisor <ArrowRight size={14} />
              </Link>
            </div>

            <h2 className="text-2xl font-serif mb-2 text-white">What to Expect</h2>
            <p className="text-gray-400 text-sm mb-10">Our blog will cover four core areas of Gurgaon real estate intelligence.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {COMING_SOON_TOPICS.map(topic => (
                <div
                  key={topic.title}
                  className="border border-white/10 hover:border-lsr-gold/30 transition-all duration-300 p-8 bg-lsr-charcoal/20"
                >
                  <div className="mb-4">{topic.icon}</div>
                  <h3 className="text-lg font-serif text-white mb-3">{topic.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{topic.description}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-serif gold-gradient-text mb-2">100+</p>
                <p className="text-gray-400 text-sm">Sectors covered across Gurugram</p>
              </div>
              <div>
                <p className="text-3xl font-serif gold-gradient-text mb-2">15+</p>
                <p className="text-gray-400 text-sm">Years of combined advisory experience</p>
              </div>
              <div>
                <p className="text-3xl font-serif gold-gradient-text mb-2">HNI</p>
                <p className="text-gray-400 text-sm">Institutional-grade research for serious investors</p>
              </div>
            </div>
          </div>
        ) : (
          /* ── Live posts — uniform card grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {publishedPosts.map(post => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                date={post.date}
                image={post.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
