import { IArtCategory } from './response/artcategory.inteface';

export class ArtCategory {
  id: number;
  name: string;
  order?: number;
  bound_to_skill?: boolean;
  is_active?: boolean;
  artcategory_id?: number;
  subCategories: ArtCategory[];
  parentCategory: ArtCategory | null;

  get hasParent() {
    return !!this.parentCategory;
  }

  get parent_id() {
    return this.hasParent ? this.parentCategory.id : null;
  }
}

export function artCategoryFactory(src: IArtCategory | ArtCategory, parentCategory?: ArtCategory) {
  const artCategory = new ArtCategory();
  artCategory.id = src.id;
  artCategory.name = src.name;
  if (typeof src?.order === 'number') {
    artCategory.order = src.order;
  }
  if (typeof src?.bound_to_skill === 'boolean') {
    artCategory.bound_to_skill = src.bound_to_skill;
  }
  if (typeof src?.is_active === 'boolean') {
    artCategory.is_active = src.is_active;
  }
  // @ts-ignore
  artCategory.subCategories = (Array.isArray(src?.subCategories) && src?.subCategories.length > 0)
    // @ts-ignore
    ? src.subCategories.map(_ => artCategoryFactory(_, artCategory))
    : [];
  if (parentCategory) {
    artCategory.parentCategory = parentCategory;
  }
  return artCategory;
}