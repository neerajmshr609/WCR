import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/config/config';
import { Story } from 'src/app/shared/models/story.model';
import { User } from 'src/app/shared/models/user.model';
import { Card } from 'src/app/shared/models/card.model';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  constructor(private http: HttpClient) {}

  fetchStory(id: number) {
    const url = API_URL + 'stories/' + id;
    return this.http.get<Story>(url);
  }

  submitIdeasRequest(email: string, text: string) {
    const url = API_URL + 'submit_ideas';

    return this.http.post(url, {
      email,
      text,
    });
  }

  submitSupportRequest(email: string, text: string) {
    const url = API_URL + 'submit_support';

    return this.http.post(url, {
      email,
      text,
    });
  }

  fetchStoriesForFlowAndUser(flow: string) {
    const url = API_URL + 'stories?forUser=true&flow=' + flow;

    return this.http.get<Story[]>(url);
  }

  fetchStoriesForFlow(flow: string) {
    const url = API_URL + 'stories?flow=' + flow;

    return this.http.get<Story[]>(url);
  }

  createUsercard(cardID: number) {
    const url = API_URL + 'addusercard/';
    return this.http.post<User>(url, {
      card_id: cardID,
    });
  }

  // STORIES

  createStory(name: string, flow: string) {
    const url = API_URL + 'stories/';
    return this.http.post<Story>(url, {
      story: { name, flow },
    });
  }

  updateStory(story: Story) {
    const url = API_URL + 'stories/' + story.id;
    return this.http.put<Story>(url, {
      story: {
        name: story.name,
        flow: story.flow,
        active: story.active,
      },
    });
  }

  deleteStory(id: number) {
    const url = API_URL + 'stories/' + id;
    return this.http.delete(url);
  }

  // CARDS

  createCard(card: Card) {
    const url = API_URL + 'cards/';
    return this.http.post<Card>(url, {
      card: {
        title: card.title,
        text: card.text,
        imageurl: card.imageurl,
        story_id: card.story_id,
      },
    });
  }

  updateCard(card: Card) {
    const url = API_URL + 'cards/' + card.id;
    return this.http.put<Card>(url, {
      card: {
        title: card.title,
        text: card.text,
        imageurl: card.imageurl,
        story_id: card.story_id,
      },
    });
  }

  deleteCard(id: number) {
    const url = API_URL + 'cards/' + id;
    return this.http.delete(url);
  }
}
