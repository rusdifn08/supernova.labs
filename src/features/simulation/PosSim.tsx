import { useState } from 'preact/hooks';
import {
  Barcode,
  Coffee,
  Download,
  FileSpreadsheet,
  FileText,
  ScanLine,
  X,
  CheckCircle,
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
  const printIframe = document.createElement('iframe');
  printIframe.style.display = 'none';
  document.body.appendChild(printIframe);
  const doc = printIframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Laporan Inventory Supernova Labs</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 24px; color: #0f172a; }
          h2 { color: #0f172a; margin-bottom: 4px; }
          p { color: #64748b; font-size: 13px; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          th, td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; }
          th { background: #f8fafc; font-weight: 700; }
        </style>
      </head>
      <body>
        <h2>Supernova Labs — Laporan Real-Time Stok Opname</h2>
        <p>Sinkronisasi otomatis antara POS Kasir & Cloud Database.</p>
        <table>
          <tr><th>SKU</th><th>Item Produk</th><th>Stok Aktual</th><th>Status</th></tr>
          <tr><td>CF-001</td><td>Premium Coffee</td><td>${stock}</td><td>Aktif</td></tr>
          <tr><td>TF-012</td><td>Truffle Fries</td><td>48</td><td>Aktif</td></tr>
          <tr><td>ML-003</td><td>Matcha Latte</td><td>72</td><td>Aktif</td></tr>
        </table>
      </body>
    </html>
  `);
  doc.close();
  printIframe.contentWindow?.focus();
  printIframe.contentWindow?.print();
  setTimeout(() => document.body.removeChild(printIframe), 1000);
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
      setCart((prev) => [...prev, { name: 'Premium Coffee 250g', price: 35000 }]);
      setStock((prev) => prev - 1);
      setScanning(false);
      setFlashRow(true);
      setTimeout(() => setFlashRow(false), 800);
    }, 700);
  };

  return (
    <div className="sim-pos-grid">
      {/* LEFT: POS Checkout Station */}
      <div className="sim-pos-terminal relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F172A] text-white">
              <ScanLine className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Terminal POS Kasir</h4>
              <p className="text-[11px] text-[#64748B]">Barcode &amp; QR Scanner Ready</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE SCANNER
          </span>
        </div>

        {/* Laser scan button */}
        <button
          type="button"
          onClick={simulateScan}
          disabled={scanning}
          className="sim-scan-btn"
        >
          {scanning && <div className="sim-scan-laser" />}
          <ScanLine className={`h-4 w-4 ${scanning ? 'animate-pulse text-[#06B6D4]' : ''}`} />
          <span>{scanning ? 'Memindai Barcode...' : "Simulate Scan Barcode: 'Premium Coffee'"}</span>
        </button>

        {/* Cart items list */}
        <div className="sim-cart-list">
          {cart.length === 0 ? (
            <p className="my-auto text-center text-xs text-[#64748B]">
              Keranjang kosong — klik tombol di atas untuk scan produk
            </p>
          ) : (
            cart.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="sim-cart-item animate-in fade-in slide-in-from-left-2 duration-200"
              >
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-[#2563EB]" />
                  <span className="font-semibold text-[#0F172A]">{item.name}</span>
                </div>
                <span className="font-bold text-[#0F172A]">{formatRupiah(item.price)}</span>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
            <span className="text-xs font-semibold text-[#64748B]">
              Total ({cart.length} item)
            </span>
            <span className="text-base font-extrabold text-[#0F172A] font-mono">
              {formatRupiah(total)}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT: Cloud Inventory Database */}
      <div className="sim-inv-panel">
        <div className="sim-inv-header pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F172A] text-white">
              <Barcode className="h-4 w-4 text-[#06B6D4]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Inventory Cloud Database</h4>
              <p className="text-[11px] text-[#64748B]">Real-Time Auto Stock Opname</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="sim-btn-secondary border border-slate-200 bg-white hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor</span>
          </button>
        </div>

        {/* Inventory Table */}
        <table className="sim-inv-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nama Produk</th>
              <th className="text-right">Stok Fisik</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Flash row upon scan */}
            <tr className={`transition-colors duration-500 ${flashRow ? 'sim-row-flash bg-emerald-50' : ''}`}>
              <td className="font-mono text-xs text-[#64748B]">CF-001</td>
              <td className="font-bold text-[#0F172A]">Premium Coffee 250g</td>
              <td className={`text-right font-extrabold font-mono text-sm ${flashRow ? 'text-emerald-600' : 'text-[#0F172A]'}`}>
                {stock}
              </td>
              <td className="text-center">
                <span className="sim-stock-badge in-stock">
                  <CheckCircle className="h-3 w-3" />
                  IN STOCK
                </span>
              </td>
            </tr>
            <tr>
              <td className="font-mono text-xs text-[#64748B]">TF-012</td>
              <td className="font-medium text-[#0F172A]">Truffle Fries</td>
              <td className="text-right font-bold font-mono text-sm text-[#0F172A]">48</td>
              <td className="text-center">
                <span className="sim-stock-badge in-stock">
                  <CheckCircle className="h-3 w-3" />
                  IN STOCK
                </span>
              </td>
            </tr>
            <tr>
              <td className="font-mono text-xs text-[#64748B]">ML-003</td>
              <td className="font-medium text-[#0F172A]">Matcha Latte</td>
              <td className="text-right font-bold font-mono text-sm text-[#0F172A]">72</td>
              <td className="text-center">
                <span className="sim-stock-badge in-stock">
                  <CheckCircle className="h-3 w-3" />
                  IN STOCK
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-auto text-center text-[11px] text-[#64748B]">
          Setiap transaksi POS otomatis mengurangi stok tanpa selisih opname.
        </p>
      </div>

      {/* Export Modal */}
      {exportOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F172A]/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setExportOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-white/70 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                  Export Data
                </p>
                <h3 className="mt-1 text-xl font-bold text-[#0F172A]">Ekspor Laporan</h3>
                <p className="mt-1 text-xs text-[#64748B]">Pilih format laporan inventory.</p>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setExportOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
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
                  <strong className="block text-sm text-[#0F172A]">Excel / CSV</strong>
                  <small className="text-[10px] text-[#64748B]">Data Tabel</small>
                </span>
              </button>

              <button
                type="button"
                onClick={() => printReport(stock)}
                className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-left transition hover:border-rose-400 hover:shadow-md cursor-pointer"
              >
                <FileText className="h-6 w-6 text-rose-600" />
                <span>
                  <strong className="block text-sm text-[#0F172A]">PDF / Print</strong>
                  <small className="text-[10px] text-[#64748B]">Dokumen Cetak</small>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
