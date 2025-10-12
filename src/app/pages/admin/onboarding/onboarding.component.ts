import { Component, OnInit } from '@angular/core';
import { Story } from 'src/app/shared/models/story.model';
import { OnboardingService } from './onboarding.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  stories: Story[];
  currentFlow: string;

  constructor(private onboardingService: OnboardingService) {}

  ngOnInit() {
    this.selectFlow('rateflow');
  }

  selectFlow(flow: string) {
    this.currentFlow = flow;
    this.onboardingService
      .fetchStoriesForFlow(this.currentFlow)
      .subscribe((results) => {
        this.stories = results;
      });
  }

  onStoryDelete(storyID: number) {
    this.onboardingService.deleteStory(storyID).subscribe((res) => {
      this.stories = this.stories.filter((obj) => {
        return obj.id !== storyID;
      });
    });
  }

  addStory(name: string) {
    this.onboardingService
      .createStory(name, this.currentFlow)
      .subscribe((result) => {
        this.selectFlow(this.currentFlow);
      });
  }
}
