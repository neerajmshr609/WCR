import { Pipe, PipeTransform } from '@angular/core';
import { HowCardCategories, WhyCardTypeEnum } from '../enums';
import { HowCard } from '../models/whycardviewmodel.model';

@Pipe({
  name: 'cardFilter',
})
export class CardFilterPipe implements PipeTransform {
  transform(
    value: Array<HowCard>,
    category: HowCardCategories = null,
    subCategory?: string,
  ): Array<HowCard> {
    if (!category) {
      return value;
    }
    const filteredByCategory = value.filter(
      (card) =>
        card.category === category ||
        card.type === WhyCardTypeEnum.how_intro_card,
    );

    if (!subCategory) {
      return filteredByCategory;
    }
    return filteredByCategory.filter((card) => {
      return (
        card.type === subCategory ||
        card.type === WhyCardTypeEnum.how_intro_card ||
        card.type === WhyCardTypeEnum.types_of_advice_card
      );
    });
  }
}
