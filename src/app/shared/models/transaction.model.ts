export class Transaction {
  constructor(
    public display_name?: string,
    public value?: number,
    public transactiontype?: string,
    public created_at?: string,
    public display_value?: string,
  ) {}
}

export type PaymentMethods = {
  object: string;
  data: any[];
  has_more: boolean;
  url: string;
};
