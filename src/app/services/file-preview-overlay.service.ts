import { Injectable, Input } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { InjectorService } from './injector.service';
import { FilePreviewOverlayRef } from '../shared/components/file-preview/file-preview-overlay-ref';
import { FilePreviewOverlayComponent } from '../shared/components/file-preview/file-preview-overlay.component';

interface FilePreviewDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: FilePreviewDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'tm-file-preview-dialog-panel',
};

@Injectable({
  providedIn: 'root',
})
export class FilePreviewOverlayService {
  @Input() overlayTitle: string;
  @Input() overlayText: string;
  @Input() imageURL: string;

  constructor(
    private injectorService: InjectorService,
    private overlay: Overlay,
  ) {}

  open(config: FilePreviewDialogConfig = {}) {
    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    const dialogRef = new FilePreviewOverlayRef(overlayRef);

    // Create ComponentPortal that can be attached to a PortalHost
    const filePreviewPortal = new ComponentPortal(
      FilePreviewOverlayComponent,
      null,
      this.injectorService.createInjector({ youtubeVideoId: null }),
    );

    // Attach ComponentPortal to PortalHost
    overlayRef.attach(filePreviewPortal);

    overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        dialogRef.close();
      }
    });

    const image = document.querySelector('.overlay-image') as HTMLElement;
    image.setAttribute('src', this.imageURL);

    if (!this.imageURL) {
      image.setAttribute('src', '');
      image.style.display = 'none';
    }

    if (!this.overlayTitle) {
      const description = document.querySelector(
        '.overlay-description-container',
      ) as HTMLElement;
      description.style.display = 'none';
    }

    const title = document.querySelector('.overlay-title') as HTMLElement;
    const desc = document.querySelector('.overlay-desc') as HTMLElement;
    title.innerHTML = this.overlayTitle;
    desc.innerHTML = this.overlayText;

    document.querySelector('.close-button').addEventListener('click', () => {
      dialogRef.close();
    });

    overlayRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });

    return dialogRef;
  }

  private createOverlay(config: FilePreviewDialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: FilePreviewDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }
}
