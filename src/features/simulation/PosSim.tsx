import { useState } from 'preact/hooks';
import {
  Barcode,
  Coffee,
  Download,
  FileSpreadsheet,
  FileText,
  ScanLine,
  X,
} from 'lucide-preact';
import type { CartItem } from './types';
import { formatRupiah } from '../../lib/format/currency';

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function printReport(stock: number) {
  const report = `<html><head><title>Laporan Inventory Supernova</title><style>body{font-family:Arial;padding:32px;color:#0f172a}table{border-collapse:collapse;width:100%}th,td{border:1px solid #cbd5e1;padding:10px;text-align:left}th{background:#eef2ff}</style></head><body><h1>Laporan Inventory Supernova</h1><p>Ringkasan stok otomatis dari POS.</p><table><tr><th>SKU</th><th>Item</th><th>Stok</th></tr><tr><td>CF-001</td><td>Premium Coffee</td><td>${stock}</td></tr><tr><td>TF-012</td><td>Truffle Fries</td><td>48</td></tr><tr><td>ML-003</td><td>Matcha Latte</td><td>72</td></tr></table></body></html>`;
  const reportWindow = window.open('', '_blank', 'width=900,height=700');
  if (!reportWindow) return;
  reportWindow.document.write(report);
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
}

export function PosSim() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stock, setStock] = useState(100);
  const [scanning, setScanning] = useState(false);
  const [flashRow, setFlashRow] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const simulateScan = () => {
    if (scanning || stock <= 0) return;
    setScanning(true);
    setTimeout(() => {
      setCart((prev) => [...prev, { name: 'Premium Coffee', price: 35000 }]);
      setStock((prev) => prev - 1);
      setScanning(false);
      setFlashRow(true);
      setTimeout(() => setFlashRow(false), 800);
    }, 700);
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* LEFT: POS Checkout */}
      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-5 shadow-glass backdrop-blur-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-bold text-navy">POS Checkout</h4>
          <span className="rounded-full bg-vivid-purple/10 px-2.5 py-0.5 text-[10px] font-bold text-vivid-purple">
            LIVE
          </span>
        </div>

        {/* Laser scan button */}
        <button
          type="button"
          onClick={simulateScan}
          disabled={scanning}
          className="relative mb-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-vivid-purple/40 bg-vivid-purple/5 py-4 text-sm font-semibold text-vivid-purple transition-all hover:bg-vivid-purple/10 active:scale-[0.99] cursor-pointer"
        >
          {scanning && (
            <div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#EC4899] to-transparent shadow-[0_0_12px_#EC4899] animate-pulse"
              style={{
                top: '50%',
                animation: 'scanLaserMove 0.7s linear infinite',
              }}
            />
          )}
          <ScanLine className={`h-4 w-4 ${scanning ? 'animate-pulse' : ''}`} />
          <span>{scanning ? 'Scanning QR...' : "Simulate Scan QR: Add 'Premium Coffee'"}</span>
        </button>

        {/* Cart items list */}
        <div className="min-h-[140px] space-y-2">
          {cart.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-soft">
              Keranjang kosong — scan untuk menambah item
            </p>
          ) : (
            cart.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="flex items-center justify-between rounded-xl bg-white/90 px-3.5 py-2.5 shadow-xs border border-navy/5 animate-in fade-in slide-in-from-left-2 duration-200"
              >
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-vivid-purple" />
                  <span className="text-sm font-medium text-navy">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-navy">{formatRupiah(item.price)}</span>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-3 flex items-center justify-between border-t border-navy/5 pt-3">
            <span className="text-xs font-semibold text-slate-soft">
              Total ({cart.length} item)
            </span>
            <span className="text-base font-bold text-navy font-mono">
              {formatRupiah(total)}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT: Inventory Database */}
      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-5 shadow-glass backdrop-blur-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-vivid-purple/10 text-vivid-purple">
              <Barcode className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-navy">Inventory Database</h4>
              <p className="text-[10px] font-medium text-slate-soft">
                QR &amp; barcode ready · Auto Sync
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-navy px-3 py-2 text-[10px] font-bold text-white shadow-md transition hover:bg-vivid-purple cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Ekspor
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-navy/5">
          <div className="grid grid-cols-3 bg-navy/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-soft">
            <span>SKU</span>
            <span>Item</span>
            <span className="text-right">Stock</span>
          </div>

          {/* Dynamic Flash Row */}
          <div
            className={`grid grid-cols-3 items-center px-3 py-3 text-sm transition-colors duration-500 ${
              flashRow ? 'bg-emerald-100 text-emerald-900' : 'bg-white/90 text-navy'
            }`}
          >
            <span className="font-mono text-xs text-slate-soft">CF-001</span>
            <span className="font-medium text-navy">Premium Coffee</span>
            <span
              className={`text-right text-base font-bold font-mono transition-transform duration-200 ${
                flashRow ? 'scale-125 text-emerald-600' : 'text-navy'
              }`}
            >
              {stock}
            </span>
          </div>

          {[
            { sku: 'TF-012', name: 'Truffle Fries', stock: 48 },
            { sku: 'ML-003', name: 'Matcha Latte', stock: 72 },
          ].map((row) => (
            <div
              key={row.sku}
              className="grid grid-cols-3 border-t border-navy/5 bg-white/60 px-3 py-3 text-sm"
            >
              <span className="font-mono text-xs text-slate-soft">{row.sku}</span>
              <span className="font-medium text-navy">{row.name}</span>
              <span className="text-right font-bold text-navy font-mono">{row.stock}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-[11px] text-slate-soft">
          Stock berkurang otomatis saat scan — zero lag inventory
        </p>
      </div>

      {/* Export Modal */}
      {exportOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/40 p-5 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setExportOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-white/70 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-vivid-purple">
                  Inventory tools
                </p>
                <h3 className="mt-1 text-xl font-bold text-navy">Ekspor laporan</h3>
                <p className="mt-1 text-xs text-slate-soft">
                  Pilih format untuk dibagikan ke tim Anda.
                </p>
              </div>
              <button
                aria-label="Tutup"
                onClick={() => setExportOpen(false)}
                className="rounded-xl p-2 text-slate-soft hover:bg-slate-100 hover:text-navy cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  downloadFile(
                    'inventory-supernova.csv',
                    `SKU,Item,Stok\nCF-001,Premium Coffee,${stock}\nTF-012,Truffle Fries,48\nML-003,Matcha Latte,72`,
                    'text/csv;charset=utf-8'
                  )
                }
                className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left transition hover:border-emerald-400 hover:shadow-md cursor-pointer"
              >
                <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                <span>
                  <strong className="block text-sm text-navy">Excel / CSV</strong>
                  <small className="text-[10px] text-slate-soft">Data inventory</small>
                </span>
              </button>

              <button
                type="button"
                onClick={() => printReport(stock)}
                className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-left transition hover:border-rose-400 hover:shadow-md cursor-pointer"
              >
                <FileText className="h-6 w-6 text-rose-600" />
                <span>
                  <strong className="block text-sm text-navy">PDF / Print</strong>
                  <small className="text-[10px] text-slate-soft">Cetak / simpan PDF</small>
                </span>
              </button>
            </div>

            <p className="mt-4 text-center text-[10px] text-slate-soft">
              File dibuat langsung di perangkat Anda — aman dan cepat.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
