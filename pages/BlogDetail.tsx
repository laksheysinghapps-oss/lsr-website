import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';
import SEO from '../components/SEO';
import BrochureModal from '../components/BrochureModal';
import { ChevronLeft, Clock, Tag } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const found = BLOG_POSTS.find(p => p.id === id);
    // Redirect to /blog for unknown or unpublished posts
    if (!found || !found.published) {
      navigate('/blog', { replace: true });
      return;
    }
    setPost(found);
  }, [id, navigate]);

  if (!post) return null;

  const others = BLOG_POSTS.filter(p => p.published && p.id !== post.id).slice(0, 3);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lsrrealty.com/' },
        { '@type': 'ListItem', position: 2, name: 'Real Estate Blog', item: 'https://lsrrealty.com/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: `https://lsrrealty.com/blog/${post.id}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: {
        '@type': 'ImageObject',
        url: post.image,
        width: 2070,
        height: 1380,
      },
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Organization',
        name: 'LSR Realty Advisory Team',
        url: 'https://lsrrealty.com/about',
      },
      publisher: {
        '@type': 'Organization',
        name: 'LSR Realty',
        url: 'https://lsrrealty.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://lsrrealty.com/images/Logo2.png',
          width: 600,
          height: 60,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://lsrrealty.com/blog/${post.id}`,
      },
      articleSection: post.category,
      keywords: `Gurgaon real estate, ${post.category}, Gurugram investment, LSR Realty`,
      inLanguage: 'en-IN',
      url: `https://lsrrealty.com/blog/${post.id}`,
    },
  ];

  return (
    <div className="bg-black text-white pt-32 md:pt-40 min-h-screen">
      <SEO
        title={`${post.title} | LSR Realty — Gurgaon Real Estate Blog`}
        description={post.excerpt}
        path={`/blog/${post.id}`}
        image={post.image}
        ogType="article"
        articleMeta={{
          publishedTime: post.date,
          author: 'LSR Realty Advisory Team',
          section: post.category,
          tags: ['Gurgaon real estate', 'Gurugram investment', post.category],
        }}
        structuredData={structuredData}
      />

      {showModal && (
        <BrochureModal
          projectName="Blog Consultation"
          onClose={() => setShowModal(false)}
          title="Speak to an Advisor"
          subtitle="Share your details and our team will get in touch to discuss your investment requirements."
          source={`Blog: ${post.title}`}
          successMessage="Our advisor will be in touch with you shortly."
          buttonLabel="Submit Enquiry"
        />
      )}

      <div className="max-w-4xl mx-auto px-6 pb-24">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-lsr-gold transition-colors mb-8">
          <ChevronLeft size={16} /> Back to Insights
        </Link>

        <div className="flex flex-wrap items-center gap-4 mb-5">
          <span className="gold-gradient-text text-xs uppercase tracking-widest font-semibold">{post.category}</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500"><Clock size={11} className="text-lsr-gold" />{post.readTime}</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500"><Tag size={11} className="text-lsr-gold" />{post.date}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">{post.title}</h1>

        <div className="border border-white/10 overflow-hidden mb-10">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-72 md:h-96 object-cover"
            draggable={false}
            onContextMenu={e => e.preventDefault()}
          />
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-5"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-16 border border-lsr-gold/30 bg-lsr-charcoal/40 p-8 md:p-12 text-center">
          <p className="gold-gradient-text uppercase tracking-[0.2em] text-xs mb-3">Advisory</p>
          <h2 className="text-2xl md:text-3xl font-serif mb-4">Discuss Your Investment Strategy</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Our advisors can walk you through how this market trend applies to your specific portfolio goals. Book a consultation to get started.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-lsr-gold text-black px-8 py-3 text-sm uppercase tracking-widest font-bold hover:opacity-90 transition-opacity"
          >
            Book a Consultation
          </button>
        </div>

        {/* More posts */}
        {others.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-serif mb-8 border-b border-white/10 pb-4">More from LSR Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map(p => (
                <article key={p.id} className="border border-white/10 hover:border-lsr-gold/40 transition-all duration-300 group">
                  <Link to={`/blog/${p.id}`} className="block overflow-hidden h-36">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      draggable={false}
                      onContextMenu={e => e.preventDefault()}
                    />
                  </Link>
                  <div className="p-4">
                    <span className="gold-gradient-text text-xs uppercase tracking-widest font-semibold">{p.category}</span>
                    <h3 className="text-sm font-serif mt-2 leading-snug">
                      <Link to={`/blog/${p.id}`} className="hover:text-lsr-gold transition-colors">{p.title}</Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
