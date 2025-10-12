import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SearchIconComponent } from '../../icons/search-icon/search-icon.component';
import { CoreModule } from '../../modules/core.module';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchIconComponent, CoreModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  public control = input<AbstractControl | undefined | null>();
  public inputName = input<string>();
  public label = input<string>();
  public placeholder = input<string>();
  public disabled = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });
}
