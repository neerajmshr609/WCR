import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [],
  imports: [LayoutModule, OverlayModule, ScrollingModule, DragDropModule],
  exports: [LayoutModule, OverlayModule, ScrollingModule, DragDropModule],
})
export class CdkModule {}
