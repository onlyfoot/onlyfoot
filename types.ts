export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  bio: string;
  price: number;
  subscribers: string;
  postsCount: number;
  photosCount: number;
  videosCount: number;
  isVerified: boolean;
  tags: string[];
}

export interface Post {
  id: string;
  creatorId: string;
  content: string; // Text content
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: number;
  comments: number;
  isLocked: boolean;
  price?: number; // Price if locked
  albumId?: string;
  timestamp: string;
  scheduledFor?: string; // For scheduled posts
  hasWatermark?: boolean;
  tags?: string[];
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  bio?: string;
  balance: number;
  email?: string;
  isCreator?: boolean;
  kycVerified?: boolean;
  kycStatus?: 'none' | 'pending' | 'verified' | 'rejected'; // Added for KYC flow
  blockedUsers?: string[];
  isAdmin?: boolean; // Added for Admin panel access
  createdAt?: string;
}

export interface Album {
  id: string;
  creatorId: string;
  title: string;
  coverUrl: string;
  postCount: number;
  isLocked: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'subscribe' | 'tip' | 'message' | 'system';
  actorName: string;
  actorAvatar: string;
  content?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  mediaUrl?: string;
  isLocked?: boolean;
  price?: number;
  timestamp: string;
  isRead: boolean;
  isPaid?: boolean; // If the user has paid to unlock it
}

export interface ChatSession {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'subscription' | 'tip' | 'unlock';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

export interface Story {
  id: string;
  creatorId: string;
  mediaUrl: string;
  isViewed: boolean;
  timestamp: string;
}

export interface Report {
  id: string;
  targetId: string; // Post ID or User ID
  targetType: 'post' | 'user';
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
  reporterId: string;
}

export interface AnalyticsData {
  date: string;
  earnings: number;
  views: number;
  subs: number;
}