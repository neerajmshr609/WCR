import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';
import { getColor } from '../functions/get-score-color';

@Directive({
  selector: '[appScoreColor]',
})
export class ScoreColorDirective implements OnChanges {
  @Input() appScoreColor: number;
  @Input() setStyle = 'backgroundColor';

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    this.el.nativeElement.style[this.setStyle] = getColor(
      this.appScoreColor,
    ).color;
  }
}
