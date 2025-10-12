import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';
import { getColor } from '../functions/get-score-color';

@Directive({
  selector: '[appScoreEmoji]',
})
export class ScoreEmojiDirective implements OnChanges {
  @Input() appScoreEmoji: number;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    const imgElements = this.el.nativeElement.getElementsByTagName('img');
    for (const item of imgElements) {
      this.renderer.removeChild(this.el.nativeElement, item);
    }
    const { icon } = getColor(this.appScoreEmoji);
    const imgElement = this.renderer.createElement('img');
    this.renderer.setAttribute(imgElement, 'src', icon);
    this.renderer.appendChild(this.el.nativeElement, imgElement);
  }
}
