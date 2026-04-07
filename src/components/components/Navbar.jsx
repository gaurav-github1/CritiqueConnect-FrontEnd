import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import companyLogo from '../assets/images/Screenshot (279)_enhanced.png';
import gsap from 'gsap';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  
  const navRef = useRef(null);
  const glowRef = useRef(null);
  
  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3, ease: "easeInOut", staggerChildren: 0.1, delayChildren: 0.1 }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut", staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, x: -20 }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    
    // GSAP animation for subtle background glow
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: scrolled ? 1 : 0.4,
        duration: 1.5,
      });
    }
    
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const links = [
    { path: '/', label: 'Home' },
    ...(currentUser ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
    { path: '/categories', label: 'Categories' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/about-us', label: 'About Us' }
  ];

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#050505]/95 backdrop-blur-xl saturate-150 shadow-xl border-b border-[rgba(255,255,255,0.06)] h-20' 
          : 'bg-[#050505]/70 h-24'
      }`}
    >
      {/* Background glow effect - intensifies on scroll */}
      <div 
        ref={glowRef}
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#22d3ee]/40 to-transparent opacity-0 pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.5)]"
      />
      
      {/* Top edge gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
      
      {/* Flex Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              <img 
                src={companyLogo} 
                alt="CritiqueConnect Logo" 
                className="h-10 w-auto object-contain transition-transform duration-300"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-[#22d3ee]/20 to-[#9c4dff]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Menu Items for Desktop */}
        <div className="hidden lg:flex items-center space-x-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                }
              }
            }}
            className="flex items-center space-x-1"
          >
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <motion.div key={link.path} variants={navItemVariants} whileHover="hover" className="relative group px-1">
                  <Link 
                    to={link.path} 
                    className={`block px-3 py-1.5 text-sm font-medium transition duration-300 ease-in-out relative z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,255,255,0.1)] -z-10 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Auth Buttons */}
        <motion.div 
          className="hidden lg:flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-mono text-gray-400">
                {currentUser.email}
              </span>
              <motion.button
                onClick={handleLogout}
                className="relative py-2 px-5 text-white text-sm font-medium rounded-full overflow-hidden group border border-[rgba(255,255,255,0.1)] hover:border-red-500/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-transparent group-hover:bg-red-500/10 transition-colors duration-300"></div>
                <span className="relative flex items-center group-hover:text-red-400 transition-colors">
                  Log Out
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
              </motion.button>
            </div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="relative py-2 px-6 text-white text-sm font-medium border border-[rgba(255,255,255,0.2)] rounded-full transition-all duration-300 hover:border-[#22d3ee] hover:text-[#22d3ee] hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  Log In
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="relative py-2 px-6 text-[#050505] text-sm font-semibold bg-[#22d3ee] rounded-full flex items-center hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:bg-[#67e8f9] transition-all duration-300"
                >
                  <span>Sign Up</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden flex items-center p-2 rounded-md focus:outline-none"
          onClick={() => setToggleMenu(!toggleMenu)}
          aria-expanded={toggleMenu}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="sr-only">Open main menu</span>
          <div className="relative w-6 h-5">
            <span
              className={`absolute top-0 left-0 w-6 h-0.5 bg-[#22d3ee] transform transition-all duration-300 ${
                toggleMenu ? 'rotate-45 translate-y-2.5' : ''
              }`}
            ></span>
            <span
              className={`absolute top-2 left-0 w-6 h-0.5 bg-[#22d3ee] transition-opacity duration-300 ${
                toggleMenu ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`absolute top-4 left-0 w-6 h-0.5 bg-[#22d3ee] transform transition-all duration-300 ${
                toggleMenu ? '-rotate-45 -translate-y-2.5' : ''
              }`}
            ></span>
          </div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {toggleMenu && (
          <motion.div
            className="lg:hidden absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] overflow-hidden shadow-2xl z-40"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4 pb-4">
                {links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div key={link.path} variants={mobileItemVariants}>
                      <Link 
                        to={link.path}
                        onClick={() => setToggleMenu(false)}
                        className={`font-medium px-4 py-3 rounded-xl transition duration-300 flex items-center group ${
                          isActive ? 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#22d3ee]' : 'text-gray-300 hover:bg-[rgba(255,255,255,0.02)] border border-transparent'
                        }`}
                      >
                        <span>{link.label}</span>
                        <div className={`ml-auto p-1.5 rounded-full transition-opacity ${isActive ? 'opacity-100 bg-[#22d3ee]/20' : 'opacity-0 group-hover:opacity-100 bg-[rgba(255,255,255,0.05)]'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isActive ? 'text-[#22d3ee]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
                
                <motion.div variants={mobileItemVariants} className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-col space-y-3">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 text-sm font-mono text-gray-400 truncate">
                        {currentUser.email}
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setToggleMenu(false);
                        }}
                        className="w-full text-center py-3 px-4 text-white font-medium border border-red-500/30 rounded-xl transition-all duration-300 hover:bg-red-500/10 flex items-center justify-center"
                      >
                        <span className="text-red-400">Log Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setToggleMenu(false)}
                        className="w-full text-center py-3 px-4 text-white font-medium border border-[rgba(255,255,255,0.2)] rounded-xl transition-all duration-300 hover:border-[#22d3ee]"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setToggleMenu(false)}
                        className="w-full text-center py-3 px-4 text-[#050505] font-semibold bg-[#22d3ee] rounded-xl flex items-center justify-center"
                      >
                        <span>Sign Up</span>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;