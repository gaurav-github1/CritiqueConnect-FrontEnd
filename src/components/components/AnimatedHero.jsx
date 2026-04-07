import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedHero = () => {
  const heroRef = useRef(null);
  
  // Spotlight / Cursor Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax Scroll for grid
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  // Stagger Title Words
  const rawTitle = "Ideas meet feedback, success follows.";
  const titleWords = rawTitle.split(" ");
  
  const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.1, triggerOnce: false });

  const features = [
    { number: '01', title: 'Tailored Feedback', description: 'Request specific types of critiques (technical, design, UX), allowing for highly focused insights.' },
    { number: '02', title: 'Diverse Expert Pool', description: 'Connect with a community of diverse experts from different domains who bring unique knowledge.' },
    { number: '03', title: 'Structured Process', description: 'Receive feedback in a structured format broken down into actionable parts to implement.' }
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-[#050505] font-ui pt-32 pb-20 px-4">
      
      {/* Background Layer: Retro Grid + Spotlight */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ scale: gridScale }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </motion.div>
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(34, 211, 238, 0.1), transparent 80%)`
        }}
      />
      
      {/* Main content */}
      <div className="container mx-auto relative z-10">
        
        {/* Hero Section */}
        <motion.div style={{ y: contentY }} className="flex flex-col items-center justify-center text-center mb-32 min-h-[60vh]">
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight max-w-4xl flex flex-wrap justify-center relative">
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: index * 0.07 }}
                className="mr-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="absolute -bottom-4 left-1/2 h-[3px] bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
              style={{ width: '60%', transformOrigin: "center", translateX: "-50%" }}
            />
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl text-gray-400 max-w-2xl mb-12"
          >
            Connect to share your vision, receive genuine thoughtful feedback, and grow your ideas beyond boundaries.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 1 }}
            className="mb-16 relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 600, damping: 20 } }}
          >
            {/* Animated Border Beam */}
            <div className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,transparent_0_340deg,#22d3ee_360deg)] animate-[spin_3s_linear_infinite] opacity-50 mask-image-[radial-gradient(closest-side,transparent_70%,black_100%)]"></div>
            
            <Link 
              to="/signup" 
              className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold overflow-hidden rounded-full bg-[#0a0a0f] text-[#22d3ee] border border-[#22d3ee]/30 transition-all duration-300 group-hover:bg-[#22d3ee]/10 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <div ref={featuresRef} className="mt-20 pb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-white"
          >
            What sets us apart
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} inView={featuresInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Extracted FeatureCard for 3D hover handling
const FeatureCard = ({ feature, index, inView }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 25 });

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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 * index }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
      }}
      className="relative group h-full cursor-pointer"
    >
      <div className="absolute inset-0 bg-[#22d3ee]/5 rounded-2xl blur-xl group-hover:opacity-100 transition-opacity duration-500 opacity-0 transform -translate-y-2" />
      <div className="relative h-full bg-[#0a0a0f] backdrop-blur-md border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 transition-all duration-300 group-hover:border-[#22d3ee]/30 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] overflow-hidden">
        
        {/* Glow behind number */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#22d3ee]/10 rounded-full blur-2xl group-hover:bg-[#22d3ee]/20 transition-colors"></div>

        <div className="font-mono text-4xl font-bold text-[rgba(255,255,255,0.1)] mb-6 group-hover:text-[#22d3ee]/30 transition-colors">
          {feature.number}
        </div>
        <h3 className="text-xl font-bold text-gray-200 mb-4">{feature.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
};

export default AnimatedHero;