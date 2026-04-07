// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './components/components/LandingPage';
import SignUp from './components/SignUp';
import Dashboard from './components/components/Dashboard';
import SeekingReview from './components/components/SeekReview'
import ProvidingReview from './components/components/ProvideReview'
import CategoriesPage from './components/components/Categories';
import Review from './components/components/Review';
import ReviewsPage from './components/components/ReviewsPage';
import AboutUs from './components/components/AboutUs';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Lenis from '@studio-freight/lenis';
import { useLocation } from 'react-router-dom';

// Theme Wrapper handles page-by-page Apple light vs dark mode
const ThemeWrapper = ({ children }) => {
  const location = useLocation();
  const lightPaths = ['/', '/login', '/signup', '/reviews', '/about-us'];
  const isLight = lightPaths.includes(location.pathname);

  React.useEffect(() => {
    document.body.setAttribute('data-theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  return <>{children}</>;
};

function App() {
  React.useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <ThemeWrapper>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/login" element={<SignUp isLogin={true}/>} />
          <Route path="/categories" element={<CategoriesPage/>} />
          <Route path="/reviews" element={<ReviewsPage/>} />
          <Route path="/about-us" element={<AboutUs/>} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/review" 
            element={
              <ProtectedRoute>
                <Review/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seek-review" 
            element={
              <ProtectedRoute>
                <SeekingReview/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/provide-review" 
            element={
              <ProtectedRoute>
                <ProvidingReview/>
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
      </ThemeWrapper>
    </Router>
  );
}

export default App;
