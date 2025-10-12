import { Component, Input, OnInit } from '@angular/core';
import { Week } from 'src/app/shared/models/week';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss'],
})
export class WeekComponent implements OnInit {
  @Input() weekData: number[];

  days: Week[] = [
    {
      name: 'scheduling.week_days.mo',
      status: false,
    },
    {
      name: 'scheduling.week_days.tu',
      status: false,
    },
    {
      name: 'scheduling.week_days.we',
      status: false,
    },
    {
      name: 'scheduling.week_days.th',
      status: false,
    },
    {
      name: 'scheduling.week_days.fr',
      status: false,
    },
    {
      name: 'scheduling.week_days.sa',
      status: false,
    },
    {
      name: 'scheduling.week_days.su',
      status: false,
    },
  ];
  result: Week[];

  constructor() {}

  ngOnInit(): void {
    if (this.weekData) {
      this.resultData(this.weekData);
    }
  }

  resultData(data: number[]): void {
    this.result = this.days;
    data.forEach((index: number): void => {
      this.result[index].status = true;
    });
  }
}
