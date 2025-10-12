import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollBtnComponent } from './scroll-btn.component';
import { IsCanScrollDirective } from './is-can-scroll.directive';

@NgModule({
  declarations: [ScrollBtnComponent, IsCanScrollDirective],
  exports: [ScrollBtnComponent, IsCanScrollDirective],
  imports: [CommonModule],
})
export class ScrollBtnModule {}
