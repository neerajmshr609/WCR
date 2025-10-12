export class Relation {
  constructor(
    public fromcategory_id?: number,
    public tocategory_id?: number,
    public fromparentcategory_id?: number,
    public toparentcategory_id?: number,
    public tocategory_name?: string,
    public fromcategory_name?: string,
    public weight?: number,
    public artfield_id?: number,
    discouraging?: number,
    unhelpful?: number,
    helpful?: number,
    inspiring?: number,
    public id?: number,
  ) {}
}
