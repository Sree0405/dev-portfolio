/**
 * UI OVERLAY
 * Progress indicators, section labels, and navigation hints
 */

import { motion, AnimatePresence } from 'framer-motion';
import { SECTIONS } from './types';

interface UIOverlayProps {
  progress: number;
  currentSection: number;
  isMobile: boolean;
  isLoaded: boolean;
  onSectionClick: (index: number) => void;
}

export function UIOverlay({
  progress,
  currentSection,
  isMobile,
  isLoaded,
  onSectionClick,
}: UIOverlayProps) {
  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-[#050510] flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary font-mono text-lg"
            >
              Loading Experience...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section indicators - Desktop */}
      {!isMobile && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
          {SECTIONS.map((section, i) => (
            <motion.button
              key={section.id}
              onClick={() => onSectionClick(i)}
              className="group flex items-center gap-3 cursor-pointer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {/* Dot indicator */}
              <motion.div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSection === i
                    ? 'bg-primary scale-150'
                    : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/60'
                }`}
              />
              {/* Label */}
              <span
                className={`text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  currentSection === i
                    ? 'text-primary opacity-100'
                    : 'text-muted-foreground opacity-50 group-hover:opacity-80'
                }`}
              >
                {section.title}
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Progress bar - Mobile */}
      {isMobile && (
        <div className="fixed bottom-6 left-6 right-6 z-40">
          <div className="h-0.5 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-[#00d4ff]"
              style={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {SECTIONS.map((section, i) => (
              <button
                key={section.id}
                onClick={() => onSectionClick(i)}
                className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  currentSection === i ? 'text-primary' : 'text-muted-foreground/40'
                }`}
              >
                {section.id.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: progress < 0.1 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-muted-foreground/60 text-xs font-mono">
            {isMobile ? 'Swipe to explore' : 'Scroll to explore'}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-muted-foreground/40"
          >
            <path
              d="M10 4v12M10 16l-4-4M10 16l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Current section title - appears on scroll */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-24 left-8 z-40 pointer-events-none hidden md:block"
        >
          <p className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest">
            {SECTIONS[currentSection]?.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
