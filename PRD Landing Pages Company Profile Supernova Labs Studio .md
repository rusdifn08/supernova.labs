# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project Name:** Enterprise All-In-One IT Solution Landing Page (Startup Agency)
**Document Version:** 2.0.0 (Extended & Detailed)
**Target Audience:** B2B, Corporate Executives, Startup Founders, Enterprise IT Managers
**Core Conversion Action:** Direct Consultation via WhatsApp (085174289548)

---

## 1. EXECUTIVE SUMMARY & BUSINESS CONTEXT

### 1.1. Background
Sebagai *startup* IT Agency (penyedia jasa pembuatan Website, Mobile Apps, dan Desktop Apps), tantangan terbesar adalah membangun *trust* tanpa portofolio klien masa lalu. Landing page ini dirancang untuk mengatasi hal tersebut dengan memposisikan perusahaan sebagai kelompok ahli (*elite engineers*) yang berfokus pada kualitas arsitektur, *clean code*, dan proses bisnis klien, bukan sekadar pembuat web murah.

### 1.2. Product Vision
Menciptakan representasi digital yang berfungsi sebagai "mesin konversi" otomatis. Menampilkan desain *ultra-minimalis, brutalist-corporate*, dan memuat dalam waktu kurang dari 1 detik. Setiap elemen visual dan teks harus berteriak: **"Kami serius, kami mahal (berkualitas), dan kami mengerti skalabilitas enterprise."**

### 1.3. Key Performance Indicators (KPIs)
*   **Bounce Rate:** < 40% (dicapai dengan *loading speed* instan dan *above-the-fold* yang kuat).
*   **Click-Through Rate (CTR) ke WhatsApp:** > 12% dari total pengunjung unik.
*   **Lighthouse Score:** 100/100 (Performance, Accessibility, Best Practices, SEO).

---

## 2. DETAILED TARGET AUDIENCE (BUYER PERSONAS)

Agar *copywriting* tepat sasaran, sistem ini dirancang untuk menjawab 3 persona utama:
1.  **The Non-Tech Founder:** Membutuhkan mitra yang bisa menerjemahkan ide bisnis ke dalam produk nyata tanpa jargon teknis yang membingungkan. Mereka butuh MVP (Minimum Viable Product) yang cepat dan stabil.
2.  **The Corporate IT Manager:** Membutuhkan vendor *outsourcing* untuk membangun *internal tools* (Desktop Apps/ERP). Mereka peduli pada keamanan data, *stack* yang modern, dan dokumentasi yang rapi.
3.  **The Retail/F&B Owner:** Membutuhkan sistem POS (Point of Sales) desktop/tablet yang tidak bergantung pada internet dan aplikasi *loyalty* untuk pelanggan mereka.

---

## 3. TECHNOLOGY STACK (THE "FEATHERWEIGHT" ENTERPRISE ARCHITECTURE)

Pemilihan teknologi difokuskan pada kecepatan maksimal dan ukuran *bundle* sekecil mungkin.

*   **Core Meta-Framework:** **Astro.js 4.x** (Dipilih karena arsitektur *Island* dan pengiriman *Zero-JS* ke klien secara default. HTML murni saat di-load).
*   **Styling Engine:** **Tailwind CSS v3.4+** (Dengan konfigurasi `prefix` opsional jika diperlukan untuk isolasi, dan `safelist` yang sangat dibatasi. *Purge* ketat untuk ukuran CSS < 15KB).
*   **Interactivity & State:** **Vanilla TypeScript** (Tidak ada React, Vue, atau Svelte untuk halaman utama. Semua logika menu, modal, dan tab ditulis dengan ES6+ murni untuk menghindari *overhead* library).
*   **Vector & Asset Pipeline:** SVG murni. Semua ikon dan ilustrasi dirender sebagai tag `<svg>` di DOM. Tidak ada pemanggilan HTTP untuk gambar raster (`.png`, `.jpg`) kecuali mutlak diperlukan (misal: foto tim).
*   **Typography Pipeline:** Font di-host secara lokal (*Self-hosted WOFF2*) dengan properti `font-display: swap` dan *preload* di `<head>`.
*   **Package Manager:** **pnpm** (Wajib, untuk konsistensi *lockfile* tim).
*   **Deployment & Edge:** Vercel atau Cloudflare Pages (Deploy statis global).

---

## 4. DESIGN SYSTEM: "SWISS CORPORATE BRUTALISM" (STRICT ANTI-AI SLOP RULES)

Bagian ini adalah hukum mutlak desain visual. Tujuan kita adalah terlihat seperti firma arsitektur Eropa: dingin, presisi, fungsional, dan sangat profesional.

### 4.1. The "Anti-AI Slop" Mandate
*   **DILARANG:** Gradien linier/radial neon (ungu ke biru, pink ke oranye).
*   **DILARANG:** *Glassmorphism* (latar belakang blur dengan border putih transparan).
*   **DILARANG:** Ilustrasi 3D isometrik bergaya plastik (seperti karakter tanpa wajah berhidung besar).
*   **DILARANG:** *Drop shadow* yang lembut dan menyebar (`box-shadow: 0 10px 30px rgba(0,0,0,0.1)`).
*   **WAJIB:** Warna solid, garis batas (*border*) yang tegas, kontras tinggi, dan *white space* yang masif.

### 4.2. Color Palette & Variables
*   `--bg-base`: `#F7F7F7` (Kertas abu-abu sangat muda).
*   `--bg-surface`: `#FFFFFF` (Putih murni untuk kartu/kontainer).
*   `--text-primary`: `#111111` (Hitam pekat untuk H1-H6).
*   `--text-secondary`: `#5E5E5E` (Abu-abu gelap untuk paragraf).
*   `--accent-primary`: `#000000` (Hitam absolut untuk elemen penegas).
*   `--accent-cta`: `#D9381E` (Vermilion/Merah-Bata solid. Satu-satunya warna mencolok di seluruh web. Digunakan khusus untuk tombol WhatsApp).
*   `--border-color`: `#E5E5E5` (Garis abu-abu tipis untuk memisahkan struktur).

### 4.3. Grid & Spacing System
*   Menggunakan sistem **12-Column Grid** standar.
*   **Border Radius (Sudut):** Ketat di angka `0px` (Kotak tajam) atau maksimal `2px` (Sangat sedikit melengkung). Kesan *brutalist*.
*   **Spacing Base:** Kelipatan 8px (Tailwind standar). Jarak antar *section* minimal `py-24` (96px) di desktop untuk memberi ruang bernapas.

### 4.4. Typography Rules
*   **Heading (H1-H4):** **Geist Sans** atau **Inter Tight**. Berat font: *Medium (500)* atau *Semibold (600)*. Jangan gunakan *Black (900)*.
*   **Body (p, span):** **Inter** atau **Geist Mono** (untuk detail teknis). Berat font: *Regular (400)*.
*   **Tracking (Letter Spacing):** H1 (-0.02em) untuk kesan padat, Body (0em).

### 4.5. Bespoke SVG Wireframe Illustrations (Strict Specs)
Alih-alih stok internet, kita membuat ilustrasi berbasis kode (SVG).
*   Warna garis: Hitam (`stroke="#111111"`).
*   Ketebalan garis: `stroke-width="1.5"`.
*   *Fill*: Transparan (`fill="none"`).
*   Konsep: Animasi CSS keyframe perlahan. Misalnya, panah yang bergerak perlahan dari elemen A ke elemen B di dalam SVG.

---

## 5. PAGE STRUCTURE & DEEP DIVE USER JOURNEY

Karena tidak ada logo klien, struktur halaman dimodifikasi untuk meyakinkan pengunjung melalui *kemampuan teknis* dan *pemahaman masalah*.

### 5.1. Header (Navigation)
*   **Kiri:** Logo tipografi tajam: "KODE[KRAAL]" atau nama agensi Anda.
*   **Tengah:** Layanan | Metodologi | Tech Stack | Harga.
*   **Kanan:** Tombol solid `#D9381E`. Teks: "Hubungi Arsitek Kami".

### 5.2. Hero Section (The Hook)
*   **Visual:** Latar belakang kotak-kotak tipis (Grid pattern) berbasis CSS radial-gradient (monokrom) dengan opasitas 5%.
*   **Headline:** "Kami Tidak Membuat Website. Kami Membangun Infrastruktur Digital untuk Skala Enterprise."
*   **Sub-Headline:** "Firma pengembangan perangkat lunak spesialis Website, Aplikasi Mobile (iOS/Android), dan Desktop App berkinerja tinggi. Kode yang bersih, arsitektur kokoh, dan serah terima penuh."
*   **CTA:** "Konsultasi Teknis Gratis (WA)" + Ikon Panah Kanan.
*   *(Perubahan Startup)* **Trust Badge di bawah CTA:** "Berbasis di Indonesia. Siap mengabdi untuk bisnis global. Respons dalam < 15 menit."

### 5.3. Tech Stack & Ecosystem (Replacing Client Logos)
Membangun kredibilitas dengan menampilkan alat yang dikuasai.
*   **Title:** "Arsitektur yang Kami Kuasai."
*   **Grid:** Deretan logo SVG monokrom dari teknologi papan atas:
    *   *Frontend:* React, Astro, Tailwind, TypeScript.
    *   *Backend:* Node.js, Go, PostgreSQL, Redis.
    *   *Cloud:* AWS, Google Cloud, Docker.
*   **Subtext:** "Menggunakan standar teknologi yang sama dengan perusahaan Fortune 500."

### 5.4. The "All-In-One" Services (Deep Dive)
*   **Service 1: Web Ecosystems (Bukan sekadar "Web Dev")**
    *   *Deliverables:* Sistem ERP Custom, Dashboard SaaS, PWA (Progressive Web Apps), Landing Page Ultra-Fast.
    *   *Tech Highlight:* Server-Side Rendering, Edge Computing.
*   **Service 2: Mobile Native & Hybrid Apps**
    *   *Deliverables:* iOS & Android App, Sistem Manajemen Kurir, Aplikasi E-Commerce *Native*.
    *   *Tech Highlight:* Flutter, React Native, Swift (Clean Architecture).
*   **Service 3: Mission-Critical Desktop Apps**
    *   *Deliverables:* Software Kasir (POS) Offline-first, Manajemen Gudang, Sistem Komputasi Medis.
    *   *Tech Highlight:* Electron, Tauri (Rust-based untuk kecepatan).

### 5.5. Development Methodology (How We Work)
B2B *clients* sangat peduli *BAGAIMANA* proyek dikerjakan. Gunakan UI Stepper horizontal.
1.  **Requirement Engineering:** Kami tidak langsung *coding*. Kami membedah bisnis Anda (System Flow, Database Schema).
2.  **Fidelity Prototyping:** Serah terima desain Figma interaktif. Anda tahu persis apa yang Anda dapatkan sebelum kode ditulis.
3.  **Sprint Development:** Siklus mingguan. Anda mendapat akses ke *staging environment* untuk memantau progres *real-time*.
4.  **Penetration & QA:** Pengujian beban, keamanan, dan *cross-device compatibility*.
5.  **Handover & Training:** Penyerahan *source code* mutlak, dokumentasi API, dan pelatihan staf Anda.

### 5.6. Engagement Models (Opsi Kerjasama)
Karena belum ada klien, tawarkan fleksibilitas.
*   **Card 1: Project-Based:** Cocok untuk proyek dengan *scope* yang jelas. Harga tetap dari awal hingga rilis.
*   **Card 2: Dedicated Team / Retainer:** Untuk *startup* yang butuh tim IT bulanan (Frontend, Backend, PM) tanpa pusing rekrutmen.

### 5.7. Grand CTA (Bottom of Page)
*   **Desain:** Brutalist block, background hitam pekat, padding masif (`py-32`).
*   **Teks:** "Ide Anda Terlalu Berharga untuk Dikerjakan oleh Tim yang Salah."
*   **Tombol CTA:** Tombol raksasa, mengarah ke format URL WhatsApp:
    `https://wa.me/6285174289548?text=Halo%20Tim%20Developer,%20saya%20tertarik%20untuk%20membangun%20sistem%20IT%20[Web/Mobile/Desktop]%20untuk%20bisnis%20saya.%20Bisa%20jadwalkan%20konsultasi?`

---

## 6. EXTENDED ATOMIC DESIGN ARCHITECTURE

Sistem atomik ini harus diimplementasikan secara ketat di Astro. Pembagian props dan slot sangat krusial.

### 6.1. Atom Rules
*   **Button (`<Button />`):** Harus menerima props `variant` (primary, secondary, outline, ghost), `size` (sm, md, lg), dan `href` (jika berupa link). Wajib menggunakan `slot` untuk konten teks/ikon.
*   **Icon (`<Icon name="wa" />`):** Sentralisasi file SVG. Jangan menempelkan tag SVG langsung di halaman, simpan di `src/components/atoms/Icons/`.

### 6.2. Molecule Rules
*   **Card (`<ServiceCard />`):** Menerima props `title`, `description`, `iconName`. Menggunakan *semantic markup* `<article>`.
*   **InputField (`<Input />`):** Menggabungkan `<label>`, `<input>`, dan elemen pesan error.

### 6.3. Organism Rules
*   **Navbar (`<Navbar />`):** Menyimpan *state* untuk menu hamburger di versi mobile. Logika Vanilla JS ditambahkan menggunakan tag `<script>` standar Astro yang akan dieksekusi secara otomatis dan diisolasi.

---

## 7. EXHAUSTIVE DIRECTORY & FOLDER STRUCTURE (ENTERPRISE SCALE)

Ini adalah struktur folder *zero-technical-debt* yang sangat luas, siap menyokong ratusan komponen jika website terus berkembang.

```text
enterprise-landing/
│
├── .github/                     # (Opsional) CI/CD Workflows
│   └── workflows/
│       ├── build-check.yml      # GitHub Actions: Cek build & TypeScript errors
│       └── lighthouse.yml       # GitHub Actions: Cek skor Lighthouse tiap PR
│
├── .husky/                      # Git hooks (pre-commit, pre-push)
│   └── pre-commit               # Wajib linting sebelum commit
│
├── .vscode/
│   ├── extensions.json
│   └── settings.json
│
├── public/                      # Static Assets
│   ├── fonts/
│   │   ├── Geist-Regular.woff2
│   │   └── Geist-Medium.woff2
│   ├── images/
│   │   └── og-image.jpg         # Gambar Open Graph untuk share WA (1200x630)
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/                         # CORE APPLICATION
│   │
│   ├── assets/
│   │   └── styles/
│   │       ├── global.css       # Tailwind directives & CSS Variables
│   │       └── brutalist.css    # Custom utilities untuk desain brutalist
│   │
│   ├── components/              # ATOMIC DESIGN ROOT
│   │   │
│   │   ├── atoms/               # Tingkat 1: Basic Elements
│   │   │   ├── Buttons/
│   │   │   │   ├── Button.astro
│   │   │   │   └── LinkButton.astro
│   │   │   ├── Typography/
│   │   │   │   ├── Heading.astro
│   │   │   │   ├── Text.astro
│   │   │   │   └── Label.astro
│   │   │   ├── Media/
│   │   │   │   └── SvgIcon.astro
│   │   │   └── Layout/
│   │   │       ├── Container.astro
│   │   │       └── Grid.astro
│   │   │
│   │   ├── molecules/           # Tingkat 2: UI Combinations
│   │   │   ├── Navigation/
│   │   │   │   ├── NavItem.astro
│   │   │   │   └── MobileToggle.astro
│   │   │   ├── Cards/
│   │   │   │   ├── TechStackCard.astro
│   │   │   │   ├── ServiceDetailCard.astro
│   │   │   │   └── EngagementCard.astro
│   │   │   └── Forms/
│   │   │       └── ContactInput.astro
│   │   │
│   │   ├── organisms/           # Tingkat 3: Distinct Page Sections
│   │   │   ├── Global/
│   │   │   │   ├── Header.astro
│   │   │   │   └── Footer.astro
│   │   │   ├── Home/
│   │   │   │   ├── HomeHero.astro
│   │   │   │   ├── HomeTechStack.astro
│   │   │   │   ├── HomeServices.astro
│   │   │   │   ├── HomeMethodology.astro
│   │   │   │   ├── HomeEngagement.astro
│   │   │   │   └── HomeCTA.astro
│   │   │   └── Shared/
│   │   │       └── SectionHeading.astro
│   │   │
│   │   └── templates/           # Tingkat 4: Layouts
│   │       ├── BaseLayout.astro # Menyimpan <html>, <head>, meta tags, slots
│   │       └── ContentLayout.astro # Menyimpan padding standar untuk artikel
│   │
│   ├── config/                  # CONSTANTS & CONFIGURATIONS
│   │   ├── site.ts              # Data domain, nama web, SEO defaults
│   │   ├── contact.ts           # { wa: "6285174289548", email: "..." }
│   │   └── navigation.ts        # Array objek rute menu navigasi
│   │
│   ├── content/                 # CONTENT COLLECTIONS (Astro Data)
│   │   ├── config.ts            # Skema validasi Zod untuk konten
│   │   └── services/
│   │       ├── web-dev.md
│   │       ├── mobile-dev.md
│   │       └── desktop-dev.md
│   │
│   ├── lib/                     # UTILS & HELPERS
│   │   ├── utils.ts             # Fungsi cn() untuk tailwind-merge & clsx
│   │   ├── whatsapp.ts          # Logic untuk generate link WA + pesan dinamis
│   │   └── date.ts              # Format tanggal
│   │
│   ├── pages/                   # ROUTING SYSTEM
│   │   ├── index.astro          # Landing Page Utama
│   │   ├── layanan/             # (Future proofing)
│   │   │   └── index.astro
│   │   ├── kontak/
│   │   │   └── index.astro
│   │   └── 404.astro            # Error page custom gaya brutalist
│   │
│   └── types/                   # TYPESCRIPT DECLARATIONS
│       ├── index.d.ts           # Global interfaces
│       └── components.ts        # Props interfaces
│
├── .eslintignore
├── .eslintrc.cjs                # ESLint strict mode
├── .prettierignore
├── .prettierrc                  # Prettier config (plugins: prettier-plugin-astro, prettier-plugin-tailwindcss)
├── astro.config.mjs             # Integrasi Tailwind, Sitemap, Compressor
├── package.json
├── pnpm-lock.yaml               # Wajib commit file ini
├── tailwind.config.cjs          # Definisi palet warna brutalist & plugins
└── tsconfig.json                # strict: true, skipLibCheck: true
```

---

## 8. QUALITY ASSURANCE, DEPLOYMENT & PERFORMANCE STANDARDS

Untuk membuktikan bahwa kita adalah agensi IT level tinggi, web kita sendiri harus sempurna secara teknis.

### 8.1. CI/CD & Git Flow
*   **Branching:** Menggunakan Trunk-based development atau Git Flow (`main`, `develop`, `feature/xyz`).
*   **Pre-commit Hook:** Husky membatalkan commit jika ESLint gagal atau Prettier belum merapikan kode.
*   **Deployment:** Terhubung ke GitHub. Setiap *push* ke `main` otomatis memicu *build* di Vercel.

### 8.2. Lighthouse & Web Vitals Strict Limits
*   **LCP (Largest Contentful Paint):** < 1.2 detik. Semua aset di atas lipatan (*above the fold*) tidak boleh *lazy-loaded*.
*   **FID (First Input Delay):** < 100ms. Tercapai otomatis dengan *Zero-JS* Astro.
*   **CLS (Cumulative Layout Shift):** 0.0. Setiap kontainer aset harus mendefinisikan tinggi dan lebar spesifik di CSS.

### 8.3. Code Optimization Tactics
1.  **Tailwind-Merge (`twMerge`):** Menggunakan utilitas `cn()` untuk menghindari konflik *class* Tailwind saat komponen menerima custom *class* dari *parent*.
2.  **No Extraneous SVGs:** Hapus meta-data dari SVG (seperti versi Adobe Illustrator, defs kosong) menggunakan SVGOMG atau Vite SVGO plugin sebelum memasukkannya ke dalam komponen.
3.  **Accessible Outlines:** Setiap tombol atau tautan yang difokuskan dengan *keyboard* (Tab) harus memiliki garis luar yang sangat jelas (misal: `focus:outline focus:outline-2 focus:outline-black focus:ring-offset-2`).

---

## 9. LEAD GENERATION DATA FLOW (WHATSAPP INTEGRATION)

Meskipun sederhana (klik ke WA), prosesnya harus terstruktur agar tidak terlihat amatir.

1.  **Visitor Click:** Pengguna mengklik tombol "Mulai Proyek (WA)".
2.  **Link Generation (Function `whatsapp.ts`):** 
    Sistem merakit URL dinamis: `https://wa.me/{nomor}?text={pesan_encoded}`.
3.  **Pre-filled Message Structure:**
    *"Halo, saya mengunjungi website Anda dan tertarik berdiskusi. Saya ingin konsultasi mengenai pembuatan [Web / Mobile / Desktop] untuk bisnis saya. Kapan waktu yang tepat untuk berdiskusi?"*
    *(Teks ini disisipkan secara programatik, memudahkan klien untuk langsung mengirim pesan tanpa berpikir).*
4.  **Target Attribute:** Link wajib memiliki atribut `target="_blank" rel="noopener noreferrer"` untuk membuka tab baru dengan aman tanpa merusak metrik sesi di website utama.