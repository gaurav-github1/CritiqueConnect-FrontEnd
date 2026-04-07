import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import companyLogo from '../assets/images/Screenshot (279)_enhanced.png';
import facebookLogo from '../assets/images/icon-facebook.svg';
import youtubeLogo from '../assets/images/icon-youtube.svg';
import twitterLogo from '../assets/images/icon-twitter.svg';
import pinterestLogo from '../assets/images/icon-pinterest.svg';
import instagramLogo from '../assets/images/icon-instagram.svg';

const containerVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};
const itemVariant = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="block text-gray-500 text-sm hover:text-[var(--accent)] transition-colors duration-200 py-0.5"
  >
    {children}
  </Link>
);

const Footer = () => {
  return (
    <div className="relative bg-[#0A0A0F] overflow-hidden border-t border-white/5">
      {/* Subtle accent line at very top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent" />

      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="container mx-auto px-6 pt-16 pb-10 z-10 relative"
      >
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-14">

          {/* Brand Column */}
          <motion.div variants={itemVariant} className="lg:w-64 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.04 }} className="mb-6 inline-block">
              <img src={companyLogo} className="h-9 w-auto object-contain" alt="CritiqueConnect Logo" />
            </motion.div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Expert feedback infrastructure for builders who care about quality.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3">
              {[
                { icon: facebookLogo, alt: 'Facebook' },
                { icon: twitterLogo, alt: 'Twitter' },
                { icon: instagramLogo, alt: 'Instagram' },
                { icon: youtubeLogo, alt: 'YouTube' },
                { icon: pinterestLogo, alt: 'Pinterest' },
              ].map((social) => (
                <motion.button
                  key={social.alt}
                  whileHover={{ scale: 1.2, y: -2, transition: { type: 'spring', stiffness: 400 } }}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-300 group"
                >
                  <img src={social.icon} className="h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" alt={social.alt} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariant}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Platform</h4>
              <div className="space-y-2">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/dashboard">Dashboard</FooterLink>
                <FooterLink to="/categories">Categories</FooterLink>
                <FooterLink to="/reviews">Reviews</FooterLink>
              </div>
            </motion.div>

            <motion.div variants={itemVariant}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Actions</h4>
              <div className="space-y-2">
                <FooterLink to="/seek-review">Seek a Review</FooterLink>
                <FooterLink to="/provide-review">Provide a Review</FooterLink>
                <FooterLink to="/about-us">About Us</FooterLink>
                <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={itemVariant} className="col-span-2 md:col-span-1">
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Stay in the loop</h4>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Get platform updates and top feedback stories delivered to you.
              </p>
              <div className="flex bg-white/5 rounded-full p-1 border border-white/8 focus-within:border-[var(--accent)]/50 focus-within:ring-1 focus-within:ring-[var(--accent)]/20 transition-all">
                <input
                  type="email"
                  className="flex-1 px-4 py-2 bg-transparent text-gray-300 focus:outline-none text-sm placeholder-gray-600"
                  placeholder="you@email.com"
                />
                <button className="btn-apple !py-2 !px-4 text-xs !rounded-full" type="button">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariant}
          className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} CritiqueConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 text-xs">Built with</span>
            <svg className="w-3.5 h-3.5 text-red-500 mx-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600 text-xs">by the CritiqueConnect team</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Footer;
