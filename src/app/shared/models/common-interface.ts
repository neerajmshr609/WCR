import { Feedback } from './feedback.model';
import { Project } from './project.model';
import { User } from './user.model';
export interface PickerFileMetadataExtended {
  deleting: boolean;
  width: number;
  height: number;
}

export interface CardSelectedRateback {
  value: number;
  feedback: Feedback;
}

export interface ProjectAndRaterSub {
  project: Project;
  rater: User;
}

export interface MenuItemObject {
  object: any;
  title: string;
}

export enum RatebackValue {
  discouraging = -5,
  unhelpful = -1,
  helpful = 1,
  inspring = 5,
}

export enum TopMenuType {
  user = 1,
  rateback,
}

export default function shuffle<T>(array: T[]): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an Array, got ${typeof array} instead.`);
  }

  const oldArray = [...array];
  let newArray = new Array<T>();

  while (oldArray.length) {
    const i = Math.floor(Math.random() * oldArray.length);
    newArray = newArray.concat(oldArray.splice(i, 1));
  }

  return newArray;
}
