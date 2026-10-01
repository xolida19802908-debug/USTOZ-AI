import { Subject, Textbook } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'ozbekiston-tarixi',
    name: "O'zbekiston tarixi",
    iconName: 'Landmark',
    grades: [5, 6, 7, 8, 9, 10, 11],
    color: 'emerald',
  },
  {
    id: 'ona-tili',
    name: 'Ona tili',
    iconName: 'BookOpen',
    grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    color: 'blue',
  },
  {
    id: 'adabiyot',
    name: 'Adabiyot',
    iconName: 'Feather',
    grades: [5, 6, 7, 8, 9, 10, 11],
    color: 'amber',
  },
  {
    id: 'matematika',
    name: 'Matematika',
    iconName: 'Calculator',
    grades: [1, 2, 3, 4, 5, 6],
    color: 'violet',
  },
  {
    id: 'algebra',
    name: 'Algebra',
    iconName: 'Binary',
    grades: [7, 8, 9, 10, 11],
    color: 'indigo',
  },
  {
    id: 'geometriya',
    name: 'Geometriya',
    iconName: 'Compass',
    grades: [7, 8, 9, 10, 11],
    color: 'teal',
  },
  {
    id: 'fizika',
    name: 'Fizika',
    iconName: 'Atom',
    grades: [6, 7, 8, 9, 10, 11],
    color: 'rose',
  },
  {
    id: 'kimyo',
    name: 'Kimyo',
    iconName: 'FlaskConical',
    grades: [7, 8, 9, 10, 11],
    color: 'cyan',
  },
  {
    id: 'biologiya',
    name: 'Biologiya',
    iconName: 'Dna',
    grades: [5, 6, 7, 8, 9, 10, 11],
    color: 'green',
  },
  {
    id: 'geografiya',
    name: 'Geografiya',
    iconName: 'Globe',
    grades: [5, 6, 7, 8, 9, 10, 11],
    color: 'orange',
  },
  {
    id: 'informatika',
    name: 'Informatika',
    iconName: 'Cpu',
    grades: [5, 6, 7, 8, 9, 10, 11],
    color: 'purple',
  },
  {
    id: 'ingliz-tili',
    name: 'Ingliz tili',
    iconName: 'Languages',
    grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    color: 'sky',
  },
  {
    id: 'jahon-tarixi',
    name: 'Jahon tarixi',
    iconName: 'Hourglass',
    grades: [7, 8, 9, 10, 11],
    color: 'yellow',
  },
  {
    id: 'huquq',
    name: 'Davlat va huquq asoslari',
    iconName: 'Scale',
    grades: [8, 9, 10, 11],
    color: 'stone',
  },
  {
    id: 'tarbiya',
    name: 'Tarbiya',
    iconName: 'HeartHandshake',
    grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    color: 'pink',
  },
];

export const OFFICIAL_TEXTBOOKS: Textbook[] = [
  // 8-sinf O'zbekiston tarixi (The gold standard textbook required in prompt)
  {
    id: 'uzb-hist-8',
    subjectId: 'ozbekiston-tarixi',
    subjectName: "O'zbekiston tarixi",
    grade: 8,
    title: "O'zbekiston tarixi (XIV–XIX asr birinchi yarmi)",
    authors: 'A. Muhammadjonov, Q. Rajabov, N. Mahmudov',
    year: 2023,
    publisher: "O'qituvchi NMIU, Toshkent",
    edition: "4-nashr, qayta ishlangan",
    available: true,
    chapters: [
      {
        id: 'hist-8-ch1',
        number: 1,
        title: 'I BOB. Amir Temur va Temuriylar davlati',
        pages: '5–58',
        topics: [
          {
            id: 'hist-8-ch1-t1',
            title: 'Amir Temurning hokimiyat tepasiga kelishi va markazlashgan davlat tuzishi',
            page: 12,
            keyPoints: [
              '1370-yil Balx qurultoyida Amir Temur Movarounnahrning oliy hukmdori deb e’lon qilindi.',
              'Kesh (Shahrisabz) va Samarqand shaharlarini obodonlashtirishga alohida e’tibor qaratildi.',
              'Markazlashgan mustaqil davlat barpo etish yo‘lida feodal tarqoqlikka barham berildi.',
            ],
          },
          {
            id: 'hist-8-ch1-t2',
            title: 'Amir Temurning harbiy yurishlari va davlat boshqaruvi',
            page: 28,
            keyPoints: [
              'Qo‘shin o‘nlik, yuzlik, minglik va tumanlarga (o‘n minglik) bo‘lingan.',
              '“Temur tuzuklari” – davlatni adolat va qonun asosida boshqarish qomusi.',
              '1402-yil 20-iyulda Anqara jangida Boyazid Yildirim ustidan g‘alaba qozonildi.',
            ],
          },
          {
            id: 'hist-8-ch1-t3',
            title: 'Mirzo Ulug‘bek davrida madaniyat, ilm-fan va rasadxona bunyod etilishi',
            page: 45,
            keyPoints: [
              '1424–1428-yillarda Samarqandda Ko‘hak tepaligida uch qavatli rasadxona qurildi.',
              '“Ziji jadidi Ko‘ragoniy” – 1018 ta yulduzning aniq koordinatasini o‘z ichiga olgan fundamental asar.',
              'Samarqand, Buxoro va G‘ijduvonda Mirzo Ulug‘bek madrasalari ochildi.',
            ],
          },
          {
            id: 'hist-8-ch1-t4',
            title: 'Husayn Boyqaro va Alisher Navoiy davrida Xuroson madaniy hayoti',
            page: 54,
            keyPoints: [
              'Hirot XV asr ikkinchi yarmida Sharqning yirik madaniyat va adabiyot markaziga aylandi.',
              'Alisher Navoiy turkiy tilda birinchi bo‘lib “Xamsa” asarini yaratdi (1483–1485).',
              'Kamoliddin Behzod miniatyura maktabi gullab-yashnadi.',
            ],
          },
        ],
      },
      {
        id: 'hist-8-ch2',
        number: 2,
        title: 'II BOB. Shayboniylar va Ashtarxoniylar davlati',
        pages: '59–112',
        topics: [
          {
            id: 'hist-8-ch2-t1',
            title: 'Muhammad Shayboniyxonning Movarounnahrni egallashi',
            page: 63,
            keyPoints: [
              '1500-yilda Samarqand Shayboniyxon tomonidan birinchi marta egallandi.',
              'Zahiriddin Muhammad Boburning Samarqand uchun kurashlari va Hindistonga yurishi.',
            ],
          },
          {
            id: 'hist-8-ch2-t2',
            title: 'Abdullaxon II davrida Buxoro xonligining birlashtirilishi',
            page: 82,
            keyPoints: [
              '1583-yilda Abdullaxon II Buxoro xonligining yagona oliy hukmdori bo‘ldi.',
              'Katta suv inshootlari (Abdullaxon bandi), karvonsaroylar va timlar qurildi.',
            ],
          },
        ],
      },
    ],
  },

  // 7-sinf Ona tili (Milliy o'quv dasturi asosida)
  {
    id: 'ona-tili-7',
    subjectId: 'ona-tili',
    subjectName: 'Ona tili',
    grade: 7,
    title: 'Ona tili (Umumiy o‘rta ta’lim maktablarining 7-sinfi uchun)',
    authors: 'N. Mahmudov, A. Nurmonov, A. Sobirov',
    year: 2022,
    publisher: "O‘qituvchi NMIU, Toshkent",
    edition: 'Yangi milliy avlod nashri',
    available: true,
    chapters: [
      {
        id: 'ot-7-ch1',
        number: 1,
        title: 'Fe’l so‘z turkumi va uning ma’no turlari',
        pages: '12–50',
        topics: [
          {
            id: 'ot-7-ch1-t1',
            title: 'Fe’l nisbatlari: Aniq, O‘zlik, Majhul, Birgalik, Orttirma nisbat',
            page: 34,
            keyPoints: [
              'Aniq nisbat maxsus qo‘shimchaga ega emas (yozdi, o‘qidi).',
              'O‘zlik nisbati -in, -il, -n qo‘shimchalari yordamida yasaladi (yuvindi, kiyindi).',
              'Majhul nisbat ish-harakatning boshqa shaxs tomonidan bajarilganini bildiradi (-il, -in).',
              'Orttirma nisbat qo‘shimchalari: -t, -dir, -tir, -ir, -sat, -giz.',
            ],
          },
          {
            id: 'ot-7-ch1-t2',
            title: 'Fe’l mayllari: Buyruq-istak, Shart, Maqsad, Xabar mayli',
            page: 42,
            keyPoints: [
              'Xabar mayli ish-harakatning uch zamondan birida ro‘y berganini, berayotganini yoki berishini ifodalaydi.',
              'Shart mayli -sa qo‘shimchasi bilan hosil qilinadi.',
            ],
          },
        ],
      },
    ],
  },

  // 9-sinf Fizika
  {
    id: 'fizika-9',
    subjectId: 'fizika',
    subjectName: 'Fizika',
    grade: 9,
    title: 'Fizika (9-sinf darsligi)',
    authors: 'P. Habibullayev, A. Boydedayev, A. Daminov',
    year: 2023,
    publisher: "G'afur G'ulom nashriyoti, Toshkent",
    edition: 'Qayta ishlangan 3-nashr',
    available: true,
    chapters: [
      {
        id: 'fiz-9-ch1',
        number: 1,
        title: 'Mexanika asoslari va Dinamika qonunlari',
        pages: '10–72',
        topics: [
          {
            id: 'fiz-9-ch1-t1',
            title: 'Nyutonning birinchi, ikkinchi va uchinchi qonunlari',
            page: 52,
            keyPoints: [
              'Nyutonning I qonuni (inersiya qonuni): jismga boshqa jismlar ta’sir etmasa yoki ularning ta’siri muvozanatlashgan bo‘lsa, u tinch holatini yoki to‘g‘ri chiziqli tekis harakatini saqlaydi.',
              'Nyutonning II qonuni: F = m * a. Kuch tezlanish bilan to‘g‘ri proporsional.',
              'Nyutonning III qonuni: har qanday ta’sirga unga teng va qarama-qarshi yo‘nalgan aks ta’sir mavjud (F1 = -F2).',
            ],
          },
          {
            id: 'fiz-9-ch1-t2',
            title: 'Butun olam tortishish qonuni va og‘irlik kuchi',
            page: 65,
            keyPoints: [
              'F = G * (m1 * m2) / R^2.',
              'Gravitatsion doimiy G = 6.67 * 10^-11 N*m^2/kg^2.',
            ],
          },
        ],
      },
    ],
  },

  // 6-sinf Matematika
  {
    id: 'matematika-6',
    subjectId: 'matematika',
    subjectName: 'Matematika',
    grade: 6,
    title: 'Matematika (6-sinflar uchun darslik)',
    authors: 'M. Mirzaxmedov, A. Rahimqoriyev',
    year: 2022,
    publisher: "O‘qituvchi NMIU, Toshkent",
    edition: '2-nashr',
    available: true,
    chapters: [
      {
        id: 'mat-6-ch1',
        number: 1,
        title: 'Oddiy va o‘nli kasrlar ustida amallar',
        pages: '8–65',
        topics: [
          {
            id: 'mat-6-ch1-t1',
            title: 'Musbat va manfiy sonlar, son o‘qi, koordinatalar',
            page: 48,
            keyPoints: [
              'Noldan o‘ngda musbat, chapda manfiy sonlar joylashadi.',
              'Ikkita manfiy sonning yig‘indisi doimo manfiy son bo‘ladi.',
              'Qarama-qarshi sonlarning yig‘indisi nolga teng: a + (-a) = 0.',
            ],
          },
        ],
      },
    ],
  },

  // 10-sinf Kimyo
  {
    id: 'kimyo-10',
    subjectId: 'kimyo',
    subjectName: 'Kimyo',
    grade: 10,
    title: 'Kimyo (Organik kimyo asoslari)',
    authors: 'I. Asqarov, N. To‘xtaboyev, K. G‘opirov',
    year: 2022,
    publisher: "Novda Edutainment, Toshkent",
    edition: 'Zamonaviy darslik majmuasi',
    available: true,
    chapters: [
      {
        id: 'kim-10-ch1',
        number: 1,
        title: 'Uglevodorodlar: To‘yingan va to‘yinmagan birikmalar',
        pages: '15–80',
        topics: [
          {
            id: 'kim-10-ch1-t1',
            title: 'Alkanlar gomologik qatori va izomeriya hodisasi',
            page: 38,
            keyPoints: [
              'Alkanlarning umumiy formulasi: CnH2n+2.',
              'Metan (CH4) – eng oddiy to‘yingan uglevodorod.',
              'Alkanlarda uglerod atomlari sp3 gibridlanish holatida bo‘ladi (valent burchagi 109°28\').',
            ],
          },
        ],
      },
    ],
  },

  // Unindexed textbook example to trigger requirement #5:
  // "Tanlangan darslikning elektron nusxasi topilmadi."
  {
    id: 'jahon-tarixi-11-rare',
    subjectId: 'jahon-tarixi',
    subjectName: 'Jahon tarixi',
    grade: 11,
    title: 'Jahon tarixi (Yangi bosqich maxsus nashr)',
    authors: 'R. Farmonov va mualliflar jamoasi',
    year: 2018,
    publisher: 'Sharq nashriyoti',
    edition: 'Maxsus bosma nusxa',
    available: false, // NOT AVAILABLE ELECTRONICALLY -> triggers missing flow!
    chapters: [],
  },
  {
    id: 'huquq-9-archive',
    subjectId: 'huquq',
    subjectName: 'Davlat va huquq asoslari',
    grade: 9,
    title: 'Konstitutsiyaviy huquq asoslari (Eski dastur arxivi)',
    authors: 'O. Oqyuqov',
    year: 2017,
    publisher: 'Adolat nashriyoti',
    edition: 'Arxiv nashri',
    available: false, // NOT AVAILABLE
    chapters: [],
  },
];
