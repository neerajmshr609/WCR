import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteContentDirective } from './autocomplete-content.directive';
import { AutocompleteComponent } from './autocomplete.component';
import { AutocompleteDirective } from './autocomplete.directive';
import { AutocompleteOptionComponent } from './autocomplete-option/autocomplete-option.component';

@NgModule({
  declarations: [
    AutocompleteComponent,
    AutocompleteContentDirective,
    AutocompleteDirective,
    AutocompleteOptionComponent,
  ],
  imports: [CommonModule],
  exports: [
    AutocompleteComponent,
    AutocompleteContentDirective,
    AutocompleteDirective,
    AutocompleteOptionComponent,
  ],
})
export class AutocompleteModule {}
