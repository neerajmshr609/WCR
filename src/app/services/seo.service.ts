import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MetaService } from '@ngx-meta/core';

export class SeoData {
  readonly title: string;
  readonly description: string;
  readonly keywords?: string;
  readonly image?: string;
  readonly url?: string;

  constructor({
    title,
    description,
    keywords,
    image,
  }: {
    title: string;
    description: string;
    keywords: string;
    image?: string;
  }) {
    this.title = title;
    this.description = description;
    this.keywords = keywords;
    this.image =
      image ||
      'https://efwfileupload.s3-accelerate.amazonaws.com/favi/fbimage.png';
  }
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private canonicalUrl: string;

  constructor(
    private router: Router,
    private metaService: MetaService,
  ) {}

  private createLink(route: string): string {
    return 'https://getme.global' + route;
  }

  private setMetaTags(data: SeoData) {
    this.metaService.setTitle(data.title);
    this.metaService.setTag('description', data.description);
    // this.metaService.setTag('keywords', data.keywords);
    this.metaService.setTag('og:url', data.url || this.canonicalUrl);
    this.metaService.setTag(
      'og:image',
      data.image || this.createLink('assets/img/logo-bg.jpg'),
    );
    this.metaService.setTag(
      'og:image:url',
      data.image || this.createLink('assets/img/logo-bg.jpg'),
    );
    this.metaService.setTag('og:image:width', '500');
    this.metaService.setTag('og:image:height', '500');
    this.metaService.setTag('og:type', 'website');

    this.metaService.setTag('twitter:title', data.title);
    this.metaService.setTag('twitter:description', data.description);
    this.metaService.setTag('twitter:url', data.url);
    this.metaService.setTag('twitter:image', data.image);
  }

  setSettings(data: SeoData) {
    this.canonicalUrl = this.createLink(this.router.url);
    this.setMetaTags(data);
  }
}
