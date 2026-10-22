import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  output: 'static',
  site: 'https://supernovalabs.studio',
  integrations: [preact()],
  redirects: {
    '/demo/booking': '/layanan/booking',
    '/demo/pos-erp': '/layanan/pos-erp',
    '/demo/qr-resto': '/layanan/qr-resto'
  }
});
