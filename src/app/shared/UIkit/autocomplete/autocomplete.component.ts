import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  input,
  output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AutocompleteContentDirective } from './autocomplete-content.directive';
import { AutocompleteOptionComponent } from './autocomplete-option/autocomplete-option.component';
import { switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { OptionType } from './types/option-type';

@Component({
  selector: 'app-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'appAutocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent<T extends object> {
  public placeholder = input<string>();
  public valueChange = output<OptionType<T>>();

  @ViewChild('root') rootTemplate: TemplateRef<any>;

  @ContentChild(AutocompleteContentDirective)
  content: AutocompleteContentDirective;

  @ContentChildren(AutocompleteOptionComponent)
  options: QueryList<AutocompleteOptionComponent<T>>;

  optionsClick() {
    return this.options.changes.pipe(
      switchMap((options) => {
        const clicks$ = options.map((option) => option.click$);
        return merge(...clicks$);
      }),
    );
  }
}
