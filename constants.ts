import { Creator, Post, User } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Usuário Visitante',
  handle: '@visitante',
  avatar: 'https://picsum.photos/id/64/200/200',
  balance: 150.00
};

export const CREATORS: Creator[] = [
  {
    id: 'c1',
    name: 'Isabella Rossi',
    handle: '@isabella_r',
    avatar: 'https://picsum.photos/id/338/200/200',
    banner: 'https://picsum.photos/id/314/1200/400',
    bio: 'Modelo fashion & vlogger de estilo de vida. Junte-se para bastidores exclusivos! 📸✨',
    price: 19.90,
    subscribers: '12.5k',
    postsCount: 142,
    photosCount: 320,
    videosCount: 45,
    isVerified: true,
    tags: ['Moda', 'Estilo de Vida', 'Viagem']
  },
  {
    id: 'c2',
    name: 'Alex Fitness',
    handle: '@alexfit',
    avatar: 'https://picsum.photos/id/91/200/200',
    banner: 'https://picsum.photos/id/184/1200/400',
    bio: 'Personal trainer. Rotinas de treino diárias e planos de dieta. 💪🥗',
    price: 9.90,
    subscribers: '8.2k',
    postsCount: 89,
    photosCount: 150,
    videosCount: 80,
    isVerified: true,
    tags: ['Fitness', 'Saúde', 'Academia']
  },
  {
    id: 'c3',
    name: 'Sarah Arts',
    handle: '@sarah_creates',
    avatar: 'https://picsum.photos/id/65/200/200',
    banner: 'https://picsum.photos/id/106/1200/400',
    bio: 'Artista digital e cosplayer. Veja meu processo e sets exclusivos! 🎨🧝‍♀️',
    price: 14.90,
    subscribers: '25k',
    postsCount: 310,
    photosCount: 500,
    videosCount: 20,
    isVerified: true,
    tags: ['Arte', 'Cosplay', 'Games']
  },
  {
    id: 'c4',
    name: 'Viaje com Mike',
    handle: '@mike_travels',
    avatar: 'https://picsum.photos/id/177/200/200',
    banner: 'https://picsum.photos/id/164/1200/400',
    bio: 'Explorando as joias escondidas do mundo. 🌍✈️',
    price: 4.99,
    subscribers: '5k',
    postsCount: 45,
    photosCount: 200,
    videosCount: 10,
    isVerified: false,
    tags: ['Viagem', 'Aventura']
  },
  {
    id: 'c5',
    name: 'Chef Julia',
    handle: '@chef_julia',
    avatar: 'https://picsum.photos/id/292/200/200',
    banner: 'https://picsum.photos/id/225/1200/400',
    bio: 'Receitas secretas e aulas de culinária. 🍝🍷',
    price: 12.00,
    subscribers: '18k',
    postsCount: 200,
    photosCount: 400,
    videosCount: 150,
    isVerified: true,
    tags: ['Comida', 'Culinária']
  }
];

export const POSTS: Post[] = [
  {
    id: 'p1',
    creatorId: 'c1',
    content: 'Prévia do novo ensaio! O que acharam desse look? ❤️',
    mediaUrl: 'https://picsum.photos/id/338/600/800',
    mediaType: 'image',
    likes: 1240,
    comments: 85,
    isLocked: false,
    timestamp: '2h atrás'
  },
  {
    id: 'p2',
    creatorId: 'c1',
    content: 'Set exclusivo apenas para assinantes. Vibes sem censura. 🔥',
    mediaUrl: 'https://picsum.photos/id/339/600/800',
    mediaType: 'image',
    likes: 3500,
    comments: 210,
    isLocked: true,
    timestamp: '5h atrás'
  },
  {
    id: 'p3',
    creatorId: 'c2',
    content: 'Cardio matinal feito. Aqui está a rotina.',
    mediaUrl: 'https://picsum.photos/id/91/600/600',
    mediaType: 'image',
    likes: 890,
    comments: 45,
    isLocked: false,
    timestamp: '1d atrás'
  },
  {
    id: 'p4',
    creatorId: 'c3',
    content: 'Trabalhando na nova armadura de cosplay. Está demorando uma eternidade, mas vale a pena!',
    mediaUrl: 'https://picsum.photos/id/65/600/400',
    mediaType: 'image',
    likes: 2100,
    comments: 130,
    isLocked: false,
    timestamp: '3h atrás'
  },
  {
    id: 'p5',
    creatorId: 'c3',
    content: 'Resultado completo do ensaio. Download em alta resolução disponível.',
    mediaUrl: 'https://picsum.photos/id/66/600/800',
    mediaType: 'image',
    likes: 4500,
    comments: 320,
    isLocked: true,
    timestamp: '6h atrás'
  },
  {
    id: 'p6',
    creatorId: 'c1',
    content: 'Apenas relaxando em casa hoje.',
    mediaUrl: 'https://picsum.photos/id/342/600/800',
    mediaType: 'image',
    likes: 900,
    comments: 60,
    isLocked: true,
    timestamp: '1d atrás'
  }
];