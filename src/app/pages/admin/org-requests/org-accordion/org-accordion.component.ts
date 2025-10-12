import { Component, HostListener, input, output, signal } from '@angular/core';
import { IOrganization } from 'src/app/pages/usersettings/interfaces';
import { OrganizationService } from 'src/app/services/organization.service';

@Component({
  selector: 'app-org-accordion',
  templateUrl: './org-accordion.component.html',
  styleUrls: ['./org-accordion.component.scss'],
})
export class OrgAccordionComponent {
  expand = output<number>();
  updateOrg = output<IOrganization[]>();
  org = input<IOrganization>();

  accordionInpIsChecked = signal<boolean>(false);
  defaultAvatar: string = '/assets/avatars/1.svg';

  constructor(private readonly organizationService: OrganizationService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest(`.idx${this.org().id}`)) {
      this.accordionInpIsChecked.set(false);
    }
  }

  toggle(event): void {
    this.accordionInpIsChecked.set(event.target.checked);
    this.expand.emit(event.target.checked ? this.org().id : 0);
  }

  approveOrg(): void {
    this.organizationService
      .changePendingOrgStatus(this.org().id, {
        ...this.org(),
        status: 'accepted',
      })
      .subscribe((res) => {
        this.updateOrg.emit(res);
      });
  }

  rejectOrg(): void {
    this.organizationService
      .changePendingOrgStatus(this.org().id, {
        ...this.org(),
        status: 'denied',
      })
      .subscribe((res) => {
        this.updateOrg.emit(res);
      });
  }
}
