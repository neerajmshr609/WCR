import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { LANGUAGES } from '../../constants';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesComponent {
  languages = input<UntypedFormControl>();
  save = output<string>();

  languagesList: string[] = LANGUAGES;

  chooseLanguage(lang: string): void {
    this.save.emit(lang);
  }
}
