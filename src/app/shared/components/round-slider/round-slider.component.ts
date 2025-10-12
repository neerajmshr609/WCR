import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { getColor } from '../../functions/get-score-color';

@Component({
  selector: 'app-round-slider',
  templateUrl: './round-slider.component.html',
  styleUrls: ['./round-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundSliderComponent {
  @Input() private score: number;
  @Input() public hideDigits: boolean;

  public get transform(): string {
    const score = this.score == null ? 50 : this.score;
    const deg = 90 + (score * 180) / 100;
    return `translateX(-50%) translateY(50%) rotate(${deg}deg)`;
  }

  public get arrowFill(): string {
    return getColor(this.score).color;
  }
}
