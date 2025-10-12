import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-members-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './members-icon.component.html',
  styleUrls: ['./members-icon.component.scss'],
})
export class MembersIconComponent extends BaseIconDirective {}
