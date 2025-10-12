export class Messagepayment {
  constructor(
    public secondsSpent?: number,
    public earned?: number,
    public paymentrequestdenied?: boolean,
    public paymentrequestapproved?: boolean,
    public id?: number,
  ) {}
}
