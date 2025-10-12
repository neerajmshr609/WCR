import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { takeUntil, tap } from 'rxjs/operators';
import { IframelyService } from 'src/app/services/iframely.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-preview-iframe-modal',
  templateUrl: './preview-iframe-modal.component.html',
  styleUrls: ['./preview-iframe-modal.component.scss'],
})
export class PreviewIframeModalComponent
  extends BaseComponent
  implements OnInit
{
  public iframeSrc: SafeHtml;

  constructor(
    private iframelyService: IframelyService,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {
    super();
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.iframelyService
      .getIframeSrc(this.data)
      .pipe(
        takeUntil(this.destroyed),
        tap((res: string) => (this.iframeSrc = res)),
      )
      .subscribe();
  }
}
