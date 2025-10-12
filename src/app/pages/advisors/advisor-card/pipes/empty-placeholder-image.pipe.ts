import { Pipe, PipeTransform } from '@angular/core';
import { EMPTY_PLACEHOLDER_IMAGES } from '../empty-placeholder-images';

@Pipe({
  name: 'emptyPlaceholderImage',
})
export class EmptyPlaceholderImagePipe implements PipeTransform {
  transform(value: unknown): string {
    const random = Math.floor(Math.random() * EMPTY_PLACEHOLDER_IMAGES.length);
    return EMPTY_PLACEHOLDER_IMAGES[random];
  }
}
