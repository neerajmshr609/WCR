import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetIframePipe } from './get-iframe.pipe';

@NgModule({
  declarations: [GetIframePipe],
  exports: [GetIframePipe],
  imports: [CommonModule],
})
export class GetIframeModule {}
