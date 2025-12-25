/**
 * IMMERSIVE STATE HOOK
 * Manages scroll/touch progress and device detection
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { SECTIONS } from './types';

export function useImmersiveState() {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const touchRef = useRef({ startY: 0, currentProgress: 0 });

  // Device detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    
    // Mark as loaded after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    return () => {
      window.removeEventListener('resize', check);
      clearTimeout(timer);
    };
  }, []);

  // Desktop scroll handler
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const newProgress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
        setProgress(newProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Mobile touch handler
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchRef.current.startY = e.touches[0].clientY;
      touchRef.current.currentProgress = progress;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchRef.current.startY - e.touches[0].clientY;
      const sensitivity = 0.0015;
      const newProgress = Math.min(
        Math.max(touchRef.current.currentProgress + deltaY * sensitivity, 0),
        1
      );
      setProgress(newProgress);
      touchRef.current.startY = e.touches[0].clientY;
      touchRef.current.currentProgress = newProgress;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile, progress]);

  const currentSection = Math.min(
    Math.floor(progress * SECTIONS.length),
    SECTIONS.length - 1
  );

  const goToSection = useCallback((index: number) => {
    const targetProgress = index / (SECTIONS.length - 1);
    if (isMobile) {
      setProgress(targetProgress);
    } else {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: scrollHeight * targetProgress, behavior: 'smooth' });
    }
  }, [isMobile]);

  return {
    progress,
    currentSection,
    isMobile,
    isLoaded,
    goToSection,
  };
}
