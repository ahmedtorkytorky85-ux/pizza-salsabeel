import { MenuCategory, MenuItem, RestaurantInfo } from '../types/menu';

export const DEFAULT_RESTAURANT_INFO: RestaurantInfo = {
  name: 'بيتزا سلسبيل',
  tagline: 'نحن لا نرضى إلا بالأفضل',
  deliveryPhones: ['01094450011', '01159001520'],
  whatsappNumber: '201094450011',
  address: 'إيتاي البارود - شارع الجمهورية',
  workingHours: 'خدمة التوصيل والدليفري متاحة يومياً',
  announcement: '★ بيتزا سلسبيل ★ نحن لا نرضى إلا بالأفضل - خدمة توصيل سريعة: 01094450011 - 01159001520'
};

export const DEFAULT_CATEGORIES: MenuCategory[] = [
  {
    id: 'pizza',
    name: 'بيتزا إيطالي',
    icon: '🍕',
    subtitle: 'عجينة إيطالية هشة مع جبنة موتزاريلا طبيعية وصلصة خاصة',
    sizeLabels: ['صغير', 'وسط', 'كبير']
  },
  {
    id: 'savory-pies',
    name: 'فطاير حادق',
    icon: '🥟',
    subtitle: 'فطاير بلدي مورقة بالسمن البلدي والحشوات الغنية',
    sizeLabels: ['وسط', 'كبير', 'صاروخ']
  },
  {
    id: 'crepes',
    name: 'كريب | كونو',
    icon: '🌯',
    subtitle: 'كريب كرسبي فرنسي أو كونو مقرمش محشو بأجود أنواع الجبن واللحوم',
    sizeLabels: ['كريب', 'كونو']
  },
  {
    id: 'pasta',
    name: 'مكرونات',
    icon: '🍝',
    subtitle: 'مكرونة شهية بالصلصة الحمراء أو الوايت صوص والموتزاريلا',
    sizeLabels: ['وسط', 'كبير']
  },
  {
    id: 'sandwiches',
    name: 'سندوتشات',
    icon: '🥪',
    subtitle: 'سندوتشات طازجة محضرة بأعلى جودة بالعيش الفينو أو السوري',
    sizeLabels: ['فينو', 'سوري']
  },
  {
    id: 'sweet-pies',
    name: 'فطاير حلو',
    icon: '🥧',
    subtitle: 'فطاير حلوة غرقانة سمنة بلدي وقشطة وعسل ومكسرات وشيكولاتة',
    sizeLabels: ['وسط', 'كبير']
  },
  {
    id: 'sweet-crepes',
    name: 'كريب حلو',
    icon: '🥞',
    subtitle: 'كريب نوتيلا غرقان شوكولاتة وفواكه ومكسرات',
    sizeLabels: ['السعر']
  },
  {
    id: 'sides',
    name: 'السلطات والإضافات',
    icon: '🍟',
    subtitle: 'بطاطس مقرمشة وصوصات لذيذة وإضافات دبل لطلبك',
    sizeLabels: ['السعر']
  },
  {
    id: 'hawawshi',
    name: 'حواوشي إيطالي',
    icon: '🫓',
    subtitle: 'حواوشي إيطالي طازج ومقرمش (ساده أو بالموتزاريلا)',
    sizeLabels: ['ساده', 'موتزاريلا']
  },
  {
    id: 'calzone',
    name: 'كالزوني إيطالي',
    icon: '🥐',
    subtitle: 'كالزوني إيطالي محشو ومخبوز على الحجر بجميع الأنواع',
    sizeLabels: ['السعر']
  },
  {
    id: 'juices',
    name: 'عصائر و آيس كريم',
    icon: '🥤',
    subtitle: 'مشروبات ساخنة وعصائر طبيعية فريش وآيس كريم وحلويات',
    sizeLabels: ['السعر']
  }
];

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // ================= 1. بيتزا إيطالي (صغير / وسط / كبير) =================
  {
    id: 'p-1',
    categoryId: 'pizza',
    name: 'بيتزا مارجريتا',
    description: 'صلصة طماطم إيطالية متبلة، جبنة موتزاريلا، ريحان وزيت زيتون بكر',
    prices: [
      { label: 'صغير', price: 85 },
      { label: 'وسط', price: 105 },
      { label: 'كبير', price: 135 }
    ],
    tags: ['popular']
  },
  {
    id: 'p-2',
    categoryId: 'pizza',
    name: 'بيتزا مشكل جبن',
    description: 'مزيج فاخر من الموتزاريلا، الرومي المعتق، الشيدر، والكيري اللذيذة',
    prices: [
      { label: 'صغير', price: 90 },
      { label: 'وسط', price: 115 },
      { label: 'كبير', price: 155 }
    ],
    tags: ['popular']
  },
  {
    id: 'p-3',
    categoryId: 'pizza',
    name: 'بيتزا سجق',
    description: 'قطع سجق بلدي شرقي متبل بخلطة التوابل السرية، فلفل، زيتون وموتزاريلا',
    prices: [
      { label: 'صغير', price: 95 },
      { label: 'وسط', price: 115 },
      { label: 'كبير', price: 155 }
    ]
  },
  {
    id: 'p-4',
    categoryId: 'pizza',
    name: 'بيتزا مفروم',
    description: 'لحم مفروم بلدي معصج مع بصل وطماطم، بهارات شرقية وموتزاريلا',
    prices: [
      { label: 'صغير', price: 95 },
      { label: 'وسط', price: 115 },
      { label: 'كبير', price: 155 }
    ]
  },
  {
    id: 'p-5',
    categoryId: 'pizza',
    name: 'بيتزا سوسيس',
    description: 'شرائح هوت دوج وسوسيس ممتازة، فلفل أخضر، زيتون أسود وموتزاريلا',
    prices: [
      { label: 'صغير', price: 95 },
      { label: 'وسط', price: 115 },
      { label: 'كبير', price: 155 }
    ]
  },
  {
    id: 'p-6',
    categoryId: 'pizza',
    name: 'بيتزا بسطرمة',
    description: 'قطع بسطرمة بلدي فاخرة مع طماطم وفلفل رومي وجبنة موتزاريلا غنية',
    prices: [
      { label: 'صغير', price: 100 },
      { label: 'وسط', price: 120 },
      { label: 'كبير', price: 170 }
    ],
    tags: ['popular']
  },
  {
    id: 'p-7',
    categoryId: 'pizza',
    name: 'بيتزا مشكل لحوم',
    description: 'تشكيلة ملوكية من السجق، المفروم، البسطرمة، والسوسيس مع صلصة البيتزا',
    prices: [
      { label: 'صغير', price: 95 },
      { label: 'وسط', price: 115 },
      { label: 'كبير', price: 165 }
    ],
    tags: ['popular']
  },
  {
    id: 'p-8',
    categoryId: 'pizza',
    name: 'بيتزا مشروم',
    description: 'فطر مشروم طازج مع شرائح الزيتون والفلفل وصلصة البيتزا الغنية',
    prices: [
      { label: 'صغير', price: 90 },
      { label: 'وسط', price: 115 },
      { label: 'كبير', price: 155 }
    ]
  },
  {
    id: 'p-9',
    categoryId: 'pizza',
    name: 'بيتزا تونة قطع',
    description: 'تونة قطع عالية الجودة مع البصل المفروم والليمون والفلفل والموتزاريلا',
    prices: [
      { label: 'صغير', price: 100 },
      { label: 'وسط', price: 120 },
      { label: 'كبير', price: 170 }
    ]
  },
  {
    id: 'p-10',
    categoryId: 'pizza',
    name: 'بيتزا جمبري',
    description: 'حبات الجمبري البلدي الطازج مع ثوم خفيف وفلفل ألوان وصلصة البيتزا',
    prices: [
      { label: 'صغير', price: 190 },
      { label: 'وسط', price: 260 },
      { label: 'كبير', price: 310 }
    ],
    tags: ['special']
  },
  {
    id: 'p-11',
    categoryId: 'pizza',
    name: 'بيتزا سي فود',
    description: 'تشكيلة بحرية مميزة: جمبري، سبيط، وكاليماري مع جبنة موتزاريلا وتوابل البحر',
    prices: [
      { label: 'صغير', price: 200 },
      { label: 'وسط', price: 270 },
      { label: 'كبير', price: 310 }
    ],
    tags: ['special']
  },
  {
    id: 'p-12',
    categoryId: 'pizza',
    name: 'بيتزا فراخ',
    description: 'صدور فراخ متبلة مشوية مع صوص البيتزا الإيطالي والفلفل والموتزاريلا',
    prices: [
      { label: 'صغير', price: 100 },
      { label: 'وسط', price: 120 },
      { label: 'كبير', price: 170 }
    ]
  },
  {
    id: 'p-13',
    categoryId: 'pizza',
    name: 'بيتزا تشيكن فاهيتا',
    description: 'شاورما فاهيتا فراخ متبلة على الطريقة المكسيكية مع بصل وفلفل ألوان',
    prices: [
      { label: 'صغير', price: 95 },
      { label: 'وسط', price: 115 },
      { label: 'كبير', price: 165 }
    ],
    tags: ['spicy']
  },
  {
    id: 'p-14',
    categoryId: 'pizza',
    name: 'بيتزا سوبر سوبريم',
    description: 'سجق، لحم مفروم، مشروم، فلفل رومي، زيتون أسود وموتزاريلا إيطالية مضاعفة',
    prices: [
      { label: 'صغير', price: 100 },
      { label: 'وسط', price: 120 },
      { label: 'كبير', price: 170 }
    ],
    tags: ['popular']
  },
  {
    id: 'p-15',
    categoryId: 'pizza',
    name: 'بيتزا ميكس فراخ',
    description: 'فراخ مشوية + استربس كرانشي + شاورما فراخ مع موتزاريلا وصوص رانش',
    prices: [
      { label: 'صغير', price: 110 },
      { label: 'وسط', price: 130 },
      { label: 'كبير', price: 190 }
    ],
    tags: ['popular']
  },
  {
    id: 'p-16',
    categoryId: 'pizza',
    name: 'بيتزا سلسبيل',
    description: 'سبيشال المطعم: ميكس لحوم ودجاج مع خضروات وجبنة موتزاريلا مضاعفة',
    prices: [
      { label: 'صغير', price: 110 },
      { label: 'وسط', price: 130 },
      { label: 'كبير', price: 190 }
    ],
    tags: ['special', 'popular']
  },
  {
    id: 'p-combo-1',
    categoryId: 'pizza',
    name: 'بيتزا مشكل جبن + نص بسطرمه',
    description: 'نصف بيتزا مشكل جبن غنية ونصف بيتزا بسطرمة بلدي مع جبنة موتزاريلا',
    prices: [
      { label: 'صغير', price: 95 },
      { label: 'وسط', price: 115 },
      { label: 'كبير', price: 160 }
    ],
    tags: ['popular', 'combo', 'special']
  },
  {
    id: 'p-combo-2',
    categoryId: 'pizza',
    name: 'بيتزا نص مشكل لحوم + نص مشكل جبن',
    description: 'نصف بيتزا مشكل لحوم بلدي ونصف بيتزا مشكل جبن فاخرة مع جبنة موتزاريلا',
    prices: [
      { label: 'صغير', price: 95 },
      { label: 'وسط', price: 115 },
      { label: 'كبير', price: 160 }
    ],
    tags: ['popular', 'combo', 'special']
  },
  {
    id: 'p-combo-3',
    categoryId: 'pizza',
    name: 'بيتزا نص بسطرمه + نص فراخ',
    description: 'نصف بيتزا قطع بسطرمة بلدي ونصف بيتزا صدور فراخ متبلة مع جبنة موتزاريلا',
    prices: [
      { label: 'صغير', price: 100 },
      { label: 'وسط', price: 120 },
      { label: 'كبير', price: 170 }
    ],
    tags: ['popular', 'combo', 'special']
  },
  {
    id: 'p-17',
    categoryId: 'pizza',
    name: 'حشو أطراف',
    description: 'إضافة حشو أطراف عجينة البيتزا بالجبنة الموتزاريلا أو الكيري السايحة',
    prices: [
      { label: 'صغير', price: 35 },
      { label: 'وسط', price: 45 },
      { label: 'كبير', price: 55 }
    ]
  },

  // ================= 2. فطائر حادق (وسط / كبير / صاروخ) =================
  {
    id: 'f-1',
    categoryId: 'savory-pies',
    name: 'فطيره بسطرمه',
    description: 'بسطرمة بلدي منتقاة بعناية مع جبنة رومي معتقة وموتزاريلا وطماطم',
    prices: [
      { label: 'وسط', price: 135 },
      { label: 'كبير', price: 235 },
      { label: 'صاروخ', price: 110 }
    ],
    tags: ['popular']
  },
  {
    id: 'f-2',
    categoryId: 'savory-pies',
    name: 'فطيره سجق',
    description: 'سجق بلدي شرقي متبل مع جبنة رومي وموتزاريلا وخضروات طازجة',
    prices: [
      { label: 'وسط', price: 135 },
      { label: 'كبير', price: 195 },
      { label: 'صاروخ', price: 105 }
    ]
  },
  {
    id: 'f-3',
    categoryId: 'savory-pies',
    name: 'فطيره صيامي',
    description: 'فطير نباتي خفيف بالخضار المشكل والزيتون والمشروم بدون أي مشتقات حيوانية',
    prices: [
      { label: 'وسط', price: 135 },
      { label: 'كبير', price: 195 },
      { label: 'صاروخ', price: 90 }
    ],
    tags: ['vegan']
  },
  {
    id: 'f-4',
    categoryId: 'savory-pies',
    name: 'فطيرة جبنة رومي',
    description: 'فطير بلدي مورق بحشو الجبنة الرومي المصرية الأصيلة مع الطماطم والفلفل والزيتون',
    prices: [
      { label: 'وسط', price: 125 },
      { label: 'كبير', price: 175 },
      { label: 'صاروخ', price: 85 }
    ]
  },
  {
    id: 'f-5',
    categoryId: 'savory-pies',
    name: 'فطيرة مشكل جبن',
    description: 'رومي، شيدر، موتزاريلا، كيري مع خلطة الخضار اللذيذة والسمسم وحبة البركة',
    prices: [
      { label: 'وسط', price: 135 },
      { label: 'كبير', price: 185 },
      { label: 'صاروخ', price: 105 }
    ],
    tags: ['popular']
  },
  {
    id: 'f-new-1',
    categoryId: 'savory-pies',
    name: 'فطيرة سجق كيري',
    description: 'سجق بلدي شرقي مع ميكس جبنة كيري كريمية غنية وموتزاريلا وفلفل ألوان',
    prices: [
      { label: 'وسط', price: 155 },
      { label: 'كبير', price: 215 },
      { label: 'صاروخ', price: 125 }
    ],
    tags: ['popular', 'special']
  },
  {
    id: 'f-6',
    categoryId: 'savory-pies',
    name: 'فطيرة مفروم',
    description: 'لحم بلدي مفروم معصج بالبهارات الشرقية والبصل والجبن',
    prices: [
      { label: 'وسط', price: 135 },
      { label: 'كبير', price: 195 },
      { label: 'صاروخ', price: 105 }
    ]
  },
  {
    id: 'f-7',
    categoryId: 'savory-pies',
    name: 'فطيرة هوت دوج',
    description: 'قطع هوت دوج فاخرة مع جبنة رومي وموتزاريلا وفلفل ألوان',
    prices: [
      { label: 'وسط', price: 125 },
      { label: 'كبير', price: 190 },
      { label: 'صاروخ', price: 105 }
    ]
  },
  {
    id: 'f-8',
    categoryId: 'savory-pies',
    name: 'فطيرة مشكل لحوم',
    description: 'مزيج ملوكي من السجق واللحم المفروم والبسطرمة والسوسيس مع ميكس أجبان',
    prices: [
      { label: 'وسط', price: 145 },
      { label: 'كبير', price: 225 },
      { label: 'صاروخ', price: 110 }
    ],
    tags: ['popular']
  },
  {
    id: 'f-9',
    categoryId: 'savory-pies',
    name: 'فطيرة فراخ',
    description: 'قطع صدور دجاج متبلة مع فلفل ألوان وطماطم وجبنة موتزاريلا ورومي',
    prices: [
      { label: 'وسط', price: 145 },
      { label: 'كبير', price: 225 },
      { label: 'صاروخ', price: 110 }
    ]
  },
  {
    id: 'f-new-2',
    categoryId: 'savory-pies',
    name: 'فطيرة بسطرمة كيري',
    description: 'قطع بسطرمة بلدي مع جبنة كيري كريمية فاخرة وموتزاريلا وش ملوكي',
    prices: [
      { label: 'وسط', price: 165 },
      { label: 'كبير', price: 255 },
      { label: 'صاروخ', price: 130 }
    ],
    tags: ['popular', 'special']
  },
  {
    id: 'f-10',
    categoryId: 'savory-pies',
    name: 'فطيرة سوبر سوبريم',
    description: 'تشكيلة غنية تجمع كل النكهات: لحوم، بسطرمة، مشروم، خضار وجبن دبل',
    prices: [
      { label: 'وسط', price: 145 },
      { label: 'كبير', price: 225 },
      { label: 'صاروخ', price: 110 }
    ],
    tags: ['popular']
  },
  {
    id: 'f-11',
    categoryId: 'savory-pies',
    name: 'فطيرة ميكس فراخ',
    description: 'شاورما دجاج، بانيه كرسبي، واستربس مع ميكس أجبان وزيتون',
    prices: [
      { label: 'وسط', price: 155 },
      { label: 'كبير', price: 235 },
      { label: 'صاروخ', price: 115 }
    ],
    tags: ['popular']
  },
  {
    id: 'f-12',
    categoryId: 'savory-pies',
    name: 'فطيرة تونة',
    description: 'تونة قطع مفتتة مع فلفل وزيتون وليمون وجبنة رومي خفيفة',
    prices: [
      { label: 'وسط', price: 145 },
      { label: 'كبير', price: 225 },
      { label: 'صاروخ', price: 110 }
    ]
  },
  {
    id: 'f-13',
    categoryId: 'savory-pies',
    name: 'فطيرة مشروم',
    description: 'حبات المشروم الطازجة مع الفلفل الألوان وميكس جبنة سايحة',
    prices: [
      { label: 'وسط', price: 135 },
      { label: 'كبير', price: 200 },
      { label: 'صاروخ', price: 105 }
    ]
  },
  {
    id: 'f-14',
    categoryId: 'savory-pies',
    name: 'فطيرة جمبري',
    description: 'جمبري بلدي طازج مطهو بتتبيلة الثوم والبهارات مع جبنة موتزاريلا ورومي',
    prices: [
      { label: 'وسط', price: 270 },
      { label: 'كبير', price: 370 },
      { label: 'صاروخ', price: 220 }
    ],
    tags: ['special']
  },
  {
    id: 'f-15',
    categoryId: 'savory-pies',
    name: 'فطيرة سي فود',
    description: 'جمبري، سبيط، وكاليماري مع صوص خاص وخضار وميكس أجبان',
    prices: [
      { label: 'وسط', price: 270 },
      { label: 'كبير', price: 370 },
      { label: 'صاروخ', price: 270 }
    ],
    tags: ['special']
  },
  {
    id: 'f-16',
    categoryId: 'savory-pies',
    name: 'فطيرة سلسبيل',
    description: 'سبيشال الفطاطري: طبقتين حشو لحوم مشكلة ودجاج مع بسطرمة وأجبان وش ملوكي',
    prices: [
      { label: 'وسط', price: 155 },
      { label: 'كبير', price: 235 },
      { label: 'صاروخ', price: 115 }
    ],
    tags: ['special', 'popular']
  },
  {
    id: 'f-combo-1',
    categoryId: 'savory-pies',
    name: 'فطيره نص مشكل جبن + نص مشكل لحوم',
    description: 'نصف فطيرة مشكل جبن ونصف فطيرة مشكل لحوم بلدي مورقة بالسمن البلدي',
    prices: [
      { label: 'وسط', price: 145 },
      { label: 'كبير', price: 225 },
      { label: 'صاروخ', price: 110 }
    ],
    tags: ['popular', 'combo', 'special']
  },

  // ================= 3. كريب | كونو =================
  {
    id: 'cr-1',
    categoryId: 'crepes',
    name: 'كريب موتزاريلا',
    description: 'كريب أو كونو مقرمش محشو بكمية وفيرة من الجبنة الموتزاريلا السايحة مع خضار وصصوصات',
    prices: [
      { label: 'كريب', price: 65 },
      { label: 'كونو', price: 75 }
    ]
  },
  {
    id: 'cr-2',
    categoryId: 'crepes',
    name: 'كريب مشكل جبن',
    description: 'موتزاريلا، رومي، شيدر، كيري مع بطاطس صوابع وكاتشب ومايونيز',
    prices: [
      { label: 'كريب', price: 85 },
      { label: 'كونو', price: 95 }
    ],
    tags: ['popular']
  },
  {
    id: 'cr-3',
    categoryId: 'crepes',
    name: 'كريب بطاطس',
    description: 'أصابع بطاطس فارم فريتس مقرمشة مع توابل الكريب الخاصة والموتزاريلا والمايونيز',
    prices: [
      { label: 'كريب', price: 65 },
      { label: 'كونو', price: 75 }
    ]
  },
  {
    id: 'cr-4',
    categoryId: 'crepes',
    name: 'كريب برجر',
    description: 'شريحة برجر لحم بقري مشوية مع خس، طماطم، صوص جبنة شيدر وموتزاريلا',
    prices: [
      { label: 'كريب', price: 90 },
      { label: 'كونو', price: 100 }
    ]
  },
  {
    id: 'cr-5',
    categoryId: 'crepes',
    name: 'كريب سجق',
    description: 'سجق بلدي شرقي محمر ومتبل مع خضار وصوصات كرسبي وموتزاريلا',
    prices: [
      { label: 'كريب', price: 90 },
      { label: 'كونو', price: 100 }
    ]
  },
  {
    id: 'cr-6',
    categoryId: 'crepes',
    name: 'كريب مفروم',
    description: 'لحم مفروم بلدي معصج مع صوص جبنة وموتزاريلا وخضار مقرمش',
    prices: [
      { label: 'كريب', price: 90 },
      { label: 'كونو', price: 100 }
    ]
  },
  {
    id: 'cr-7',
    categoryId: 'crepes',
    name: 'كريب سوسيس',
    description: 'قطع هوت دوج وسوسيس ممتازة مع خردل ومايونيز وجبنة سايحة',
    prices: [
      { label: 'كريب', price: 90 },
      { label: 'كونو', price: 100 }
    ]
  },
  {
    id: 'cr-8',
    categoryId: 'crepes',
    name: 'كريب بسطرمة',
    description: 'بسطرمة بلدي مع جبنة رومي وموتزاريلا وزيتون وطماطم',
    prices: [
      { label: 'كريب', price: 95 },
      { label: 'كونو', price: 105 }
    ]
  },
  {
    id: 'cr-9',
    categoryId: 'crepes',
    name: 'كريب ميكس لحوم',
    description: 'سجق + لحم مفروم + بسطرمة + سوسيس مع موتزاريلا مضاعفة وصوص الباربكيو',
    prices: [
      { label: 'كريب', price: 105 },
      { label: 'كونو', price: 115 }
    ],
    tags: ['popular']
  },
  {
    id: 'cr-10',
    categoryId: 'crepes',
    name: 'كريب كفتة',
    description: 'أصابع كفتة لحم مشوية على الفحم مع طحينة وخضار وموتزاريلا',
    prices: [
      { label: 'كريب', price: 105 },
      { label: 'كونو', price: 115 }
    ]
  },
  {
    id: 'cr-11',
    categoryId: 'crepes',
    name: 'كريب فراخ',
    description: 'شاورما صدور دجاج مشوية ومتبلة مع ثومية وموتزاريلا وخيار مخلل',
    prices: [
      { label: 'كريب', price: 105 },
      { label: 'كونو', price: 115 }
    ]
  },
  {
    id: 'cr-12',
    categoryId: 'crepes',
    name: 'كريب استربس',
    description: 'أصابع صدور دجاج استربس مقرمشة حارة أو عادية مع صوص الشيدر والرانش',
    prices: [
      { label: 'كريب', price: 105 },
      { label: 'كونو', price: 115 }
    ],
    tags: ['popular']
  },
  {
    id: 'cr-13',
    categoryId: 'crepes',
    name: 'كريب بانية',
    description: 'قطع دجاج بانيه مقلي ذهبي مقرمش مع بطاطس وصوص مايونيز وكاتشب',
    prices: [
      { label: 'كريب', price: 85 },
      { label: 'كونو', price: 95 }
    ]
  },
  {
    id: 'cr-14',
    categoryId: 'crepes',
    name: 'كريب فاهيتا فراخ',
    description: 'شرائح دجاج فاهيتا مع فلفل ألوان وبصل وتوابل مكسيكية مع موتزاريلا',
    prices: [
      { label: 'كريب', price: 105 },
      { label: 'كونو', price: 115 }
    ]
  },
  {
    id: 'cr-15',
    categoryId: 'crepes',
    name: 'كريب سوبر كرانشي',
    description: 'دجاج كرانشي شديد القرمشة مع صوص جبنة وصوص كوكتيل وموتزاريلا غنية',
    prices: [
      { label: 'كريب', price: 105 },
      { label: 'كونو', price: 115 }
    ],
    tags: ['popular', 'spicy']
  },
  {
    id: 'cr-16',
    categoryId: 'crepes',
    name: 'كريب تشيكن مكسيكانو',
    description: 'دجاج متبل بخلطة مكسيكانو الحارة مع فلفل هالبينو وجبن شيدر وموتزاريلا',
    prices: [
      { label: 'كريب', price: 95 },
      { label: 'كونو', price: 105 }
    ],
    tags: ['spicy']
  },
  {
    id: 'cr-17',
    categoryId: 'crepes',
    name: 'كريب ميكس فراخ',
    description: 'مزيج فاخر من البانيه والاستربس والشاورما مع صوص رانش وموتزاريلا',
    prices: [
      { label: 'كريب', price: 115 },
      { label: 'كونو', price: 125 }
    ],
    tags: ['popular']
  },
  {
    id: 'cr-18',
    categoryId: 'crepes',
    name: 'كريب كوردن بلو',
    description: 'رولات دجاج كوردن بلو محشوة بالجبن والبيف المدخن مع بطاطس وموتزاريلا',
    prices: [
      { label: 'كريب', price: 105 },
      { label: 'كونو', price: 115 }
    ]
  },
  {
    id: 'cr-19',
    categoryId: 'crepes',
    name: 'كريب شيش طاووق',
    description: 'شيش طاووق فراخ مشوي ومتبل بخلطة الزبادي والبهارات مع فلفل ألوان',
    prices: [
      { label: 'كريب', price: 105 },
      { label: 'كونو', price: 115 }
    ]
  },
  {
    id: 'cr-20',
    categoryId: 'crepes',
    name: 'كريب تونة',
    description: 'تونة قطع فاخرة مع بصل خفيف وفلفل وليمون وجبنة موتزاريلا',
    prices: [
      { label: 'كريب', price: 110 },
      { label: 'كونو', price: 120 }
    ]
  },
  {
    id: 'cr-21',
    categoryId: 'crepes',
    name: 'كريب جمبري',
    description: 'جمبري مقلي كرسبي أو مشوي مع صوص تارتار وموتزاريلا سايحة',
    prices: [
      { label: 'كريب', price: 190 },
      { label: 'كونو', price: 200 }
    ]
  },
  {
    id: 'cr-22',
    categoryId: 'crepes',
    name: 'كريب سي فود',
    description: 'جمبري وسبيط وكابوريا مع صوصات بحرية وموتزاريلا مضاعفة',
    prices: [
      { label: 'كريب', price: 190 },
      { label: 'كونو', price: 200 }
    ]
  },
  {
    id: 'cr-23',
    categoryId: 'crepes',
    name: 'كريب تشيكن سلسبيل',
    description: 'سبيشال المحل: تشكيلة دجاج مقرمش ومشوي مع بسطرمة وصوصات خاصة وجبنة موتزاريلا دبل',
    prices: [
      { label: 'كريب', price: 135 },
      { label: 'كونو', price: 145 }
    ],
    tags: ['popular']
  },

  // ================= 4. مكرونات (وسط / كبير) =================
  {
    id: 'm-1',
    categoryId: 'pasta',
    name: 'مكرونة خضروات',
    description: 'مكرونة فرن بالخضار المشكل والصلصة الحمراء الغنية وزيت الزيتون والبهارات',
    prices: [
      { label: 'وسط', price: 40 },
      { label: 'كبير', price: 60 }
    ]
  },
  {
    id: 'm-2',
    categoryId: 'pasta',
    name: 'مكرونة مفروم',
    description: 'طاجن مكرونة باللحم البلدي المفروم المعصج وصلصة الطماطم والموتزاريلا',
    prices: [
      { label: 'وسط', price: 60 },
      { label: 'كبير', price: 80 }
    ],
    tags: ['popular']
  },
  {
    id: 'm-3',
    categoryId: 'pasta',
    name: 'مكرونة سجق',
    description: 'طاجن مكرونة بالسجق الشرقي البلدي مع فلفل حار وصلصة متبلة',
    prices: [
      { label: 'وسط', price: 60 },
      { label: 'كبير', price: 80 }
    ]
  },
  {
    id: 'm-4',
    categoryId: 'pasta',
    name: 'مكرونة بالكبدة',
    description: 'مكرونة فرن مع كبدة إسكندراني متبلة بالثوم والليمون والفلفل',
    prices: [
      { label: 'وسط', price: 60 },
      { label: 'كبير', price: 80 }
    ],
    tags: ['spicy']
  },
  {
    id: 'm-5',
    categoryId: 'pasta',
    name: 'مكرونة هوت دوج',
    description: 'مكرونة بقطع الهوت دوج والزيتون وصوص الطماطم والجبنة الرومي',
    prices: [
      { label: 'وسط', price: 60 },
      { label: 'كبير', price: 80 }
    ]
  },
  {
    id: 'm-6',
    categoryId: 'pasta',
    name: 'مكرونة فراخ',
    description: 'طاجن مكرونة بقطع صدور الفراخ المشوية مع صوص أحمر وموتزاريلا',
    prices: [
      { label: 'وسط', price: 70 },
      { label: 'كبير', price: 90 }
    ]
  },
  {
    id: 'm-7',
    categoryId: 'pasta',
    name: 'مكرونة استربس',
    description: 'مكرونة مع قطع استربس دجاج مقرمشة وصوص جبنة شيدر وموتزاريلا',
    prices: [
      { label: 'وسط', price: 70 },
      { label: 'كبير', price: 90 }
    ]
  },
  {
    id: 'm-8',
    categoryId: 'pasta',
    name: 'مكرونة بانية',
    description: 'مكرونة فرن مع قطع بانيه ذهبي مقرمش وصلصة إيطالية وجبن',
    prices: [
      { label: 'وسط', price: 60 },
      { label: 'كبير', price: 80 }
    ]
  },
  {
    id: 'm-9',
    categoryId: 'pasta',
    name: 'مكرونة برجر',
    description: 'طاجن مكرونة بقطع برجر لحم مشوي وصوص الطماطم والموتزاريلا',
    prices: [
      { label: 'وسط', price: 60 },
      { label: 'كبير', price: 80 }
    ]
  },
  {
    id: 'm-10',
    categoryId: 'pasta',
    name: 'مكرونة ميكس فراخ',
    description: 'تشكيلة فراخ شاورما واستربس وبانيه مع وايت صوص أو صلصة حمراء وموتزاريلا',
    prices: [
      { label: 'وسط', price: 75 },
      { label: 'كبير', price: 95 }
    ],
    tags: ['popular']
  },
  {
    id: 'm-11',
    categoryId: 'pasta',
    name: 'مكرونة مشكل لحوم',
    description: 'سجق، مفروم، بسطرمة وسوسيس مع صوص طماطم وموتزاريلا مضاعفة',
    prices: [
      { label: 'وسط', price: 70 },
      { label: 'كبير', price: 95 }
    ],
    tags: ['popular']
  },
  {
    id: 'm-12',
    categoryId: 'pasta',
    name: 'مكرونة مشكل جبن',
    description: 'طاجن مكرونة غرقان بميكس الأجبان الأربعة مع الكريمة والموتزاريلا',
    prices: [
      { label: 'وسط', price: 60 },
      { label: 'كبير', price: 80 }
    ]
  },
  {
    id: 'm-13',
    categoryId: 'pasta',
    name: 'مكرونة بسطرمة',
    description: 'مكرونة بقطع البسطرمة والجبنة الرومي والموتزاريلا والفلفل',
    prices: [
      { label: 'وسط', price: 70 },
      { label: 'كبير', price: 90 }
    ]
  },
  {
    id: 'm-14',
    categoryId: 'pasta',
    name: 'مكرونة نجرسكو',
    description: 'النجرسكو الأصلية: مكرونة مع فراخ، مشروم، وايت صوص كريمي غني وموتزاريلا وش ذهبي',
    prices: [
      { label: 'وسط', price: 75 },
      { label: 'كبير', price: 95 }
    ],
    tags: ['popular']
  },
  {
    id: 'm-15',
    categoryId: 'pasta',
    name: 'مكرونة كفتة',
    description: 'طاجن مكرونة بكرات كفتة اللحم البلدي المشوية مع الصلصة والجبن',
    prices: [
      { label: 'وسط', price: 75 },
      { label: 'كبير', price: 95 }
    ]
  },
  {
    id: 'm-16',
    categoryId: 'pasta',
    name: 'مكرونة جمبري',
    description: 'مكرونة بالجمبري الطازج مع وايت صوص بالثوم والكريمة أو صلصة حمراء',
    prices: [
      { label: 'وسط', price: 145 },
      { label: 'كبير', price: 175 }
    ]
  },
  {
    id: 'm-17',
    categoryId: 'pasta',
    name: 'مكرونة سي فود',
    description: 'طاجن سي فود بحري: جمبري وسبيط وكابوريا مع وايت صوص وموتزاريلا',
    prices: [
      { label: 'وسط', price: 145 },
      { label: 'كبير', price: 175 }
    ]
  },
  {
    id: 'm-18',
    categoryId: 'pasta',
    name: 'مكرونة مشروم',
    description: 'مكرونة بقطع المشروم الطازجة مع الكريمة والجبنة الموتزاريلا',
    prices: [
      { label: 'وسط', price: 60 },
      { label: 'كبير', price: 80 }
    ]
  },
  {
    id: 'm-19',
    categoryId: 'pasta',
    name: 'مكرونة تونة',
    description: 'طاجن مكرونة بتونة قطع فاخرة مع صلصة الطماطم الإيطالية والفلفل الرومي والزيتون',
    prices: [
      { label: 'وسط', price: 90 },
      { label: 'كبير', price: 110 }
    ]
  },

  // ================= 5. سندوتشات (فينو / سوري) =================
  {
    id: 's-1',
    categoryId: 'sandwiches',
    name: 'سندوتش برجر',
    description: 'برجر لحم بقري مشوي مع خس وطماطم وخيار مخلل وصوص البرجر اللذيذ',
    prices: [
      { label: 'فينو', price: 25 },
      { label: 'سوري', price: 55 }
    ]
  },
  {
    id: 's-2',
    categoryId: 'sandwiches',
    name: 'سندوتش بطاطس',
    description: 'بطاطس مقلية ذهبية مقرمشة مع كاتشب ومايونيز وتوابل',
    prices: [
      { label: 'فينو', price: 20 },
      { label: 'سوري', price: 30 }
    ]
  },
  {
    id: 's-3',
    categoryId: 'sandwiches',
    name: 'سندوتش فراخ بانية',
    description: 'قطعة صدور دجاج بانيه كرسبي مقلية مع مايونيز وخس',
    prices: [
      { label: 'فينو', price: 25 },
      { label: 'سوري', price: 55 }
    ]
  },
  {
    id: 's-4',
    categoryId: 'sandwiches',
    name: 'سندوتش جبنة مقلية',
    description: 'جبنة رومي أو شيدر مقلية ذهبية سايحة مع طماطم وخيار',
    prices: [
      { label: 'فينو', price: 25 },
      { label: 'سوري', price: 40 }
    ]
  },
  {
    id: 's-5',
    categoryId: 'sandwiches',
    name: 'سندوتش كبدة',
    description: 'كبدة إسكندراني بلدي متبلة بالفلفل الحار والليمون والكمون',
    prices: [
      { label: 'فينو', price: 20 },
      { label: 'سوري', price: 35 }
    ],
    tags: ['spicy']
  },
  {
    id: 's-6',
    categoryId: 'sandwiches',
    name: 'سندوتش برجر جبنه',
    description: 'برجر لحم بقري مع شريحة جبنة شيدر أمريكية سايحة وصوص خاص',
    prices: [
      { label: 'فينو', price: 30 },
      { label: 'سوري', price: 65 }
    ]
  },
  {
    id: 's-7',
    categoryId: 'sandwiches',
    name: 'سندوتش سوسيس',
    description: 'سوسيس مشوح مع فلفل ألوان وبصل وتوابل ومستردا',
    prices: [
      { label: 'فينو', price: 25 },
      { label: 'سوري', price: 55 }
    ]
  },
  {
    id: 's-8',
    categoryId: 'sandwiches',
    name: 'سندوتش برجر بيض',
    description: 'برجر لحم مع بيض مقلي طازج وخضار وصوصات',
    prices: [
      { label: 'فينو', price: 30 }
    ]
  },
  {
    id: 's-9',
    categoryId: 'sandwiches',
    name: 'سندوتش كفته',
    description: 'كفتة لحم بلدي مشوية على السيخ مع سلطة طحينة وبقدونس',
    prices: [
      { label: 'فينو', price: 30 },
      { label: 'سوري', price: 65 }
    ]
  },
  {
    id: 's-10',
    categoryId: 'sandwiches',
    name: 'سندوتش سجق',
    description: 'سجق بلدي شرقي بالصلصة والفلفل والبصل والتوابل السرية',
    prices: [
      { label: 'فينو', price: 30 },
      { label: 'سوري', price: 60 }
    ]
  },
  {
    id: 's-11',
    categoryId: 'sandwiches',
    name: 'سندوتش شاورمة فراخ',
    description: 'شاورما دجاج متبلة على السيخ مع تومية وخيار مخلل',
    prices: [
      { label: 'فينو', price: 35 },
      { label: 'سوري', price: 65 }
    ],
    tags: ['popular']
  },
  {
    id: 's-12',
    categoryId: 'sandwiches',
    name: 'سندوتش شيش طاووق',
    description: 'شيش طاووق فراخ مشوي ومتبل مع فلفل ألوان وتومية',
    prices: [
      { label: 'فينو', price: 35 },
      { label: 'سوري', price: 65 }
    ]
  },
  {
    id: 's-13',
    categoryId: 'sandwiches',
    name: 'سندوتش زنجر',
    description: 'صدر دجاج زنجر حار ومقرمش جداً مع صوص مايونيز وخس وشيدر',
    prices: [
      { label: 'فينو', price: 35 },
      { label: 'سوري', price: 65 }
    ],
    tags: ['spicy', 'popular']
  },
  {
    id: 's-14',
    categoryId: 'sandwiches',
    name: 'سندوتش برجر بيض جبنه',
    description: 'ميكس السوبر: برجر لحم + بيض مقلي + جبنة شيدر سايحة',
    prices: [
      { label: 'فينو', price: 40 }
    ]
  },
  {
    id: 's-15',
    categoryId: 'sandwiches',
    name: 'سندوتش بيض بالبسطرمة',
    description: 'بيض بلدي مخفوق ومقلي مع قطع البسطرمة البلدي بالزبدة',
    prices: [
      { label: 'فينو', price: 40 }
    ]
  },
  {
    id: 's-16',
    categoryId: 'sandwiches',
    name: 'سندوتش فاهيتا فراخ',
    description: 'فاهيتا دجاج مع فلفل ألوان وبصل وصوص مكسيكي',
    prices: [
      { label: 'فينو', price: 40 },
      { label: 'سوري', price: 65 }
    ]
  },

  // ================= 6. فطيرة حلو (وسط / كبير) =================
  {
    id: 'sw-1',
    categoryId: 'sweet-pies',
    name: 'فطيرة سكر',
    description: 'فطير بلدي مورق بالسمن البلدي مرشوش بالسكر البودرة واللبن الدافئ',
    prices: [
      { label: 'وسط', price: 50 },
      { label: 'كبير', price: 80 }
    ]
  },
  {
    id: 'sw-2',
    categoryId: 'sweet-pies',
    name: 'فطيرة زبيب وجوزة الهند',
    description: 'فطير بالسكر واللبن محشو بالزبيب الفاخر وجوز الهند المبشور',
    prices: [
      { label: 'وسط', price: 70 },
      { label: 'كبير', price: 110 }
    ]
  },
  {
    id: 'sw-3',
    categoryId: 'sweet-pies',
    name: 'فطيرة كاستر',
    description: 'حشوة كاسترد فانيليا ناعمة وكريمية غنية بالسمن البلدي والسكر',
    prices: [
      { label: 'وسط', price: 60 },
      { label: 'كبير', price: 90 }
    ]
  },
  {
    id: 'sw-4',
    categoryId: 'sweet-pies',
    name: 'فطيرة بسبوسة',
    description: 'فطير بلدي محشو بقطع البسبوسة الشرقية الطرية مع القشطة والشربات',
    prices: [
      { label: 'وسط', price: 75 },
      { label: 'كبير', price: 110 }
    ]
  },
  {
    id: 'sw-5',
    categoryId: 'sweet-pies',
    name: 'فطيرة كنافة',
    description: 'فطير محشو بالكنافة المحمصة بالسمن البلدي والمكسرات',
    prices: [
      { label: 'وسط', price: 75 },
      { label: 'كبير', price: 110 }
    ]
  },
  {
    id: 'sw-6',
    categoryId: 'sweet-pies',
    name: 'فطيرة مكسرات',
    description: 'تشكيلة فاخرة من البندق، اللوز، الفستق، والكاجو مع السمن البلدي والعسل',
    prices: [
      { label: 'وسط', price: 80 },
      { label: 'كبير', price: 115 }
    ]
  },
  {
    id: 'sw-7',
    categoryId: 'sweet-pies',
    name: 'فطيرة قشطة وعسل',
    description: 'فطير بلدي ساخن غرقان بقشطة فلاحي طازجة وعسل نحل طبيعي',
    prices: [
      { label: 'وسط', price: 80 },
      { label: 'كبير', price: 115 }
    ],
    tags: ['popular']
  },
  {
    id: 'sw-8',
    categoryId: 'sweet-pies',
    name: 'فطيرة قشطة وعسل مكسرات',
    description: 'الميكس الفاخر: قشطة فلاحي + عسل نحل طبيعي + مكسرات مشكلة محمصة',
    prices: [
      { label: 'وسط', price: 105 },
      { label: 'كبير', price: 145 }
    ],
    tags: ['popular']
  },
  {
    id: 'sw-9',
    categoryId: 'sweet-pies',
    name: 'فطيرة شيكولاتة',
    description: 'غرقانة شيكولاتة نوتيلا أصلية سايحة مع سكر بودرة ولبن',
    prices: [
      { label: 'وسط', price: 95 },
      { label: 'كبير', price: 145 }
    ]
  },
  {
    id: 'sw-10',
    categoryId: 'sweet-pies',
    name: 'فطيرة شيكولاته موز',
    description: 'شيكولاتة نوتيلا غنية مع شرائح موز طازجة وسكر بودرة',
    prices: [
      { label: 'وسط', price: 105 },
      { label: 'كبير', price: 145 }
    ]
  },
  {
    id: 'sw-11',
    categoryId: 'sweet-pies',
    name: 'فطيرة شيكولاته مكسرات',
    description: 'شيكولاتة نوتيلا غنية مغطاة بحبات البندق واللوز والكاجو المحمص',
    prices: [
      { label: 'وسط', price: 105 },
      { label: 'كبير', price: 145 }
    ]
  },
  {
    id: 'sw-12',
    categoryId: 'sweet-pies',
    name: 'فطيرة ميكس شيكولاته',
    description: 'نصف نوتيلا دارك ونصف نوتيلا بيضاء مع صوص شوكولاتة كندر',
    prices: [
      { label: 'وسط', price: 110 },
      { label: 'كبير', price: 140 }
    ],
    tags: ['popular']
  },
  {
    id: 'sw-13',
    categoryId: 'sweet-pies',
    name: 'فطيرة حلو سلسبيل',
    description: 'سبيشال التحلية: قشطة + عسل + مكسرات + نوتيلا + بسبوسة + كاستر وش ملوكي',
    prices: [
      { label: 'وسط', price: 130 },
      { label: 'كبير', price: 180 }
    ],
    tags: ['special', 'popular']
  },

  // ================= 7. كريب حلو (كبير) =================
  {
    id: 'scr-1',
    categoryId: 'sweet-crepes',
    name: 'كريب شيكولاتة',
    description: 'كريب ساخن محشو بشوكولاتة نوتيلا فاخرة ومزين بصوص الشوكولاتة',
    prices: [
      { label: 'السعر', price: 65 }
    ]
  },
  {
    id: 'scr-2',
    categoryId: 'sweet-crepes',
    name: 'كريب شيكولاتة مكسرات',
    description: 'نوتيلا غنية مع تشكيلة من البندق واللوز والكاجو المحمص',
    prices: [
      { label: 'السعر', price: 75 }
    ]
  },
  {
    id: 'scr-3',
    categoryId: 'sweet-crepes',
    name: 'كريب شيكولاتة بالموز',
    description: 'قطع موز طازجة مع نوتيلا وصوص شوكولاتة وسكر بودرة',
    prices: [
      { label: 'السعر', price: 70 }
    ]
  },
  {
    id: 'scr-4',
    categoryId: 'sweet-crepes',
    name: 'كريب شيكولاتة بالفواكه',
    description: 'تشكيلة فواكه الموسم (موز، فراولة، كيوي) مع شيكولاتة نوتيلا',
    prices: [
      { label: 'السعر', price: 75 }
    ]
  },

  // ================= 8. السلطات والإضافات =================
  {
    id: 'sd-1',
    categoryId: 'sides',
    name: 'باكيت بطاطس فريش',
    description: 'بطاطس فارم فريتس مقلية مقرمشة مع خلطة توابل المطعم الخاصة',
    prices: [
      { label: 'وسط', price: 35 },
      { label: 'كبير', price: 40 }
    ]
  },
  {
    id: 'sd-2',
    categoryId: 'sides',
    name: 'سلطة كول سلو',
    description: 'كرنب وجزر طازج مبشور مع دريسنج مايونيز وعسل كريمي',
    prices: [
      { label: 'صغير', price: 20 },
      { label: 'وسط', price: 30 }
    ]
  },
  {
    id: 'sd-3',
    categoryId: 'sides',
    name: 'صوص باربيكيو',
    description: 'صوص باربيكيو مدخن أصلي',
    prices: [
      { label: 'صغير', price: 20 },
      { label: 'وسط', price: 30 }
    ]
  },
  {
    id: 'sd-4',
    categoryId: 'sides',
    name: 'صوص توميه',
    description: 'تومية سورية كريمية أصلية بالثوم وزيت الزيتون',
    prices: [
      { label: 'صغير', price: 20 },
      { label: 'وسط', price: 30 }
    ]
  },
  {
    id: 'sd-5',
    categoryId: 'sides',
    name: 'صوص رانش',
    description: 'صوص رانش أمريكي كريمي بالأعشاب',
    prices: [
      { label: 'صغير', price: 20 },
      { label: 'وسط', price: 30 }
    ]
  },
  {
    id: 'sd-6',
    categoryId: 'sides',
    name: 'إضافة جبنة',
    description: 'إكسترا جبنة موتزاريلا طبيعية مضاعفة لأي أوردر',
    prices: [
      { label: 'صغير', price: 20 },
      { label: 'وسط', price: 30 },
      { label: 'كبير', price: 40 }
    ]
  },
  {
    id: 'sd-7',
    categoryId: 'sides',
    name: 'إضافة أسماك',
    description: 'إكسترا جمبري وسبيط لأي طلب',
    prices: [
      { label: 'وسط', price: 45 },
      { label: 'كبير', price: 55 }
    ]
  },
  {
    id: 'sd-8',
    categoryId: 'sides',
    name: 'إضافة لحوم',
    description: 'إكسترا سجق أو مفروم أو بسطرمة أو فراخ لأي طلب',
    prices: [
      { label: 'وسط', price: 45 },
      { label: 'كبير', price: 55 }
    ]
  },

  // ================= 9. حواوشي إيطالي (ساده / موتزاريلا — خصم 20 جنيه في الساده) =================
  {
    id: 'hw-1',
    categoryId: 'hawawshi',
    name: 'حواوشي مفروم',
    description: 'حواوشي لحم مفروم بلدي متبل بالبهارات الشرقية (ساده أو بالموتزاريلا)',
    prices: [
      { label: 'ساده', price: 65 },
      { label: 'موتزاريلا', price: 85 }
    ],
    tags: ['popular']
  },
  {
    id: 'hw-2',
    categoryId: 'hawawshi',
    name: 'حواوشي سجق',
    description: 'حواوشي سجق بلدي شرقي متبل مع فلفل وزيتون (ساده أو بالموتزاريلا)',
    prices: [
      { label: 'ساده', price: 65 },
      { label: 'موتزاريلا', price: 85 }
    ]
  },
  {
    id: 'hw-3',
    categoryId: 'hawawshi',
    name: 'حواوشي فراخ',
    description: 'حواوشي صدور فراخ مشوية متبلة مع فلفل وتوابل (ساده أو بالموتزاريلا)',
    prices: [
      { label: 'ساده', price: 70 },
      { label: 'موتزاريلا', price: 90 }
    ]
  },
  {
    id: 'hw-4',
    categoryId: 'hawawshi',
    name: 'حواوشي سوسيس',
    description: 'حواوشي شرائح سوسيس وهوت دوج مع فلفل أخضر وزيتون (ساده أو بالموتزاريلا)',
    prices: [
      { label: 'ساده', price: 65 },
      { label: 'موتزاريلا', price: 85 }
    ]
  },
  {
    id: 'hw-5',
    categoryId: 'hawawshi',
    name: 'حواوشي مشكل لحوم',
    description: 'حواوشي سجق، مفروم، بسطرمة، وسوسيس (ساده أو بالموتزاريلا)',
    prices: [
      { label: 'ساده', price: 65 },
      { label: 'موتزاريلا', price: 85 }
    ],
    tags: ['popular']
  },
  {
    id: 'hw-6',
    categoryId: 'hawawshi',
    name: 'حواوشي ميكس فراخ',
    description: 'حواوشي فراخ مشوية واستربس وشاورما (ساده أو بالموتزاريلا)',
    prices: [
      { label: 'ساده', price: 80 },
      { label: 'موتزاريلا', price: 100 }
    ],
    tags: ['popular']
  },

  // ================= 10. كالزوني إيطالي =================
  {
    id: 'cz-2',
    categoryId: 'calzone',
    name: 'كالزوني مشكل جبن',
    description: 'كالزوني بحشو الموتزاريلا، الرومي المعتق، الشيدر، والكيري',
    prices: [{ label: 'السعر', price: 105 }],
    tags: ['popular']
  },
  {
    id: 'cz-3',
    categoryId: 'calzone',
    name: 'كالزوني سجق',
    description: 'كالزوني سجق بلدي شرقي متبل مع فلفل وزيتون وموتزاريلا',
    prices: [{ label: 'السعر', price: 105 }]
  },
  {
    id: 'cz-4',
    categoryId: 'calzone',
    name: 'كالزوني مفروم',
    description: 'كالزوني لحم مفروم بلدي معصج بالبهارات وموتزاريلا',
    prices: [{ label: 'السعر', price: 105 }]
  },
  {
    id: 'cz-5',
    categoryId: 'calzone',
    name: 'كالزوني سوسيس',
    description: 'كالزوني شرائح سوسيس وهوت دوج مع فلفل وزيتون وموتزاريلا',
    prices: [{ label: 'السعر', price: 105 }]
  },
  {
    id: 'cz-6',
    categoryId: 'calzone',
    name: 'كالزوني بسطرمة',
    description: 'كالزوني بسطرمة بلدي فاخرة مع طماطم وفلفل وموتزاريلا',
    prices: [{ label: 'السعر', price: 110 }],
    tags: ['popular']
  },
  {
    id: 'cz-7',
    categoryId: 'calzone',
    name: 'كالزوني مشكل لحوم',
    description: 'كالزوني سجق، مفروم، بسطرمة، وسوسيس مع موتزاريلا',
    prices: [{ label: 'السعر', price: 105 }],
    tags: ['popular']
  },
  {
    id: 'cz-8',
    categoryId: 'calzone',
    name: 'كالزوني مشروم',
    description: 'كالزوني مشروم طازج مع زيتون وفلفل وصلصة وموتزاريلا',
    prices: [{ label: 'السعر', price: 105 }]
  },
  {
    id: 'cz-9',
    categoryId: 'calzone',
    name: 'كالزوني تونة قطع',
    description: 'كالزوني تونة قطع مع بصل وفلفل وليمون وموتزاريلا',
    prices: [{ label: 'السعر', price: 110 }]
  },
  {
    id: 'cz-10',
    categoryId: 'calzone',
    name: 'كالزوني جمبري',
    description: 'كالزوني جمبري بلدي طازج مع فلفل ألوان وموتزاريلا',
    prices: [{ label: 'السعر', price: 200 }],
    tags: ['special']
  },
  {
    id: 'cz-11',
    categoryId: 'calzone',
    name: 'كالزوني سي فود',
    description: 'كالزوني تشكيلة بحرية جمبري وسبيط وكاليماري وموتزاريلا',
    prices: [{ label: 'السعر', price: 200 }],
    tags: ['special']
  },
  {
    id: 'cz-12',
    categoryId: 'calzone',
    name: 'كالزوني فراخ',
    description: 'كالزوني صدور فراخ مشوية متبلة مع فلفل وموتزاريلا',
    prices: [{ label: 'السعر', price: 110 }]
  },
  {
    id: 'cz-13',
    categoryId: 'calzone',
    name: 'كالزوني تشيكن فاهيتا',
    description: 'كالزوني شاورما فاهيتا فراخ مكسيكية مع فلفل ألوان وموتزاريلا',
    prices: [{ label: 'السعر', price: 105 }],
    tags: ['spicy']
  },
  {
    id: 'cz-14',
    categoryId: 'calzone',
    name: 'كالزوني سوبر سوبريم',
    description: 'كالزوني سجق ولحم مفروم ومشروم وزيتون وموتزاريلا',
    prices: [{ label: 'السعر', price: 110 }],
    tags: ['popular']
  },
  {
    id: 'cz-15',
    categoryId: 'calzone',
    name: 'كالزوني ميكس فراخ',
    description: 'كالزوني فراخ مشوية واستربس وشاورما مع موتزاريلا ورانش',
    prices: [{ label: 'السعر', price: 120 }],
    tags: ['popular']
  },
  {
    id: 'cz-16',
    categoryId: 'calzone',
    name: 'كالزوني سلسبيل',
    description: 'سبيشال المحل: ميكس لحوم ودجاج مع خضار وموتزاريلا دبل',
    prices: [{ label: 'السعر', price: 120 }],
    tags: ['special', 'popular']
  },

  // ================= 11. عصائر و آيس كريم (بالأسعار المعتمدة فقط) =================
  {
    id: 'j-1',
    categoryId: 'juices',
    name: 'قهوة',
    description: 'قهوة تركي مضبوطة على النار الهادئة',
    prices: [{ label: 'من', price: 20 }, { label: 'إلى', price: 25 }]
  },
  {
    id: 'j-2',
    categoryId: 'juices',
    name: 'قهوة اسبريسو',
    description: 'اسبريسو غني برغوة كريمية مركزة',
    prices: [{ label: 'السعر', price: 35 }]
  },
  {
    id: 'j-3',
    categoryId: 'juices',
    name: 'كابتشينو',
    description: 'كابتشينو ساخن بالرغوة الكثيفة',
    prices: [{ label: 'السعر', price: 45 }]
  },
  {
    id: 'j-4',
    categoryId: 'juices',
    name: 'كاكاو',
    description: 'مشروب كاكاو ساخن غني',
    prices: [{ label: 'السعر', price: 45 }]
  },
  {
    id: 'j-5',
    categoryId: 'juices',
    name: 'شاي بأنواعه',
    description: 'شاي أحمر أو أخضر أو بالنعناع حسب الطلب',
    prices: [{ label: 'السعر', price: 15 }]
  },
  {
    id: 'j-6',
    categoryId: 'juices',
    name: 'سحلب',
    description: 'سحلب ساخن بالقرفة والمكسرات',
    prices: [{ label: 'السعر', price: 45 }]
  },
  {
    id: 'j-7',
    categoryId: 'juices',
    name: 'شيكولاته ساخنة باللبن',
    description: 'هوت شوكليت كريمي بالحليب الطازج',
    prices: [{ label: 'السعر', price: 50 }]
  },
  {
    id: 'j-8',
    categoryId: 'juices',
    name: 'ميلك تشيك أي طعم',
    description: 'ميلك تشيك بارد بنكهات الشيكولاتة والفانيليا والفراولة والمانجو',
    prices: [{ label: 'السعر', price: 50 }]
  },
  {
    id: 'j-9',
    categoryId: 'juices',
    name: 'قصب . تمر . سوبيا . تفاح . عنب',
    description: 'مشروبات باردة ومنعشة طازجة يومياً',
    prices: [{ label: 'من', price: 10 }, { label: 'إلى', price: 15 }]
  },
  {
    id: 'j-10',
    categoryId: 'juices',
    name: 'خروب . دوم',
    description: 'مشروب خروب أو دوم طبيعي بارد ومنعش',
    prices: [{ label: 'من', price: 15 }, { label: 'إلى', price: 20 }]
  },
  {
    id: 'j-11',
    categoryId: 'juices',
    name: 'بوريو جميع الأنواع',
    description: 'سموزي وميلك تشيك بوريو بجميع النكهات',
    prices: [{ label: 'السعر', price: 50 }]
  },
  {
    id: 'j-12',
    categoryId: 'juices',
    name: 'كوكتيل آيس كريم',
    description: 'كوكتيل فواكه طازجة مع بولة آيس كريم',
    prices: [{ label: 'السعر', price: 40 }]
  },
  {
    id: 'j-13',
    categoryId: 'juices',
    name: 'مشروب طاقة',
    description: 'مشروب طاقة بارد مثلج',
    prices: [{ label: 'السعر', price: 50 }]
  },
  {
    id: 'j-14',
    categoryId: 'juices',
    name: 'هوت سيزر',
    description: 'مشروب هوت سيزر ساخن بالقرفة والتفاح',
    prices: [{ label: 'السعر', price: 50 }]
  },
  {
    id: 'j-17',
    categoryId: 'juices',
    name: 'زبادي خلاط',
    description: 'زبادي خلاط بالعسل أو الفواكه الطازجة',
    prices: [{ label: 'السعر', price: 50 }]
  },
  {
    id: 'j-18',
    categoryId: 'juices',
    name: 'بسكوته آيس كريم',
    description: 'بسكوته مقرمشة بالآيس كريم المنوع',
    prices: [{ label: 'من', price: 20 }, { label: 'إلى', price: 30 }]
  },
  {
    id: 'j-19',
    categoryId: 'juices',
    name: 'آيس كريم سوفت',
    description: 'آيس كريم سوفت كريمي ناعم',
    prices: [{ label: 'من', price: 20 }, { label: 'إلى', price: 30 }]
  },
  {
    id: 'j-20',
    categoryId: 'juices',
    name: 'آيس كريم هارد',
    description: 'بولات آيس كريم هارد بنكهات متنوعة',
    prices: [{ label: 'من', price: 20 }, { label: 'إلى', price: 30 }]
  },
  {
    id: 'j-21',
    categoryId: 'juices',
    name: '½ آيس كريم',
    description: 'نصف كيلو آيس كريم مشكل حسب اختيارك',
    prices: [{ label: 'السعر', price: 90 }]
  },
  {
    id: 'j-22',
    categoryId: 'juices',
    name: '1 ك آيس كريم',
    description: 'كيلو آيس كريم عائلي بنكهات متعددة',
    prices: [{ label: 'السعر', price: 180 }]
  },
  {
    id: 'j-23',
    categoryId: 'juices',
    name: 'مانجو',
    description: 'عصير مانجو طبيعي فريش 100%',
    prices: [{ label: 'من', price: 25 }, { label: 'إلى', price: 30 }]
  },
  {
    id: 'j-24',
    categoryId: 'juices',
    name: 'عصير ليمون',
    description: 'عصير ليمون فريش أو بالنعناع مثلج',
    prices: [{ label: 'السعر', price: 40 }]
  }
];
