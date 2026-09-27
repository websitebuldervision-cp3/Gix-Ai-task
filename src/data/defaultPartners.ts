import { ChatPartner } from '../types';

export const DEFAULT_PARTNERS: ChatPartner[] = [
  {
    id: 'partner_sarah_usa',
    name: 'Sarah Jenkins',
    username: 'sarah_travels',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    nativeLanguage: 'English',
    kiswahiliLevel: 'beginner',
    bio: {
      en: 'Wildlife photographer traveling to Serengeti and Zanzibar this November. Want to learn basic greetings and polite conversation!',
      sw: 'Mpiga picha wa wanyamapori anayekuja Serengeti na Zanzibar mwezi huu wa Novemba. Nataka kujifunza salamu za msingi na maongezi ya heshima!',
    },
    status: 'online',
    interests: ['Wildlife Safari', 'Zanzibar beaches', 'Photography', 'Travel'],
    learningGoals: {
      en: 'Learn how to greet elders, ask for directions, and order local food in Swahili.',
      sw: 'Kujifunza kusalimia wazee, kuulizia njia, na kuagiza chakula kwa Kiswahili.',
    },
    promptStarters: [
      {
        en: 'Hi! Could you teach me how to say "Good morning, how are you?" in Kiswahili?',
        sw: 'Habari! Je unaweza kunifundisha jinsi ya kusema "Habari za asubuhi, unajisikiaje?" kwa Kiswahili?',
      },
      {
        en: 'What is the most respectful greeting to use when arriving at a village?',
        sw: 'Ni salamu gani ya heshima zaidi kuitumia ukifika kijijini?',
      },
      {
        en: 'How do I introduce myself and say where I come from?',
        sw: 'Je, ninajitambulishaje na kusema ninapotoka?',
      },
    ],
    sampleResponses: [
      {
        trigger: 'habari',
        reply: {
          en: 'Nzuri sana! Did I answer that correctly? How do I ask about your family?',
          sw: 'Nzuri sana! Je nimejibu kwa usahihi? Je naulizaje kuhusu familia yako?',
        },
      },
      {
        trigger: 'jina',
        reply: {
          en: 'Jina langu ni Sarah! Nice to meet you! How do I say "pleased to meet you" in Swahili?',
          sw: 'Jina langu ni Sarah! Nimefurahi kukufahamu! Nitasemaje "nimefurahi kukutana nawe" kwa Kiswahili?',
        },
      },
      {
        trigger: 'karibu',
        reply: {
          en: 'Asante sana! I really appreciate your patience in teaching me. The culture sounds wonderful!',
          sw: 'Asante sana! Ninashukuru sana kwa uvumilivu wako wa kunifundisha. Utamaduni wenu unapendeza sana!',
        },
      },
      {
        trigger: 'asante',
        reply: {
          en: 'Karibu! What is another useful everyday phrase you use in Tanzania?',
          sw: 'Karibu! Ni neno gani lingine muhimu la kila siku mnalotumia Tanzania?',
        },
      },
      {
        trigger: 'mambo',
        reply: {
          en: 'Poa! Haha, my friend told me young people say that! Is that true?',
          sw: 'Poa! Haha, rafiki yangu aliniambia vijana husema hivyo! Ni kweli?',
        },
      },
    ],
  },
  {
    id: 'partner_michael_uk',
    name: 'Michael Sterling',
    username: 'm_sterling_london',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    countryFlag: '🇬🇧',
    nativeLanguage: 'English',
    kiswahiliLevel: 'intermediate',
    bio: {
      en: 'Architect based in London volunteering on an eco-building project in Arusha. Practicing conversation skills and vocabulary.',
      sw: 'Msanifu majengo kutoka London anayejitolea kwenye mradi wa ujenzi rafiki wa mazingira Arusha. Anafanya mazoezi ya kuongea na misamiati.',
    },
    status: 'online',
    interests: ['Architecture', 'Arusha life', 'Coffee farming', 'Kilimanjaro hike'],
    learningGoals: {
      en: 'Expand conversational fluency, learn numbers and market bargaining phrases.',
      sw: 'Kupanua ufasaha wa mazungumzo, kujifunza namba na namna ya kuongea sokoni.',
    },
    promptStarters: [
      {
        en: 'Habari rafiki! Can we practice counting and shopping phrases today?',
        sw: 'Habari rafiki! Je, tunaweza kufanya mazoezi ya kuhesabu na maneno ya dukani leo?',
      },
      {
        en: 'How do you say "How much is this?" and "Can you reduce the price?"',
        sw: 'Unasemaje "Hii ni bei gani?" na "Unaweza kunipunguzia bei kidogo?"',
      },
    ],
    sampleResponses: [
      {
        trigger: 'bei',
        reply: {
          en: 'Ah, "Hii ni bei gani?" That is so helpful! Can you teach me how to say numbers from 1,000 to 10,000?',
          sw: 'Aha, "Hii ni bei gani?" Hilo neno linanisaidia sana! Je unaweza kunifundisha namba kuanzia elfu moja hadi elfu kumi?',
        },
      },
      {
        trigger: 'duka',
        reply: {
          en: 'Sawa! I want to visit the local market in Arusha without needing a translator.',
          sw: 'Sawa kabisa! Nataka kwenda sokoni hapa Arusha bila kuhitaji mkalimani.',
        },
      },
      {
        trigger: 'shikamoo',
        reply: {
          en: 'Marahaba! I learned that this is how to show high respect to elders. I love this custom!',
          sw: 'Marahaba! Nilijifunza kuwa hii ni heshima kubwa kwa wazee. Ninapenda sana desturi hii!',
        },
      },
    ],
  },
  {
    id: 'partner_elena_italy',
    name: 'Elena Rossi',
    username: 'elena_roma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    country: 'Italy',
    countryCode: 'IT',
    countryFlag: '🇮🇹',
    nativeLanguage: 'Italian',
    kiswahiliLevel: 'beginner',
    bio: {
      en: 'Marine biology student conducting coral reef research near Mafia Island. Passionate about Swahili marine and coastal culture.',
      sw: 'Mwanafunzi wa biolojia ya bahari anayefanya utafiti wa miamba ya matumbawe karibu na Kisiwa cha Mafia. Anapenda utamaduni wa pwani.',
    },
    status: 'online',
    interests: ['Marine Life', 'Scuba Diving', 'Mafia Island', 'Swahili Poetry'],
    learningGoals: {
      en: 'Learn coastal Swahili phrases and everyday expressions for talking with fishermen.',
      sw: 'Kujifunza Kiswahili cha pwani na misemo ya kila siku ya kuongea na wavuvi.',
    },
    promptStarters: [
      {
        en: 'Ciao! Could you teach me the Swahili names for ocean, fish, and boat?',
        sw: 'Ciao! Je unaweza kunifundisha maneno ya Kiswahili kwa ajili ya bahari, samaki, na mashua?',
      },
      {
        en: 'What is the greeting used in coastal Tanzania and Zanzibar?',
        sw: 'Ni salamu gani inatumiwa sana pwani ya Tanzania na Zanzibar?',
      },
    ],
    sampleResponses: [
      {
        trigger: 'bahari',
        reply: {
          en: 'Bahari! What a melodious word. And fish is "samaki", right?',
          sw: 'Bahari! Neno tamu sana. Na samaki huitwa "samaki", sivyo?',
        },
      },
      {
        trigger: 'mashua',
        reply: {
          en: 'Mashua au dau! Coastal Swahili sounds so poetic. Asante sana kwa kunieleza vizuri!',
          sw: 'Mashua au dau! Kiswahili cha pwani kinapendeza sana. Asante sana kwa kunieleza vizuri!',
        },
      },
    ],
  },
  {
    id: 'partner_david_germany',
    name: 'David Weber',
    username: 'david_berlin',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    country: 'Germany',
    countryCode: 'DE',
    countryFlag: '🇩🇪',
    nativeLanguage: 'German',
    kiswahiliLevel: 'beginner',
    bio: {
      en: 'Renewable energy engineer working with solar microgrids in East Africa. Eager to connect with Tanzanians and practice Swahili daily.',
      sw: 'Mhandisi wa nishati ya jua anayefanya kazi na gridi ndogo za sola Afrika Mashariki. Anataka kuongea na Watanzania kila siku.',
    },
    status: 'away',
    interests: ['Solar Energy', 'Technology', 'Kilimanjaro', 'Hiking'],
    learningGoals: {
      en: 'Workplace conversation, polite interactions, and community collaboration vocabulary.',
      sw: 'Maongezi ya kazini, nidhamu na misamiati ya kushirikiana na jamii.',
    },
    promptStarters: [
      {
        en: 'Guten Tag! Can you teach me how to say "Let us work together" in Swahili?',
        sw: 'Guten Tag! Je, unaweza kunifundisha jinsi ya kusema "Tufanye kazi pamoja" kwa Kiswahili?',
      },
    ],
    sampleResponses: [
      {
        trigger: 'pamoja',
        reply: {
          en: '"Harambee" or "Tushirikiane pamoja"? I love the spirit of unity in East Africa!',
          sw: '"Harambee" au "Tushirikiane pamoja"? Ninapenda sana moyo wa mshikamano Afrika Mashariki!',
        },
      },
    ],
  },
  {
    id: 'partner_chloe_france',
    name: 'Chloé Dubois',
    username: 'chloe_paris',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    country: 'France',
    countryCode: 'FR',
    countryFlag: '🇫🇷',
    nativeLanguage: 'French',
    kiswahiliLevel: 'intermediate',
    bio: {
      en: 'Linguistics researcher studying comparative Bantu languages and Swahili literature. Looking for conversational partners.',
      sw: 'Mtafiti wa isimu anayechunguza lugha za Kibantu na fasihi ya Kiswahili. Anatafuta wenzi wa kufanya mazungumzo.',
    },
    status: 'online',
    interests: ['Linguistics', 'Swahili Proverbs', 'Taarab Music', 'History'],
    learningGoals: {
      en: 'Study famous Swahili methali (proverbs) and their contextual meanings.',
      sw: 'Kujifunza methali maarufu za Kiswahili na maana zake katika maisha halisi.',
    },
    promptStarters: [
      {
        en: 'Bonjour! What is your favorite Swahili methali (proverb) and what does it mean?',
        sw: 'Bonjour! Ni methali gani ya Kiswahili unayoipenda zaidi na inamaanisha nini?',
      },
      {
        en: 'Can you explain the meaning of "Pole pole ndio mwendo"?',
        sw: 'Je, unaweza kunieleza maana ya "Pole pole ndio mwendo"?',
      },
    ],
    sampleResponses: [
      {
        trigger: 'methali',
        reply: {
          en: 'C\'est magnifique! Swahili proverbs have such deep wisdom. Please teach me another one!',
          sw: 'Inapendeza mno! Methali za Kiswahili zina hekima kubwa. Naomba unifundishe nyingine!',
        },
      },
      {
        trigger: 'pole',
        reply: {
          en: 'Yes! "Slowly slowly is the way to go" or patience brings success. Merci beaucoup!',
          sw: 'Ndiyo! "Subira huvuta heri" pia inafanana na hilo. Asante sana rafiki yangu!',
        },
      },
    ],
  },
  {
    id: 'partner_kenji_japan',
    name: 'Kenji Sato',
    username: 'kenji_tokyo',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    country: 'Japan',
    countryCode: 'JP',
    countryFlag: '🇯🇵',
    nativeLanguage: 'Japanese',
    kiswahiliLevel: 'advanced',
    bio: {
      en: 'JICA volunteer teacher who lived in Morogoro for 2 years. Want to keep my Kiswahili sharp and assist beginner learners too.',
      sw: 'Mwalimu wa kujitolea wa JICA aliyeishi Morogoro kwa miaka 2. Nataka kuendeleza Kiswahili changu kiwe fasaha zaidi.',
    },
    status: 'online',
    interests: ['Education', 'Morogoro', 'Swahili Grammar', 'Food & Cooking'],
    learningGoals: {
      en: 'Advanced idioms, slang, and cultural nuances across regions.',
      sw: 'Misemo migumu, nahau na lugha za mitaani za sasa.',
    },
    promptStarters: [
      {
        en: 'Konnichiwa! Habari za Morogoro na Dar es Salaam? Tuongee Kiswahili fasaha leo!',
        sw: 'Konnichiwa! Habari za Morogoro na Dar es Salaam? Tuongee Kiswahili fasaha leo!',
      },
    ],
    sampleResponses: [
      {
        trigger: 'mambo',
        reply: {
          en: 'Poa sana ndugu yangu! Nilikumbuka sana ugali na samaki wa kukaanga! Wewe unakula nini leo?',
          sw: 'Poa sana ndugu yangu! Nilikumbuka sana ugali na samaki wa kukaanga! Wewe unakula nini leo?',
        },
      },
    ],
  },
  {
    id: 'partner_clara_canada',
    name: 'Clara Tremblay',
    username: 'clara_montreal',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    country: 'Canada',
    countryCode: 'CA',
    countryFlag: '🇨🇦',
    nativeLanguage: 'French & English',
    kiswahiliLevel: 'beginner',
    bio: {
      en: 'Environmental educator heading to Usambara mountains for eco-tourism research. Keen to learn everyday conversational phrases.',
      sw: 'Mwelimishaji wa mazingira anayeelekea milima ya Usambara kwa utafiti. Ana shauku ya kujifunza maongezi ya kila siku.',
    },
    status: 'away',
    interests: ['Usambara Mountains', 'Hiking', 'Birdwatching', 'Ecology'],
    learningGoals: {
      en: 'Vocabulary for nature, plants, animals, and friendly community exchange.',
      sw: 'Misamiati ya mimea, wanyama, asili na maongezi ya kirafiki na jamii.',
    },
    promptStarters: [
      {
        en: 'Hello! How do you say "The mountains are beautiful" in Kiswahili?',
        sw: 'Habari! Unasemaje "Milima inapendeza sana" kwa Kiswahili?',
      },
    ],
    sampleResponses: [
      {
        trigger: 'milima',
        reply: {
          en: '"Milima inapendeza sana!" Wow, thank you! Swahili has such a warm cadence.',
          sw: '"Milima inapendeza sana!" Wow, asante sana! Kiswahili kina sauti ya joto na amani.',
        },
      },
    ],
  },
];
