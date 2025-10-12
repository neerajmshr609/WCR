import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersettingsModule } from '../../../../../usersettings/usersettings.module';
import { IconVisibleComponent } from '@icons/icon-visible/icon-visible.component';

@Component({
  selector: 'app-more-icebreaker',
  standalone: true,
  imports: [CommonModule, UsersettingsModule, IconVisibleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './more-icebreaker.component.html',
  styleUrls: ['./more-icebreaker.component.scss'],
})
export class MoreIcebreakerComponent {}
