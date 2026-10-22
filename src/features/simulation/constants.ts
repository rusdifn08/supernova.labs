import type { BookingPackage, BookingStudio, QrMenuItem } from './types';

export const PRODUCT_TABS = [
  {
    id: 'booking',
    label: 'Booking System',
    icon: 'clock',
    title: 'Booking Apps with Management Operational',
    desc: 'Real-time multiplatform booking yang mencegah double-booking. Zero missed revenue untuk studio foto, PS rental, klinik, dan arena olahraga.',
    market: 'Photo Studios · PS Rentals · Clinics · Sports Arenas',
  },
  {
    id: 'pos',
    label: 'Cashier & Inventory',
    icon: 'scan',
    title: 'Cashier Apps & Automatic Stock Opname',
    desc: 'POS secepat kilat terintegrasi native dengan inventory otomatis & QR barcode scanning. Stop kehilangan aset fisik.',
    market: 'Retail · Pharmacy · F&B · Warehouse · Boutique',
  },
  {
    id: 'qr',
    label: 'QR Table Ordering',
    icon: 'phone',
    title: 'Fully Integrated Contactless QR Table Ordering',
    desc: 'Pelanggan cukup scan QR di meja, pilih menu, dan pesan dari HP. Order otomatis masuk ke Kitchen Display System & Cashier Display secara bersamaan — dapur memasak, kasir memantau, pelanggan melihat status live.',
    market: 'Restaurant · Cafe · Coffee Shop · Beach Club',
  },
];

export const BOOKING_STUDIOS: BookingStudio[] = [
  { id: 'A', name: 'Studio A', type: 'Self Photo', icon: 'camera', from: 150000 },
  { id: 'B', name: 'Studio B', type: 'Family & Group', icon: 'users', from: 250000 },
  { id: 'C', name: 'Studio C', type: 'Product Shoot', icon: 'package', from: 350000 },
];

export const BOOKING_TIMES = ['13:00', '14:00', '15:00', '16:00'];

export const BOOKING_PACKAGES: BookingPackage[] = [
  { id: 'basic', name: 'Basic', dur: '30 menit', add: 0 },
  { id: 'premium', name: 'Premium', dur: '60 menit', add: 100000 },
  { id: 'exclusive', name: 'Exclusive', dur: '90 menit + Editing', add: 250000 },
];

export const BOOKING_STEP_LABELS = [
  'Pilih Studio',
  'Jadwal & Paket',
  'Pembayaran',
  'Sinkronisasi',
];

export const QR_MENU: QrMenuItem[] = [
  { id: 'fries', name: 'Truffle Fries', emoji: '🍟', price: 45000 },
  { id: 'burger', name: 'Wagyu Burger', emoji: '🍔', price: 85000 },
  { id: 'matcha', name: 'Matcha Latte', emoji: '🍵', price: 38000 },
];

export const QR_PHONE_STEPS = ['Terkirim', 'Diterima', 'Dimasak', 'Ready'];
