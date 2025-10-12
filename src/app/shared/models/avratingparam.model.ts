export class AVRatingParam {
  constructor(
    public name?: string,
    public id?: number,
    public project_id?: number,
    public color?: string,
    // @ts-ignore
    public local_svgFillDown?: SVG.Rect,
    // @ts-ignore
    public local_svgFillUp?: SVG.Rect,
    public _destroy?: number,
    public active?: boolean,
    public focused?: boolean,
    public projectfile_id?: number,
  ) {}
}
