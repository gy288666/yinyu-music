/** 图片加载失败时的兜底 */
export function imgFallback(e: Event, fallback: string) {
  const el = e.currentTarget as HTMLImageElement
  if (el.dataset.fb === '1') return
  el.dataset.fb = '1'
  el.src = fallback
}

export const ARTIST_FALLBACK = '/images/artists/artist_001.jpg'
export const ALBUM_FALLBACK = '/images/albums/album_001.jpg'
