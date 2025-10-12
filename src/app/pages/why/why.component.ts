import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import {
  HowCardCategories,
  WhyCardType,
  WhyCardTypeEnum,
} from 'src/app/shared/enums';
import {
  HowCard,
  OnboardCard,
  VideoCard,
  WhyCard,
  WhyCardScrollItem,
} from 'src/app/shared/models/whycardviewmodel.model';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IMenuItem } from '../../main-content-menu/model/menu-item';
import { GET_HELP_PATH } from '../get-help/get-help-routing.module';
import { ResizeService } from '../../services/resize.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-why',
  templateUrl: './why.component.html',
  styleUrls: ['./why.component.scss'],
})
export class WhyComponent extends BaseComponent implements OnInit {
  cards: OnboardCard[] = [];
  cardManifest: OnboardCard;
  nowPlaying$ = new BehaviorSubject(null);
  cardTypes = WhyCardType;
  selectedCategory: string;

  menuItems: IMenuItem[] = [
    {
      title: 'menu.home',
      param: 'home',
      icon: 'assets/why/icons/home.svg',
    },
    {
      title: 'menu.how-it-works',
      param: 'howtouse',
      icon: 'assets/why/icons/question-head.svg',
    },
    // {
    //   name: 'The Big Picture',
    //   disabled: false,
    //   count: 0,
    //   param: 'fullstory'
    // }
  ];

  menuItem = this.menuItems[0];
  selected: boolean;
  selectedSubCategory = WhyCardTypeEnum.step_card_long_terms;

  public isPRMode: boolean;
  readonly isMobile = toSignal(this._resizeService.isSmall$);
  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private seoService: SeoService,
    private readonly translateService: TranslateService,
    private readonly _resizeService: ResizeService,
  ) {
    super();
    this.breakpointObserver
      .observe(['(max-width: 590px)', '(max-width: 400px)'])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        if (this.cards[0]?.type === 'how_intro_card') {
          this.cards[0].backgroundColor = result.matches
            ? '#f7f7f7'
            : '#242526';
        }
      });
    this.translateService.store.onLangChange
      .pipe(takeUntil(this.destroyed))
      .subscribe((lang: LangChangeEvent) => {
        this.translateService.use(lang.lang);
      });
  }

  ngOnInit(): void {
    this.selected = true;
    this.isPRMode = this.router.url.includes('why-pr');
  }

  showArtistSteps() {
    const howCards = [
      {
        type: WhyCardTypeEnum.how_intro_card,
        title: 'how-it-works.how_intro_card.how_to_use',
        backgroundColor: 'black',
        className: WhyCardTypeEnum.whycard__menu,
      },
      // {
      //   type: WhyCardTypeEnum.types_of_advice_card,
      //   title: 'TYPES OF ADVICE',
      //   backgroundColor: '#f7f7f7',
      //   headerBackgroundColor: '#FFDFDF',
      //   inactiveBackgroundColor: '#FFF',
      //   className: WhyCardTypeEnum.whycard__submenu,
      //   category: HowCardCategories.artist,
      // },
      // {
      //   type: WhyCardTypeEnum.types_of_advice_card,
      //   title: 'TYPES OF ADVICE',
      //   backgroundColor: '#f7f7f7',
      //   headerBackgroundColor: '#FFF500',
      //   inactiveBackgroundColor: '#FFF',
      //   className: WhyCardTypeEnum.whycard__submenu,
      //   category: HowCardCategories.advisers,
      // },
      {
        text: 'Go to our “Advisors” <br> section and choose <br> the topic or tool on <br> which you have <br> questions or <br> problems.',
        type: WhyCardTypeEnum.step_card_quick_advice,
        cardNumber: '1',
        backgroundColor: '#F17E7E',
        imageURL: 'assets/why/artist/creativeSteps1.png',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: `Now look at advisors <br> that match your <br> desired skillset. Pin to <br> the top the advisors <br> you believe could <br> help you. For faster <br> response use the <br> “now online” <br> button.`,
        cardNumber: '2',
        backgroundColor: '#F17E7E',
        imageURL: 'assets/why/artist/creativeSteps2.png',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: `Write the selected <br> advisors a quick <br> description of your <br> problem. Using the chat <br> lets you paralel <br> identify whom will <br> most likely be <br> able to help.`,
        cardNumber: '3',
        backgroundColor: '#F17E7E',
        imageURL: 'assets/why/artist/creativeSteps3.png',
        category: HowCardCategories.artist,
      },
      {
        text: 'Once an connector <br> confirmed your request <br> add your payment data <br> and open our <br> integrated video <br> conference system.',
        type: WhyCardTypeEnum.step_card_quick_advice,
        cardNumber: '4',
        backgroundColor: '#F17E7E',
        imageURL: 'assets/why/artist/creativeSteps4.png',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: 'If you have software <br> issues during <br> production you <br> can use our <br> integrated <br> screensharing <br> feature.',
        cardNumber: '5',
        backgroundColor: '#F17E7E',
        imageURL: 'assets/why/artist/creativeSteps5.png',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: `Get competent advice <br> immediately in every <br> situation.
        <br> Stop wasting time <br> doing nerve-wracking <br> online searches or <br> annoying your friends. <br> Get answers on <br> questions.
        <br> <b>Do! Not search.</b>`,
        cardNumber: '6',
        backgroundColor: '#F17E7E',
        imageURL: 'assets/why/artist/creativeSteps6.png',
        category: HowCardCategories.artist,
      },
      {
        text: 'how-it-works.connections-select.card-1',
        type: WhyCardTypeEnum.step_card_long_terms,
        cardNumber: '1',
        backgroundColor: '#BFABAB',
        imageURL: 'assets/why/advisor/advisersStep1.svg',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connections-select.card-2',
        cardNumber: '2',
        backgroundColor: '#BFABAB',
        imageURL: 'assets/why/artist/ArtistStep2.svg',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connections-select.card-3',
        cardNumber: '3',
        backgroundColor: '#BFABAB',
        imageURL: 'assets/why/artist/ArtistStep3.svg',
        category: HowCardCategories.artist,
      },
      {
        text: 'how-it-works.connections-select.card-4',
        type: WhyCardTypeEnum.step_card_long_terms,
        cardNumber: '4',
        backgroundColor: '#BFABAB',
        imageURL: 'assets/why/artist/ArtistStep4.svg',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connections-select.card-5',
        cardNumber: '5',
        backgroundColor: '#BFABAB',
        imageURL: 'assets/why/artist/ArtistStep5.svg',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connections-select.card-6',
        cardNumber: '6',
        backgroundColor: '#BFABAB',
        imageURL: 'assets/why/advisor/advisorSteps11.svg',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connections-select.card-7',
        cardNumber: '7',
        backgroundColor: '#BFABAB',
        imageURL: 'assets/why/artist/ArtistStep7.svg',
        category: HowCardCategories.artist,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connections-select.card-8',
        cardNumber: '8',
        backgroundColor: '#BFABAB',
        imageURL: 'assets/why/artist/ArtistStep14.svg',
        category: HowCardCategories.artist,
      },
      {
        text:
          'Press “Create Ice <br> Breaker” and <br>' +
          'Sign UP by email, to <br> easily get <br> conversations <br>' +
          'started with your <br> community.',
        type: WhyCardTypeEnum.step_card_quick_advice,
        cardNumber: '1',
        backgroundColor: '#E3BE30',
        imageURL: 'assets/why/artist/ArtistStep14.svg',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: 'Now select skills and <br> tools your competent. <br> If desired define <br> your hourly rates <br> for each topic <br> individually.',
        cardNumber: '2',
        backgroundColor: '#E3BE30',
        imageURL: 'assets/why/advisor/AdvisersStep2.png',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: 'Schedule your times <br> when you\'re available <br> for answering <br> questions online.',
        cardNumber: '3',
        backgroundColor: '#E3BE30',
        imageURL: 'assets/why/advisor/AdvisersStep3.png',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: 'Once setup, your <br> profile is fully visible <br> in the “Advisors” area. <br> To maximize requests, <br> when availabe, set your <br> status to <b>online</b> to get <br> instantly notified <br> when a user <br> requests your help. ',
        cardNumber: '4',
        backgroundColor: '#E3BE30',
        imageURL: 'assets/why/advisor/AdvisersStep4.png',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: 'Creatives usually <br> send you a rough <br> explanation of their <br> problem so you\'re able <br> to see if you can <br> help them or not.',
        cardNumber: '5',
        backgroundColor: '#E3BE30',
        imageURL: 'assets/why/advisor/AdvisersStep5.png',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: 'Jump live into a video <br> call with this creative <br> to solve the issue <br> using our integrated <br> conferencing system. <br> Use screen sharing to <br> help the user <br> directly in their <br> software.',
        cardNumber: '6',
        backgroundColor: '#E3BE30',
        imageURL: 'assets/why/advisor/AdvisersStep6.png',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: 'If problems have many <br> possible causes, <br> let the creative show <br> the hardware or <br> the production site <br> directly. Because our <br> service works on every <br> browser and <br> device without any <br> pre-installation.',
        cardNumber: '7',
        backgroundColor: '#E3BE30',
        imageURL: 'assets/why/advisor/AdvisersStep7.png',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: 'The Creative now pays <br> you for your spent time <br> and evaluates your <br> consultation. Which is <br> a great indicator for <br> future contacts. So you <br> only focus on <br> solving problems <br> and we do the rest.',
        cardNumber: '8',
        backgroundColor: '#E3BE30',
        imageURL: 'assets/why/advisor/AdvisersStep8.png',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_quick_advice,
        text: 'To generate a <br> sufficient regular <br> income. Combine <br> this straightforward <br> question-and-answer <br> approach with advice <br> that focuses on <br> the project of a <br> creative.',
        cardNumber: '9',
        backgroundColor: '#E3BE30',
        imageURL: 'assets/why/advisor/AdvisersStep9.png',
        category: HowCardCategories.advisers,
      },
      {
        text: 'how-it-works.connectors-select.card-1',
        type: WhyCardTypeEnum.step_card_long_terms,
        cardNumber: '1',
        backgroundColor: '#C9C1A1',
        imageURL: 'assets/why/artist/ArtistStep14.svg',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connectors-select.card-2',
        cardNumber: '2',
        backgroundColor: '#C9C1A1',
        imageURL: 'assets/why/advisor/step2.svg',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connectors-select.card-3',
        cardNumber: '3',
        backgroundColor: '#C9C1A1',
        imageURL: 'assets/why/advisor/Card3ExportFrame.svg',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connectors-select.card-4',
        cardNumber: '4',
        backgroundColor: '#C9C1A1',
        imageURL: 'assets/why/advisor/advisorSteps4.svg',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connectors-select.card-5',
        cardNumber: '5',
        backgroundColor: '#C9C1A1',
        imageURL: 'assets/why/advisor/advisorSteps5.svg',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connectors-select.card-6',
        cardNumber: '6',
        backgroundColor: '#C9C1A1',
        imageURL: 'assets/why/advisor/advisorSteps6.svg',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connectors-select.card-7',
        cardNumber: '7',
        backgroundColor: '#C9C1A1',
        imageURL: 'assets/why/advisor/advisorSteps11.svg',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connectors-select.card-8',
        cardNumber: '8',
        backgroundColor: '#C9C1A1',
        imageURL: 'assets/why/advisor/advisorSteps10.svg',
        category: HowCardCategories.advisers,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'how-it-works.connectors-select.card-9',
        cardNumber: '9',
        backgroundColor: '#C9C1A1',
        imageURL: 'assets/why/advisor/advisorSteps12.svg',
        category: HowCardCategories.advisers,
      },
      {
        text: 'To create a company <br> account select while <br> signing up the option: <br> “Set up as a team <br> account”. ',
        type: WhyCardTypeEnum.step_card_long_terms,
        cardNumber: '1',
        backgroundColor: '#00c67e',
        imageURL: 'assets/why/companies/companiesSteps1@2x.png',
        category: HowCardCategories.companies,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'Go to settings, <br> complete your public <br> profile, set your desired <br> hourly rate and <br> connect your <br> bank account.',
        cardNumber: '2',
        backgroundColor: '#00c67e',
        imageURL: 'assets/why/companies/companiesSteps2@2x.png',
        category: HowCardCategories.companies,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'Link your Getme.Global <br> profile to a web <br> presence of your <br> choice.',
        cardNumber: '3',
        backgroundColor: '#00c67e',
        imageURL: 'assets/why/companies/companiesSteps3@2x.png',
        category: HowCardCategories.companies,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'Now creatives can ask <br> your company for paid <br> constructive feedback <br> instead of spamming <br> your mailbox with <br> job- or production <br> requests.',
        cardNumber: '4',
        backgroundColor: '#00c67e',
        imageURL: 'assets/why/companies/companiesSteps4@2x.png',
        category: HowCardCategories.companies,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'While you focus <br> writing helpful <br> reviews, we count the <br> time spent and <br> handle all payments. <br> Receive 70-85% of <br> your indivually <br> chosen hourly rate. <br> No extra fees. ',
        cardNumber: '5',
        backgroundColor: '#00c67e',
        imageURL: 'assets/why/companies/companiesSteps5@2x.png',
        category: HowCardCategories.companies,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'While helping everyone <br> to become better <br> creatives through <br> feedback. It also <br> serves as a great noise <br> filter. Engage only with <br> the creatives which <br> works you like or who <br> adapt your criticism <br> in a great way.',
        cardNumber: '6',
        backgroundColor: '#00c67e',
        imageURL: 'assets/why/companies/companiesSteps6@2x.png',
        category: HowCardCategories.companies,
      },
      {
        type: WhyCardTypeEnum.step_card_long_terms,
        text: 'Hiring exceptional <br> talents is the most <br> effective way to stay <br> in business. Getme.Global <br> makes this process <br> now valuable <br> for both sides.',
        cardNumber: '7',
        backgroundColor: '#00c67e',
        imageURL: 'assets/why/companies/companiesSteps7@2x.png',
        category: HowCardCategories.companies,
      },
    ];
    if (this.breakpointObserver.isMatched('(max-width: 590px)')) {
      howCards[0].backgroundColor = '#f7f7f7';
    }
    this.cards = howCards.map((item) => Object.assign(new HowCard(), item));
  }

  showTutorials() {
    const videoIntroCard = new WhyCard();
    videoIntroCard.type = WhyCardTypeEnum.video_intro_card;
    videoIntroCard.backgroundColor = '#000000';
    this.cards.push(videoIntroCard);

    const videoCard1 = new VideoCard();
    videoCard1.type = WhyCardTypeEnum.video_card;
    videoCard1.videoURL = 'MqYJQruw7-c';
    videoCard1.title =
      'get more <span>qualitative feedback</span> at all stages';
    videoCard1.imageURL = 'assets/why/video/videoCardImg1@2x.svg';
    videoCard1.backgroundColor = '#858585';
    videoCard1.cardNumber = '1';
    this.cards.push(videoCard1);

    const videoCard2 = new VideoCard();
    videoCard2.type = WhyCardTypeEnum.video_card;
    videoCard2.videoURL = '7fcQCaT0i4E';
    videoCard2.title =
      '<span>find mentors</span> that really make a difference';
    videoCard2.imageURL = 'assets/why/video/videoCardImg2@2x.svg';
    videoCard2.backgroundColor = '#858585';
    videoCard2.cardNumber = '2';
    this.cards.push(videoCard2);

    const videoCard3 = new VideoCard();
    videoCard3.type = WhyCardTypeEnum.video_card;
    videoCard3.videoURL = 'F77BJq3U8jc';
    videoCard3.title =
      'get help on your production problems <span>instantly</span>';
    videoCard3.imageURL = 'assets/why/video/videoCardImg3@2x.svg';
    videoCard3.backgroundColor = '#858585';
    videoCard3.cardNumber = '3';
    this.cards.push(videoCard3);

    const videoCard4 = new VideoCard();
    videoCard4.type = WhyCardTypeEnum.video_card;
    videoCard4.videoURL = 'tF2EKNyfxHM';
    videoCard4.title = 'network in <span>mutually beneficial</span> ways';
    videoCard4.imageURL = 'assets/why/video/videoCardImg4@2x.svg';
    videoCard4.backgroundColor = '#858585';
    videoCard4.cardNumber = '4';
    this.cards.push(videoCard4);

    const videoCard5 = new VideoCard();
    videoCard5.type = WhyCardTypeEnum.video_card;
    videoCard5.videoURL = 'N63YAGDZdqo';
    videoCard5.title = '<span>earn money</span> by improving others artworks';
    videoCard5.imageURL = 'assets/why/video/videoCardImg5@2x.svg';
    videoCard5.backgroundColor = '#858585';
    videoCard5.cardNumber = '5';
    this.cards.push(videoCard5);

    const videoCard6 = new VideoCard();
    videoCard6.type = WhyCardTypeEnum.video_card;
    videoCard6.videoURL = '23XhXapd2Xw';
    videoCard6.title =
      'BE the <span>change</span> you want to see in the world';
    videoCard6.imageURL = 'assets/why/video/videoCardImg6@2x.svg';
    videoCard6.backgroundColor = '#858585';
    videoCard6.cardNumber = '6';
    this.cards.push(videoCard6);
  }

  showWhyjoinCards() {
    const sliderCardManifest = new WhyCard();
    sliderCardManifest.type = WhyCardTypeEnum.slider_manifest_card;
    sliderCardManifest.title = 'OUR MANIFEST';
    sliderCardManifest.subtitle = `to increase every creative's<br/> career chances drastically`;
    sliderCardManifest.backgroundColor = '#858585';

    const manifestSliderItem1 = new WhyCardScrollItem();
    manifestSliderItem1.subtitle = `
      1. Create a platform where<br>
      fame as the main success<br>
      indicator is replaced with<br>
      competence, creativity and<br>
      how helpful one is to others.
    `;
    manifestSliderItem1.iconURL =
      'assets/why/manifest/manifestSliderItem1@2x.svg';

    const manifestSliderItem2 = new WhyCardScrollItem();
    manifestSliderItem2.subtitle = `
      2. Create a platform where<br>
      constant self education<br>
      becomes a natural and easily<br>
      accessible part at every step<br>
      of one’s career.
    `;
    manifestSliderItem2.iconURL =
      'assets/why/manifest/manifestSliderItem2@2x.svg';

    const manifestSliderItem3 = new WhyCardScrollItem();
    manifestSliderItem3.subtitle = `
      3. Create a platform that<br>
      massively encourages<br>
      effective self-education by<br>
      financially rewarding people<br>
      when they learn.
    `;
    manifestSliderItem3.iconURL =
      'assets/why/manifest/manifestSliderItem3@2x.svg';

    const manifestSliderItem4 = new WhyCardScrollItem();
    manifestSliderItem4.subtitle = `
      4. Create an economy that<br>
      spreads wealth amongst all<br>
      members without the need to<br>
      redistribute funds from the<br>
      top.
    `;
    manifestSliderItem4.iconURL =
      'assets/why/manifest/manifestSliderItem4@2x.svg';

    const manifestSliderItem5 = new WhyCardScrollItem();
    manifestSliderItem5.subtitle = `
      5. Use technology to automize<br>
      all legal and financial<br>
      agreements to increase the<br>
      control and profits of their<br>
      creators.
    `;
    manifestSliderItem5.iconURL =
      'assets/why/manifest/manifestSliderItem5@2x.svg';

    const manifestSliderItem6 = new WhyCardScrollItem();
    manifestSliderItem6.subtitle = `
      6. Create a global platform<br>
      that is transparently governed<br>
      and curated by its community.
    `;
    manifestSliderItem6.iconURL =
      'assets/why/manifest/manifestSliderItem6@2x.svg';

    sliderCardManifest.scrollItems = [
      manifestSliderItem1,
      manifestSliderItem2,
      manifestSliderItem3,
      manifestSliderItem4,
      manifestSliderItem5,
      manifestSliderItem6,
    ];

    this.cardManifest = sliderCardManifest;

    // this.addCreativesLoveitCard();
    // this.addAdvisorsLoveitCard();
    // this.addCompaniesLoveitCard();
  }

  addSkipCard() {
    const skipCard = new WhyCard();
    skipCard.type = WhyCardTypeEnum.skip_card;
    skipCard.title = 'FOCUS ON IMPROVING YOUR ART WORKS';
    skipCard.subtitle =
      'AND <strong class="changing-color changing-color--green">skip</b> THINGS LIKE...';
    skipCard.backgroundColor = '#FAFAFA';

    const sliderItems = [
      {
        title: 'Networking Events',
        iconURL: 'assets/why/skip/skipCard1.svg',
        colorClassName: 'green',
      },
      {
        title: 'Marketing',
        iconURL: 'assets/why/skip/skipCard2.svg',
        colorClassName: 'yellow',
      },
      {
        title: 'Elevator Pitches',
        iconURL: 'assets/why/skip/skipCard3.svg',
        colorClassName: 'red',
      },
      {
        title: 'Unrelated Side Jobs',
        iconURL: 'assets/why/skip/skipCard4.svg',
        colorClassName: 'blue',
      },
    ];

    skipCard.scrollItems = sliderItems.map((item) =>
      Object.assign(new WhyCardScrollItem(), item),
    );

    this.cards.push(skipCard);
  }

  addCompaniesLoveitCard() {
    const companiesLoveItSliderCard = new WhyCard();
    companiesLoveItSliderCard.type = WhyCardTypeEnum.slider_card;
    companiesLoveItSliderCard.backgroundColor = '#00C67E';
    companiesLoveItSliderCard.headerBackgroundColor = '#00FFA3';
    companiesLoveItSliderCard.header = 'COMPANIES';

    const companiesLoveItSliderItem1 = new WhyCardScrollItem();
    companiesLoveItSliderItem1.title =
      'Attract more<br/> talents at<br/> no extra costs';
    companiesLoveItSliderItem1.title_mobile =
      'Attract more talents<br/> at no extra costs';
    companiesLoveItSliderItem1.subtitle = `
      Tired of seeing your<br>
      HR costs grow constantly?<br>
      Offer creatives constructive<br>
      feedback on their projects.<br>
      Get paid for the time spent.<br>
      And stay in contact with the ones<br>
      you see big potential in.`;
    companiesLoveItSliderItem1.subtitle_mobile = `
      Tired of seeing your HR costs grow<br>
      constantly? Offer creatives constructive<br>
      feedback on their projects. Get paid for the<br>
      time spent. And stay in contact with the ones<br>
      you see big potential in.`;
    companiesLoveItSliderItem1.iconURL =
      'assets/why/companies/forCompaniesSliderItem1@2x.svg';

    const companiesLoveItSliderItem2 = new WhyCardScrollItem();
    companiesLoveItSliderItem2.title = 'Less is more<br/> for<br/> everyone';
    companiesLoveItSliderItem2.title_mobile = 'Less is more<br/> for everyone';
    companiesLoveItSliderItem2.subtitle = `
      Tired to see a full desk of unanswered job<br>
      requests, the applicants are tired too?<br>
      Research shows that most creatives prefer<br>
      honest detailed feedback, instead of polite<br>
      and unspecific refusals. So, offer honest<br>
      reviews to creatives in exchange for an<br>
      hourly fee of your choosing.`;
    companiesLoveItSliderItem2.subtitle_mobile = `
      Tired to see a full desk of unanswered job requests,<br>
      the applicants are tired too? Research shows that<br>
      most creatives prefer honest detailed feedback,<br>
      instead of polite and unspecific refusals. So,<br>
      offer honest reviews to creatives in exchange<br>
      for an hourly fee of your choosing.`;
    companiesLoveItSliderItem2.iconURL =
      'assets/why/companies/forCompaniesSliderItem2@2x.svg';

    const companiesLoveItSliderItem3 = new WhyCardScrollItem();
    companiesLoveItSliderItem3.title = `Effectively<br/> selecting<br/> talents`;
    companiesLoveItSliderItem3.title_mobile = `Effectively<br/> selecting talents`;
    companiesLoveItSliderItem3.subtitle = `
      Wrong hires or deals are extremely costly.<br>
      Now it is easier than ever to avoid these<br>
      pitfalls. Test people first through their<br>
      works and how they may fit creatively and<br>
      culturally by observing how they adapt<br>
      to feedback in follow up conversations.`;
    companiesLoveItSliderItem3.iconURL =
      'assets/why/companies/forCompaniesSliderItem3@2x.svg';

    const companiesLoveItSliderItem4 = new WhyCardScrollItem();
    companiesLoveItSliderItem4.title = 'Gain a more<br/> motivated<br/> team';
    companiesLoveItSliderItem4.title_mobile = 'Gain a more<br/> motivated team';
    companiesLoveItSliderItem4.subtitle = `
      Imagine an internal dispute in your<br>
      company and all your team discusses this<br>
      process in a nice respectful way, always<br>
      believing that there is a creative solution to<br>
      the problem. Beautiful. Yet totally possible<br>
      if you implement our feedback application<br>
      process into your hiring strategy.`;
    companiesLoveItSliderItem4.subtitle_mobile = `
      Imagine an internal dispute in your company<br>
      and all your team discusses this process in a<br>
      nice respectful way, always believing that there is<br>
      a creative solution to the problem. Beautiful.<br>
      Yet totally possible if you implement our feedback<br>
      application process into your hiring strategy.`;
    companiesLoveItSliderItem4.iconURL =
      'assets/why/companies/forCompaniesSliderItem4@2x.svg';

    const companiesLoveItSliderItem5 = new WhyCardScrollItem();
    companiesLoveItSliderItem5.title = 'Do the<br/> math<br/> yourself';
    companiesLoveItSliderItem5.title_mobile = 'Do the math<br/> yourself';
    companiesLoveItSliderItem5.subtitle = `
      How likely is it that you find several<br>
      extraordinary talents from a pool of<br>
      150 applications? And how likely is it<br>
      to pick them from a pool of<br>
      thousands creatives whom giving<br>
      you their works for review and<br>
      paying for your time spent as well?`;
    companiesLoveItSliderItem5.subtitle_mobile = `
      How likely is it that you find several<br>
      extraordinary talents from a pool of 150<br>
      applications? And how likely is it to pick<br>
      them from a pool of thousands creatives whom<br>
      giving you their works for review and<br>
      paying for your time spent as well?`;
    companiesLoveItSliderItem5.iconURL =
      'assets/why/companies/forCompaniesSliderItem5@2x.svg';

    const companiesLoveSliderItems: WhyCardScrollItem[] = [
      companiesLoveItSliderItem1,
      companiesLoveItSliderItem2,
      companiesLoveItSliderItem3,
      companiesLoveItSliderItem4,
      companiesLoveItSliderItem5,
    ];
    companiesLoveItSliderCard.title = 'ATTRACT MORE TALENTS';
    companiesLoveItSliderCard.scrollItems = companiesLoveSliderItems;
    this.cards.push(companiesLoveItSliderCard);
  }

  addCreativesLoveitCard() {
    const creativesLoveItSliderCard = new WhyCard();
    creativesLoveItSliderCard.type = WhyCardTypeEnum.slider_card;
    creativesLoveItSliderCard.backgroundColor = '#F17E7E';
    creativesLoveItSliderCard.header = 'CREATIVES';
    creativesLoveItSliderCard.headerBackgroundColor = '#D9593C';

    const creativesLoveSliderItem1 = new WhyCardScrollItem();
    creativesLoveSliderItem1.title = `FAST YET<br/> SUSTAINABLE<br/> CAREER BUILDING`;
    creativesLoveSliderItem1.title_mobile = `FAST YET SUSTAINABLE<br/> CAREER BUILDING`;
    creativesLoveSliderItem1.subtitle = `
      Eclipse your competition forever.<br>
      Simply by becoming more<br>
      competent than them.<br>
      By finding perfectly matching<br>
      advisors to your specific needs<br>
      we made this lenghty process<br>
      easier then ever before.`;
    creativesLoveSliderItem1.subtitle_mobile = `
      Eclipse your competition forever.<br>
      Simply by becoming more competent than them.<br>
      By finding perfectly matching advisors<br>
      to your specific needs we made this<br>
      lenghty process easier then ever before.`;
    creativesLoveSliderItem1.iconURL =
      'assets/why/artist/forCreativesSliderItem1@2x.svg';

    const creativesLoveSliderItem2 = new WhyCardScrollItem();
    creativesLoveSliderItem2.title = `Pay only when<br/> receiving<br/> great insights`;
    creativesLoveSliderItem2.title_mobile = `Pay only when<br/> receiving great insights`;
    creativesLoveSliderItem2.subtitle = `
      Only pay the people who really<br>
      inspire you with their ideas and<br>
      insights. Here at Getme.Global you<br>
      choose each mentor yourself.<br>
      Not by name, status or occupation,<br>
      but solely through the insights<br>
      you get about your work.`;
    creativesLoveSliderItem2.subtitle_mobile = `
      Only pay the people who really inspire<br>
      you with their ideas and insights.<br>
      Here at Getme.Global you choose each mentor yourself.<br>
      Not by name, status or occupation, but solely<br>
      through the insights you get about your work.`;
    creativesLoveSliderItem2.iconURL =
      'assets/why/artist/forCreativesSliderItem2@2x.svg';

    const creativesLoveSliderItem3 = new WhyCardScrollItem();
    creativesLoveSliderItem3.title = `NO more<br/> research<br/> DRAMA`;
    creativesLoveSliderItem3.title_mobile = `NO more<br/> research DRAMA`;
    creativesLoveSliderItem3.subtitle = `
      Don\'t waste more time on problems<br>
      than necessary. If you have specific<br>
      questions, for example about a<br>
      software you are stuck with, get<br>
      answers from our adivsors instantly.<br>
      If you are in need of creative insights,<br>
      you can use our feedback tool instead.`;
    creativesLoveSliderItem3.subtitle_mobile = `
      Don\'t waste more time on problems than<br>
      necessary. If you have specific questions,<br>
      for example about a software you are stuck with,<br>
      get answers from our adivsors instantly.<br>
      If you are in need of creative insights,<br>
      you can use our feedback tool instead.`;
    creativesLoveSliderItem3.iconURL =
      'assets/why/artist/forCreativesSliderItem3@2x.svg';

    const creativesLoveSliderItem4 = new WhyCardScrollItem();
    creativesLoveSliderItem4.title = `Grow your<br/> competence<br/> WE DO THE REST`;
    creativesLoveSliderItem4.title_mobile = `Grow your competence<br/> WE DO THE REST`;
    creativesLoveSliderItem4.subtitle = `
      Creating artworks and teaching are<br>
      by far the most effective methods to<br>
      remember things and train your own<br>
      creativity. All tools you need are<br>
      already integrated, from a payment<br>
      system, to a full video conferencing<br>
      system.`;
    creativesLoveSliderItem4.subtitle_mobile = `
      Creating artworks and teaching are by far<br>
      the most effective methods to remember<br>
      things and train your own creativity.<br>
      All tools you need are already integrated,<br>
      from a payment system, to a full video<br>
      conferencing system.`;
    creativesLoveSliderItem4.iconURL =
      'assets/why/artist/forCreativesSliderItem4@2x.svg';

    const creativesLoveSliderItem5 = new WhyCardScrollItem();
    creativesLoveSliderItem5.title = `Do the<br/> Math<br/> YOURSELF`;
    creativesLoveSliderItem5.title_mobile = `Do the Math<br/> YOURSELF`;
    creativesLoveSliderItem5.subtitle = `
      How likely is it that you find several<br>
      truly inspiring mentors from a pool<br>
      of 150 people. And how likely is it<br>
      that you pick them from a pool of<br>
      thousands of people which you pick<br>
      only by their insights they provide<br>
      on your questions and works.`;
    creativesLoveSliderItem5.subtitle_mobile = `
      How likely is it that you find several truly<br>
      inspiring mentors from a pool of 150 people.<br>
      And how likely is it that you pick them from a<br>
      pool of thousands of people which you pick<br>
      only by their insights they provide<br>
      on your questions and works.`;
    creativesLoveSliderItem5.iconURL =
      'assets/why/artist/forCreativesSliderItem5@2x.svg';

    const creativesLoveSliderItems: WhyCardScrollItem[] = [
      creativesLoveSliderItem1,
      creativesLoveSliderItem2,
      creativesLoveSliderItem3,
      creativesLoveSliderItem4,
      creativesLoveSliderItem5,
    ];
    creativesLoveItSliderCard.scrollItems = creativesLoveSliderItems;
    this.cards.push(creativesLoveItSliderCard);
  }

  addAdvisorsLoveitCard() {
    const advisorsLoveItSliderCard = new WhyCard();
    advisorsLoveItSliderCard.type = WhyCardTypeEnum.slider_card;
    advisorsLoveItSliderCard.backgroundColor = '#E3BE30';
    advisorsLoveItSliderCard.headerBackgroundColor = '#FFF500';
    advisorsLoveItSliderCard.header = 'ADVISORS';

    const advisorsLoveSliderItem1 = new WhyCardScrollItem();
    advisorsLoveSliderItem1.title = `NEVER RUN OUT<br/> OF HAPPY<br/> CONNECTIONS`;
    advisorsLoveSliderItem1.title_mobile = `NEVER RUN OUT OF<br/> HAPPY CONNECTIONS`;
    advisorsLoveSliderItem1.subtitle = `
      Bored connections often come from bad<br>
      matchings. But bored connections<br>
      weaken the performance of the<br>
      mentors drastically as well.<br>
      Escape this negative spiral now<br>
      forever, by picking connections from an<br>
      almost indefinite global pool and run<br>
      it through our matching method.`;
    advisorsLoveSliderItem1.subtitle_mobile = `
      Bored connections often come from bad matchings.<br>
      But bored connections weaken the performance of the<br>
      mentors drastically as well. Escape this<br>
      negative spiral now forever, by picking connections<br>
      from an almost indefinite global pool and run<br>
      it through our matching method.`;
    advisorsLoveSliderItem1.iconURL =
      'assets/why/advisor/forAdvisorsSliderItem1@2x.svg';

    const advisorsLoveSliderItem2 = new WhyCardScrollItem();
    advisorsLoveSliderItem2.title = `GET A REGULAR<br/> INCOME WITH THE<br/> THING YOU LOVE`;
    advisorsLoveSliderItem2.title_mobile = `GET A REGULAR INCOME<br/> WITH THE THING YOU LOVE`;
    advisorsLoveSliderItem2.subtitle = `
      Earn money through multiple ways<br>
      actively and even passively. Being<br>
      an inspiring mentor is a mentally<br>
      challenging process, but this<br>
      notwithstanding, we ask for no degrees,<br>
      qualifications or upfront payments.<br>
      We get paid, only when you get paid.`;
    advisorsLoveSliderItem2.subtitle_mobile = `
      Earn money through multiple ways actively
      and even passively. Being an inspiring mentor
      is a mentally challenging process, but asides
      that we ask for no degrees, qualifications or
      upfront payments. We get paid,
      only when you get paid.`;
    advisorsLoveSliderItem2.iconURL =
      'assets/why/advisor/forAdvisorsSliderItem2@2x.svg';

    const advisorsLoveSliderItem3 = new WhyCardScrollItem();
    advisorsLoveSliderItem3.title = `Be Really<br/> inspiring <br/> that's it`;
    advisorsLoveSliderItem3.title_mobile = `Be Really inspiring <br/> that's it`;
    advisorsLoveSliderItem3.subtitle = `
      Our proposal to you:<br>
      You are super helpful with your<br>
      knowledge and creativity to others.<br>
      In return we give you creatives and<br>
      all the tools you need to effectively<br>
      find creatives, consult them in every<br>
      manner and get paid.`;
    advisorsLoveSliderItem3.subtitle_mobile = `
      Our proposal to you:<br>
      You are super helpful with your knowledge<br>
      and creativity to others. In return we<br>
      give you creatives and all the tools you<br>
      need to effectively find creatives, consult<br>
      them in every needed manner and get paid.`;
    advisorsLoveSliderItem3.iconURL =
      'assets/why/advisor/forAdvisorsSliderItem3@2x.svg';

    const advisorsLoveSliderItem4 = new WhyCardScrollItem();
    advisorsLoveSliderItem4.title =
      'Focus ON<br/> Being helpful<br/> we do the rest';
    advisorsLoveSliderItem4.title_mobile =
      'Focus ON Being helpful<br/> we do the rest';
    advisorsLoveSliderItem4.subtitle = `
      Our marketplace includes a fully<br>
      integrated live video conferencing<br>
      system. A time tracker also<br>
      invoices creatives automatically.<br>
      The most advanced & flexible<br>
      feedback tool on the market and a<br>
      fully fleshed out CRM system.`;
    advisorsLoveSliderItem4.subtitle_mobile = `
      Our marketplace includes a fully integrated<br>
      live video conferencing system. A time tracker<br>
      also invoices creatives automatically.<br>
      The most advanced & flexible feedback tool<br>
      on the market and a fully fleshed out<br>
      CRM system.`;
    advisorsLoveSliderItem4.iconURL =
      'assets/why/advisor/forAdvisorsSliderItem4@2x.svg';

    const advisorsLoveSliderItem5 = new WhyCardScrollItem();
    advisorsLoveSliderItem5.title = 'Do the<br/> Math<br/> YOURSELF';
    advisorsLoveSliderItem5.title_mobile = 'Do the Math<br/> YOURSELF';
    advisorsLoveSliderItem5.subtitle = `
      How likely is it that you find several<br>
      truly satisfied connections from a pool<br>
      of 150 people. And how likely is it to<br>
      pick them from a pool of thousands.<br>
      Here you only connect with the ones<br>
      whom respect and value your<br>
      opinion and creative input.`;
    advisorsLoveSliderItem5.subtitle_mobile = `
      How likely is it that you find several truly<br>
      satisfied connections from a pool of 150 people.<br>
      And how likely is it to pick them from a<br>
      pool of thousands. Here you only connect with<br>
      the ones whom respect and value your<br>
      opinion and creative input.`;
    advisorsLoveSliderItem5.iconURL =
      'assets/why/advisor/forAdvisorsSliderItem5@2x.svg';

    const advisorsLoveItSliderCardItems: WhyCardScrollItem[] = [
      advisorsLoveSliderItem1,
      advisorsLoveSliderItem2,
      advisorsLoveSliderItem3,
      advisorsLoveSliderItem4,
      advisorsLoveSliderItem5,
    ];
    advisorsLoveItSliderCard.title = 'FIND NEW STUDENT';
    advisorsLoveItSliderCard.scrollItems = advisorsLoveItSliderCardItems;
    this.cards.push(advisorsLoveItSliderCard);
  }

  didSelectMenuItem(item: IMenuItem) {
    this.menuItem = item;

    const index = this.menuItems.findIndex((_) => item.param === _.param);

    switch (index) {
      case 0: {
        this.cards = [];
        this.showWhyjoinCards();
        this.cdRef.detectChanges();
        break;
      }
      case 1: {
        this.selectedCategory = this.selectedCategory || 'advisers';
        this.cards = [];
        this.showArtistSteps();
        this.cdRef.detectChanges();
        break;
      }
      case 2: {
        this.cards = [];
        this.showTutorials();
        this.cdRef.detectChanges();
        break;
      }
    }
    this.seoService.setSettings(
      this.route.snapshot.data[this.menuItem.param].meta,
    );
  }

  ytPlayerStateChange(event) {
    this.nowPlaying$.next(event);
  }

  selectedCardCategoryChange(event: string) {
    this.selectedCategory = event;
    this.selectedSubCategory = WhyCardTypeEnum.step_card_long_terms;
  }

  navigateToGetHelpPage() {
    this.router.navigate([GET_HELP_PATH]);
  }
}
