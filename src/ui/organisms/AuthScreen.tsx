import type { ComponentChildren } from 'preact';

export interface AuthScreenProps {
  product: 'booking' | 'pos' | 'resto';
  productTitle: string;
  tagline: string;
  children: ComponentChildren;
}

export function AuthScreen({
  product,
  productTitle,
  tagline,
  children,
}: AuthScreenProps) {
  const illustrationSrc = {
    booking: '/illustrations/booking-tech-character.svg',
    pos: '/illustrations/pos-erp-tech-character.svg',
    resto: '/illustrations/qr-resto-tech-character.svg',
  }[product];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[var(--paper)] font-sans">
      {/* Left Column: Dark Brand & Tech Character SVG */}
      <div className="w-full md:w-1/2 lg:w-5/12 bg-gradient-to-br from-[#0a1120] via-[#101b33] to-[#1e293b] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e40af_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        {/* Top brand header */}
        <div className="z-10">
          <a href="/" className="inline-flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--bright)] to-[var(--cyan)] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">Supernova</span>
              <span className="text-slate-400 text-xs block -mt-1">Enterprise Cloud</span>
            </div>
          </a>
        </div>

        {/* Center illustration & copy */}
        <div className="my-auto py-8 z-10 flex flex-col items-center text-center">
          <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square flex items-center justify-center mb-6 drop-shadow-xl">
            <img
              src={illustrationSrc}
              alt={`${productTitle} Character`}
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
            {productTitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-sm leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* Bottom footer footnote */}
        <div className="text-[11px] text-slate-400 z-10 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span>Lisensi 30 Hari Bebas Biaya</span>
          <span className="font-mono text-slate-500">Cloud Neon v1.0</span>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
