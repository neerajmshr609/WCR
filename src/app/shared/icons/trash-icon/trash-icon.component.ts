import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-trash-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trash-icon.component.html',
  styleUrl: './trash-icon.component.scss',
})
export class TrashIconComponent extends BaseIconDirective {}
