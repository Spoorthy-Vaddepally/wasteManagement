import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_LINKS, GROUND_CONTROL_LINK } from '../constants';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const linkClasses = "flex items-center px-4 py-3 text-gray-300 hover:text-white rounded-lg transition-all duration-300 relative group";
  const activeLinkClasses = "bg-gradient-to-r from-accent-blue/30 to-accent-purple/20 text-accent-blue font-semibold shadow-neon-blue border border-accent-blue/30";

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-20 lg:w-64 bg-gradient-to-b from-space-mid/90 to-space-light/80 backdrop-blur-md p-4 flex flex-col justify-between border-r border-accent-blue/20 relative"
    >
      {/* Animated side glow */}
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent-blue/50 to-transparent" />
      
      <div>
        <motion.div 
          className="flex items-center justify-center lg:justify-start mb-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <motion.svg 
            className="h-10 w-10 text-neon-cyan drop-shadow-lg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            animate={{ 
              filter: [
                "drop-shadow(0 0 10px rgba(0, 245, 255, 0.5))",
                "drop-shadow(0 0 20px rgba(0, 245, 255, 0.8))",
                "drop-shadow(0 0 10px rgba(0, 245, 255, 0.5))"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l.01 0-1.293 1.293a1 1 0 01-1.414 0L5 11m14 2l-2.293-2.293a1 1 0 00-1.414 0L14 12l-.01 0 1.293 1.293a1 1 0 001.414 0L19 13m-6 8v-4m-2 2h4" />
          </motion.svg>
          <motion.span 
            className="hidden lg:block ml-3 text-xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            MIRIS
          </motion.span>
        </motion.div>
        <nav className="flex flex-col space-y-2">
          {NAV_LINKS.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex items-center w-full">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.icon}
                  </motion.div>
                  <span className="hidden lg:block ml-4">{link.label}</span>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>
      <motion.div 
        className="border-t border-accent-blue/20 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <NavLink
              to={GROUND_CONTROL_LINK.path}
              className={`${linkClasses} ${location.pathname.startsWith(GROUND_CONTROL_LINK.path) ? activeLinkClasses : ''}`}
          >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-orange/10 to-accent-blue/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex items-center w-full">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {GROUND_CONTROL_LINK.icon}
                </motion.div>
                <span className="hidden lg:block ml-4">{GROUND_CONTROL_LINK.label}</span>
              </div>
          </NavLink>
        </motion.div>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;