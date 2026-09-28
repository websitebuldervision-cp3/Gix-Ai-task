export type Network = 'TigoPesa' | 'M-Pesa' | 'Airtel Money' | 'Halopesa' | 'AzamPesa';

export interface ChatExchange {
  triggerKeywords: string[];
  replyText: string;
}

export interface ForeignerProfile {
  id: string;
  name: string;
  age: number;
  country: string;
  flag: string;
  avatar: string;
  profession: string;
  topic: string; // The unique topic for this foreigner
  bio: string;
  weekdayRate: number; // TZS 15,000 - 32,000 (Jumatatu - Ijumaa)
  weekdayUsd: number;
  weekendRate: number; // TZS 45,000+ (Jumamosi - Jumapili)
  weekendUsd: number;
  usdRate: number;
  ratePerChat: number;
  network: Network;
  rating: number;
  chatsCompleted: number;
  badge?: 'Mpya Leo' | 'Online Sasa' | 'Top Earner' | 'Anahitaji Mwalimu';
  initialMessage: string;
  quickChips: string[];
  conversationFlow: ChatExchange[];
  fallbackResponses: string[];
}

export const REG_URL = 'https://moxeraagencies.com/register?ref=Cp3';
export const WHATSAPP_URL =
  'https://wa.me/255776387522?text=hello%20Customer%20care%20naomba%20nielekeze%20Jinsi%20ya%20kufungua%20account%20kwenye%20hii%20site%20ela%20ya%20kufungua%20account%2015000%20ninayo%20nipo%20tayar%20kufungua%20account%20leo';

// Check if today is Saturday (6) or Sunday (0)
export const isWeekend = (date: Date = new Date()): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Jumapili, 6 = Jumamosi
};

// Master catalog of foreigners:
// Weekdays (Jumatatu - Ijumaa): 15,000 - 32,000 TZS tu (haizidi 32,000 TZS)
// Weekends (Jumamosi - Jumapili): 45,000 TZS na kuendelea
const RAW_FOREIGNERS: ForeignerProfile[] = [
  {
    id: 'f1',
    name: 'Dr. Jessica Miller',
    age: 29,
    country: 'USA',
    flag: '🇺🇸',
    profession: 'Daktari wa Watoto',
    topic: 'Hospitali Zanzibar',
    avatar: 'https://images.pexels.com/photos/16869444/pexels-photo-16869444.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Nakuja Zanzibar hospitalini. Nifundishe salamu za wagonjwa!',
    weekdayRate: 26000,
    weekdayUsd: 11,
    weekendRate: 46000,
    weekendUsd: 19,
    usdRate: 11,
    ratePerChat: 26000,
    network: 'M-Pesa',
    rating: 4.95,
    chatsCompleted: 154,
    badge: 'Mpya Leo',
    initialMessage: 'Jambo! Nifundishe salamu za heshima hospitalini?',
    quickChips: [
      'Habari yako!',
      'Pole sana, unaumwa?',
      'Kunywa dawa hizi',
      'Utapona haraka!',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['habari', 'asubuhi', 'jambo'],
        replyText: 'Aha asante! Na "pole sana" inamaanisha nini?',
      },
      {
        triggerKeywords: ['pole', 'unaumwa', 'wapi', 'kichwa'],
        replyText: 'Nimekuelewa vizuri! Je "dawa" inaitwaje?',
      },
      {
        triggerKeywords: ['dawa', 'kunywa', 'maji', 'kula'],
        replyText: 'Safi sana, nitaandika kwenye daftari langu!',
      },
      {
        triggerKeywords: ['utapona', 'mungu', 'haraka'],
        replyText: 'Wow asante sana, unanisaidia sana rafiki yangu!',
      },
    ],
    fallbackResponses: [
      'Asante sana! Nimeelewa vizuri.',
      'Safi sana rafiki yangu!',
      'Neno zuri sana, asante!',
    ],
  },
  {
    id: 'f2',
    name: 'Michael Brown',
    age: 35,
    country: 'UK',
    flag: '🇬🇧',
    profession: 'Mpiga Picha za Wanyama',
    topic: 'Safari ya Serengeti',
    avatar: 'https://images.pexels.com/photos/15014092/pexels-photo-15014092.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Napanga safari Serengeti. Nifundishe majina ya wanyama!',
    weekdayRate: 32000, // Kiwango cha juu siku za kazi (haizidi 32,000)
    weekdayUsd: 13,
    weekendRate: 52000,
    weekendUsd: 21,
    usdRate: 13,
    ratePerChat: 32000,
    network: 'TigoPesa',
    rating: 4.88,
    chatsCompleted: 112,
    badge: 'Online Sasa',
    initialMessage: 'Hello! Simba na Tembo wanaitwaje porini?',
    quickChips: [
      'Simba na Tembo',
      'Tazama kule chini!',
      'Tusimame tupige picha',
      'Twiga anakula majani',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['simba', 'tembo', 'chui', 'wanyama'],
        replyText: 'Wow "Simba"! Na nikitaka dereva asimame ninasemaje?',
      },
      {
        triggerKeywords: ['simama', 'tusimame', 'picha', 'hapa'],
        replyText: 'Brilliant! "Tusimame tupige picha" ni rahisi sana.',
      },
      {
        triggerKeywords: ['twiga', 'mti', 'kule', 'majani'],
        replyText: 'Safi sana! Guide wangu Serengeti atafurahi sana.',
      },
    ],
    fallbackResponses: [
      'Brilliant, asante sana!',
      'Safi sana!',
      'Thanks mate, nimeelewa!',
    ],
  },
  {
    id: 'f3',
    name: 'Sophie Anderson',
    age: 24,
    country: 'Canada',
    flag: '🇨🇦',
    profession: 'Mwanafunzi wa Fasihi',
    topic: 'Methali za Kiswahili',
    avatar: 'https://images.pexels.com/photos/1820575/pexels-photo-1820575.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Ninaandika thesis ya methali. Nifundishe methali yako bora!',
    weekdayRate: 22000,
    weekdayUsd: 9,
    weekendRate: 45000,
    weekendUsd: 18,
    usdRate: 9,
    ratePerChat: 22000,
    network: 'Airtel Money',
    rating: 5.0,
    chatsCompleted: 220,
    badge: 'Top Earner',
    initialMessage: 'Bonjour! Unaweza kunifundisha methali ya Kiswahili?',
    quickChips: [
      'Haba na haba hujaza kibaba',
      'Umoja ni nguvu',
      'Karibu mgeni',
      'Mpole hapotei njia',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['haba', 'kibaba', 'polepole'],
        replyText: '"Haba na haba"! Hekima kubwa sana hii.',
      },
      {
        triggerKeywords: ['umoja', 'nguvu', 'utengano'],
        replyText: '"Umoja ni nguvu"! Inavutia mno, asante!',
      },
      {
        triggerKeywords: ['karibu', 'mgeni', 'njia', 'mpole'],
        replyText: 'Asante sana! Nimeipenda sana lugha ya Kiswahili.',
      },
    ],
    fallbackResponses: [
      'Asante mwalimu wangu!',
      'Methali nzuri sana!',
      'Nimeipenda sana!',
    ],
  },
  {
    id: 'f4',
    name: 'David Wilson',
    age: 42,
    country: 'Australia',
    flag: '🇦🇺',
    profession: 'Mtafiti wa Bahari',
    topic: 'Soko la Samaki Mafia',
    avatar: 'https://images.pexels.com/photos/15019490/pexels-photo-15019490.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Nakuja Mafia kuogelea na Papa. Nifundishe kupatana bei!',
    weekdayRate: 18000,
    weekdayUsd: 7,
    weekendRate: 48000,
    weekendUsd: 20,
    usdRate: 7,
    ratePerChat: 18000,
    network: 'Halopesa',
    rating: 4.84,
    chatsCompleted: 95,
    badge: 'Anahitaji Mwalimu',
    initialMessage: 'G\'day! Nawezaje kupatana bei ya samaki sokoni?',
    quickChips: [
      'Punguza bei kidogo',
      'Hii ni bei gani?',
      'Samaki mbichi na mtamu',
      'Nipe kilo mbili',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['bei', 'punguza', 'kidogo', 'soko'],
        replyText: '"Punguza bei kidogo"! Haha safi sana.',
      },
      {
        triggerKeywords: ['ngapi', 'bei gani', 'samaki', 'kiasi'],
        replyText: 'Aha, "bei gani" nitaitumia sokoni Kivukoni!',
      },
      {
        triggerKeywords: ['mbichi', 'mtamu', 'kilo', 'mbili'],
        replyText: 'Cheers mate, niko tayari kwenda sokoni sasa!',
      },
    ],
    fallbackResponses: [
      'Cheers mate, asante!',
      'Safi sana!',
      'Nimeelewa vizuri!',
    ],
  },
  {
    id: 'f5',
    name: 'Emma Taylor',
    age: 31,
    country: 'Germany',
    flag: '🇩🇪',
    profession: 'Software Engineer',
    topic: 'Salamu za Arusha',
    avatar: 'https://images.pexels.com/photos/35367077/pexels-photo-35367077.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Ninahamia Arusha kufanya kazi. Nifundishe salamu za heshima!',
    weekdayRate: 30000,
    weekdayUsd: 12,
    weekendRate: 50000,
    weekendUsd: 20,
    usdRate: 12,
    ratePerChat: 30000,
    network: 'AzamPesa',
    rating: 4.92,
    chatsCompleted: 180,
    badge: 'Mpya Leo',
    initialMessage: 'Hallo! Kusalimia wazee Arusha nasemaje?',
    quickChips: [
      'Shikamoo mzee wangu',
      'Habari za jioni jirani',
      'Karibu unywe chai',
      'Tutaonana kesho',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['shikamoo', 'marahaba', 'wazee'],
        replyText: '"Shikamoo - Marahaba"! Heshima nzuri sana.',
      },
      {
        triggerKeywords: ['jirani', 'jioni', 'habari'],
        replyText: 'Aha "Habari za jioni"! Majirani watanipenda.',
      },
      {
        triggerKeywords: ['chai', 'karibu', 'kesho'],
        replyText: 'Danke schön! Kiswahili chako ni chepesi sana.',
      },
    ],
    fallbackResponses: [
      'Danke schön!',
      'Asante sana!',
      'Safi sana rafiki!',
    ],
  },
  {
    id: 'f6',
    name: 'Chef James Carter',
    age: 38,
    country: 'France',
    flag: '🇫🇷',
    profession: 'Mpishi wa Kimataifa',
    topic: 'Vyakula vya Asili',
    avatar: 'https://images.pexels.com/photos/6102841/pexels-photo-6102841.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Ninafungua mgahawa Paris. Nifundishe vyakula vya Kitanzania!',
    weekdayRate: 20000,
    weekdayUsd: 8,
    weekendRate: 47000,
    weekendUsd: 19,
    usdRate: 8,
    ratePerChat: 20000,
    network: 'M-Pesa',
    rating: 4.89,
    chatsCompleted: 130,
    badge: 'Top Earner',
    initialMessage: 'Bonjour! Viungo na vyakula vya Zanzibar naagizaje?',
    quickChips: [
      'Pilau ya karafuu',
      'Naomba biriani kuku',
      'Chai ya tangawizi',
      'Chakula kitamu sana',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['pilau', 'karafuu', 'viungo', 'mdalasini'],
        replyText: '"Karafuu na mdalasini"! Harufu nzuri sana.',
      },
      {
        triggerKeywords: ['biriani', 'kuku', 'sahani', 'naomba'],
        replyText: '"Naomba biriani" - safi sana!',
      },
      {
        triggerKeywords: ['chai', 'tangawizi', 'kitamu', 'asante'],
        replyText: 'Merci beaucoup! Nitaweka maneno haya kwenye menu yangu.',
      },
    ],
    fallbackResponses: [
      'Merci beaucoup!',
      'Chakula kitamu sana!',
      'Asante mpishi mwenzangu!',
    ],
  },
  {
    id: 'f7',
    name: 'Elena Rossi',
    age: 27,
    country: 'Italy',
    flag: '🇮🇹',
    profession: 'Mbunifu wa Mitindo',
    topic: 'Kanga na Vitenge',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Ninapenda vitenge na kanga. Nifundishe misemo ya kanga!',
    weekdayRate: 28000,
    weekdayUsd: 11,
    weekendRate: 49000,
    weekendUsd: 20,
    usdRate: 11,
    ratePerChat: 28000,
    network: 'TigoPesa',
    rating: 4.96,
    chatsCompleted: 145,
    badge: 'Mpya Leo',
    initialMessage: 'Ciao! Nifundishe misemo ya kwenye Kanga?',
    quickChips: [
      'Nguo nzuri ya kitenge',
      'Ujumbe wa upendo',
      'Rangi ya dhahabu na bluu',
      'Inakupendeza sana',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['kanga', 'kitenge', 'nguo', 'kupendeza'],
        replyText: '"Inakupendeza sana"! Bellissimo!',
      },
      {
        triggerKeywords: ['ujumbe', 'upendo', 'dhahabu', 'rangi'],
        replyText: 'Napenda jumbe za Kanga sana, zina hekima.',
      },
    ],
    fallbackResponses: [
      'Grazie mille!',
      'Nzuri sana!',
      'Asante rafiki yangu!',
    ],
  },
  {
    id: 'f8',
    name: 'Lucas Van Dijk',
    age: 33,
    country: 'Netherlands',
    flag: '🇳🇱',
    profession: 'Msafiri wa Baiskeli',
    topic: 'Kusalimia Vijijini',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Ninaendesha baiskeli vijijini. Nifundishe kuomba maji na njia!',
    weekdayRate: 15000, // Kiwango cha kuanzia cha kawaida (15,000)
    weekdayUsd: 6,
    weekendRate: 45000,
    weekendUsd: 18,
    usdRate: 6,
    ratePerChat: 15000,
    network: 'M-Pesa',
    rating: 4.87,
    chatsCompleted: 88,
    badge: 'Online Sasa',
    initialMessage: 'Hoi! Nikiwa kwenye baiskeli naombaje maji?',
    quickChips: [
      'Naomba maji ya kunywa',
      'Njia ya mjini ni ipi?',
      'Ni kilomita ngapi?',
      'Asante kwa ukarimu',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['maji', 'kunywa', 'omba', 'safi'],
        replyText: '"Naomba maji ya kunywa"! Hili litaniokoa jua kali.',
      },
      {
        triggerKeywords: ['njia', 'mji', 'kilomita', 'wapi'],
        replyText: '"Ni kilomita ngapi" - muhimu sana barabarani!',
      },
    ],
    fallbackResponses: [
      'Dank je wel!',
      'Safi sana!',
      'Asante sana!',
    ],
  },
];

// Configure dynamic ratePerChat & usdRate getters so they are ALWAYS accurate based on day of week:
// Weekdays (Mon-Fri): 15,000 - 32,000 TZS
// Weekends (Sat-Sun): 45,000+ TZS
RAW_FOREIGNERS.forEach((f) => {
  Object.defineProperty(f, 'ratePerChat', {
    get() {
      return isWeekend() ? f.weekendRate : f.weekdayRate;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(f, 'usdRate', {
    get() {
      return isWeekend() ? f.weekendUsd : f.weekdayUsd;
    },
    enumerable: true,
    configurable: true,
  });
});

export const ALL_FOREIGNERS: ForeignerProfile[] = RAW_FOREIGNERS;

// Swahili day & month names for authentic Tanzanian dynamic dates
const SWAHILI_DAYS = [
  'Jumapili',
  'Jumatatu',
  'Jumanne',
  'Jumatano',
  'Alhamisi',
  'Ijumaa',
  'Jumamosi',
];

const SWAHILI_MONTHS = [
  'Januari',
  'Februari',
  'Machi',
  'Aprili',
  'Mei',
  'Juni',
  'Julai',
  'Agosti',
  'Septemba',
  'Oktoba',
  'Novemba',
  'Desemba',
];

export function getSwahiliDateString(date: Date = new Date()): {
  fullDate: string;
  shortDate: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  year: number;
} {
  const dayName = SWAHILI_DAYS[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = SWAHILI_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return {
    fullDate: `${dayName}, ${dayNumber} ${monthName} ${year}`,
    shortDate: `${dayNumber} ${monthName}`,
    dayName,
    dayNumber,
    monthName,
    year,
  };
}

// Daily rotation engine: picks 6 distinct foreigners based on the exact day of the year
export function getDailyForeigners(date: Date = new Date()): ForeignerProfile[] {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const total = ALL_FOREIGNERS.length;
  const count = 6;
  const offset = (dayOfYear * 3) % total;

  const result: ForeignerProfile[] = [];
  for (let i = 0; i < count; i++) {
    const index = (offset + i) % total;
    result.push(ALL_FOREIGNERS[index]);
  }

  return result;
}
