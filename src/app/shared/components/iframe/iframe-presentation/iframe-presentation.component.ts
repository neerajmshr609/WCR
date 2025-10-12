import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Projectfile } from 'src/app/shared/models/projectfile.model';
import { IframelyService } from 'src/app/services/iframely.service';

@Component({
  selector: 'app-iframe-presentation',
  templateUrl: './iframe-presentation.component.html',
  styleUrls: ['./iframe-presentation.component.scss'],
})
export class IframePresentationComponent extends BaseComponent {
  @Input() public file: Projectfile;

  public iframeSrc: SafeHtml;
  public loaded: boolean;

  constructor(private iframelyService: IframelyService) {
    super();
  }

  load() {
    this.iframelyService
      .getIframeSrc(this.file.url)
      .pipe(
        takeUntil(this.destroyed),
        tap((res: SafeHtml) => {
          this.iframeSrc = res;
          this.loaded = true;
        }),
      )
      .subscribe();
  }
}
