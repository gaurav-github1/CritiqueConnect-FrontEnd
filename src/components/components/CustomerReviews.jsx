import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    position: 'Software Developer',
    rating: 5,
    review: 'The feedback I received was incredibly detailed and helped me improve my project significantly. The reviewer provided actionable suggestions that I could apply immediately.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    position: 'Startup Founder',
    rating: 4,
    review: 'Great platform for getting honest reviews! The critique I received was constructive and helped me see blind spots in my business proposal that I had completely missed.'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    position: 'UX Designer',
    rating: 5,
    review: 'I was impressed by how quickly I received detailed feedback. The reviewer truly understood what I was trying to achieve and provided insights that elevated the whole design.'
  },
  {
    id: 4,
    name: 'Arjun Mehta',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    position: 'Product Manager',
    rating: 5,
    review: 'CritiqueConnect transformed how I gather feedback. The structured format forces reviewers to be specific, which gives me actionable data rather than vague impressions.'
  },
  {
    id: 5,
    name: 'Priya Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    position: 'Research Analyst',
    rating: 4,
    review: 'The domain-expert routing is brilliant. My research was reviewed by someone who actually understood the field — the quality difference compared to random feedback is enormous.'
  },
];

const StarRating = ({ rating }) => (
  <div className="flex space-x-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-[var(--accent)]' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="w-[340px] md:w-[420px] flex-shrink-0 px-3">
    <div className="glass-dark specular-highlight rounded-[1.75rem] p-7 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      {/* Hover glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/5 rounded-full blur-3xl transition-all duration-700 pointer-events-none" />

      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center">
          <img className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 shadow-md" src={review.avatar} alt={review.name} />
          <div className="ml-3">
            <h3 className="font-semibold text-[var(--text-on-dark)] text-sm">{review.name}</h3>
            <p className="text-gray-500 text-xs">{review.position}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <p className="text-gray-400 text-sm leading-relaxed">
        "{review.review}"
      </p>
    </div>
  </div>
);

const CustomerReviews = () => {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: false });
  const repeatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section ref={sectionRef} className="relative bg-[var(--surface-panel)] py-28 overflow-hidden font-ui">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[var(--accent)]/4 blur-[120px] rounded-[100%] pointer-events-none" />
      {/* Left/right fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--surface-panel)] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--surface-panel)] to-transparent z-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-5 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[var(--accent)] bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/20">
            Community Voices
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-on-dark)] tracking-tight">
            What Our <span className="text-[var(--accent)]">Users Say</span>
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-gray-400 font-medium">
            Trusted by professionals across technology, business, design, and beyond.
          </p>
        </motion.div>
      </div>

      {/* Marquee — pure CSS animation for reliability */}
      <div className="relative overflow-hidden pb-4 pt-2">
        <div className="animate-marquee">
          {repeatedReviews.map((review, idx) => (
            <ReviewCard key={`${review.id}-${idx}`} review={review} />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 z-10 mt-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/reviews"
            className="inline-flex items-center text-[var(--accent)] font-semibold hover:text-blue-400 transition-colors group px-6 py-3 bg-[var(--accent)]/10 rounded-full hover:bg-[var(--accent)]/15 border border-[var(--accent)]/20"
          >
            See all reviews
            <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>

    </section>
  );
};

export default CustomerReviews;