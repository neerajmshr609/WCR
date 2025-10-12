import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsPreviewIcebreakerPipe } from './is-preview-icebreaker.pipe';

@NgModule({
  declarations: [IsPreviewIcebreakerPipe],
  imports: [CommonModule],
  exports: [IsPreviewIcebreakerPipe],
  providers: [IsPreviewIcebreakerPipe],
})
export class IsPreviewIcebreakerMessageModule {}
