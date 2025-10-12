import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserWeblink } from 'src/app/shared/models/user-weblink.model';
import { Weblink } from 'src/app/shared/models/weblink.model';
import { USER_URL, WEBLINKS_URL } from 'src/config/config';
import { WeblinksServicesModule } from './weblinks-services.module';

@Injectable({
  providedIn: WeblinksServicesModule,
})
export class WeblinksService {
  constructor(private http: HttpClient) {}

  fetchWebLinks() {
    return this.http.get<Weblink[]>(WEBLINKS_URL);
  }

  saveWebLinks(user_weblinks: UserWeblink[], id: number) {
    return this.http.put(USER_URL(id), { user_weblinks });
  }
}
