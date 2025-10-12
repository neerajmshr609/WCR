import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SearchIconComponent } from '../../../icons/search-icon/search-icon.component';
import { CloseIconComponent } from '../../../icons/close-icon/close-icon.component';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SearchIconComponent,
    CloseIconComponent,
  ],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  readonly placeholder = input('Value');
  readonly disabled = input(false);
  readonly square = input(false);
  readonly focused = output<FocusEvent>();

  readonly searchText = model<string>('');
  readonly iconColor = computed(() =>
    this.disabled() ? '#B3B3B3' : '#1E1E1E',
  );

  readonly emptyValue = computed(() => !this.searchText());

  searchValueChanged({ target }: Event) {
    if (!this.disabled()) {
      this.searchText.set((target as HTMLInputElement).value);
    }
  }

  clear(): void {
    if (!this.disabled()) {
      this.searchText.set('');
    }
  }
}
