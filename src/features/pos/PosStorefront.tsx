import { useState } from 'preact/hooks';
import { Button } from '../../ui/atoms/Button';
import { Badge } from '../../ui/atoms/Badge';
import { Input } from '../../ui/atoms/Input';
import { useQuery } from '../../lib/hooks/useQuery';
import { api } from '../../lib/api/client';
import { formatRupiah } from '../../lib/format/currency';
import { getStorefrontSlug } from '../../lib/storefront';

interface PublicProduct {
  id: string;
  name: string;
  sku: string;
  category_name: string;
  price: number;
  stock: number;
}

interface PublicTenant {
  slug: string;
  code: string;
  name: string;
  business_type: string;
  city?: string;
  phone?: string;
}

export function PosStorefront() {
  const slug = getStorefrontSlug('demo');
  const [search, setSearch] = useState('');

  const { data: tenant } = useQuery<PublicTenant>(() =>
    api.get<PublicTenant>(`/public/tenants/${slug}`)
  );

  const { data: catalog, loading } = useQuery<PublicProduct[]>(() =>
    api.get<PublicProduct[]>(`/public/pos/${slug}/catalog`)
  );

  const filtered = catalog?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-sans pb-16">
      {/* Brand Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--line)] py-4 px-4 sm:px-8 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--blue)] to-[var(--bright)] flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--ink)]">{tenant?.name || 'Supernova POS'}</h1>
              <p className="text-[11px] text-[var(--muted-2)]">
                {tenant?.business_type || 'Retail & Minimarket'} · {tenant?.city || 'Indonesia'}
              </p>
            </div>
          </div>
          <Badge tone="info">{tenant?.code || '#SNV-POS'}</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 mt-4">
        {/* Search bar and title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--ink)]">Katalog Produk & Harga</h2>
            <p className="text-xs text-[var(--muted)]">Katalog resmi langsung terhubung ke sistem POS gerai</p>
          </div>
          <div className="w-full sm:w-72">
            <Input
              type="search"
              placeholder="Cari produk atau kategori..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-[var(--muted-2)]">Memuat katalog produk...</div>
        ) : !filtered || filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[var(--muted-2)]">Tidak ada produk ditemukan</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 shadow-xs hover:border-[var(--bright)] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-medium text-[var(--bright)] bg-[var(--blue-light)] px-2 py-0.5 rounded-full inline-block mb-1.5">
                    {item.category_name}
                  </span>
                  <h3 className="text-xs font-bold text-[var(--ink)] line-clamp-2">{item.name}</h3>
                  <span className="text-[10px] font-mono text-[var(--muted-2)]">SKU: {item.sku}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[var(--bright)] block">
                      {formatRupiah(item.price)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">Stok: {item.stock}</span>
                  </div>
                  <Button
                    variant="whatsapp"
                    size="sm"
                    onClick={() => {
                      const phone = tenant?.phone || '628123456789';
                      const cleanPhone = phone.replace(/\D/g, '');
                      const msg = encodeURIComponent(
                        `Halo ${tenant?.name}, saya ingin memesan produk: ${item.name} (${formatRupiah(item.price)}). Apakah masih tersedia?`
                      );
                      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
                    }}
                  >
                    Beli via WA
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
