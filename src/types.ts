export interface Project {
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

export interface Service {
  id: string;
  title: string;
  iconName: string; // 'Shield' | 'Cpu' | 'Smartphone' | 'Layers' | 'SearchCode'
  description: string;
  features: string[];
  deliveryTime: string;
  priceEstimate: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'usdt' | 'local_bank' | 'local_wallet';
  details: {
    address?: string;
    network?: string;
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    iban?: string;
    walletNumber?: string;
    instruction?: string;
  };
  iconName: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  telegram: string;
  github: string;
  linkedin: string;
  location: string;
}
