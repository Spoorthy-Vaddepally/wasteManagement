
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 20px 40px rgba(0, 191, 255, 0.2), 0 0 30px rgba(0, 191, 255, 0.1)",
        transition: { duration: 0.3 }
      }}
      className={`bg-gradient-to-br from-space-mid/80 to-space-light/60 backdrop-blur-sm border border-accent-blue/30 rounded-xl shadow-hologram p-4 sm:p-6 relative overflow-hidden group ${className}`}
    >
      {/* Hologram effect overlay */}
      <div className="absolute inset-0 bg-hologram opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-blue/20 via-accent-purple/20 to-accent-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      
      <div className="relative z-10">
        <motion.h3 
          className="text-lg font-semibold text-white mb-4 border-b border-accent-blue/30 pb-2 flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.2 }}
        >
          <span className="w-2 h-2 bg-accent-blue rounded-full mr-3 animate-pulse" />
          {title}
        </motion.h3>
        <motion.div 
          className="h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Card;
