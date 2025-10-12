import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-bell-icon',
  templateUrl: './bell-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BellIconComponent extends BaseIconDirective {}
