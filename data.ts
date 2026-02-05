import { Pack } from './types';

export const PACKS: Pack[] = [
  {
    id: '1',
    slug: 'maria',
    creator: {
      name: 'Maria',
      username: '@maria',
      avatarUrl: 'https://picsum.photos/seed/avatar1/200/200',
      verified: true
    },
    title: 'Maria',
    description: 'Perfil exclusivo da Maria com fotos inéditas.',
    price: 29.90,
    category: 'Fotos',
    tags: ['Maria', 'Exclusivo'],
    thumbnailUrl: 'https://picsum.photos/seed/maria/600/400',
    likes: 1240,
    postedAt: '2h atrás',
    photos: [
      { id: 'p1-1', url: 'https://picsum.photos/seed/maria1/1200/800', caption: 'Foto 1 da Maria' },
      { id: 'p1-2', url: 'https://picsum.photos/seed/maria2/1200/800', caption: 'Foto 2 da Maria' }
    ]
  },
  {
    id: '2',
    slug: 'joao',
    creator: {
      name: 'João',
      username: '@joao',
      avatarUrl: 'https://picsum.photos/seed/avatar2/200/200',
      verified: true
    },
    title: 'João',
    description: 'Perfil exclusivo do João com fotos inéditas.',
    price: 45.00,
    category: 'Fotos',
    tags: ['João', 'Exclusivo'],
    thumbnailUrl: 'https://picsum.photos/seed/joao/600/400',
    likes: 3500,
    postedAt: '5h atrás',
    photos: [
      { id: 'p2-1', url: 'https://picsum.photos/seed/joao1/1200/800', caption: 'Foto 1 do João' }
    ]
  },
  {
    id: '3',
    slug: 'ana',
    creator: {
      name: 'Ana',
      username: '@ana',
      avatarUrl: 'https://picsum.photos/seed/avatar3/200/200',
      verified: false
    },
    title: 'Ana',
    description: 'Perfil exclusivo da Ana com fotos artísticos e pessoais.',
    price: 15.50,
    category: 'Fotos',
    tags: ['Ana', 'Arte'],
    thumbnailUrl: 'https://picsum.photos/seed/ana/600/400',
    likes: 890,
    postedAt: '1d atrás',
    photos: [
      { id: 'p3-1', url: 'https://picsum.photos/seed/ana1/1200/800', caption: 'Foto 1 da Ana' },
      { id: 'p3-2', url: 'https://picsum.photos/seed/ana2/1200/800', caption: 'Foto 2 da Ana' }
    ]
  },
  {
    id: '4',
    slug: 'carlos',
    creator: {
      name: 'Carlos',
      username: '@carlos',
      avatarUrl: 'https://picsum.photos/seed/avatar4/200/200',
      verified: true
    },
    title: 'Carlos',
    description: 'Perfil exclusivo do Carlos com fotos inéditas.',
    price: 12.00,
    category: 'Fotos',
    tags: ['Carlos', 'Exclusivo'],
    thumbnailUrl: 'https://picsum.photos/seed/carlos/600/400',
    likes: 450,
    postedAt: '2d atrás',
    photos: [
      { id: 'p4-1', url: 'https://picsum.photos/seed/carlos1/1200/800', caption: 'Foto 1 do Carlos' }
    ]
  },
  {
    id: '5',
    slug: 'beatriz',
    creator: {
      name: 'Beatriz',
      username: '@beatriz',
      avatarUrl: 'https://picsum.photos/seed/avatar5/200/200',
      verified: true
    },
    title: 'Beatriz',
    description: 'Perfil exclusivo da Beatriz com fotos inéditas.',
    price: 35.00,
    category: 'Fotos',
    tags: ['Beatriz', 'Exclusivo'],
    thumbnailUrl: 'https://picsum.photos/seed/beatriz/600/400',
    likes: 2100,
    postedAt: '3d atrás',
    photos: [
      { id: 'p5-1', url: 'https://picsum.photos/seed/beatriz1/1200/800', caption: 'Foto 1 da Beatriz' }
    ]
  },
  {
    id: '6',
    slug: 'lucas',
    creator: {
      name: 'Lucas',
      username: '@lucas',
      avatarUrl: 'https://picsum.photos/seed/avatar6/200/200',
      verified: false
    },
    title: 'Lucas',
    description: 'Perfil exclusivo do Lucas com fotos inéditas.',
    price: 50.00,
    category: 'Fotos',
    tags: ['Lucas', 'Exclusivo'],
    thumbnailUrl: 'https://picsum.photos/seed/lucas/600/400',
    likes: 5000,
    postedAt: '1sem atrás',
    photos: [
      { id: 'p6-1', url: 'https://picsum.photos/seed/lucas1/1200/800', caption: 'Foto 1 do Lucas' }
    ]
  },

  // Packs de Vídeos
{
  id: '7',
  slug: 'maria-video',
  creator: {
    name: 'Maria',
    username: '@maria',
    avatarUrl: 'https://picsum.photos/seed/avatar1/200/200',
    verified: true
  },
  title: 'Maria - Vídeo Exclusivo',
  description: 'Vídeo exclusivo da Maria com bastidores inéditos.',
  price: 39.90,
  category: 'Vídeos',
  tags: ['Maria', 'Exclusivo', 'Bastidores'],
  thumbnailUrl: 'https://picsum.photos/seed/maria-video/600/400',
  likes: 980,
  postedAt: '3h atrás',
  videos: [
    { id: 'v1-1', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', caption: 'Vídeo 1 da Maria' }
  ]
},
{
  id: '8',
  slug: 'joao-video',
  creator: {
    name: 'João',
    username: '@joao',
    avatarUrl: 'https://picsum.photos/seed/avatar2/200/200',
    verified: true
  },
  title: 'João - Vídeo Exclusivo',
  description: 'Vídeo exclusivo do João com cenas inéditas.',
  price: 55.00,
  category: 'Vídeos',
  tags: ['João', 'Exclusivo'],
  thumbnailUrl: 'https://picsum.photos/seed/joao-video/600/400',
  likes: 1500,
  postedAt: '6h atrás',
  videos: [
    { id: 'v2-1', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4', caption: 'Vídeo 1 do João' }
  ]
},
{
  id: '9',
  slug: 'ana-video',
  creator: {
    name: 'Ana',
    username: '@ana',
    avatarUrl: 'https://picsum.photos/seed/avatar3/200/200',
    verified: false
  },
  title: 'Ana - Vídeo Exclusivo',
  description: 'Vídeo artístico e pessoal da Ana.',
  price: 25.00,
  category: 'Vídeos',
  tags: ['Ana', 'Arte'],
  thumbnailUrl: 'https://picsum.photos/seed/ana-video/600/400',
  likes: 700,
  postedAt: '10h atrás',
  videos: [
    { id: 'v3-1', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4', caption: 'Vídeo 1 da Ana' }
  ]
},
{
  id: '10',
  slug: 'carlos-video',
  creator: {
    name: 'Carlos',
    username: '@carlos',
    avatarUrl: 'https://picsum.photos/seed/avatar4/200/200',
    verified: true
  },
  title: 'Carlos - Vídeo Exclusivo',
  description: 'Vídeo exclusivo do Carlos com bastidores inéditos.',
  price: 20.00,
  category: 'Vídeos',
  tags: ['Carlos', 'Exclusivo'],
  thumbnailUrl: 'https://picsum.photos/seed/carlos-video/600/400',
  likes: 400,
  postedAt: '1d atrás',
  videos: [
    { id: 'v4-1', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4', caption: 'Vídeo 1 do Carlos' }
  ]
},
{
  id: '11',
  slug: 'beatriz-video',
  creator: {
    name: 'Beatriz',
    username: '@beatriz',
    avatarUrl: 'https://picsum.photos/seed/avatar5/200/200',
    verified: true
  },
  title: 'Beatriz - Vídeo Exclusivo',
  description: 'Vídeo exclusivo da Beatriz com cenas inéditas.',
  price: 45.00,
  category: 'Vídeos',
  tags: ['Beatriz', 'Exclusivo'],
  thumbnailUrl: 'https://picsum.photos/seed/beatriz-video/600/400',
  likes: 2100,
  postedAt: '2d atrás',
  videos: [
    { id: 'v5-1', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_20mb.mp4', caption: 'Vídeo 1 da Beatriz' }
  ]
},
{
  id: '12',
  slug: 'lucas-video',
  creator: {
    name: 'Lucas',
    username: '@lucas',
    avatarUrl: 'https://picsum.photos/seed/avatar6/200/200',
    verified: false
  },
  title: 'Lucas - Vídeo Exclusivo',
  description: 'Vídeo exclusivo do Lucas com cenas inéditas.',
  price: 60.00,
  category: 'Vídeos',
  tags: ['Lucas', 'Exclusivo'],
  thumbnailUrl: 'https://picsum.photos/seed/lucas-video/600/400',
  likes: 5000,
  postedAt: '3d atrás',
  videos: [
    { id: 'v6-1', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4', caption: 'Vídeo 1 do Lucas' }
  ]
}
];
