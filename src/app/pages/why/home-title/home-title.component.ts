import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home-title',
  templateUrl: './home-title.component.html',
  styleUrls: ['./home-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTitleComponent {
  readonly titleText$ = this.translateService
    .stream([
      'home.title_rebuilding',
      'home.title_side',
      'home.title_beyond',
      'home.title_every_step',
      'home.title_crisis',
      'home.title_each_other',
      'home.title_each_remotely',
    ])
    .pipe(map<object, string[]>((_) => Object.values(_)));

  constructor(private readonly translateService: TranslateService) {}
}
