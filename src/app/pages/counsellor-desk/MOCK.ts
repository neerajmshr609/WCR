import { Skill, skillFactory } from '../../shared/models/skill.model';

export const FILTERS_MOCK = [
  skillFactory({
    id: 1,
    name: 'HIV',
    icon: '/assets/counsellor-desk/hiv.svg',
    counselors_amount: 14,
  } as Partial<Skill> & { name: string; counselors_amount: number }),
  skillFactory({
    id: 2,
    name: 'Law Counseling',
    icon: '/assets/counsellor-desk/law.svg',
    counselors_amount: 1,
  } as Partial<Skill> & { name: string; counselors_amount: number }),
];

export const COUNSELLOR_DESK_CARDS: { id: number; img: string }[] = [
  { id: 2, img: '/assets/cards/card2.svg' },
  { id: 3, img: '/assets/cards/card3.svg' },
  { id: 4, img: '/assets/cards/card4.svg' },
  { id: 5, img: '/assets/cards/card5.svg' },
  { id: 6, img: '/assets/cards/card6.svg' },
];
