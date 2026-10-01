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
  {
    id: 'f9',
    name: 'Dr. Sarah Jenkins',
    age: 32,
    country: 'Sweden',
    flag: '🇸🇪',
    profession: 'Mtafiti wa Wanyamapori',
    topic: 'Hifadhi ya Ngorongoro',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Ninafanya utafiti wa faru Ngorongoro. Nifundishe salamu za heshima porini!',
    weekdayRate: 27000,
    weekdayUsd: 11,
    weekendRate: 48000,
    weekendUsd: 20,
    usdRate: 11,
    ratePerChat: 27000,
    network: 'TigoPesa',
    rating: 4.93,
    chatsCompleted: 118,
    badge: 'Mpya Leo',
    initialMessage: 'Hej! Faru na Kiboko wanaitwaje kwa heshima huko?',
    quickChips: [
      'Faru mwenye pembe',
      'Kiboko yupo majini',
      'Hifadhi ni salama',
      'Tazama kule bonde',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['faru', 'kiboko', 'mnyama', 'bonde'],
        replyText: 'Asante sana! Nimeandika "Faru" na "Kiboko" kwa umakini mkubwa.',
      },
      {
        triggerKeywords: ['usalama', 'pori', 'ngorongoro', 'mazingira'],
        replyText: 'Ngorongoro ni eneo la kustaajabisha duniani!',
      },
    ],
    fallbackResponses: [
      'Tack så mycket!',
      'Asante sana mwalimu wangu!',
      'Nimefurahi kujifunza kutoka kwako!',
    ],
  },
  {
    id: 'f10',
    name: 'Alexander Weber',
    age: 35,
    country: 'Germany',
    flag: '🇩🇪',
    profession: 'Mwalimu wa Jiografia',
    topic: 'Kupanda Kilimanjaro',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Napanga kupanda kilele cha Kibo. Nifundishe maneno ya kutia moyo njiani!',
    weekdayRate: 29000,
    weekdayUsd: 12,
    weekendRate: 51000,
    weekendUsd: 21,
    usdRate: 12,
    ratePerChat: 29000,
    network: 'M-Pesa',
    rating: 4.97,
    chatsCompleted: 210,
    badge: 'Top Earner',
    initialMessage: 'Hallo! "Pole pole" inasaidiaje kufika kileleni Kilimanjaro?',
    quickChips: [
      'Pole pole ndio mwendo',
      'Kunywa maji mengi',
      'Kesho tutafika kileleni',
      'Hongera sana umefika',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['pole pole', 'kibo', 'kilele', 'mlima'],
        replyText: '"Pole pole ndio mwendo"! Huu usemi utanipa nguvu hadi Kibo!',
      },
      {
        triggerKeywords: ['baridi', 'theluji', 'koti', 'nguo'],
        replyText: 'Nimejiandaa na nguo nzito za theluji!',
      },
    ],
    fallbackResponses: [
      'Vielen Dank!',
      'Safi sana rafiki yangu!',
      'Asante kwa mwongozo bora!',
    ],
  },
  {
    id: 'f11',
    name: 'Chloe Martin',
    age: 28,
    country: 'France',
    flag: '🇫🇷',
    profession: 'Mwanahabari wa Utalii',
    topic: 'Milima ya Usambara',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Niko Lushoto kuandika makala ya milima. Nifundishe maneno ya ukarimu!',
    weekdayRate: 24000,
    weekdayUsd: 10,
    weekendRate: 46000,
    weekendUsd: 19,
    usdRate: 10,
    ratePerChat: 24000,
    network: 'Airtel Money',
    rating: 4.91,
    chatsCompleted: 98,
    badge: 'Online Sasa',
    initialMessage: 'Bonjour! Nikiwa sokoni Lushoto nasemaje "habari za asubuhi"?',
    quickChips: [
      'Habari za asubuhi Lushoto',
      'Matunda haya ni matamu',
      'Milima ya Usambara inapendeza',
      'Karibu tena kwetu',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['asubuhi', 'lushoto', 'habari', 'soko'],
        replyText: 'C\'est parfait! Nitasalimia kila mtu sokoni kwa ukarimu.',
      },
      {
        triggerKeywords: ['matunda', 'kahawa', 'chai', 'chakula'],
        replyText: 'Kahawa na parachichi za Lushoto zinasifika sana!',
      },
    ],
    fallbackResponses: [
      'Merci beaucoup!',
      'Asante sana!',
      'Nimefurahia mazungumzo yetu!',
    ],
  },
  {
    id: 'f12',
    name: 'Oliver Smith',
    age: 30,
    country: 'UK',
    flag: '🇬🇧',
    profession: 'Mwongoza Safari za Pori',
    topic: 'Mikumi Safari Tour',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Naleta wageni Mikumi. Nifundishe jinsi ya kuwasalimia wenyeji mtaani!',
    weekdayRate: 31000,
    weekdayUsd: 13,
    weekendRate: 49000,
    weekendUsd: 20,
    usdRate: 13,
    ratePerChat: 31000,
    network: 'Halopesa',
    rating: 4.89,
    chatsCompleted: 142,
    badge: 'Top Earner',
    initialMessage: 'Hello mate! Nikitaka kuuliza "vipi hali ya barabara ya Mikumi" nasemaje?',
    quickChips: [
      'Barabara iko shwari',
      'Angalia wanyama wanavuka',
      'Mikumi ina mandhari nzuri',
      'Pumzika hapa hotelini',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['barabara', 'shwari', 'salama', 'usafiri'],
        replyText: 'Brilliant! "Barabara iko shwari" ni maneno rahisi na sahihi.',
      },
      {
        triggerKeywords: ['wanyama', 'twiga', 'pundamilia', 'chui'],
        replyText: 'Pundamilia na twiga wengi hupenda kupita hapo!',
      },
    ],
    fallbackResponses: [
      'Cheers mate!',
      'Asante sana rafiki yangu!',
      'Safii sana!',
    ],
  },
  {
    id: 'f13',
    name: 'Hannah Becker',
    age: 25,
    country: 'Germany',
    flag: '🇩🇪',
    profession: 'Mwanafunzi wa Afya ya Jamii',
    topic: 'Kliniki za Vijijini',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Ninatembelea kliniki za mama na mtoto. Nifundishe salamu za upendo!',
    weekdayRate: 19000,
    weekdayUsd: 8,
    weekendRate: 45000,
    weekendUsd: 18,
    usdRate: 8,
    ratePerChat: 19000,
    network: 'M-Pesa',
    rating: 4.88,
    chatsCompleted: 76,
    badge: 'Anahitaji Mwalimu',
    initialMessage: 'Guten Tag! Nikimpongeza mama aliyejifungua mtoto mzuri nasemaje?',
    quickChips: [
      'Hongera sana kwa kupata mtoto!',
      'Mungu amlinde mtoto',
      'Afya njema kwenu wote',
      'Karibu mtoto duniani',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['hongera', 'mtoto', 'mama', 'afya'],
        replyText: '"Hongera sana kwa mtoto!" Maneno yenye faraja na furaha tele.',
      },
      {
        triggerKeywords: ['kliniki', 'dawa', 'huduma', 'uzazi'],
        replyText: 'Kazi ya kutoa elimu ya afya vijijini inanitia moyo sana.',
      },
    ],
    fallbackResponses: [
      'Danke schön!',
      'Asante sana kwa ufundishaji wako mzuri!',
      'Nimejifunza mengi leo!',
    ],
  },
  {
    id: 'f14',
    name: 'Liam O\'Connor',
    age: 37,
    country: 'Ireland',
    flag: '🇮🇪',
    profession: 'Mhifadhi Misitu Asili',
    topic: 'Misitu ya Amani Tanga',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Nalinda vyanzo vya maji na vipepeo Amani. Nifundishe maneno ya miti na mvua!',
    weekdayRate: 21000,
    weekdayUsd: 8,
    weekendRate: 47000,
    weekendUsd: 19,
    usdRate: 8,
    ratePerChat: 21000,
    network: 'AzamPesa',
    rating: 4.94,
    chatsCompleted: 135,
    badge: 'Online Sasa',
    initialMessage: 'Dia dhuit! Neno "Mti" na "Mvua" yanatamkwaje kwa sauti nzuri?',
    quickChips: [
      'Mti unaleta hewa safi',
      'Mvua ya baraka imenyesha',
      'Hifadhi msitu wetu',
      'Vipepeo wanaruka juu',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['mti', 'mvua', 'msitu', 'asili'],
        replyText: '"Mti na Mvua" - maneno matamu sana yenye uhai!',
      },
      {
        triggerKeywords: ['amani', 'tanga', 'vipepeo', 'mazingira'],
        replyText: 'Misitu ya milima ya Tanga ina spishi za pekee sana duniani.',
      },
    ],
    fallbackResponses: [
      'Go raibh maith agat!',
      'Asante sana rafiki yangu!',
      'Safi sana mwalimu!',
    ],
  },
  {
    id: 'f15',
    name: 'Mia Takahashi',
    age: 27,
    country: 'Japan',
    flag: '🇯🇵',
    profession: 'Mbunifu wa Mifumo ya Tehama',
    topic: 'Shule za Tehama Mwanza',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Nafundisha programu za kompyuta Mwanza. Nifundishe kuwapongeza wanafunzi!',
    weekdayRate: 25000,
    weekdayUsd: 10,
    weekendRate: 50000,
    weekendUsd: 20,
    usdRate: 10,
    ratePerChat: 25000,
    network: 'TigoPesa',
    rating: 4.96,
    chatsCompleted: 167,
    badge: 'Mpya Leo',
    initialMessage: 'Konnichiwa! Nikitaka kuambia mwanafunzi "umefanya kazi nzuri sana" nasemaje?',
    quickChips: [
      'Umefanya vizuri sana!',
      'Endelea kujituma',
      'Kompyuta ni rahisi kujifunza',
      'Hongera kwa mafanikio yako',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['vizuri', 'kazi', 'hongera', 'mwanafunzi'],
        replyText: '"Umefanya kazi nzuri sana" - nitaipenda sana kusema darasani!',
      },
      {
        triggerKeywords: ['mwanza', 'ziwa', 'victoria', 'samaki'],
        replyText: 'Mwanza ni jiji zuri sana pembezoni mwa Ziwa Victoria.',
      },
    ],
    fallbackResponses: [
      'Arigatou gozaimasu!',
      'Asante sana rafiki yangu!',
      'Nimefurahi sana!',
    ],
  },
  {
    id: 'f16',
    name: 'Carlos Rodriguez',
    age: 34,
    country: 'Spain',
    flag: '🇪🇸',
    profession: 'Mtayarishaji wa Muziki',
    topic: 'Muziki wa Taarab Zanzibar',
    avatar: 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
    bio: 'Narekodi vyombo vya asili Zanzibar. Nifundishe misemo ya ngoma na sanaa!',
    weekdayRate: 23000,
    weekdayUsd: 9,
    weekendRate: 46000,
    weekendUsd: 18,
    usdRate: 9,
    ratePerChat: 23000,
    network: 'M-Pesa',
    rating: 4.9,
    chatsCompleted: 104,
    badge: 'Top Earner',
    initialMessage: 'Hola! Neno "Muziki mtamu wa asili" linasemwaje kwa ladha ya pwani?',
    quickChips: [
      'Muziki mtamu wa Taarab',
      'Ngoma inalia vizuri',
      'Wapigaji wana ustadi mkubwa',
      'Burudani safi sana pwani',
    ],
    conversationFlow: [
      {
        triggerKeywords: ['taarab', 'ngoma', 'muziki', 'asili'],
        replyText: '¡Qué maravilla! Muziki wa Zanzibar una roho na utulivu mkubwa.',
      },
      {
        triggerKeywords: ['zanzibar', 'pwani', 'bahari', 'forodhani'],
        replyText: 'Ninapenda sana kutembea Forodhani jioni nikisikiliza ngoma.',
      },
    ],
    fallbackResponses: [
      '¡Muchas gracias!',
      'Asante sana ndugu yangu!',
      'Safii sana!',
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

// Return all 16 foreigners on the site
export function getDailyForeigners(): ForeignerProfile[] {
  return ALL_FOREIGNERS;
}
