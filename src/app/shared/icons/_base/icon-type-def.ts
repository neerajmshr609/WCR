import { TemplateRef } from '@angular/core';
import { IconComponentType } from '../base-icon.directive';

export interface IconComponentRenderContext {
  color: string;
  strokeWidth: number;
  fill: string;
}
export type IconType = TemplateRef<unknown> | string | IconComponentType;

export interface IRenderableIcon {
  icon: IconType;
  icon_alt?: string;
}
