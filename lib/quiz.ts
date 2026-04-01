import { QuizQuestion } from '@/types';

export const QUIZ_POOL: QuizQuestion[] = [
  // ── TRI SUKSES GENERUS ──
  {
    id: 'q1',
    category: 'Tri Sukses Generus',
    question: 'Tri Sukses Generus LDII terdiri dari tiga poin utama. Manakah yang BUKAN termasuk Tri Sukses Generus?',
    options: ['Akhlaqul karimah', 'Alim dan faqih', 'Mandiri', 'Kompak'],
    correct: 3,
  },
  {
    id: 'q2',
    category: 'Tri Sukses Generus',
    question: '"Mandiri" dalam konteks Tri Sukses Generus bermakna...',
    options: [
      'Tidak perlu bergantung kepada siapapun sama sekali',
      'Mampu berdiri sendiri secara ekonomi, ilmu, dan mental',
      'Selalu bekerja sendiri tanpa tim',
      'Menguasai teknologi terkini',
    ],
    correct: 1,
  },

  // ── ENAM THABIAT LUHUR ──
  {
    id: 'q3',
    category: 'Enam Thabiat Luhur',
    question: 'Berapa jumlah Thabiat Luhur dalam 29 Karakter Luhur LDII?',
    options: ['4', '5', '6', '7'],
    correct: 2,
  },
  {
    id: 'q4',
    category: 'Enam Thabiat Luhur',
    question: 'Manakah yang merupakan bagian dari Enam Thabiat Luhur?',
    options: [
      'Bersyukur, mempersungguh, mengagungkan',
      'Rukun, kompak, kerja sama yang baik, jujur, amanah, dan mujhid-muzhid',
      'Berbicara baik, jujur, sabar, tidak merusak, saling menjaga perasaan',
      'Benar, kurup, dan janji',
    ],
    correct: 1,
  },
  {
    id: 'q5',
    category: 'Enam Thabiat Luhur',
    question: '"Mujhid-muzhid" dalam Thabiat Luhur memiliki makna...',
    options: [
      'Rajin beribadah dan hemat/tidak boros',
      'Suka berjihad di jalan Allah',
      'Tekun belajar ilmu agama',
      'Pandai bergaul dan bersosialisasi',
    ],
    correct: 0,
  },

  // ── EMPAT TALI KEIMANAN ──
  {
    id: 'q6',
    category: 'Empat Tali Keimanan',
    question: 'Empat Tali Keimanan dalam 29 Karakter Luhur LDII adalah...',
    options: [
      'Sholat, zakat, puasa, haji',
      'Bersyukur, mempersungguh, mengagungkan, dan berdoa',
      'Jujur, amanah, kompak, dan rukun',
      'Sabar, syukur, tawakal, dan ikhlas',
    ],
    correct: 1,
  },
  {
    id: 'q7',
    category: 'Empat Tali Keimanan',
    question: '"Mempersungguh" dalam Empat Tali Keimanan berarti...',
    options: [
      'Berlomba-lomba dalam kebaikan dengan sungguh-sungguh',
      'Menjalankan sesuatu dengan serius dan penuh kesungguhan',
      'Bersungguh-sungguh dalam menuntut ilmu saja',
      'Serius dalam urusan dunia saja',
    ],
    correct: 1,
  },

  // ── TIGA PRINSIP KERJA ──
  {
    id: 'q8',
    category: 'Tiga Prinsip Kerja',
    question: 'Tiga Prinsip Kerja dalam 29 Karakter Luhur LDII adalah...',
    options: [
      'Ikhlas, sabar, dan tawakal',
      'Benar, kurup (tepat), dan janji',
      'Jujur, amanah, dan kompak',
      'Mandiri, disiplin, dan bertanggung jawab',
    ],
    correct: 1,
  },
  {
    id: 'q9',
    category: 'Tiga Prinsip Kerja',
    question: '"Kurup" dalam Tiga Prinsip Kerja bermakna...',
    options: ['Sopan dan beradab', 'Tepat sasaran, waktu, dan cara', 'Kreatif dan inovatif', 'Cepat dan efisien'],
    correct: 1,
  },

  // ── EMPAT MAQODIRULLOH ──
  {
    id: 'q10',
    category: 'Empat Maqodirulloh',
    question: 'Empat Maqodirulloh mengajarkan respons yang tepat terhadap kondisi hidup. Manakah yang BUKAN bagian dari Empat Maqodirulloh?',
    options: [
      'Bersyukur atas nikmat',
      'Sabar menghadapi cobaan',
      'Bertaubat atas kesalahan',
      'Bersedekah atas rezeki berlimpah',
    ],
    correct: 3,
  },
  {
    id: 'q11',
    category: 'Empat Maqodirulloh',
    question: '"Istirja\'" dalam Empat Maqodirulloh adalah sikap yang dianjurkan saat...',
    options: ['Mendapatkan nikmat besar', 'Ditimpa musibah', 'Menghadapi cobaan panjang', 'Melakukan kesalahan'],
    correct: 1,
  },

  // ── EMPAT RODA BERPUTAR ──
  {
    id: 'q12',
    category: 'Empat Roda Berputar',
    question: 'Konsep "Empat Roda Berputar" menggambarkan...',
    options: [
      'Empat unsur kepemimpinan dalam organisasi',
      'Siklus kegiatan harian seorang muslim',
      'Semangat saling membantu dan menguatkan antar anggota jamaah',
      'Empat tahapan pengembangan diri',
    ],
    correct: 2,
  },
  {
    id: 'q13',
    category: 'Empat Roda Berputar',
    question: 'Salah satu dari Empat Roda Berputar adalah "yang salah dinasihati untuk bertaubat". Ini mencerminkan nilai...',
    options: ['Kekerasan dalam penegakan aturan', 'Kepedulian dan kasih sayang antar sesama jamaah', 'Hukuman bagi yang melanggar', 'Ketegasan pemimpin'],
    correct: 1,
  },

  // ── LIMA SYARAT KERUKUNAN ──
  {
    id: 'q14',
    category: 'Lima Syarat Kerukunan',
    question: 'Berapa jumlah syarat kerukunan dan kekompakkan dalam 29 Karakter Luhur?',
    options: ['3', '4', '5', '6'],
    correct: 2,
  },
  {
    id: 'q15',
    category: 'Lima Syarat Kerukunan',
    question: 'Manakah yang BUKAN termasuk Lima Syarat Kerukunan dan Kekompakkan?',
    options: [
      'Berbicara baik dan benar',
      'Sabar dan mengalah',
      'Selalu menang dalam perdebatan',
      'Saling menjaga perasaan',
    ],
    correct: 2,
  },
  {
    id: 'q16',
    category: 'Lima Syarat Kerukunan',
    question: '"Tidak merusak sesama" dalam Lima Syarat Kerukunan mencakup...',
    options: [
      'Tidak merusak harta benda milik orang lain saja',
      'Tidak menyakiti hati, fisik, maupun kehormatan sesama',
      'Tidak berbicara keras di depan umum',
      'Tidak bersaing dalam bisnis',
    ],
    correct: 1,
  },

  // ── UMUM / 29 KARAKTER ──
  {
    id: 'q17',
    category: 'Umum',
    question: 'Program 29 Karakter Luhur LDII bertujuan untuk membentuk generasi yang...',
    options: [
      'Menguasai teknologi dan bisnis global',
      'Profesional-religius, berakhlakul karimah, alim faqih, dan mandiri',
      'Unggul dalam prestasi akademik semata',
      'Memenangkan kompetisi internasional',
    ],
    correct: 1,
  },
  {
    id: 'q18',
    category: 'Umum',
    question: '29 Karakter Luhur LDII dikelompokkan menjadi berapa kelompok utama?',
    options: ['5', '6', '7', '8'],
    correct: 2,
  },
  {
    id: 'q19',
    category: 'Umum',
    question: 'Program 29 Karakter Luhur meneladani sifat siapa sebagai rujukan utamanya?',
    options: ['Para sahabat Nabi', 'Ulama besar Islam', 'Nabi Muhammad SAW', 'Khulafaur Rasyidin'],
    correct: 2,
  },
  {
    id: 'q20',
    category: 'Umum',
    question: 'Nilai "jujur dan amanah" muncul pada kelompok karakter mana saja?',
    options: [
      'Enam Thabiat Luhur saja',
      'Lima Syarat Kerukunan saja',
      'Enam Thabiat Luhur dan Lima Syarat Kerukunan',
      'Tiga Prinsip Kerja dan Empat Tali Keimanan',
    ],
    correct: 2,
  },
];

/**
 * Ambil 2 pertanyaan acak dari pool, memastikan dari kategori berbeda
 */
export function pickTwoQuestions(): QuizQuestion[] {
  const shuffled = [...QUIZ_POOL].sort(() => Math.random() - 0.5);
  const picked: QuizQuestion[] = [];
  const usedCategories = new Set<string>();

  for (const q of shuffled) {
    if (picked.length >= 2) break;
    if (!usedCategories.has(q.category)) {
      picked.push(q);
      usedCategories.add(q.category);
    }
  }

  // fallback jika kurang dari 2
  if (picked.length < 2) {
    for (const q of shuffled) {
      if (picked.length >= 2) break;
      if (!picked.find(p => p.id === q.id)) picked.push(q);
    }
  }

  return picked;
}
