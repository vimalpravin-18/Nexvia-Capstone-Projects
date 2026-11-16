import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTop Component
 * 1. Automatically scrolls to top (0, 0) on every route or search query change.
 * 2. Listens for user clicks on buttons or links across the app and smoothly brings the page to top.
 * 3. Renders a modern floating "Back to Top" button whenever scrolled down.
 */
export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  // 1. Instant scroll to top on any navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, [pathname, search, hash]);

  // 2. Global button / link click listener
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Find closest interactive button or link
      const clickable = e.target.closest('button, a[href], [role="button"]');
      if (!clickable) return;

      // Ignore controls inside video player or explicit data-no-scroll elements
      if (
        clickable.closest('.video-player-control') ||
        clickable.closest('input[type="range"]') ||
        clickable.closest('[data-no-scroll="true"]')
      ) {
        return;
      }

      // Smoothly scroll to the top of the site
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }, 50);
    };

    document.addEventListener('click', handleGlobalClick, { passive: true });
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // 3. Monitor scroll position for floating Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setShowFloatingBtn(scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTopManual = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showFloatingBtn && (
        <button
          onClick={scrollToTopManual}
          data-no-scroll="true"
          title="Scroll to Top"
          aria-label="Scroll to top of site"
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-500/30 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </>
  );
};
