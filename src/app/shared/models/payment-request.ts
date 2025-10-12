import { PriceConditionsResult } from 'src/app/ice-breaker/modules/ice-breaker-template/ice-breaker-template-messages';

export class BasePaymentRequest {
  constructor(
    public advisor_income?: number,
    public greyt_fee?: number,
    public stripe_fee?: number,
    public value_added_tax?: number,
    public total?: number,
  ) {}
}

export class PaymentRequestBySeconds extends BasePaymentRequest {
  constructor(
    public billable_seconds?: number,
    public due_seconds?: number,
  ) {
    super();
  }
}

export interface IceBreakerPaymentRequest
  extends BasePaymentRequest,
    PriceConditionsResult {}

export class PaymentRequestTips extends BasePaymentRequest {
  constructor(
    public percent?: number,
    public paid?: boolean,
  ) {
    super();
  }
}
