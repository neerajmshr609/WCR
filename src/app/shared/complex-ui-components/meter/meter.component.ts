import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconVectorComponent } from '../../icons/icon-vector/icon-vector.component';
import { Rgba } from '../../lib/rgba';

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [CommonModule, IconVectorComponent],
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterComponent {
  readonly rotateCoefficient = input<number | null>(null);
  readonly color = input<string>('#B0B0B0');
  readonly rotateDeg = computed(() => {
    const coefficient = this.rotateCoefficient();
    return coefficient === null ? 0 : (coefficient - 0.5) * 180;
  });

  @HostBinding('style.borderColor')
  get borderColor() {
    return this.color();
  }
}
