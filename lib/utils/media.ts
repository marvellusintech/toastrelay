export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.split("?")[0];
  return /\.(mp4|webm|mov|mkv|avi|m4v|ogg)$/i.test(clean);
}
