import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

function ProvideReview() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedback, setFeedback] = useState('');
  const { currentUser } = useAuth();
  const email = currentUser?.email;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Spotlight effect
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

  const fetchCategoriesData = async () => {
    setLoading(true);
    setError('');
    if (!email) {
      setLoading(false);
      setError('User not logged in. Please log in to view tasks.');
      return;
    }
    
    try {
      const response = await axios.get(`https://critiquebackend.onrender.com/categories/provider/${email}`);
      if (!response.data || !Array.isArray(response.data)) {
        setError('Received invalid data format from server');
        setTasks([]);
        return;
      }
      
      const taskList = response.data.flatMap((categoryItem) => {
        if (!categoryItem.tasks || !Array.isArray(categoryItem.tasks)) return [];
        return categoryItem.tasks.map((task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          category: categoryItem.category,
        }));
      });
      setTasks(taskList);
    } catch (error) {
      const backendMsg = error.response?.data?.message || error.response?.data?.error;
      const errMsg = backendMsg || (error.response?.status === 404 ? 'No tasks found or provider not yet registered.' : `Server error: ${error.response?.status}.`) || 'Error fetching tasks.';
      
      if (error.response?.status === 404 && !backendMsg) {
        // If it's a 404 with no specific message, it often just means no tasks are in the queue.
        // We can just leave tasks empty and avoid a scary red error.
        setTasks([]);
        setError('');
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('https://critiquebackend.onrender.com/categories/task/feedback', {
        category: selectedTask.category,
        email: email,
        title: selectedTask.title,
        feedback,
      });
      // Show success pop animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedTask(null);
        setFeedback('');
        fetchCategoriesData();
      }, 2000);
    } catch (error) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxChars = 2000;
  const charsLeft = maxChars - feedback.length;

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
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center py-32">
                <div className="w-16 h-16 border-4 border-[#22d3ee]/20 border-t-[#22d3ee] rounded-full animate-spin"></div>
              </motion.div>
            ) : selectedTask ? (
              showSuccess ? (
                <motion.div
                  key="successMessage"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#0a0a0f] backdrop-blur-xl border border-[#4ade80]/40 rounded-2xl p-12 text-center shadow-[0_0_80px_rgba(74,222,128,0.2)] max-w-lg mx-auto mt-10"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 mx-auto bg-[#4ade80]/10 rounded-full flex items-center justify-center border border-[#4ade80]/30 mb-6"
                  >
                    <svg className="w-10 h-10 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Feedback Sent!</h2>
                  <p className="text-gray-400">Your critique has been successfully logged.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="feedback-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0a0a0f] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-xl p-8 relative"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-50"></div>
                  
                  <button onClick={() => setSelectedTask(null)} className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back
                  </button>

                  <h2 className="text-2xl font-bold text-white text-center mb-8 mt-4">Critique Subsystem</h2>
                  
                  <div className="mb-8 p-6 bg-[#12121a] rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-[#22d3ee]">{selectedTask.title}</h3>
                      <span className="px-3 py-1 text-xs font-mono text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded">{selectedTask.category}</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {selectedTask.description}
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="relative group mb-6">
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block group-focus-within:text-[#22d3ee] transition-colors">Your Critique</label>
                      <textarea
                        className="w-full p-4 border border-[rgba(255,255,255,0.1)] rounded-lg bg-[#12121a] text-gray-200 focus:outline-none focus:border-[#22d3ee] transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
                        rows="8"
                        maxLength={maxChars}
                        placeholder="// write your analysis here..."
                        required
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      ></textarea>
                      <div className="absolute bottom-4 right-4 flex items-center">
                        <span className={`text-xs font-mono ${charsLeft < 100 ? 'text-red-400' : 'text-gray-500'}`}>
                          {charsLeft} chars remaining
                        </span>
                      </div>
                    </div>
                    
                    {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm text-center">{error}</div>}
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting || feedback.trim().length === 0}
                        className="px-8 py-3 bg-[#22d3ee] text-[#050505] font-bold rounded-lg hover:bg-[#67e8f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmitting ? (
                          <><div className="w-4 h-4 border-2 border-[#050505] border-t-transparent rounded-full animate-spin mr-2"></div>Transmitting...</>
                        ) : (
                          <>Dispatch Critique <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )
            ) : (
              // Task list
              <motion.div key="task-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-extrabold text-white mb-4">Pending Requests Queue</h2>
                  <p className="text-gray-400 max-w-xl mx-auto">Select a module to review and provide your critique.</p>
                </div>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 text-red-500 rounded-lg flex items-center justify-center text-sm font-mono tracking-wide">
                    ⚠️ {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        onClick={() => setSelectedTask(task)}
                        className="group bg-[#0a0a0f] backdrop-blur-md rounded-xl shadow-md border border-[rgba(255,255,255,0.06)] hover:border-[#22d3ee]/40 overflow-hidden cursor-pointer flex p-5 relative"
                      >
                        {/* Hover line indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-[#22d3ee] transition-colors"></div>
                        
                        <div className="flex-1 pl-2">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">{task.title}</h3>
                            <span className="px-2 py-1 text-[10px] uppercase font-mono tracking-widest text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded">
                              {task.category}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm line-clamp-2">{task.description}</p>
                        </div>
                        <div className="self-center ml-4 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <svg className="w-5 h-5 text-[#22d3ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a0a0f] rounded-xl border border-[rgba(255,255,255,0.06)] p-12 text-center flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <h3 className="text-lg font-semibold text-gray-400 mb-2">Queue is Empty</h3>
                      <p className="text-gray-600 font-mono text-sm">No pending requests matched your provider profile.</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default ProvideReview;