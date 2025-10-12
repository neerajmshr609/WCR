import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImprintComponent } from './imprint.component';
import { ImprintRoutingModule } from './imprint-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MetaModule } from '@ngx-meta/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ImprintComponent],
  imports: [
    CommonModule,
    ImprintRoutingModule,
    TranslateModule,
    MetaModule,
    HttpClientModule,
  ],
})
export class ImprintModule {}
