import { Arttag } from './arttag.model';

export class Arttagfield {
  constructor(
    public name: string,
    public id?: number,
    public arttags?: Arttag[],
  ) {}
}
