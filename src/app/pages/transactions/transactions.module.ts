import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { MomentModule } from 'ngx-moment';
import { TransactionsCapComponent } from './transactions-cap/transactions-cap.component';
import { TransactionsInvoicesComponent } from './transactions-invoices/transactions-invoices.component';
import { TransactionsIdeasComponent } from './transactions-ideas/transactions-ideas.component';
import { ProjectMenuTopComponent } from './project-menu-top/project-menu-top.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionsHistoryComponent,
    TransactionsCapComponent,
    TransactionsInvoicesComponent,
    TransactionsIdeasComponent,
    ProjectMenuTopComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    TransactionsRoutingModule,
    MomentModule,
  ],
  exports: [],
})
export class TransactionsModule {}
