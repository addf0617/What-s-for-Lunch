import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, Restaurant, Room, FoodIconType } from '../types';

type AppState = {
  currentUser: User | null;
  rooms: Room[];
  currentRoom: Room | null;
};

type AppAction =
  | { type: 'SET_USER'; payload: { name: string } }
  | { type: 'CREATE_ROOM' }
  | { type: 'JOIN_ROOM'; payload: { roomId: string } }
  | { type: 'ADD_RESTAURANT'; payload: { name: string } }
  | { type: 'REMOVE_RESTAURANT'; payload: { restaurantId: string } }
  | { type: 'VOTE_RESTAURANT'; payload: { restaurantId: string } }
  | { type: 'RANDOM_PICK' }
  | { type: 'COMPLETE_VOTING' }
  | { type: 'RESET' };

const initialState: AppState = {
  currentUser: null,
  rooms: [],
  currentRoom: null,
};

function getRandomFoodIcon(): FoodIconType {
  const icons: FoodIconType[] = [
    'burger', 'pizza', 'sushi', 'taco', 'pasta', 
    'salad', 'sandwich', 'hotpot', 'bento', 'ramen'
  ];
  return icons[Math.floor(Math.random() * icons.length)];
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      const userId = uuidv4();
      return {
        ...state,
        currentUser: {
          id: userId,
          name: action.payload.name,
        },
      };
    
    case 'CREATE_ROOM': {
      if (!state.currentUser) return state;
      
      const newRoomId = uuidv4();
      const newRoom: Room = {
        id: newRoomId,
        createdBy: state.currentUser.id,
        restaurants: [],
        participants: [state.currentUser],
        status: 'voting' as const,
        lastUpdated: Date.now(),
      };
      
      // Save room to localStorage
      localStorage.setItem(`room_${newRoomId}`, JSON.stringify(newRoom));
      
      return {
        ...state,
        rooms: [...state.rooms, newRoom],
        currentRoom: newRoom,
      };
    }
    
    case 'JOIN_ROOM': {
      if (!state.currentUser) return state;
      
      // Try to load existing room from localStorage
      const existingRoom = localStorage.getItem(`room_${action.payload.roomId}`);
      if (!existingRoom) return state;
      
      const parsedRoom = JSON.parse(existingRoom) as Room;
      const isAlreadyParticipant = parsedRoom.participants.some(
        (p: User) => p.id === state.currentUser?.id
      );
      
      const updatedRoom: Room = {
        ...parsedRoom,
        participants: isAlreadyParticipant
          ? parsedRoom.participants
          : [...parsedRoom.participants, state.currentUser],
        status: parsedRoom.status as 'voting' | 'complete',
        lastUpdated: Date.now(),
      };
      
      // Save updated room state
      localStorage.setItem(`room_${action.payload.roomId}`, JSON.stringify(updatedRoom));
      
      return {
        ...state,
        currentRoom: updatedRoom,
      };
    }
    
    case 'ADD_RESTAURANT': {
      if (!state.currentRoom) return state;
      
      const newRestaurant: Restaurant = {
        id: uuidv4(),
        name: action.payload.name,
        iconType: getRandomFoodIcon(),
        votes: [],
      };
      
      const roomWithNewRestaurant: Room = {
        ...state.currentRoom,
        restaurants: [...state.currentRoom.restaurants, newRestaurant],
        status: state.currentRoom.status,
        lastUpdated: Date.now(),
      };
      
      // Save updated room state
      localStorage.setItem(`room_${state.currentRoom.id}`, JSON.stringify(roomWithNewRestaurant));
      
      return {
        ...state,
        currentRoom: roomWithNewRestaurant,
      };
    }
    
    case 'REMOVE_RESTAURANT': {
      if (!state.currentRoom) return state;
      
      const roomWithoutRestaurant: Room = {
        ...state.currentRoom,
        restaurants: state.currentRoom.restaurants.filter(
          r => r.id !== action.payload.restaurantId
        ),
        status: state.currentRoom.status,
        lastUpdated: Date.now(),
      };
      
      // Save updated room state
      localStorage.setItem(`room_${state.currentRoom.id}`, JSON.stringify(roomWithoutRestaurant));
      
      return {
        ...state,
        currentRoom: roomWithoutRestaurant,
      };
    }
    
    case 'VOTE_RESTAURANT': {
      if (!state.currentRoom || !state.currentUser) return state;
      
      // Load latest room state
      const currentRoom = JSON.parse(
        localStorage.getItem(`room_${state.currentRoom.id}`) || 
        JSON.stringify(state.currentRoom)
      ) as Room;
      
      const updatedRestaurants = currentRoom.restaurants.map((restaurant: Restaurant) => {
        if (restaurant.id === action.payload.restaurantId) {
          const hasVoted = restaurant.votes.includes(state.currentUser!.id);
          return {
            ...restaurant,
            votes: hasVoted
              ? restaurant.votes.filter(id => id !== state.currentUser!.id)
              : [...restaurant.votes, state.currentUser!.id],
          };
        }
        return restaurant;
      });
      
      const updatedRoom: Room = {
        ...currentRoom,
        restaurants: updatedRestaurants,
        lastUpdated: Date.now(),
        status: currentRoom.status as 'voting' | 'complete',
      };
      
      // Save updated room state
      localStorage.setItem(`room_${state.currentRoom.id}`, JSON.stringify(updatedRoom));
      
      return {
        ...state,
        currentRoom: updatedRoom,
      };
    }
    
    case 'RANDOM_PICK': {
      if (!state.currentRoom) return state;
      
      const restaurants = state.currentRoom.restaurants;
      if (restaurants.length === 0) return state;
      
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      const randomWinner = restaurants[randomIndex];
      
      const roomWithRandomWinner: Room = {
        ...state.currentRoom,
        status: 'complete' as const,
        winner: randomWinner,
        lastUpdated: Date.now(),
      };
      
      // Save room with random winner
      localStorage.setItem(`room_${state.currentRoom.id}`, JSON.stringify(roomWithRandomWinner));
      
      return {
        ...state,
        currentRoom: roomWithRandomWinner,
      };
    }
    
    case 'COMPLETE_VOTING': {
      if (!state.currentRoom) return state;
      
      // Find restaurant with most votes
      const restaurantsWithVotes = state.currentRoom.restaurants;
      if (restaurantsWithVotes.length === 0) return state;
      
      let maxVotes = 0;
      let winnerByVotes = restaurantsWithVotes[0];
      
      restaurantsWithVotes.forEach(restaurant => {
        if (restaurant.votes.length > maxVotes) {
          maxVotes = restaurant.votes.length;
          winnerByVotes = restaurant;
        }
      });
      
      const roomCompleted: Room = {
        ...state.currentRoom,
        status: 'complete' as const,
        winner: winnerByVotes,
        lastUpdated: Date.now(),
      };
      
      // Save completed room state
      localStorage.setItem(`room_${state.currentRoom.id}`, JSON.stringify(roomCompleted));
      
      return {
        ...state,
        currentRoom: roomCompleted,
      };
    }
    
    case 'RESET':
      return {
        ...state,
        currentRoom: null,
      };
      
    default:
      return state;
  }
}

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('lunchVotingState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.currentUser) {
          dispatch({ type: 'SET_USER', payload: { name: parsedState.currentUser.name } });
          if (parsedState.currentRoom) {
            dispatch({ type: 'JOIN_ROOM', payload: { roomId: parsedState.currentRoom.id } });
          }
        }
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('lunchVotingState', JSON.stringify({
        currentUser: state.currentUser,
        currentRoom: state.currentRoom,
      }));
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}