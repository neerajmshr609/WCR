import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  SimpleChanges,
  OnChanges,
  output,
} from '@angular/core';
import { FORMS } from '../../constants/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';
import {
  catchError,
  debounceTime,
  of,
  takeUntil,
  filter,
  switchMap,
} from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { OrganizationService } from 'src/app/services/organization.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrganization } from '../../interfaces';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-org',
  templateUrl: './create-org.component.html',
  styleUrls: ['./create-org.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrgComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  organization = input<IOrganization>();
  deletedOrgEvent = output<IOrganization>();

  form: FormGroup = new FormGroup({});
  formData = FORMS['organization'];
  isMobile: boolean = window.innerWidth < 769;

  constructor(
    private uploaderService: UploaderService,
    private organizationService: OrganizationService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
  ) {
    super();

    this.uploaderService.uploaderConfig = {
      id: 'uploader--organizations-avatar',
      target: 'uploader--organizations-avatar',
      inline: false,
    };
  }

  ngOnInit(): void {
    this.initializeForm();
    const orgName = this.activatedRoute.snapshot.queryParams.organization_name;
    if (orgName) {
      this.form.patchValue({ legal_name: orgName });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.organization.currentValue) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      org_logo: new FormControl(this.organization()?.org_logo ?? ''),
      short_name: new FormControl(this.organization()?.short_name ?? '', [
        Validators.required,
      ]),
      legal_name: new FormControl(this.organization()?.legal_name ?? '', [
        Validators.required,
      ]),
      org_handle: new FormControl(this.organization()?.org_handle ?? ''),
      email: new FormControl(this.organization()?.email ?? '', [
        Validators.required,
        Validators.email,
      ]),
      street: new FormControl(this.organization()?.street ?? ''),
      city: new FormControl(this.organization()?.city ?? ''),
      apartment_number: new FormControl(
        this.organization()?.apartment_number ?? '',
      ),
      postal_code: new FormControl(this.organization()?.postal_code ?? ''),
      reg_number: new FormControl(this.organization()?.reg_number ?? ''),
      org_profit_status: new FormControl(
        this.organization()?.org_profit_status ?? '',
        [Validators.required],
      ),
      vat_number: new FormControl(this.organization()?.vat_number ?? ''),
    });
  }

  private markFieldsTouchedWithErrors(form: FormGroup): void {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      if (control && control.errors) {
        control.markAsTouched();
      }
    });
  }

  createOrg(): void {
    if (!this.form.invalid) {
      this.organizationService
        .createOrganizations(this.form.value)
        .pipe(
          debounceTime(2000),
          takeUntil(this.destroyed),
          catchError(() => {
            this._translatedMessage('failed_org_sa');
            return of({ error: true, message: 'Failed to create org' });
          }),
        )
        .subscribe(() => {
          this._translatedMessage('saved');
          this.router.navigate(['/home']);
        });
    } else {
      this.markFieldsTouchedWithErrors(this.form);
    }
  }

  updateOrg(): void {
    if (!this.form.invalid) {
      this.organizationService
        .updateOrganizations(this.form.value, this.organization().id)
        .pipe(
          debounceTime(2000),
          takeUntil(this.destroyed),
          catchError(() => {
            this._translatedMessage('failed_org_sa');
            return of({ error: true, message: 'Failed to create org' });
          }),
        )
        .subscribe(() => {
          this._translatedMessage('saved');
        });
    } else {
      this.markFieldsTouchedWithErrors(this.form);
    }
  }

  deleteOrg(): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      maxWidth: this.isMobile ? '320px' : '450px',
      width: '100%',
      data: {
        title: 'org_deletion_confilmation.title',
        subtitle: 'org_deletion_confilmation.subtitle',
        question: 'org_deletion_confilmation.question',
        cancel_btn: 'org_deletion_confilmation.cancel_btn',
        confirm_btn: 'org_deletion_confilmation.confirm_btn',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((confirm) => confirm),
        switchMap(() =>
          this.organizationService.deleteOrganizations(this.organization().id),
        ),
      )
      .subscribe((res) => {
        this.form.reset();
        this.deletedOrgEvent.emit(this.organization());
      });
  }

  selectAvatar(url: string): void {
    this.form.patchValue({ org_logo: url });
  }

  openUploader(decodedUrl: string): void {
    this.form.patchValue({ org_logo: decodedUrl });
  }

  private _translatedMessage(message: string) {
    this.translate.get(message).subscribe((message) => {
      this.snackBar.open(message, null, {
        duration: 3000,
      });
    });
  }
}
