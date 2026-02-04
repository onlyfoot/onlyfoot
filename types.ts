export interface Photo {
  id: string;
  url: string;
  caption: string;
}

export interface Creator {
  name: string;
  username: string;
  avatarUrl: string;
  verified: boolean;
}

export interface Product {
  id: string;
  creator: Creator;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  photos: Photo[];
  category: string;
  tags: string[];
  likes: number;
  postedAt: string;
}

export interface UserState {
  purchasedProductIds: string[];
  balance: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security when passing around
}