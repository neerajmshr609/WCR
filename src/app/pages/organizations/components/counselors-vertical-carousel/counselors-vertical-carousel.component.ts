import { Component, computed, input, signal } from '@angular/core';
import { isArrayAndHasItems } from '../../../../shared/lib/array-helpers.lib';
import { OrganizationMember } from '../model/organization-member.model';

@Component({
  selector: 'app-counselors-vertical-carousel',
  templateUrl: './counselors-vertical-carousel.component.html',
  styleUrls: ['./counselors-vertical-carousel.component.scss'],
})
export class CounselorsVerticalCarouselComponent {
  public counselors = input<OrganizationMember[]>([]);
  public shownCardsNumber = input<number>(3);
  public cardHeight = input<number>(350);
  public gap = input<number>(24);
  public scrolledSlides = signal<number>(0);

  readonly allowSlidesNav = computed(() => isArrayAndHasItems(this.counselors()));

  scrollToNextSlide() {
    this.scrolledSlides.set(this.scrolledSlides() + 1);
  }

  scrollToPreviousSlide() {
    this.scrolledSlides.set(this.scrolledSlides() - 1);
  }
}
