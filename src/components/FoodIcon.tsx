import React from 'react';
import { Pizza, Merge as Hamburger, Salad, Beef, Sandwich, Soup, UtensilsCrossed, Banana } from 'lucide-react';
import { FoodIconType } from '../types';

interface FoodIconProps {
  type: FoodIconType;
  size?: number;
  className?: string;
}

const FoodIcon: React.FC<FoodIconProps> = ({ 
  type, 
  size = 24, 
  className = '' 
}) => {
  const getIconColor = () => {
    const colors: Record<FoodIconType, string> = {
      burger: '#8B4513',
      pizza: '#FF6347',
      sushi: '#3CB371',
      taco: '#F4A460',
      pasta: '#FFD700',
      salad: '#32CD32',
      sandwich: '#DEB887',
      hotpot: '#FF4500',
      bento: '#CD5C5C',
      ramen: '#FFA07A'
    };
    
    return colors[type] || '#000000';
  };

  const getIcon = () => {
    switch(type) {
      case 'burger':
        return <Hamburger size={size} color={getIconColor()} />;
      case 'pizza':
        return <Pizza size={size} color={getIconColor()} />;
      case 'sushi':
        return <UtensilsCrossed size={size} color={getIconColor()} />;
      case 'taco':
        return <Sandwich size={size} color={getIconColor()} />; // Using sandwich as taco
      case 'pasta':
        return <Soup size={size} color={getIconColor()} />; // Using soup as pasta
      case 'salad':
        return <Salad size={size} color={getIconColor()} />;
      case 'sandwich':
        return <Sandwich size={size} color={getIconColor()} />;
      case 'hotpot':
        return <Soup size={size} color={getIconColor()} />; // Using soup as hotpot
      case 'bento':
        return <Beef size={size} color={getIconColor()} />; // Using beef as bento
      case 'ramen':
        return <Soup size={size} color={getIconColor()} />; // Using soup as ramen
      default:
        return <Banana size={size} color={getIconColor()} />; // Fallback
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      {getIcon()}
    </div>
  );
};

export default FoodIcon;