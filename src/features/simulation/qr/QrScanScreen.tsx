import { Camera, Check, QrCode, RefreshCw, ScanLine } from 'lucide-preact';

interface QrScanScreenProps {
  scanning: boolean;
  scanOk: boolean;
  onScan: () => void;
}

export function QrScanScreen({ scanning, scanOk, onScan }: QrScanScreenProps) {
  return (
    <div className="p-4 text-center">
      <div className="mb-3 flex items-center justify-between text-[11px] text-[#64748B]">
        <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
          <Camera className="h-3 w-3 text-[#06B6D4]" /> Kamera Aktif
        </span>
        <button
          type="button"
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition"
        >
          <RefreshCw className="h-2.5 w-2.5" /> Balik Kamera
        </button>
      </div>

      {/* Viewfinder with laser */}
      <div className="sim-viewfinder">
        <div className="absolute inset-3 rounded-xl border border-dashed border-white/20" />
        {scanning && <div className="sim-laser-vertical" />}

        {scanOk ? (
          <div className="z-10 flex flex-col items-center gap-1.5 animate-in zoom-in-75 duration-200">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/50">
              <Check className="h-6 w-6 stroke-[3]" />
            </span>
            <span className="text-xs font-bold text-white">QR Meja 04 Terdeteksi</span>
          </div>
        ) : (
          <div className="z-10 flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <QrCode className="h-10 w-10 text-white/90" />
            </div>
            <span className="text-[11px] font-medium text-white/80">
              Arahkan ke QR di atas meja
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onScan}
        disabled={scanning}
        className="sim-btn-primary w-full mt-2"
      >
        <ScanLine className="h-4 w-4 text-[#06B6D4]" />
        <span>{scanning ? 'Memindai QR Meja...' : 'Scan QR Meja 04'}</span>
      </button>

      <p className="mt-3 text-[10px] text-[#64748B]">
        Simulasi alur tamu kafe / resto tanpa perlu download aplikasi apapun.
      </p>
    </div>
  );
}
