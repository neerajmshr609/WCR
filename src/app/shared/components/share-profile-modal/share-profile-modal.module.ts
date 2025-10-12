import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareProfileModalComponent } from './share-profile-modal.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ShareModule } from 'ngx-sharebuttons';
import { ShareProfileCarouselModule } from './components/share-profile-carousel/share-profile-carousel.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ShareProfileModalComponent],
  exports: [ShareProfileModalComponent],
  imports: [
    CommonModule,
    ClipboardModule,
    MatDialogModule,
    ShareModule,
    ShareProfileCarouselModule,
  ],
})
export class ShareProfileModalModule {
}
