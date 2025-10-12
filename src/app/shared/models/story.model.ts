import { Card } from './card.model';

export class Story {
  constructor(
    public id?: number,
    public flow?: string,
    public name?: string,
    public active?: boolean,
    public cards?: Card[],
    public finished?: boolean,
  ) {}
}
