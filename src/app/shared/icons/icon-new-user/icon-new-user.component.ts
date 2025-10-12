import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconDirective } from '@icons/base-icon.directive';

@Component({
  selector: 'app-icon-new-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-new-user.component.html',
  styleUrls: ['./icon-new-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconNewUserComponent extends BaseIconDirective {}
