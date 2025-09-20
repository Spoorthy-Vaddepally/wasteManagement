
import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import StarfieldBackground from './StarfieldBackground';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-space-dark via-space-mid to-space-dark font-sans relative overflow-hidden">
      <StarfieldBackground />
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
