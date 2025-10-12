export class ConnectedStripeAccount {
  constructor(
    public id?: number,
    public story_id?: number,
    public imageurl?: string,
    public text?: string,
    public title?: string,
    public active?: boolean,
  ) {}
}
