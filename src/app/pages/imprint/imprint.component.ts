import { Component, computed, ViewEncapsulation } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HtmlLangBasedLoadService } from '../../services/html-lang-based-load.service';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss'],
  providers: [HtmlLangBasedLoadService],
  // This disables encapsulation, and the styles are applied globally. This allows applying styles to the innerHTML content.
  encapsulation: ViewEncapsulation.None,
})
export class ImprintComponent {
  private destroyed$ = new Subject<void>();

  constructor(
    private _translateService: TranslateService,
    private _languageService: LanguageService,
    public htmlLangBasedLoadService: HtmlLangBasedLoadService,
  ) {}

  ngOnInit(): void {
    const filePathMap = {
      DE: '/assets/translations/imprint/de.html',
      UK: '/assets/translations/imprint/uk.html',
      RU: '/assets/translations/imprint/ru.html',
    };
    const defaultFilePath = '/assets/translations/imprint/en.html';
    this.htmlLangBasedLoadService.loadHtml(filePathMap, defaultFilePath);

    // Subscribe to language changes
    this._translateService.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: LangChangeEvent) => {
        this.htmlLangBasedLoadService.loadHtml(filePathMap, defaultFilePath);
      });
  }

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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
