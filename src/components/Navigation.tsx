import { motion } from 'framer-motion';
import { Home, User, Briefcase, Folder, Code, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'About', icon: User, href: '/about' },
  { name: 'Experience', icon: Briefcase, href: '/experience' },
  { name: 'Projects', icon: Folder, href: '/projects' },
  { name: 'Skills', icon: Code, href: '/skills' },
  { name: 'Contact', icon: Mail, href: '/contact' },
];

export default function Navigation() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between">
          <motion.div
            className="font-mono font-bold text-xl neon-text"
            whileHover={{ scale: 1.05 }}
          >
            SK
          </motion.div>
          
          <div className="flex gap-1 md:gap-2">
            {navItems.map((item, index) => (
              <Link to={item.href} key={item.name}>
                <motion.div
                  className="relative px-3 py-2 md:px-4 md:py-2 group cursor-pointer"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="hidden md:inline ml-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.name}
                  </span>
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  />
                </motion.div>
              </Link>
            ))}
          </div>

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
