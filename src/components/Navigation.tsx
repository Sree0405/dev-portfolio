/**
 * CONTEXT-AWARE NAVIGATION
 * - Adapts behavior based on current route
 * - SK logo always navigates to /immersive
 * - Full nav on normal routes, minimal on immersive
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, Folder, Code, Mail, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'About', icon: User, href: '/about' },
  { name: 'Experience', icon: Briefcase, href: '/experience' },
  { name: 'Projects', icon: Folder, href: '/projects' },
  { name: 'Skills', icon: Code, href: '/skills' },
  { name: 'Contact', icon: Mail, href: '/contact' },
];

export default function Navigation() {
  const location = useLocation();
  const isImmersive = location.pathname === '/immersive';

  // On immersive route, show minimal navigation
  if (isImmersive) {
    return (
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - always links to immersive */}
          <Link to="/immersive">
            <motion.div
              className="font-mono font-bold text-xl neon-text"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              SK
            </motion.div>
          </Link>

          {/* Exit to normal site */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Immersive</span>
            </motion.div>
          </Link>
        </div>
      </motion.nav>
    );
  }

  // Normal routes - full navigation
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between">
          {/* Logo - links to immersive experience */}
          <Link to="/immersive">
            <motion.div
              className="font-mono font-bold text-xl neon-text flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Enter Immersive Experience"
            >
              SK
              <Sparkles className="w-4 h-4 text-primary opacity-60" />
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-1 md:gap-2">
            {navItems.map((item, index) => (
              <Link to={item.href} key={item.name}>
                <motion.div
                  className={`relative px-3 py-2 md:px-4 md:py-2 group cursor-pointer ${
                    location.pathname === item.href ? 'text-primary' : ''
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-primary'
                    }`}
                  />
                  <span
                    className={`hidden md:inline ml-2 text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    {item.name}
                  </span>
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg border-2 border-primary"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Hire Me Button */}
          <Link to="/contact">
            <motion.div
              className="hidden md:block cyber-button text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Hire Me
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
