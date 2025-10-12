import { Component, input } from '@angular/core';
import { OrganizationMember } from '../model/organization-member.model';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent {
  member = input<OrganizationMember>();
}
