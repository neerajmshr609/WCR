import { Artcategory } from '../../../../shared/models/artcategory.model';

class Category implements Partial<Artcategory> {
  id: number;
  name: string;
}

export const categoryFactory = (from: Partial<Category>) => {
  const newCategory = new Category();
  Object.assign(newCategory, from);
  return newCategory;
};
