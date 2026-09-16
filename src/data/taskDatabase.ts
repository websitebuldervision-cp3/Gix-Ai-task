import { TaskItem } from '../types';
import { TASK_CATEGORIES } from './taskCategories';

export const TASK_DATABASE: TaskItem[] = [
  // 1. Image Comparison (Explicitly highlighted in user prompt)
  {
    id: 'task_img_comp_01',
    categoryId: 'image_comparison',
    categoryName: { en: 'Image Comparison', sw: 'Ulinganishaji wa Picha' },
    title: { en: 'Which image is clearer and has higher visual fidelity?', sw: 'Ni picha ipi inaonekana wazi zaidi na yenye ubora wa juu?' },
    description: { en: 'Evaluate both camera captures of a mountain landscape at dawn. Inspect edge sharpness, shadow contrast, and texture detail.', sw: 'Tathmini picha mbili za mandhari ya mlima wakati wa mawio. Kagua makali ya vitu, kivuli na uwazi wa mandhari.' },
    instructions: [
      { en: 'Zoom in or inspect the foliage and ridgeline in both frames.', sw: 'Kagua majani na safu ya milima kwenye picha zote mbili.' },
      { en: 'Look for compression artifacts, digital noise, or edge halos.', sw: 'Angalia kama kuna ukungu, kelele za kamera au mipasuko ya picha.' },
      { en: 'Select the image with superior clarity and natural colors.', sw: 'Chagua picha yenye uwazi na rangi halisi zaidi.' },
    ],
    media: {
      type: 'image_duo',
      itemA: {
        label: { en: 'Image A (High Dynamic Range)', sw: 'Picha A (Uwazi wa Juu)' },
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        meta: 'Resolution: 3840x2160 • ISO 100 • 1/500s',
      },
      itemB: {
        label: { en: 'Image B (Standard Compression)', sw: 'Picha B (Ubora wa Kawaida)' },
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        meta: 'Resolution: 1920x1080 • ISO 800 • 1/60s',
      },
      promptOrContext: {
        en: 'Comparative Evaluation: Landscape Fine-Detail Camera Benchmarking',
        sw: 'Tathmini ya Kulinganisha: Jaribio la Uwazi wa Kamera ya Mandhari',
      },
    },
    options: [
      { id: 'opt_a', label: { en: 'Image A', sw: 'Picha A' }, subLabel: { en: 'Crisper mountain ridges and richer dynamic shadow depth', sw: 'Mandhari ya milima ina uwazi na kivuli kizuri zaidi' } },
      { id: 'opt_b', label: { en: 'Image B', sw: 'Picha B' }, subLabel: { en: 'Softer highlights with smoother atmospheric blending', sw: 'Mwangaza mpole wenye mchanganyiko mzuri wa hewa' } },
      { id: 'opt_both', label: { en: 'Both are equally clear', sw: 'Zote zinaonekana sawa' }, subLabel: { en: 'No noticeable divergence in rendering fidelity', sw: 'Hakuna tofauti kubwa ya ubora' } },
    ],
    rewardUSD: 6.0,
    difficulty: 'easy',
    estimatedSeconds: 45,
  },

  // 2. AI Response Comparison (LLM Eval)
  {
    id: 'task_ai_comp_01',
    categoryId: 'ai_response_comparison',
    categoryName: { en: 'AI Response Comparison', sw: 'Ulinganishaji wa Majibu ya AI' },
    title: { en: 'Which AI response provides a safer and more helpful explanation?', sw: 'Ni jibu lipi la AI lililo salama na lenye msaada zaidi?' },
    description: { en: 'A user asked: "How does solar energy storage work in off-grid rural farming communities?" Rate the two AI answers.', sw: 'Mtumiaji aliuliza: "Mifumo ya kuhifadhi umeme wa jua inavyofanya kazi vijijini?" Pima majibu mawili ya AI.' },
    instructions: [
      { en: 'Read the user prompt carefully.', sw: 'Soma swali la mtumiaji kwa makini.' },
      { en: 'Verify if the response is factual, structured with clear steps, and easy to understand.', sw: 'Hakiki kama jibu lina ukweli, limepangwa kwa hatua zilizo wazi na linaeleweka.' },
      { en: 'Identify if one response contains vague generalities or hallucinations.', sw: 'Baini kama jibu mojawapo lina maelezo ya juujuu au taarifa za kubuni.' },
    ],
    media: {
      type: 'ai_chat_duo',
      promptOrContext: {
        en: 'User Query: "Explain solar battery storage for rural farmers with step-by-step components and maintenance tips."',
        sw: 'Swali la Mtumiaji: "Eleza jinsi betri za umeme wa jua zinavyofanya kazi kwa wakulima vijijini pamoja na matunzo yake."',
      },
      itemA: {
        label: { en: 'AI Response A', sw: 'Jibu la AI A' },
        text: 'Solar storage for rural farms relies on three core components: 1) Deep-cycle Lithium-Iron-Phosphate (LiFePO4) or Gel batteries to store DC electricity; 2) MPPT Charge Controllers preventing overcharging during peak solar hours; 3) Pure sine wave inverters powering irrigation pumps. For maintenance: check terminal corrosion monthly, maintain 20°C–30°C shaded ventilation, and avoid discharging below 20% capacity.',
      },
      itemB: {
        label: { en: 'AI Response B', sw: 'Jibu la AI B' },
        text: 'Solar batteries store electricity when the sun shines. You plug solar panels into batteries and then connect lights and motors. To maintain it, make sure the panels are clean and the battery does not get wet. It provides clean energy for farming tasks whenever power is needed.',
      },
    },
    options: [
      { id: 'opt_a', label: { en: 'Response A is better', sw: 'Jibu A ni bora zaidi' }, subLabel: { en: 'Highly specific, technical accuracy, actionable steps', sw: 'Lina maelezo kamili ya kitaalamu na hatua zilizo wazi' } },
      { id: 'opt_b', label: { en: 'Response B is better', sw: 'Jibu B ni bora zaidi' }, subLabel: { en: 'Simpler language, easier for beginners', sw: 'Lugha rahisi kwa wanaoanza' } },
      { id: 'opt_equal', label: { en: 'Both responses are equally good', sw: 'Majibu yote mawili ni mazuri sawa' } },
    ],
    rewardUSD: 5.0,
    difficulty: 'medium',
    estimatedSeconds: 50,
  },

  // 3. Audio Comparison & Speech Quality
  {
    id: 'task_audio_comp_01',
    categoryId: 'audio_comparison',
    categoryName: { en: 'Audio Comparison', sw: 'Ulinganishaji wa Sauti' },
    title: { en: 'Which synthetic speech sample sounds more natural with human-like prosody?', sw: 'Ni sampuli ipi ya sauti inayosikika kiasili zaidi kama ya binadamu?' },
    description: { en: 'Listen to two AI neural voice synthesis clips reading a public health notification in Kiswahili / English.', sw: 'Sikiliza sampuli mbili za sauti ya AI zikisoma tangazo la afya ya jamii kwa Kiswahili au Kiingereza.' },
    instructions: [
      { en: 'Click the Play button on both audio tracks to listen to the real voice.', sw: 'Bonyeza kitufe cha Play kwenye sauti zote mbili kusikiliza sauti halisi.' },
      { en: 'Listen for natural cadence, breathing pace, and clarity of pronunciation.', sw: 'Sikiliza mshiko wa sauti, utulivu wa pumzi na usafi wa matamshi.' },
      { en: 'Identify if one voice has robotic artifacts, metallic echo, or monotone pacing.', sw: 'Gundua kama sauti mojawapo inasikika kama ya roboti au haina msisimko wa kiasili.' },
    ],
    media: {
      type: 'audio_duo',
      promptOrContext: {
        en: 'Script: "Karibu kwenye huduma ya afya ya kidijitali. Tafadhali kunywa maji safi na nawa mikono yako kila siku."',
        sw: 'Maneno: "Karibu kwenye huduma ya afya ya kidijitali. Tafadhali kunywa maji safi na nawa mikono yako kila siku."',
      },
      itemA: {
        label: { en: 'Neural AI Voice Model A (Natural Swahili/English)', sw: 'Mfumo wa AI Model A (Kiswahili/English Kiasili)' },
        text: 'Karibu kwenye huduma ya afya ya kidijitali. Tafadhali kunywa maji safi na nawa mikono yako kila siku.',
        speechText: {
          en: 'Welcome to the digital health platform. Please drink clean water and wash your hands regularly for good health.',
          sw: 'Karibu kwenye huduma ya afya ya kidijitali. Tafadhali kunywa maji safi na nawa mikono yako kila siku kwa afya bora.',
        },
        voiceStyle: 'natural',
        meta: 'Duration: ~6s • 48kHz Neural Prosody • Studio Master',
      },
      itemB: {
        label: { en: 'Standard Model B (Robotic Synthesizer)', sw: 'Mfumo wa AI Model B (Kipaza Sauti cha Roboti)' },
        text: 'Karibu kwenye huduma ya afya ya kidijitali. Tafadhali kunywa maji safi na nawa mikono yako kila siku.',
        speechText: {
          en: 'Welcome to the digital health platform. Please drink clean water and wash your hands regularly.',
          sw: 'Karibu kwenye huduma ya afya ya kidijitali. Tafadhali kunywa maji safi na nawa mikono yako kila siku.',
        },
        voiceStyle: 'robotic',
        meta: 'Duration: ~6s • 22kHz WaveNet • Monotone Pitch',
      },
    },
    options: [
      { id: 'opt_a', label: { en: 'Audio Track A (Natural & Clear)', sw: 'Sauti Sampuli A (Kiasili na Safi Zaidi)' }, subLabel: { en: 'Smooth pronunciation, natural pause intervals', sw: 'Matamshi fasaha na mtiririko mzuri usio wa roboti' } },
      { id: 'opt_b', label: { en: 'Audio Track B (More Robotic)', sw: 'Sauti Sampuli B (Ya Kiroboti Zaidi)' }, subLabel: { en: 'Mechanical rhythm and flat intonation', sw: 'Mlio wa kimitambo usio na mwinuko wa kawaida' } },
      { id: 'opt_equal', label: { en: 'Both sound equally natural', sw: 'Zote zinasikika sawa kiasili' } },
    ],
    rewardUSD: 4.5,
    difficulty: 'easy',
    estimatedSeconds: 40,
  },

  // Audio Task 2: Swahili Customer Care AI Voice Bot
  {
    id: 'task_audio_customercare_02',
    categoryId: 'speech_synthesis',
    categoryName: { en: 'Speech Synthesis Evaluation', sw: 'Tathmini ya Sauti za AI' },
    title: { en: 'Evaluate Customer Service AI Voice Bot for Mobile Money Support', sw: 'Tathmini Sauti ya Roboti wa Huduma kwa Wateja wa M-Pesa / Tigo Pesa' },
    description: { en: 'Listen to two Swahili automated IVR voice samples assisting a customer with a PIN reset.', sw: 'Sikiliza sampuli mbili za sauti ya Kiswahili ya roboti akimsaidia mteja kurejesha namba ya siri ya miamala.' },
    instructions: [
      { en: 'Press Play on each voice sample to hear real speech audio.', sw: 'Bonyeza Play kwenye kila sauti usikie sauti halisi ikisoma maelekezo.' },
      { en: 'Check if the voice sounds polite, friendly, and easily understandable for Tanzanian users.', sw: 'Kagua kama sauti inasikika kwa upole, urafiki na kueleweka vizuri kwa wateja wa Tanzania.' },
      { en: 'Determine which voice gives the most comforting and professional customer care experience.', sw: 'Chagua sauti inayotoa huduma bora zaidi ya kistaarabu na ya kitaalamu.' },
    ],
    media: {
      type: 'audio_duo',
      promptOrContext: {
        en: 'IVR Prompt: "Habari ndugu mteja, ili kubadilisha namba yako ya siri, tafadhali bonyeza moja."',
        sw: 'Maelekezo: "Habari ndugu mteja, ili kubadilisha namba yako ya siri, tafadhali bonyeza moja."',
      },
      itemA: {
        label: { en: 'Voice Sample A (Empathetic Female Assistant)', sw: 'Sauti A (Sauti ya Kike ya Ukarimu)' },
        text: 'Habari ndugu mteja, karibu huduma kwa wateja. Ili kubadilisha namba yako ya siri, tafadhali bonyeza moja.',
        speechText: {
          en: 'Hello valued customer, welcome to mobile support. To reset your PIN code, please press one.',
          sw: 'Habari ndugu mteja, karibu huduma kwa wateja. Ili kubadilisha namba yako ya siri, tafadhali bonyeza moja.',
        },
        voiceStyle: 'female',
        meta: 'Pacing: 0.98x • Warm Tone • High Acoustic Resonance',
      },
      itemB: {
        label: { en: 'Voice Sample B (Speed Synthesizer)', sw: 'Sauti B (Sauti ya Kasi Zaidi)' },
        text: 'Habari ndugu mteja, karibu huduma kwa wateja. Ili kubadilisha namba yako ya siri, tafadhali bonyeza moja.',
        speechText: {
          en: 'Hello valued customer, welcome to mobile support. To reset your PIN code, please press one.',
          sw: 'Habari ndugu mteja, karibu huduma kwa wateja. Ili kubadilisha namba yako ya siri, tafadhali bonyeza moja.',
        },
        voiceStyle: 'fast',
        meta: 'Pacing: 1.2x • Rapid Fast • Short Pauses',
      },
    },
    options: [
      { id: 'opt_sample_a', label: { en: 'Voice A is much better for customers', sw: 'Sauti A ni bora zaidi kwa wateja' }, subLabel: { en: 'Calm, respectful, crystal clear articulation', sw: 'Mpole, ya heshima na inaeleweka kwa urahisi' } },
      { id: 'opt_sample_b', label: { en: 'Voice B is better for quick transactions', sw: 'Sauti B inafaa kwa haraka' }, subLabel: { en: 'Fast paced without waiting', sw: 'Mwendo wa haraka' } },
      { id: 'opt_both_good', label: { en: 'Both are acceptable', sw: 'Zote mbili zinafaa' } },
    ],
    rewardUSD: 5.0,
    difficulty: 'easy',
    estimatedSeconds: 35,
  },

  // 4. Product Matching & E-Commerce Duplicate Detection
  {
    id: 'task_prod_match_01',
    categoryId: 'product_matching',
    categoryName: { en: 'Product Matching', sw: 'Kulinganisha Bidhaa' },
    title: { en: 'Do these two e-commerce listings refer to the exact same physical product SKU?', sw: 'Je, matangazo haya mawili yanahusu bidhaa moja halisi ya kiwandani?' },
    description: { en: 'Compare technical attributes, model numbers, storage capacities, and packaging pictures.', sw: 'Linganisha namba ya modeli, ukubwa wa uhifadhi, picha na maelezo ya kiufundi.' },
    instructions: [
      { en: 'Check the brand, exact model code, and hardware configuration.', sw: 'Kagua jina la chapa, kodi ya modeli na uwezo wa kifaa.' },
      { en: 'Notice differences in storage (128GB vs 256GB) or accessories.', sw: 'Angalia tofauti katika ukubwa wa kumbukumbu au vifaa vilivyomo ndani ya boksi.' },
    ],
    media: {
      type: 'product_duo',
      itemA: {
        label: { en: 'Merchant Store 1: AlphaTech', sw: 'Duka 1: AlphaTech' },
        url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=500&q=80',
        text: 'UltraPro Smart Watch Series 7 (45mm GPS, Titanium Grey, Silicon Sports Band, Waterproof 50M)',
        meta: 'Model: UP-SW7-45T • Price: $189.00',
      },
      itemB: {
        label: { en: 'Merchant Store 2: GlobalGadgets', sw: 'Duka 2: GlobalGadgets' },
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
        text: 'UltraPro Watch Series 7 (41mm GPS + Cellular, Silver Aluminum, Leather Loop)',
        meta: 'Model: UP-SW7-41A • Price: $229.00',
      },
      promptOrContext: {
        en: 'Product SKU Verification & Catalog Deduplication',
        sw: 'Ukaguzi wa Namba za Bidhaa na Kuzuia Urudiaji kwenye Tovuti ya Mauzo',
      },
    },
    options: [
      { id: 'opt_diff', label: { en: 'Different Products (Different Case Size / Connectivity)', sw: 'Ni Bidhaa Tofauti (Ukubwa na Muundo Tofauti)' }, subLabel: { en: '45mm Titanium GPS vs 41mm Aluminum Cellular', sw: 'Moja ni 45mm Titanium na nyingine ni 41mm Aluminum' } },
      { id: 'opt_same', label: { en: 'Exact Same Product (Identical SKU)', sw: 'Ni Bidhaa Moja Halisi (SKU Inayofanana)' } },
      { id: 'opt_cannot_tell', label: { en: 'Insufficient Information to Determine', sw: 'Taarifa Hazitoshi Kubaini' } },
    ],
    rewardUSD: 4.0,
    difficulty: 'medium',
    estimatedSeconds: 45,
  },

  // 5. Text & Translation Evaluation (Bilingual Swahili - English)
  {
    id: 'task_trans_eval_01',
    categoryId: 'translation_evaluation',
    categoryName: { en: 'Translation Evaluation', sw: 'Tathmini ya Tafsiri' },
    title: { en: 'Rate the translation quality and idiomatic accuracy between English and Kiswahili.', sw: 'Pima ubora wa tafsiri na usahihi wa maana kati ya Kiingereza na Kiswahili.' },
    description: { en: 'Evaluate the machine translation of a modern tech training announcement.', sw: 'Tathmini tafsiri ya mashine ya tangazo la mafunzo ya teknolojia ya kisasa.' },
    instructions: [
      { en: 'Original English: "Empower your community with decentralized digital skills and open-access intelligence tools."', sw: 'Kiingereza Asilia: "Empower your community with decentralized digital skills and open-access intelligence tools."' },
      { en: 'Swahili Translation: "Wezesha jamii yako kwa ujuzi wa kidijitali usiofungamana na kituo kimoja na zana za akili bandia zilizo wazi kwa wote."', sw: 'Tafsiri ya Kiswahili: "Wezesha jamii yako kwa ujuzi wa kidijitali usiofungamana na kituo kimoja na zana za akili bandia zilizo wazi kwa wote."' },
      { en: 'Judge if the tone, grammar, and technical terms are accurately rendered.', sw: 'Pima kama toni, sarufi na istilahi za kiteknolojia zimetafsiriwa kwa usahihi.' },
    ],
    media: {
      type: 'text_duo',
      itemA: {
        label: { en: 'Source Text (English)', sw: 'Maandishi Asilia (Kiingereza)' },
        text: 'Empower your community with decentralized digital skills and open-access intelligence tools.',
      },
      itemB: {
        label: { en: 'AI Translation (Kiswahili)', sw: 'Tafsiri ya AI (Kiswahili)' },
        text: 'Wezesha jamii yako kwa ujuzi wa kidijitali usiofungamana na kituo kimoja na zana za akili bandia zilizo wazi kwa wote.',
      },
    },
    options: [
      { id: 'opt_excellent', label: { en: 'Excellent & Natural Translation', sw: 'Tafsiri Bora na ya Kiasili' }, subLabel: { en: 'Accurate vocabulary, flawless grammar, natural flow', sw: 'Msamiati sahihi, sarufi safi na mtiririko mzuri' } },
      { id: 'opt_minor_errors', label: { en: 'Acceptable with Minor Phrasing Issues', sw: 'Inakubalika ikiwa na kasoro ndogo za uundaji sentensi' } },
      { id: 'opt_incorrect', label: { en: 'Inaccurate or Misleading Meaning', sw: 'Si Sahihi au Ina Maana Potofu' } },
    ],
    rewardUSD: 3.5,
    difficulty: 'easy',
    estimatedSeconds: 35,
  },

  // 6. Object Detection & Bounding Box Check
  {
    id: 'task_obj_det_01',
    categoryId: 'object_detection',
    categoryName: { en: 'Object Detection', sw: 'Utambuzi wa Vitu kwenye Picha' },
    title: { en: 'Are all pedestrians and vehicles correctly framed in this traffic scene?', sw: 'Je, watembea kwa miguu na magari yote yamewekewa mistari ya mipaka kwa usahihi?' },
    description: { en: 'Autonomous vehicle model training requires precise bounding boxes around road participants.', sw: 'Mafunzo ya magari yanayojiendesha yanahitaji mistari sahihi inayozunguka watembea kwa miguu na vyombo vya moto.' },
    instructions: [
      { en: 'Examine green boxes (Pedestrians) and blue boxes (Vehicles).', sw: 'Kagua mistari ya kijani (Watu) na bluu (Magari).' },
      { en: 'Identify if any moving subject is missing a boundary or if boxes overlap background unnecessarily.', sw: 'Angalia kama kuna mtu au gari ambalo halijawekewa alama au kama mstari umezidi ukubwa.' },
    ],
    media: {
      type: 'image_single',
      itemA: {
        label: { en: 'Traffic Annotation Verification Layer', sw: 'Tabaka la Ukaguzi wa Alama za Barabarani' },
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
        meta: 'Annotated Objects: 8 Vehicles, 4 Pedestrians • IoU Threshold: 0.85',
      },
      promptOrContext: {
        en: 'Perception Model Validation: Urban Street Crosswalk Intersection',
        sw: 'Uhakiki wa Mfumo wa Utambuzi: Makutano ya Barabara za Mjini',
      },
    },
    options: [
      { id: 'opt_all_correct', label: { en: 'All bounding boxes are tight and accurate', sw: 'Mistari yote imekaa vizuri na kwa usahihi' } },
      { id: 'opt_missed_pedestrian', label: { en: 'One or more pedestrians missed near the sidewalk edge', sw: 'Mtembea kwa miguu mmoja au zaidi hajawekewa alama pembezoni mwa barabara' } },
      { id: 'opt_false_positives', label: { en: 'Inaccurate boxes covering static street furniture (light poles)', sw: 'Mistari isiyo sahihi inayofunika nguzo za taa badala ya magari' } },
    ],
    rewardUSD: 5.5,
    difficulty: 'medium',
    estimatedSeconds: 50,
  },

  // 7. Website UI & Mobile Usability Evaluation
  {
    id: 'task_ui_comp_01',
    categoryId: 'website_ui_comparison',
    categoryName: { en: 'Website UI Comparison', sw: 'Ulinganishaji wa UI ya Tovuti' },
    title: { en: 'Which mobile navigation interface offers better one-handed reachability?', sw: 'Ni muundo upi wa menyu ya simu unaomrahisishia mtumiaji kubonyeza kwa mkono mmoja?' },
    description: { en: 'Compare two mobile checkout interface designs designed for sub-6-inch mobile screens.', sw: 'Linganisha miundo miwili ya malipo ya simu iliyotengenezwa kwa skrini ndogo za simu.' },
    instructions: [
      { en: 'Analyze thumb-zone accessibility for primary CTA buttons.', sw: 'Angalia urahisi wa kidole gumba kufikia vitufe vikuu vya malipo.' },
      { en: 'Check visual hierarchy, font contrast, and spacing balance.', sw: 'Kagua mpangilio wa maandishi, utofauti wa rangi na nafasi kati ya vitu.' },
    ],
    media: {
      type: 'image_duo',
      itemA: {
        label: { en: 'Design A: Bottom Fixed Floating Action Bar', sw: 'Muundo A: Upau wa Vitufe Chini ya Skrini' },
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
        meta: 'Thumb Reach Score: 94/100 • WCAG AA Compliant',
      },
      itemB: {
        label: { en: 'Design B: Top Hamburger Dropdown Only', sw: 'Muundo B: Menyu ya Juu Pekee' },
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80',
        meta: 'Thumb Reach Score: 48/100 • Requires Two Hands on Phablets',
      },
    },
    options: [
      { id: 'opt_design_a', label: { en: 'Design A (Bottom Bar)', sw: 'Muundo A (Upau wa Chini)' }, subLabel: { en: 'Ergonomic, instant touch access without stretching', sw: 'Rahisi kubonyeza bila kulazimika kurefusha kidole' } },
      { id: 'opt_design_b', label: { en: 'Design B (Top Dropdown)', sw: 'Muundo B (Menyu ya Juu)' } },
      { id: 'opt_equal', label: { en: 'Both are equally usable', sw: 'Miundo yote miwili inafaa sawa' } },
    ],
    rewardUSD: 4.5,
    difficulty: 'easy',
    estimatedSeconds: 40,
  },

  // 8. AI Hallucination & Fact Checking
  {
    id: 'task_hallucination_01',
    categoryId: 'ai_hallucination_detection',
    categoryName: { en: 'AI Hallucination Detection', sw: 'Utambuzi wa Majibu ya Kubuni (Hallucination)' },
    title: { en: 'Did the AI fabricate any scientific facts in this response about photosynthesis?', sw: 'Je, AI imebuni taarifa zozote zisizo za kweli kuhusu mfumo wa usanisinuru (photosynthesis)?' },
    description: { en: 'Review the botanical claims generated by an experimental generative model.', sw: 'Kagua taarifa za kibiolojia zilizotolewa na mfumo wa AI unaofanyiwa majaribio.' },
    instructions: [
      { en: 'Fact statement: "Chlorophyll absorbs mainly blue and red wavelengths of light while reflecting green light."', sw: 'Kauli: "Klorofili hufyonza miale ya rangi ya samawati na nyekundu na kuakisi rangi ya kijani."' },
      { en: 'Check for false chemical formulas or fictitious plant species names.', sw: 'Kagua kama kuna fomula za uongo za kikemia au majina ya kubuni ya mimea.' },
    ],
    media: {
      type: 'ai_chat_duo',
      itemA: {
        label: { en: 'AI Generated Scientific Excerpt', sw: 'Maelezo ya Kisayansi ya AI' },
        text: 'During the light-dependent reactions of photosynthesis in chloroplast thylakoid membranes, photons excite electrons in chlorophyll a and b pigments, splitting water molecules into oxygen, protons, and electrons (photolysis). The energy is stored in ATP and NADPH.',
      },
      promptOrContext: {
        en: 'Prompt: "Summarize the primary biochemical action in chloroplast thylakoids."',
        sw: 'Swali: "Eleza kwa ufupi hatua za kibaolojia zinazotokea kwenye mimea wakati wa kupokea mwanga wa jua."',
      },
    },
    options: [
      { id: 'opt_accurate', label: { en: '100% Factually Accurate (No Hallucinations)', sw: '100% Ni Kweli Kisayansi (Hakuna Uongo)' }, subLabel: { en: 'Correct biochemical terms and accurate energy carriers', sw: 'Istilahi sahihi za kikemia na kibaolojia' } },
      { id: 'opt_hallucinated', label: { en: 'Contains Fabricated / Incorrect Claims', sw: 'Ina Taarifa za Kubuni au Zisizo za Kweli' } },
      { id: 'opt_unclear', label: { en: 'Unverifiable / Ambiguous phrasing', sw: 'Maelezo hayako wazi kuthibitika' } },
    ],
    rewardUSD: 6.0,
    difficulty: 'hard',
    estimatedSeconds: 60,
  },

  // 9. Location Matching & Map Accuracy
  {
    id: 'task_map_match_01',
    categoryId: 'location_matching',
    categoryName: { en: 'Location Matching', sw: 'Kulinganisha Maeneo' },
    title: { en: 'Does the business name match the exact storefront address and building footprint?', sw: 'Je, jina la biashara linalingana na eneo halisi la duka na anwani kwenye ramani?' },
    description: { en: 'Verify merchant geocode positioning in Dar es Salaam commercial center.', sw: 'Hakiki eneo halisi la duka kwenye kituo cha kibiashara cha Dar es Salaam.' },
    instructions: [
      { en: 'Business name: "Kilimanjaro Fresh Coffee Roasters & Bakery".', sw: 'Jina la Biashara: "Kilimanjaro Fresh Coffee Roasters & Bakery".' },
      { en: 'Target address: "Samora Avenue, CBD, Dar es Salaam, Tanzania".', sw: 'Anwani: "Samora Avenue, Posta Mpya, Dar es Salaam, Tanzania".' },
      { en: 'Verify if the map pinpoint is located directly over the entrance.', sw: 'Thibitisha kama alama ya ramani iko moja kwa moja juu ya mlango wa kuingilia.' },
    ],
    media: {
      type: 'map_duo',
      itemA: {
        label: { en: 'Storefront Photography & Verified Signage', sw: 'Picha ya Mbele ya Duka na Bango' },
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80',
        meta: 'Geo Coordinates: -6.8163° S, 39.2894° E',
      },
      itemB: {
        label: { en: 'Satellite Map Overlay Pin', sw: 'Alama ya Ramani ya Satelaiti' },
        url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=700&q=80',
        meta: 'Address Record: Plot 44, Samora Ave, Posta',
      },
    },
    options: [
      { id: 'opt_correct_pin', label: { en: 'Confirmed: Pinpoint matches physical storefront perfectly', sw: 'Imethibitishwa: Alama inalingana kabisa na duka halisi' } },
      { id: 'opt_off_by_block', label: { en: 'Incorrect: Pin is placed on an adjacent city block', sw: 'Si Sahihi: Alama imewekwa kwenye mtaa wa jirani kimakosa' } },
      { id: 'opt_closed', label: { en: 'Business appears relocated or permanently closed', sw: 'Biashara inaonekana imehama au kufungwa' } },
    ],
    rewardUSD: 4.5,
    difficulty: 'easy',
    estimatedSeconds: 40,
  },

  // 10. Sentiment Analysis
  {
    id: 'task_sentiment_01',
    categoryId: 'sentiment_analysis',
    categoryName: { en: 'Sentiment Analysis', sw: 'Uchambuzi wa Mtazamo na Hisia' },
    title: { en: 'Classify the customer sentiment in this digital banking mobile app review.', sw: 'Ainisha hisia za mteja katika maoni haya kuhusu app ya huduma za kibenki.' },
    description: { en: 'Customer wrote: "The new instant transfer feature works flawlessly and saved me hours today, though I wish biometric login was slightly faster."', sw: 'Mteja aliandika: "Huduma mpya ya kutuma pesa papo hapo inafanya kazi vizuri sana na imeniokoa muda mwingi leo, ingawa ningependa kuweka alama ya kidole iwe ya haraka zaidi."' },
    instructions: [
      { en: 'Identify overall polarity: Positive, Mixed, or Negative.', sw: 'Tambua mwelekeo wa jumla: Chanya, Mchanganyiko, au Hasi.' },
      { en: 'Weigh the primary value delivery versus the secondary minor feedback.', sw: 'Pima faida kuu iliyosifiwa dhidi ya pendekezo dogo la uboreshaji.' },
    ],
    media: {
      type: 'text_duo',
      itemA: {
        label: { en: 'Customer Review Snippet', sw: 'Maoni ya Mteja' },
        text: '"The new instant transfer feature works flawlessly and saved me hours today, though I wish biometric login was slightly faster."',
        meta: 'Status: Verified Customer Review • Category: Fintech App',
      },
    },
    options: [
      { id: 'opt_pos_mixed', label: { en: 'Predominantly Positive (with constructive minor feedback)', sw: 'Chanya Zaidi (ikiwa na pendekezo dogo la uboreshaji)' } },
      { id: 'opt_negative', label: { en: 'Negative / Dissatisfied', sw: 'Hasi / Mteja hajaridhika' } },
      { id: 'opt_neutral', label: { en: 'Completely Neutral / Informational', sw: 'Ya Kawaida / Isiyo na Hisia' } },
    ],
    rewardUSD: 3.0,
    difficulty: 'easy',
    estimatedSeconds: 30,
  },

  // 11. Data Verification & OCR Extraction
  {
    id: 'task_ocr_verify_01',
    categoryId: 'data_verification',
    categoryName: { en: 'Data Verification', sw: 'Uthibitishaji wa Data' },
    title: { en: 'Does the extracted invoice total and VAT match the original receipt image?', sw: 'Je, jumla ya ankara na kodi ya ongezeko la thamani (VAT) vinalingana na picha ya risiti?' },
    description: { en: 'Cross-check automated document parsing against high-resolution receipt scan.', sw: 'Hakiki taarifa zilizosomwa na AI dhidi ya picha halisi ya risiti ya manunuzi.' },
    instructions: [
      { en: 'Inspect Subtotal, Tax Rate (18% VAT), and Grand Total.', sw: 'Kagua Jumla Ndogo, Kiwango cha Kodi (18% VAT) na Jumla Kuu.' },
      { en: 'Verify decimal precision and supplier tax ID registration.', sw: 'Thibitisha namba za desimali na namba ya usajili wa kodi ya muuzaji.' },
    ],
    media: {
      type: 'data_table',
      itemA: {
        label: { en: 'OCR Extracted Form Fields', sw: 'Data Zilizochakatwa na AI' },
        details: {
          'Merchant': 'Kilima Hardware & Supplies Ltd',
          'TIN / Tax ID': '104-892-331',
          'Subtotal': '$450.00',
          'VAT (18%)': '$81.00',
          'Grand Total': '$531.00',
          'Date': '2026-08-28 14:32:10',
        },
      },
      promptOrContext: {
        en: 'Financial Document Reconciliation Pipeline',
        sw: 'Mfumo wa Uhakiki wa Nyaraka za Kifedha na Risiti',
      },
    },
    options: [
      { id: 'opt_ocr_match', label: { en: 'All figures match with 100% precision', sw: 'Namba zote zinalingana kwa 100% bila makosa' } },
      { id: 'opt_ocr_vat_error', label: { en: 'VAT calculation or Subtotal is mismatched', sw: 'Kuna kosa kwenye hesabu ya VAT au Jumla Ndogo' } },
      { id: 'opt_ocr_tin_error', label: { en: 'Tax ID or Merchant name truncated', sw: 'Namba ya kodi au jina la muuzaji limekatika' } },
    ],
    rewardUSD: 5.0,
    difficulty: 'medium',
    estimatedSeconds: 45,
  },

  // 12. Video Quality & Motion Consistency
  {
    id: 'task_video_comp_01',
    categoryId: 'video_comparison',
    categoryName: { en: 'Video Comparison', sw: 'Ulinganishaji wa Video' },
    title: { en: 'Which video render exhibits smoother camera panning without stutter or warping?', sw: 'Ni video ipi inayosonga vizuri bila kukwama au maumbo kupinda?' },
    description: { en: 'Evaluate AI video interpolation algorithms running at 60 frames per second.', sw: 'Tathmini ubora wa video za AI zinazocheza kwa fremu 60 kwa sekunde.' },
    instructions: [
      { en: 'Observe horizontal camera sweep over the architectural courtyard.', sw: 'Tazama mwendo wa kamera inapozunguka uwanja wa jengo.' },
      { en: 'Look for edge jitter around columns, shadow flickering, and frame drops.', sw: 'Angalia kama kuna mtetemeko kwenye nguzo au kivuli kinachomulika vibaya.' },
    ],
    media: {
      type: 'video_duo',
      itemA: {
        label: { en: 'Video Stream A (Temporal Stable Diffusion)', sw: 'Video A (Mtiririko Tulivu wa AI)' },
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=700&q=80',
        meta: 'FPS: 60 • Bitrate: 18 Mbps • Codec: AV1 High Profile',
      },
      itemB: {
        label: { en: 'Video Stream B (Standard Interpolation)', sw: 'Video B (Ubora wa Kawaida)' },
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
        meta: 'FPS: 30 • Bitrate: 6 Mbps • Codec: H.264 Baseline',
      },
    },
    options: [
      { id: 'opt_stream_a', label: { en: 'Video Stream A (Noticeably smoother and artifact-free)', sw: 'Video A (Inatembea vizuri bila kukwama)' } },
      { id: 'opt_stream_b', label: { en: 'Video Stream B', sw: 'Video B' } },
      { id: 'opt_equal', label: { en: 'Both streams have similar visual fluidity', sw: 'Video zote mbili ziko sawa katika mtiririko' } },
    ],
    rewardUSD: 5.5,
    difficulty: 'hard',
    estimatedSeconds: 55,
  },
];

/**
 * Task generator & rotation engine to supply rotating tasks across all 55+ categories dynamically
 */
export function getRotatingTask(
  categoryId?: string,
  completedTaskIds: string[] = []
): TaskItem {
  // Filter by category if requested
  let candidates = TASK_DATABASE;
  if (categoryId) {
    const matching = candidates.filter((t) => t.categoryId === categoryId);
    if (matching.length > 0) {
      candidates = matching;
    }
  }

  // Filter out already completed tasks if possible
  const uncompleted = candidates.filter((t) => !completedTaskIds.includes(t.id));
  const pool = uncompleted.length > 0 ? uncompleted : candidates;

  if (pool.length > 0) {
    const selected = pool[Math.floor(Math.random() * pool.length)];
    return selected;
  }

  // Fallback: Dynamically construct a fresh task for any of the 55+ categories
  const targetCategory =
    TASK_CATEGORIES.find((c) => c.id === categoryId) ||
    TASK_CATEGORIES[Math.floor(Math.random() * TASK_CATEGORIES.length)];

  const randomReward = Number((Math.random() * (targetCategory.rewardMax - targetCategory.rewardMin) + targetCategory.rewardMin).toFixed(2));
  const dynamicId = `dyn_${targetCategory.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const isAudioGroup = targetCategory.group === 'audio';

  const defaultMedia = isAudioGroup
    ? {
        type: 'audio_duo' as const,
        promptOrContext: {
          en: `Voice Benchmark: "Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa."`,
          sw: `Jaribio la Sauti: "Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa."`,
        },
        itemA: {
          label: { en: 'Neural Model A (High Clarity)', sw: 'Mfumo wa AI Model A (Uwazi wa Juu)' },
          text: 'Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa nchini.',
          speechText: {
            en: 'Good morning, artificial intelligence systems bring tremendous progress to community development.',
            sw: 'Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa nchini.',
          },
          voiceStyle: 'natural' as const,
          meta: 'Duration: ~5s • 48kHz Lossless • Natural Prosody',
        },
        itemB: {
          label: { en: 'Baseline Model B (Robotic Synthesizer)', sw: 'Mfumo wa AI Model B (Kipaza Sauti)' },
          text: 'Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa nchini.',
          speechText: {
            en: 'Good morning, artificial intelligence systems bring tremendous progress to community development.',
            sw: 'Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa nchini.',
          },
          voiceStyle: 'robotic' as const,
          meta: 'Duration: ~5s • 24kHz • Monotone Synthesis',
        },
      }
    : {
        type: 'image_duo' as const,
        itemA: {
          label: { en: 'AI Sample A', sw: 'Sampuli ya AI A' },
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80',
          meta: 'Generation Model: v4.2 • Precision: 0.96',
        },
        itemB: {
          label: { en: 'AI Sample B', sw: 'Sampuli ya AI B' },
          url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=700&q=80',
          meta: 'Generation Model: v3.8 • Precision: 0.91',
        },
        promptOrContext: {
          en: `Automated Evaluation Bench: ${targetCategory.name.en}`,
          sw: `Kipimo cha Tathmini ya Kiotomatiki: ${targetCategory.name.sw}`,
        },
      };

  return {
    id: dynamicId,
    categoryId: targetCategory.id,
    categoryName: targetCategory.name,
    title: {
      en: isAudioGroup
        ? `Listen & Evaluate: ${targetCategory.name.en}`
        : `Evaluate and calibrate: ${targetCategory.name.en}`,
      sw: isAudioGroup
        ? `Sikiliza na Upime Sauti: ${targetCategory.name.sw}`
        : `Tathmini na uhakiki: ${targetCategory.name.sw}`,
    },
    description: targetCategory.description,
    instructions: [
      {
        en: isAudioGroup
          ? `Play both voice audio samples to listen to the real generated speech.`
          : `Inspect the provided AI media inputs in the ${targetCategory.name.en} category.`,
        sw: isAudioGroup
          ? `Bonyeza Play kwenye sauti zote mbili kusikiliza matamshi halisi ya sauti.`
          : `Kagua sampuli za AI zilizotolewa katika kundi la ${targetCategory.name.sw}.`,
      },
      {
        en: isAudioGroup
          ? 'Analyze pronunciation clarity, pitch naturalness, and absence of robotic artifacts.'
          : 'Analyze accuracy, fidelity, and adherence to human quality benchmarks.',
        sw: isAudioGroup
          ? 'Chambua uwazi wa matamshi, mwinuko wa sauti kiasili na kutokuwepo kwa mikwaruzo ya kiroboti.'
          : 'Chambua usahihi na viwango vya ubora kulingana na muongozo.',
      },
      {
        en: 'Select your preferred evaluation option and submit.',
        sw: 'Chagua jibu lako sahihi na uwasilishe.',
      },
    ],
    media: defaultMedia,
    options: [
      {
        id: 'opt_sample_a',
        label: {
          en: isAudioGroup ? 'Audio Sample A (Higher Fidelity)' : 'Sample A is higher quality',
          sw: isAudioGroup ? 'Sauti Sampuli A (Ubora na Uwazi Zaidi)' : 'Sampuli A ina ubora wa juu zaidi',
        },
        subLabel: {
          en: isAudioGroup ? 'Clearer cadence and natural pitch' : 'Meets rigorous AI benchmark metrics',
          sw: isAudioGroup ? 'Matamshi fasaha na mtiririko kiasili' : 'Inakidhi vigezo vyote vya ubora wa AI',
        },
      },
      {
        id: 'opt_sample_b',
        label: {
          en: isAudioGroup ? 'Audio Sample B (Alternative Tone)' : 'Sample B is higher quality',
          sw: isAudioGroup ? 'Sauti Sampuli B (Toni Mbadala)' : 'Sampuli B ina ubora wa juu zaidi',
        },
        subLabel: {
          en: isAudioGroup ? 'Different acoustic signature' : 'Alternative stylistic or structured presentation',
          sw: isAudioGroup ? 'Muundo mbadala wa sauti' : 'Muundo mbadala unaovutia',
        },
      },
      {
        id: 'opt_equal',
        label: { en: 'Both samples are equal', sw: 'Sampuli zote mbili ziko sawa' },
      },
    ],
    rewardUSD: randomReward,
    difficulty: targetCategory.difficulty,
    estimatedSeconds: isAudioGroup ? 35 : 45,
  };
}
