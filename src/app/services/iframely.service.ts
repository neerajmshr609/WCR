import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { createHttpParams } from '../shared/functions/http-params';
import { IframelyResponse } from '../shared/models/iframely-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IframelyService {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}

  public getIframe(url: string): Observable<IframelyResponse> {
    const params = createHttpParams({
      url,
      api_key: '8c6b3ed76acda1db27f921',
      omit_css: 1,
      autoplay: 0,
      mute: 0,
      height: 395,
      thumbnail_height: 395,
      _showcaption: false,
      theme: 'dark',
    });

    return this.http.get<IframelyResponse>('https://iframe.ly/api/oembed', {
      params,
    });
  }

  public getIframeSrc(url: string): Observable<SafeHtml> {
    return this.getIframe(url).pipe(
      map((res: IframelyResponse) => {
        return this.sanitizer.bypassSecurityTrustHtml(res.html);
      }),
    );
  }
}
