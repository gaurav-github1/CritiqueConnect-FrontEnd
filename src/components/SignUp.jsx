import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Apple floating-label input — light theme
const AppleInput = ({ id, label, type, value, onChange, required }) => (
  <div className="relative z-0 w-full mb-6 group/input">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder=" "
      className="block w-full px-0 pt-6 pb-2 bg-transparent border-0 border-b-2 border-gray-200 text-[var(--text-on-light)] appearance-none focus:outline-none focus:ring-0 focus:border-[var(--accent)] transition-colors peer"
    />
    <label
      htmlFor={id}
      className="absolute text-gray-400 font-medium duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-focus:text-[var(--accent)] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 pointer-events-none"
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
  const { login } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  const handleDomainChange = (e) => {
    const { value, checked } = e.target;
    setDomains((prev) => checked ? [...prev, value] : prev.filter(d => d !== value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return; }
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const response = await fetch('https://critiquebackend.onrender.com/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
          const data = await response.json();
          login(data.user || { email });
          navigate(from);
        } else {
          setError('Invalid email or password.');
        }
      } else {
        if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
        
        const payload = { 
          email, 
          password,
          OrganisationName: organization || "Unknown", 
          domains: domains.length > 0 ? domains : ["General"], 
          linkedin: linkdedin || "", 
          role: 'professional' 
        };
        
        const response = await fetch('https://critiquebackend.onrender.com/user/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          const data = await response.json();
          login(data.user || { email });
          navigate('/dashboard', { state: { email } });
        } else {
           const errData = await response.json().catch(() => ({}));
           setError(errData.message || 'Failed to create account. Please try again.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const titleWords = ["Refine.", "Iterate.", "Perfect."];

  return (
    <div className="flex min-h-screen bg-[var(--surface-light)] font-ui overflow-hidden">
      <Navbar />

      {/* ─── LEFT PANEL: Home page hero clone ─────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden bg-[var(--surface-light)]">

        {/* Same blurred orb as the home hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full pointer-events-none z-0">
          <div className="w-[520px] h-[520px] mx-auto mt-16 bg-gradient-to-tr from-[var(--accent)] via-[#9c4dff] to-[#ff5089] rounded-full blur-[140px] mix-blend-multiply opacity-25 animate-pulse-slow" />
        </div>

        {/* Dot grid — same as features section */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1D1D1F 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Content — matching home hero layout exactly */}
        <div className="relative z-10 px-16 max-w-2xl w-full">
          {/* Pill badge */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-block mb-8 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[var(--accent)] bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/20"
          >
            Community-Powered Critique Platform
          </motion.span>

          {/* Large title words */}
          <h1 className="text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.0] tracking-tight flex flex-wrap gap-x-3">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 + i * 0.08 }}
                className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-lg text-gray-500 leading-relaxed font-medium max-w-lg"
          >
            Connect your ideas with verified domain experts. Receive precise, structured feedback that transforms your work from good to exceptional.
          </motion.p>

          {/* 3 mini stats — adds context substance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-14 flex gap-10"
          >
            {[
              { value: '500+', label: 'Reviews given' },
              { value: '8', label: 'Expert domains' },
              { value: '100%', label: 'Honest feedback' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-[var(--text-on-light)]">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-0.5 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Auth form ────────────────────────────── */}
      <div
        data-lenis-prevent="true"
        className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 pt-32 lg:pt-28 pb-10 relative z-10 overflow-y-auto max-h-screen bg-[var(--surface-light)]"
      >
        {/* Light subtle border separator on desktop */}
        <div className="hidden lg:block absolute left-0 top-16 bottom-16 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

        <div className="w-full max-w-md">
          {/* Tab Switcher */}
          <div className="flex p-1 mb-10 bg-gray-100 rounded-full w-full relative z-20 border border-gray-200">
            {['Log In', 'Sign Up'].map((tab) => {
              const isActive = (tab === 'Log In' && isLogin) || (tab === 'Sign Up' && !isLogin);
              return (
                <button
                  key={tab}
                  onClick={() => { setIsLogin(tab === 'Log In'); setError(''); }}
                  className={`flex-1 py-3 text-sm font-semibold rounded-full relative transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="auth-tab-apple"
                      className="absolute inset-0 bg-[var(--text-on-light)] rounded-full shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="card-solid-light rounded-3xl p-8 sm:p-10 relative">
            <h2 className="text-2xl font-bold text-[var(--text-on-light)] tracking-tight mb-1">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {isLogin ? 'Enter your details to access your dashboard' : 'Join CritiqueConnect as a Professional'}
            </p>

            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'signup'}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20, transition: { duration: 0.1 } }}
                onSubmit={handleSubmit}
                className="space-y-2"
              >
                <motion.div variants={itemVariants}>
                  <AppleInput id="email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AppleInput id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </motion.div>
                {!isLogin && (
                  <motion.div variants={itemVariants}>
                    <AppleInput id="confirm-password" label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </motion.div>
                )}
                {!isLogin && (
                  <motion.div variants={containerVariants} className="pt-2">
                    <motion.div variants={itemVariants}>
                      <AppleInput id="organization" label="Organization Name" type="text" value={organization} onChange={e => setOrganization(e.target.value)} required />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <AppleInput id="linkedin" label="LinkedIn Profile URL" type="text" value={linkdedin} onChange={e => setLinkedin(e.target.value)} required />
                    </motion.div>
                    <motion.div variants={itemVariants} className="pt-4 pb-4">
                      <label className="block text-gray-400 font-medium text-xs mb-3 uppercase tracking-widest">Expertise Domains</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Technology', 'Social', 'Business'].map((domain) => {
                          const isChecked = domains.includes(domain.toLowerCase());
                          return (
                            <motion.label
                              key={domain}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative p-2.5 border rounded-xl cursor-pointer flex flex-col items-center text-center transition-all duration-200 ${
                                isChecked
                                  ? 'border-[var(--accent)] bg-[var(--accent)]/8 shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <input type="checkbox" value={domain.toLowerCase()} checked={isChecked} onChange={handleDomainChange} className="sr-only" />
                              <span className={`text-xs font-semibold ${isChecked ? 'text-[var(--accent)]' : 'text-gray-500'}`}>{domain}</span>
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
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center font-medium border border-red-100"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-apple w-full !py-4 shadow-lg shadow-[var(--accent)]/20 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <span>{isLogin ? 'Log In' : 'Create Account'}</span>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
