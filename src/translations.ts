export type Language = 'ar' | 'en';

export interface TranslationDict {
  // Navigation / Header
  nav_hero: string;
  nav_portfolio: string;
  nav_services: string;
  nav_testimonials: string;
  nav_payments: string;
  nav_contact: string;
  header_title: string;
  header_subtitle: string;
  header_status: string;
  header_cta: string;

  // Hero Section
  hero_module_label: string;
  hero_badge: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_desc: string;
  hero_stat_exp: string;
  hero_stat_proj: string;
  hero_stat_core: string;
  hero_cta_explore: string;
  hero_cta_consult: string;
  hero_terminal_name_label: string;
  hero_terminal_name_val: string;
  hero_terminal_role_label: string;
  hero_terminal_role_val: string;
  hero_terminal_spec_label: string;
  hero_terminal_spec_1: string;
  hero_terminal_spec_2: string;
  hero_terminal_spec_3: string;
  hero_terminal_safe_label: string;
  hero_terminal_audit_label: string;
  hero_terminal_audit_val: string;
  hero_terminal_footer_ok: string;
  hero_terminal_status: string;
  hero_terminal_ratings: string;

  // Portfolio Section
  portfolio_module_label: string;
  portfolio_badge: string;
  portfolio_title: string;
  portfolio_desc: string;
  portfolio_filter_all: string;
  portfolio_filter_saas: string;
  portfolio_filter_sovereign: string;
  portfolio_filter_edu: string;
  portfolio_filter_software: string;
  portfolio_filter_consulting: string;
  portfolio_filter_automation: string;
  portfolio_view_specs: string;
  portfolio_modal_about: string;
  portfolio_modal_efficiency: string;
  portfolio_modal_tech: string;
  portfolio_modal_demo_btn: string;
  portfolio_modal_close_btn: string;
  portfolio_search_placeholder: string;
  portfolio_no_results: string;

  // Services Section
  services_module_label: string;
  services_badge: string;
  services_title: string;
  services_desc: string;
  services_deliverables_title: string;
  services_timeline_label: string;
  services_budget_label: string;
  services_workflow_title: string;
  services_workflow_desc: string;
  services_step_1_title: string;
  services_step_1_desc: string;
  services_step_2_title: string;
  services_step_2_desc: string;
  services_step_3_title: string;
  services_step_3_desc: string;

  // Testimonials Section (New)
  testimonials_module_label: string;
  testimonials_badge: string;
  testimonials_title: string;
  testimonials_desc: string;
  testimonials_quote_prefix: string;

  // Payments & Contact Section
  payments_module_label: string;
  payments_badge: string;
  payments_title: string;
  payments_desc: string;
  payments_method_select_title: string;
  payments_warning_box: string;
  payments_details_title: string;
  payments_label_usdt_addr: string;
  payments_label_network: string;
  payments_label_min_transfer: string;
  payments_label_wallet_num: string;
  payments_label_holder: string;
  payments_label_bank: string;
  payments_label_acc_num: string;
  payments_label_iban: string;
  payments_label_instruction: string;

  contact_module_label: string;
  contact_badge: string;
  contact_title: string;
  contact_desc: string;
  contact_label_email: string;
  contact_label_tel: string;
  contact_label_loc: string;
  contact_archive_title: string;
  contact_form_title: string;
  contact_form_success_title: string;
  contact_form_success_desc: string;
  contact_form_label_name: string;
  contact_form_label_email: string;
  contact_form_label_service: string;
  contact_form_label_budget: string;
  contact_form_label_message: string;
  contact_form_placeholder_name: string;
  contact_form_placeholder_message: string;
  contact_form_btn_submit: string;
  contact_form_btn_submitting: string;
  contact_form_err_name: string;
  contact_form_err_email: string;
  contact_form_err_message: string;

  // Footer Section
  footer_desc: string;
  footer_quick_links: string;
  footer_networks: string;
  footer_rights: string;
  footer_mobile_ok: string;
}

export const translations: Record<Language, TranslationDict> = {
  ar: {
    // Navigation / Header
    nav_hero: 'الرئيسية',
    nav_portfolio: 'معرض الأعمال',
    nav_services: 'الخدمات والاستشارات',
    nav_testimonials: 'آراء العملاء',
    nav_payments: 'الدفع والتوظيف',
    nav_contact: 'اتصل بنا',
    header_title: 'م. إبراهيم المحرقي',
    header_subtitle: 'LEAD ARCHITECT v4.0',
    header_status: 'STATUS: AVAILABLE',
    header_cta: 'طلب استشارة فورية',

    // Hero Section
    hero_module_label: '01 / IDENTITY_MODULE',
    hero_badge: '[SECURE_CORE] مهندس برمجيات ومستشار تقني للحلول السيادية',
    hero_title_1: 'نُهندس المستقبل',
    hero_title_2: 'بحلول سيادية آمنة للأتمتة',
    hero_desc: 'مستشار تقني متخصص في بناء البنى التحتية البرمجية المستقلة، وتطوير منصات SaaS المليونية، وتدقيق كفاءة وأمان الأنظمة المعقدة. نجمع بين أمن المعلومات وكفاءة التشغيل الرقمي المتكامل.',
    hero_stat_exp: 'Yrs Experience',
    hero_stat_proj: 'Sovereign Projects',
    hero_stat_core: 'Independent Core',
    hero_cta_explore: 'استكشف معرض الأعمال',
    hero_cta_consult: 'طلب استشارة تقنية',
    hero_terminal_name_label: 'name',
    hero_terminal_name_val: '"م. إبراهيم المحرقي"',
    hero_terminal_role_label: 'role',
    hero_terminal_role_val: '"مستشار تقني وهندسة نظم سيادية"',
    hero_terminal_spec_label: 'specialization',
    hero_terminal_spec_1: '"Sovereign Architecture"',
    hero_terminal_spec_2: '"SaaS & Enterprise Automation"',
    hero_terminal_spec_3: '"UI/UX Visual Engineering"',
    hero_terminal_safe_label: 'safeEnvironment',
    hero_terminal_audit_label: 'securityAudit',
    hero_terminal_audit_val: '"ISO-27001 Ready"',
    hero_terminal_footer_ok: 'تم توثيق الاتصال الآمن والمعزول',
    hero_terminal_status: 'CORE_STATUS: SECURE_LIVE',
    hero_terminal_ratings: '150K+ USER RATINGS',

    // Portfolio Section
    portfolio_module_label: '02 / WORK_ARCHIVE',
    portfolio_badge: '[PROJECT_REPOSITORY]',
    portfolio_title: 'معرض الأعمال الرقمي السيادي',
    portfolio_desc: 'مجموعة مختارة من النظم المتكاملة والمنصات الرقمية المطورة ببرمجيات معزولة وعالية الكفاءة، مصممة خصيصاً للتحول الرقمي الآمن وتحقيق سيادة البيانات والاستقلالية البرمجية.',
    portfolio_filter_all: 'عرض الكل',
    portfolio_filter_saas: 'منصات SaaS الرقمية',
    portfolio_filter_sovereign: 'الأنظمة السيادية والأرشفة',
    portfolio_filter_edu: 'التطبيقات التعليمية والألعاب',
    portfolio_filter_software: 'تطوير البرمجيات',
    portfolio_filter_consulting: 'الاستشارات الرقمية',
    portfolio_filter_automation: 'حلول الأتمتة',
    portfolio_view_specs: 'VIEW SPECIFICATIONS //',
    portfolio_modal_about: 'حول المشروع والحل الهندسي',
    portfolio_modal_efficiency: 'مؤشرات الكفاءة والأداء المحققة',
    portfolio_modal_tech: 'التقنيات والهيكلية المستخدمة',
    portfolio_modal_demo_btn: 'معاينة الرابط المباشر / الكود',
    portfolio_modal_close_btn: 'إغلاق التفاصيل',
    portfolio_search_placeholder: 'البحث عن المشاريع بالاسم، الوصف، أو التقنية المستخدمة...',
    portfolio_no_results: 'لم يتم العثور على أي مشاريع تطابق معايير البحث والفرز الخاصة بك.',

    // Services Section
    services_module_label: '03 / PROFESSIONAL_SERVICES',
    services_badge: '[SERVICE_CATALOGUE]',
    services_title: 'الخدمات المهنية والاستشارات التقنية',
    services_desc: 'أقدم حلولاً هندسية مصممة بدقة متناهية للمؤسسات الريادية الطموحة الساعية للسيادة الرقمية المستقلة، بدءاً من تخطيط البنية التحتية حتى التدقيق الأمني ومراقبة الجودة.',
    services_deliverables_title: 'REQUIRED_DELIVERABLES //',
    services_timeline_label: 'EST_TIMELINE',
    services_budget_label: 'EST_BUDGET',
    services_workflow_title: 'منهجية العمل التقنية',
    services_workflow_desc: 'منهجية معيارية واضحة وموثوقة تضمن تسليم مشاريعكم خالية من الأخطاء ووفق الجداول الزمنية المتفق عليها بكل شفافية.',
    services_step_1_title: 'الاستكشاف والتخطيط',
    services_step_1_desc: 'دراسة متطلبات السيادة والأمن، ورسم البنية الهيكلية للملفات والمشاريع بدقة.',
    services_step_2_title: 'التنفيذ المعياري',
    services_step_2_desc: 'كتابة الأكواد بلغات آمنة (TypeScript) مع مراعاة الأداء العالي والتوافقية الكاملة.',
    services_step_3_title: 'فحص الجودة والمطابقة',
    services_step_3_desc: 'اختبار الحماية، تدقيق سرعة الاستجابة وتأكيد جاهزية نظام الأرشفة للعمل بنجاح.',

    // Testimonials Section (New)
    testimonials_module_label: '03B / SOCIAL_PROOF_DECK',
    testimonials_badge: '[CLIENT_FEEDBACK]',
    testimonials_title: 'آراء وثقة شركاء النجاح',
    testimonials_desc: 'مراجعات وتقييمات حقيقية من مدراء أمن المعلومات، رواد الأعمال، والمسؤولين التقنيين الذين قمنا بمساعدتهم على نيل استقلاليتهم البرمجية وتطوير حلولهم المليونية.',
    testimonials_quote_prefix: 'QUOTE',

    // Payments & Contact Section
    payments_module_label: '04 / TRANSACTION_CHANNELS',
    payments_badge: '[TRANSACTION_CORE]',
    payments_title: 'قنوات دفع الأتعاب والتحويل الآمن',
    payments_desc: 'لتسهيل التعاقد وبدء العمل، يمكنك تحويل أتعاب الاستشارات وتطوير الأنظمة عبر العملات الرقمية المستقرة USDT أو المحافظ المحلية والتحويلات المصرفية الموثوقة.',
    payments_method_select_title: 'SELECT PAYMENT_METHOD //',
    payments_warning_box: 'جميع البيانات المعروضة أعلاه آمنة وموثوقة بنسبة 100%. تلتزم بروتوكولاتنا بتشفير وتأكيد تحويلات العملاء بشكل فوري لتفادي التأخير.',
    payments_details_title: 'تفاصيل',
    payments_label_usdt_addr: 'USDT_ADDRESS //',
    payments_label_network: 'REQUIRED_NETWORK',
    payments_label_min_transfer: 'MIN_TRANSFER_AMT',
    payments_label_wallet_num: 'WALLET_NUMBER //',
    payments_label_holder: 'اسم المستلم المسجل:',
    payments_label_bank: 'اسم البنك:',
    payments_label_acc_num: 'ACCOUNT_NUMBER //',
    payments_label_iban: 'IBAN_CODE //',
    payments_label_instruction: 'INSTRUCTION_GUIDE //',

    contact_module_label: '05 / COMMUNICATIONS_DESK',
    contact_badge: '[SECURE_CHANNEL]',
    contact_title: 'دعنا نناقش فكرة مشروعك القادم',
    contact_desc: 'مستعد لمناقشة المشاريع السيادية، وتطوير منصات الـ SaaS المتكاملة، وتدقيق الجودة البرمجية للمؤسسات. لا تتردد في ملء النموذج أو الاتصال مباشرة.',
    contact_label_email: 'E_MAIL //',
    contact_label_tel: 'SECURE_TEL //',
    contact_label_loc: 'LOC_COORDINATES //',
    contact_archive_title: 'LOCAL_MESSAGE_ARCHIVE //',
    contact_form_title: 'إرسال استفسار آمن ومباشر',
    contact_form_success_title: '[TRANSMISSION_SUCCESS]',
    contact_form_success_desc: 'تم توثيق طلب الاستشارة الخاص بك محلياً وسنقوم بالتواصل معك عبر البريد الإلكتروني المدخل في أقرب وقت ممكن. شكراً لثقتكم.',
    contact_form_label_name: 'الإسم الكريم / اسم الشركة *',
    contact_form_label_email: 'البريد الإلكتروني للتواصل *',
    contact_form_label_service: 'نوع الخدمة أو الاستشارة',
    contact_form_label_budget: 'الميزانية المرصودة للمشروع',
    contact_form_label_message: 'تفاصيل الاستشارة أو متطلبات العمل *',
    contact_form_placeholder_name: 'عبدالله محمد',
    contact_form_placeholder_message: 'يرجى وصف فكرة المشروع، والبرمجيات التي تستخدمونها، أو المعايير السيادية المطلوبة...',
    contact_form_btn_submit: 'إرسال طلب الاستشارة والتوظيف',
    contact_form_btn_submitting: 'TRANSMITTING...',
    contact_form_err_name: 'يرجى إدخال الإسم الكريم أو اسم الشركة للتوثيق.',
    contact_form_err_email: 'يرجى إدخال بريد إلكتروني صالح للتواصل معكم.',
    contact_form_err_message: 'يرجى كتابة بعض تفاصيل الاستشارة أو المتطلبات للمراجعة.',

    // Footer Section
    footer_desc: 'مستشار تقني ومطور نظم وحلول برمجية سيادية متكاملة، متخصص في هندسة منصات SaaS وتأمين قواعد البيانات والتدقيق الرقمي للمعايير الدولية.',
    footer_quick_links: 'QUICK_LINKS //',
    footer_networks: 'NETWORKS_TEL //',
    footer_rights: 'جميع الحقوق محفوظة.',
    footer_mobile_ok: 'MOBILE_OPTIMIZED // OK'
  },
  en: {
    // Navigation / Header
    nav_hero: 'Home',
    nav_portfolio: 'Portfolio',
    nav_services: 'Services & Consulting',
    nav_testimonials: 'Testimonials',
    nav_payments: 'Payments',
    nav_contact: 'Contact',
    header_title: 'Eng. Ibrahim Al-Muharqi',
    header_subtitle: 'LEAD ARCHITECT v4.0',
    header_status: 'STATUS: AVAILABLE',
    header_cta: 'Instant Consultation',

    // Hero Section
    hero_module_label: '01 / IDENTITY_MODULE',
    hero_badge: '[SECURE_CORE] Software Engineer & Sovereign Solutions Consultant',
    hero_title_1: 'Engineering the Future',
    hero_title_2: 'With Secure, Sovereign Solutions',
    hero_desc: 'Technical consultant specialized in building independent software infrastructures, developing multi-million request SaaS platforms, and auditing complex systems for efficiency and security. Merging information security with streamlined digital operations.',
    hero_stat_exp: 'Yrs Experience',
    hero_stat_proj: 'Sovereign Projects',
    hero_stat_core: 'Independent Core',
    hero_cta_explore: 'Explore Work Gallery',
    hero_cta_consult: 'Request Consultation',
    hero_terminal_name_label: 'name',
    hero_terminal_name_val: '"Eng. Ibrahim Al-Muharqi"',
    hero_terminal_role_label: 'role',
    hero_terminal_role_val: '"Sovereign Systems & Technical Consultant"',
    hero_terminal_spec_label: 'specialization',
    hero_terminal_spec_1: '"Sovereign Architecture"',
    hero_terminal_spec_2: '"SaaS & Enterprise Automation"',
    hero_terminal_spec_3: '"UI/UX Visual Engineering"',
    hero_terminal_safe_label: 'safeEnvironment',
    hero_terminal_audit_label: 'securityAudit',
    hero_terminal_audit_val: '"ISO-27001 Ready"',
    hero_terminal_footer_ok: 'Secure isolated connection authenticated',
    hero_terminal_status: 'CORE_STATUS: SECURE_LIVE',
    hero_terminal_ratings: '150K+ USER RATINGS',

    // Portfolio Section
    portfolio_module_label: '02 / WORK_ARCHIVE',
    portfolio_badge: '[PROJECT_REPOSITORY]',
    portfolio_title: 'Sovereign Digital Portfolio',
    portfolio_desc: 'A selected collection of integrated systems and digital platforms developed with isolated, highly efficient software, custom-built for secure digital transformation and data sovereignty.',
    portfolio_filter_all: 'Show All',
    portfolio_filter_saas: 'SaaS Platforms',
    portfolio_filter_sovereign: 'Sovereign Systems & Archiving',
    portfolio_filter_edu: 'Educational & Games',
    portfolio_filter_software: 'Software Development',
    portfolio_filter_consulting: 'Consulting',
    portfolio_filter_automation: 'Automation',
    portfolio_view_specs: 'VIEW SPECIFICATIONS //',
    portfolio_modal_about: 'About the Project & Solution',
    portfolio_modal_efficiency: 'KPIs & Performance Achievements',
    portfolio_modal_tech: 'Technologies & Architecture Used',
    portfolio_modal_demo_btn: 'Preview Live Link / Code',
    portfolio_modal_close_btn: 'Close Details',
    portfolio_search_placeholder: 'Search projects by name, description, or technology...',
    portfolio_no_results: 'No projects found matching your search and filter criteria.',

    // Services Section
    services_module_label: '03 / PROFESSIONAL_SERVICES',
    services_badge: '[SERVICE_CATALOGUE]',
    services_title: 'Professional Services & Tech Consulting',
    services_desc: 'Delivering highly-engineered solutions designed precisely for visionary enterprises striving for sovereign digital independence, from infrastructure planning to security audits.',
    services_deliverables_title: 'REQUIRED_DELIVERABLES //',
    services_timeline_label: 'EST_TIMELINE',
    services_budget_label: 'EST_BUDGET',
    services_workflow_title: 'Technical Workflow Methodology',
    services_workflow_desc: 'A clear, transparent, and standards-compliant methodology that ensures your projects are delivered bug-free and strictly on schedule.',
    services_step_1_title: 'Discovery & Planning',
    services_step_1_desc: 'Analyzing sovereignty and security demands, sketching out file and database structures with utmost accuracy.',
    services_step_2_title: 'Compliant Implementation',
    services_step_2_desc: 'Writing secure code in TypeScript with a heavy focus on high performance and seamless compatibility.',
    services_step_3_title: 'Quality & Compliance Review',
    services_step_3_desc: 'Testing protection layers, auditing response latency, and verifying archive-readiness for successful launch.',

    // Testimonials Section (New)
    testimonials_module_label: '03B / SOCIAL_PROOF_DECK',
    testimonials_badge: '[CLIENT_FEEDBACK]',
    testimonials_title: 'Success Partner Testimonials',
    testimonials_desc: 'Verified reviews and evaluations from Chief Information Security Officers, startup founders, and technical managers who successfully achieved data independence and launched high-scale solutions.',
    testimonials_quote_prefix: 'QUOTE',

    // Payments & Contact Section
    payments_module_label: '04 / TRANSACTION_CHANNELS',
    payments_badge: '[TRANSACTION_CORE]',
    payments_title: 'Secure Payment & Transfer Channels',
    payments_desc: 'To simplify onboarding, technical consultation and development fees can be settled via USDT stablecoin, local digital wallets, or secure bank transfers.',
    payments_method_select_title: 'SELECT PAYMENT_METHOD //',
    payments_warning_box: 'All provided information is 100% verified and secure. Our protocols process and confirm client transfers promptly to ensure no project delays.',
    payments_details_title: 'Details of',
    payments_label_usdt_addr: 'USDT_ADDRESS //',
    payments_label_network: 'REQUIRED_NETWORK',
    payments_label_min_transfer: 'MIN_TRANSFER_AMT',
    payments_label_wallet_num: 'WALLET_NUMBER //',
    payments_label_holder: 'Registered Beneficiary:',
    payments_label_bank: 'Bank Name:',
    payments_label_acc_num: 'ACCOUNT_NUMBER //',
    payments_label_iban: 'IBAN_CODE //',
    payments_label_instruction: 'INSTRUCTION_GUIDE //',

    contact_module_label: '05 / COMMUNICATIONS_DESK',
    contact_badge: '[SECURE_CHANNEL]',
    contact_title: 'Let\'s Discuss Your Next Initiative',
    contact_desc: 'Ready to formulate sovereign systems, scale complete SaaS platforms, or run digital security audits. Feel free to fill the form or reach out directly.',
    contact_label_email: 'E_MAIL //',
    contact_label_tel: 'SECURE_TEL //',
    contact_label_loc: 'LOC_COORDINATES //',
    contact_archive_title: 'LOCAL_MESSAGE_ARCHIVE //',
    contact_form_title: 'Transmit a Secure Direct Inquiry',
    contact_form_success_title: '[TRANSMISSION_SUCCESS]',
    contact_form_success_desc: 'Your consultation request has been archived locally. We will contact you via email as soon as possible. Thank you for your trust.',
    contact_form_label_name: 'Your Name / Company Name *',
    contact_form_label_email: 'Contact Email Address *',
    contact_form_label_service: 'Service / Consultation Type',
    contact_form_label_budget: 'Planned Project Budget',
    contact_form_label_message: 'Consultation Details / Scope *',
    contact_form_placeholder_name: 'John Doe',
    contact_form_placeholder_message: 'Please describe your project idea, current stack, or security/sovereignty requirements...',
    contact_form_btn_submit: 'Transmit Consultation & Hire Request',
    contact_form_btn_submitting: 'TRANSMITTING...',
    contact_form_err_name: 'Please enter your name or company name for verification.',
    contact_form_err_email: 'Please enter a valid email address to contact you.',
    contact_form_err_message: 'Please provide some details about your project or consultation scope.',

    // Footer Section
    footer_desc: 'Technical consultant and sovereign systems architect, specialized in SaaS platforms, high-security databases, and digital quality audits conforming to international standards.',
    footer_quick_links: 'QUICK_LINKS //',
    footer_networks: 'NETWORKS_TEL //',
    footer_rights: 'All rights reserved.',
    footer_mobile_ok: 'MOBILE_OPTIMIZED // OK'
  }
};

export interface TestimonialItem {
  id: string;
  name: Record<Language, string>;
  role: Record<Language, string>;
  feedback: Record<Language, string>;
  rating: number;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 't-1',
    name: {
      ar: 'د. ياسر القحطاني',
      en: 'Dr. Yasser Al-Qahtani'
    },
    role: {
      ar: 'رئيس قسم أمن المعلومات في حلول السيادة التقنية',
      en: 'Chief Information Security Officer at Sovereign Tech Solutions'
    },
    feedback: {
      ar: 'عمل استثنائي في تدقيق وإعادة هندسة نظام الأرشفة لدينا. بفضل توجيهات م. إبراهيم، تمكنا من تحقيق استقلالية كاملة في إدارة بياناتنا بمستويات أمان تماثل معايير ISO-27001.',
      en: 'Exceptional work auditing and re-engineering our archiving system. Thanks to Eng. Ibrahim\'s guidance, we achieved complete data independence with security levels aligning with ISO-27001 standards.'
    },
    rating: 5
  },
  {
    id: 't-2',
    name: {
      ar: 'أ. أمجد الريامي',
      en: 'Mr. Amjad Al-Riyami'
    },
    role: {
      ar: 'المؤسس الشريك لمنصة سديم السحابية',
      en: 'Co-Founder of Sadeem Cloud Platform'
    },
    feedback: {
      ar: 'المهندس إبراهيم ليس مجرد مبرمج، بل شريك تقني استراتيجي. ساعدنا في تصميم وبناء بنية سحابية تتحمل ملايين الطلبات اليومية مع توفير هائل في تكاليف الاستضافة.',
      en: 'Eng. Ibrahim is not just a developer, but a strategic technical partner. He helped us design and build a cloud architecture capable of handling millions of daily requests while heavily optimizing hosting costs.'
    },
    rating: 5
  },
  {
    id: 't-3',
    name: {
      ar: 'أ. نادية الغامدي',
      en: 'Ms. Nadia Al-Ghamdi'
    },
    role: {
      ar: 'مديرة قطاع التعليم الرقمي، تطبيق فطن',
      en: 'Director of Digital Learning, Faten Kids'
    },
    feedback: {
      ar: 'واجهات جذابة، أداء فائق السرعة، ومنهجية عمل احترافية للغاية. استطاع تطبيق "فطن" تحقيق تقييم 4.9 على متاجر التطبيقات بفضل هندسة الواجهات المتقنة التي نفذها.',
      en: 'Engaging interfaces, lightning-fast performance, and an extremely professional workflow. The "Faten" app achieved a 4.9 rating on app stores, thanks to the meticulous interface engineering he delivered.'
    },
    rating: 5
  }
];

export interface TranslatedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  techStack: string[];
  demoUrl?: string;
  stats?: {
    label: string;
    value: string;
  }[];
}

export interface TranslatedService {
  id: string;
  title: string;
  iconName: string;
  description: string;
  features: string[];
  deliveryTime: string;
  priceEstimate: string;
}

export function getLocalizedProjects(lang: Language): TranslatedProject[] {
  return [
    {
      id: 'siyaj-system',
      title: lang === 'ar' ? 'نظام سياج للأرشفة السيادية الرقمية (Siyaj System)' : 'Siyaj Sovereign Digital Archiving System (Siyaj System)',
      category: lang === 'ar' ? 'الأنظمة السيادية والأرشفة' : 'Sovereign Systems & Archiving',
      description: lang === 'ar' 
        ? 'منصة متكاملة للأرشفة السيادية والأمن الرقمي، مخصصة لإدارة وتأمين الملفات الحساسة وحمايتها، وتوفير التشفير المتقدم وإدارة الصلاحيات الصارمة للمؤسسات.'
        : 'An integrated platform for sovereign archiving and digital security, dedicated to managing, securing, and protecting sensitive files, providing advanced encryption and strict access control for organizations.',
      longDescription: lang === 'ar'
        ? 'نظام "سياج" يمثل الجيل الجديد من منصات الحماية الرقمية والأرشفة السيادية المخصصة للعمل في بيئات مغلقة أو سحابية مؤمنة بالكامل. يوفر حماية فائقة للملفات والمستندات الحساسة باستخدام معايير تشفير RSA-2048 وإدارة مرنة ومحكمة للصلاحيات الرقمية لضمان أقصى درجات السرية والخصوصية.'
        : 'The "Siyaj" system represents the next generation of digital protection and sovereign archiving platforms, custom-designed for air-gapped or fully secured cloud environments. It provides superior protection for highly sensitive files and documents using RSA-2048 encryption standards and flexible, rigid digital credential management to ensure top privacy.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      techStack: ['React', 'TypeScript', 'RSA-2048', 'Tailwind CSS'],
      demoUrl: '#contact',
      stats: [
        { label: lang === 'ar' ? 'معيار التشفير' : 'Encryption Standard', value: 'RSA-2048' },
        { label: lang === 'ar' ? 'سرعة المزامنة الآمنة' : 'Secure Sync Speed', value: '< 15 ms' },
        { label: lang === 'ar' ? 'مستوى حماية الملفات' : 'File Protection Level', value: lang === 'ar' ? 'سيادي بالكامل' : 'Fully Sovereign' }
      ]
    },
    {
      id: 'letter-journey',
      title: lang === 'ar' ? 'تطبيق رحلة الحروف التعليمي للأطفال' : 'Letter Journey - Arabic Learning App for Kids',
      category: lang === 'ar' ? 'التطبيقات التعليمية والألعاب' : 'Educational & Games',
      description: lang === 'ar'
        ? 'تطبيق تعليمي تفاعلي مبني على منهجية القاعدة النورانية لتعليم الأطفال من سن السادسة فما فوق أساسيات القراءة والكتابة باللغة العربية بطرق تفاعلية شيقة.'
        : 'An interactive educational app based on the Noorania methodology to teach children aged 6 and above the basics of reading and writing in Arabic in engaging and interactive ways.',
      longDescription: lang === 'ar'
        ? 'يهدف تطبيق "رحلة الحروف" إلى تبسيط تعلم اللغة العربية للأطفال من خلال أسلوب شيق يعتمد على القاعدة النورانية. يدمج التطبيق بين الدروس التفاعلية، والألعاب التعليمية المصغرة، والتغذية البصرية المتميزة، ليتيح للأطفال تعلم مخارج الحروف، ونطق الكلمات بطريقة صحيحة مع تتبع التقدم المخزن محلياً.'
        : '"Letter Journey" aims to simplify Arabic learning for kids through an engaging approach based on the Noorania methodology. It combines interactive lessons, educational mini-games, and outstanding visual feedback, allowing children to learn correct letter pronunciations and spelling with locally tracked progress.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
      techStack: ['Vite', 'React', 'Tailwind CSS', 'LocalStorage'],
      demoUrl: 'https://digital-idea-hub--abwhkeemiprahem.replit.app',
      stats: [
        { label: lang === 'ar' ? 'معدل إكمال الدروس' : 'Lesson Completion Rate', value: '92%' },
        { label: lang === 'ar' ? 'الفئة العمرية المستهدفة' : 'Target Age Group', value: '+6 Years' },
        { label: lang === 'ar' ? 'تخزين التقدم' : 'Progress Storage', value: lang === 'ar' ? 'محلي وآمن' : 'Local & Secure' }
      ]
    },
    {
      id: 'unified-shield',
      title: lang === 'ar' ? 'منصة درع الاستوديو الموحد لإدارة الـ SaaS' : 'Unified-Studio Shield - SaaS Management Platform',
      category: lang === 'ar' ? 'منصات SaaS الرقمية' : 'SaaS Platforms',
      description: lang === 'ar'
        ? 'نظام سحابي متكامل لإدارة منصات الـ SaaS وبوابات الدفع الرقمية المتعددة، يوفر حماية متقدمة لبيانات الاتصال ومحافظ العملات الرقمية وتتبع الفواتير والتحويلات.'
        : 'An integrated cloud system to manage SaaS platforms and multiple digital payment gateways, providing advanced protection for communication data, cryptocurrency wallets, and tracking invoices and transfers.',
      longDescription: lang === 'ar'
        ? 'تعد منصة "درع الاستوديو الموحد" حلاً أمنياً وإدارياً شاملاً لأصحاب المنتجات السحابية والشركات التقنية. يوفر النظام واجهات موحدة لإدارة الفواتير والاشتراكات، والتحقق الآمن من بوابات الدفع الرقمية (مثل محافظ USDT)، وحماية القنوات الحساسة من محاولات الاختراق والتسريب.'
        : '"Unified-Studio Shield" is a comprehensive security and management solution for cloud product owners and tech companies. It provides unified interfaces to manage invoices, subscriptions, verify secure digital payment gateways (like USDT wallets), and protect sensitive channels against security breaches.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      techStack: ['React', 'Node.js', 'USDT Gateways', 'Tailwind CSS'],
      demoUrl: '#contact',
      stats: [
        { label: lang === 'ar' ? 'معدل الأمان وحماية البيانات' : 'Security & Safety Rate', value: '99.99%' },
        { label: lang === 'ar' ? 'بوابات دفع مدعومة' : 'Supported Gateways', value: 'Multi (USDT)' },
        { label: lang === 'ar' ? 'زمن تأكيد العمليات' : 'Tx Confirmation Time', value: lang === 'ar' ? 'فوري' : 'Instant' }
      ]
    },
    {
      id: 'global-quality-center',
      title: lang === 'ar' ? 'المركز الرقمي العالمي لتدقيق الجودة والامتثال' : 'Global Digital Center for Quality & Compliance Audit',
      category: lang === 'ar' ? 'منصات SaaS الرقمية' : 'SaaS Platforms',
      description: lang === 'ar'
        ? 'منصة ذكية ومستقلة لتقييم وتدقيق المنتجات البرمجية والرقمية وفقاً للمعايير الدولية القياسية ISO/IEC 25010 وضمان توافق واجهات المستخدم والوصول الشامل.'
        : 'An intelligent, independent platform for assessing and auditing software and digital products in accordance with ISO/IEC 25010 standards, ensuring UI compatibility and universal accessibility.',
      longDescription: lang === 'ar'
        ? 'يوفر "المركز الرقمي العالمي لتدقيق الجودة والامتثال" محرك تقييم متطوراً يهدف إلى قياس جودة الكود والأداء والواجهات لأي تطبيق برمجي. تساهم المنصة في مساعدة الشركات على تحسين جودة منتجاتها لتتوافق بدقة مع معيار الأيزو ISO/IEC 25010 لضمان القابلية للتوسع وسرعة الاستجابة والوصول الشامل لجميع المستخدمين.'
        : '"Global Digital Center for Quality & Compliance Audit" provides an advanced assessment engine aimed at measuring code quality, performance, and interfaces for any software application. The platform helps companies optimize their products to comply with the international standard ISO/IEC 25010, ensuring scalability, responsive performance, and universal accessibility.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      techStack: ['TypeScript', 'Audit Engines', 'Tailwind CSS'],
      demoUrl: '#contact',
      stats: [
        { label: lang === 'ar' ? 'المعيار المعتمد للتدقيق' : 'Certified Audit Standard', value: 'ISO 25010' },
        { label: lang === 'ar' ? 'دقة التقارير البرمجية' : 'Report Code Accuracy', value: '100%' },
        { label: lang === 'ar' ? 'توفير تكلفة التطوير' : 'Saved Dev Cost', value: '35%' }
      ]
    }
  ];
}

export function getLocalizedServices(lang: Language): TranslatedService[] {
  return [
    {
      id: 'sovereign-solutions',
      title: lang === 'ar' ? 'هندسة الحلول السيادية والأتمتة' : 'Sovereign Solutions & Automation',
      iconName: 'Shield',
      description: lang === 'ar'
        ? 'تصميم وبناء البنى التحتية البرمجية المستقلة، أتمتة العمليات الداخلية المعقدة للشركات لضمان حماية البيانات بنسبة 100% والاعتماد الذاتي الكامل.'
        : 'Architecting independent and air-gapped software platforms, automating intricate workflows for modern enterprises to secure 100% data sovereignty and localized reliability.',
      features: lang === 'ar' ? [
        'أنظمة الأرشفة الرقمية والتحكم المستقل بالبيانات',
        'برمجيات الأتمتة الإدارية والمالية الشاملة للشركات والمصانع',
        'تكامل البوابات والأنظمة وحمايتها من الاختراق والتعطل',
        'دعم بيئات الاستضافة المحلية والخاصة والعمل بدون إنترنت (On-Premises)'
      ] : [
        'Secure document archiving and local sovereign control pools',
        'Enterprise-wide workflow automation and billing setups',
        'Custom API integrations shielded against intrusion and latency',
        'On-Premises server support capable of working completely offline'
      ],
      deliveryTime: lang === 'ar' ? 'خلال 14 - 30 يوماً' : '14 - 30 Days',
      priceEstimate: lang === 'ar' ? 'تبدأ من $1,500' : 'From $1,500'
    },
    {
      id: 'ui-ux-design',
      title: lang === 'ar' ? 'تصميم واجهات تجربة المستخدم الاحترافية (UI/UX)' : 'Professional UI/UX Interface Design',
      iconName: 'Layers',
      description: lang === 'ar'
        ? 'تحويل الأفكار البرمجية إلى تصاميم حية وأنيقة تركز على تحسين تفاعل المستخدم وسرعة الإنجاز مع الحفاظ على الهوية البصرية الفريدة.'
        : 'Transforming conceptual scopes into highly polished, intuitive interfaces emphasizing layout balance, user speed, and premium custom identity.',
      features: lang === 'ar' ? [
        'هندسة تجارب الاستخدام وبناء المخططات الهيكلية (Wireframes)',
        'تصميم واجهات عصرية تتوافق 100% مع الهواتف المحمولة والشاشات الكبيرة',
        'إعداد المكونات والـ Design System الخاص بالمشروع لتسهيل عمل المطورين',
        'توفير نماذج تفاعلية حية (Interactive Prototypes) على Figma'
      ] : [
        'UX wireframes mapping precise intuitive journeys',
        'Mobile-responsive responsive visual grids across screen classes',
        'Project Design System building for flawless developer transition',
        'Interactive Figma prototypes showcasing animations and flows'
      ],
      deliveryTime: lang === 'ar' ? 'خلال 7 - 15 يوماً' : '7 - 15 Days',
      priceEstimate: lang === 'ar' ? 'تبدأ من $600' : 'From $600'
    },
    {
      id: 'qa-audit',
      title: lang === 'ar' ? 'تدقيق الجودة الرقمية وهندسة الأداء' : 'Digital Quality Audit & Performance Engineering',
      iconName: 'Cpu',
      description: lang === 'ar'
        ? 'مراجعة شاملة للأكواد والمشاريع القائمة لضمان مطابقتها لأعلى المعايير البرمجية الدولية وسد الثغرات الأمنية وزيادة سرعة الاستجابة.'
        : 'Exhaustive audits of codebases and active products to enforce architectural cleanliness, close security gaps, and maximize rendering and database speeds.',
      features: lang === 'ar' ? [
        'تحليل الأداء وزمن الاستجابة وحل مشاكل البطء والذاكرة',
        'مراجعة بنية الكود البرمجي والتأكد من قابليته للتوسع (Code Review)',
        'فحص الثغرات الأمنية وتسريب البيانات وهجمات الـ XSS/SQLi',
        'تقديم تقرير استشاري شامل مع خطة عمل واضحة للتطوير الفوري'
      ] : [
        'Bottleneck and resource consumption profiling (RAM/latency)',
        'Meticulous codebase reviewing to verify future scalability',
        'Vulnerability assessments checking for XSS, SQLi, and data leaks',
        'Exhaustive reporting detailing clear, step-by-step remediation plans'
      ],
      deliveryTime: lang === 'ar' ? 'خلال 3 - 7 أيام' : '3 - 7 Days',
      priceEstimate: lang === 'ar' ? 'تبدأ من $400' : 'From $400'
    }
  ];
}
