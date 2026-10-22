export const PUBLIC_API_URL =
  typeof window !== 'undefined' && (window as unknown as { __PUBLIC_API_URL__?: string }).__PUBLIC_API_URL__
    ? (window as unknown as { __PUBLIC_API_URL__: string }).__PUBLIC_API_URL__
    : import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8088/api/v1';
