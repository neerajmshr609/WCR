export type ValuesUnion<T extends object> = T[keyof T];
export type EventWithTarget<T extends HTMLElement = HTMLElement, E extends (Event & { target: T }) = Event & { target: T }> = E;
export type MouseEventWithHtmlTarget = EventWithTarget<HTMLElement, MouseEvent & { target: HTMLElement }>;