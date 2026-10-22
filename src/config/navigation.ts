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
    label: 'Layanan Sistem',
    href: '/#layanan',
    children: [
      {
        title: 'Online Booking System',
        desc: 'Sarana Olahraga, Studio Foto, Barber, Rental PS & Warnet (Aktif 1 Bulan)',
        href: '/layanan/booking',
        badge: '30 Hari Aktif'
      },
      {
        title: 'POS, ERP, CRM & Keuangan',
        desc: 'Kasir, Stok Multi-Gudang, Karyawan & Laba Rugi (Aktif 1 Bulan)',
        href: '/layanan/pos-erp',
        badge: '30 Hari Aktif'
      },
      {
        title: 'Ordering In Table (QR Code)',
        desc: 'Dine-In Resto, Split Bill & Kitchen KDS Realtime (Aktif 1 Bulan)',
        href: '/layanan/qr-resto',
        badge: '30 Hari Aktif'
      }
    ]
  },
  { label: 'Estimasi Biaya', href: '/#estimator' },
  { label: 'FAQ', href: '/#faq' }
];
