import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { OrganizationService } from 'src/app/services/organization.service';
import { IOrganization } from '../../usersettings/interfaces';

@Component({
  selector: 'app-org-requests',
  templateUrl: './org-requests.component.html',
  styleUrls: ['./org-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgRequestsComponent implements OnInit {
  expandedPermissionsId = signal('');
  pendingOrgs = signal<IOrganization[]>([]);

  constructor(private organizationService: OrganizationService) {}

  ngOnInit(): void {
    this.getOrgRequsts();
  }

  private getOrgRequsts() {
    this.organizationService.getPendingOrgs().subscribe((res) => {
      this.pendingOrgs.set(res.orgs_waiting_for_requests);
    });
  }

  expandUserPermissionCard(id: string): void {
    this.expandedPermissionsId.set(id);
  }

  updateOrg(orgs: IOrganization[]): void {
    this.pendingOrgs.set(orgs);
  }
}
