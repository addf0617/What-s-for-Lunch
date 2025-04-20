import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import { RotateCcw, HomeIcon } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import RestaurantCard from '../components/RestaurantCard';
import { useApp } from '../context/AppContext';

const ResultsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  const winner = state.currentRoom?.winner;
  
  useEffect(() => {
    if (winner) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFA94D', '#FFD700', '#FF6B6B']
      });
    }
  }, [winner]);
  
  const handleStartOver = () => {
    dispatch({ type: 'RESET' });
    navigate('/');
  };
  
  const handleNewVoting = () => {
    dispatch({ type: 'CREATE_ROOM' });
    navigate('/restaurants');
  };
  
  if (!winner) {
    navigate('/');
    return null;
  }
  
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.img
              src="/icons/party.svg"
              alt="Party"
              className="w-12 h-12"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <h1 className="text-4xl font-bold text-brown-800">
              Time for Lunch!
            </h1>
            <motion.img
              src="/icons/confetti.svg"
              alt="Confetti"
              className="w-12 h-12"
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-12"
        >
          <RestaurantCard
            restaurant={winner}
            showVotes={true}
            isWinner={true}
          />
        </motion.div>
        
        <motion.div
          className="bg-white p-6 rounded-3xl shadow-md mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.img
            src={`/icons/${winner.iconType}.svg`}
            alt={winner.iconType}
            className="w-24 h-24 mx-auto mb-4"
            animate={{ 
              y: [0, -10, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
          />
          
          <p className="text-xl text-brown-800">
            Everyone get ready for{' '}
            <span className="font-bold">{winner.name}</span>!
          </p>
          
          {winner.votes.length > 0 && (
            <p className="text-brown-600 mt-2">
              Won with {winner.votes.length} vote{winner.votes.length !== 1 ? 's' : ''}
            </p>
          )}
        </motion.div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button 
            onClick={handleNewVoting}
            variant="primary"
            size="lg"
          >
            <RotateCcw size={16} className="mr-2" /> New Voting
          </Button>
          
          <Button 
            onClick={handleStartOver}
            variant="accent"
            size="lg"
          >
            <HomeIcon size={16} className="mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default ResultsPage;