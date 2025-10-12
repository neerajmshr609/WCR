import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { DaysWeek } from 'src/app/shared/constants';
import { Ruleset } from 'src/app/shared/models/ruleset';
import { Week } from 'src/app/shared/models/week';

@Component({
  selector: 'app-advisor-schedule',
  templateUrl: './advisor-schedule.component.html',
  styleUrls: ['./advisor-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvisorScheduleComponent implements OnInit {
  @Input() ruleset: Ruleset;

  days: Week[] = DaysWeek;

  constructor() {}

  ngOnInit(): void {
    this.days.forEach(
      (d, index) => (d.status = this.ruleset.weekdays.includes(index)),
    );
  }
}
