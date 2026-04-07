import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence, useTransform } from 'framer-motion';

// ActionCard using Dark Liquid Glass
const ActionCard = ({ title, desc, icon, onClick, actionText, delay, colorClass, gradientClass, ringClass }) => {
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useSpring(useTransform(cardY, [-0.5, 0.5], [6, -6]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(cardX, [-0.5, 0.5], [-6, 6]), { stiffness: 400, damping: 30 });

  const handleHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardX.set(x);
    cardY.set(y);
  };

  const handleLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  return (
    <motion.div
      className="relative group perspective-[1000px] animate-float"
      style={{ animationDelay: delay }}
    >
      <motion.div
        onClick={onClick}
        onMouseMove={handleHover}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`glass-dark specular-highlight rounded-2xl overflow-hidden cursor-pointer h-full transition-all duration-500 relative hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${ringClass}`}
      >
        {/* Active Glow Bloom */}
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-0 group-hover:opacity-30 blur-[100px] transition-opacity duration-700 pointer-events-none ${colorClass}`} />
        
        <div className="p-8 h-full flex flex-col relative z-10" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center mb-6">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.15 }}
              className={`p-4 rounded-full mr-5 border border-[var(--border-subtle)] ${gradientClass} flex items-center justify-center`}
            >
              {icon}
            </motion.div>
            <h3 className="font-bold text-xl text-[var(--text-on-dark)] group-hover:text-white transition-colors duration-300 tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-gray-400 mb-8 flex-1 leading-relaxed font-medium">{desc}</p>
          <div className="flex justify-end mt-auto">
            <span className={`font-semibold flex items-center group/arrow transition-colors ${colorClass.replace('bg-', 'text-')}`}>
              {actionText}
              <div className="relative w-5 h-5 ml-1">
                <svg className="absolute inset-0 opacity-0 group-hover/arrow:opacity-60 transform group-hover/arrow:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                <svg className="absolute inset-0 transform group-hover/arrow:translate-x-2 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </div>
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const email = currentUser?.email;
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  
  // Spotlight effect (visionOS depth)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  // Using Apple Blue rgba(10, 132, 255)
  const spotlightBg = useMotionTemplate`radial-gradient(1000px circle at ${springX}px ${springY}px, rgba(10, 132, 255, 0.08), transparent 70%)`;
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fullText = "Welcome to CritiqueConnect.";
    let currentText = "";
    let i = 0;
    setWelcomeText("");
    const interval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setWelcomeText(currentText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  const handleSeekReview = () => navigate('/categories', { state: { email } });
  const handleProvideReview = () => navigate('/provide-review', { state: { email } });

  const handleCheckTasks = async () => {
    if (!email) {
      setErrorMessage('You must be logged in to view tasks');
      setShowModal(true);
      return;
    }
    try {
      setIsTasksLoading(true);
      const response = await axios.get(`https://critiquebackend.onrender.com/categories/feedbacks/${email}`);
      const fetchedTasks = response.data || [];
      setTasks(fetchedTasks);
      
      if (fetchedTasks.length > 0) {
        navigate('/review', { state: { email } });
      } else {
        setErrorMessage('No tasks found. Try submitting a project to get started.');
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to load tasks. Please try again.');
      setShowModal(true);
    } finally {
      setIsTasksLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--surface-dark)]">
        <div className="relative flex items-center justify-center">
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="absolute rounded-full border border-[var(--accent)] w-12 h-12" />
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute rounded-full border border-[var(--accent)] w-16 h-16" />
          <div className="w-4 h-4 bg-[var(--accent)] rounded-full shadow-[0_0_15px_var(--accent)]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[var(--surface-dark)] pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-ui">
        
        {/* Soft Background Depth */}
        <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ background: spotlightBg }} />
        
        {/* Apple faint grid */}
        <div className="absolute inset-0 opacity-[0.02] z-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto pt-8">
          {/* Welcome Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="mb-20 animate-float"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--border-subtle)] pb-10">
              <div>
                <h1 className="text-4xl font-extrabold sm:text-5xl text-[var(--text-on-dark)] tracking-tight flex items-center">
                  {welcomeText}
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ duration: 0.8, repeat: Infinity }} 
                    className="inline-block w-4 h-10 bg-[var(--accent)] ml-2 rounded-sm"
                  />
                </h1>
                
                {email && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6 flex flex-col space-y-2">
                    <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Verified Session</span>
                    <span className="font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-md inline-block w-max border border-[var(--accent)]/20 text-sm">
                      {email}
                    </span>
                  </motion.div>
                )}
              </div>
              
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="mt-8 md:mt-0">
                <button 
                  onClick={handleCheckTasks}
                  disabled={isTasksLoading}
                  className="px-6 py-4 glass-dark specular-highlight text-[var(--text-on-dark)] font-semibold rounded-2xl hover:bg-white/5 transition-all duration-300 flex items-center space-x-3 relative group overflow-hidden border-0 ring-1 ring-[var(--border-subtle)] hover:ring-[var(--accent)]/50 shadow-lg"
                >
                  <div className="absolute inset-0 bg-[var(--accent)]/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                  {isTasksLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-[var(--accent)] border-t-transparent rounded-full mr-2 relative z-10"></div>
                      <span className="relative z-10">Syncing Engine...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Launch Task Log</span>
                      <svg className="h-5 w-5 text-[var(--accent)] relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ActionCard
              delay="0s"
              title="Seek a Review"
              desc="Deploy your work and request targeted critiques from the community."
              actionText="Deploy request"
              onClick={handleSeekReview}
              colorClass="bg-[var(--accent)]"
              gradientClass="bg-[var(--accent)]/10"
              ringClass="hover:ring-1 hover:ring-[var(--accent)]"
              icon={<svg className="h-6 w-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
            />
            
            <ActionCard
              delay="0.2s"
              title="Provide Review"
              desc="Review pending submissions and contribute your expertise."
              actionText="Access queue"
              onClick={handleProvideReview}
              colorClass="bg-purple-500"
              gradientClass="bg-purple-500/10"
              ringClass="hover:ring-1 hover:ring-purple-500"
              icon={<svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
            
            <ActionCard
              delay="0.4s"
              title="Context Domains"
              desc="Browse categories and align your requests with the right reviewers."
              actionText="Explore domains"
              onClick={() => navigate("/categories", { state: { email } })}
              colorClass="bg-pink-500"
              gradientClass="bg-pink-500/10"
              ringClass="hover:ring-1 hover:ring-pink-500"
              icon={<svg className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            />
          </div>
        </div>
      </div>

      {/* Spring Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-dark specular-highlight rounded-3xl p-10 max-w-md w-full relative overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)] opacity-80"></div>
              
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-6 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30">
                <svg className="h-7 w-7 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-[var(--text-on-dark)] text-center mb-3">System Notice</h2>
              <p className="text-gray-400 text-center mb-8 leading-relaxed font-medium">
                {errorMessage || "You currently don't have any pending tasks in the queue. Submit a request to begin."}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  className="px-6 py-3 bg-[var(--border-subtle)] text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Dismiss
                </button>
                <button
                  className="btn-apple !py-3 flex-1 text-base shadow-lg shadow-[var(--accent)]/20"
                  onClick={() => { setShowModal(false); handleSeekReview(); }}
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Dashboard;
