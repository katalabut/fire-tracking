export interface User {
  id: number;
  name: string;
  role: 'user' | 'firefighter';
  created_at: string;
}

export interface Fire {
  id: number;
  reporter_id: number;
  reporter?: User;
  latitude: number;
  longitude: number;
  description: string;
  status: 'reported' | 'seen' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  fire_id: number;
  user_id: number;
  user?: User;
  text: string;
  created_at: string;
}

export interface Session {
  token: string;
  user: User;
}
