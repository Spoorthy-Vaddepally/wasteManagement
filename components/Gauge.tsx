
import React from 'react';

interface GaugeProps {
  value: number; // 0 to 100
  label: string;
}

const Gauge: React.FC<GaugeProps> = ({ value, label }) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const rotation = (percentage / 100) * 180;
  
  let color = 'stroke-neon-green';
  if (percentage > 75) color = 'stroke-accent-yellow';
  if (percentage > 90) color = 'stroke-accent-red';

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background Arc */}
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" strokeWidth="10" stroke="#21262D" />
          {/* Foreground Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            strokeWidth="10"
            className={`${color} transition-all duration-500`}
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (percentage / 100) * 125.6}
          />
        </svg>
        <div className="absolute bottom-0 w-full text-center">
            <span className="text-3xl font-bold text-white">{percentage.toFixed(1)}%</span>
        </div>
      </div>
      <p className="mt-2 text-gray-400">{label}</p>
    </div>
  );
};

export default Gauge;
