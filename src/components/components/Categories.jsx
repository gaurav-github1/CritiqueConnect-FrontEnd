import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

// Define domain-specific colors for the glow
const domainColors = {
  'Technology': '#22d3ee', // Cyan
  'Business': '#4ade80',   // Green
  'Science': '#60a5fa',    // Blue
  'Art': '#f472b6',        // Pink
  'Education': '#fbbf24',  // Amber
  'Health': '#f87171',     // Red
  'Social': '#c084fc',     // Purple
  'Other': '#a3a3a3'       // Gray
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = Object.keys(domainColors);

  const handleProceed = () => {
    navigate('/seek-review', { state: { email, category: selectedCategory } });
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#050505] pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-ui">
        
        {/* Spotlight Grid Overlay */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(34, 211, 238, 0.08), transparent 80%)`
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        
        <div className="relative max-w-4xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Select Context Domain
            </h2>
            <p className="text-gray-400 max-w-xl">
              Categorize your project so we can route it to reviewers with the relevant domain expertise.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((cat, index) => (
              <CategoryCard 
                key={cat} 
                cat={cat} 
                index={index}
                isSelected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                color={domainColors[cat]}
              />
            ))}
          </motion.div>
          
          <AnimatePresence>
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="mt-16 flex justify-center fixed bottom-10 left-0 right-0 z-50 pointer-events-none"
              >
                <div className="pointer-events-auto relative group">
                  <div className="absolute -inset-1 bg-[#22d3ee] rounded-full blur-lg opacity-40 group-hover:opacity-70 transition duration-300"></div>
                  <button
                    onClick={handleProceed}
                    className="relative px-8 py-4 bg-[#0a0a0f] text-[#22d3ee] font-semibold rounded-full border border-[#22d3ee]/50 hover:bg-[#22d3ee]/10 transition-colors flex items-center shadow-2xl"
                  >
                    <span>Proceed with {selectedCategory}</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Extracted CategoryCard for 3D tilt, haptic clicks & particle bursts
const CategoryCard = ({ cat, isSelected, onClick, color, index }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 300, damping: 25 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring' }}
      className="perspective-[1000px] animate-float-bob"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative cursor-pointer p-6 rounded-2xl backdrop-blur-md shadow-lg border overflow-visible h-full flex flex-col items-center justify-center transition-all duration-300 ${
          isSelected 
            ? 'bg-[#12121a]' 
            : 'bg-[#0a0a0f] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.03)]'
        }`}
        style={{ borderColor: isSelected ? color : 'rgba(255,255,255,0.06)' }}
      >
        {/* Glow Bloom behind card when selected */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 blur-[60px] opacity-0 transition-opacity duration-500 rounded-full ${isSelected ? 'opacity-50' : 'opacity-0'}`}
          style={{ backgroundColor: color }}
        />
        
        {/* Particle Burst on Select */}
        <AnimatePresence>
          {isSelected && (
            <div className="absolute inset-0 pointer-events-none origin-center">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ 
                    x: Math.cos((i * 60) * Math.PI / 180) * 80, 
                    y: Math.sin((i * 60) * Math.PI / 180) * 80, 
                    opacity: 0, 
                    scale: 0 
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -ml-1 -mt-1"
                  style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="relative" style={{ transform: "translateZ(40px)" }}>
          <motion.div 
            animate={isSelected ? { rotate: 360, scale: 1.15 } : { rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${isSelected ? '' : 'bg-[rgba(255,255,255,0.03)]'}`}
            style={{ backgroundColor: isSelected ? `${color}20` : '' }}
          >
            {getCategoryIcon(cat, isSelected ? color : '#94a3b8')}
          </motion.div>
          
          <h3 className={`text-lg font-bold transition-colors text-center ${isSelected ? '' : 'text-gray-300'}`} style={{ color: isSelected ? color : '' }}>
            {cat}
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Helper function to get icons
function getCategoryIcon(category, color) {
  switch(category) {
    case 'Social': return <svg className="w-7 h-7" style={{color}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    case 'Business': return <svg className="w-7 h-7" style={{color}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case 'Technology': return <svg className="w-7 h-7" style={{color}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case 'Art': return <svg className="w-7 h-7" style={{color}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    case 'Science': return <svg className="w-7 h-7" style={{color}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
    case 'Health': return <svg className="w-7 h-7" style={{color}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
    case 'Education': return <svg className="w-7 h-7" style={{color}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
    default: return <svg className="w-7 h-7" style={{color}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
}
