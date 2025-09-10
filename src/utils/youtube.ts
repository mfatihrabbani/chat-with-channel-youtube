export function openYouTubeAtTimestamp(
  youtubeVideoId: string,
  startTime: number
): void {
  const url = `https://www.youtube.com/watch?v=${youtubeVideoId}&t=${Math.floor(
    startTime
  )}s`;
  window.open(url, "_blank");
}

// Alternative: Use YouTube's embedded player
export function createEmbeddedYouTubePlayer(
  youtubeVideoId: string,
  startTime: number
): string {
  return `https://www.youtube.com/embed/${youtubeVideoId}?start=${Math.floor(
    startTime
  )}`;
}
