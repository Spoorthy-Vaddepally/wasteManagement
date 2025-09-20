
import React from 'react';
import { motion } from 'framer-motion';

interface GaugeProps {
  value: number; // 0 to 100
  label: string;
}

const Gauge: React.FC<GaugeProps> = ({ value, label }) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const rotation = (percentage / 100) * 180;
  
  let color = 'stroke-neon-green';
  let glowColor = 'rgba(57, 255, 20, 0.5)';
  if (percentage > 75) {
    color = 'stroke-accent-orange';
    glowColor = 'rgba(255, 69, 0, 0.5)';
  }
  if (percentage > 90) {
    color = 'stroke-neon-pink';
    glowColor = 'rgba(255, 20, 147, 0.5)';
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      <div className="relative w-48 h-24">
        <motion.svg 
          viewBox="0 0 100 50" 
          className="w-full h-full drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor})`
          }}
        >
          {/* Background Arc */}
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" strokeWidth="8" stroke="rgba(33, 38, 45, 0.5)" />
          {/* Foreground Arc */}
          <motion.path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            strokeWidth="8"
            className={`${color} transition-all duration-500`}
            strokeDasharray="125.6"
            initial={{ strokeDashoffset: 125.6 }}
            animate={{ strokeDashoffset: 125.6 - (percentage / 100) * 125.6 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 5px ${glowColor})`
            }}
          />
        </motion.svg>
        <div className="absolute bottom-0 w-full text-center">
          <motion.span 
            className="text-3xl font-bold text-white drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              textShadow: `0 0 10px ${glowColor}`
            }}
          >
            {percentage.toFixed(1)}%
          </motion.span>
        </div>
      </div>
      <motion.p 
        className="mt-2 text-gray-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
};

export default Gauge;
