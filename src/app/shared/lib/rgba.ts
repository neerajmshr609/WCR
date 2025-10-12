import { valuesBetween } from './number.helpers';

export class Rgba {
  static findBetween(rgba1: Rgba, rgba2: Rgba, coefficient: number = 0.5) {
    const r = Math.round(valuesBetween(rgba1.r, rgba2.r, coefficient));
    const g = Math.round(valuesBetween(rgba1.g, rgba2.g, coefficient));
    const b = Math.round(valuesBetween(rgba1.b, rgba2.b, coefficient));
    const a = Math.round(valuesBetween(rgba1.a, rgba2.a, coefficient));
    return new Rgba(r, g, b, a);
  }

  constructor(
    readonly r: number,
    readonly g: number,
    readonly b: number,
    readonly a: number = 1,
  ) {}

  toCss() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
