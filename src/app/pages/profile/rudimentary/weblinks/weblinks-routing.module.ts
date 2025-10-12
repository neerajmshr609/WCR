import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeblinksComponent } from './layout/weblinks.component';

const routes: Routes = [{ path: '', component: WeblinksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeblinksRoutingModule {}
