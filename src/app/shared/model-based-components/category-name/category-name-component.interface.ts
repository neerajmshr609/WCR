import { Artcategory } from '../../models/artcategory.model';

export interface ICategoryNameComponent extends Partial<Artcategory> {
  name: string;
}
