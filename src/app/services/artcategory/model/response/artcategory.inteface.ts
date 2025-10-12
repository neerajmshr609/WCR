export interface IArtCategory {
  id: number;
  name: string;
  order: number;
  bound_to_skill?: boolean;
  is_active?: boolean;
  artcategory_id?: number;
}