import { ChangeDetectorRef, Component, model, OnInit } from '@angular/core';
import { FORMS } from '../../constants/forms';
import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, takeUntil, tap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { OrganizationService } from 'src/app/services/organization.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IOrganization } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-org-information',
  styleUrls: ['./org-information.component.scss'],
  templateUrl: './org-information.component.html',
})
export class OrgInformationComponent extends BaseComponent implements OnInit {
  form: UntypedFormGroup;
  formData = FORMS['organization'];
  organization = model<IOrganization>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private organizationService: OrganizationService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.handlePreCreateOrg();
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      short_name: new FormControl(this.organization().short_name, [
        Validators.required,
      ]),
      legal_name: new FormControl(this.organization().legal_name, [
        Validators.required,
      ]),
      org_handle: new FormControl(this.organization().org_handle),
      email: new FormControl(this.organization().email, [
        Validators.required,
        Validators.email,
      ]),
      org_logo: new FormControl(this.organization().org_logo),
      street: new FormControl(this.organization().street),
      city: new FormControl(this.organization().city),
      apartment_number: new FormControl(this.organization().apartment_number),
      postal_code: new FormControl(this.organization().postal_code),
      reg_number: new FormControl(this.organization().reg_number),
      org_profit_status: new FormControl(
        this.organization().org_profit_status,
        [Validators.required],
      ),
      vat_number: new FormControl(this.organization().vat_number),
    });

    this.subscribeToForm();
  }

  private handlePreCreateOrg() {
    const orgName = this.activatedRoute.snapshot.queryParamMap.get('org_name');
    if (orgName) {
      this.form.patchValue({ full_name: orgName });
    }
  }

  private subscribeToForm(): void {
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);

      if (control) {
        control.valueChanges.pipe(debounceTime(2000)).subscribe((res) => {
          this.saveOrgChanges({ [controlName]: res });
        });
      }
    });

    this.changeDetectorRef.detectChanges();
  }

  saveOrgChanges(body): void {
    if (!this.form.invalid) {
      this.organizationService
        .updateOrganizations(body, this.organization().id)
        .pipe(
          takeUntil(this.destroyed),
          tap(() => {
            this.snackBar.open('Saved!', null, { duration: 1000 });
          }),
        )
        .subscribe((res) => this.organization.set(res));
    }
  }

  selectAvatar(avatar: string): void {
    this.form.patchValue({ org_logo: avatar });
  }

  openUploader(url: string): void {
    this.form.patchValue({ org_logo: url });
  }
}
