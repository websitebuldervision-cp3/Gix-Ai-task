import { TaskItem, LocalizedText } from '../types';
import { USD_TO_TZS_RATE, formatUSD, formatTZS } from './translations';
import { TASK_CATEGORIES } from './taskCategories';

export interface DailyDisplayTask {
  id: string;
  categoryId: string;
  title: LocalizedText;
  domain: LocalizedText;
  categoryName: LocalizedText;
  rewardUSD: number;
  rewardTZS: string;
  time: string;
  image: string;
  tag: LocalizedText;
  correctOptionId: string;
  wrongAnswerFeedback: LocalizedText;
  taskItem: TaskItem;
}

// Master pool of diverse AI evaluation tasks that rotate deterministically every day
const MASTER_DAILY_TASK_POOL = [
  {
    poolId: 'vision_mountain',
    categoryId: 'image_comparison',
    domain: { sw: 'Picha & Maono ya AI', en: 'Vision & Perception AI' },
    categoryName: { sw: 'Ulinganishaji wa Picha', en: 'Image Comparison' },
    title: { sw: 'AI Image Quality & Visual Alignment', en: 'AI Image Quality & Visual Alignment' },
    tag: { sw: 'Kazi ya Mwanzo', en: 'Instant Task' },
    rewardUSD: 2.50,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Linganisha picha mbili za AI na uthibitishe ipi ina uwazi wa juu zaidi, makali ya milima bila mikwaruzo.',
      en: 'Compare two AI renders and identify which capture has superior dynamic range and zero digital artifacts.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Picha A ndiyo iliyokuwa na ubora wa juu na makali halisi ya milima. Kulingana na kanuni, umelipwa 15% tu ya malipo.',
      en: 'Incorrect! Image A had superior dynamic clarity. You have been awarded 15% partial payout.',
    },
  },
  {
    poolId: 'audio_swahili_voice',
    categoryId: 'audio_comparison',
    domain: { sw: 'Sauti & Matamshi ya Kiswahili', en: 'Speech & Audio Synthesis' },
    categoryName: { sw: 'Ulinganishaji wa Sauti', en: 'Audio Comparison' },
    title: { sw: 'Swahili & English Voice Synthesis AI', en: 'Swahili & English Voice Synthesis AI' },
    tag: { sw: 'Kazi ya Mwanzo', en: 'Instant Task' },
    rewardUSD: 3.00,
    time: '3 min',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Sikiliza sauti mbili za Kiswahili na Kiingereza na upime ipi inatamka maneno kiasili kama binadamu.',
      en: 'Listen to two synthetic neural voices and evaluate which sound has natural cadence and human prosody.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Sauti A ilikuwa na matamshi fasaha na mtiririko kiasili bila kelele za kiroboti. Umelipwa 15% tu.',
      en: 'Incorrect! Audio Track A possessed authentic neural prosody. You have been awarded 15% partial payout.',
    },
  },
  {
    poolId: 'medical_xray_eval',
    categoryId: 'image_quality',
    domain: { sw: 'Afya ya Jamii & AI', en: 'Medical Diagnostic AI' },
    categoryName: { sw: 'Tathmini ya Ubora wa Picha', en: 'Image Quality Evaluation' },
    title: { sw: 'Radiology Scan Contrast Benchmark', en: 'Radiology Scan Contrast Benchmark' },
    tag: { sw: 'Kazi ya Mwanzo', en: 'Instant Task' },
    rewardUSD: 2.80,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Kagua picha za uchunguzi wa afya zilizoboreshwa na AI na uchague yenye uwazi wa mifupa na tishu.',
      en: 'Review AI-enhanced medical scans and verify tissue density contrast and diagnostic clarity.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Sampuli A ina utofautishaji mzuri wa viungo bila ukungu bandia. Umelipwa 15% tu ya malipo.',
      en: 'Incorrect! Sample A maintained correct tissue contrast without hallucinated artifacts. You received 15%.',
    },
  },
  {
    poolId: 'agri_drone_crops',
    categoryId: 'image_classification',
    domain: { sw: 'Kilimo Bora & Drones', en: 'Agricultural Drone Vision' },
    categoryName: { sw: 'Uainishaji wa Picha', en: 'Image Classification' },
    title: { sw: 'Crop Health Drone Multispectral AI', en: 'Crop Health Drone Multispectral AI' },
    tag: { sw: 'Kazi ya Mwanzo', en: 'Instant Task' },
    rewardUSD: 2.60,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Tathmini afya ya mimea na mahindi kupitia picha za drone za mashambani Afrika Mashariki.',
      en: 'Classify crop foliage health and pest infestation markers from East African aerial drone imagery.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Majani kwenye Sampuli A yalionyesha dalili sahihi za klorofili kulingana na AI. Umelipwa 15% tu.',
      en: 'Incorrect! The spectral markers in Sample A matched the healthy vegetation benchmark. You received 15%.',
    },
  },
  {
    poolId: 'auto_drive_pedestrian',
    categoryId: 'image_comparison',
    domain: { sw: 'Magari Yasiyo na Dereva', en: 'Autonomous Driving' },
    categoryName: { sw: 'Ulinganishaji wa Picha', en: 'Image Comparison' },
    title: { sw: 'Nighttime Road Pedestrian Detection', en: 'Nighttime Road Pedestrian Detection' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 3.20,
    time: '3 min',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Linganisha mifumo miwili ya kamera za usiku inayotambua watembea kwa miguu na vizuizi barabarani.',
      en: 'Compare low-light camera feeds identifying pedestrians and road obstacles in autonomous navigation.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Mfumo A ulikuwa na uwezo mkubwa wa kubaini mipaka ya vizuizi gizani. Umelipwa 15% tu.',
      en: 'Incorrect! Model A provided robust edge detection in low-light environments. 15% partial reward awarded.',
    },
  },
  {
    poolId: 'swahili_llm_eval',
    categoryId: 'ai_response_comparison',
    domain: { sw: 'Lugha za Kiafrika AI', en: 'African NLP & LLMs' },
    categoryName: { sw: 'Ulinganishaji wa Majibu ya AI', en: 'AI Response Comparison' },
    title: { sw: 'Swahili Grammar & Cultural Context AI', en: 'Swahili Grammar & Cultural Context AI' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 2.75,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Pima usahihi wa sentensi za Kiswahili fasaha zilizotungwa na chatbot ya kizazi kipya.',
      en: 'Evaluate Swahili linguistic naturalness, grammatical concordance, and cultural resonance.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Jibu A lilifuata upatanisho sahihi wa ngeli za Kiswahili. Umelipwa 15% tu ya malipo.',
      en: 'Incorrect! Response A followed accurate Swahili noun-class grammatical agreement. 15% awarded.',
    },
  },
  {
    poolId: 'document_ocr_finance',
    categoryId: 'data_entry_qa',
    domain: { sw: 'Nyaraka & Fedha', en: 'Fintech OCR Verification' },
    categoryName: { sw: 'Uhakiki wa Data', en: 'Data Verification' },
    title: { sw: 'Mobile Money Invoice OCR Extraction', en: 'Mobile Money Invoice OCR Extraction' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 2.40,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Kagua risiti ya kielektroniki ya M-Pesa/TigoPesa na uhakikishe namba ya kumbukumbu na kiasi.',
      en: 'Inspect scanned transaction slips and verify extracted reference IDs and numerical amounts.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Takwimu za Sampuli A zinalingana moja kwa moja na risiti ya asili. Umelipwa 15% tu.',
      en: 'Incorrect! Sample A accurately transcribed receipt ledger entries. 15% partial reward awarded.',
    },
  },
  {
    poolId: 'ecommerce_fraud_guard',
    categoryId: 'content_moderation',
    domain: { sw: 'Biashara Mtandaoni', en: 'E-Commerce Moderation' },
    categoryName: { sw: 'Ukaguzi wa Maudhui', en: 'Content Moderation' },
    title: { sw: 'E-Commerce Product Authenticity Guard', en: 'E-Commerce Product Authenticity Guard' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 2.30,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Tambua kama bidhaa inayouzwa mtandaoni inakidhi viwango halisi au ina maelezo ya ulaghai.',
      en: 'Identify misleading product claims and counterfeit indicators in digital catalog listings.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Maelezo ya A yalikuwa na vigezo sahihi vilivyoidhinishwa. Umelipwa 15% tu.',
      en: 'Incorrect! Option A followed verified marketplace safety policies. 15% partial reward awarded.',
    },
  },
  {
    poolId: 'code_syntax_debugger',
    categoryId: 'ai_response_comparison',
    domain: { sw: 'Teknolojia & Programu', en: 'Code Synthesis & QA' },
    categoryName: { sw: 'Ulinganishaji wa Majibu ya AI', en: 'AI Response Comparison' },
    title: { sw: 'Python & JavaScript Algorithm Benchmark', en: 'Python & JavaScript Algorithm Benchmark' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 3.50,
    time: '3 min',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Linganisha kanuni mbili za hesabu za kompyuta na uchague iliyo thabiti bila hitilafu za kumbukumbu.',
      en: 'Evaluate two AI-generated algorithm functions for runtime efficiency and zero syntax errors.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Kanuni A haina hitilafu za muda wa matumizi (runtime error). Umelipwa 15% tu ya malipo.',
      en: 'Incorrect! Code snippet A resolved the edge-case error properly. 15% partial reward awarded.',
    },
  },
  {
    poolId: 'satellite_urban_density',
    categoryId: 'image_classification',
    domain: { sw: 'Ramani za Satelaiti', en: 'Geospatial Intelligence' },
    categoryName: { sw: 'Uainishaji wa Picha', en: 'Image Classification' },
    title: { sw: 'Dar es Salaam Urban Growth Satellite AI', en: 'Dar es Salaam Urban Growth Satellite AI' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 2.90,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Pima upanuzi wa miji na miundombinu ya barabara kupitia picha za satelaiti zenye ubora wa juu.',
      en: 'Annotate municipal infrastructure expansion and road networks from high-res satellite tiles.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Mpaka wa makazi kwenye Sampuli A ulipimwa kwa usahihi zaidi. Umelipwa 15% tu.',
      en: 'Incorrect! Polygon boundaries in Sample A adhered closer to ground truth. 15% awarded.',
    },
  },
  {
    poolId: 'environmental_audio_safari',
    categoryId: 'audio_classification',
    domain: { sw: 'Wanyamapori & Mazingira', en: 'Wildlife Acoustic Tagging' },
    categoryName: { sw: 'Uainishaji wa Sauti', en: 'Audio Classification' },
    title: { sw: 'Serengeti Wildlife Acoustic Classifier', en: 'Serengeti Wildlife Acoustic Classifier' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 3.10,
    time: '3 min',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Sikiliza mlio wa wanyama na ndege porini na uainishe spishi husika kwa usahihi wa kibaolojia.',
      en: 'Identify animal species vocalizations and bioacoustic frequencies recorded in national parks.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Mlio uliosikika kwenye Sampuli A ulikuwa wa ndege wa spishi sahihi. Umelipwa 15% tu.',
      en: 'Incorrect! The acoustic spectrogram in Sample A matched the target avian call. 15% awarded.',
    },
  },
  {
    poolId: 'solar_energy_prediction',
    categoryId: 'data_entry_qa',
    domain: { sw: 'Nishati Safi ya Jua', en: 'Renewable Energy AI' },
    categoryName: { sw: 'Uhakiki wa Data', en: 'Data Verification' },
    title: { sw: 'Off-Grid Solar Panel Efficiency Matrix', en: 'Off-Grid Solar Panel Efficiency Matrix' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 2.70,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Linganisha viwango vya uzalishaji umeme wa jua kulingana na hali ya hewa na mionzi ya jua.',
      en: 'Verify solar inverter kilowatt output logs mapped against irradiance telemetry.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Chati A inalingana na vigezo sahihi vya jua la mchana. Umelipwa 15% tu ya malipo.',
      en: 'Incorrect! Irradiance curves in Dataset A reflected validated physical parameters. 15% awarded.',
    },
  },
  {
    poolId: 'water_sanitation_vision',
    categoryId: 'image_quality',
    domain: { sw: 'Maji Safi & Usafi', en: 'Water Quality Telemetry' },
    categoryName: { sw: 'Tathmini ya Ubora wa Picha', en: 'Image Quality Evaluation' },
    title: { sw: 'Clean Water Turbidity AI Sensor', en: 'Clean Water Turbidity AI Sensor' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 2.65,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Tathmini sampuli za maji na uainishe uwazi wa maji kulingana na viwango vya afya ya jamii.',
      en: 'Assess water sample turbidity optical clarity under standardized laboratory metrics.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Sampuli A ilionyesha kiwango sahihi cha usafi wa maji. Umelipwa 15% tu ya malipo.',
      en: 'Incorrect! Turbidity refraction index in Sample A matched clean water standards. 15% awarded.',
    },
  },
  {
    poolId: 'packaging_defect_ai',
    categoryId: 'image_comparison',
    domain: { sw: 'Viwanda & Uzalishaji', en: 'Industrial Packaging QA' },
    categoryName: { sw: 'Ulinganishaji wa Picha', en: 'Image Comparison' },
    title: { sw: 'Factory Bottling Line Defect Detection', en: 'Factory Bottling Line Defect Detection' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 2.85,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Baini makosa ya kufunga vifungashio vya viwandani kwenye laini ya uzalishaji ya kiotomatiki.',
      en: 'Inspect automated assembly line conveyor captures for seal defects and label alignment.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Mfumo A ulibaini kwa ufasaha mipasuko ya kifuniko cha chupa. Umelipwa 15% tu.',
      en: 'Incorrect! Sample A successfully identified the micro-fracture seal discrepancy. 15% awarded.',
    },
  },
  {
    poolId: 'voice_podcast_denoiser',
    categoryId: 'audio_comparison',
    domain: { sw: 'Sauti & Studio AI', en: 'Audio Studio Denoising' },
    categoryName: { sw: 'Ulinganishaji wa Sauti', en: 'Audio Comparison' },
    title: { sw: 'Studio Podcast Background Denoise', en: 'Studio Podcast Background Denoise' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 3.15,
    time: '3 min',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Sikiliza sampuli mbili za sauti ya mahojiano na uchague ile iliyoondolewa kelele za feni na upepo.',
      en: 'Evaluate spectral noise suppression preserving vocal resonance and removing ambient hums.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Wimbo A uliondoa milio ya feni bila kumeza matamshi ya mzungumzaji. Umelipwa 15% tu.',
      en: 'Incorrect! Track A preserved vocal frequencies while isolating low-end acoustic rumble. 15% awarded.',
    },
  },
  {
    poolId: 'transport_license_plate',
    categoryId: 'image_classification',
    domain: { sw: 'Usalama Barabarani', en: 'Traffic Vision Telemetry' },
    categoryName: { sw: 'Uainishaji wa Picha', en: 'Image Classification' },
    title: { sw: 'High-Speed Vehicle License Plate OCR', en: 'High-Speed Vehicle License Plate OCR' },
    tag: { sw: 'Kazi Mpya Leo', en: 'New Today' },
    rewardUSD: 2.95,
    time: '2 min',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=80',
    description: {
      sw: 'Hakiki namba za nambari za magari zilizokamatwa na kamera za barabarani zenye mwendo kasi.',
      en: 'Verify optical character segmentation on highway high-speed license plate sensors.',
    },
    correctOptionId: 'opt_a',
    wrongAnswerFeedback: {
      sw: 'Umekosea! Nambari ya gari kwenye Sampuli A ilitambuliwa kwa usahihi wa 100%. Umelipwa 15% tu.',
      en: 'Incorrect! Plate recognition in Sample A avoided character confusion. 15% partial reward awarded.',
    },
  },
];

/**
 * Deterministically generates today's unique rotating tasks based on calendar date.
 * Each day of the year brings a new order, varied rewards, and fresh spotlight tasks!
 */
export function getDailyTasks(date = new Date()): DailyDisplayTask[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Deterministic daily seed
  const dayOfYear = Math.floor(
    (Date.UTC(year, month, day) - Date.UTC(year, 0, 0)) / (1000 * 60 * 60 * 24)
  );

  const poolLength = MASTER_DAILY_TASK_POOL.length;
  const offset = (dayOfYear * 3) % poolLength;

  // Rotate array based on today's offset
  const rotatedMaster = [
    ...MASTER_DAILY_TASK_POOL.slice(offset),
    ...MASTER_DAILY_TASK_POOL.slice(0, offset),
  ];

  return rotatedMaster.map((item, idx) => {
    // Dynamic variance in reward based on day so values refresh slightly every day
    const rewardVariance = ((dayOfYear * (idx + 1) * 7) % 30) / 100 - 0.15; // +/- $0.15
    const finalRewardUSD = Number(Math.max(1.80, item.rewardUSD + rewardVariance).toFixed(2));
    const finalRewardTZS = `TSh ${(Math.round(finalRewardUSD * USD_TO_TZS_RATE)).toLocaleString()}`;

    const taskId = `daily_${year}_${dayOfYear}_${item.poolId}`;

    // Construct full TaskItem so clicking Start Task opens cleanly
    const isAudio = item.categoryId.includes('audio');

    const taskItem: TaskItem = {
      id: taskId,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      title: item.title,
      description: item.description,
      rewardUSD: finalRewardUSD,
      difficulty: idx < 4 ? 'easy' : (idx % 2 === 0 ? 'medium' : 'easy'),
      estimatedSeconds: isAudio ? 45 : 35,
      correctOptionId: item.correctOptionId,
      wrongAnswerFeedback: item.wrongAnswerFeedback,
      instructions: [
        {
          sw: isAudio
            ? 'Bonyeza Play kwenye sauti zote mbili kusikiliza matamshi halisi ya sauti.'
            : 'Kagua picha na sampuli zilizotolewa kwa makini kulingana na muongozo wa AI.',
          en: isAudio
            ? 'Play both audio tracks to inspect real synthesized vocal prosody.'
            : 'Inspect the provided AI media inputs in accordance with the benchmark instructions.',
        },
        {
          sw: 'Chambua ubora, uwazi na vigezo sahihi kulingana na maelezo ya kazi hii.',
          en: 'Analyze clarity, fidelity, and adherence to human quality benchmarks.',
        },
        {
          sw: 'Chagua jibu lako sahihi kisha bonyeza kitufe cha kutuma (Submit).',
          en: 'Select the optimal option and click submit to verify your answer.',
        },
      ],
      media: isAudio
        ? {
            type: 'audio_duo',
            promptOrContext: {
              sw: `Jaribio la Sauti Halisi: "${item.title.sw}"`,
              en: `Real Neural Audio Benchmark: "${item.title.en}"`,
            },
            itemA: {
              label: { sw: 'Sampuli ya Sauti A (Mfumo wa Kiasili)', en: 'Voice Track A (Neural Synthesis)' },
              text: 'Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa nchini.',
              speechText: {
                sw: 'Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa nchini.',
                en: 'Good morning, artificial intelligence systems bring tremendous progress to community development.',
              },
              voiceStyle: 'natural',
              meta: 'Duration: ~5s • 48kHz • Natural Pitch',
            },
            itemB: {
              label: { sw: 'Sampuli ya Sauti B (Mfumo Mbadala)', en: 'Voice Track B (Monotone Baseline)' },
              text: 'Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa nchini.',
              speechText: {
                sw: 'Habari za asubuhi, mifumo ya teknolojia ya kijasusi inaleta maendeleo makubwa nchini.',
                en: 'Good morning, artificial intelligence systems bring tremendous progress to community development.',
              },
              voiceStyle: 'robotic',
              meta: 'Duration: ~5s • 24kHz • Monotone Synthesis',
            },
          }
        : {
            type: 'image_duo',
            promptOrContext: {
              sw: `Kipimo cha Tathmini ya AI: ${item.title.sw}`,
              en: `Automated Evaluation Bench: ${item.title.en}`,
            },
            itemA: {
              label: { sw: 'Picha A (Ubora wa Juu)', en: 'Sample A (High Fidelity)' },
              url: item.image,
              meta: 'Resolution: 3840x2160 • ISO 100 • Sharp Contrast',
            },
            itemB: {
              label: { sw: 'Picha B (Ubora wa Kawaida)', en: 'Sample B (Standard Compression)' },
              url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
              meta: 'Resolution: 1920x1080 • Noticeable Compression',
            },
          },
      options: [
        {
          id: 'opt_a',
          label: {
            sw: isAudio ? 'Sauti Sampuli A (Bora & ya Kiasili Zaidi)' : 'Sampuli A ina ubora na uwazi wa juu zaidi',
            en: isAudio ? 'Voice Sample A (Natural Pitch & Cadence)' : 'Sample A is higher quality with crisp details',
          },
          subLabel: {
            sw: 'Inakidhi vigezo vyote vya viwango vya ubora wa AI',
            en: 'Meets rigorous benchmark fidelity standards',
          },
        },
        {
          id: 'opt_b',
          label: {
            sw: isAudio ? 'Sauti Sampuli B (Ubora wa Chini)' : 'Sampuli B ina ubora wa juu zaidi',
            en: isAudio ? 'Voice Sample B (Alternative Tone)' : 'Sample B is higher quality',
          },
          subLabel: {
            sw: 'Ina mikwaruzo midogo ya kiroboti au ukungu',
            en: 'Noticeable compression artifacts or robotic tone',
          },
        },
        {
          id: 'opt_equal',
          label: { sw: 'Sampuli zote mbili ziko sawa', en: 'Both samples are equally good' },
        },
      ],
    };

    return {
      id: taskId,
      categoryId: item.categoryId,
      title: item.title,
      domain: item.domain,
      categoryName: item.categoryName,
      rewardUSD: finalRewardUSD,
      rewardTZS: finalRewardTZS,
      time: item.time,
      image: item.image,
      tag: idx < 4 ? { sw: `Kazi ya #${idx + 1} Leo`, en: `Today Task #${idx + 1}` } : item.tag,
      correctOptionId: item.correctOptionId,
      wrongAnswerFeedback: item.wrongAnswerFeedback,
      taskItem,
    };
  });
}

/**
 * Formats current date in friendly Swahili and English
 */
export function getDailyDateFormatted(date = new Date()) {
  const swMonths = [
    'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
    'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba',
  ];
  const enMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const swDays = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
  const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const dayOfWeek = date.getDay();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return {
    sw: `${swDays[dayOfWeek]}, ${day} ${swMonths[month]} ${year}`,
    en: `${enDays[dayOfWeek]}, ${enMonths[month]} ${day}, ${year}`,
    shortSw: `${day} ${swMonths[month]}`,
    shortEn: `${enMonths[month]} ${day}`,
  };
}
