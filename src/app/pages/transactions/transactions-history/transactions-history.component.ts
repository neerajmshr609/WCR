import { Component, OnInit } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.scss'],
})
export class TransactionsHistoryComponent implements OnInit {
  transactions: Transaction[];

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.transactionsService.fetchTransactions().subscribe((transactions) => {
      this.transactions = transactions;
    });
  }
}
