import {
  Component,
  computed,
  input,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationsService } from '../organizations.service';
import { BaseComponent } from '../../../shared/components/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ResizeService } from '../../../services/resize.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs/operators';
import { OrganizationProfile } from '../components/model/organization-profile.model';
import { ArtcategoriesService } from '../../../services/artcategory/artcategories.service';
import { IceBreakerService } from '../../../ice-breaker/service/ice-breaker.service';
import { Skill } from '../../../services/skill/model/skill.model';
import { isArrayAndHasItems } from '../../../shared/lib/array-helpers.lib';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss'],
})
export class OrganizationProfileComponent
  extends BaseComponent
  implements OnInit
{
  readonly organizationName = input<string>();
  organizationData = model<OrganizationProfile>();

  readonly isNotMobile = toSignal(this._resizeService.isNotSmall$);
  public counsellorCardHeight = signal<number>(350);
  public isLoading = signal<boolean>(true);
  readonly selectedSkills = signal<Skill[]>([]);

  private readonly _loadedIceBreakers = toSignal(
    this._iceBreakerService.iceBreakers$,
  );

  readonly iceBreakers = computed(() => {
    const selectedSkills = this.selectedSkills();
    const skillsAreSelected = isArrayAndHasItems(selectedSkills);
    let iceBreakers = skillsAreSelected ? this._loadedIceBreakers() : [];
    if (skillsAreSelected) {
      iceBreakers = iceBreakers.filter((_) => _.belongsTo(selectedSkills));
    }
    return iceBreakers;
  });

  readonly skillsAreSelected = computed(() => !!this.selectedSkills().length);

  contactForm = this.fb.group({
    name: ['', Validators.required],
    surname: [''],
    email: ['', [Validators.email, Validators.required]],
    message: ['', Validators.required],
  });

  private readonly _deviceScreenSize = toSignal(
    this._resizeService.sizeOfDevice$,
  );
  readonly counsellorsCellsToSHow = computed(() => {
    const { isMedium, isSmall } = this._deviceScreenSize();
    return isSmall ? 1 : isMedium ? 2 : 3;
  });
  readonly artCategories = toSignal(this._artCategoriesService.artCategories$);

  constructor(
    private router: Router,
    private organizationService: OrganizationsService,
    private fb: FormBuilder,
    private readonly _resizeService: ResizeService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private readonly _artCategoriesService: ArtcategoriesService,
    private readonly _iceBreakerService: IceBreakerService,
  ) {
    super();
  }

  ngOnInit(): void {
    this._artCategoriesService.fetchArtcategories({ bound_to_skill: true });
    if (this.organizationName()) {
      this.isLoading.set(true);
      this.organizationService
        .getOrganizationByName(this.organizationName())
        .subscribe({
          next: (data) => this.organizationData.set(data),
          error: (err) => {
            if (err.status === 404) {
              this.router.navigate(['page-not-found']);
            }
            console.error('Error loading organization:', err);
          },
          complete: () => this.isLoading.set(false),
        });

      this.getCounsellorsCardHeight();
      this._iceBreakerService.fetchAllIceBreakers();
    }
  }

  private getCounsellorsCardHeight() {
    const cards = document.querySelectorAll('.member-card');
    if (cards && cards.length > 0) {
      let maxHeight = 0;

      cards.forEach((card) => {
        const height = (card as HTMLElement).offsetHeight;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });
      this.counsellorCardHeight.set(maxHeight);
    }
  }

  sendMessage() {
    if (this.contactForm.valid) {
      const message = this.contactForm.value;

      this.organizationService
        .sendMessage(this.organizationData().organization.id, message)
        .pipe(
          switchMap(() => this.translate.get('message.sent')),
          tap((translatedMessage) => {
            this.contactForm.reset();
            this.snackBar.open(translatedMessage, null, { duration: 1000 });
          }),
        )
        .subscribe({
          error: (err) => console.error('Error sending message:', err),
        });
    }
  }

  public navigateToOrgSite(path: string): void {
    window.open(path, '_blank');
  }
}
