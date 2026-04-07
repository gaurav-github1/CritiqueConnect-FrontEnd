import React, { useState, useRef, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Utils/firebase";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const SignUp = ({ isLogin: initialIsLogin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(initialIsLogin); // Use the prop as initial state
  const [error, setError] = useState(''); // State for storing error messages
  const [userType, setUserType] = useState('professional'); // student or professional
  const [organization, setOrganization] = useState(''); // Organization name if professional
  const [linkdedin, setLinkedin] = useState(''); // Organization name if professional
  const [domains, setDomains] = useState([]); // Array to hold the selected domains
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  
  // Refs for animations
  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const streaksRef = useRef(null);
  const orbitRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  // Get the 'from' location from state, or default to dashboard
  const from = location.state?.from || '/dashboard';
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 20 
      }
    }
  };
  
  // Handle mouse movement for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      setMousePosition({
        x: (clientX - centerX) / centerX,
        y: (clientY - centerY) / centerY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // GSAP animations for light streaks
    if (streaksRef.current) {
      const streaks = streaksRef.current.children;
      gsap.set(streaks, {
        opacity: 0,
        x: (i) => -100 + (i * 30),
        y: (i) => 50 + (i * 20),
        scale: 0.5
      });
      
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      
      tl.to(streaks, {
        opacity: 0.6,
        x: "+=300",
        y: "-=150", 
        scale: 1.2,
        stagger: 0.3,
        duration: 2,
        ease: "power2.out"
      }).to(streaks, {
        opacity: 0,
        x: "+=200",
        duration: 1,
        stagger: 0.2,
        ease: "power1.in"
      }, "-=1");
    }
    
    // Orbit animation
    if (orbitRef.current) {
      const orbitElements = orbitRef.current.children;
      
      gsap.to(orbitElements, {
        rotation: (i) => i % 2 === 0 ? 360 : -360,
        transformOrigin: "center center",
        duration: (i) => 15 + i * 5,
        repeat: -1,
        ease: "none"
      });
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email format (basic validation)
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
  
    setError(''); // Clear any previous error messages
    setLoading(true);
  
    try {
    if (isLogin) {
      // Login user
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in:', { email });
        
        // Success animation
        gsap.to("#auth-form", {
          y: -20,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            navigate(from); // Redirect to the intended page after login
          }
        });
    } else {
      // Sign up user
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
          setLoading(false);
        return;
      }
  
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User registered in Firebase:', { email });
  
        // Handle additional user info based on user type
        if ((userType === ('professional'||'student')) && organization && domains.length > 0 && linkdedin) {
          console.log('User is a professional:', { organization, domains });
          const response = await fetch('https://critiquebackend.onrender.com/user/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              OrganisationName: organization,
              domains: domains,
              linkedin: linkdedin,
              role: 'professional',
            }),
          });
  
          // Ensure the API call was successful before navigating
          if (response.ok) {
            // Success animation
            gsap.to("#auth-form", {
              y: -20,
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
            navigate('/dashboard', { state: { email } });
              }
            });
          } else {
            // Log detailed error information
            const errorText = await response.text();
            console.error('Professional signup error:', {
              status: response.status,
              statusText: response.statusText,
              data: errorText
            });
            setError(`Failed to save professional data. Please try again.`);
            setLoading(false);
          }
        } else {
          // If user is not professional, navigate to dashboard directly without MongoDB storage
          gsap.to("#auth-form", {
            y: -20,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
          navigate('/dashboard', { state: { email } });
            }
          });
        }
        }
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setError('Email is already in use. Please use a different email.');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please try again.');
        } else {
        setError('An error occurred. Please try again.');
      }
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDomainChange = (e) => {
    const { value, checked } = e.target;
    setDomains((prevDomains) => 
      checked ? [...prevDomains, value] : prevDomains.filter(domain => domain !== value)
    );
  };

  return (
    <>
      <Navbar />
      <div 
        ref={pageRef}
        className="relative min-h-screen bg-[#080312] pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1a0b2e] via-[#130822] to-[#080312] z-0"></div>
        
        {/* Dynamic grid lines */}
        <div 
          ref={gridRef}
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(138, 43, 226, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(138, 43, 226, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        />
        
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#9c4dff]/10 blur-[150px] animate-pulse-slow z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#ff5089]/10 blur-[150px] animate-pulse-slow animation-delay-1000 z-0"></div>
        
        {/* Light streaks */}
        <div ref={streaksRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-[2px] rounded-full"
              style={{
                background: i % 2 === 0 
                  ? 'linear-gradient(90deg, rgba(138,43,226,0) 0%, rgba(138,43,226,0.8) 50%, rgba(138,43,226,0) 100%)' 
                  : 'linear-gradient(90deg, rgba(255,80,137,0) 0%, rgba(255,80,137,0.8) 50%, rgba(255,80,137,0) 100%)',
                width: `${150 + i * 40}px`,
                boxShadow: `0 0 10px 1px ${i % 2 === 0 ? 'rgba(138,43,226,0.6)' : 'rgba(255,80,137,0.6)'}`
              }}
            />
          ))}
        </div>
        
        {/* Orbital rings */}
        <div 
          ref={orbitRef}
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
        >
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full border opacity-10"
              style={{
                width: `${600 + i * 200}px`,
                height: `${600 + i * 200}px`,
                borderWidth: `${2 - i * 0.5}px`,
                borderColor: i % 2 === 0 ? '#9c4dff' : '#ff5089',
                transform: `rotate(${i * 30}deg)`
              }}
            />
          ))}
      </div>
        
        {/* Main content */}
        <div className="relative max-w-md mx-auto z-10">
          <motion.div
            id="auth-form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#120822]/60 backdrop-blur-md rounded-2xl shadow-xl border border-[#9c4dff]/20 overflow-hidden p-8 relative"
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"></div>
            
            <motion.h2 
              variants={itemVariants} 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] text-center mb-8"
              animate={{
                backgroundPosition: ['0% center', '100% center'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{ backgroundSize: '200%' }}
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </motion.h2>
            
            <motion.form 
              variants={containerVariants}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-gray-300 font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                  className="w-full px-4 py-3 border border-[#9c4dff]/30 rounded-lg bg-[#120822]/70 text-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c840eb] focus:border-transparent transition-all duration-300"
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-gray-300 font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                  className="w-full px-4 py-3 border border-[#9c4dff]/30 rounded-lg bg-[#120822]/70 text-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c840eb] focus:border-transparent transition-all duration-300"
              />
              </motion.div>
              
              <AnimatePresence>
            {!isLogin && (
                  <motion.div 
                    key="confirm-password"
                    variants={itemVariants}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="block text-gray-300 font-medium" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                      className="w-full px-4 py-3 border border-[#9c4dff]/30 rounded-lg bg-[#120822]/70 text-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c840eb] focus:border-transparent transition-all duration-300"
                />
                  </motion.div>
            )}
              </AnimatePresence>



            {/* Show Additional Fields for Professionals */}
              <AnimatePresence>
                {!isLogin && userType === 'professional' && (
                  <>
                    <motion.div 
                      key="organization"
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="block text-gray-300 font-medium" htmlFor="organization">
                    Organization Name
                  </label>
                  <input
                    id="organization"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                        className="w-full px-4 py-3 border border-[#9c4dff]/30 rounded-lg bg-[#120822]/70 text-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c840eb] focus:border-transparent transition-all duration-300"
                      />
                    </motion.div>
                    <motion.div 
                      key="linkedin"
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="block text-gray-300 font-medium" htmlFor="linkedin">
                 LinkedIn Profile Link
                   </label>
                <input
                    id="linkedin"
                    type="text"
                    value={linkdedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    required
                        className="w-full px-4 py-3 border border-[#9c4dff]/30 rounded-lg bg-[#120822]/70 text-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c840eb] focus:border-transparent transition-all duration-300"
                      />
                    </motion.div>
                    <motion.div 
                      key="domains"
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <label className="block text-gray-300 font-medium">Select your domains of interest</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Technology', 'Social', 'Business'].map((domain) => (
                          <motion.div 
                            key={domain}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                              domains.includes(domain.toLowerCase())
                                ? 'border-[#c840eb] bg-[#9c4dff]/20'
                                : 'border-[#9c4dff]/30 bg-[#120822]/50 hover:bg-[#120822]/80'
                            }`}
                          >
                            <label className="flex items-center cursor-pointer w-full">
                          <input
                            type="checkbox"
                            value={domain.toLowerCase()}
                            checked={domains.includes(domain.toLowerCase())}
                            onChange={handleDomainChange}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 mr-3 flex items-center justify-center border rounded ${
                                domains.includes(domain.toLowerCase())
                                  ? 'border-[#c840eb] bg-[#c840eb]'
                                  : 'border-gray-400'
                              }`}>
                                {domains.includes(domain.toLowerCase()) && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-gray-300">{domain}</span>
                        </label>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
              </>
            )}
              </AnimatePresence>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-[#ff5089]/10 border border-[#ff5089]/40 text-[#ff5089] rounded-lg backdrop-blur-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                variants={itemVariants}
              type="submit"
                disabled={loading}
                className="relative w-full py-3 px-6 text-white font-semibold rounded-lg overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={loading ? {} : { scale: 1.02 }}
                whileTap={loading ? {} : { scale: 0.98 }}
              >
                {/* Base gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] rounded-lg"></div>
                
                {/* Button hover glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                  style={{
                    background: 'linear-gradient(to right, rgba(156, 77, 255, 0.2), rgba(200, 64, 235, 0.2), rgba(255, 80, 137, 0.2))',
                    boxShadow: '0 0 15px 2px rgba(200, 64, 235, 0.3)'
                  }}
                ></div>
                
                {/* Center ripple effect on hover */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-0 h-0 bg-white opacity-20 rounded-full group-hover:w-full group-hover:h-full transition-all duration-500"
                  ></div>
                </div>
                
                {/* Loading spinner or text - centered with flex */}
                <div className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>{isLogin ? 'Log In' : 'Sign Up'}</>
                  )}
                </div>
              </motion.button>
            </motion.form>

            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-gray-300">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <motion.button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(''); // Reset the error when toggling
              }}
                  className="text-[#c840eb] hover:text-[#9c4dff] ml-2 transition-colors duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
                </motion.button>
          </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
      
      {/* Add animations styling */}
      <style jsx>{`
        @keyframes pulse-slow {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%);
        }
      `}</style>
    </>
  );
};

export default SignUp;
