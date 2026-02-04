import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    creator: {
      name: 'Tokyo Vibes',
      username: '@tokyo_night',
      avatarUrl: 'https://picsum.photos/seed/avatar1/200/200',
      verified: true
    },
    title: 'Noite em Shibuya 🌃',
    description: 'O lado que ninguém vê da vida noturna em Tóquio. 5 fotos exclusivas sem censura da arquitetura urbana.',
    price: 29.90,
    category: 'Urbano',
    tags: ['Neon', 'Noite', 'Cidade'],
    thumbnailUrl: 'https://picsum.photos/seed/tokyo1/600/400',
    likes: 1240,
    postedAt: '2h atrás',
    photos: [
      { id: 'p1-1', url: 'https://picsum.photos/seed/tokyo1/1200/800', caption: 'Cruzamento Shibuya' },
      { id: 'p1-2', url: 'https://picsum.photos/seed/tokyo2/1200/800', caption: 'Beco Neon' },
      { id: 'p1-3', url: 'https://picsum.photos/seed/tokyo3/1200/800', caption: 'Torre de Tóquio' },
      { id: 'p1-4', url: 'https://picsum.photos/seed/tokyo4/1200/800', caption: 'Reflexos na Chuva' },
      { id: 'p1-5', url: 'https://picsum.photos/seed/tokyo5/1200/800', caption: 'Metrô Vazio' },
    ]
  },
  {
    id: '2',
    creator: {
      name: 'Sarah Nature',
      username: '@sarah_wild',
      avatarUrl: 'https://picsum.photos/seed/avatar2/200/200',
      verified: true
    },
    title: 'Banho de Cachoeira 💦',
    description: 'Ensaio exclusivo nos Alpes Suíços. O frio não me impediu de tirar essas fotos incríveis.',
    price: 45.00,
    category: 'Natureza',
    tags: ['Montanha', 'Neve', 'Inverno'],
    thumbnailUrl: 'https://picsum.photos/seed/alps1/600/400',
    likes: 3500,
    postedAt: '5h atrás',
    photos: [
      { id: 'p2-1', url: 'https://picsum.photos/seed/alps1/1200/800', caption: 'Pico Nevado' },
      { id: 'p2-2', url: 'https://picsum.photos/seed/alps2/1200/800', caption: 'Lago Azul' },
      { id: 'p2-3', url: 'https://picsum.photos/seed/alps3/1200/800', caption: 'Cabana na Floresta' },
    ]
  },
  {
    id: '3',
    creator: {
      name: 'Artistic Soul',
      username: '@art_soul',
      avatarUrl: 'https://picsum.photos/seed/avatar3/200/200',
      verified: false
    },
    title: 'Sessão Privada: Emoções',
    description: 'Um estudo sobre luz e sombra. Conteúdo muito pessoal e artístico.',
    price: 15.50,
    category: 'Arte',
    tags: ['Retrato', 'Abstrato', 'Arte'],
    thumbnailUrl: 'https://picsum.photos/seed/art1/600/400',
    likes: 890,
    postedAt: '1d atrás',
    photos: [
      { id: 'p3-1', url: 'https://picsum.photos/seed/art1/1200/800', caption: 'Sombra e Luz' },
      { id: 'p3-2', url: 'https://picsum.photos/seed/art2/1200/800', caption: 'Cores Vibrantes' },
      { id: 'p3-3', url: 'https://picsum.photos/seed/art3/1200/800', caption: 'Silhueta' },
      { id: 'p3-4', url: 'https://picsum.photos/seed/art4/1200/800', caption: 'Olhar Profundo' },
    ]
  },
  {
    id: '4',
    creator: {
      name: 'Design Master',
      username: '@design_pro',
      avatarUrl: 'https://picsum.photos/seed/avatar4/200/200',
      verified: true
    },
    title: 'Pack de Texturas Premium',
    description: 'Material exclusivo para assinantes. Texturas em 8K.',
    price: 12.00,
    category: 'Design',
    tags: ['Textura', 'Minimalismo'],
    thumbnailUrl: 'https://picsum.photos/seed/texture1/600/400',
    likes: 450,
    postedAt: '2d atrás',
    photos: [
      { id: 'p4-1', url: 'https://picsum.photos/seed/texture1/1200/800', caption: 'Concreto Bruto' },
      { id: 'p4-2', url: 'https://picsum.photos/seed/texture2/1200/800', caption: 'Papel Reciclado' },
      { id: 'p4-3', url: 'https://picsum.photos/seed/texture3/1200/800', caption: 'Madeira Escura' },
    ]
  },
  {
    id: '5',
    creator: {
      name: 'Chef Gourmet',
      username: '@chef_secret',
      avatarUrl: 'https://picsum.photos/seed/avatar5/200/200',
      verified: true
    },
    title: 'O Segredo do Chef 🤫',
    description: 'Receitas e fotos que não posto no Instagram. Veja o preparo completo.',
    price: 35.00,
    category: 'Comida',
    tags: ['Comida', 'Gourmet', 'Delicioso'],
    thumbnailUrl: 'https://picsum.photos/seed/food1/600/400',
    likes: 2100,
    postedAt: '3d atrás',
    photos: [
      { id: 'p5-1', url: 'https://picsum.photos/seed/food1/1200/800', caption: 'Prato Principal' },
      { id: 'p5-2', url: 'https://picsum.photos/seed/food2/1200/800', caption: 'Sobremesa' },
      { id: 'p5-3', url: 'https://picsum.photos/seed/food3/1200/800', caption: 'Ingredientes Frescos' },
      { id: 'p5-4', url: 'https://picsum.photos/seed/food4/1200/800', caption: 'Chef em Ação' },
    ]
  },
  {
    id: '6',
    creator: {
      name: 'Cyber Girl',
      username: '@cyber_ai',
      avatarUrl: 'https://picsum.photos/seed/avatar6/200/200',
      verified: false
    },
    title: 'Futuro Distópico',
    description: 'Minhas criações de IA mais ousadas. Apenas para fãs.',
    price: 50.00,
    category: 'Tech',
    tags: ['IA', 'Futuro', 'Tecnologia'],
    thumbnailUrl: 'https://picsum.photos/seed/tech1/600/400',
    likes: 5000,
    postedAt: '1sem atrás',
    photos: [
      { id: 'p6-1', url: 'https://picsum.photos/seed/tech1/1200/800', caption: 'Rede Neural' },
      { id: 'p6-2', url: 'https://picsum.photos/seed/tech2/1200/800', caption: 'Chip Processador' },
      { id: 'p6-3', url: 'https://picsum.photos/seed/tech3/1200/800', caption: 'Realidade Virtual' },
    ]
  }
];