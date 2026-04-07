import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import companyLogo from '../assets/images/Screenshot (279)_enhanced.png';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // For light theme pages, we darken the text on hover/active
  const isLight = document.body.getAttribute('data-theme') === 'light';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <div className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] w-full px-4 sm:px-6 
        ${scrolled ? 'top-2 sm:top-4' : 'top-0 sm:top-6'}
      `}>
        <nav 
          className={`mx-auto max-w-5xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] 
            ${scrolled ? 'rounded-2xl glass-nav py-3 px-6' : 'rounded-none bg-transparent py-4 px-2'}
          `}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center shrink-0">
              <Link to="/">
                <img 
                  src={companyLogo} 
                  alt="CritiqueConnect Logo" 
                  className="h-8 md:h-10 w-auto object-contain transition-all duration-300"
                />
              </Link>
            </motion.div>

            {/* Desktop Center Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <div key={link.path} className="relative group px-1">
                    <Link 
                      to={link.path} 
                      className={`block px-4 py-2 text-sm font-medium transition duration-300 relative z-10 
                        ${isActive 
                            ? (isLight ? 'text-black' : 'text-white') 
                            : (isLight ? 'text-gray-500 hover:text-black' : 'text-gray-400 hover:text-white')
                        }
                      `}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className={`absolute inset-0 rounded-full -z-10 ${isLight ? 'bg-black/5 shadow-sm' : 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]'}`}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:flex items-center space-x-4 shrink-0">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-mono truncate max-w-[120px] ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                    {currentUser.email}
                  </span>
                  <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-600 transition tracking-wide">
                    Log Out
                  </button>
                </div>
              ) : (
                !isAuthPage && (
                  <>
                    <Link to="/login" className={`text-sm font-medium transition ${isLight ? 'text-gray-600 hover:text-black' : 'text-gray-300 hover:text-white'}`}>
                      Log In
                    </Link>
                    <Link to="/signup" className="btn-apple !py-2 !px-5 text-sm">
                      Sign Up
                    </Link>
                  </>
                )
              )}
            </motion.div>

            {/* Mobile Hamburger */}
            <button className="lg:hidden p-2 relative z-50 text-current" onClick={() => setToggleMenu(!toggleMenu)}>
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-transform duration-300 ${toggleMenu ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-opacity duration-300 ${toggleMenu ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-transform duration-300 ${toggleMenu ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {toggleMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className={`fixed top-0 left-0 w-full pt-24 pb-8 px-6 z-40 rounded-b-3xl glass-light border-b border-[rgba(200,200,200,0.2)] shadow-2xl ${isLight ? 'glass-light' : 'glass-dark'}`}
          >
            <div className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setToggleMenu(false)}
                  className={`text-lg font-medium p-4 rounded-xl ${
                    location.pathname === link.path 
                      ? (isLight ? 'bg-black/5 text-black' : 'bg-white/10 text-white')
                      : (isLight ? 'text-gray-600' : 'text-gray-300')
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-6 mt-4 border-t border-[var(--border-subtle)] flex flex-col space-y-4">
                {currentUser ? (
                  <button onClick={() => { handleLogout(); setToggleMenu(false); }} className="w-full text-center py-3 text-red-500 font-medium rounded-xl bg-red-500/10">
                    Log Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setToggleMenu(false)} className={`w-full text-center py-3 font-medium rounded-xl ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
                      Log In
                    </Link>
                    <Link to="/signup" onClick={() => setToggleMenu(false)} className="w-full text-center py-3 btn-apple">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;