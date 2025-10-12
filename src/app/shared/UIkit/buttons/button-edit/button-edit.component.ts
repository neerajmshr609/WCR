import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';
import { IconSettingsGearComponent } from '../../../icons/icon-settings-gear/icon-settings-gear.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-button-edit',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconSettingsGearComponent, TranslateModule],
  templateUrl: './button-edit.component.html',
  styleUrls: ['./button-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonEditComponent {
  readonly editTargetName = input<string>('');
  readonly afterEditText = computed(() => {
    const editTargetName = this.editTargetName();
    return editTargetName ? ` ${editTargetName}` : '';
  });
}
