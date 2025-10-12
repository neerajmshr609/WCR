import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  keyframes,
  state,
  stagger,
} from '@angular/animations';

export const fader = trigger('fader', [
  transition('* <=> *', [
    // Set a default  style for enter and leave
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          transform: 'scale(0.7)',
        }),
      ],
      { optional: true },
    ),
    // Animate the new page in
    query(
      ':enter',
      [animate('.25s ease', style({ opacity: 1, transform: 'scale(1)' }))],
      { optional: true },
    ),
  ]),
]);

export const fadeAnimation = trigger('fadeAnimation', [
  // The '* => *' will trigger the animation to change between any two states
  transition('* => *', [
    // The query function has three params.
    // First is the event, so this will apply on entering or when the element is added to the DOM.
    // Second is a list of styles or animations to apply.
    // Third we add a config object with optional set to true, this is to signal
    // angular that the animation may not apply as it may or may not be in the DOM.
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    query(
      ':leave',
      // here we apply a style and use the animate function to apply the style over 0.3 seconds
      [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))],
      { optional: true },
    ),
    query(
      ':enter',
      [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))],
      { optional: true },
    ),
  ]),
]);

export const smoothHeight = trigger('grow', [
  transition('void <=> *', []),
  transition(
    '* <=> *',
    [style({ height: '{{startHeight}}px' }), animate('.5s ease')],
    {
      params: { startHeight: 0 },
    },
  ),
]);

export const cardFlip = trigger('cardFlip', [
  state('default', style({ transform: 'none' })),
  state('flipped', style({ transform: 'rotateY(180deg)' })),
  state(
    'matched',
    style({ visibility: 'false', transform: 'scale(0.05)', opacity: 0 }),
  ),
  transition('default => flipped', [animate('400ms')]),
  transition('flipped => default', [animate('400ms')]),
  transition('* => matched', [animate('400ms')]),
]);

export const messageAnimation = trigger('messageAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(6px)',
    }),
    animate(
      '180ms ease-out',
      style({
        opacity: 1,
        transform: 'translateY(0)',
      })
    ),
  ]),
  transition(':leave', [
    animate(
      '120ms ease-in',
      style({
        opacity: 0,
        transform: 'translateY(-6px)',
      })
    ),
  ]),
]);

export const messageListStagger = trigger('messageListStagger', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        stagger('60ms', [
          animate(
            '180ms ease-out',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);
