import { Pipe, PipeTransform } from '@angular/core';
import { IframelyService } from '../../../../../../../../services/iframely.service';
import { SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Pipe({
  name: 'getIframe',
})
export class GetIframePipe implements PipeTransform {
  constructor(private readonly iframlyService: IframelyService) {}

  transform(url: string): Observable<SafeHtml> {
    return this.iframlyService.getIframeSrc(url);
  }
}
