import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_LINKS, GROUND_CONTROL_LINK } from '../constants';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const linkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-space-light hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClasses = "bg-accent-blue/20 text-accent-blue font-semibold shadow-inner";

  return (
    <aside className="w-20 lg:w-64 bg-space-mid p-4 flex flex-col justify-between border-r border-space-light">
      <div>
        <div className="flex items-center justify-center lg:justify-start mb-10">
          <svg className="h-10 w-10 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l.01 0-1.293 1.293a1 1 0 01-1.414 0L5 11m14 2l-2.293-2.293a1 1 0 00-1.414 0L14 12l-.01 0 1.293 1.293a1 1 0 001.414 0L19 13m-6 8v-4m-2 2h4" />
          </svg>
          <span className="hidden lg:block ml-3 text-xl font-bold text-white">MIRIS</span>
        </div>
        <nav className="flex flex-col space-y-2">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              {link.icon}
              <span className="hidden lg:block ml-4">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-space-light pt-4">
        <NavLink
            to={GROUND_CONTROL_LINK.path}
            className={`${linkClasses} ${location.pathname.startsWith(GROUND_CONTROL_LINK.path) ? activeLinkClasses : ''}`}
        >
            {GROUND_CONTROL_LINK.icon}
            <span className="hidden lg:block ml-4">{GROUND_CONTROL_LINK.label}</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;