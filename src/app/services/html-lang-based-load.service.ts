import { LanguageService } from '../services/language.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fi } from 'date-fns/locale';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})

// Service for dynamic loading of HTML parts content based on the selected language
export class HtmlLangBasedLoadService {
  constructor(
    private _httpClient: HttpClient,
    private _languageService: LanguageService,
  ) {}

  htmlContent: string = '';

  public loadHtml(
    filePathMap: { [key: string]: string },
    defaultFilePath: string,
  ): void {
    const language = this._languageService.currentLanguageCode().toUpperCase();
    const filePath = filePathMap[language] || defaultFilePath;
    this.loadPolicyFromFile(filePath);
  }

  private loadPolicyFromFile(filePath: string): void {
    this._httpClient.get(filePath, { responseType: 'text' }).subscribe(
      (data) => {
        this.htmlContent = data;
      },
      (error) => {
        console.error('Failed to load policy HTML:', error);
      },
    );
  }
}
