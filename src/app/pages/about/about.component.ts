import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AboutCard } from 'src/app/shared/models/about-cards.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  companyPurposeCards: Array<AboutCard> = [
    {
      title: 'start_conversation.title',
      img: 'assets/ice-breaker/ice-breaker-logo.svg',
      imgMarginTop: '10px',
      imgMarginBottom: '50px',
      textOptions: [
        'start_conversation.ice_breaker_question',
        'start_conversation.community_wants',
        'start_conversation.easily_enter',
        'start_conversation.never_give_away',
      ],
      color: '#9CB4AB',
    },
    {
      title: 'focus_on.title',
      img: '/assets/about-cards/about-1.svg',
      imgMarginTop: '10px',
      imgMarginBottom: '50px',
      textOptions: [
        'focus_on.helping_others',
        'focus_on.charge',
        'focus_on.pay',
      ],
      color: '#9CB4AB',
    },
    // {
    //   title: 'LESS IS MORE <br> FOR <br> EVERYONE',
    //   img: '/assets/about-cards/about-2.svg',
    //   imgMarginTop: '45px',
    //   imgMarginBottom: '30px',
    //   textOptions: [
    //     'Ask instant quick <br> questions',
    //     'Filter to easily find the <br> right people for you',
    //     'Use our Calendly like <br> scheduling',
    //     'Only pay for your <br> time spent'
    //   ],
    //   color: '#9CB4AB',
    // },
    {
      title: 'never_pay_more.title',
      img: '/assets/about-cards/about-3.svg',
      imgMarginTop: '45px',
      imgMarginBottom: '30px',
      textOptions: [
        'never_pay_more.simple_time_tracker',
        'never_pay_more.integrated_chat',
        'never_pay_more.one_click_pay',
      ],
      color: '#9CB4AB',
    },
    {
      title: 'self_mastery.title',
      img: '/assets/about-cards/about-4.svg',
      imgMarginTop: '30px',
      imgMarginBottom: '25px',
      textOptions: [
        'self_mastery.become_expert',
        'self_mastery.learn_effectively',
        'self_mastery.get_paid_immediately',
        'self_mastery.blind_spots',
      ],
      color: '#9CB4AB',
    },
    {
      title: 'being_helpful.title',
      img: '/assets/about-cards/about-5.svg',
      imgMarginTop: '0px',
      imgMarginBottom: '10px',
      textOptions: [
        'being_helpful.one_solution',
        'being_helpful.chat_room',
        'being_helpful.integrated_video',
        'being_helpful.crm',
        'being_helpful.feedback',
      ],
      color: '#9CB4AB',
    },
    {
      title: 'creative_soulmate.title',
      img: '/assets/about-cards/about-6.svg',
      imgMarginTop: '20px',
      imgMarginBottom: '54px',
      textOptions: [
        'creative_soulmate.perfect_ice_breaker',
        'creative_soulmate.impress_people',
        'creative_soulmate.connect_with_people',
        'creative_soulmate.discover_those',
      ],
      color: '#9CB4AB',
    },
  ];

  constructor(public authService: AuthService) {}
}
