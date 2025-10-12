import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IframelyEmbedComponent } from './iframely-embed.component';
import { PipesModule } from '../../../../../../shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [IframelyEmbedComponent],
  exports: [IframelyEmbedComponent],
  imports: [CommonModule, PipesModule, TranslateModule],
})
export class IframelyEmbedModule {}
