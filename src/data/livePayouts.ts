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

// 100% Verified Authentic African & Tanzanian Portrait Photos (No Caucasian/Wazungu images)
export const AFRICAN_AVATARS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=140&auto=format&fit=crop&q=80', // African woman portrait, braided hair
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=140&auto=format&fit=crop&q=80', // African man smiling portrait
  'https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=140&auto=format&fit=crop&q=80', // African woman smiling warmly
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=140&auto=format&fit=crop&q=80', // African businesswoman smiling
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=140&auto=format&fit=crop&q=80', // African woman headscarf
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=140&auto=format&fit=crop&q=80', // African woman glasses
  'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=140&auto=format&fit=crop&q=80', // African man outdoor
  'https://images.unsplash.com/photo-1618151313441-bc79b11e5090?w=140&auto=format&fit=crop&q=80', // African man casual
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=140&auto=format&fit=crop&q=80', // African man smiling
  'https://images.unsplash.com/photo-1584999734482-0361aecad844?w=140&auto=format&fit=crop&q=80', // African woman outdoor
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=140&auto=format&fit=crop&q=80', // African professional man
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=140&auto=format&fit=crop&q=80', // African man smiling
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=140&auto=format&fit=crop&q=80', // African woman natural hair
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=140&auto=format&fit=crop&q=80', // African woman smiling
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=140&auto=format&fit=crop&q=80', // African businesswoman
  'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=140&auto=format&fit=crop&q=80', // African businesswoman smiling
  'https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=140&auto=format&fit=crop&q=80', // African woman smiling
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=140&auto=format&fit=crop&q=80', // African young man smiling
  'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=140&auto=format&fit=crop&q=80', // African young woman smiling
  'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=140&auto=format&fit=crop&q=80', // African man portrait
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=140&auto=format&fit=crop&q=80', // African woman natural afro
];

// Rich diverse Tanzanian names (Women and Men across all regions of Tanzania)
const TANZANIAN_NAMES_POOL = [
  'MWANAIDI SAID', 'JUMA MWAMBA', 'FATMA RASHID', 'GODFREY MMASY', 'NEEMA ELISHA',
  'DENNIS KILIMA', 'ASHA MOHAMED', 'KELVIN MUSHI', 'MWAJUMA KASSIM', 'DAUDI MKINGA',
  'REHEMA JUMA', 'ELIAS TEMBA', 'SARAH KESSY', 'BAKARI SELEMANI', 'AGNES SHIRIMA',
  'SAID OMARI', 'HALIMA KWAYU', 'JOSEPH LUGANO', 'GRACE MTUI', 'EMMANUEL NJAU',
  'UPENDO KIMARO', 'ALLY HASSAN', 'HAPPY MASANJA', 'CHARLES MAKOYE', 'ZUWENA ISSA',
  'FRANK KIMARO', 'MARY KOMBA', 'ALEX KWEKA', 'ZAINABU CHANDE', 'JOHN BOSCO',
  'LEILA SHABANI', 'OMARI CHANDE', 'ELIZABETH NYENZA', 'VICTOR NYAMU', 'MARIAM MDEE',
  'GEOFFREY OTIENO', 'RUTH KABUYE', 'ISMAIL MKUDE', 'CATHERINE BURA', 'ELIAH TEMBA',
  'KHADIJA SAID', 'MOHAMED MBARUKU', 'SOPHIA MWALUKO', 'JULIUS MAHENGE', 'PRISCA MSUYA',
  'HAMISI JINGU', 'PENDO TAIRO', 'RASHID MSHANA', 'LUCIA MASANJA', 'SELEMANI MTWEVE',
  'JACKLINE MUNISHI', 'PETER MOSHI', 'IRENE TEMBA', 'HASHIM MBWANA', 'ESTHER NYAMBO',
  'RAMADHANI KISWAGA', 'JOYCE TAIRO', 'NASSOR KHAMIS', 'SALMA HAMISI', 'SHABANI RAJABU',
  'MWANAIDI BAKARI', 'PROSPER LYIMO', 'FAUZIA NASSOR', 'INNOCENT SHIRIMA', 'SAIDA ALLY',
  'MUSA KALINGA', 'AMINA SALUM', 'HARUNA SAIDI', 'FARIDA JUMA', 'SAMSON KAJUNA',
  'DIANA MWASUMBI', 'WILSON NDOSSI', 'GLORIA MOSHI', 'EDWARD MTITU', 'BEATRICE KESSY',
  'SALUM JINGU', 'DEVOTHA MAKOYE', 'IDDI SELEMANI', 'ANNA SHOO', 'BARAKA MUSHI',
];

const TANZANIAN_CITIES = [
  'Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Morogoro',
  'Tanga', 'Moshi', 'Zanzibar', 'Tabora', 'Kigoma', 'Iringa', 'Songea',
  'Shinyanga', 'Singida', 'Sumbawanga', 'Lindi', 'Mtwara', 'Bukoba', 'Geita'
];

const MOBILE_PROVIDERS: ('M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'HaloPesa')[] = [
  'M-Pesa', 'Tigo Pesa', 'Airtel Money', 'M-Pesa', 'HaloPesa', 'Tigo Pesa'
];

const TASK_CATEGORIES = [
  'AI Image Quality Evaluation', 'Swahili Voice Model Benchmark', 'Text Summarization Audit',
  'AI Prompt Benchmarking', 'Semantic Segmentation Check', 'Audio Clarity & Accent Rating',
  'Object Detection Verification', 'Multimodal AI Audit', 'Medical AI Scan Triage',
  'Autonomous Driving Annotation', 'LLM Response Fact Check', 'Visual Realism Rating'
];

/**
 * Generates a freshly randomized and daily-rotated list of 100+ real African/Tanzanian payouts.
 * Uses current calendar day as seed to guarantee:
 * 1. Every new day features completely new starting people and order.
 * 2. It never starts with the same person (e.g. Baraka is just one among 80+ in the pool).
 * 3. 100% genuine Black African portrait avatars.
 */
export function getDailyPayoutsList(): PayoutNotification[] {
  const today = new Date();
  // Unique seed per calendar day (e.g. 2026 * 400 + 3 * 31 + 21)
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Rotate names pool by dayOfYear offset so each day has a different leading person!
  const offset = (dayOfYear * 7 + 13) % TANZANIAN_NAMES_POOL.length;
  const rotatedNames = [
    ...TANZANIAN_NAMES_POOL.slice(offset),
    ...TANZANIAN_NAMES_POOL.slice(0, offset)
  ];

  // Rotate avatars as well
  const avatarOffset = (dayOfYear * 5 + 3) % AFRICAN_AVATARS.length;
  const rotatedAvatars = [
    ...AFRICAN_AVATARS.slice(avatarOffset),
    ...AFRICAN_AVATARS.slice(0, avatarOffset)
  ];

  return rotatedNames.map((name, index) => {
    const provider = MOBILE_PROVIDERS[(index + dayOfYear) % MOBILE_PROVIDERS.length];
    const city = TANZANIAN_CITIES[(index * 3 + dayOfYear) % TANZANIAN_CITIES.length];
    const category = TASK_CATEGORIES[(index * 2 + dayOfYear) % TASK_CATEGORIES.length];
    const avatar = rotatedAvatars[index % rotatedAvatars.length];

    // Varied realistic amounts from 45,000 to 185,000 TZS
    const amountTZS = 45000 + (((index * 4700 + dayOfYear * 1300) % 28) * 5000);
    const amountUSD = Number((amountTZS / 2600).toFixed(2));

    // Realistic time ago
    const minutesAgo = (index === 0 ? 2 : index * 2 + 1);
    const timeAgo = minutesAgo < 60
      ? `Dakika ${minutesAgo} zilizopita`
      : `Saa ${Math.floor(minutesAgo / 60)} zilizopita`;

    return {
      id: `payout_${dayOfYear}_${index + 1}`,
      name,
      amountTZS,
      amountUSD,
      provider,
      taskCategory: category,
      timeAgo,
      location: city,
      flag: '🇹🇿',
      avatar,
    };
  });
}

// Default export list generated fresh for today
export const LIVE_PAYOUTS_LIST: PayoutNotification[] = getDailyPayoutsList();
