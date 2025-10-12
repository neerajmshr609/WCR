import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardImageComponent {
  readonly image = input.required<string | Component>();
  readonly isImgSrc = computed(() => typeof this.image() === 'string');
  readonly isComponent = computed(() => this.image() instanceof Component);
}
