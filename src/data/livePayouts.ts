export interface PayoutNotification {
  id: string;
  name: string;
  amountTZS: number;
  amountUSD: number;
  provider: 'M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'HaloPesa';
  taskCategory: string;
  timeAgo: string;
  location: string;
  flag: string;
  avatar: string;
}

// Authentic African / Tanzanian portrait images
const AFRICAN_AVATARS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618151313441-bc79b11e5090?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584999734482-0361aecad844?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80',
];

export const LIVE_PAYOUTS_LIST: PayoutNotification[] = [
  {
    id: 'pay_01',
    name: 'ASHA M.',
    amountTZS: 67000,
    amountUSD: 25.75,
    provider: 'M-Pesa',
    taskCategory: 'AI Image Evaluation',
    timeAgo: 'Dakika 2 zilizopita',
    location: 'Dar es Salaam',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[0],
  },
  {
    id: 'pay_02',
    name: 'BARAKA JUMA',
    amountTZS: 115000,
    amountUSD: 44.20,
    provider: 'Tigo Pesa',
    taskCategory: 'Audio Speech Benchmarking',
    timeAgo: 'Dakika 4 zilizopita',
    location: 'Arusha',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[1],
  },
  {
    id: 'pay_03',
    name: 'FATMA RASHID',
    amountTZS: 54000,
    amountUSD: 20.75,
    provider: 'M-Pesa',
    taskCategory: 'Video Scene Classification',
    timeAgo: 'Dakika 5 zilizopita',
    location: 'Zanzibar',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[2],
  },
  {
    id: 'pay_04',
    name: 'NEEMA ELISHA',
    amountTZS: 142000,
    amountUSD: 54.60,
    provider: 'Airtel Money',
    taskCategory: 'Multimodal AI Audit',
    timeAgo: 'Dakika 7 zilizopita',
    location: 'Mwanza',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[4],
  },
  {
    id: 'pay_05',
    name: 'DENNIS KILIMA',
    amountTZS: 76000,
    amountUSD: 29.20,
    provider: 'HaloPesa',
    taskCategory: 'Text Sentiment Analysis',
    timeAgo: 'Dakika 8 zilizopita',
    location: 'Dodoma',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[3],
  },
  {
    id: 'pay_06',
    name: 'MWANAIDI SAID',
    amountTZS: 89000,
    amountUSD: 34.20,
    provider: 'Tigo Pesa',
    taskCategory: 'Visual Quality Assessment',
    timeAgo: 'Dakika 10 zilizopita',
    location: 'Tanga',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[6],
  },
  {
    id: 'pay_07',
    name: 'EMMANUEL MTUI',
    amountTZS: 120000,
    amountUSD: 46.15,
    provider: 'M-Pesa',
    taskCategory: 'Object Bounding Box Audit',
    timeAgo: 'Dakika 12 zilizopita',
    location: 'Moshi',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[5],
  },
  {
    id: 'pay_08',
    name: 'GLORIA MWANJALA',
    amountTZS: 63000,
    amountUSD: 24.20,
    provider: 'M-Pesa',
    taskCategory: 'Medical AI Scan Triage',
    timeAgo: 'Dakika 14 zilizopita',
    location: 'Mbeya',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[8],
  },
  {
    id: 'pay_09',
    name: 'ZUBEDA BAKARI',
    amountTZS: 51000,
    amountUSD: 19.60,
    provider: 'Tigo Pesa',
    taskCategory: 'Audio Accent Verification',
    timeAgo: 'Dakika 15 zilizopita',
    location: 'Morogoro',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[10],
  },
  {
    id: 'pay_10',
    name: 'ANNA SHOO',
    amountTZS: 78000,
    amountUSD: 30.00,
    provider: 'Airtel Money',
    taskCategory: 'Document OCR Verification',
    timeAgo: 'Dakika 17 zilizopita',
    location: 'Arusha',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[12],
  },
  {
    id: 'pay_11',
    name: 'BEATRICE MOSHI',
    amountTZS: 69000,
    amountUSD: 26.50,
    provider: 'HaloPesa',
    taskCategory: 'Facial Landmark Alignment',
    timeAgo: 'Dakika 19 zilizopita',
    location: 'Kigoma',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[16],
  },
  {
    id: 'pay_12',
    name: 'RAJABU MBWANA',
    amountTZS: 88000,
    amountUSD: 33.85,
    provider: 'M-Pesa',
    taskCategory: 'Satellite Imagery Annotation',
    timeAgo: 'Dakika 21 zilizopita',
    location: 'Dar es Salaam',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[7],
  },
  {
    id: 'pay_13',
    name: 'JOYCE KILIMA',
    amountTZS: 92000,
    amountUSD: 35.38,
    provider: 'Tigo Pesa',
    taskCategory: '3D Point Cloud Inspection',
    timeAgo: 'Dakika 23 zilizopita',
    location: 'Iringa',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[18],
  },
  {
    id: 'pay_14',
    name: 'INNOCENT LYIMO',
    amountTZS: 110000,
    amountUSD: 42.30,
    provider: 'M-Pesa',
    taskCategory: 'Synthetic Voice Realism Check',
    timeAgo: 'Dakika 25 zilizopita',
    location: 'Kilimanjaro',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[9],
  },
  {
    id: 'pay_15',
    name: 'REHEMA MWAKASEGE',
    amountTZS: 74000,
    amountUSD: 28.45,
    provider: 'Airtel Money',
    taskCategory: 'E-commerce Duplicate Detection',
    timeAgo: 'Dakika 27 zilizopita',
    location: 'Mbeya',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[2],
  },
  {
    id: 'pay_16',
    name: 'TUMAINI MGONJA',
    amountTZS: 83000,
    amountUSD: 31.90,
    provider: 'M-Pesa',
    taskCategory: 'Image Edge Sharpening Rating',
    timeAgo: 'Dakika 29 zilizopita',
    location: 'Songea',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[4],
  },
  {
    id: 'pay_17',
    name: 'ESTER MWAMPAMBA',
    amountTZS: 62000,
    amountUSD: 23.85,
    provider: 'Tigo Pesa',
    taskCategory: 'Audio Denoising Evaluation',
    timeAgo: 'Dakika 31 zilizopita',
    location: 'Tabora',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[6],
  },
  {
    id: 'pay_18',
    name: 'HADIJA LEMA',
    amountTZS: 91000,
    amountUSD: 35.00,
    provider: 'M-Pesa',
    taskCategory: 'AI Translation Nuance Test',
    timeAgo: 'Dakika 33 zilizopita',
    location: 'Arusha',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[8],
  },
  {
    id: 'pay_19',
    name: 'SALUM JINGU',
    amountTZS: 105000,
    amountUSD: 40.38,
    provider: 'HaloPesa',
    taskCategory: 'Autonomous Vehicle LiDAR Map',
    timeAgo: 'Dakika 35 zilizopita',
    location: 'Dar es Salaam',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[11],
  },
  {
    id: 'pay_20',
    name: 'MWAJUMA KASSIM',
    amountTZS: 58000,
    amountUSD: 22.30,
    provider: 'Airtel Money',
    taskCategory: 'Swahili Speech Transcription Audit',
    timeAgo: 'Dakika 38 zilizopita',
    location: 'Shinyanga',
    flag: '🇹🇿',
    avatar: AFRICAN_AVATARS[10],
  },

  // 80+ More authentic Tanzanian earners
  ...Array.from({ length: 80 }).map((_, index) => {
    const tzNames = [
      'GODFREY MMASY', 'MARY KOMBA', 'IDDI SELEMANI', 'AGNES KESSY', 'ZAINABU ISSA',
      'FRANK KIMARO', 'LEILA SHABANI', 'ALEX NJAU', 'ELIZABETH NYENZA', 'MARIAM MDEE',
      'CHARLES MAKOYE', 'RUTH KABUYE', 'JOHN BOSCO', 'GRACE SHIRIMA', 'OMARI CHANDE',
      'CATHERINE BURA', 'VICTOR NYAMU', 'KHADIJA SAID', 'SOPHIA MWALUKO', 'DAUDI NCHIMBI',
      'PRISCA MSUYA', 'GEOFFREY OTIENO', 'JUMA LUGANO', 'HALIMA KWAYU', 'ISMAIL MKUDE',
      'PENDO TAIRO', 'ELIAH TEMBA', 'MOHAMED MBARUKU', 'LUCIA MASANJA', 'JULIUS MAHENGE'
    ];
    const tzProviders: ('M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'HaloPesa')[] = [
      'M-Pesa', 'Tigo Pesa', 'Airtel Money', 'HaloPesa', 'M-Pesa', 'Tigo Pesa'
    ];
    const tzCities = [
      'Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Morogoro',
      'Tanga', 'Moshi', 'Zanzibar', 'Tabora', 'Kigoma', 'Iringa', 'Songea',
      'Shinyanga', 'Singida', 'Sumbawanga', 'Lindi', 'Mtwara', 'Bukoba'
    ];
    const categories = [
      'AI Image Quality Evaluation', 'Speech Audio Verification', 'Text Summarization Audit',
      'AI Prompt Benchmarking', 'Semantic Segmentation', 'Audio Clarity Rating',
      'Object Detection Verification', 'Swahili Voice Benchmark', 'Swahili Dialect Rating',
      'Visual Realism Audit', 'LLM Response Fact Check'
    ];

    const chosenName = tzNames[index % tzNames.length] + ' ' + (String.fromCharCode(65 + (index % 26))) + '.';
    const chosenAmount = 45000 + ((index * 3800 + 4500) % 115000);
    const chosenProvider = tzProviders[index % tzProviders.length];
    const chosenCat = categories[index % categories.length];
    const chosenCity = tzCities[index % tzCities.length];
    const minutesAgo = 40 + index * 3;
    const avatarUrl = AFRICAN_AVATARS[index % AFRICAN_AVATARS.length];

    return {
      id: `pay_tz_${index + 21}`,
      name: chosenName,
      amountTZS: chosenAmount,
      amountUSD: Number((chosenAmount / 2600).toFixed(2)),
      provider: chosenProvider,
      taskCategory: chosenCat,
      timeAgo: minutesAgo < 60 ? `Dakika ${minutesAgo} zilizopita` : `Saa ${Math.floor(minutesAgo / 60)} zilizopita`,
      location: chosenCity,
      flag: '🇹🇿',
      avatar: avatarUrl,
    };
  })
];
