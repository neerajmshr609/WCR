import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-icon-vector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-vector.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconVectorComponent extends BaseIconDirective {
  readonly color = input('#B0B0B0');
  readonly rotateDeg = input(0);
  readonly rotateTransform = computed(() => `rotate(${this.rotateDeg()}deg)`);
  readonly translateXY = computed(() => {
    const rotateCoefficient = this.rotateDeg() / 90;
    const translateX = (rotateCoefficient * 200) / 3;
    const translateY = -Math.abs(rotateCoefficient) * 29;
    return `translate(${translateX}%, ${translateY}%)`;
  });

  readonly transform = computed(
    () => `${this.rotateTransform()} ${this.translateXY()}`,
  );
}
