import { Card } from './card.model';
import { HowCardCategories, WhyCardTypeEnum } from '../enums';

export class WhyCardScrollItem {
  constructor(
    public title?: string,
    public title_mobile?: string,
    public subtitle?: string,
    public subtitle_mobile?: string,
    public iconURL?: string,
    public colorClassName?: string,
  ) {}
}

export class OnboardCard {
  constructor(
    public backgroundColor?: string,
    public headerBackgroundColor?: string,
    public inactiveBackgroundColor?: string,
    public title?: string,
    public subtitle?: string,
    public type?: WhyCardTypeEnum,
    public scrollItems?: WhyCardScrollItem[],
    public text?: string,
    public cardNumber?: string,
    public imageURL?: string,
    public videoURL?: string,
    public invertedColor?: boolean,
    public className?: string,
    public header?: string,
  ) {}
}

export class WhyCard extends OnboardCard {}

export class HowCard extends OnboardCard {
  constructor(public category?: HowCardCategories) {
    super();
  }
}
export class VideoCard extends OnboardCard {}
