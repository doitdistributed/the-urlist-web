export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  // If starts with protocol, return as is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  // If starts with //, treat as protocol-relative
  if (/^\/\//.test(trimmed)) {
    return trimmed;
  }
  // Otherwise, prepend https://
  return `https://${trimmed}`;
}