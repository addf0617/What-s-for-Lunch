import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import InputField from '../components/InputField';
import RestaurantCard from '../components/RestaurantCard';
import { useApp } from '../context/AppContext';

const RestaurantListPage: React.FC = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantName.trim()) {
      dispatch({ 
        type: 'ADD_RESTAURANT', 
        payload: { name: restaurantName.trim() } 
      });
      setRestaurantName('');
    }
  };
  
  const handleRemoveRestaurant = (id: string) => {
    dispatch({ type: 'REMOVE_RESTAURANT', payload: { restaurantId: id } });
  };
  
  const handleStartVoting = () => {
    navigate('/voting');
  };
  
  const restaurants = state.currentRoom?.restaurants || [];
  
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-brown-800 mb-2">Create Restaurant List</h1>
          <p className="text-brown-600 mb-6">
            Add the restaurants you want to include in the voting.
          </p>
        </motion.div>
        
        <motion.div
          className="bg-white p-6 rounded-3xl shadow-md mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleAddRestaurant} className="flex items-end gap-3">
            <div className="flex-1">
              <InputField
                label="Restaurant name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Enter restaurant name"
                maxLength={30}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!restaurantName.trim()}
              className="flex-shrink-0"
            >
              <Plus size={20} className="mr-1" /> Add
            </Button>
          </form>
        </motion.div>
        
        {restaurants.length > 0 ? (
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-brown-800 mb-4">
              Your Restaurant List ({restaurants.length})
            </h2>
            
            <AnimatePresence>
              {restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="mb-3"
                >
                  <RestaurantCard
                    restaurant={restaurant}
                    onDelete={handleRemoveRestaurant}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="bg-primary-50 border border-primary-200 p-6 rounded-xl text-center my-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-brown-600 mb-2">Your restaurant list is empty.</p>
            <p className="text-brown-800 font-bold">Add some restaurants to get started!</p>
          </motion.div>
        )}
        
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleStartVoting}
            variant="accent"
            size="lg"
            disabled={restaurants.length < 2}
          >
            Continue to Voting 🍽️
          </Button>
        </div>
        
        {restaurants.length < 2 && restaurants.length > 0 && (
          <p className="text-center text-brown-600 mt-3">
            Add at least one more restaurant to continue.
          </p>
        )}
      </div>
    </PageContainer>
  );
};

export default RestaurantListPage;