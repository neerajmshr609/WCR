export class Artfield {
  constructor(
    public name: string,
    public tag: string,
    public id?: number,
    public parentcategories?: number[],
  ) {}
}
