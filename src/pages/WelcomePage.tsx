import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PageContainer from '../components/PageContainer';
import { useApp } from '../context/AppContext';

const WelcomePage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const sharedRoomId = searchParams.get('room');
  const [name, setName] = useState('');
  const { dispatch } = useApp();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch({ type: 'SET_USER', payload: { name: name.trim() } });
      
      if (sharedRoomId) {
        dispatch({ type: 'JOIN_ROOM', payload: { roomId: sharedRoomId } });
        navigate('/voting');
      } else {
        dispatch({ type: 'CREATE_ROOM' });
        navigate('/restaurants');
      }
    }
  };
  
  return (
    <PageContainer showHeader={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <motion.div
          className="mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.img
              src="/icons/pizza.svg"
              alt="Pizza"
              className="w-12 h-12"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <h1 className="text-4xl font-bold text-brown-800">Lunch Voting</h1>
            <motion.img
              src="/icons/fork-knife.svg"
              alt="Utensils"
              className="w-12 h-12"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            />
          </div>
        </motion.div>
        
        <motion.div
          className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-brown-800 text-center mb-6">
              Enter your name to get started:
            </h2>
            
            <InputField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              maxLength={20}
              icon={
                <img 
                  src="/icons/cat.svg" 
                  alt="Cat" 
                  className="w-8 h-8"
                />
              }
            />
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!name.trim()}
            >
              Start Voting! 🍱
            </Button>
          </form>
        </motion.div>
        
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-amber-100 p-6 rounded-2xl max-w-sm mx-auto text-center">
            <motion.img
              src="/icons/bento.svg"
              alt="Bento"
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
            <p className="text-brown-700 font-medium">
              Let's find the perfect lunch spot today!
            </p>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default WelcomePage;