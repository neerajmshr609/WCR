import { Component, computed, ViewEncapsulation } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HtmlLangBasedLoadService } from '../../services/html-lang-based-load.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  providers: [HtmlLangBasedLoadService],
  // This disables encapsulation, and the styles are applied globally. This allows applying styles to the innerHTML content.
  encapsulation: ViewEncapsulation.None,
})
export class TermsComponent {
  private destroyed$ = new Subject<void>();

  constructor(
    private _translateService: TranslateService,
    private _languageService: LanguageService,
    public htmlLangBasedLoadService: HtmlLangBasedLoadService,
  ) {}

  ngOnInit(): void {
    const filePathMap = {
      DE: '/assets/translations/terms/de.html',
      UK: '/assets/translations/terms/uk.html',
      RU: '/assets/translations/terms/ru.html',
    };
    const defaultFilePath = '/assets/translations/terms/en.html';
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
