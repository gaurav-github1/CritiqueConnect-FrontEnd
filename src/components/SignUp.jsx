import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Utils/firebase";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

// Floating Input Component to standardise the styling
const FloatingInput = ({ id, label, type, value, onChange, required }) => (
  <div className="relative group/input z-0 w-full mb-2">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder=" " /* Required for peer-placeholder-shown */
      className="block w-full px-4 pt-6 pb-2 border border-[rgba(255,255,255,0.06)] rounded-lg bg-[#0a0a0f] text-gray-200 shadow-inner focus:outline-none focus:ring-1 focus:ring-[#22d3ee] focus:border-[#22d3ee] transition-all duration-300 peer"
    />
    <label 
      htmlFor={id}
      className="absolute text-gray-400 font-medium duration-300 transform -translate-y-2 scale-[0.8] top-4 left-4 z-10 origin-[0] peer-focus:text-[#22d3ee] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-[0.8] peer-focus:-translate-y-2 pointer-events-none"
    >
      {label}
    </label>
  </div>
);

const SignUp = ({ isLogin: initialIsLogin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [error, setError] = useState('');
  const [userType] = useState('professional');
  const [organization, setOrganization] = useState('');
  const [linkdedin, setLinkedin] = useState('');
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    }
  };

  const handleDomainChange = (e) => {
    const { value, checked } = e.target;
    setDomains((prev) => checked ? [...prev, value] : prev.filter(d => d !== value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setError('');
    setLoading(true);
  
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate(from);
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.'); setLoading(false); return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        if (userType === 'professional' && organization && domains.length > 0 && linkdedin) {
          const response = await fetch('https://critiquebackend.onrender.com/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email, OrganisationName: organization, domains, linkedin: linkdedin, role: 'professional',
            }),
          });
  
          if (response.ok) {
            navigate('/dashboard', { state: { email } });
          } else {
            setError('Failed to save professional data. Please try again.');
          }
        } else {
          navigate('/dashboard', { state: { email } });
        }
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Email is already in use.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') setError('Invalid email or password.');
      else setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#050505] pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-ui">
        
        {/* Spotlight Grid Background */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(34, 211, 238, 0.08), transparent 80%)`
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="relative max-w-md mx-auto z-10">
          
          {/* Tab Switcher */}
          <div className="flex p-1 mb-8 bg-[#0a0a0f] rounded-full border border-[rgba(255,255,255,0.06)] shadow-xl w-3/4 mx-auto relative z-20">
            {['Log In', 'Sign Up'].map((tab) => {
              const isActive = (tab === 'Log In' && isLogin) || (tab === 'Sign Up' && !isLogin);
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setIsLogin(tab === 'Log In');
                    setError('');
                  }}
                  className={`flex-1 py-2 text-sm font-medium rounded-full relative transition-colors duration-300 ${isActive ? 'text-[#050505]' : 'text-gray-400 hover:text-white'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="auth-tab"
                      className="absolute inset-0 bg-[#22d3ee] rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>

          <motion.div
            id="auth-form"
            className="bg-[#0a0a0f] rounded-2xl shadow-2xl border border-[rgba(255,255,255,0.06)] overflow-hidden p-8 relative"
          >
            {/* Animated Border Glow (Beacon) */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-50 animate-pulse-slow"></div>
            
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                {isLogin ? 'Enter your details to access your dashboard' : 'Join CritiqueConnect as a Professional'}
              </p>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.form 
                key={isLogin ? 'login' : 'signup'}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20, transition: { duration: 0.1 } }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <motion.div variants={itemVariants}>
                    <FloatingInput id="email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FloatingInput id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </motion.div>
                  
                  {!isLogin && (
                    <motion.div variants={itemVariants}>
                      <FloatingInput id="confirm-password" label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    </motion.div>
                  )}
                </div>

                {!isLogin && (
                  <motion.div variants={containerVariants} className="space-y-3 pt-2">
                    <motion.div variants={itemVariants}>
                      <FloatingInput id="organization" label="Organization Name" type="text" value={organization} onChange={e => setOrganization(e.target.value)} required />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <FloatingInput id="linkedin" label="LinkedIn Profile URL" type="text" value={linkdedin} onChange={e => setLinkedin(e.target.value)} required />
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="space-y-3 pt-2 pb-2">
                      <label className="block text-gray-400 font-medium text-sm px-1">Expertise Domains</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['Technology', 'Social', 'Business'].map((domain) => {
                          const isChecked = domains.includes(domain.toLowerCase());
                          return (
                            <motion.label 
                              key={domain}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: [1, 0.95, 1.05, 1], transition: { duration: 0.3 } }}
                              className={`relative p-3 border rounded-xl cursor-pointer flex items-center transition-all duration-300 ${
                                isChecked ? 'border-[#22d3ee] bg-[#22d3ee]/10' : 'border-[rgba(255,255,255,0.06)] bg-[#0f0f1a] hover:bg-[rgba(255,255,255,0.03)]'
                              }`}
                            >
                              <input type="checkbox" value={domain.toLowerCase()} checked={isChecked} onChange={handleDomainChange} className="sr-only" />
                              <div className={`w-4 h-4 mr-3 flex-shrink-0 flex items-center justify-center border rounded transition-colors ${
                                isChecked ? 'border-[#22d3ee] bg-[#22d3ee]' : 'border-gray-500'
                              }`}>
                                {isChecked && (
                                  <svg className="w-3 h-3 text-[#050505]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                )}
                              </div>
                              <span className={`text-sm ${isChecked ? 'text-white' : 'text-gray-400'}`}>{domain}</span>
                            </motion.label>
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center font-medium"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-3 px-6 bg-[#22d3ee] text-[#050505] font-semibold rounded-lg overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                    whileTap={loading ? {} : { scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-[#67e8f9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-[#050505]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <span>{isLogin ? 'Log In to Account' : 'Complete Registration'}</span>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              </motion.form>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
