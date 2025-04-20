import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import RestaurantCard from '../components/RestaurantCard';
import { useApp } from '../context/AppContext';

const VotingPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Check for updates every 5 seconds
  useEffect(() => {
    const checkForUpdates = () => {
      if (!state.currentRoom) return;
      
      const latestRoom = JSON.parse(
        localStorage.getItem(`room_${state.currentRoom.id}`) || '{}'
      );
      
      if (latestRoom.lastUpdated > (state.currentRoom.lastUpdated || 0)) {
        dispatch({ type: 'JOIN_ROOM', payload: { roomId: state.currentRoom.id } });
      }
    };
    
    const interval = setInterval(checkForUpdates, 5000);
    return () => clearInterval(interval);
  }, [state.currentRoom, dispatch]);
  const restaurants = state.currentRoom?.restaurants || [];
  
  const handleVote = (restaurantId: string) => {
    dispatch({ type: 'VOTE_RESTAURANT', payload: { restaurantId } });
  };
  
  const handleRandomPick = () => {
    setIsSpinning(true);
    setTimeout(() => {
      dispatch({ type: 'RANDOM_PICK' });
      setIsSpinning(false);
      navigate('/results');
    }, 2000);
  };
  
  const handleCompleteVoting = () => {
    dispatch({ type: 'COMPLETE_VOTING' });
    navigate('/results');
  };
  
  const sortedRestaurants = [...restaurants].sort(
    (a, b) => b.votes.length - a.votes.length
  );
  
  const userHasVoted = state.currentUser && restaurants.some(
    r => r.votes.includes(state.currentUser?.id || '')
  );
  
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?room=${state.currentRoom?.id}`;
    try {
      await navigator.share({
        title: 'Lunch Voting',
        text: 'Join our lunch voting session!',
        url: shareUrl,
      });
    } catch {
      navigator.clipboard.writeText(shareUrl);
      alert('Voting link copied to clipboard!');
    }
  };
  
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3">
              <motion.img
                src="/icons/sandwich.svg"
                alt="Sandwich"
                className="w-10 h-10"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <h1 className="text-3xl font-bold text-brown-800">Lunch Vote</h1>
              <motion.img
                src="/icons/fork-knife.svg"
                alt="Utensils"
                className="w-10 h-10"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button 
              onClick={handleShare}
              variant="secondary"
              size="sm"
            >
              <Share2 size={16} className="mr-2" /> Share
            </Button>
          </motion.div>
        </div>
        
        <div className="space-y-4 mb-8">
          <AnimatePresence>
            {sortedRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <RestaurantCard
                  restaurant={restaurant}
                  showVotes={true}
                  onVote={handleVote}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <Button
            onClick={handleRandomPick}
            variant="accent"
            size="lg"
            disabled={isSpinning}
            className="min-w-[200px]"
          >
            {isSpinning ? 'Spinning...' : 'Random Pick ?'}
          </Button>
          
          <Button
            onClick={handleCompleteVoting}
            variant="primary"
            size="lg"
            disabled={!userHasVoted || isSpinning}
            className="min-w-[200px]"
          >
            Complete Voting 🍽️
          </Button>
        </div>
        
        {!userHasVoted && (
          <p className="text-center text-brown-600 mt-4">
            Please vote for a restaurant to continue
          </p>
        )}
      </div>
    </PageContainer>
  );
};

export default VotingPage;