import React from 'react';
import { Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  showUser?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showUser = true }) => {
  const { state } = useApp();
  
  return (
    <motion.div 
      className="flex items-center justify-between py-4 px-4 md:px-8"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary-500 rounded-full text-white">
          <Utensils size={24} />
        </div>
        <span className="font-bold text-2xl text-brown-800">Lunch Vote</span>
      </div>
      
      {showUser && state.currentUser && (
        <div className="px-4 py-2 bg-white rounded-full shadow-sm text-brown-800">
          <span className="font-bold">{state.currentUser.name}</span>
        </div>
      )}
    </motion.div>
  );
};

export default Header;