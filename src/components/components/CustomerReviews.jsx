import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CustomerReviews = () => {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      position: 'Software Developer',
      rating: 5,
      review: 'The feedback I received was incredibly detailed and helped me improve my project significantly. The reviewer provided actionable suggestions.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      position: 'Startup Founder',
      rating: 4,
      review: 'Great platform for getting honest reviews! The critique I received was constructive and helped me see blind spots in my business proposal.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      position: 'UX Designer',
      rating: 5,
      review: 'I was impressed by how quickly I received detailed feedback. The reviewer understood exactly what I was trying to achieve and provided insights.'
    }
  ];

  const repeatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section ref={sectionRef} className="relative py-24 bg-[#050505] overflow-hidden font-ui">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold mb-6 text-white">
            What Our Users Say
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            Trusted by professionals and students across various domains.
          </p>
        </motion.div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative flex overflow-x-hidden group pb-12">
        {/* Glow behind cards */}
        <div className="absolute top-1/2 left-1/4 w-[600px] h-32 bg-[#22d3ee]/5 blur-[100px] rounded-[100%] pointer-events-none z-0"></div>

        <motion.div
          className="flex space-x-6 z-10 px-3 cursor-grab active:cursor-grabbing"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          // Pause on hover
          whileHover={{ animationPlayState: "paused" }} 
        >
          {repeatedReviews.map((review, idx) => (
            <div key={`${review.id}-${idx}`} className="w-[350px] md:w-[450px] flex-shrink-0">
              <div 
                className="bg-[#0a0a0f]/60 backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 h-full transition-all duration-300 hover:border-[#22d3ee]/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] relative overflow-hidden group/card"
              >
                {/* Subtle top border illumination */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent group-hover/card:via-[#22d3ee]/50 transition-colors"></div>

                <div className="flex flex-col text-left h-full">
                  <div className="flex items-center mb-6">
                    <img className="w-14 h-14 rounded-full object-cover border border-[rgba(255,255,255,0.1)]" src={review.avatar} alt={review.name} />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-200">{review.name}</h3>
                      <p className="text-gray-500 text-sm hidden sm:block">{review.position}</p>
                    </div>
                    <div className="font-mono text-[#22d3ee] tracking-widest text-lg">
                      {Array.from({ length: 5 }).map((_, i) => i < review.rating ? '★' : '☆').join('')}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed flex-1">
                    "{review.review}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/reviews" 
            className="inline-flex items-center text-[#22d3ee] font-medium hover:text-white transition-colors group px-4 py-2 border border-[#22d3ee]/30 rounded-full hover:bg-[#22d3ee]/10"
          >
            See more reviews
            <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;