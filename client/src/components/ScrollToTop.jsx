// client/src/components/ScrollToTop.jsx
import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top scroll position
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-[0_15px_30px_-5px_rgba(0,81,63,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(0,81,63,0.45)] hover:bg-primary-container hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center group border border-white/20 backdrop-blur-md"
        aria-label="Scroll to top"
      >
        <span className="material-symbols-outlined text-2xl group-hover:animate-bounce">arrow_upward</span>
      </button>
    </div>
  );
};

export default ScrollToTop;
