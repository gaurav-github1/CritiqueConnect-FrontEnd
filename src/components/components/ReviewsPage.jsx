import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: '2 weeks ago',
      rating: 5,
      category: 'technology',
      review: 'The feedback I received was incredibly detailed and helped me improve my project significantly. The reviewer was knowledgeable and provided actionable suggestions.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: '1 month ago',
      rating: 4,
      category: 'business',
      review: 'Great platform for getting honest reviews! The critique I received was constructive and helped me see blind spots in my business proposal.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      date: '3 days ago',
      rating: 5,
      category: 'technology',
      review: 'I was impressed by how quickly I received detailed feedback. The reviewer understood exactly what I was trying to achieve and provided valuable insights.'
    },
    {
      id: 4,
      name: 'Thomas Wright',
      avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
      date: '2 months ago',
      rating: 4,
      category: 'social',
      review: 'CritiqueConnect helped me refine my social media campaign strategy. The feedback was thoughtful and the reviewer had extensive knowledge in digital marketing.'
    },
    {
      id: 5,
      name: 'Aisha Patel',
      avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
      date: '1 week ago',
      rating: 5,
      category: 'business',
      review: 'The professional who reviewed my startup pitch deck transformed it completely. Their expertise was evident and the suggestions were practical.'
    }
  ];

  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : reviews.filter(review => review.category === activeTab);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-[#22d3ee]' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const tabs = ['all', 'technology', 'business', 'social'];

  return (
    <>
      <Navbar />
      <div className="bg-[#050505] min-h-screen pt-32 pb-16 font-ui relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
              Community <span className="text-[#22d3ee]">Testimonials</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-400 max-w-xl mx-auto">
              Real feedback from real professionals using the CritiqueConnect platform to elevate their craft.
            </motion.p>
          </div>

          {/* Aggregation Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0a0a0f] border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-2xl mb-12 p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center md:items-start text-center md:text-left shrink-0">
                <h2 className="text-6xl font-bold text-white mb-2">4.8<span className="text-xl text-gray-500">/5</span></h2>
                <div className="flex space-x-1 mb-2">{renderStars(5)}</div>
                <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Global Aggregation</p>
              </div>
              
              <div className="w-full flex-1 space-y-3 border-l-0 md:border-l border-[rgba(255,255,255,0.1)] pl-0 md:pl-8">
                {[5, 4, 3, 2, 1].map(num => {
                  const pct = num === 5 ? 70 : num === 4 ? 20 : num === 3 ? 7 : num === 2 ? 2 : 1;
                  return (
                    <div key={num} className="flex items-center text-sm">
                      <span className="font-mono text-gray-400 w-16 shrink-0">{num} STAR</span>
                      <div className="flex-1 bg-[#12121a] rounded-full h-1.5 mx-4 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 }} className="bg-[#22d3ee] h-full rounded-full" />
                      </div>
                      <span className="font-mono text-gray-400 w-10 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Sliding Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-[#12121a] border border-[rgba(255,255,255,0.04)] rounded-xl relative">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2.5 text-sm font-mono uppercase tracking-wider rounded-lg z-10 transition-colors ${activeTab === tab ? 'text-[#050505] font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  {activeTab === tab && (
                    <motion.div layoutId="tab-pill" className="absolute inset-0 bg-[#22d3ee] rounded-lg -z-10" transition={{ type: "spring", stiffness: 300, damping: 20 }} />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Staggered Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.05 }}
                  key={review.id}
                  className="bg-[#0a0a0f] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 hover:border-[#22d3ee]/30 transition-colors group flex flex-col"
                >
                  <div className="flex items-center mb-6">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-[rgba(255,255,255,0.1)] group-hover:border-[#22d3ee]/50 transition-colors" />
                    <div className="ml-4">
                      <h3 className="font-bold text-white">{review.name}</h3>
                      <div className="flex space-x-1 mt-1">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 italic relative">
                    <span className="absolute -top-3 -left-2 text-4xl text-[rgba(255,255,255,0.05)] font-serif">"</span>
                    {review.review}
                  </p>
                  <div className="flex justify-between items-center mt-auto border-t border-[rgba(255,255,255,0.04)] pt-4">
                    <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-[#22d3ee] bg-[#22d3ee]/10 rounded border border-[#22d3ee]/20">
                      {review.category}
                    </span>
                    <span className="text-xs font-mono text-gray-600">{review.date}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewsPage;