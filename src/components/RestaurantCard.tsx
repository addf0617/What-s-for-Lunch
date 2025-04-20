import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Heart } from 'lucide-react';
import { Restaurant } from '../types';
import { useApp } from '../context/AppContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  showVotes?: boolean;
  onDelete?: (id: string) => void;
  onVote?: (id: string) => void;
  isWinner?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  showVotes = false,
  onDelete,
  onVote,
  isWinner = false,
}) => {
  const { state } = useApp();
  
  const hasVoted = state.currentUser && restaurant.votes.includes(state.currentUser.id);
  
  return (
    <motion.div
      className={`relative bg-white rounded-2xl p-4 shadow-sm
        ${isWinner ? 'border-4 border-amber-400 bg-amber-50' : ''}
        hover:shadow-md transition-all`}
      whileHover={{ y: -2 }}
      initial={isWinner ? { scale: 0.9 } : { scale: 1 }}
      animate={isWinner ? { 
        scale: [0.9, 1.1, 1],
        boxShadow: [
          '0 2px 8px rgba(0,0,0,0.1)',
          '0 4px 12px rgba(0,0,0,0.2)',
          '0 2px 8px rgba(0,0,0,0.1)'
        ]
      } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isWinner ? 'bg-amber-200' : 'bg-orange-100'}`}>
            <img 
              src={`/icons/${restaurant.iconType}.svg`}
              alt={restaurant.iconType}
              className="w-8 h-8"
            />
          </div>
          <h3 className="text-xl font-bold text-brown-800">{restaurant.name}</h3>
        </div>
        
        {showVotes && (
          <div className="flex items-center">
            <Heart 
              className={`mr-2 ${hasVoted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} 
              size={24}
            />
            <span className="font-bold text-lg">{restaurant.votes.length}</span>
          </div>
        )}
        
        {onDelete && (
          <button
            onClick={() => onDelete(restaurant.id)}
            className="p-2 text-brown-400 hover:text-brown-800 transition-colors"
            aria-label="Delete restaurant"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
      
      {onVote && (
        <div className="mt-4">
          <button
            onClick={() => onVote(restaurant.id)}
            className={`w-full py-3 px-4 rounded-full transition-all
              ${hasVoted 
                ? 'bg-rose-500 text-white' 
                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'}`}
          >
            {hasVoted ? 'Voted! ❤️' : 'Vote'}
          </button>
        </div>
      )}
      
      {isWinner && (
        <div className="absolute -top-3 -right-3 bg-amber-400 text-brown-900 
          font-bold px-4 py-1 rounded-full transform rotate-12 shadow-sm">
          Winner!
        </div>
      )}
    </motion.div>
  );
};

export default RestaurantCard;