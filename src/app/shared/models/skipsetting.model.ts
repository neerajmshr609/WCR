import { Category } from './category.model';

export class Skipsetting {
  constructor(
    public mode?: string,
    public categoryID?: number,
    public parentCategoryID?: number,
  ) {}
}
