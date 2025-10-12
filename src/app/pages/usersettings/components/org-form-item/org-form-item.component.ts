import {
  Component,
  input,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  computed,
  output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IFormInput, IFormModel, IOrgPartner } from '../../interfaces';
import { DeleteIconComponent } from 'src/app/shared/icons/delete-icon/delete-icon.component';
import { catchError, of } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';

@Component({
  selector: 'app-org-form-item',
  templateUrl: './org-form-item.component.html',
  styleUrls: ['./org-form-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgFormItemComponent implements AfterViewInit, OnChanges {
  formData = input<IFormInput>();
  isAdded = input();
  formItem = input<IOrgPartner>();
  orgId = input<number>();
  save = output<unknown>();
  update = output<unknown>();
  delete = output<number>();

  isActive: boolean = false;
  isAddMode: boolean = true;
  isSaveModeActive: boolean = false;
  isMobile: boolean = window.innerWidth < 769;

  form = new FormGroup({
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  folder = computed(
    () => 'organization-partner/' + this.form?.value['image'] + '/bg-image',
  );

  actionList = [
    {
      title: 'delete_partner',
      icon: DeleteIconComponent,
      event: () => this.onDelete(),
    },
  ];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly dialog: MatDialog,
    private readonly uploaderService: UploaderService,
  ) {
    this.uploaderService.uploaderConfig = {
      id: 'uploader--organization-partner-avatar',
      target: 'uploader--organization-partner-avatar',
      inline: false,
    };
  }

  ngAfterViewInit() {
    this.subscribeToChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['formItem']?.currentValue) {
      if (this.formItem()) {
        this.form.patchValue({
          image: this.formItem().image,
          name: this.formItem().name,
          description: this.formItem().description,
        });

        this.isSaveModeActive = false;
        this.isAddMode = false;
      } else {
        this.form = new FormGroup({
          image: new FormControl('', [Validators.required]),
          name: new FormControl('', [Validators.required]),
          description: new FormControl('', [Validators.required]),
        });
      }
    }
  }

  private subscribeToChanges(): void {
    this.form.valueChanges.subscribe(() => {
      if (
        this.form.value.name &&
        this.form.value.description &&
        this.form.value.image
      ) {
        this.isActive = true;
        this.isSaveModeActive = true;
      }
    });
  }

  saveImg(ev: IFormModel): void {
    this.form.controls[ev.inpName as string].setValue(ev.value);
  }

  onSave() {
    const newPartner = {
      name: this.form.value.name,
      description: this.form.value.description,
      image: this.form.value.image,
      organization_id: this.orgId(),
    };

    this.save.emit(newPartner);

    this.isActive = false;
    this.form.reset();
    this.cdr.detectChanges();
  }

  onUpdate() {
    const updatedPartner = {
      name: this.form.value.name,
      description: this.form.value.description,
      image: this.form.value.image,
    };

    this.update.emit({ updatedPartner, organization_id: this.formItem().id });

    this.isActive = false;
    this.isSaveModeActive = false;
  }

  onDelete() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      maxWidth: this.isMobile ? '320px' : '450px',
      width: '100%',
      data: {
        title: 'partner_deletion_confilmation.title',
        subtitle: 'partner_deletion_confilmation.subtitle',
        question: 'partner_deletion_confilmation.question',
        cancel_btn: 'partner_deletion_confilmation.cancel_btn',
        confirm_btn: 'partner_deletion_confilmation.confirm_btn',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        catchError(() => {
          //incomplete
          return of({});
        }),
      )
      .subscribe(() => {
        this.delete.emit(this.formItem()?.id);
      });
  }
}
