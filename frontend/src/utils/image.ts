export function optimizePoster(url: string | undefined | null, width = 400): string {
  if (!url) return ''
  if (url.startsWith('data:') || url.startsWith('blob:')) return url
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=75&we`
}
