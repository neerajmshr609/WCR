export class Balance {
  constructor(
    public available_amount?: number,
    public pending_amount?: number,
    public currency?: string,
  ) {}
}
