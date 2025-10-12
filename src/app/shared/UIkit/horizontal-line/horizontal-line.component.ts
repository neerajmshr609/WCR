import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horizontal-line',
  standalone: true,
  imports: [CommonModule],
  template: `<hr class="horizontal-line" />`,
  styleUrls: ['./horizontal-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalLineComponent {

}
