import { Project, Service, PaymentMethod, ContactInfo } from './types';

export const CONTACT_INFO: ContactInfo = {
  email: import.meta.env.VITE_EMAIL || 'abwkreemiprahem@gmail.com',
  phone: import.meta.env.VITE_PHONE || '+201098765432',
  telegram: import.meta.env.VITE_TELEGRAM || 'https://t.me/consultant_tech',
  github: import.meta.env.VITE_GITHUB || 'https://github.com/tech-sovereign',
  linkedin: import.meta.env.VITE_LINKEDIN || 'https://linkedin.com/in/tech-sovereign',
  location: import.meta.env.VITE_LOCATION || 'القاهرة، مصر (متاح للعمل عن بعد عالمياً)',
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'siyaj-system',
    title: 'نظام سياج للأرشفة السيادية الرقمية (Siyaj System)',
    category: 'الأنظمة السيادية والأرشفة',
    description: 'منصة متكاملة للأرشفة السيادية والأمن الرقمي، مخصصة لإدارة وتأمين الملفات الحساسة وحمايتها، وتوفير التشفير المتقدم وإدارة الصلاحيات الصارمة للمؤسسات.',
    longDescription: 'نظام "سياج" يمثل الجيل الجديد من منصات الحماية الرقمية والأرشفة السيادية المخصصة للعمل في بيئات مغلقة أو سحابية مؤمنة بالكامل. يوفر حماية فائقة للملفات والمستندات الحساسة باستخدام معايير تشفير RSA-2048 وإدارة مرنة ومحكمة للصلاحيات الرقمية لضمان أقصى درجات السرية والخصوصية.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    techStack: ['React', 'TypeScript', 'RSA-2048', 'Tailwind CSS'],
    demoUrl: '#contact',
    stats: [
      { label: 'معيار التشفير', value: 'RSA-2048' },
      { label: 'سرعة المزامنة الآمنة', value: '< 15 ملي ثانية' },
      { label: 'مستوى حماية الملفات', value: 'سيادي بالكامل' }
    ]
  },
  {
    id: 'letter-journey',
    title: 'تطبيق رحلة الحروف التعليمي للأطفال',
    category: 'التطبيقات التعليمية والألعاب',
    description: 'تطبيق تعليمي تفاعلي مبني على منهجية القاعدة النورانية لتعليم الأطفال من سن السادسة فما فوق أساسيات القراءة والكتابة باللغة العربية بطرق تفاعلية شيقة.',
    longDescription: 'يهدف تطبيق "رحلة الحروف" إلى تبسيط تعلم اللغة العربية للأطفال من خلال أسلوب شيق يعتمد على القاعدة النورانية. يدمج التطبيق بين الدروس التفاعلية، والألعاب التعليمية المصغرة، والتغذية البصرية المتميزة، ليتيح للأطفال تعلم مخارج الحروف، ونطق الكلمات بطريقة صحيحة مع تتبع التقدم المخزن محلياً.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    techStack: ['Vite', 'React', 'Tailwind CSS', 'LocalStorage'],
    demoUrl: 'https://digital-idea-hub--abwhkeemiprahem.replit.app',
    stats: [
      { label: 'معدل إكمال الدروس', value: '92%' },
      { label: 'الفئة العمرية المستهدفة', value: '+6 سنوات' },
      { label: 'تخزين التقدم', value: 'محلي وآمن' }
    ]
  },
  {
    id: 'unified-shield',
    title: 'منصة درع الاستوديو الموحد لإدارة الـ SaaS',
    category: 'منصات SaaS الرقمية',
    description: 'نظام سحابي متكامل لإدارة منصات الـ SaaS وبوابات الدفع الرقمية المتعددة، يوفر حماية متقدمة لبيانات الاتصال ومحافظ العملات الرقمية وتتبع الفواتير والتحويلات.',
    longDescription: 'تعد منصة "درع الاستوديو الموحد" حلاً أمنياً وإدارياً شاملاً لأصحاب المنتجات السحابية والشركات التقنية. يوفر النظام واجهات موحدة لإدارة الفواتير والاشتراكات، والتحقق الآمن من بوابات الدفع الرقمية (مثل محافظ USDT)، وحماية القنوات الحساسة من محاولات الاختراق والتسريب.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    techStack: ['React', 'Node.js', 'USDT Gateways', 'Tailwind CSS'],
    demoUrl: '#contact',
    stats: [
      { label: 'معدل الأمان وحماية البيانات', value: '99.99%' },
      { label: 'بوابات دفع مدعومة', value: 'متعددة (USDT)' },
      { label: 'زمن تأكيد العمليات', value: 'فوري' }
    ]
  },
  {
    id: 'global-quality-center',
    title: 'المركز الرقمي العالمي لتدقيق الجودة والامتثال',
    category: 'منصات SaaS الرقمية',
    description: 'منصة ذكية ومستقلة لتقييم وتدقيق المنتجات البرمجية والرقمية وفقاً للمعايير الدولية القياسية ISO/IEC 25010 وضمان توافق واجهات المستخدم والوصول الشامل.',
    longDescription: 'يوفر "المركز الرقمي العالمي لتدقيق الجودة والامتثال" محرك تقييم متطوراً يهدف إلى قياس جودة الكود والأداء والواجهات لأي تطبيق برمجي. تساهم المنصة في مساعدة الشركات على تحسين جودة منتجاتها لتتوافق بدقة مع معيار الأيزو ISO/IEC 25010 لضمان القابلية للتوسع وسرعة الاستجابة والوصول الشامل لجميع المستخدمين.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    techStack: ['TypeScript', 'Audit Engines', 'Tailwind CSS'],
    demoUrl: '#contact',
    stats: [
      { label: 'المعيار المعتمد للتدقيق', value: 'ISO 25010' },
      { label: 'دقة التقارير البرمجية', value: '100%' },
      { label: 'توفير تكلفة التطوير', value: '35%' }
    ]
  }
];

export const SERVICES_DATA: Service[] = [
  {
    id: 'sovereign-solutions',
    title: 'هندسة الحلول السيادية والأتمتة',
    iconName: 'Shield',
    description: 'تصميم وبناء البنى التحتية البرمجية المستقلة، أتمتة العمليات الداخلية المعقدة للشركات لضمان حماية البيانات بنسبة 100% والاعتماد الذاتي الكامل.',
    features: [
      'أنظمة الأرشفة الرقمية والتحكم المستقل بالبيانات',
      'برمجيات الأتمتة الإدارية والمالية الشاملة للشركات والمصانع',
      'تكامل البوابات والأنظمة وحمايتها من الاختراق والتعطل',
      'دعم بيئات الاستضافة المحلية والخاصة والعمل بدون إنترنت (On-Premises)'
    ],
    deliveryTime: 'خلال 14 - 30 يوماً',
    priceEstimate: 'تبدأ من $1,500'
  },
  {
    id: 'ui-ux-design',
    title: 'تصميم واجهات تجربة المستخدم الاحترافية (UI/UX)',
    iconName: 'Layers',
    description: 'تحويل الأفكار البرمجية إلى تصاميم حية وأنيقة تركز على تحسين تفاعل المستخدم وسرعة الإنجاز مع الحفاظ على الهوية البصرية الفريدة.',
    features: [
      'هندسة تجارب الاستخدام وبناء المخططات الهيكلية (Wireframes)',
      'تصميم واجهات عصرية تتوافق 100% مع الهواتف المحمولة والشاشات الكبيرة',
      'إعداد المكونات والـ Design System الخاص بالمشروع لتسهيل عمل المطورين',
      'توفير نماذج تفاعلية حية (Interactive Prototypes) على Figma'
    ],
    deliveryTime: 'خلال 7 - 15 يوماً',
    priceEstimate: 'تبدأ من $600'
  },
  {
    id: 'qa-audit',
    title: 'تدقيق الجودة الرقمية وهندسة الأداء',
    iconName: 'Cpu',
    description: 'مراجعة شاملة للأكواد والمشاريع القائمة لضمان مطابقتها لأعلى المعايير البرمجية الدولية وسد الثغرات الأمنية وزيادة سرعة الاستجابة.',
    features: [
      'تحليل الأداء وزمن الاستجابة وحل مشاكل البطء والذاكرة',
      'مراجعة بنية الكود البرمجي والتأكد من قابليته للتوسع (Code Review)',
      'فحص الثغرات الأمنية وتسريب البيانات وهجمات الـ XSS/SQLi',
      'تقديم تقرير استشاري شامل مع خطة عمل واضحة للتطوير الفوري'
    ],
    deliveryTime: 'خلال 3 - 7 أيام',
    priceEstimate: 'تبدأ من $400'
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'usdt-trc20',
    name: 'العملات الرقمية (USDT)',
    type: 'usdt',
    details: {
      address: import.meta.env.VITE_USDT_ADDRESS || 'TQ1DsmM3kRAtMptU6uU6GisT2m5Rsh6NfV',
      network: import.meta.env.VITE_USDT_NETWORK || 'Tron (TRC-20)',
      instruction: 'يرجى إرسال المبلغ على العنوان المذكور بدقة، وتأكيد التحويل بإرسال لقطة الشاشة ورمز المعاملة (TXID) عبر نموذج التواصل.'
    },
    iconName: 'Wallet'
  },
  {
    id: 'instapay-egypt',
    name: 'تطبيق إنستا باي (InstaPay Egypt)',
    type: 'local_wallet',
    details: {
      walletNumber: import.meta.env.VITE_INSTAPAY_ID || 'abwkreem@instapay',
      accountHolder: import.meta.env.VITE_BANK_ACC_HOLDER || 'إبراهيم علي كداف سعيد',
      instruction: 'الدفع الفوري داخل جمهورية مصر العربية عبر عنوان الدفع المباشر لإنستاباي.'
    },
    iconName: 'Smartphone'
  },
  {
    id: 'local-bank',
    name: 'حوالة بنكية محلية / دولية',
    type: 'local_bank',
    details: {
      bankName: import.meta.env.VITE_BANK_NAME || 'بنك الكريمي الإسلامي التمويل الأصغر',
      accountHolder: import.meta.env.VITE_BANK_ACC_HOLDER || 'إبراهيم علي كداف سعيد',
      accountNumber: import.meta.env.VITE_BANK_ACC_NUM || '1993071234567890123',
      iban: import.meta.env.VITE_BANK_IBAN || 'EG020003019930712345678901234',
      instruction: 'عند تحويل أتعاب الخدمات المصرفية، يرجى كتابة اسم العميل بوضوح وإرسال إشعار التحويل عبر النموذج.'
    },
    iconName: 'CreditCard'
  }
];

/**
 * Helper function to filter projects by category
 */
export function filterProjectsByCategory(projects: Project[], activeFilter: string): Project[] {
  if (activeFilter === 'all') return projects;
  return projects.filter(project => {
    const cat = (project.category || '').trim().replace(/\s+/g, ' ').toLowerCase();
    
    if (activeFilter === 'saas') {
      return cat.includes('saas') || cat.includes('منصات saas') || project.id === 'unified-shield' || project.id === 'global-quality-center';
    } else if (activeFilter === 'sovereign') {
      return cat.includes('sovereign') || cat.includes('السيادية') || project.id === 'siyaj-system';
    } else if (activeFilter === 'edu') {
      return cat.includes('edu') || cat.includes('التعليمية') || project.id === 'letter-journey';
    } else if (activeFilter === 'software') {
      return cat.includes('software') || cat.includes('برمج') || cat.includes('saas') || cat.includes('تعليم') || project.id !== 'global-quality-center';
    } else if (activeFilter === 'consulting') {
      return cat.includes('consult') || cat.includes('تدقيق') || cat.includes('استشار') || project.id === 'global-quality-center';
    } else if (activeFilter === 'automation') {
      return cat.includes('automat') || cat.includes('أتمت') || cat.includes('سياد') || project.id === 'siyaj-system' || project.id === 'unified-shield';
    }
    return false;
  });
}

/**
 * Helper function to search projects by text query
 */
export function searchProjectsByQuery(projects: Project[], searchQuery: string): Project[] {
  if (!searchQuery || searchQuery.trim() === '') return projects;
  const query = searchQuery.toLowerCase().trim();
  return projects.filter(project => {
    const titleMatch = (project.title || '').toLowerCase().includes(query);
    const descMatch = (project.description || '').toLowerCase().includes(query);
    const techMatch = (project.techStack || []).some(tech => tech.toLowerCase().includes(query));
    return titleMatch || descMatch || techMatch;
  });
}

/**
 * Helper function to sort projects by title
 */
export function sortProjectsByTitle(projects: Project[], direction: 'asc' | 'desc' = 'asc'): Project[] {
  return [...projects].sort((a, b) => {
    const titleA = (a.title || '').toLowerCase();
    const titleB = (b.title || '').toLowerCase();
    if (titleA < titleB) return direction === 'asc' ? -1 : 1;
    if (titleA > titleB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

