// LandingPage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import AnimatedHero from './AnimatedHero';
import FoundersSection from './Testimonial';
import CustomerReviews from './CustomerReviews';
import Footer from './Footer.jsx';
import SignUp from '../SignUp.jsx'; // Import SignUp component

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        {/* Define routes for each section */}
        <Route path="/" element={
          <>
            <AnimatedHero />
            <FoundersSection />
            <CustomerReviews />
          </>
        } />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default LandingPage;
