import { Component, computed, ViewEncapsulation } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HtmlLangBasedLoadService } from '../../services/html-lang-based-load.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
  providers: [HtmlLangBasedLoadService],
  // This disables encapsulation, and the styles are applied globally. This allows applying styles to the innerHTML content.
  encapsulation: ViewEncapsulation.None,
})
export class PolicyComponent {
  constructor(
    private _translateService: TranslateService,
    private _languageService: LanguageService,
    public htmlLangBasedLoadService: HtmlLangBasedLoadService,
  ) {}

  private destroyed$ = new Subject<void>();

  readonly company = {
    name: 'Greyt.IT UG',
    docName: 'Getme.Global',
    supportEmail: 'support@Getme.Global',
    appUrl: 'https://www.Getme.Global',
  };
  readonly googleGaOptOut = computed(
    () =>
      'http://tools.google.com/dlpage/gaoptout?hl=' +
      this._languageService.currentLanguageCode(),
  );

  ngOnInit(): void {
    const filePathMap = {
      DE: '/assets/translations/policy/de.html',
      UK: '/assets/translations/policy/uk.html',
      RU: '/assets/translations/policy/ru.html',
    };
    const defaultFilePath = '/assets/translations/policy/en.html';
    this.htmlLangBasedLoadService.loadHtml(filePathMap, defaultFilePath);

    // Subscribe to language changes
    this._translateService.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: LangChangeEvent) => {
        this.htmlLangBasedLoadService.loadHtml(filePathMap, defaultFilePath);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
