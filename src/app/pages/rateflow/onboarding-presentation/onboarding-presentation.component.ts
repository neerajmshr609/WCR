import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import Flickity from 'flickity/dist/flickity.pkgd.js';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Story } from 'src/app/shared/models/story.model';
import { OnboardingService } from '../../admin/onboarding/onboarding.service';

@Component({
  selector: 'app-onboarding-presentation',
  templateUrl: './onboarding-presentation.component.html',
  styleUrls: ['./onboarding-presentation.component.scss'],
})
export class OnboardingPresentationComponent implements OnInit, AfterViewInit {
  @ViewChild('presentationRef') presentationRef: ElementRef;
  @Input() flow: string;

  mainSlider: Flickity;
  currentStory: Story;
  isLastCard = false;

  constructor(
    private authService: AuthService,
    private onboardingService: OnboardingService,
  ) {}

  ngOnInit() {
    if (!this.authService.userIsSignedIn()) {
      return;
    }

    this.onboardingService
      .fetchStoriesForFlowAndUser(this.flow)
      .pipe(
        filter(
          (res) => !!res.length && !!res.filter((st) => !st.finished).length,
        ),
      )
      .subscribe((res) => {
        const onSliderChange = function (index) {
          const pres = this.presentationRef.nativeElement;
          const dots = pres.querySelector('.flickity-page-dots');
          if (index + 1 === this.currentStory.cards.length) {
            this.isLastCard = true;
            dots.style.display = 'none';
          } else {
            this.isLastCard = false;
            dots.style.display = 'block';
          }
        }.bind(this);

        this.currentStory = res.find((st) => !st.finished);
        setTimeout(() => {
          this.mainSlider = new Flickity(this.presentationRef.nativeElement, {
            imagesLoaded: true,
            adaptiveHeight: true,
            setGallerySize: true,
            lazyLoad: 3,
            pageDots: true,
            draggable: true,
            on: { change: onSliderChange },
          });
        });
      });
  }

  ngAfterViewInit(): void {}

  didFinish() {
    this.currentStory = null;

    if (this.isLastCard) {
      this.didGotIt();
    }
  }

  didGotIt() {
    const networkCalls = [];

    for (const card of this.currentStory.cards) {
      networkCalls.push(this.onboardingService.createUsercard(card.id));
    }

    forkJoin(networkCalls).subscribe(() => {
      this.currentStory = null;
    });
  }
}
