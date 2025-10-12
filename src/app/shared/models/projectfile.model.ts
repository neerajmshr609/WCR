import { Avfeedbacklane } from './avfeedbacklane.model';
import { avFileStateEnum, avYTStateEnum } from '../enums';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AVRatingParam } from './avratingparam.model';

export interface Conversion {
  state: string;
  message: string;
}

interface VideoQuality {
  full_hd?: string;
  hd?: string;
  sq?: string;
}

export class Projectfile {
  constructor(
    public name?: string,
    public handle?: string,
    public mimetype?: string,
    public url?: string,

    public height?: number,
    public width?: number,
    public duration?: number,

    public order?: number,
    public old_order?: number,

    public project_id?: number,
    public id?: string,

    public loadState?: avFileStateEnum | avYTStateEnum,

    public preview?: string,
    public thumb?: string,
    public thumbnail?: string,
    public thumbnail_time?: number,

    public kind?: string,
    public feedformat?: string,
    public likecount?: number,

    public deleting?: boolean,
    public total_score?: number,

    public avfeedbacklanes?: Avfeedbacklane[],

    public projectfile_title?: string,
    public filedescription?: string,
    public lyrics?: string,
    public showinfo?: boolean,
    public quality?: VideoQuality,

    public sanitizedUrl?: SafeResourceUrl,
    public playlist?: string,

    public avratingparams?: AVRatingParam[],
    public conversion?: Conversion,
  ) {}
}
