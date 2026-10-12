import { contact } from '../config/contact';

export const consultationMessage =
  'Halo Tim Supernova Labs, saya tertarik membangun sistem IT [Web/Mobile/Desktop] untuk bisnis saya. Bisa jadwalkan konsultasi?';

export function getWhatsAppUrl(message = consultationMessage) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
