import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import SentimentDonutChart from './SentimentDonutChart';

const Review = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const email = currentUser?.email || location.state?.email;
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
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

  useEffect(() => {
    const fetchTasksWithCategories = async () => {
      if (!email) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const respCat = await axios.get(`https://critiquebackend.onrender.com/categories`);
        const userTasks = [];
        respCat.data.forEach((category) => {
          category.tasks.forEach((task) => {
            if (task.seeker === email) {
              userTasks.push({
                ...task,
                categoryName: category.category,
              });
            }
          });
        });
        setTasks(userTasks);
      } catch (error) {
        console.error('Error fetching categories and tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasksWithCategories();
  }, [email]);

  const fetchSummary = async (task) => {
    if (!task || !task.categoryName || !task.title) return;
    setSummaryLoading(true);
    setSummaryData(null);
    try {
      const response = await axios.post('https://critiquebackend.onrender.com/summary', {
        category: task.categoryName.toLowerCase(),
        title: task.title
      });
      setSummaryData(response.data);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setShowModal(true);
    fetchSummary(task);
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
            className="mb-10 text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Analytics & Feedback</h1>
            {email && (
              <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Target Profile: <span className="text-[#22d3ee]">{email}</span></p>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#22d3ee]/20 border-t-[#22d3ee] rounded-full animate-spin"></div>
              </motion.div>
            ) : tasks.length > 0 ? (
              <motion.div 
                key="tasks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-4"
              >
                {tasks.map((task, index) => (
                  <motion.div
                    key={task._id || task.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleTaskSelect(task)}
                    onHoverStart={() => setHoveredTaskId(task._id)}
                    onHoverEnd={() => setHoveredTaskId(null)}
                    className="group bg-[#0a0a0f] backdrop-blur-md rounded-xl p-6 shadow-md border border-[rgba(255,255,255,0.06)] hover:border-[#22d3ee]/40 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-transparent group-hover:bg-[#22d3ee] transition-colors" />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-2">{task.title}</h2>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-mono uppercase tracking-widest text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded">
                          {task.categoryName}
                        </span>
                        <p className="text-gray-400 mt-4 line-clamp-2 text-sm">{task.description}</p>
                      </div>
                      
                      <div className="flex flex-col items-end shrink-0 pl-4 border-l border-[rgba(255,255,255,0.1)]">
                        <div className="text-2xl font-bold text-white">{task.feedback?.length || 0}</div>
                        <div className="text-xs text-gray-500 font-mono uppercase">Critiques</div>
                        
                        <motion.div 
                          className="text-xs text-[#22d3ee] font-mono mt-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={{ x: hoveredTaskId === task._id ? -5 : 0 }}
                        >
                          View Report
                          <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#0a0a0f] rounded-2xl border border-[rgba(255,255,255,0.06)] p-16 text-center flex flex-col items-center"
              >
                <div className="w-24 h-24 mb-6 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">No data parameters</h3>
                <p className="text-gray-500 font-mono text-sm max-w-sm">No feedback instances detected for this profile entity. Please submit requests to begin aggregation.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showModal && selectedTask && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-50 z-20"></div>

              {/* Modal Header */}
              <div className="sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] p-6 z-10">
                <button
                  className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-2 pr-10">{selectedTask.title}</h2>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-0.5 text-xs font-mono uppercase text-[#22d3ee] border border-[#22d3ee]/20 bg-[#22d3ee]/10 rounded">
                    {selectedTask.categoryName}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-mono uppercase text-gray-400 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] rounded">
                    {selectedTask.feedback?.length || 0} reviews
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{selectedTask.description}</p>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1 bg-[#050505]" data-lenis-prevent="true">
                
                {/* AI Summary Section */}
                {summaryLoading ? (
                  <div className="mb-8 p-6 bg-[#0a0a0f] rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <div className="flex items-center mb-4">
                      <div className="w-5 h-5 border-2 border-[#22d3ee] border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="text-[#22d3ee] font-mono text-sm tracking-widest uppercase">Aggregating Analysis...</span>
                    </div>
                    {/* Shimmer text loader */}
                    <div className="space-y-3">
                      <div className="h-3 bg-[rgba(255,255,255,0.05)] rounded overflow-hidden relative">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
                      </div>
                      <div className="h-3 bg-[rgba(255,255,255,0.05)] rounded w-5/6 overflow-hidden relative">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
                      </div>
                      <div className="h-3 bg-[rgba(255,255,255,0.05)] rounded w-4/6 overflow-hidden relative">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
                      </div>
                    </div>
                  </div>
                ) : summaryData ? (
                  <div className="mb-10">
                    <SentimentDonutChart sentimentData={summaryData.sentiment_analysis} />
                    
                    <div className="mt-6 bg-[#0a0a0f] p-6 rounded-xl border border-[rgba(255,255,255,0.06)] relative group">
                      <h4 className="font-bold text-white mb-4 flex items-center text-lg">
                        <svg className="h-5 w-5 mr-2 text-[#22d3ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        GPT review
                      </h4>
                      <p className="text-gray-300 leading-relaxed text-sm format-quote">{summaryData.overall_summary}</p>
                    </div>
                    
                    {summaryData.improvement_points?.length > 0 && (
                      <div className="mt-6 bg-[#0a0a0f] p-6 rounded-xl border border-[rgba(255,255,255,0.06)]">
                        <h4 className="font-bold text-white mb-4 flex items-center text-lg">
                          <svg className="h-5 w-5 mr-2 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                          Identified Weaknesses
                        </h4>
                        <div className="space-y-3">
                          {summaryData.improvement_points.map((point, index) => (
                            <div key={index} className="flex items-start p-3 bg-[#12121a] rounded-lg border border-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.1)] transition-colors">
                              <div className="text-pink-400 mr-3 shrink-0">❖</div>
                              <p className="text-gray-400 text-sm">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
                
                {/* Raw Feedbacks */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider font-mono border-b border-[rgba(255,255,255,0.1)] pb-2 flex justify-between items-end">
                    Raw Feedbacks
                    <span className="text-xs text-gray-500 font-sans normal-case">Chronological order</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {selectedTask.feedback && selectedTask.feedback.length > 0 ? (
                      selectedTask.feedback.map((f, i) => (
                        <div key={f._id || i} className="bg-[#0a0a0f] p-6 rounded-xl border border-[rgba(255,255,255,0.04)]">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mr-3 font-mono text-sm border border-blue-500/30">
                              {f.participant.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-semibold text-sm">{f.participant}</div>
                              <div className="text-xs font-mono text-gray-500">USER_NODE_{i+1}</div>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed pl-11">{f.feedback}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500 font-mono text-sm">No data instances logged.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Review;
