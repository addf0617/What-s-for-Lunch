import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import RestaurantListPage from './pages/RestaurantListPage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import { useApp } from './context/AppContext';

const App = () => {
  const { state } = useApp();

  return (
    <div className="bg-primary-100 min-h-screen bg-dots relative">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        
        <Route 
          path="/restaurants" 
          element={
            state.currentUser ? <RestaurantListPage /> : <Navigate to="/" />
          } 
        />
        
        <Route 
          path="/voting" 
          element={
            state.currentUser && state.currentRoom ? 
              <VotingPage /> : <Navigate to="/" />
          } 
        />
        
        <Route 
          path="/results" 
          element={
            state.currentUser && state.currentRoom?.status === 'complete' ? 
              <ResultsPage /> : <Navigate to="/" />
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;