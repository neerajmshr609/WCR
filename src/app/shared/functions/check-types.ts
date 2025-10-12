export function isImageType(type: string): boolean {
  const imageRegex = /^image\/(jpeg|png|gif|bmp|webp|tiff|svg\+xml)$/g;
  return imageRegex.test(type);
}

export function isVideoType(type: string): boolean {
  const videoRegex = /^video\/(mp4|webm|ogg)$/g;
  return videoRegex.test(type);
}

export function isPDF(type: string): boolean {
  const pdfRegex = /^application\/pdf$/g;
  return pdfRegex.test(type);
}

export function isAudio(type: string): boolean {
  const audioRegex = /^audio\/(mp3|wav|ogg|mpeg)$/g;
  return audioRegex.test(type);
}
