import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '../base-icon.directive';

@Component({
  selector: 'app-add-members-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './add-members-icon.component.html',
  styleUrls: ['./add-members-icon.component.scss'],
})
export class AddMembersIconComponent extends BaseIconDirective {}
