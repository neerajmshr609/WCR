import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../components/base.component';
import { backgroundColor } from 'html2canvas/dist/types/css/property-descriptors/background-color';

@Component({
  selector: 'app-icon-shake-hands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-shake-hands.component.html',
  styleUrls: ['../icon.base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconShakeHandsComponent extends BaseComponent {
  readonly color = input('#1e1e1e');
  readonly backgroundColor = input('#F5F5F5');
}
