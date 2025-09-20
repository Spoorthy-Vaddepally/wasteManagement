
import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <motion.div 
      className="mb-6 relative"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1 
        className="text-3xl sm:text-4xl font-bold text-white relative"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        style={{
          textShadow: "0 0 20px rgba(0, 191, 255, 0.3)"
        }}
      >
        {title}
        {/* Animated underline */}
        <motion.div
          className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-accent-blue via-accent-purple to-transparent"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        />
      </motion.h1>
      {subtitle && (
        <motion.p 
          className="text-gray-300 mt-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default PageHeader;
