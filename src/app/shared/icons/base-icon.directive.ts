import { Directive, input } from '@angular/core';
import { IconComponentRenderContext } from './_base/icon-type-def';

export type IconComponentType = new (...args: unknown[]) => BaseIconDirective;

@Directive({
  selector: '[appBaseIcon]',
  standalone: true,
})
export class BaseIconDirective {
  public color = input<IconComponentRenderContext['color']>('#1E1E1E');
  public strokeWidth = input<IconComponentRenderContext['strokeWidth']>(2.5);
  public fill = input<IconComponentRenderContext['fill']>('#1E1E1E');
}
