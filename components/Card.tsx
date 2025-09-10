
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-space-mid border border-space-light rounded-lg shadow-lg p-4 sm:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-space-light pb-2">{title}</h3>
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};

export default Card;
