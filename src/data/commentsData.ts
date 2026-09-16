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
      name: 'Amina Salum',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 42 mins ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} (${dayNameSw}) • Dakika 42 zilizopita`,
      comment: 'Nimepokea TSh 85,000 asubuhi ya leo moja kwa moja kupitia M-Pesa. Kazi za AI ni rahisi sana kuzifanya kwenye simu yangu ya kiganjani! 🇹🇿🔥',
      earningsMentioned: 'TSh 85,000 kupitia M-Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_02',
      name: 'Peter Johnson',
      country: 'USA',
      flag: '🇺🇸',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 1 hour ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Saa 1 lililopita`,
      comment: 'This platform is genuinely amazing for daily earning. Fast AI micro-evaluations and transparent withdrawals to PayPal. 🇺🇸',
      earningsMentioned: '$140.00 withdrawn',
      verified: true,
      tag: 'Verified Contributor',
    },
    {
      id: 'comm_03',
      name: 'Baraka Mushi',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 2.5 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 2.5 yaliyopita`,
      comment: 'Baada ya kukamilisha task zangu za asubuhi, maombi ya withdraw yamekubaliwa na pesa ikaingia Tigo Pesa bila chenga yoyote! 🇹🇿💪',
      earningsMentioned: 'TSh 120,000 Tigo Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_04',
      name: 'Kelvin Mwangi',
      country: 'Kenya',
      flag: '🇰🇪',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 3 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 3 yaliyopita`,
      comment: 'Legit platform! Completed today’s image and voice benchmarking tasks and received payout instantly to M-Pesa Kenya. 🇰🇪',
      earningsMentioned: 'KSh 6,200 M-Pesa',
      verified: true,
      tag: 'Verified Earner',
    },
    {
      id: 'comm_05',
      name: 'Fatma Zahra',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 4 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 4 yaliyopita`,
      comment: 'Huduma kwa wateja (Customer Care) kwenye WhatsApp walinisaidia kwa haraka na malipo yangu ya Airtel Money yakaingia fasta! 🇹🇿✨',
      earningsMentioned: 'TSh 67,000 Airtel Money',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_06',
      name: 'David Smith',
      country: 'United Kingdom',
      flag: '🇬🇧',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 5 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 5 yaliyopita`,
      comment: 'Clean user interface and realistic AI benchmarks. Completing tasks during my daily commute gives me great extra income. 🇬🇧',
      earningsMentioned: '£85.00 credited',
      verified: true,
      tag: 'Verified Reviewer',
    },
    {
      id: 'comm_07',
      name: 'Grace Kimaro',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 6 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 6 yaliyopita`,
      comment: 'Napenda vile tasks hazichukui muda mrefu, dakika 2 au 3 tu umekamilisha na balance yako inaongezeka hapo hapo! 🇹🇿',
      earningsMentioned: 'TSh 54,000 M-Pesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_08',
      name: 'Kwame Mensah',
      country: 'Ghana',
      flag: '🇬🇭',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 8 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 8 yaliyopita`,
      comment: 'Impressive system. The AI model validation process is straightforward and paying on time every single day. 🇬🇭',
      earningsMentioned: '$65.00 earned',
      verified: true,
      tag: 'Verified Earner',
    },
    {
      id: 'comm_09',
      name: 'Dennis Kilima',
      country: 'Tanzania',
      flag: '🇹🇿',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 9 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 9 yaliyopita`,
      comment: 'Nimetumia HaloPesa kutoa pesa yangu jioni ya leo baada ya kumaliza kazi 10 za AI. Jukwaa hili ni la kweli na linasaidia sana vijana! 🇹🇿',
      earningsMentioned: 'TSh 92,000 HaloPesa',
      verified: true,
      tag: 'Malipo ya Leo (Today)',
    },
    {
      id: 'comm_10',
      name: 'Sarah Becker',
      country: 'Germany',
      flag: '🇩🇪',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      dateEn: `Today, ${dayStr} ${monthEn} • 11 hours ago`,
      dateSw: `Leo, ${dayStr} ${monthSw} • Masaa 11 yaliyopita`,
      comment: 'Sehr gute Plattform für KI-Datenannotation. Die Aufgaben sind abwechslungsreich und fair vergütet. 🇩🇪',
      earningsMentioned: '€95.00 ausgezahlt',
      verified: true,
      tag: 'Verified Contributor',
    },
  ];
}

export const INITIAL_COMMENTS: UserComment[] = getDailyDynamicComments();
