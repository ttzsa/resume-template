export function resolvePdfServiceUrl(configured: string | undefined, hostname: string): string | undefined {
  if (configured) return configured;
  return hostname === 'localhost' || hostname === '127.0.0.1' ? 'http://localhost:8000' : undefined;
}
