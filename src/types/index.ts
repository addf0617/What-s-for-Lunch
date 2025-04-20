export type User = {
  id: string;
  name: string;
};

export type Restaurant = {
  id: string;
  name: string;
  iconType: FoodIconType;
  votes: string[]; // Array of user IDs who voted for this restaurant
};

export type Room = {
  id: string;
  createdBy: string; // User ID
  restaurants: Restaurant[];
  participants: User[];
  status: 'voting' | 'complete';
  winner?: Restaurant;
  lastUpdated: number;
};

export type FoodIconType = 
  | 'burger'
  | 'pizza'
  | 'sushi'
  | 'taco'
  | 'pasta'
  | 'salad'
  | 'sandwich'
  | 'hotpot'
  | 'bento'
  | 'ramen';