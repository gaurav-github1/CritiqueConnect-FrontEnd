import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const features = [
  {
    number: '01',
    title: 'Precision Reviews',
    description: 'Get surgical feedback from verified domain experts. Turn vague opinions into actionable, concrete insights.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Rapid Deployment',
    description: 'Deploy your requests seamlessly. The community parses your context quickly and delivers targeted critiques.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Growth Analytics',
    description: 'Track your iterations through advanced sentiment models. Watch your concept evolve with metric-driven adjustments.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  }
];

const FeatureCard = ({ feature, index, inView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 * index, type: "spring", stiffness: 100, damping: 15 }}
      className="relative group h-full cursor-pointer"
    >
      <div className="relative h-full glass-dark specular-highlight rounded-3xl p-8 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Accent glow bloom on hover */}
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/15 rounded-full blur-2xl transition-all duration-700 pointer-events-none" />

        {/* Icon */}
        <div className="mb-6 w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)]/20 transition-colors duration-300">
          {feature.icon}
        </div>

        <div className="font-mono text-xs font-semibold text-gray-600 mb-3 tracking-widest">
          {feature.number}
        </div>
        <h3 className="text-xl font-bold text-[var(--text-on-dark)] mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
};

const AnimatedHero = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const titleWords = ["Refine.", "Iterate.", "Perfect."];
  const { currentUser } = useAuth();

  return (
    <>
      {/* ── HERO (Light) ──────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-40 md:pt-52 pb-8 font-ui overflow-hidden bg-[var(--surface-light)] z-10"
      >
        {/* Blurred orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[560px] pointer-events-none z-0">
          <div className="w-[560px] h-[560px] mx-auto bg-gradient-to-tr from-[var(--accent)] via-[#9c4dff] to-[#ff5089] rounded-full blur-[140px] mix-blend-multiply opacity-30 animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div style={{ y: contentY, opacity }} className="flex flex-col items-center justify-center text-center min-h-[55vh] pb-24">

            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-8 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[var(--accent)] bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/20"
            >
              Community-Powered Critique Platform
            </motion.span>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-8 leading-[1.0] tracking-tight flex flex-wrap justify-center gap-x-4">
              {titleWords.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 + index * 0.08 }}
                  className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-gray-500 max-w-2xl mb-12 font-medium leading-relaxed"
            >
              Connect your ideas with verified domain experts. Receive precise, structured feedback that transforms your work from good to exceptional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              {currentUser ? (
                // Logged-in: send to Dashboard
                <Link to="/dashboard" className="btn-apple !px-8 !py-4 text-base shadow-[0_8px_24px_rgba(10,132,255,0.35)]">
                  Go to Dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
              ) : (
                // Guest: show sign-up + reviews
                <>
                  <Link to="/signup" className="btn-apple !px-8 !py-4 text-base shadow-[0_8px_24px_rgba(10,132,255,0.35)]">
                    Get Started Free
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link to="/reviews" className="px-8 py-4 text-base font-semibold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 group">
                    See Reviews
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>


      </section>

      {/* ── WHAT SETS US APART (Dark) ──────────────── */}
      <section ref={featuresRef} className="relative bg-[var(--surface-panel)] py-32 font-ui overflow-hidden z-10">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <span className="inline-block mb-5 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[var(--accent)] bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/20">
              Platform Advantages
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-on-dark)] tracking-tight">
              What Sets Us <span className="text-[var(--accent)]">Apart</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} inView={featuresInView} />
            ))}
          </div>
        </div>


      </section>
    </>
  );
};

export default AnimatedHero;