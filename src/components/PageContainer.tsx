import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

interface PageContainerProps {
  children: ReactNode;
  showHeader?: boolean;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const PageContainer: React.FC<PageContainerProps> = ({ 
  children,
  showHeader = true,
}) => {
  return (
    <div className="min-h-screen">
      {showHeader && <Header />}
      
      <motion.main
        className="container mx-auto px-4 py-6 max-w-4xl"
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default PageContainer;