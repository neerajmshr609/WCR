import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-communities-icon',
  templateUrl: './communities-icon.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./communities-icon.component.scss'],
})
export class CommunitiesIconComponent extends BaseIconDirective {}
