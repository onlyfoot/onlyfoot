import { User, Creator, Post, Notification, Album, Comment, Message, ChatSession, Transaction, Story, Report, AnalyticsData } from '../types';
import { CREATORS, POSTS, CURRENT_USER } from '../constants';

const USERS_STORAGE_KEY = 'prive_users_v1';
const POSTS_STORAGE_KEY = 'prive_posts_v1';
const ALBUMS_STORAGE_KEY = 'prive_albums_v1';
const COMMENTS_STORAGE_KEY = 'prive_comments_v1';
const SUBSCRIPTIONS_STORAGE_KEY = 'prive_subscriptions_v1';
const MESSAGES_STORAGE_KEY = 'prive_messages_v1';
const TRANSACTIONS_STORAGE_KEY = 'prive_transactions_v1';
const STORIES_STORAGE_KEY = 'prive_stories_v1';
const REPORTS_STORAGE_KEY = 'prive_reports_v1';
const AUTH_TOKEN_KEY = 'prive_auth_token';

// Helper to get data from storage
const getStored = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

// Helper to set data to storage
const setStored = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const db = {
  // --- User & Auth ---

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  login: async (email: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const storedUsers = getStored<User[]>(USERS_STORAGE_KEY, []);
    const user = storedUsers.find(u => u.email === email);
    
    if (user) {
      Object.assign(CURRENT_USER, user);
      localStorage.setItem(AUTH_TOKEN_KEY, 'mock_token_' + user.id);
      return user;
    }
    
    if (email === 'guest@prive.com') {
      localStorage.setItem(AUTH_TOKEN_KEY, 'mock_token_guest');
      return CURRENT_USER;
    }
    
    // Admin backdoor for demo
    if (email === 'admin@prive.com') {
      const adminUser = { ...CURRENT_USER, id: 'admin', name: 'Usuário Admin', isAdmin: true, email: 'admin@prive.com' };
      Object.assign(CURRENT_USER, adminUser);
      localStorage.setItem(AUTH_TOKEN_KEY, 'mock_token_admin');
      return adminUser;
    }

    throw new Error('Usuário não encontrado');
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  searchUsers: async (query: string): Promise<(User | Creator)[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const storedUsers = getStored<User[]>(USERS_STORAGE_KEY, []);
    const allEntities = [...CREATORS, ...storedUsers, CURRENT_USER];

    if (!query.trim()) return allEntities;

    const lowerQuery = query.toLowerCase();
    return allEntities.filter(entity => 
      entity.name.toLowerCase().includes(lowerQuery) || 
      entity.handle.toLowerCase().includes(lowerQuery)
    );
  },

  registerUser: async (userData: { name: string; handle: string; email: string }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const storedUsers = getStored<User[]>(USERS_STORAGE_KEY, []);

    if (storedUsers.some(u => u.handle === userData.handle)) throw new Error('Nome de usuário já existe');
    if (storedUsers.some(u => u.email === userData.email)) throw new Error('Email já registrado');

    const newUser: User = {
      id: `u_${Date.now()}`,
      name: userData.name,
      handle: userData.handle.startsWith('@') ? userData.handle : `@${userData.handle}`,
      email: userData.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&color=fff`,
      balance: 0,
      isCreator: false,
      kycVerified: false,
      kycStatus: 'none',
      blockedUsers: [],
      createdAt: new Date().toISOString()
    };

    storedUsers.push(newUser);
    setStored(USERS_STORAGE_KEY, storedUsers);
    Object.assign(CURRENT_USER, newUser);
    localStorage.setItem(AUTH_TOKEN_KEY, 'mock_token_' + newUser.id);
    return newUser;
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (userId === CURRENT_USER.id) {
      Object.assign(CURRENT_USER, updates);
    }
    
    const storedUsers = getStored<User[]>(USERS_STORAGE_KEY, []);
    const index = storedUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      storedUsers[index] = { ...storedUsers[index], ...updates };
      setStored(USERS_STORAGE_KEY, storedUsers);
      return storedUsers[index];
    }
    return updates;
  },

  toggleBlockUser: async (userId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const blocked = CURRENT_USER.blockedUsers || [];
    const isBlocked = blocked.includes(userId);
    
    if (isBlocked) {
      CURRENT_USER.blockedUsers = blocked.filter(id => id !== userId);
    } else {
      CURRENT_USER.blockedUsers = [...blocked, userId];
    }
    
    // Update in storage
    await db.updateProfile(CURRENT_USER.id, { blockedUsers: CURRENT_USER.blockedUsers });
    return !isBlocked;
  },

  // --- KYC & Verification ---

  requestKYC: async (userId: string, docUrl: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    await db.updateProfile(userId, { kycStatus: 'pending' });
    return true;
  },

  getKYCRequests: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const storedUsers = getStored<User[]>(USERS_STORAGE_KEY, []);
    // Mock some pending requests if none exist
    const pending = storedUsers.filter(u => u.kycStatus === 'pending');
    if (pending.length === 0) {
      return [
        { ...CURRENT_USER, id: 'u_mock_1', name: 'Jane Doe', handle: '@jane_d', kycStatus: 'pending', email: 'jane@example.com' }
      ];
    }
    return pending;
  },

  processKYC: async (userId: string, status: 'verified' | 'rejected') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const updates: Partial<User> = { 
      kycStatus: status,
      kycVerified: status === 'verified',
      isCreator: status === 'verified'
    };
    
    // Update in storage
    const storedUsers = getStored<User[]>(USERS_STORAGE_KEY, []);
    const index = storedUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      storedUsers[index] = { ...storedUsers[index], ...updates };
      setStored(USERS_STORAGE_KEY, storedUsers);
    }
    
    // Update current user if it matches
    if (userId === CURRENT_USER.id) {
      Object.assign(CURRENT_USER, updates);
    }
    return true;
  },

  // --- Subscriptions ---

  isSubscribed: async (creatorId: string): Promise<boolean> => {
    const subs = getStored<string[]>(SUBSCRIPTIONS_STORAGE_KEY, []);
    return subs.includes(creatorId);
  },

  toggleSubscription: async (creatorId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let subs = getStored<string[]>(SUBSCRIPTIONS_STORAGE_KEY, []);
    const isSub = subs.includes(creatorId);
    
    if (isSub) {
      subs = subs.filter(id => id !== creatorId);
      await db.addTransaction({
        type: 'subscription',
        amount: -19.90,
        status: 'completed',
        description: `Cancelou assinatura de ${creatorId}`
      });
    } else {
      subs.push(creatorId);
      await db.addTransaction({
        type: 'subscription',
        amount: -19.90,
        status: 'completed',
        description: `Assinou ${creatorId}`
      });
    }
    
    setStored(SUBSCRIPTIONS_STORAGE_KEY, subs);
    return !isSub;
  },

  // --- Content (Posts & Feed) ---

  getFeed: async (): Promise<{ post: Post; creator: Creator | User }[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedPosts = getStored<Post[]>(POSTS_STORAGE_KEY, []);
    const allPosts = [...storedPosts, ...POSTS]; 

    const storedUsers = getStored<User[]>(USERS_STORAGE_KEY, []);
    const allUsers = [...CREATORS, ...storedUsers, CURRENT_USER];

    return allPosts.map(post => {
      const creator = allUsers.find(u => u.id === post.creatorId) || CREATORS[0];
      return { post, creator };
    });
  },

  getUserPosts: async (userId: string): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedPosts = getStored<Post[]>(POSTS_STORAGE_KEY, []);
    const allPosts = [...storedPosts, ...POSTS];
    return allPosts.filter(p => p.creatorId === userId);
  },

  createPost: async (postData: Partial<Post>) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newPost: Post = {
      id: `p_${Date.now()}`,
      creatorId: CURRENT_USER.id,
      content: postData.content || '',
      mediaUrl: postData.mediaUrl || 'https://picsum.photos/600/800',
      mediaType: postData.mediaType || 'image',
      likes: 0,
      comments: 0,
      isLocked: postData.isLocked || false,
      price: postData.price,
      albumId: postData.albumId,
      timestamp: 'Agora mesmo',
      scheduledFor: postData.scheduledFor,
      hasWatermark: postData.hasWatermark,
      tags: postData.tags || []
    };

    const storedPosts = getStored<Post[]>(POSTS_STORAGE_KEY, []);
    storedPosts.unshift(newPost);
    setStored(POSTS_STORAGE_KEY, storedPosts);

    if (postData.albumId) {
      const storedAlbums = getStored<Album[]>(ALBUMS_STORAGE_KEY, []);
      const albumIndex = storedAlbums.findIndex(a => a.id === postData.albumId);
      if (albumIndex !== -1) {
        storedAlbums[albumIndex].postCount += 1;
        setStored(ALBUMS_STORAGE_KEY, storedAlbums);
      }
    }

    return newPost;
  },

  deletePost: async (postId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const storedPosts = getStored<Post[]>(POSTS_STORAGE_KEY, []);
    const newPosts = storedPosts.filter(p => p.id !== postId);
    setStored(POSTS_STORAGE_KEY, newPosts);
    return true;
  },

  updatePost: async (postId: string, content: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const storedPosts = getStored<Post[]>(POSTS_STORAGE_KEY, []);
    const index = storedPosts.findIndex(p => p.id === postId);
    if (index !== -1) {
      storedPosts[index].content = content;
      setStored(POSTS_STORAGE_KEY, storedPosts);
      return storedPosts[index];
    }
    return null;
  },

  toggleLike: async (postId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true; 
  },

  unlockPost: async (postId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (CURRENT_USER.balance > 0) {
      CURRENT_USER.balance -= 5;
      await db.addTransaction({
        type: 'unlock',
        amount: -5,
        status: 'completed',
        description: 'Desbloqueou post premium'
      });
      return true;
    }
    return false;
  },

  sendTip: async (creatorId: string, amount: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (CURRENT_USER.balance >= amount) {
      CURRENT_USER.balance -= amount;
      await db.addTransaction({
        type: 'tip',
        amount: -amount,
        status: 'completed',
        description: `Gorjeta enviada para criador`
      });
      return true;
    }
    return false;
  },

  // --- Comments ---

  getComments: async (postId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const allComments = getStored<Comment[]>(COMMENTS_STORAGE_KEY, []);
    return allComments.filter(c => c.postId === postId).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },

  addComment: async (postId: string, text: string): Promise<Comment> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newComment: Comment = {
      id: `cm_${Date.now()}`,
      postId,
      userId: CURRENT_USER.id,
      userName: CURRENT_USER.name,
      userAvatar: CURRENT_USER.avatar,
      text,
      timestamp: 'Agora mesmo'
    };
    
    const allComments = getStored<Comment[]>(COMMENTS_STORAGE_KEY, []);
    allComments.push(newComment);
    setStored(COMMENTS_STORAGE_KEY, allComments);
    
    return newComment;
  },

  // --- Albums ---

  getUserAlbums: async (userId: string): Promise<Album[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedAlbums = getStored<Album[]>(ALBUMS_STORAGE_KEY, []);
    return storedAlbums.filter(a => a.creatorId === userId);
  },

  getAlbum: async (albumId: string): Promise<Album | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const storedAlbums = getStored<Album[]>(ALBUMS_STORAGE_KEY, []);
    return storedAlbums.find(a => a.id === albumId);
  },

  getAlbumPosts: async (albumId: string): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedPosts = getStored<Post[]>(POSTS_STORAGE_KEY, []);
    const allPosts = [...storedPosts, ...POSTS];
    return allPosts.filter(p => p.albumId === albumId);
  },

  createAlbum: async (albumData: { title: string; isLocked: boolean }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAlbum: Album = {
      id: `a_${Date.now()}`,
      creatorId: CURRENT_USER.id,
      title: albumData.title,
      coverUrl: 'https://picsum.photos/200/200',
      postCount: 0,
      isLocked: albumData.isLocked
    };

    const storedAlbums = getStored<Album[]>(ALBUMS_STORAGE_KEY, []);
    storedAlbums.push(newAlbum);
    setStored(ALBUMS_STORAGE_KEY, storedAlbums);

    return newAlbum;
  },

  // --- Notifications ---

  getNotifications: async (): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const mocks: Notification[] = [
      { id: 'n1', type: 'like', actorName: 'Sarah Arts', actorAvatar: 'https://picsum.photos/id/65/200/200', content: 'curtiu sua foto', timestamp: '2m atrás', isRead: false },
      { id: 'n2', type: 'comment', actorName: 'Alex Fitness', actorAvatar: 'https://picsum.photos/id/91/200/200', content: 'Ótima foto! 🔥', timestamp: '1h atrás', isRead: false },
      { id: 'n3', type: 'tip', actorName: 'Mike Travels', actorAvatar: 'https://picsum.photos/id/177/200/200', content: 'enviou R$ 5,00', timestamp: '3h atrás', isRead: true },
    ];
    return mocks;
  },

  markAllNotificationsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  },

  // --- Chat / Messages ---

  getChatSessions: async (): Promise<ChatSession[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Mock sessions
    return CREATORS.slice(0, 3).map(c => ({
      id: `s_${c.id}`,
      participantId: c.id,
      participantName: c.name,
      participantAvatar: c.avatar,
      lastMessage: 'Obrigado por assinar! ❤️',
      lastMessageTime: '2h atrás',
      unreadCount: Math.floor(Math.random() * 3)
    }));
  },

  getMessages: async (sessionId: string): Promise<Message[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedMessages = getStored<Message[]>(MESSAGES_STORAGE_KEY, []);
    // Filter by session logic (mocked)
    return storedMessages.filter(m => m.id.includes(sessionId)).concat([
      { id: 'm1', senderId: 'c1', receiverId: CURRENT_USER.id, text: 'Bem-vindo ao meu feed exclusivo!', timestamp: '1d atrás', isRead: true },
      { id: 'm2', senderId: CURRENT_USER.id, receiverId: 'c1', text: 'Obrigado! Adorando o conteúdo.', timestamp: '1d atrás', isRead: true }
    ]);
  },

  sendMessage: async (receiverId: string, text: string, mediaUrl?: string, price?: number): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMessage: Message = {
      id: `msg_${Date.now()}_${receiverId}`,
      senderId: CURRENT_USER.id,
      receiverId,
      text,
      mediaUrl,
      price,
      isLocked: !!price && price > 0,
      isPaid: false,
      timestamp: 'Agora mesmo',
      isRead: false
    };
    const storedMessages = getStored<Message[]>(MESSAGES_STORAGE_KEY, []);
    storedMessages.push(newMessage);
    setStored(MESSAGES_STORAGE_KEY, storedMessages);
    return newMessage;
  },

  unlockMessage: async (messageId: string, price: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (CURRENT_USER.balance >= price) {
      CURRENT_USER.balance -= price;
      
      // Update message state
      const storedMessages = getStored<Message[]>(MESSAGES_STORAGE_KEY, []);
      const msgIndex = storedMessages.findIndex(m => m.id === messageId);
      if (msgIndex !== -1) {
        storedMessages[msgIndex].isPaid = true;
        storedMessages[msgIndex].isLocked = false;
        setStored(MESSAGES_STORAGE_KEY, storedMessages);
      }

      await db.addTransaction({
        type: 'unlock',
        amount: -price,
        status: 'completed',
        description: 'Desbloqueou mensagem privada'
      });
      return true;
    }
    return false;
  },

  // --- Wallet / Transactions ---

  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stored = getStored<Transaction[]>(TRANSACTIONS_STORAGE_KEY, []);
    const mocks: Transaction[] = [
      { id: 't1', type: 'deposit', amount: 100, status: 'completed', date: '2024-03-10', description: 'Depósito na Carteira' },
      { id: 't2', type: 'subscription', amount: -19.90, status: 'completed', date: '2024-03-12', description: 'Assinatura Isabella Rossi' }
    ];
    return [...mocks, ...stored].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addTransaction: async (tx: Partial<Transaction>) => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: tx.type || 'deposit',
      amount: tx.amount || 0,
      status: tx.status || 'completed',
      date: new Date().toISOString().split('T')[0],
      description: tx.description || 'Transação'
    };
    const stored = getStored<Transaction[]>(TRANSACTIONS_STORAGE_KEY, []);
    stored.unshift(newTx);
    setStored(TRANSACTIONS_STORAGE_KEY, stored);
    return newTx;
  },

  requestWithdrawal: async (amount: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (CURRENT_USER.balance >= amount) {
      CURRENT_USER.balance -= amount;
      await db.addTransaction({
        type: 'withdrawal',
        amount: -amount,
        status: 'pending',
        description: 'Solicitação de Saque'
      });
      return true;
    }
    return false;
  },

  // --- Stories ---
  
  getStories: async (): Promise<Story[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedStories = getStored<Story[]>(STORIES_STORAGE_KEY, []);
    // Mock stories for creators + stored ones
    const mocks = CREATORS.map(c => ({
      id: `st_${c.id}`,
      creatorId: c.id,
      mediaUrl: c.avatar, 
      isViewed: Math.random() > 0.5,
      timestamp: '1h atrás'
    }));
    return [...storedStories, ...mocks];
  },

  addStory: async (mediaUrl: string): Promise<Story> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStory: Story = {
      id: `st_${Date.now()}`,
      creatorId: CURRENT_USER.id,
      mediaUrl,
      isViewed: false,
      timestamp: 'Agora mesmo'
    };
    const stored = getStored<Story[]>(STORIES_STORAGE_KEY, []);
    stored.unshift(newStory);
    setStored(STORIES_STORAGE_KEY, stored);
    return newStory;
  },

  // --- Admin / Moderation ---

  getReports: async (): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stored = getStored<Report[]>(REPORTS_STORAGE_KEY, []);
    // Mock reports
    const mocks: Report[] = [
      { id: 'r1', targetId: 'p1', targetType: 'post', reason: 'Conteúdo inapropriado', status: 'pending', timestamp: '2024-03-15', reporterId: 'u2' },
      { id: 'r2', targetId: 'c4', targetType: 'user', reason: 'Spam', status: 'resolved', timestamp: '2024-03-14', reporterId: 'u3' }
    ];
    return [...stored, ...mocks];
  },

  submitReport: async (targetId: string, targetType: 'post' | 'user', reason: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newReport: Report = {
      id: `r_${Date.now()}`,
      targetId,
      targetType,
      reason,
      status: 'pending',
      timestamp: new Date().toISOString().split('T')[0],
      reporterId: CURRENT_USER.id
    };
    const stored = getStored<Report[]>(REPORTS_STORAGE_KEY, []);
    stored.push(newReport);
    setStored(REPORTS_STORAGE_KEY, stored);
    return newReport;
  },

  resolveReport: async (reportId: string, action: 'resolve' | 'dismiss') => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = getStored<Report[]>(REPORTS_STORAGE_KEY, []);
    const index = stored.findIndex(r => r.id === reportId);
    if (index !== -1) {
      stored[index].status = action === 'resolve' ? 'resolved' : 'dismissed';
      setStored(REPORTS_STORAGE_KEY, stored);
    }
    return true;
  },

  // --- Analytics ---

  getCreatorAnalytics: async (): Promise<AnalyticsData[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Mock data for the last 7 days
    const data: AnalyticsData[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
        earnings: Math.floor(Math.random() * 500) + 50,
        views: Math.floor(Math.random() * 2000) + 100,
        subs: Math.floor(Math.random() * 20)
      });
    }
    return data;
  }
};