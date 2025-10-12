import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  input,
  OnChanges,
  output,
  SimpleChanges,
  signal,
} from '@angular/core';
import {
  IFormModel,
  IFormOrgRowDataModel,
  IOrganization,
  IOrgPartner,
} from '../../interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FORMS } from '../../constants/forms';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { OrganizationService } from 'src/app/services/organization.service';
import { debounceTime } from 'rxjs';
import { UploaderService } from 'src/app/shared/components/uploader/uploader';

@Component({
  selector: 'app-landing-form',
  templateUrl: './landing-form.component.html',
  styleUrls: ['./landing-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingFormComponent extends BaseComponent implements OnChanges {
  orgatizationData = input<IOrganization>();
  saveOrgChanges = output<{ [key: string]: string }>();

  form: FormGroup = new FormGroup({});
  partnersForm = signal<IOrgPartner[]>([]);
  formData = FORMS['landing'];
  folder = computed(
    () => 'organization-landing/' + this.orgatizationData()?.id + '/bg-image',
  );

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly organizationService: OrganizationService,
    private readonly uploaderService: UploaderService,
  ) {
    super();

    this.uploaderService.uploaderConfig = {
      id: 'uploader--organization-landing-avatar',
      target: 'uploader--organization-landing-avatar',
      inline: false,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orgatizationData'].currentValue) {
      this.initializeForm();
      this.getPartners();
    }
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      claim: new FormControl(this.orgatizationData().claim, [
        Validators.required,
        Validators.minLength(3),
      ]),
      about_short: new FormControl(this.orgatizationData().about_short, [
        Validators.required,
        Validators.minLength(10),
      ]),
      blog_url: new FormControl(this.orgatizationData().blog_url),
      website_url: new FormControl(this.orgatizationData().website_url),
      background_image_top: new FormControl(
        this.orgatizationData().background_image_top,
        [Validators.required],
      ),
      background_image_bottom: new FormControl(
        this.orgatizationData().background_image_bottom,
        [Validators.required],
      ),
      show_contact_form: new FormControl(
        this.orgatizationData().show_contact_form,
      ),
    });

    this.subscribeToForm();
  }

  private subscribeToForm(): void {
    Object.keys(this.form.controls)?.forEach((controlName) => {
      const control = this.form.get(controlName);

      if (control) {
        control.valueChanges.pipe(debounceTime(2000)).subscribe(async (res) => {
          if (!control.invalid) {
            this.saveOrgChanges.emit({ [controlName]: res });
          }
        });
      }
    });

    this.changeDetectorRef.detectChanges();
  }

  save(ev: IFormModel): void {
    this.form.controls[ev.inpName].setValue(ev.value);
  }

  private getPartners(): void {
    this.organizationService
      .getOrgPartners(this.orgatizationData()?.id)
      .subscribe((res: IOrgPartner[]) => {
        this.partnersForm.set(res);
      });
  }

  savePartner(newPartner: IFormOrgRowDataModel): void {
    this.organizationService.createOrgPartners(newPartner).subscribe(() => {
      this.getPartners();
    });
  }

  deletePartner(id: number): void {
    this.organizationService.deleteOrgPartners(id).subscribe(() => {
      this.getPartners();
    });
  }

  updatePartner(data): void {
    this.organizationService
      .updateOrgPartners(data.updatedPartner, data.organization_id)
      .subscribe(() => {
        this.getPartners();
      });
  }
}
