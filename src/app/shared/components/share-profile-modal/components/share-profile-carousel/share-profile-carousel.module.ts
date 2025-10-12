import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareProfileCarouselComponent } from './share-profile-carousel.component';
import { ShareModule } from 'ngx-sharebuttons';
import { TranslateModule } from '@ngx-translate/core';
import { IvyCarouselModule } from 'angular-responsive-carousel-ng16';

@NgModule({
  declarations: [ShareProfileCarouselComponent],
  exports: [ShareProfileCarouselComponent],
  imports: [CommonModule, IvyCarouselModule, ShareModule, TranslateModule],
})
export class ShareProfileCarouselModule {}
