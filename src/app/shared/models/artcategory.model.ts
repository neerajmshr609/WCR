export class Artcategory {
  name?: string;
  id?: number;
  parent_id?: number;
  subcategories?: Artcategory[];
  is_active?: boolean;
  hasParent?: boolean;
  bound_to_skill?: boolean;
  order?: number;
}
