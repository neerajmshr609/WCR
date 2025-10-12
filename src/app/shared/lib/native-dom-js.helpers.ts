import { ElementRef } from '@angular/core';
import { EventWithTarget } from './ts-utils.lib';

export const isOutside = (
  { target }: EventWithTarget,
  { nativeElement }: ElementRef<HTMLElement>
) => {
  return !nativeElement.contains(target);
};