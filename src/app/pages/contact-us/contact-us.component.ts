import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OnboardingService } from '../admin/onboarding/onboarding.service';
import vivus from 'vivus';
import { BaseComponent } from '../../shared/components/base.component';
import { takeUntil } from 'rxjs/operators';
import { UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent extends BaseComponent implements OnInit {
  error: string;
  didSubmitSupport = false;
  didSubmitIdeas = false;

  willSubmitSupport = false;
  willSubmitIdeas = false;

  contactUsFormGroup = this.fb.group({
    text: ['', [Validators.required, Validators.pattern('.*[^ ].*')]],
    email: ['', [Validators.required, Validators.email]],
  });

  feedbackFormGroup = this.fb.group({
    text: ['', [Validators.required, Validators.pattern('.*[^ ].*')]],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private cdRef: ChangeDetectorRef,
    private onboardingService: OnboardingService,
    private readonly fb: UntypedFormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {}

  onSubmitIdeas() {
    const { email, text } = this.feedbackFormGroup.value;
    this.willSubmitIdeas = true;
    this.onboardingService
      .submitIdeasRequest(email, text)
      .pipe(takeUntil(this.destroyed))
      .subscribe(
        (res) => {
          this.willSubmitIdeas = false;
          this.didSubmitIdeas = true;
          this.cdRef.detectChanges();
          this.showIdeasAnimation();
        },
        (error) => {
          this.error = error;
        },
      );
  }

  onSubmitSupport() {
    const { email, text } = this.contactUsFormGroup.value;
    this.willSubmitSupport = true;
    this.onboardingService
      .submitSupportRequest(email, text)
      .pipe(takeUntil(this.destroyed))
      .subscribe(
        (res) => {
          this.willSubmitSupport = false;
          this.didSubmitSupport = true;
          this.cdRef.detectChanges();
          this.showSupportAnimation();
        },
        (error) => {
          this.error = error;
        },
      );
  }

  showSupportAnimation() {
    setTimeout(() => {
      const vi = new vivus(
        'heart',
        {
          type: 'delayed',
          forceRender: false,
          onReady: function (myVivus) {
            // `el` property is the SVG element
            myVivus.el.style.visibility = 'visible';
          },
          pathTimingFunction: vivus.EASE_OUT,
        },
        null,
      );
    }, 10);
  }

  showIdeasAnimation() {
    setTimeout(() => {
      const vi = new vivus(
        'heart-ideas',
        {
          type: 'delayed',
          forceRender: false,
          onReady: function (myVivus) {
            // `el` property is the SVG element
            myVivus.el.style.visibility = 'visible';
          },
          pathTimingFunction: vivus.EASE_OUT,
        },
        null,
      );
    }, 10);
  }
}
