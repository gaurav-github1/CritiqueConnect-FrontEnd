import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import companyLogoWhite from '../assets/images/Screenshot (279)_enhanced.png';
import facebookLogo from '../assets/images/icon-facebook.svg';
import youtubeLogo from '../assets/images/icon-youtube.svg';
import twitterLogo from '../assets/images/icon-twitter.svg';
import pinterestLogo from '../assets/images/icon-pinterest.svg';
import instagramLogo from '../assets/images/icon-instagram.svg';

const Footer = () => {
  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="relative bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] pointer-events-none z-0" />
      {/* Background grid lines */}
      <div 
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Glow orbs */}
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-[#22d3ee]/5 blur-[120px] opacity-40 z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#22d3ee]/5 blur-[100px] opacity-40 z-0"></div>
      
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(34,211,238,0.3)] to-transparent z-10"></div>
      
      {/* Flex Container */}
      <motion.div 
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="container relative mx-auto flex flex-col-reverse justify-between px-6 py-16 space-y-12 md:flex-row md:space-y-0 z-10"
      >
        {/* Logo and social links container */}
        <motion.div 
          variants={itemVariant}
          className="flex flex-col-reverse items-center justify-between md:flex-col md:items-start"
        >
          <motion.div 
            variants={itemVariant}
            className="my-6 text-center text-gray-300 md:hidden"
          >
            Copyright © {new Date().getFullYear()}, All Rights Reserved
          </motion.div>
          
          {/* Logo */}
          <motion.div 
            variants={itemVariant}
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <img 
              src={companyLogoWhite} 
              className="w-48 rounded-lg mb-10 z-10 relative" 
              alt="Company Logo" 
            />
            <div className="absolute -inset-1 bg-[#22d3ee]/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          </motion.div>
          
          {/* Social Links Container */}
          <motion.div 
            variants={itemVariant}
            className="flex justify-center space-x-4 mt-4 md:mt-0"
          >
            {[
              { icon: facebookLogo, alt: 'Facebook' },
              { icon: youtubeLogo, alt: 'YouTube' },
              { icon: twitterLogo, alt: 'Twitter' },
              { icon: pinterestLogo, alt: 'Pinterest' },
              { icon: instagramLogo, alt: 'Instagram' },
            ].map((social, index) => (
              <motion.div 
                key={social.alt}
                whileHover={{ 
                  scale: 1.2, 
                  y: -5,
                  rotate: 5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="relative group"
              >
                <Link to="/">
                  <img 
                    src={social.icon} 
                    className="h-8 transition-all duration-300 relative z-10" 
                    alt={social.alt} 
                  />
                  <div className="absolute -inset-2 rounded-full bg-[#22d3ee]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* List Container */}
        <motion.div 
          variants={itemVariant}
          className="flex justify-around space-x-12"
        >
          <div className="flex flex-col space-y-4">
            {[
              { to: '/', label: 'Home' },
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/categories', label: 'Categories' },
              { to: '/about-us', label: 'About Us' },
            ].map((link) => (
              <motion.div 
                key={link.label}
                whileHover={{ x: 5 }}
                className="relative group"
              >
                <Link 
                  to={link.to} 
                  className="text-gray-300 hover:text-[#22d3ee] transition duration-300 group-hover:pl-1"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#22d3ee] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col space-y-4">
            {[
              { to: '/reviews', label: 'Reviews' },
              { to: '/seek-review', label: 'Seek Review' },
              { to: '/provide-review', label: 'Provide Review' },
              { to: '/privacy-policy', label: 'Privacy Policy' },
            ].map((link) => (
              <motion.div 
                key={link.label}
                whileHover={{ x: 5 }}
                className="relative group"
              >
                <Link 
                  to={link.to} 
                  className="text-gray-300 hover:text-[#22d3ee] transition duration-300 group-hover:pl-1"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#22d3ee] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Newsletter Container */}
        <motion.div 
          variants={itemVariant}
          className="flex flex-col justify-between"
        >
          <motion.form
            variants={itemVariant}
            className="relative"
          >
            <h3 className="text-gray-200 font-medium mb-4 text-lg">Stay Connected</h3>
            <div className="flex space-x-3">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-full bg-[#12121a] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] text-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#22d3ee] focus:border-transparent transition-all duration-300"
                placeholder="Updates in your inbox"
              />
              <motion.button 
                className="relative px-6 py-2 text-white font-medium rounded-full overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-[#22d3ee] rounded-full"></div>
                
                {/* Button hover effect */}
                <div className="absolute inset-0 w-full h-full bg-[#67e8f9] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Animated ripple effect on hover */}
                <span className="absolute inset-0 w-0 h-0 rounded-full bg-white opacity-10 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out"></span>
                
                <span className="relative z-10 text-[#050505]">Go</span>
              </motion.button>
            </div>
          </motion.form>
          <motion.div 
            variants={itemVariant}
            className="hidden text-gray-400 md:block mt-8"
          >
            Copyright © {new Date().getFullYear()}, All Rights Reserved
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Footer;
