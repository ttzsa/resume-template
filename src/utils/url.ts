const allowedProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function normalizeSafeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    return allowedProtocols.has(url.protocol) ? candidate : null;
  } catch {
    return null;
  }
}
