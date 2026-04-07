import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence, useTransform } from 'framer-motion';

// ActionCard must be defined OUTSIDE Dashboard so React hooks work correctly
const ActionCard = ({ title, desc, icon, onClick, actionText, delay, colorClass, gradientClass }) => {
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useSpring(useTransform(cardX, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(cardY, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 25 });

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
      className="relative group perspective-[1000px] animate-float-bob"
      style={{ animationDelay: delay }}
    >
      <motion.div
        onClick={onClick}
        onMouseMove={handleHover}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="bg-[#0a0a0f] backdrop-blur-md rounded-xl shadow-md border border-[rgba(255,255,255,0.06)] overflow-hidden cursor-pointer h-full transition-shadow duration-300 relative"
      >
        <div className={`absolute top-0 right-0 w-48 h-48 opacity-0 group-hover:opacity-40 blur-[80px] transition-opacity duration-700 pointer-events-none ${colorClass}`} />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent group-hover:via-[#22d3ee]/30 transition-colors"></div>
        <div className="p-8 h-full flex flex-col relative z-10" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center mb-6">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.15 }}
              className={`p-4 rounded-full mr-5 border border-[rgba(255,255,255,0.06)] ${gradientClass} flex items-center justify-center`}
            >
              {icon}
            </motion.div>
            <h3 className="font-bold text-xl text-gray-200 group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
          </div>
          <p className="text-gray-400 mb-8 flex-1 leading-relaxed">{desc}</p>
          <div className="flex justify-end mt-auto">
            <span className="text-[#22d3ee] font-medium flex items-center group/arrow">
              {actionText}
              <div className="relative w-5 h-5 ml-1">
                <svg className="absolute inset-0 opacity-0 group-hover/arrow:opacity-40 transform group-hover/arrow:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                <svg className="absolute inset-0 transform group-hover/arrow:translate-x-2 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
  
  // Spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  // Must be called at top level, not inside JSX
  const spotlightBg = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(34, 211, 238, 0.08), transparent 80%)`;
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const fullText = "Welcome to CritiqueConnect!";
    let currentText = "";
    let i = 0;
    
    // reset
    setWelcomeText("");
    
    const interval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setWelcomeText(currentText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);

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
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="relative flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full border border-[#22d3ee] w-12 h-12"
          />
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute rounded-full border border-[#22d3ee] w-16 h-16"
          />
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute rounded-full border border-[#22d3ee] w-20 h-20"
          />
          <div className="w-4 h-4 bg-[#22d3ee] rounded-full shadow-[0_0_15px_#22d3ee]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#050505] pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-ui">
        
        {/* Spotlight Grid Overlay */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: spotlightBg }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="mb-16 animate-float-bob"
            style={{ animationDuration: '4s' }}
          >
            <div className="bg-transparent rounded-2xl p-4 md:p-1">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[rgba(255,255,255,0.06)] pb-8">
                <div>
                  <h1 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight flex items-center h-10">
                    {welcomeText}
                    <motion.span 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ duration: 0.8, repeat: Infinity }} 
                      className="inline-block w-3 h-8 bg-[#22d3ee] ml-1"
                    />
                  </h1>
                  
                  {email && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-6 flex flex-col space-y-2"
                    >
                      <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Authenticated Session</span>
                      <span className="font-mono text-[#22d3ee] bg-[#22d3ee]/10 px-3 py-1 rounded inline-block w-max border border-[#22d3ee]/20 text-sm">
                        {email}
                      </span>
                    </motion.div>
                  )}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 md:mt-0"
                >
                  <button 
                    onClick={handleCheckTasks}
                    disabled={isTasksLoading}
                    className="px-6 py-3 bg-[#0a0a0f] text-gray-300 font-medium rounded-lg border border-[rgba(255,255,255,0.1)] hover:border-[#22d3ee]/50 hover:text-white transition-all duration-300 flex items-center space-x-2 relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[#22d3ee]/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                    {isTasksLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-[#22d3ee] border-t-transparent rounded-full mr-2"></div>
                        <span className="relative z-10">Syncing...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">View Logged Tasks</span>
                        <svg className="h-5 w-5 text-[#22d3ee] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              delay="0s"
              title="Seek a Review"
              desc="Deploy your work and request targeted critiques from the community."
              actionText="Deploy request"
              onClick={handleSeekReview}
              colorClass="bg-[#22d3ee]"
              gradientClass="bg-[#22d3ee]/10"
              icon={<svg className="h-6 w-6 text-[#22d3ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
            />
            
            <ActionCard
              delay="0.3s"
              title="Provide Review"
              desc="Review pending submissions and contribute your expertise."
              actionText="Access queue"
              onClick={handleProvideReview}
              colorClass="bg-purple-500"
              gradientClass="bg-purple-500/10"
              icon={<svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
            
            <ActionCard
              delay="0.6s"
              title="Context Domains"
              desc="Browse categories and align your requests with the right reviewers."
              actionText="Explore domains"
              onClick={() => navigate("/categories", { state: { email } })}
              colorClass="bg-pink-500"
              gradientClass="bg-pink-500/10"
              icon={<svg className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            />
          </div>
        </div>
      </div>

      {/* Spring Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#0a0a0f] rounded-2xl border border-[rgba(255,255,255,0.1)] shadow-[0_0_80px_rgba(34,211,238,0.1)] p-8 max-w-md w-full relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              {/* Modal top glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-50"></div>
              
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-6 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30">
                <svg className="h-6 w-6 text-[#22d3ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-white text-center mb-3">System Notification</h2>
              <p className="text-gray-400 text-center mb-8 leading-relaxed">
                {errorMessage || "You currently don't have any pending tasks in the queue. Submit a request to begin."}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <motion.button
                  className="px-5 py-2.5 bg-transparent border border-[rgba(255,255,255,0.1)] text-gray-300 rounded-lg hover:text-white transition-colors flex-1"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: [1, 0.95, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  Dismiss
                </motion.button>
                <motion.button
                  className="px-5 py-2.5 bg-[#22d3ee] text-[#050505] font-semibold rounded-lg hover:bg-[#67e8f9] transition-colors flex-1"
                  onClick={() => { setShowModal(false); handleSeekReview(); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: [1, 0.95, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  Add Task
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Dashboard;
