// User types
export interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth: string;
  school?: string;
  university?: string;
  bio?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  followersCount: number;
  followingCount: number;
  totalLearningTime: number; // in seconds
}

// Learning Session types
export interface LearningSession {
  id: string;
  userId: string;
  user?: User;
  duration: number; // in seconds
  content: string;
  subject?: string;
  tags?: string[];
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  isLikedByCurrentUser?: boolean;
}

// Like/Kudos types
export interface Like {
  id: string;
  userId: string;
  sessionId: string;
  createdAt: string;
}

// Follow types
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Profile: { userId: string };
  SessionDetail: { sessionId: string };
  EditProfile: undefined;
  Timer: undefined;
  UserSearch: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Timer: undefined;
  Profile: undefined;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  dateOfBirth: string;
  school?: string;
  university?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Timer types
export interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number; // in seconds
}

// Feed types
export interface FeedItem extends LearningSession {
  user: User;
}
