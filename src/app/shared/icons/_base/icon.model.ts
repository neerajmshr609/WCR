import { IconType } from './icon-type-def';
import { TemplateRef } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

class IconModel {
  constructor(readonly icon: IconType) {}

  isImgSrc() {
    return typeof this.icon === 'string';
  }

  isTemplateRef() {
    return this.icon instanceof TemplateRef;
  }

  isComponent() {
    if (!this.icon) {
      return false;
    }
    return Object.getPrototypeOf(this.icon) === BaseIconDirective;
  }
}

export const parseIcon = (icon: IconType) => {
  if (!icon) {
    return;
  }
  const parsed = new IconModel(icon);
  if (!(parsed.isComponent() || parsed.isTemplateRef() || parsed.isImgSrc())) {
    throw new Error('Invalid icon data');
  }
  return parsed;
};
