import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UserProfile } from '../../../model/user-profile.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  readonly profile = input.required<UserProfile>();
  readonly scoresList = computed(() => this.profile().activity_score.getListActivitiesHasValues());
}
