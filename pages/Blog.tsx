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
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LSR Realty',
    url: 'https://lsrrealty.com',
    logo: 'https://lsrrealty.com/images/Logo2.png',
    sameAs: [
      'https://www.linkedin.com/company/lsr-realty',
      'https://www.instagram.com/lsrrealty',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '911, Magnum Global Park, Sector 58',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122098',
      addressCountry: 'IN',
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

const BlogCard: React.FC<{
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  featured?: boolean;
}> = ({ id, title, excerpt, category, date, image, featured }) => (
  <article className={`group flex flex-col${featured ? ' md:col-span-2 lg:col-span-3' : ''}`}>
    {/* Thumbnail */}
    <Link to={`/blog/${id}`} className="block overflow-hidden rounded-lg mb-4">
      <img
        src={image}
        alt={title}
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-105${featured ? ' h-72 md:h-[420px]' : ' h-52'}`}
        draggable={false}
        onContextMenu={e => e.preventDefault()}
      />
    </Link>

    {/* Meta */}
    <p className="text-sm text-gray-400 mb-2">
      {date} &bull; <span className="text-lsr-gold">{category}</span>
    </p>

    {/* Title */}
    <h2 className={`font-serif text-white leading-snug mb-3 group-hover:text-lsr-gold transition-colors${featured ? ' text-2xl md:text-3xl' : ' text-lg'}`}>
      <Link to={`/blog/${id}`}>{title}</Link>
    </h2>

    {/* Excerpt */}
    <p className={`text-gray-400 text-sm leading-relaxed${featured ? ' line-clamp-3 max-w-3xl' : ' line-clamp-2'}`}>
      {excerpt}
    </p>

    {featured && (
      <Link
        to={`/blog/${id}`}
        className="inline-flex items-center gap-2 mt-5 gold-gradient-text text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
      >
        Read Article <ArrowRight size={14} />
      </Link>
    )}
  </article>
);

const Blog: React.FC = () => {
  const publishedPosts = BLOG_POSTS.filter(p => p.published);
  const featured = publishedPosts.find(p => p.featured) ?? publishedPosts[0];
  const rest = featured ? publishedPosts.filter(p => p.id !== featured.id) : [];

  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <SEO
        title="Gurgaon Real Estate Blog | Market Intelligence & Investment Insights | LSR Realty"
        description="Expert insights on Gurgaon real estate investment, commercial market trends, location analysis, NRI advisory and Gurugram sector guides from LSR Realty — institutional-grade real estate advisory."
        path="/blog"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <p className="gold-gradient-text uppercase tracking-[0.2em] text-sm mb-4">Market Intelligence</p>
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Real Estate Insights &amp; Advisory</h1>
        <p className="text-lg text-gray-400 font-normal mb-14 max-w-2xl leading-relaxed">
          Data-driven perspectives on Gurgaon real estate investment, commercial market trends, sector location guides, and NRI advisory from LSR Realty.
        </p>

        {publishedPosts.length === 0 ? (
          /* ── Coming Soon state ── */
          <div>
            <div className="border border-white/10 bg-lsr-charcoal/30 p-10 md:p-16 text-center mb-16">
              <p className="gold-gradient-text uppercase tracking-[0.2em] text-xs mb-5">Launching Soon</p>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-snug">
                Institutional-Grade Insights on Gurgaon Real Estate
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                We are preparing a curated library of market intelligence reports, investment guides, location analyses, and NRI advisory articles on Gurugram real estate. Every piece will be research-backed, data-driven, and relevant to HNI, UHNI, and NRI investors.
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
            <p className="text-gray-400 text-sm mb-10">
              Our blog will cover four core areas of Gurgaon real estate intelligence.
            </p>
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
          /* ── Live post listing ── */
          <div className="space-y-16">
            {/* Featured post — full width */}
            {featured && (
              <>
                <BlogCard
                  id={featured.id}
                  title={featured.title}
                  excerpt={featured.excerpt}
                  category={featured.category}
                  date={featured.date}
                  image={featured.image}
                  featured
                />
                {/* Divider before grid */}
                {rest.length > 0 && (
                  <div className="border-t border-white/10 pt-14">
                    <h2 className="text-xl font-serif text-white mb-10">More Insights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {rest.map(post => (
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
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
