import { isVideoType, isPDF, isImageType, isAudio } from './check-types';

export function getFileKind(type: string): string {
  if (isVideoType(type)) {
    return 'video';
  }
  if (isPDF(type)) {
    return 'pdf';
  }
  if (isImageType(type)) {
    return 'image';
  }

  if (isAudio(type)) {
    return 'audio';
  }

  return 'dummy';
}
