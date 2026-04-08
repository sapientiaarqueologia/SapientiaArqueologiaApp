export type Review = {
  id: string;
  authorId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  avatar: string;
  projects: number;
  rating: number;
  isOnline: boolean;
  reviews: Review[];
  timePeriods: string[];
  artifactTypes: string[];
};

export type Comment = {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
};

export type Ad = {
  id: string;
  title: string;
  description: string;
  authorId: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  location: string;
  tags: string[];
  timePeriod: string;
  artifactType: string;
  projectStatus?: 'Ongoing' | 'Completed' | 'Proposed' | 'Urgent';
};

export type ImageItem = {
  id: string;
  title: string;
  authorId: string;
  location: string;
  url: string;
  likes: number;
};

export type VideoItem = {
  id: string;
  title: string;
  authorId: string;
  duration: string;
  views: number;
  thumbnail: string;
};

export type FileItem = {
  id: string;
  title: string;
  authorId: string;
  type: string;
  size: string;
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  summary: string;
  date: string;
  url: string;
  image: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export type Chat = {
  id: string;
  participants: string[];
  messages: Message[];
  unreadCount: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Ideas para excavación',
    content: 'Revisar la estratigrafía del sector C. Llevar equipo de topografía nuevo.',
    authorId: 'u1',
    createdAt: '2023-10-20T10:00:00Z',
    updatedAt: '2023-10-20T10:00:00Z'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Dra. Elena Rostova',
    specialty: 'Cerámica Precolombina',
    location: 'Lima, Perú',
    avatar: 'https://picsum.photos/seed/elena/100/100',
    projects: 12,
    rating: 4.8,
    isOnline: true,
    timePeriods: ['Precolumbian'],
    artifactTypes: ['Pottery'],
    reviews: [
      { id: 'r1', authorId: 'u3', rating: 5, comment: 'Excelente colaboradora, muy precisa en sus dataciones.', createdAt: '2023-09-15T10:00:00Z' }
    ]
  },
  {
    id: 'u2',
    name: 'Dr. Marcus Thorne',
    specialty: 'Egiptología',
    location: 'El Cairo, Egipto',
    avatar: 'https://picsum.photos/seed/marcus/100/100',
    projects: 34,
    rating: 4.9,
    isOnline: false,
    timePeriods: ['Ancient'],
    artifactTypes: ['Inscriptions', 'Architecture'],
    reviews: [
      { id: 'r2', authorId: 'u4', rating: 5, comment: 'Su conocimiento sobre el Imperio Medio es inigualable.', createdAt: '2023-10-01T14:30:00Z' }
    ]
  },
  {
    id: 'u3',
    name: 'Prof. Sarah Jenkins',
    specialty: 'Datación por Carbono-14',
    location: 'Oxford, UK',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    projects: 56,
    rating: 5.0,
    isOnline: true,
    timePeriods: ['Prehistoric', 'Ancient', 'Medieval'],
    artifactTypes: ['Organic Remains'],
    reviews: []
  },
  {
    id: 'u4',
    name: 'Carlos Mendoza',
    specialty: 'Arqueología Subacuática',
    location: 'Cádiz, España',
    avatar: 'https://picsum.photos/seed/carlos/100/100',
    projects: 8,
    rating: 4.5,
    isOnline: true,
    timePeriods: ['Classical', 'Medieval'],
    artifactTypes: ['Coins', 'Pottery', 'Shipwrecks'],
    reviews: [
      { id: 'r3', authorId: 'u1', rating: 4, comment: 'Buen trabajo de campo, aunque el informe tardó un poco.', createdAt: '2023-08-20T09:15:00Z' }
    ]
  },
  {
    id: 'u5',
    name: 'Dr. Wei Chen',
    specialty: 'Dinastía Han',
    location: 'Xi\'an, China',
    avatar: 'https://picsum.photos/seed/wei/100/100',
    projects: 22,
    rating: 4.7,
    isOnline: false,
    timePeriods: ['Classical'],
    artifactTypes: ['Pottery', 'Weapons'],
    reviews: []
  }
];

export const CURRENT_USER = MOCK_USERS[0];

export const MOCK_ADS: Ad[] = [
  {
    id: 'a1',
    title: 'Necesito experto en datación por Carbono-14',
    description: 'Hemos encontrado restos orgánicos en una nueva excavación en la costa norte y necesitamos un especialista para fechar las muestras con urgencia. Los gastos de envío están cubiertos.',
    authorId: 'u4',
    createdAt: '2023-10-25T10:00:00Z',
    likes: 15,
    likedBy: [],
    comments: [
      { id: 'c1', authorId: 'u3', text: 'Puedo ayudar con esto. Mi laboratorio tiene disponibilidad la próxima semana.', createdAt: '2023-10-25T11:30:00Z' },
      { id: 'c2', authorId: 'u2', text: 'Asegúrate de no contaminar las muestras con material moderno.', createdAt: '2023-10-25T12:00:00Z' }
    ],
    location: 'Cádiz, España',
    tags: ['Carbono-14', 'Datación', 'Restos Orgánicos'],
    timePeriod: 'Classical',
    artifactType: 'Organic Remains',
    projectStatus: 'Ongoing'
  },
  {
    id: 'a2',
    title: 'Busco especialista en jeroglíficos del Imperio Medio',
    description: 'Durante la última campaña en Luxor hemos desenterrado una estela con inscripciones inusuales. Buscamos alguien con experiencia específica en variaciones dialectales del Imperio Medio.',
    authorId: 'u2',
    createdAt: '2023-10-24T15:20:00Z',
    likes: 32,
    likedBy: [],
    comments: [
      { id: 'c3', authorId: 'u5', text: 'Tengo un colega en la universidad que podría estar interesado. Le pasaré el enlace.', createdAt: '2023-10-24T16:00:00Z' }
    ],
    location: 'Luxor, Egipto',
    tags: ['Egiptología', 'Epigrafía', 'Imperio Medio'],
    timePeriod: 'Ancient',
    artifactType: 'Inscriptions',
    projectStatus: 'Ongoing'
  },
  {
    id: 'a3',
    title: 'Ayuda para identificar fragmentos de cerámica',
    description: 'Tengo varios fragmentos que parecen ser de la cultura Moche, pero los patrones no coinciden con los registros habituales. ¿Alguien experto en la zona norte de Perú?',
    authorId: 'u1',
    createdAt: '2023-10-26T09:15:00Z',
    likes: 8,
    likedBy: [],
    comments: [],
    location: 'Trujillo, Perú',
    tags: ['Cerámica', 'Moche', 'Identificación'],
    timePeriod: 'Precolumbian',
    artifactType: 'Pottery',
    projectStatus: 'Proposed'
  },
  {
    id: 'a4',
    title: 'Restauración de armas de bronce',
    description: 'Buscamos conservador especializado en metales para tratar un lote de espadas cortas encontradas en un enterramiento secundario.',
    authorId: 'u5',
    createdAt: '2023-10-27T08:00:00Z',
    likes: 24,
    likedBy: [],
    comments: [
      { id: 'c4', authorId: 'u4', text: 'He trabajado con bronces oxidados bajo el agua, los principios de estabilización son similares. Te envío mensaje.', createdAt: '2023-10-27T09:30:00Z' }
    ],
    location: 'Xi\'an, China',
    tags: ['Metales', 'Restauración', 'Bronce'],
    timePeriod: 'Classical',
    artifactType: 'Weapons',
    projectStatus: 'Ongoing'
  },
  {
    id: 'a5',
    title: 'Análisis de isótopos en dientes',
    description: 'Proyecto completado busca revisión por pares de los resultados de análisis de isótopos de estroncio en población medieval.',
    authorId: 'u3',
    createdAt: '2023-10-28T11:20:00Z',
    likes: 45,
    likedBy: [],
    comments: [],
    location: 'Oxford, UK',
    tags: ['Isótopos', 'Bioarqueología', 'Revisión'],
    timePeriod: 'Medieval',
    artifactType: 'Organic Remains',
    projectStatus: 'Completed'
  }
];

export const MOCK_IMAGES: ImageItem[] = [
  { id: 'i1', title: 'Vasija Moche Intacta', authorId: 'u1', location: 'Huaca del Sol', url: 'https://picsum.photos/seed/vasija/600/400', likes: 120 },
  { id: 'i2', title: 'Excavación Sector B', authorId: 'u4', location: 'Bahía de Cádiz', url: 'https://picsum.photos/seed/excavacion/600/400', likes: 85 },
];

export const MOCK_VIDEOS: VideoItem[] = [
  { id: 'v1', title: 'Proceso de limpieza de monedas romanas', authorId: 'u4', duration: '12:45', views: 1500, thumbnail: 'https://picsum.photos/seed/monedas/600/400' },
  { id: 'v2', title: 'Tour virtual tumba KV62', authorId: 'u2', duration: '45:20', views: 8900, thumbnail: 'https://picsum.photos/seed/tumba/600/400' },
];

export const MOCK_FILES: FileItem[] = [
  { id: 'f1', title: 'Informe Preliminar Campaña 2023.pdf', authorId: 'u2', type: 'PDF', size: '4.2 MB' },
  { id: 'f2', title: 'Registro Estratigráfico.xlsx', authorId: 'u1', type: 'Excel', size: '1.5 MB' },
  { id: 'f3', title: 'Modelo 3D Ánfora.obj', authorId: 'u4', type: '3D Model', size: '28 MB' },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: 'n1', title: 'Descubren nueva cámara oculta en la Gran Pirámide', source: 'National Geographic', summary: 'Científicos utilizando escáneres de muones han detectado un espacio vacío previamente desconocido sobre la Gran Galería.', date: 'Hace 2 horas', url: '#', image: 'https://picsum.photos/seed/piramide/600/400' },
  { id: 'n2', title: 'Nuevas fechas para el poblamiento de América', source: 'Science Magazine', summary: 'Huellas humanas fosilizadas en Nuevo México sugieren que los humanos llegaron a América miles de años antes de lo que se pensaba.', date: 'Hace 1 día', url: '#', image: 'https://picsum.photos/seed/huellas/600/400' },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'ch1',
    participants: ['u1', 'u3'],
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Hola Sarah, vi tu comentario en mi anuncio.', createdAt: '2023-10-25T12:00:00Z' },
      { id: 'm2', senderId: 'u3', text: '¡Hola Elena! Sí, tengo espacio en el laboratorio.', createdAt: '2023-10-25T12:05:00Z' },
      { id: 'm3', senderId: 'u3', text: '¿Cuántas muestras necesitas analizar?', createdAt: '2023-10-25T12:06:00Z' },
    ]
  },
  {
    id: 'ch2',
    participants: ['u1', 'u4'],
    unreadCount: 0,
    messages: [
      { id: 'm4', senderId: 'u4', text: 'Hola, ¿tienes experiencia con ánforas romanas?', createdAt: '2023-10-20T09:00:00Z' },
      { id: 'm5', senderId: 'u1', text: 'Hola Carlos. Mi especialidad es precolombina, pero conozco a alguien que te puede ayudar.', createdAt: '2023-10-20T10:15:00Z' },
    ]
  }
];
