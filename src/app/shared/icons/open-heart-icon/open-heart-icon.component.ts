import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-open-heart-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './open-heart-icon.component.html',
  styleUrls: ['./open-heart-icon.component.scss'],
})
export class OpenHeartIconComponent extends BaseIconDirective {}
