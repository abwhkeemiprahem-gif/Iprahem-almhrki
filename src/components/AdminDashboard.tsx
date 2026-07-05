import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, X, Plus, Trash2, Edit, Save, Copy, Check, LogOut, 
  Info, Briefcase, Shield, CreditCard, Code, FileText, Sparkles, RefreshCw,
  TrendingUp, Inbox, Activity
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { PROJECTS_DATA, SERVICES_DATA, PAYMENT_METHODS, CONTACT_INFO } from '../data';
import LoadingSpinner from './LoadingSpinner';
import StatsDashboard from './StatsDashboard';
import ProjectInsightsDashboard from './ProjectInsightsDashboard';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';


interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { lang, dir } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights' | 'analytics' | 'general' | 'projects' | 'services' | 'payments' | 'inquiries'>('dashboard');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [smartImportText, setSmartImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const fetchAnalytics = async () => {
    if (!auth.currentUser || auth.currentUser.email !== 'abwkreemiprahem@gmail.com') {
      console.log('Firebase Auth is not authenticated as the admin Google account. Skipping analytics fetch.');
      setAnalyticsEvents([]);
      return;
    }
    setLoadingAnalytics(true);
    try {
      const q = query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => {
        const data = doc.data();
        let formattedDate = new Date();
        if (data.timestamp) {
          if (typeof data.timestamp.toDate === 'function') {
            formattedDate = data.timestamp.toDate();
          } else if (data.timestamp.seconds) {
            formattedDate = new Date(data.timestamp.seconds * 1000);
          } else {
            formattedDate = new Date(data.timestamp);
          }
        }
        return {
          docId: doc.id,
          ...data,
          timestamp: formattedDate
        };
      });
      setAnalyticsEvents(list);
    } catch (err) {
      console.error('Error fetching live analytics events:', err);
      handleFirestoreError(err, OperationType.LIST, 'analytics_events');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
      if (user && user.email === 'abwkreemiprahem@gmail.com') {
        setIsAuthenticated(true);
        sessionStorage.setItem('consultant_admin_authed', 'true');
      }
    });
    return () => unsubscribe();
  }, []);

  // General state
  const [general, setGeneral] = useState({
    nameAr: 'م. إبراهيم المحرقي',
    nameEn: 'Eng. Ibrahim Al-Muharqi',
    roleAr: 'مهندس برمجيات ومستشار تقني للحلول السيادية',
    roleEn: 'Software Engineer & Sovereign Solutions Consultant',
    title1Ar: 'نُهندس المستقبل',
    title1En: 'Engineering the Future',
    title2Ar: 'بحلول سيادية آمنة للأتمتة',
    title2En: 'With Secure, Sovereign Solutions',
    descAr: 'مستشار تقني متخصص في بناء البنى التحتية البرمجية المستقلة، وتطوير منصات SaaS المليونية، وتدقيق كفاءة وأمان الأنظمة المعقدة. نجمع بين أمن المعلومات وكفاءة التشغيل الرقمي المتكامل.',
    descEn: 'Technical consultant specialized in building independent software infrastructures, developing multi-million request SaaS platforms, and auditing complex systems for efficiency and security. Merging information security with streamlined digital operations.',
  });

  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    id: '',
    titleAr: '', titleEn: '',
    categoryAr: '', categoryEn: '',
    descriptionAr: '', descriptionEn: '',
    longDescriptionAr: '', longDescriptionEn: '',
    image: '',
    techStack: '',
    demoUrl: '#contact',
    stat1LabelAr: '', stat1LabelEn: '', stat1Val: '',
    stat2LabelAr: '', stat2LabelEn: '', stat2Val: '',
    stat3LabelAr: '', stat3LabelEn: '', stat3Val: '',
  });

  // Services state
  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    id: '',
    titleAr: '', titleEn: '',
    iconName: 'Shield',
    descriptionAr: '', descriptionEn: '',
    featuresAr: '', featuresEn: '',
    deliveryTimeAr: '', deliveryTimeEn: '',
    priceEstimateAr: '', priceEstimateEn: '',
  });

  // Payments & Contacts state
  const [payments, setPayments] = useState<any[]>([]);
  const [contact, setContact] = useState({
    email: '', phone: '', telegram: '', github: '', linkedin: '',
    locationAr: '', locationEn: ''
  });

  // Initialize data on mount / open
  useEffect(() => {
    if (!isOpen) return;

    // Check if session is authenticated
    const authed = sessionStorage.getItem('consultant_admin_authed') === 'true';
    setIsAuthenticated(authed);

    // General Info init
    const localGen = localStorage.getItem('consultant_general');
    if (localGen) {
      setGeneral(JSON.parse(localGen));
    } else {
      localStorage.setItem('consultant_general', JSON.stringify(general));
    }

    // Projects Init
    const localProj = localStorage.getItem('consultant_projects');
    if (localProj) {
      setProjects(JSON.parse(localProj));
    } else {
      // Map standard translations and data.ts to form schema
      const initialProjects = PROJECTS_DATA.map(p => {
        const isSiyaj = p.id === 'siyaj-system';
        const isJourney = p.id === 'letter-journey';
        const isShield = p.id === 'unified-shield';
        
        const titleAr = isSiyaj ? 'نظام سياج للأرشفة السيادية الرقمية (Siyaj System)' 
                     : isJourney ? 'تطبيق رحلة الحروف التعليمي للأطفال'
                     : isShield ? 'منصة درع الاستوديو الموحد لإدارة الـ SaaS'
                     : 'المركز الرقمي العالمي لتدقيق الجودة والامتثال';

        const titleEn = isSiyaj ? 'Siyaj Sovereign Digital Archiving System (Siyaj System)'
                     : isJourney ? 'Letter Journey - Arabic Learning App for Kids'
                     : isShield ? 'Unified-Studio Shield - SaaS Management Platform'
                     : 'Global Digital Center for Quality & Compliance Audit';

        const categoryAr = isSiyaj ? 'الأنظمة السيادية والأرشفة' 
                        : isJourney ? 'التطبيقات التعليمية والألعاب'
                        : 'منصات SaaS الرقمية';

        const categoryEn = isSiyaj ? 'Sovereign Systems & Archiving'
                        : isJourney ? 'Educational & Games'
                        : 'SaaS Platforms';

        const descAr = p.description;
        const descEn = isSiyaj ? 'An integrated platform for sovereign archiving and digital security, dedicated to managing, securing, and protecting sensitive files, providing advanced encryption and strict access control for organizations.'
                     : isJourney ? 'An interactive educational app based on the Noorania methodology to teach children aged 6 and above the basics of reading and writing in Arabic in engaging and interactive ways.'
                     : isShield ? 'An integrated cloud system to manage SaaS platforms and multiple digital payment gateways, providing advanced protection for communication data, cryptocurrency wallets, and tracking invoices and transfers.'
                     : 'An intelligent, independent platform for assessing and auditing software and digital products in accordance with ISO/IEC 25010 standards, ensuring UI compatibility and universal accessibility.';

        const longAr = p.longDescription;
        const longEn = isSiyaj ? 'The "Siyaj" system represents the next generation of digital protection and sovereign archiving platforms, custom-designed for air-gapped or fully secured cloud environments. It provides superior protection for highly sensitive files and documents using RSA-2048 encryption standards and flexible, rigid digital credential management to ensure top privacy.'
                     : isJourney ? '"Letter Journey" aims to simplify Arabic learning for kids through an engaging approach based on the Noorania methodology. It combines interactive lessons, educational mini-games, and outstanding visual feedback, allowing children to learn correct letter pronunciations and spelling with locally tracked progress.'
                     : isShield ? '"Unified-Studio Shield" is a comprehensive security and management solution for cloud product owners and tech companies. It provides unified interfaces to manage invoices, subscriptions, verify secure digital payment gateways (like USDT wallets), and protect sensitive channels against security breaches.'
                     : '"Global Digital Center for Quality & Compliance Audit" provides an advanced assessment engine aimed at measuring code quality, performance, and interfaces for any software application. The platform helps companies optimize their products to comply with the international standard ISO/IEC 25010, ensuring scalability, responsive performance, and universal accessibility.';

        const s1 = p.stats?.[0];
        const s2 = p.stats?.[1];
        const s3 = p.stats?.[2];

        return {
          id: p.id,
          titleAr, titleEn,
          categoryAr, categoryEn,
          descriptionAr: descAr, descriptionEn: descEn,
          longDescriptionAr: longAr, longDescriptionEn: longEn,
          image: p.image,
          techStack: p.techStack.join(', '),
          demoUrl: p.demoUrl || '#contact',
          stat1LabelAr: isSiyaj ? 'معيار التشفير' : isJourney ? 'معدل إكمال الدروس' : isShield ? 'معدل الأمان وحماية البيانات' : 'المعيار المعتمد للتدقيق',
          stat1LabelEn: isSiyaj ? 'Encryption Standard' : isJourney ? 'Lesson Completion Rate' : isShield ? 'Security & Safety Rate' : 'Certified Audit Standard',
          stat1Val: s1?.value || '',
          stat2LabelAr: isSiyaj ? 'سرعة المزامنة الآمنة' : isJourney ? 'الفئة العمرية المستهدفة' : isShield ? 'بوابات دفع مدعومة' : 'دقة التقارير البرمجية',
          stat2LabelEn: isSiyaj ? 'Secure Sync Speed' : isJourney ? 'Target Age Group' : isShield ? 'Supported Gateways' : 'Report Code Accuracy',
          stat2Val: s2?.value || '',
          stat3LabelAr: isSiyaj ? 'مستوى حماية الملفات' : isJourney ? 'تخزين التقدم' : isShield ? 'زمن تأكيد العمليات' : 'توفير تكلفة التطوير',
          stat3LabelEn: isSiyaj ? 'File Protection Level' : isJourney ? 'Progress Storage' : isShield ? 'Tx Confirmation Time' : 'Saved Dev Cost',
          stat3Val: s3?.value || '',
        };
      });
      setProjects(initialProjects);
      localStorage.setItem('consultant_projects', JSON.stringify(initialProjects));
    }

    // Services Init
    const localServ = localStorage.getItem('consultant_services');
    if (localServ) {
      setServices(JSON.parse(localServ));
    } else {
      const initialServices = SERVICES_DATA.map(s => {
        const isSovereign = s.id === 'sovereign-solutions';
        const isUX = s.id === 'ui-ux-design';

        const titleAr = s.title;
        const titleEn = isSovereign ? 'Sovereign Solutions & Automation'
                     : isUX ? 'Professional UI/UX Interface Design'
                     : 'Digital Quality Auditing & Performance Engineering';

        const descAr = s.description;
        const descEn = isSovereign ? 'Designing and building independent software infrastructures, automating complex internal workflows for enterprises to ensure 100% data protection and complete self-reliance.'
                     : isUX ? 'Converting software ideas into vivid and elegant designs focused on enhancing user interactions and task speed while preserving a unique brand identity.'
                     : 'Comprehensive review of code and existing projects to ensure conformity with top international coding standards, secure data leaks, and optimize server response times.';

        const featuresEn = isSovereign ? [
          'Digital archiving systems and sovereign data control',
          'Comprehensive administrative and financial automation software for enterprises and factories',
          'Integration and protection of gateways and systems against breach and failure',
          'Support for local hosting, private cloud, and air-gapped operations (On-Premises)'
        ] : isUX ? [
          'User experience engineering and wireframe structures',
          'Modern UI designs optimized 100% for mobile phones and large displays',
          'Structuring design components & design systems to streamline developer handoff',
          'Providing interactive prototypes on Figma'
        ] : [
          'Performance analysis, response latency, and memory bottleneck troubleshooting',
          'Code review to ensure scalability and structural elegance',
          'Auditing for vulnerabilities, leaks, and XSS/SQLi risks',
          'Providing a comprehensive consulting report with a clear tactical action plan'
        ];

        return {
          id: s.id,
          titleAr, titleEn,
          iconName: s.iconName,
          descriptionAr: descAr, descriptionEn: descEn,
          featuresAr: s.features.join('\n'),
          featuresEn: featuresEn.join('\n'),
          deliveryTimeAr: s.deliveryTime,
          deliveryTimeEn: isSovereign ? 'Within 14 - 30 Days' : isUX ? 'Within 7 - 15 Days' : 'Within 3 - 7 Days',
          priceEstimateAr: s.priceEstimate,
          priceEstimateEn: isSovereign ? 'Starts at $1,500' : isUX ? 'Starts at $600' : 'Starts at $400',
        };
      });
      setServices(initialServices);
      localStorage.setItem('consultant_services', JSON.stringify(initialServices));
    }

    // Payments & Contacts Init
    const localPay = localStorage.getItem('consultant_payments');
    if (localPay) {
      setPayments(JSON.parse(localPay));
    } else {
      localStorage.setItem('consultant_payments', JSON.stringify(PAYMENT_METHODS));
      setPayments(PAYMENT_METHODS);
    }

    const localCont = localStorage.getItem('consultant_contact');
    if (localCont) {
      setContact(JSON.parse(localCont));
    } else {
      const initialContact = {
        ...CONTACT_INFO,
        locationAr: 'القاهرة، مصر (متاح للعمل عن بعد عالمياً)',
        locationEn: 'Cairo, Egypt (Available for remote work globally)'
      };
      localStorage.setItem('consultant_contact', JSON.stringify(initialContact));
      setContact(initialContact);
    }

  }, [isOpen]);

  const fetchInquiries = async () => {
    if (!auth.currentUser || auth.currentUser.email !== 'abwkreemiprahem@gmail.com') {
      console.log('Firebase Auth is not authenticated as the admin Google account. Skipping inquiry fetch.');
      setInquiries([]);
      return;
    }
    setLoadingInquiries(true);
    try {
      const q = query(collection(db, 'technical_audits'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      setInquiries(list);
    } catch (err) {
      console.error('Error fetching live inquiries:', err);
      handleFirestoreError(err, OperationType.LIST, 'technical_audits');
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authChecked) {
      if (activeTab === 'inquiries' || activeTab === 'dashboard') {
        fetchInquiries();
      }
      if (activeTab === 'analytics' || activeTab === 'dashboard') {
        fetchAnalytics();
      }
    }
  }, [isAuthenticated, activeTab, currentUser, authChecked]);

  const updateInquiryStatus = async (docId: string, nextStatus: 'pending' | 'reviewed' | 'completed') => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'technical_audits', docId);
      await updateDoc(docRef, { status: nextStatus });
      setInquiries(prev => prev.map(inq => inq.docId === docId ? { ...inq, status: nextStatus } : inq));
      showSuccess(lang === 'ar' ? 'تم تحديث حالة الطلب بنجاح!' : 'Inquiry status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
      handleFirestoreError(err, OperationType.UPDATE, `technical_audits/${docId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInquiry = async (docId: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب نهائياً؟' : 'Are you sure you want to permanently delete this inquiry?')) return;
    setIsLoading(true);
    try {
      const docRef = doc(db, 'technical_audits', docId);
      await deleteDoc(docRef);
      setInquiries(prev => prev.filter(inq => inq.docId !== docId));
      showSuccess(lang === 'ar' ? 'تم حذف الطلب بنجاح!' : 'Inquiry deleted successfully!');
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      handleFirestoreError(err, OperationType.DELETE, `technical_audits/${docId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD || 'IbrahimSecure2026';
    if (password === envPass) {
      setIsLoading(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        sessionStorage.setItem('consultant_admin_authed', 'true');
        setLoginError('');
        setIsLoading(false);
      }, 700);
    } else {
      setLoginError(lang === 'ar' ? 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.' : 'Incorrect password, please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoginError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user && user.email === 'abwkreemiprahem@gmail.com') {
        setIsAuthenticated(true);
        sessionStorage.setItem('consultant_admin_authed', 'true');
        showSuccess(lang === 'ar' ? 'تم تسجيل الدخول الآمن بنجاح بواسطة حساب Google!' : 'Secure login completed successfully via Google!');
      } else {
        await signOut(auth);
        setLoginError(
          lang === 'ar' 
            ? 'خطأ: هذا الحساب ليس لديه صلاحيات الإدارة.' 
            : 'Error: This Google account does not have admin privileges.'
        );
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setLoginError(err.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setTimeout(() => {
      setIsAuthenticated(false);
      sessionStorage.removeItem('consultant_admin_authed');
      setIsLoading(false);
    }, 500);
  };

  const triggerUpdateEvent = () => {
    window.dispatchEvent(new Event('storage_update'));
  };

  const showSuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Save General Info
  const saveGeneral = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('consultant_general', JSON.stringify(general));
      triggerUpdateEvent();
      setIsLoading(false);
      showSuccess(lang === 'ar' ? 'تم حفظ معلومات الهوية الشخصية بنجاح!' : 'Personal identity information saved successfully!');
    }, 800);
  };

  // Projects CRUD
  const selectProjectForEdit = (proj: any) => {
    setSelectedProjectId(proj.id);
    setProjectForm({ ...proj });
  };

  const clearProjectForm = () => {
    setSelectedProjectId(null);
    setProjectForm({
      id: '',
      titleAr: '', titleEn: '',
      categoryAr: '', categoryEn: '',
      descriptionAr: '', descriptionEn: '',
      longDescriptionAr: '', longDescriptionEn: '',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      techStack: 'React, TypeScript, Tailwind CSS',
      demoUrl: '#contact',
      stat1LabelAr: 'معيار التشفير', stat1LabelEn: 'Encryption Standard', stat1Val: 'RSA-2048',
      stat2LabelAr: 'سرعة المزامنة', stat2LabelEn: 'Sync Speed', stat2Val: '< 15 ms',
      stat3LabelAr: 'حماية الملفات', stat3LabelEn: 'File Protection', stat3Val: 'سيادي بالكامل',
    });
  };

  const handleAddNewProjectClick = () => {
    const hasData = projectForm.id || projectForm.titleAr || projectForm.titleEn;
    if (hasData && !selectedProjectId) {
      saveProject();
    } else {
      clearProjectForm();
    }
  };

  const saveProject = () => {
    if (!projectForm.id) {
      alert(lang === 'ar' ? 'يرجى إدخال معرّف فريد للمشروع' : 'Please provide a unique Project ID');
      return;
    }

    let updated;
    if (selectedProjectId) {
      // Edit existing
      updated = projects.map(p => p.id === selectedProjectId ? { ...projectForm } : p);
    } else {
      // Create new
      if (projects.some(p => p.id === projectForm.id)) {
        alert(lang === 'ar' ? 'معرّف المشروع موجود بالفعل!' : 'Project ID already exists!');
        return;
      }
      updated = [...projects, { ...projectForm }];
    }

    setIsLoading(true);
    setTimeout(() => {
      setProjects(updated);
      localStorage.setItem('consultant_projects', JSON.stringify(updated));
      triggerUpdateEvent();
      clearProjectForm();
      setIsLoading(false);
      showSuccess(lang === 'ar' ? 'تم حفظ المشروع وتحديث المعرض!' : 'Project saved and gallery updated!');
    }, 800);
  };

  const handleSmartImport = () => {
    if (!smartImportText.trim()) {
      setImportStatus(lang === 'ar' ? 'يرجى لصق نص أولاً في صندوق الاستيراد!' : 'Please paste some text in the importer first!');
      return;
    }

    const keysMapping: { keys: string[]; field: keyof typeof projectForm }[] = [
      { keys: ['معرف المشروع الفريد', 'معرف المشروع', 'id', 'المعرف', 'identifier'], field: 'id' },
      { keys: ['رابط المعاينة', 'رابط الكود', 'demo url', 'demourl', 'الرابط', 'رابط', 'url'], field: 'demoUrl' },
      { keys: ['عنوان المشروع عربي', 'العنوان بالعربية', 'العنوان عربي', 'title ar', 'title_ar', 'titlear'], field: 'titleAr' },
      { keys: ['project title english', 'عنوان المشروع إنجليزي', 'العنوان بالإنجليزية', 'العنوان إنجليزي', 'title en', 'title_en', 'titleen'], field: 'titleEn' },
      { keys: ['التصنيف عربي', 'القسم بالعربية', 'القسم عربي', 'category ar', 'category_ar', 'categoryar'], field: 'categoryAr' },
      { keys: ['project category english', 'التصنيف إنجليزي', 'القسم بالإنجليزية', 'القسم إنجليزي', 'category en', 'category_en', 'categoryen'], field: 'categoryEn' },
      { keys: ['صورة المعاينة', 'رابط الصورة', 'الصورة', 'image url', 'imageurl', 'image'], field: 'image' },
      { keys: ['التقنيات المستخدمة', 'التقنيات', 'أدوات التطوير', 'tech stack', 'techstack', 'technologies'], field: 'techStack' },
      { keys: ['وصف مختصر للبطاقة عربي', 'الوصف المختصر عربي', 'وصف البطاقة عربي', 'short description ar', 'description ar', 'descriptionar'], field: 'descriptionAr' },
      { keys: ['card short description english', 'الوصف المختصر إنجليزي', 'وصف البطاقة إنجليزي', 'short description en', 'description en', 'descriptionen'], field: 'descriptionEn' },
      { keys: ['الوصف الكامل للمشروع بالتفصيل عربي', 'الوصف التفصيلي عربي', 'الوصف الكامل عربي', 'long description ar', 'longdescriptionar'], field: 'longDescriptionAr' },
      { keys: ['detailed full description english', 'الوصف التفصيلي إنجليزي', 'الوصف الكامل إنجليزي', 'long description en', 'longdescriptionen'], field: 'longDescriptionEn' },
      { keys: ['stat 1 label ar', 'عنوان الإحصائية 1 عربي', 'إحصائية 1 عربي', 'stat1 label ar', 'stat1labelar', 'عنوان احصائية 1 عربي'], field: 'stat1LabelAr' },
      { keys: ['stat 1 label en', 'عنوان الإحصائية 1 إنجليزي', 'إحصائية 1 إنجليزي', 'stat1 label en', 'stat1labelen', 'عنوان احصائية 1 انجليزي'], field: 'stat1LabelEn' },
      { keys: ['stat 1 value', 'قيمة الإحصائية 1', 'stat1 value', 'stat1val', 'قيمة احصائية 1'], field: 'stat1Val' },
      { keys: ['stat 2 label ar', 'عنوان الإحصائية 2 عربي', 'إحصائية 2 عربي', 'stat2 label ar', 'stat2labelar', 'عنوان احصائية 2 عربي'], field: 'stat2LabelAr' },
      { keys: ['stat 2 label en', 'عنوان الإحصائية 2 إنجليزي', 'إحصائية 2 إنجليزي', 'stat2 label en', 'stat2labelen', 'عنوان احصائية 2 انجليزي'], field: 'stat2LabelEn' },
      { keys: ['stat 2 value', 'قيمة الإحصائية 2', 'stat2 value', 'stat2val', 'قيمة احصائية 2'], field: 'stat2Val' },
      { keys: ['stat 3 label ar', 'عنوان الإحصائية 3 عربي', 'إحصائية 3 عربي', 'stat3 label ar', 'stat3labelar', 'عنوان احصائية 3 عربي'], field: 'stat3LabelAr' },
      { keys: ['stat 3 label en', 'عنوان الإحصائية 3 إنجليزي', 'إحصائية 3 إنجليزي', 'stat3 label en', 'stat3labelen', 'عنوان احصائية 3 انجليزي'], field: 'stat3LabelEn' },
      { keys: ['stat 3 value', 'قيمة الإحصائية 3', 'stat3 value', 'stat3val', 'قيمة احصائية 3'], field: 'stat3Val' }
    ];

    const parsedFields: Partial<typeof projectForm> = {};
    let matchedCount = 0;

    // Normalize text: If there is a colon or equal sign right after brackets on the same line, replace it with a newline 
    // so the exact requested RegExp matches perfectly.
    const normalizedText = smartImportText.replace(/(?:】|\])\s*[:=]\s*/g, '】\n');

    // The precise flexible RegExp requested by the user
    const regex = /(?:【|\[)(.*?)(?:】|\])\s*\n([^【\[]*)/g;
    let match;

    const cleanString = (s: string) => s.replace(/[\(\)\uff08\uff09\s_\-\[\]【】:\u064c\u064b\u064f\u0650\u0651\u0652]/g, '').toLowerCase();

    while ((match = regex.exec(normalizedText)) !== null) {
      const rawKey = match[1].trim();
      let val = match[2].trim();

      // Clean up stray colons or equals if they somehow remained at the start of the value
      if (val.startsWith(':') || val.startsWith('=')) {
        val = val.substring(1).trim();
      }

      if (!rawKey || !val) continue;

      const cleanRawKey = cleanString(rawKey);

      const mapping = keysMapping.find(m =>
        m.keys.some(k => {
          const cleanK = cleanString(k);
          return cleanRawKey.includes(cleanK) || cleanK.includes(cleanRawKey);
        })
      );

      if (mapping) {
        parsedFields[mapping.field] = val;
        matchedCount++;
      }
    }

    if (matchedCount > 0) {
      setProjectForm(prev => ({
        ...prev,
        ...parsedFields
      }));
      setImportStatus(lang === 'ar' 
        ? `نجاح! تم استيراد وتعبئة ${matchedCount} حقول بنجاح وبأمان تام.` 
        : `Success! Auto-parsed and filled ${matchedCount} fields securely.`);
      setTimeout(() => setImportStatus(null), 6000);
    } else {
      setImportStatus(lang === 'ar' 
        ? 'عذراً، لم نتمكن من التعرف على أي حقول متطابقة. تأكد من استخدام التنسيق المطلوب.' 
        : 'Could not identify any matching fields. Please check the format.');
      setTimeout(() => setImportStatus(null), 6000);
    }
  };

  const deleteProject = (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) return;
    setIsLoading(true);
    setTimeout(() => {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('consultant_projects', JSON.stringify(updated));
      triggerUpdateEvent();
      if (selectedProjectId === id) clearProjectForm();
      setIsLoading(false);
      showSuccess(lang === 'ar' ? 'تم حذف المشروع بنجاح!' : 'Project deleted successfully!');
    }, 600);
  };

  // Services CRUD
  const selectServiceForEdit = (serv: any) => {
    setSelectedServiceId(serv.id);
    setServiceForm({ ...serv });
  };

  const clearServiceForm = () => {
    setSelectedServiceId(null);
    setServiceForm({
      id: '',
      titleAr: '', titleEn: '',
      iconName: 'Shield',
      descriptionAr: '', descriptionEn: '',
      featuresAr: '', featuresEn: '',
      deliveryTimeAr: 'خلال 10 أيام', deliveryTimeEn: 'Within 10 Days',
      priceEstimateAr: 'تبدأ من $500', priceEstimateEn: 'Starts at $500',
    });
  };

  const saveService = () => {
    if (!serviceForm.id) {
      alert(lang === 'ar' ? 'يرجى إدخال معرّف فريد للخدمة' : 'Please provide a unique Service ID');
      return;
    }

    let updated;
    if (selectedServiceId) {
      updated = services.map(s => s.id === selectedServiceId ? { ...serviceForm } : s);
    } else {
      if (services.some(s => s.id === serviceForm.id)) {
        alert(lang === 'ar' ? 'معرّف الخدمة موجود بالفعل!' : 'Service ID already exists!');
        return;
      }
      updated = [...services, { ...serviceForm }];
    }

    setIsLoading(true);
    setTimeout(() => {
      setServices(updated);
      localStorage.setItem('consultant_services', JSON.stringify(updated));
      triggerUpdateEvent();
      clearServiceForm();
      setIsLoading(false);
      showSuccess(lang === 'ar' ? 'تم حفظ الخدمة التقنية بنجاح!' : 'Technical service saved successfully!');
    }, 800);
  };

  const deleteService = (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الخدمة؟' : 'Are you sure you want to delete this service?')) return;
    setIsLoading(true);
    setTimeout(() => {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      localStorage.setItem('consultant_services', JSON.stringify(updated));
      triggerUpdateEvent();
      if (selectedServiceId === id) clearServiceForm();
      setIsLoading(false);
      showSuccess(lang === 'ar' ? 'تم حذف الخدمة بنجاح!' : 'Service deleted successfully!');
    }, 600);
  };

  // Payments & Contacts Saving
  const savePaymentsAndContacts = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('consultant_payments', JSON.stringify(payments));
      localStorage.setItem('consultant_contact', JSON.stringify(contact));
      triggerUpdateEvent();
      setIsLoading(false);
      showSuccess(lang === 'ar' ? 'تم حفظ تفاصيل الدفع وقنوات الاتصال بنجاح!' : 'Payment channels and contacts saved successfully!');
    }, 800);
  };

  const updatePaymentField = (index: number, subField: string, value: string) => {
    const updated = [...payments];
    updated[index] = {
      ...updated[index],
      details: {
        ...updated[index].details,
        [subField]: value
      }
    };
    setPayments(updated);
  };

  // EXPORT MATRIX to data.ts code generator
  const generateDataTsCode = () => {
    const cleanProjects = projects.map(p => {
      // Merge live changes from the project form if currently being edited
      const isBeingEdited = selectedProjectId === p.id;
      const targetProj = isBeingEdited ? projectForm : p;
      return {
        id: targetProj.id,
        title: targetProj.titleAr || targetProj.titleEn,
        category: targetProj.categoryAr || targetProj.categoryEn,
        description: targetProj.descriptionAr || targetProj.descriptionEn,
        longDescription: targetProj.longDescriptionAr || targetProj.longDescriptionEn,
        image: targetProj.image,
        techStack: (targetProj.techStack || '').split(',').map((t: string) => t.trim()).filter(Boolean),
        demoUrl: targetProj.demoUrl,
        stats: [
          { label: targetProj.stat1LabelAr, value: targetProj.stat1Val },
          { label: targetProj.stat2LabelAr, value: targetProj.stat2Val },
          { label: targetProj.stat3LabelAr, value: targetProj.stat3Val }
        ]
      };
    });

    // If a brand new project is being created but not yet saved, include it in the compilation
    if (!selectedProjectId && projectForm.id && (projectForm.titleAr || projectForm.titleEn)) {
      if (!cleanProjects.some(p => p.id === projectForm.id)) {
        cleanProjects.push({
          id: projectForm.id,
          title: projectForm.titleAr || projectForm.titleEn,
          category: projectForm.categoryAr || projectForm.categoryEn,
          description: projectForm.descriptionAr || projectForm.descriptionEn,
          longDescription: projectForm.longDescriptionAr || projectForm.longDescriptionEn,
          image: projectForm.image,
          techStack: (projectForm.techStack || '').split(',').map((t: string) => t.trim()).filter(Boolean),
          demoUrl: projectForm.demoUrl,
          stats: [
            { label: projectForm.stat1LabelAr, value: projectForm.stat1Val },
            { label: projectForm.stat2LabelAr, value: projectForm.stat2Val },
            { label: projectForm.stat3LabelAr, value: projectForm.stat3Val }
          ]
        });
      }
    }

    const cleanServices = services.map(s => {
      // Merge live changes from the service form if currently being edited
      const isBeingEdited = selectedServiceId === s.id;
      const targetService = isBeingEdited ? serviceForm : s;
      return {
        id: targetService.id,
        title: targetService.titleAr || targetService.titleEn,
        iconName: targetService.iconName,
        description: targetService.descriptionAr || targetService.descriptionEn,
        features: (targetService.featuresAr || '').split('\n').map((f: string) => f.trim()).filter(Boolean),
        deliveryTime: targetService.deliveryTimeAr,
        priceEstimate: targetService.priceEstimateAr
      };
    });

    // If a brand new service is being created but not yet saved, include it in the compilation
    if (!selectedServiceId && serviceForm.id && (serviceForm.titleAr || serviceForm.titleEn)) {
      if (!cleanServices.some(s => s.id === serviceForm.id)) {
        cleanServices.push({
          id: serviceForm.id,
          title: serviceForm.titleAr || serviceForm.titleEn,
          iconName: serviceForm.iconName,
          description: serviceForm.descriptionAr || serviceForm.descriptionEn,
          features: (serviceForm.featuresAr || '').split('\n').map((f: string) => f.trim()).filter(Boolean),
          deliveryTime: serviceForm.deliveryTimeAr,
          priceEstimate: serviceForm.priceEstimateAr
        });
      }
    }

    const usdt = payments.find(p => p.id === 'usdt-trc20') || PAYMENT_METHODS[0];
    const instapay = payments.find(p => p.id === 'instapay-egypt') || PAYMENT_METHODS[1];
    const bank = payments.find(p => p.id === 'local-bank') || PAYMENT_METHODS[2];

    return `import { Project, Service, PaymentMethod, ContactInfo } from './types';

export const CONTACT_INFO: ContactInfo = {
  email: import.meta.env.VITE_EMAIL || '${contact.email}',
  phone: import.meta.env.VITE_PHONE || '${contact.phone}',
  telegram: import.meta.env.VITE_TELEGRAM || '${contact.telegram}',
  github: import.meta.env.VITE_GITHUB || '${contact.github}',
  linkedin: import.meta.env.VITE_LINKEDIN || '${contact.linkedin}',
  location: import.meta.env.VITE_LOCATION || '${contact.locationAr}',
};

export const PROJECTS_DATA: Project[] = ${JSON.stringify(cleanProjects, null, 2)};

export const SERVICES_DATA: Service[] = ${JSON.stringify(cleanServices, null, 2)};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'usdt-trc20',
    name: 'العملات الرقمية (USDT)',
    type: 'usdt',
    details: {
      address: import.meta.env.VITE_USDT_ADDRESS || '${usdt.details.address}',
      network: import.meta.env.VITE_USDT_NETWORK || '${usdt.details.network}',
      instruction: '${usdt.details.instruction}'
    },
    iconName: 'Wallet'
  },
  {
    id: 'instapay-egypt',
    name: 'تطبيق إنستا باي (InstaPay Egypt)',
    type: 'local_wallet',
    details: {
      walletNumber: import.meta.env.VITE_INSTAPAY_ID || '${instapay.details.walletNumber}',
      accountHolder: import.meta.env.VITE_BANK_ACC_HOLDER || '${instapay.details.accountHolder}',
      instruction: '${instapay.details.instruction}'
    },
    iconName: 'Smartphone'
  },
  {
    id: 'local-bank',
    name: 'حوالة بنكية محلية / دولية',
    type: 'local_bank',
    details: {
      bankName: import.meta.env.VITE_BANK_NAME || '${bank.details.bankName}',
      accountHolder: import.meta.env.VITE_BANK_ACC_HOLDER || '${bank.details.accountHolder}',
      accountNumber: import.meta.env.VITE_BANK_ACC_NUM || '${bank.details.accountNumber}',
      iban: import.meta.env.VITE_BANK_IBAN || '${bank.details.iban}',
      instruction: '${bank.details.instruction}'
    },
    iconName: 'CreditCard'
  }
];
`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-none shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-200">
        
        {/* Banner header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              {isAuthenticated ? <Unlock className="w-5 h-5 animate-pulse" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-white">
                {lang === 'ar' ? 'نواة التحكم في محتوى الموقع // ADMIN SYSTEM' : 'ADMIN CONTROL SYSTEM // KERNEL'}
              </h2>
              <span className="block text-[10px] text-slate-500 font-mono">
                {lang === 'ar' ? 'تعديل حي لبيانات الهوية والمشاريع والخدمات' : 'LIVE IDENTITY & PROJECTS MANAGEMENT OVERRIDES'}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Login Modal */}
        {!isAuthenticated ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center max-w-md mx-auto space-y-6 my-12 relative min-h-[400px]">
            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center">
                <LoadingSpinner isLoading={true} message={lang === 'ar' ? 'جاري التحقق والمزامنة...' : 'Authenticating secure connection...'} />
              </div>
            )}
            <div className="w-16 h-16 rounded-none bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Lock className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? 'تسجيل الدخول الآمن' : 'Secure Core Access'}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs">
                {lang === 'ar' 
                  ? 'يرجى إدخال كلمة مرور الإدارة لتعديل الهوية، المشاريع، الخدمات، وتصدير كود الماتريكس.' 
                  : 'Enter the admin password defined in VITE_ADMIN_PASSWORD or the secure fallback key.'}
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
                  {lang === 'ar' ? 'كلمة المرور الأمنية' : 'ADMIN_CORE_PASSWORD //'}
                </label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-sm focus:border-cyan-400 outline-none text-white font-mono"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 font-mono bg-red-500/5 border border-red-500/20 p-3 text-center">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white text-slate-950 hover:bg-cyan-400 font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                {lang === 'ar' ? 'التحقق والولوج للنظام' : 'AUTHENTICATE & LOG IN'}
              </button>
            </form>

            <div className="w-full flex items-center justify-between gap-4 py-2 text-xs text-slate-600 font-mono uppercase">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span>{lang === 'ar' ? 'أو الدخول الآمن عبر' : 'OR SECURE SIGN IN VIA'}</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3 bg-slate-950 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-900/50 hover:border-cyan-500/50 font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.5 1.7l2.4-2.4C17.3 1.5 14.9 1 12.24 1 6.7 1 2.2 5.5 2.2 11s4.5 10 10.04 10c5.77 0 9.81-4.06 9.81-10 0-.6-.08-1.19-.19-1.715h-9.62z"
                />
              </svg>
              <span>{lang === 'ar' ? 'تسجيل الدخول باستخدام Google' : 'SIGN IN WITH GOOGLE'}</span>
            </button>

            <div className="text-[10px] text-slate-600 font-mono text-center">
              DEFAULT_FALLBACK: IbrahimSecure2026
            </div>
          </div>
        ) : (
          /* Dashboard Core interface */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[50vh]">
            
            {/* Sidebar Navigation Tabs */}
            <div className="w-full md:w-60 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between p-4 space-y-2 shrink-0">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase mb-3 font-mono">
                  {lang === 'ar' ? 'أقسام الإدارة والتحكم' : 'KERNEL_SECTIONS //'}
                </span>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full px-4 py-3 text-xs font-bold transition-all flex items-center gap-3 rounded-none ${
                    activeTab === 'dashboard' 
                      ? 'bg-slate-900 border-l-2 border-cyan-400 text-cyan-400 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'ar' ? 'لوحة المراقبة والإحصاءات' : 'Sovereign Dashboard'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('insights')}
                  className={`w-full px-4 py-3 text-xs font-bold transition-all flex items-center gap-3 rounded-none ${
                    activeTab === 'insights' 
                      ? 'bg-slate-900 border-l-2 border-cyan-400 text-cyan-400 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'ar' ? 'تحليلات ورؤى المشاريع' : 'Project Insights'}</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full px-4 py-3 text-xs font-bold transition-all flex items-center gap-3 rounded-none ${
                    activeTab === 'general' 
                      ? 'bg-slate-900 border-l-2 border-cyan-400 text-cyan-400 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'المعلومات العامة' : 'General Information'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full px-4 py-3 text-xs font-bold transition-all flex items-center gap-3 rounded-none ${
                    activeTab === 'projects' 
                      ? 'bg-slate-900 border-l-2 border-cyan-400 text-cyan-400 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إدارة المشاريع (CRUD)' : 'Projects Archive'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full px-4 py-3 text-xs font-bold transition-all flex items-center gap-3 rounded-none ${
                    activeTab === 'services' 
                      ? 'bg-slate-900 border-l-2 border-cyan-400 text-cyan-400 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'الخدمات والاستشارات' : 'Services & QA'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full px-4 py-3 text-xs font-bold transition-all flex items-center gap-3 rounded-none ${
                    activeTab === 'payments' 
                      ? 'bg-slate-900 border-l-2 border-cyan-400 text-cyan-400 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'قنوات الدفع والتواصل' : 'Payment & Contact'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full px-4 py-3 text-xs font-bold transition-all flex items-center gap-3 rounded-none ${
                    activeTab === 'inquiries' 
                      ? 'bg-slate-900 border-l-2 border-cyan-400 text-cyan-400 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Inbox className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'ar' ? 'طلبات الاستشارة والتحليلات' : 'Live Inquiries Inbox'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full px-4 py-3 text-xs font-bold transition-all flex items-center gap-3 rounded-none ${
                    activeTab === 'analytics' 
                      ? 'bg-slate-900 border-l-2 border-cyan-400 text-cyan-400 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'ar' ? 'سجل تحليلات الزوار' : 'Visitor Analytics Logs'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'خروج الإدارة' : 'Secure Log Out'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[60vh] md:max-h-none relative">
              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/80 z-50 flex items-center justify-center">
                  <LoadingSpinner isLoading={true} message={lang === 'ar' ? 'جاري تحديث البيانات والمزامنة...' : 'Synchronizing database systems...'} />
                </div>
              )}
              
              {/* Success Notification pop message inside editor */}
              {saveSuccess && (
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2 font-mono">
                  <Sparkles className="w-4 h-4 animate-spin-slow text-cyan-400" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* 0. TELEMETRY STATISTICS DASHBOARD */}
              {activeTab === 'dashboard' && (
                <StatsDashboard inquiriesCount={inquiries.length} />
              )}

              {/* PROJECT INSIGHTS DASHBOARD */}
              {activeTab === 'insights' && (
                <ProjectInsightsDashboard projects={projects} inquiries={inquiries} />
              )}

              {/* 1. GENERAL INFORMATION TAB */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {lang === 'ar' ? 'تعديل بيانات الهوية والمعلومات العامة' : 'Override General Identity Info'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar' ? 'تحكم في الاسم، اللقب التقني، وعناوين قسم الاستقبال الرئيسي' : 'Override the primary text displayed in Hero and Headers'}
                      </p>
                    </div>
                    <button
                      onClick={saveGeneral}
                      className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs uppercase flex items-center gap-2 hover:bg-cyan-400 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'حفظ التعديلات' : 'Save Info'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400">الاسم بالكامل (عربي) *</label>
                      <input 
                        type="text" 
                        value={general.nameAr}
                        onChange={(e) => setGeneral({ ...general, nameAr: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400">Full Name (English) *</label>
                      <input 
                        type="text" 
                        value={general.nameEn}
                        onChange={(e) => setGeneral({ ...general, nameEn: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400">اللقب والمهام التقنية (عربي) *</label>
                      <input 
                        type="text" 
                        value={general.roleAr}
                        onChange={(e) => setGeneral({ ...general, roleAr: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400">Technical Role (English) *</label>
                      <input 
                        type="text" 
                        value={general.roleEn}
                        onChange={(e) => setGeneral({ ...general, roleEn: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400">عنوان الهيرو السطر الأول (عربي)</label>
                      <input 
                        type="text" 
                        value={general.title1Ar}
                        onChange={(e) => setGeneral({ ...general, title1Ar: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400">Hero Title Line 1 (English)</label>
                      <input 
                        type="text" 
                        value={general.title1En}
                        onChange={(e) => setGeneral({ ...general, title1En: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400">عنوان الهيرو السطر الثاني (عربي)</label>
                      <input 
                        type="text" 
                        value={general.title2Ar}
                        onChange={(e) => setGeneral({ ...general, title2Ar: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400">Hero Title Line 2 (English)</label>
                      <input 
                        type="text" 
                        value={general.title2En}
                        onChange={(e) => setGeneral({ ...general, title2En: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-mono text-slate-400">الوصف التعريفي للـ Hero (عربي)</label>
                      <textarea 
                        rows={3}
                        value={general.descAr}
                        onChange={(e) => setGeneral({ ...general, descAr: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400 resize-none"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-mono text-slate-400">Hero Subtitle Bio (English)</label>
                      <textarea 
                        rows={3}
                        value={general.descEn}
                        onChange={(e) => setGeneral({ ...general, descEn: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs outline-none text-white focus:border-cyan-400 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PROJECTS ARCHIVE (CRUD) TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {lang === 'ar' ? 'إدارة أرشيف المشاريع المنجزة' : 'Projects Portfolio Management'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar' ? 'أضف مشاريع جديدة أو قم بتعديل مواصفاتها ومؤشرات أدائها فوراً' : 'Add, edit or delete projects. All updates sync instantly.'}
                      </p>
                    </div>
                    <button
                      onClick={handleAddNewProjectClick}
                      className="px-3.5 py-2 border border-slate-750 hover:bg-slate-800 hover:border-slate-600 text-xs font-bold flex items-center gap-2 cursor-pointer text-cyan-400"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إضافة مشروع جديد' : 'Add New Project'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Projects List Selection */}
                    <div className="lg:col-span-4 space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase font-mono mb-1">
                        {lang === 'ar' ? 'المشاريع الحالية' : 'CURRENT_PROJECTS //'}
                      </span>
                      {projects.map((p) => (
                        <div 
                          key={p.id}
                          className={`p-3 border flex items-center justify-between gap-2 transition-all ${
                            selectedProjectId === p.id 
                              ? 'bg-slate-950 border-cyan-500' 
                              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <button
                            onClick={() => selectProjectForEdit(p)}
                            className="flex-1 text-left font-mono text-xs text-slate-200 truncate font-semibold"
                            style={{ direction: 'ltr' }}
                          >
                            {p.id}
                          </button>
                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={() => selectProjectForEdit(p)}
                              className="p-1 hover:bg-slate-850 text-slate-400 hover:text-cyan-400 cursor-pointer"
                              title={lang === 'ar' ? 'تعديل' : 'Edit'}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => deleteProject(p.id)}
                              className="p-1 hover:bg-slate-850 text-slate-400 hover:text-red-400 cursor-pointer"
                              title={lang === 'ar' ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Editor Form Right */}
                    <div className="lg:col-span-8 bg-slate-950/40 border border-slate-800/80 p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <span className="text-xs font-bold text-cyan-400 font-mono uppercase">
                          {selectedProjectId 
                            ? (lang === 'ar' ? `تعديل المشروع: ${selectedProjectId}` : `Edit Project: ${selectedProjectId}`)
                            : (lang === 'ar' ? 'مشروع جديد' : 'New Project Draft')}
                        </span>
                        <div className="flex gap-2">
                          {selectedProjectId && (
                            <button 
                              onClick={clearProjectForm}
                              className="px-2.5 py-1.5 bg-slate-900 text-slate-400 text-[10px] uppercase font-mono hover:text-white cursor-pointer"
                            >
                              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                          )}
                          <button
                            onClick={saveProject}
                            className="px-4 py-1.5 bg-cyan-500 text-slate-950 text-[11px] font-bold uppercase flex items-center gap-1.5 hover:bg-cyan-400 transition-colors cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>
                              {selectedProjectId 
                                ? (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes') 
                                : (lang === 'ar' ? 'تأكيد وإضافة المشروع للمعرض' : 'Confirm & Add Project')}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Smart Project Importer */}
                      <div className="bg-slate-900/50 border border-slate-800 p-4 space-y-3 rounded-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />
                        
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse animate-spin-slow" />
                            <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
                              {lang === 'ar' ? 'المستورد الذكي للمشاريع // SMART IMPORT' : 'SMART PROJECT IMPORTER //'}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 border border-cyan-500/20">
                            {lang === 'ar' ? 'أمان محلي 100%' : '100% LOCAL & SECURE'}
                          </span>
                        </div>

                        <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                          {lang === 'ar' 
                            ? 'الصق بيانات مشروعك أدناه متبوعاً بأقواس الحقول مثل 【عنوان المشروع (عربي)】 أو [عنوان المشروع (عربي)] وسيتم ملء النموذج فوراً وبسرية تامة داخل متصفحك.'
                            : 'Paste your project data below using bracketed fields (e.g., 【Project Title (English)】: Awesome SaaS) to parse and auto-populate all form fields instantly.'}
                        </p>

                        <div className="flex flex-col gap-2.5">
                          <textarea
                            id="smart-import-textarea"
                            rows={3}
                            placeholder={
                              lang === 'ar'
                                ? `أمثلة للوسوم المدعومة:\n【معرف المشروع الفريد (ID)】: smart-dashboard\n【عنوان المشروع (عربي)】: لوحة التحكم الذكية\n【Project Title (English)】: Smart Dashboard\n【التقنيات المستخدمة】: React, Vite, Tailwind\n【قيمة الإحصائية 1】: 99.8%`
                                : `Example format:\n【معرف المشروع الفريد (ID)】: smart-dashboard\n【عنوان المشروع (عربي)】: لوحة التحكم الذكية\n【Project Title (English)】: Smart Dashboard\n【التقنيات المستخدمة】: React, Vite, Tailwind\n【قيمة الإحصائية 1】: 99.8%`
                            }
                            value={smartImportText}
                            onChange={(e) => setSmartImportText(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 p-2.5 text-xs outline-none text-slate-200 focus:border-cyan-400 font-mono resize-y"
                          />

                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <button
                              type="button"
                              onClick={handleSmartImport}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 hover:text-white text-xs font-extrabold uppercase flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-md border border-transparent"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{lang === 'ar' ? 'تحليل وتعبئة البيانات تلقائياً // PARSE & FILL' : 'PARSE & FILL AUTOMATICALLY'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSmartImportText(
`【معرف المشروع الفريد (ID)】: smart-dashboard
【رابط المعاينة / الكود】: https://github.com/ibrahim/dashboard
【عنوان المشروع (عربي)】: نظام تحليل البيانات الذكي
【Project Title (English)】: Intelligent Analytics Dashboard
【التصنيف (عربي)】: أنظمة القياس والتحليلات
【Project Category (English)】: Analytics & Monitoring
【التقنيات المستخدمة】: React, Tailwind CSS, Recharts, Vite
【وصف مختصر للبطاقة (عربي)】: لوحة تحليلات تفاعلية ذكية لقياس أداء البنية التحتية البرمجية.
【Card Short Description (English)】: Interactive analytics dashboard to monitor software infrastructure and telemetry.
【الوصف الكامل للمشروع بالتفصيل (عربي)】: نظام تحليلات متكامل ومستقل يربط كافة خدمات الـ SaaS ويقيس معدل استهلاك الذاكرة وسرعة الرد.
【Detailed Full Description (English)】: A robust sovereign system built to trace, audit, and display server telemetry metrics.
【Stat 1 Label (AR)】: سرعة التحليل
【Stat 1 Label (EN)】: Analysis Latency
【Stat 1 Value】: < 5ms
【Stat 2 Label (AR)】: دقة القياس
【Stat 2 Label (EN)】: Measuring Precision
【Stat 2 Value】: 99.99%`
                                );
                              }}
                              className="text-[10px] text-cyan-400 hover:text-white font-mono hover:underline cursor-pointer"
                            >
                              {lang === 'ar' ? 'تحميل قالب تجريبي' : 'Load Sample Template'}
                            </button>
                          </div>
                        </div>

                        {importStatus && (
                          <div className={`p-2.5 text-xs font-bold border font-mono animate-fade-in ${
                            importStatus.includes('نجاح') || importStatus.includes('Success')
                              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                              : 'bg-red-500/10 border-red-500/30 text-red-400'
                          }`}>
                            {importStatus}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">معرّف المشروع (ID الفريد بالإنجليزية) *</label>
                          <input 
                            type="text" 
                            disabled={!!selectedProjectId}
                            placeholder="siyaj-system"
                            value={projectForm.id}
                            onChange={(e) => setProjectForm({ ...projectForm, id: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 font-mono disabled:opacity-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">رابط المعاينة / الكود (Demo Link) *</label>
                          <input 
                            type="text" 
                            placeholder="https://digital-idea-hub..."
                            value={projectForm.demoUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">عنوان المشروع (عربي) *</label>
                          <input 
                            type="text" 
                            value={projectForm.titleAr}
                            onChange={(e) => setProjectForm({ ...projectForm, titleAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">Project Title (English) *</label>
                          <input 
                            type="text" 
                            value={projectForm.titleEn}
                            onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">التصنيف (عربي) *</label>
                          <input 
                            type="text" 
                            value={projectForm.categoryAr}
                            onChange={(e) => setProjectForm({ ...projectForm, categoryAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">Project Category (English) *</label>
                          <input 
                            type="text" 
                            value={projectForm.categoryEn}
                            onChange={(e) => setProjectForm({ ...projectForm, categoryEn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">صورة المعاينة (رابط الصورة URL)</label>
                          <input 
                            type="text" 
                            value={projectForm.image}
                            onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 font-mono"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">التقنيات المستخدمة (مفصولة بفواصل) *</label>
                          <input 
                            type="text" 
                            placeholder="Vite, React, LocalStorage, Tailwind CSS"
                            value={projectForm.techStack}
                            onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 font-mono"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">وصف مختصر للبطاقة (عربي) *</label>
                          <textarea 
                            rows={2}
                            value={projectForm.descriptionAr}
                            onChange={(e) => setProjectForm({ ...projectForm, descriptionAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 resize-none"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">Card Short Description (English) *</label>
                          <textarea 
                            rows={2}
                            value={projectForm.descriptionEn}
                            onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 resize-none"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">الوصف الكامل للمشروع بالتفصيل (عربي)</label>
                          <textarea 
                            rows={3}
                            value={projectForm.longDescriptionAr}
                            onChange={(e) => setProjectForm({ ...projectForm, longDescriptionAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 resize-none"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">Detailed Full Description (English)</label>
                          <textarea 
                            rows={3}
                            value={projectForm.longDescriptionEn}
                            onChange={(e) => setProjectForm({ ...projectForm, longDescriptionEn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 resize-none"
                          />
                        </div>

                        {/* Stat 1 */}
                        <div className="p-3 bg-slate-950/80 border border-slate-850 space-y-2 md:col-span-2 grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-mono block">Stat 1 Label (AR)</label>
                            <input 
                              type="text" 
                              value={projectForm.stat1LabelAr}
                              onChange={(e) => setProjectForm({ ...projectForm, stat1LabelAr: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-1 text-[11px] text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-mono block">Stat 1 Label (EN)</label>
                            <input 
                              type="text" 
                              value={projectForm.stat1LabelEn}
                              onChange={(e) => setProjectForm({ ...projectForm, stat1LabelEn: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-1 text-[11px] text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-mono block">Stat 1 Value</label>
                            <input 
                              type="text" 
                              value={projectForm.stat1Val}
                              onChange={(e) => setProjectForm({ ...projectForm, stat1Val: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-1 text-[11px] text-white font-mono"
                            />
                          </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-3 bg-slate-950/80 border border-slate-850 space-y-2 md:col-span-2 grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-mono block">Stat 2 Label (AR)</label>
                            <input 
                              type="text" 
                              value={projectForm.stat2LabelAr}
                              onChange={(e) => setProjectForm({ ...projectForm, stat2LabelAr: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-1 text-[11px] text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-mono block">Stat 2 Label (EN)</label>
                            <input 
                              type="text" 
                              value={projectForm.stat2LabelEn}
                              onChange={(e) => setProjectForm({ ...projectForm, stat2LabelEn: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-1 text-[11px] text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-mono block">Stat 2 Value</label>
                            <input 
                              type="text" 
                              value={projectForm.stat2Val}
                              onChange={(e) => setProjectForm({ ...projectForm, stat2Val: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-1 text-[11px] text-white font-mono"
                            />
                          </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="p-3 bg-slate-950/80 border border-slate-850 space-y-2 md:col-span-2 grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-mono block">Stat 3 Label (AR)</label>
                            <input 
                              type="text" 
                              value={projectForm.stat3LabelAr}
                              onChange={(e) => setProjectForm({ ...projectForm, stat3LabelAr: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-1 text-[11px] text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-mono block">Stat 3 Label (EN)</label>
                            <input 
                              type="text" 
                              value={projectForm.stat3LabelEn}
                              onChange={(e) => setProjectForm({ ...projectForm, stat3LabelEn: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-1 text-[11px] text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-mono block">Stat 3 Value</label>
                            <input 
                              type="text" 
                              value={projectForm.stat3Val}
                              onChange={(e) => setProjectForm({ ...projectForm, stat3Val: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-1 text-[11px] text-white font-mono"
                            />
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 3. SERVICES & CONSULTING TAB */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {lang === 'ar' ? 'إدارة كتالوج الخدمات والاستشارات' : 'Services Catalogue Override'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar' ? 'تحكم بالخدمات المهنية، المدد، ومؤشرات الميزانية لكل خدمة' : 'Control services details, feature points, delivery and prices'}
                      </p>
                    </div>
                    <button
                      onClick={clearServiceForm}
                      className="px-3.5 py-2 border border-slate-750 hover:bg-slate-800 hover:border-slate-600 text-xs font-bold flex items-center gap-2 cursor-pointer text-cyan-400"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* List of services */}
                    <div className="lg:col-span-4 space-y-2">
                      <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase font-mono mb-1">
                        {lang === 'ar' ? 'الخدمات الحالية' : 'SERVICES_CATALOG //'}
                      </span>
                      {services.map((s) => (
                        <div 
                          key={s.id}
                          className={`p-3 border flex items-center justify-between gap-2 transition-all ${
                            selectedServiceId === s.id 
                              ? 'bg-slate-950 border-cyan-500' 
                              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <button
                            onClick={() => selectServiceForEdit(s)}
                            className="flex-1 text-left font-mono text-xs text-slate-200 truncate font-semibold"
                            style={{ direction: 'ltr' }}
                          >
                            {s.id}
                          </button>
                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={() => selectServiceForEdit(s)}
                              className="p-1 hover:bg-slate-850 text-slate-400 hover:text-cyan-400 cursor-pointer"
                              title={lang === 'ar' ? 'تعديل' : 'Edit'}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => deleteService(s.id)}
                              className="p-1 hover:bg-slate-850 text-slate-400 hover:text-red-400 cursor-pointer"
                              title={lang === 'ar' ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Editor Right */}
                    <div className="lg:col-span-8 bg-slate-950/40 border border-slate-800/80 p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <span className="text-xs font-bold text-cyan-400 font-mono uppercase">
                          {selectedServiceId 
                            ? (lang === 'ar' ? `تعديل خدمة: ${selectedServiceId}` : `Edit Service: ${selectedServiceId}`)
                            : (lang === 'ar' ? 'خدمة جديدة' : 'New Service Draft')}
                        </span>
                        <div className="flex gap-2">
                          {selectedServiceId && (
                            <button 
                              onClick={clearServiceForm}
                              className="px-2.5 py-1.5 bg-slate-900 text-slate-400 text-[10px] uppercase font-mono hover:text-white cursor-pointer"
                            >
                              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                          )}
                          <button
                            onClick={saveService}
                            className="px-4 py-1.5 bg-cyan-500 text-slate-950 text-[11px] font-bold uppercase flex items-center gap-1.5 hover:bg-cyan-400 transition-colors cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'حفظ الخدمة' : 'Save Service'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">معرّف الخدمة (ID فريد بالإنجليزية) *</label>
                          <input 
                            type="text" 
                            disabled={!!selectedServiceId}
                            placeholder="custom-software"
                            value={serviceForm.id}
                            onChange={(e) => setServiceForm({ ...serviceForm, id: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 font-mono disabled:opacity-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">اسم الأيقونة (من Lucide: Shield, Layers, Cpu)</label>
                          <input 
                            type="text" 
                            value={serviceForm.iconName}
                            onChange={(e) => setServiceForm({ ...serviceForm, iconName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">عنوان الخدمة (عربي) *</label>
                          <input 
                            type="text" 
                            value={serviceForm.titleAr}
                            onChange={(e) => setServiceForm({ ...serviceForm, titleAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">Service Title (English) *</label>
                          <input 
                            type="text" 
                            value={serviceForm.titleEn}
                            onChange={(e) => setServiceForm({ ...serviceForm, titleEn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">شرح للخدمة (عربي) *</label>
                          <textarea 
                            rows={2}
                            value={serviceForm.descriptionAr}
                            onChange={(e) => setServiceForm({ ...serviceForm, descriptionAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 resize-none"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">Service Description (English) *</label>
                          <textarea 
                            rows={2}
                            value={serviceForm.descriptionEn}
                            onChange={(e) => setServiceForm({ ...serviceForm, descriptionEn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">مدة التسليم التقريبية (عربي)</label>
                          <input 
                            type="text" 
                            value={serviceForm.deliveryTimeAr}
                            onChange={(e) => setServiceForm({ ...serviceForm, deliveryTimeAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">Estimated Timeline (English)</label>
                          <input 
                            type="text" 
                            value={serviceForm.deliveryTimeEn}
                            onChange={(e) => setServiceForm({ ...serviceForm, deliveryTimeEn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">الميزانية المتوقعة (عربي)</label>
                          <input 
                            type="text" 
                            value={serviceForm.priceEstimateAr}
                            onChange={(e) => setServiceForm({ ...serviceForm, priceEstimateAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400">Estimated Budget (English)</label>
                          <input 
                            type="text" 
                            value={serviceForm.priceEstimateEn}
                            onChange={(e) => setServiceForm({ ...serviceForm, priceEstimateEn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">المخرجات / النقاط الفرعية (عربي، مخرج واحد في كل سطر) *</label>
                          <textarea 
                            rows={3}
                            placeholder="مخرج 1&#10;مخرج 2"
                            value={serviceForm.featuresAr}
                            onChange={(e) => setServiceForm({ ...serviceForm, featuresAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 font-sans"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono text-slate-400">Features / Deliverable Points (English, one per line) *</label>
                          <textarea 
                            rows={3}
                            placeholder="Deliverable 1&#10;Deliverable 2"
                            value={serviceForm.featuresEn}
                            onChange={(e) => setServiceForm({ ...serviceForm, featuresEn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs outline-none text-white focus:border-cyan-400 font-sans"
                          />
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 4. PAYMENT METHODS & CONTACTS OVERRIDES */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {lang === 'ar' ? 'إدارة قنوات الدفع ومعلومات التواصل' : 'Payment Details & Contacts Overrides'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar' ? 'تعديل الحساب البنكي (الكريمي) ومحافظ الـ USDT وأرقام التواصل' : 'Modify bank, Instapay, USDT network address and social links'}
                      </p>
                    </div>
                    <button
                      onClick={savePaymentsAndContacts}
                      className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs uppercase flex items-center gap-2 hover:bg-cyan-400 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'حفظ البيانات' : 'Save Details'}</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* USDT Details */}
                    <div className="p-4 bg-slate-950/40 border border-slate-800 space-y-4">
                      <span className="text-[10px] text-cyan-400 font-mono tracking-wider block font-bold">USDT_WALLET_OVERRIDE //</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">USDT Address (العنوان للتبرع أو الدفع)</label>
                          <input 
                            type="text" 
                            value={payments.find(p => p.id === 'usdt-trc20')?.details?.address || ''}
                            onChange={(e) => updatePaymentField(0, 'address', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">USDT Network (الشبكة)</label>
                          <input 
                            type="text" 
                            value={payments.find(p => p.id === 'usdt-trc20')?.details?.network || ''}
                            onChange={(e) => updatePaymentField(0, 'network', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* InstaPay Egypt Details */}
                    <div className="p-4 bg-slate-950/40 border border-slate-800 space-y-4">
                      <span className="text-[10px] text-cyan-400 font-mono tracking-wider block font-bold">INSTAPAY_WALLET_OVERRIDE //</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">عنوان الدفع إنستاباي (InstaPay ID)</label>
                          <input 
                            type="text" 
                            value={payments.find(p => p.id === 'instapay-egypt')?.details?.walletNumber || ''}
                            onChange={(e) => updatePaymentField(1, 'walletNumber', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">اسم صاحب الحساب</label>
                          <input 
                            type="text" 
                            value={payments.find(p => p.id === 'instapay-egypt')?.details?.accountHolder || ''}
                            onChange={(e) => updatePaymentField(1, 'accountHolder', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Al-Kurimi Bank details */}
                    <div className="p-4 bg-slate-950/40 border border-slate-800 space-y-4">
                      <span className="text-[10px] text-cyan-400 font-mono tracking-wider block font-bold">LOCAL_BANK_TRANSFERS //</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">اسم البنك (مثال: بنك الكريمي الإسلامي)</label>
                          <input 
                            type="text" 
                            value={payments.find(p => p.id === 'local-bank')?.details?.bankName || ''}
                            onChange={(e) => updatePaymentField(2, 'bankName', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">اسم المستفيد بالكامل</label>
                          <input 
                            type="text" 
                            value={payments.find(p => p.id === 'local-bank')?.details?.accountHolder || ''}
                            onChange={(e) => updatePaymentField(2, 'accountHolder', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">رقم الحساب</label>
                          <input 
                            type="text" 
                            value={payments.find(p => p.id === 'local-bank')?.details?.accountNumber || ''}
                            onChange={(e) => updatePaymentField(2, 'accountNumber', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">رقم الآيبان (IBAN)</label>
                          <input 
                            type="text" 
                            value={payments.find(p => p.id === 'local-bank')?.details?.iban || ''}
                            onChange={(e) => updatePaymentField(2, 'iban', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contacts Details Info */}
                    <div className="p-4 bg-slate-950/40 border border-slate-800 space-y-4">
                      <span className="text-[10px] text-cyan-400 font-mono tracking-wider block font-bold">CONTACT_INFO_OVERRIDE //</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">البريد الإلكتروني (Email)</label>
                          <input 
                            type="email" 
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">رقم الهاتف الفعلي (Phone)</label>
                          <input 
                            type="text" 
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">رابط تليجرام (Telegram Link)</label>
                          <input 
                            type="text" 
                            value={contact.telegram}
                            onChange={(e) => setContact({ ...contact, telegram: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">رابط GitHub</label>
                          <input 
                            type="text" 
                            value={contact.github}
                            onChange={(e) => setContact({ ...contact, github: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">رابط LinkedIn</label>
                          <input 
                            type="text" 
                            value={contact.linkedin}
                            onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500">الموقع الجغرافي (عربي)</label>
                          <input 
                            type="text" 
                            value={contact.locationAr}
                            onChange={(e) => setContact({ ...contact, locationAr: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 5. INQUIRIES & AUDITS TAB */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {lang === 'ar' ? 'صندوق الوارد لطلبات الاستشارة والفحص التقني' : 'Live Consultation & Technical Audit Inbox'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar' ? 'أرشيف حقيقي متصل بقاعدة بيانات فيربايس لمتابعة رسائل العملاء والتحكم بحالاتها الأمنية' : 'Production-grade data layer from Firebase: read user inputs, modify status or prune entries'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchInquiries}
                      disabled={loadingInquiries}
                      className="px-3.5 py-2 border border-slate-750 hover:bg-slate-800 hover:border-slate-600 text-xs font-bold flex items-center gap-2 cursor-pointer text-cyan-400 font-mono disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? 'animate-spin' : ''}`} />
                      <span>{lang === 'ar' ? 'تحديث حقيقي' : 'RELOAD DB'}</span>
                    </button>
                  </div>

                  {!currentUser || currentUser.email !== 'abwkreemiprahem@gmail.com' ? (
                    <div className="py-8 px-4 border border-cyan-500/30 bg-cyan-500/5 text-center space-y-4">
                      <Shield className="w-8 h-8 text-cyan-400 mx-auto" />
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-white">
                          {lang === 'ar' ? 'مطلوب تسجيل الدخول الآمن بواسطة Google' : 'Secure Google Sign-In Required'}
                        </p>
                        <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
                          {lang === 'ar' 
                            ? 'لقد قمت بتسجيل الدخول باستخدام كلمة مرور الإدارة المحلية. للوصول الآمن وقراءة الرسائل والطلبات الحية المخزنة في قاعدة بيانات Firebase، يرجى تفعيل الربط عبر Google أولاً.' 
                            : 'You are signed in with the local password. To securely read and write production inquiries stored in Firestore, please connect via Google Authentication.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="px-4 py-2 bg-white text-slate-950 hover:bg-cyan-400 font-bold text-xs rounded-none cursor-pointer transition-colors"
                      >
                        {lang === 'ar' ? 'ربط الحساب وتسجيل الدخول عبر Google' : 'Connect Account & Sign-In via Google'}
                      </button>
                    </div>
                  ) : loadingInquiries ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent animate-spin rounded-full mb-3" />
                      <p className="text-xs font-mono text-slate-500">{lang === 'ar' ? 'جاري الاتصال بقاعدة بيانات فيربايس...' : 'Querying production Firestore...'}</p>
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="py-12 border border-dashed border-slate-850 text-center space-y-2">
                      <Inbox className="w-8 h-8 text-slate-650 mx-auto animate-pulse" />
                      <p className="text-xs font-mono text-slate-400">{lang === 'ar' ? 'لا توجد طلبات واردة حالياً في قاعدة البيانات.' : 'No active inquiries stored in database.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inq) => (
                        <div key={inq.docId} className={`p-4 bg-slate-950/40 border transition-all ${inq.requestedAudit ? 'border-cyan-500/20 shadow-lg shadow-cyan-500/5' : 'border-slate-850'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-900 pb-3 mb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-white">{inq.name}</span>
                                <span className="text-xs font-mono text-slate-500">({inq.email})</span>
                                
                                {inq.requestedAudit && (
                                  <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-none uppercase animate-pulse">
                                    {lang === 'ar' ? 'تقرير فحص فني مطلوب' : 'Technical Audit Requested'}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                ID: {inq.id}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={inq.status || 'pending'}
                                onChange={(e) => updateInquiryStatus(inq.docId, e.target.value as any)}
                                className={`text-[10px] font-mono font-bold p-1 border outline-none cursor-pointer ${
                                  inq.status === 'completed' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' :
                                  inq.status === 'reviewed' ? 'bg-indigo-950/60 border-indigo-500 text-indigo-400' :
                                  'bg-amber-950/60 border-amber-500 text-amber-400'
                                }`}
                              >
                                <option value="pending" className="bg-slate-950 text-amber-400">{lang === 'ar' ? 'قيد الانتظار' : 'PENDING'}</option>
                                <option value="reviewed" className="bg-slate-950 text-indigo-400">{lang === 'ar' ? 'تمت المراجعة' : 'REVIEWED'}</option>
                                <option value="completed" className="bg-slate-950 text-emerald-400">{lang === 'ar' ? 'مكتمل' : 'COMPLETED'}</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => deleteInquiry(inq.docId)}
                                className="p-1 border border-slate-800 hover:border-red-500 text-slate-500 hover:text-red-400 transition-colors cursor-pointer bg-slate-950"
                                title={lang === 'ar' ? 'حذف الطلب' : 'Delete Request'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-slate-900 pb-3 mb-3 text-slate-400">
                            <div>
                              <span className="text-slate-600 block text-[9px] uppercase">{lang === 'ar' ? 'الخدمة المطلوبة' : 'SERVICE REQUESTED'}</span>
                              <span className="text-white font-sans">{inq.service}</span>
                            </div>
                            <div>
                              <span className="text-slate-600 block text-[9px] uppercase">{lang === 'ar' ? 'نطاق الميزانية' : 'ESTIMATED BUDGET'}</span>
                              <span className="text-white font-mono">{inq.budget}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-slate-600 font-mono block text-[9px] uppercase">{lang === 'ar' ? 'تفاصيل الرسالة ومواصفات المشروع' : 'CLIENT SPECIFICATIONS MESSAGE'}</span>
                            <div className="bg-slate-950 border border-slate-900 p-3 text-slate-300 text-xs font-sans whitespace-pre-line leading-relaxed">
                              {inq.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 6. SOVEREIGN VISITOR ANALYTICS TAB */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {lang === 'ar' ? 'مركز مراقبة الحركة وتحليلات الزوار' : 'Sovereign Traffic & Telemetry Center'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar' ? 'مراقبة فورية وتحليلات أداء الموقع مع حماية كاملة لخصوصية زوارك' : 'Real-time privacy-first analytics directly loaded from your secure Firestore data layer'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchAnalytics}
                      disabled={loadingAnalytics}
                      className="px-3.5 py-2 border border-slate-750 hover:bg-slate-800 hover:border-slate-600 text-xs font-bold flex items-center gap-2 cursor-pointer text-cyan-400 font-mono disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                      <span>{lang === 'ar' ? 'تحديث الإحصاءات' : 'REFRESH METRICS'}</span>
                    </button>
                  </div>

                  {!currentUser || currentUser.email !== 'abwkreemiprahem@gmail.com' ? (
                    <div className="py-8 px-4 border border-cyan-500/30 bg-cyan-500/5 text-center space-y-4">
                      <Shield className="w-8 h-8 text-cyan-400 mx-auto" />
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-white">
                          {lang === 'ar' ? 'مطلوب تسجيل الدخول الآمن بواسطة Google' : 'Secure Google Sign-In Required'}
                        </p>
                        <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
                          {lang === 'ar' 
                            ? 'لقد قمت بتسجيل الدخول باستخدام كلمة مرور الإدارة المحلية. للوصول الآمن وقراءة تحليلات الزوار الحية المخزنة في قاعدة بيانات Firebase، يرجى تفعيل الربط عبر Google أولاً.' 
                            : 'You are signed in with the local password. To securely read and compile production visitor analytics stored in Firestore, please connect via Google Authentication.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="px-4 py-2 bg-white text-slate-950 hover:bg-cyan-400 font-bold text-xs rounded-none cursor-pointer transition-colors"
                      >
                        {lang === 'ar' ? 'ربط الحساب وتسجيل الدخول عبر Google' : 'Connect Account & Sign-In via Google'}
                      </button>
                    </div>
                  ) : loadingAnalytics ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent animate-spin rounded-full mb-3" />
                      <p className="text-xs font-mono text-slate-500">{lang === 'ar' ? 'جاري تجميع تحليلات الزوار...' : 'Querying secure telemetry logs...'}</p>
                    </div>
                  ) : analyticsEvents.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-slate-800 text-slate-500 text-xs font-mono">
                      {lang === 'ar' ? 'لا يوجد أحداث مسجلة حالياً في قاعدة البيانات.' : 'No analytics events registered in Firestore yet. Try visiting sections first.'}
                    </div>
                  ) : (() => {
                    const totalInteractions = analyticsEvents.length;
                    const uniqueSessions = new Set(analyticsEvents.map(e => e.sessionId)).size;
                    const chatbotInteractions = analyticsEvents.filter(e => e.eventType === 'chatbot_interact').length;
                    const contactFormSubmissions = analyticsEvents.filter(e => e.eventType === 'contact_form').length;
                    const langSwitches = analyticsEvents.filter(e => e.eventType === 'lang_switch').length;
                    
                    const sectionViewsMap: Record<string, number> = {};
                    analyticsEvents.forEach(e => {
                      if (e.eventType === 'section_view' && e.sectionId) {
                        sectionViewsMap[e.sectionId] = (sectionViewsMap[e.sectionId] || 0) + 1;
                      }
                    });
                    
                    const maxSectionViews = Math.max(...Object.values(sectionViewsMap), 1);

                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-slate-950 border border-slate-800 p-4 relative overflow-hidden">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">ANON_UNIQUE_VISITORS //</span>
                            <span className="text-2xl font-bold text-white font-mono">{uniqueSessions}</span>
                            <div className="text-[10px] text-cyan-400 mt-2 flex items-center gap-1 font-mono">
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                              <span>{lang === 'ar' ? 'جلسة فريدة نشطة' : 'Active Unique Sessions'}</span>
                            </div>
                          </div>

                          <div className="bg-slate-950 border border-slate-800 p-4 relative overflow-hidden">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">TOTAL_TELEMETRY_LOGS //</span>
                            <span className="text-2xl font-bold text-white font-mono">{totalInteractions}</span>
                            <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-mono">
                              <span>{lang === 'ar' ? 'إجمالي الأحداث المرصودة' : 'Logged interactions'}</span>
                            </div>
                          </div>

                          <div className="bg-slate-950 border border-slate-800 p-4 relative overflow-hidden">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">CHAT_CONSULTATIONS //</span>
                            <span className="text-2xl font-bold text-cyan-400 font-mono">{chatbotInteractions}</span>
                            <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-mono">
                              <span>{lang === 'ar' ? 'استفسارات الذكاء الاصطناعي' : 'AI chatbot queries'}</span>
                            </div>
                          </div>

                          <div className="bg-slate-950 border border-slate-800 p-4 relative overflow-hidden">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">CTA_CONVERSIONS //</span>
                            <span className="text-2xl font-bold text-emerald-400 font-mono">{contactFormSubmissions}</span>
                            <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-mono">
                              <span>{lang === 'ar' ? 'طلبات فحص تقني مكتملة' : 'Submissions received'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="p-4 bg-slate-950 border border-slate-800 space-y-4">
                            <div className="border-b border-slate-850 pb-2">
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">SECTION_POPULARITY_HEATMAP //</span>
                            </div>
                            
                            <div className="space-y-3.5 pt-2">
                              {['hero', 'portfolio', 'services', 'roadmap', 'testimonials', 'payments', 'contact'].map(secId => {
                                const count = sectionViewsMap[secId] || 0;
                                const pct = Math.round((count / maxSectionViews) * 100);
                                return (
                                  <div key={secId} className="space-y-1">
                                    <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                                      <span className="uppercase font-semibold text-slate-200">#{secId}</span>
                                      <span className="text-cyan-400 text-[10px]">{count} views ({pct}%)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-900 border border-slate-850/50 overflow-hidden">
                                      <div 
                                        className="h-full bg-cyan-400 transition-all duration-500" 
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="p-4 bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
                            <div>
                              <div className="border-b border-slate-850 pb-2">
                                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">INTERACTIONS_BREAKDOWN //</span>
                              </div>
                              <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between font-mono text-xs border-b border-slate-900 pb-2.5">
                                  <span className="text-slate-400">{lang === 'ar' ? 'تغيير لغة الموقع' : 'Language switches'}</span>
                                  <span className="text-white font-bold">{langSwitches}</span>
                                </div>
                                <div className="flex items-center justify-between font-mono text-xs border-b border-slate-900 pb-2.5">
                                  <span className="text-slate-400">{lang === 'ar' ? 'أسئلة المستشار الذكي' : 'Sovereign AI chatbot triggers'}</span>
                                  <span className="text-cyan-400 font-bold">{chatbotInteractions}</span>
                                </div>
                                <div className="flex items-center justify-between font-mono text-xs border-b border-slate-900 pb-2.5">
                                  <span className="text-slate-400">{lang === 'ar' ? 'نماذج استفسار بريدية ومراجعات' : 'Inquiries & audit requests'}</span>
                                  <span className="text-emerald-400 font-bold">{contactFormSubmissions}</span>
                                </div>
                                <div className="flex items-center justify-between font-mono text-xs pb-1">
                                  <span className="text-slate-400">{lang === 'ar' ? 'زيارات وتمرير الصفحات المبرهن' : 'Unique viewport entries'}</span>
                                  <span className="text-white font-bold">
                                    {analyticsEvents.filter(e => e.eventType === 'page_view' || e.eventType === 'section_view').length}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 text-[10px] text-slate-400 font-mono leading-relaxed mt-2">
                              {lang === 'ar'
                                ? 'يتم تشفير عناوين IP وعمل بصمات عشوائية مؤقتة للجلسات لحماية هوية زوار بوابتك الرقمية السيادية تماشياً مع معايير GDPR.'
                                : 'Session IDs are hashed dynamically and user agents are truncated. This tracking interface operates 100% compliant with GDPR regulations.'}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-800 space-y-3">
                          <div className="border-b border-slate-850 pb-2">
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">REAL_TIME_EVENT_STREAM //</span>
                          </div>

                          <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1 font-mono text-[10px] text-slate-300">
                            {analyticsEvents.slice(0, 80).map((evt) => {
                              let descText = '';
                              let descColor = 'text-cyan-400';

                              if (evt.eventType === 'page_view') {
                                descText = `Initial load entry point. Screen: ${evt.details?.screenResolution || 'unknown'}`;
                                descColor = 'text-slate-400';
                              } else if (evt.eventType === 'section_view') {
                                descText = `Engaged with section #${evt.sectionId} for >1.2s`;
                                descColor = 'text-cyan-400';
                              } else if (evt.eventType === 'lang_switch') {
                                descText = `Toggled site locale to [${evt.details?.lang?.toUpperCase() || 'locale'}]`;
                                descColor = 'text-indigo-400';
                              } else if (evt.eventType === 'chatbot_interact') {
                                if (evt.details?.action === 'open') {
                                  descText = 'Opened the floating AI chatbot advisor';
                                } else if (evt.details?.action === 'close') {
                                  descText = 'Closed the floating AI chatbot advisor';
                                } else if (evt.details?.action === 'send_message') {
                                  descText = `Dispatched message to Sovereign AI (Length: ${evt.details?.textLength || 0})`;
                                } else {
                                  descText = `Chatbot interaction: ${evt.details?.action || 'unknown'}`;
                                }
                                descColor = 'text-sky-400';
                              } else if (evt.eventType === 'contact_form') {
                                descText = `SUCCESSFUL submission of Technical Audit inquiry. Budget tier: [${evt.details?.budget || 'N/A'}]`;
                                descColor = 'text-emerald-400 font-bold';
                              } else {
                                descText = `Triggered event: ${evt.eventType}`;
                              }

                              return (
                                <div 
                                  key={evt.docId}
                                  className="p-2 bg-slate-900/40 border border-slate-850/50 hover:bg-slate-900 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                                >
                                  <div className="flex items-start sm:items-center gap-2">
                                    <span className="text-slate-500 text-[9px] font-medium shrink-0">
                                      {evt.timestamp.toLocaleTimeString()}
                                    </span>
                                    <span className="bg-slate-950 text-slate-400 px-1.5 py-0.5 border border-slate-800 text-[8px] tracking-wider shrink-0 font-bold">
                                      {evt.sessionId ? `SESS_${evt.sessionId.substring(5, 11).toUpperCase()}` : 'ANON'}
                                    </span>
                                    <span className={`text-[10px] ${descColor}`}>
                                      {descText}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-slate-500 shrink-0 self-end sm:self-auto italic">
                                    {evt.language || 'en'} | {evt.timestamp.toLocaleDateString()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          </div>
        )}

        {/* EXPORT DATA.TS MATRIX COMPONENT FOOTER BUTTON */}
        {isAuthenticated && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-none bg-cyan-400 animate-ping shrink-0" />
              <span className="text-[10px] font-mono text-slate-400">
                {lang === 'ar' ? 'التحديثات الحالية مخزنة بالكامل محلياً وبالمعاينة الحية.' : 'All local storage overrides are synced in live preview.'}
              </span>
            </div>
            
            <div className="flex gap-2">
              <ExportSection onGenerateCode={generateDataTsCode} lang={lang} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

interface ExportSectionProps {
  onGenerateCode: () => string;
  lang: string;
}

function ExportSection({ onGenerateCode, lang }: ExportSectionProps) {
  const [showArea, setShowArea] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleExport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const code = onGenerateCode();
    
    // Copy to clipboard
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowArea(true);
  };

  return (
    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
      <button
        type="button"
        id="export-matrix-btn"
        onClick={handleExport}
        className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 hover:text-white font-extrabold text-xs uppercase flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/10"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-slate-950" />
        ) : (
          <FileText className="w-3.5 h-3.5" />
        )}
        <span>
          {copied
            ? lang === 'ar'
              ? 'تم نسخ الكود!'
              : 'COPIED!'
            : lang === 'ar'
            ? 'تصدير كود البيانات المركزي // EXPORT MATRIX'
            : 'EXPORT DATA MATRIX // COPY'}
        </span>
      </button>

      {showArea && (
        <div className="fixed inset-x-4 bottom-20 md:bottom-24 z-50 max-w-4xl mx-auto bg-slate-950 border border-slate-800 p-4 shadow-2xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
            <span>EXPORTED DATA MATRIX // DATA.TS</span>
            <button 
              type="button" 
              onClick={() => setShowArea(false)} 
              className="text-slate-450 hover:text-white font-sans text-xs underline cursor-pointer"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
          <textarea
            ref={textareaRef}
            readOnly
            id="export-matrix-textarea"
            value={onGenerateCode()}
            className="w-full h-48 bg-slate-900 text-slate-300 p-3 font-mono text-xs border border-slate-800 outline-none focus:border-cyan-500"
            onClick={(e) => {
              (e.target as HTMLTextAreaElement).select();
            }}
          />
          <div className="text-[10px] text-slate-500 font-mono">
            {lang === 'ar'
              ? 'استبدل محتوى ملف /src/data.ts بالكامل بهذا الكود لحفظ التغييرات بشكل دائم.'
              : 'Replace the entire contents of /src/data.ts with this code to save changes permanently.'}
          </div>
        </div>
      )}
    </div>
  );
}
