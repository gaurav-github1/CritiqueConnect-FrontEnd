import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

const ProjectForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const email = currentUser?.email;
  
  const categoryFromState = location.state?.category?.toLowerCase();
  const [category, setCategory] = useState(categoryFromState || '');
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'problem',
    link: '',
    statement: '',
    description: '',
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
  }, [mouseX, mouseY]);
  
  useEffect(() => {
    if (!categoryFromState) {
      setError('No category selected. Please choose a category first.');
    }
  }, [categoryFromState]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('You must be logged in to submit a review request.');
      return;
    }
    if (!category) {
      setError('Category is required. Please go back and select a category.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const task = {
      title: formData.title,
      type: formData.type,
      url: formData.link,
      description: formData.description || formData.statement,
    };
    
    try {
      await axios.post('https://critiquebackend.onrender.com/categories/task', {
        category,
        seeker: email,
        task,
      });
      // Trigger Success Animation instead of instant navigate
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3500); // Navigate after success anim finishes
    } catch (error) {
      setError('Failed to submit the task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, staggerChildren: 0.1 } }
  };
  
  const inputVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  // Generate confetti items
  const confettiCount = 50;
  const confettiVariants = {
    hidden: { opacity: 0, scale: 0, y: 0, x: 0 },
    visible: (i) => ({
      opacity: [1, 1, 0],
      scale: [0, Math.random() * 0.8 + 0.4, 0],
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800 - 200,
      rotate: Math.random() * 360 * 2,
      transition: { duration: 2.5 + Math.random() * 1, ease: "easeOut" }
    })
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

        <div className="relative max-w-3xl mx-auto z-10 min-h-[60vh] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-[#0a0a0f] backdrop-blur-xl border border-[#22d3ee]/40 rounded-2xl p-12 text-center shadow-[0_0_80px_rgba(34,211,238,0.2)] relative w-full"
              >
                {/* Confetti */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                  {[...Array(confettiCount)].map((_, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={confettiVariants}
                      initial="hidden"
                      animate="visible"
                      className="absolute top-1/2 left-1/2 w-3 h-3 origin-center"
                      style={{
                        backgroundColor: ['#22d3ee', '#c084fc', '#4ade80', '#fbbf24', '#f472b6'][i % 5],
                        borderRadius: i % 2 === 0 ? '50%' : '2px'
                      }}
                    />
                  ))}
                </div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                  className="w-24 h-24 mx-auto bg-[#22d3ee]/10 rounded-full flex items-center justify-center border border-[#22d3ee]/30 mb-6 relative"
                >
                  <div className="absolute inset-0 bg-[#22d3ee] rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <svg className="w-12 h-12 text-[#22d3ee] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                <h2 className="text-3xl font-bold text-white mb-4">Request Deployed!</h2>
                <p className="text-gray-400">Your task has been successfully submitted to the {category} reviewers queue. Redirecting you to the dashboard...</p>
                <div className="mt-8 w-full bg-[#12121a] h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "100%" }} 
                    transition={{ duration: 3.5, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-transparent via-[#22d3ee] to-[#22d3ee]"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
                className="bg-[#0a0a0f] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-xl p-8 md:p-10 w-full relative"
              >
                {/* Form Top Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-50"></div>
                
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-white mb-2">Prepare Deployment</h2>
                  <p className="text-[#22d3ee] font-mono text-sm tracking-widest uppercase">Target Domain: {category || 'UNKNOWN'}</p>
                </div>
                
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm text-center">
                    {error}
                  </motion.div>
                )}
                
                {!categoryFromState ? (
                  <div className="text-center py-10">
                    <p className="text-gray-400 mb-6">No context domain specified. Please map your request first.</p>
                    <button onClick={() => navigate('/categories')} className="px-6 py-3 bg-[#22d3ee]/10 text-[#22d3ee] font-medium border border-[#22d3ee]/30 rounded-lg hover:bg-[#22d3ee]/20 transition-colors">
                      Map Domain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
                    <motion.div variants={inputVariants} className="group relative">
                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1 block group-focus-within:text-[#22d3ee] transition-colors">Request Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} required className="w-full bg-[#12121a] border border-[rgba(255,255,255,0.1)] text-white rounded-lg p-3 outline-none focus:border-[#22d3ee] transition-colors">
                          <option value="problem">Problem Solving</option>
                          <option value="idea">Idea Validation</option>
                          <option value="survey">Market Survey</option>
                        </select>
                    </motion.div>

                    <motion.div variants={inputVariants} className="group relative">
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1 block group-focus-within:text-[#22d3ee] transition-colors">Identifier (Title)</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Enter a concise title" className="w-full bg-[#12121a] border border-[rgba(255,255,255,0.1)] text-white rounded-lg p-3 outline-none focus:border-[#22d3ee] transition-colors" />
                    </motion.div>

                    {formData.type === 'problem' && (
                      <motion.div variants={inputVariants} className="group relative">
                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1 block group-focus-within:text-[#22d3ee] transition-colors">Problem Statement</label>
                        <textarea name="statement" value={formData.statement} onChange={handleChange} required placeholder="Detail the parameters of your problem..." rows="4" className="w-full bg-[#12121a] border border-[rgba(255,255,255,0.1)] text-white rounded-lg p-3 outline-none focus:border-[#22d3ee] transition-colors resize-none"></textarea>
                      </motion.div>
                    )}

                    {formData.type === 'idea' && (
                      <>
                        <motion.div variants={inputVariants} className="group relative">
                          <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1 block group-focus-within:text-[#22d3ee] transition-colors">External Reference (URL)</label>
                          <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://" className="w-full bg-[#12121a] border border-[rgba(255,255,255,0.1)] text-white rounded-lg p-3 outline-none focus:border-[#22d3ee] transition-colors" />
                        </motion.div>
                        <motion.div variants={inputVariants} className="group relative">
                          <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1 block group-focus-within:text-[#22d3ee] transition-colors">Idea Breakdown</label>
                          <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the core mechanism of your idea" rows="4" className="w-full bg-[#12121a] border border-[rgba(255,255,255,0.1)] text-white rounded-lg p-3 outline-none focus:border-[#22d3ee] transition-colors resize-none"></textarea>
                        </motion.div>
                      </>
                    )}

                    {formData.type === 'survey' && (
                      <>
                        <motion.div variants={inputVariants} className="group relative">
                          <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1 block group-focus-within:text-[#22d3ee] transition-colors">Survey Brief</label>
                          <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Why are you conducting this survey?" rows="3" className="w-full bg-[#12121a] border border-[rgba(255,255,255,0.1)] text-white rounded-lg p-3 outline-none focus:border-[#22d3ee] transition-colors resize-none"></textarea>
                        </motion.div>
                        <motion.div variants={inputVariants} className="group relative">
                          <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1 block group-focus-within:text-[#22d3ee] transition-colors">Survey Endpoint (URL)</label>
                          <input type="url" name="link" value={formData.link} onChange={handleChange} required placeholder="https://" className="w-full bg-[#12121a] border border-[rgba(255,255,255,0.1)] text-white rounded-lg p-3 outline-none focus:border-[#22d3ee] transition-colors" />
                        </motion.div>
                      </>
                    )}

                    <motion.div variants={inputVariants} className="pt-4 flex justify-between gap-4 mt-auto">
                      <button type="button" onClick={() => navigate('/categories')} className="px-6 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors flex-1">
                        Abort
                      </button>
                      <button type="submit" disabled={isSubmitting} className="relative px-6 py-3 bg-[#22d3ee] text-[#050505] font-bold rounded-lg hover:bg-[#67e8f9] transition-colors disabled:opacity-50 flex-[2] flex justify-center items-center overflow-hidden border border-transparent hover:border-white/20">
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-[#050505] border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          "Initiate Deployment"
                        )}
                      </button>
                    </motion.div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;