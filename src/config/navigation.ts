export interface SubNavItem {
  title: string;
  desc: string;
  href: string;
  badge?: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: SubNavItem[];
}

export const navigation: NavItem[] = [
  { label: 'Layanan', href: '/#layanan' },
  {
    label: 'Uji Coba Layanan',
    href: '/#demo',
    children: [
      {
        title: 'Ordering System Booking',
        desc: 'Sarana Olahraga, Studio Foto, Barber, Rental PS & Warnet',
        href: '/demo/booking',
        badge: 'Real Trial'
      },
      {
        title: 'POS, ERP, CRM & Keuangan',
        desc: 'Kasir, Stok Multi-Gudang, Karyawan & Laba Rugi',
        href: '/demo/pos-erp',
        badge: 'Real Trial'
      },
      {
        title: 'Ordering In Table (QR Code)',
        desc: 'Dine-In Resto, Split Bill & Kitchen KDS Realtime',
        href: '/demo/qr-resto',
        badge: 'Real Trial'
      },
      {
        title: 'Simulasi Cepat (Landing Page)',
        desc: 'Preview kalkulasi & alur interaktif langsung di halaman utama',
        href: '/#demo',
        badge: 'Sandbox'
      }
    ]
  },
  { label: 'Estimasi Biaya', href: '/#estimator' },
  { label: 'FAQ', href: '/#faq' }
];
