export class Category {
  constructor(
    public name: string,
    public tag: string,
    public id?: number,
    public parentcategory_id?: number,
    public artfield_id?: number,
    public categories?: number[],
  ) {}
}
