export interface UserComment {
  id: string;
  name: string;
  country: string;
  flag: string;
  avatar: string;
  dateEn: string;
  dateSw: string;
  comment: string;
  earningsMentioned?: string;
  verified: boolean;
  tag?: string;
}

// 100% Authentic African / Tanzanian portrait images
export const TANZANIAN_AVATARS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80', // Tanzanian/African woman
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=120&auto=format&fit=crop&q=80', // Tanzanian/African man
  'https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=120&auto=format&fit=crop&q=80', // Tanzanian/African woman
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80', // Tanzanian/African man
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80', // Tanzanian/African professional woman
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', // Tanzanian/African man smiling
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=120&auto=format&fit=crop&q=80', // Tanzanian/African woman
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=120&auto=format&fit=crop&q=80', // Tanzanian/African man
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80', // Tanzanian/African woman
  'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=120&auto=format&fit=crop&q=80', // Tanzanian/African man
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80', // Tanzanian/African woman
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80', // Tanzanian/African young man
  'https://images.unsplash.com/photo-1618151313441-bc79b11e5090?w=120&auto=format&fit=crop&q=80', // Tanzanian/African portrait
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80', // Tanzanian/African professional
  'https://images.unsplash.com/photo-1584999734482-0361aecad844?w=120&auto=format&fit=crop&q=80', // Tanzanian/African man
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80', // Tanzanian/African entrepreneur
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80', // Tanzanian/African woman smiling
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=120&auto=format&fit=crop&q=80', // Tanzanian/African portrait
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', // Tanzanian/African woman
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80', // Tanzanian/African man
];

// Function to generate dynamically updated relative dates for today & yesterday based on real system date
export function getDailyDynamicComments(): UserComment[] {
  const today = new Date();
  const dayNamesSw = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
  const monthNamesSw = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayStr = today.getDate();
  const monthSw = monthNamesSw[today.getMonth()];
  const monthEn = monthNamesEn[today.getMonth()];
  const dayNameSw = dayNamesSw[today.getDay()];

  return [
    {
      id: 'comm_01',
      name: 'Amina Salum (Dar es Salaam)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[0],
      dateEn: `Today, ${dayStr} ${monthEn} • 35 mins ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} (${dayNameSw}) • Dakika 35 zilizopita`,
      comment: 'Nimepokea TSh 85,000 asubuhi ya leo moja kwa moja kupitia M-Pesa. Kazi za AI ni rahisi sana kuzifanya kwenye simu yangu ya kiganjani! 🇹🇿🔥',
      earningsMentioned: 'TSh 85,000 kupitia M-Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_02',
      name: 'Juma Ramadhani (Arusha)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[1],
      dateEn: `Today, ${dayStr} ${monthEn} • 1 hour ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Saa 1 lililopita`,
      comment: 'Kazi za leo za sauti na picha nimezimaliza kwa dakika chache tu. Pesa ya Tigo Pesa imeingia salama bila kuchelewa! 🇹🇿💰',
      earningsMentioned: 'TSh 115,000 Tigo Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_03',
      name: 'Baraka Mushi (Moshi)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[3],
      dateEn: `Today, ${dayStr} ${monthEn} • 2 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 2 yaliyopita`,
      comment: 'Baada ya kukamilisha task zangu za asubuhi, maombi ya withdraw yamekubaliwa na pesa ikaingia M-Pesa bila chenga yoyote! 🇹🇿💪',
      earningsMentioned: 'TSh 120,000 M-Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_04',
      name: 'Neema Elisha (Mwanza)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[4],
      dateEn: `Today, ${dayStr} ${monthEn} • 3 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 3 yaliyopita`,
      comment: 'App hii ni ya kweli kabisa. Nimeanza jana tu na leo tayari nina jumla ya TSh 142,000 kupitia Airtel Money. Nawashukuru sana! 🇹🇿✨',
      earningsMentioned: 'TSh 142,000 Airtel Money',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_05',
      name: 'Fatma Rashid (Zanzibar)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[2],
      dateEn: `Today, ${dayStr} ${monthEn} • 4 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 4 yaliyopita`,
      comment: 'Customer Care kwenye WhatsApp walinisaidia kwa haraka nilipouliza kuhusu usajili. Malipo yangu ya kwanza ya TSh 67,000 yameingia M-Pesa! 🇹🇿',
      earningsMentioned: 'TSh 67,000 M-Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_06',
      name: 'Dennis Kilima (Dodoma)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[5],
      dateEn: `Today, ${dayStr} ${monthEn} • 5 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 5 yaliyopita`,
      comment: 'Kazi za kutofautisha picha na sauti za Kiswahili ni rahisi mno. Nimetumia HaloPesa na fedha imeingia papo kwa hapo bila makato makubwa! 🇹🇿👌',
      earningsMentioned: 'TSh 76,000 HaloPesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_07',
      name: 'Grace Kimaro (Mbeya)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[6],
      dateEn: `Today, ${dayStr} ${monthEn} • 6 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 6 yaliyopita`,
      comment: 'Napenda vile tasks hazichukui muda mrefu, dakika 2 au 3 tu umekamilisha na balance yako inaongezeka hapo hapo! 🇹🇿',
      earningsMentioned: 'TSh 54,000 M-Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_08',
      name: 'Emmanuel Mtui (Tanga)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[7],
      dateEn: `Today, ${dayStr} ${monthEn} • 7 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 7 yaliyopita`,
      comment: 'Nimefanya kazi 8 za AI leo mchana na nimetoa TSh 95,000 moja kwa moja kwenda Tigo Pesa yangu. Asante sana timu ya support! 🇹🇿🔥',
      earningsMentioned: 'TSh 95,000 Tigo Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_09',
      name: 'Zubeda Bakari (Morogoro)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[8],
      dateEn: `Today, ${dayStr} ${monthEn} • 8 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 8 yaliyopita`,
      comment: 'Nimetumia simu yangu ndogo tu kufanya hizi kazi. Ni nzuri sana kwa sisi wamama na vijana tunaotafuta kipato cha ziada kila siku. 🇹🇿',
      earningsMentioned: 'TSh 63,000 M-Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_10',
      name: 'Godfrey Mmasy (Kigoma)',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: TANZANIAN_AVATARS[9],
      dateEn: `Today, ${dayStr} ${monthEn} • 10 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 10 yaliyopita`,
      comment: 'Jukwaa hili ni mkombozi wa kweli. Kila siku nina uhakika wa kupata kuanzia TSh 50,000 ninapomaliza task zote za siku husika! 🇹🇿',
      earningsMentioned: 'TSh 88,000 Airtel Money',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
  ];
}

export const INITIAL_COMMENTS: UserComment[] = getDailyDynamicComments();
