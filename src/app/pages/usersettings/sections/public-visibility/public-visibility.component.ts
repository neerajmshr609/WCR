import { Component } from '@angular/core';
import { Permisson } from '../../interfaces';

@Component({
  selector: 'app-public-visibility',
  templateUrl: './public-visibility.component.html',
})
export class PublicVisibilityComponent {
  permissions: Permisson[] = [
    // need definition
    {
      name: 'Show Public Profile',
      description:
        'Allow clients to schedule live video calls with you directly.',
    },
    {
      name: 'Feature',
      description:
        'Every free calendar spot will be auto scheduled  if a registered users requests an appointment with you.',
    },
    {
      name: 'Hide Quick Questions from Profile',
      description:
        'Only other counsellors will be able to directly contact you via the counsellor desk board. ',
    },
  ];
}
