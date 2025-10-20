// User-related types for the TaTTTy platform

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isMasterAdmin?: boolean;
  memberSince?: string;
  plan?: string;
  stats?: {
    designsCreated: number;
    favorites: number;
    creditsRemaining: number;
  };
}

export interface Design {
  id: number;
  title: string;
  category: string;
  date: string;
  likes: number;
  imageUrl: string;
  status?: string;
}