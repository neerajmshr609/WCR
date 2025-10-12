import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhyComponent } from './why.component';
import { I18nHomeGuard } from './i18n-home.guard';

const routes: Routes = [
  {
    path: '',
    component: WhyComponent,
    canActivate: [I18nHomeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [I18nHomeGuard],
})
export class WhyRoutingModule {}
