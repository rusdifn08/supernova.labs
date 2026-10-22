export function getStorefrontSlug(defaultSlug = 'demo'): string {
  if (typeof window === 'undefined') return defaultSlug;
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  // Example: /layanan/booking/supernova -> pathParts: ['layanan', 'booking', 'supernova']
  if (pathParts.length >= 3 && pathParts[0] === 'layanan') {
    return pathParts[2];
  }
  const params = new URLSearchParams(window.location.search);
  const q = params.get('slug');
  if (q) return q;
  return defaultSlug;
}

export function getQueryParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}
