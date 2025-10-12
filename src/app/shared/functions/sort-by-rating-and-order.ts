import { NewsfeedFeedback } from '../models/newsfeedfeedback.model';

export function sortByRatingAndOrder(a: NewsfeedFeedback, b: NewsfeedFeedback) {
  if (a.rating_id !== b.rating_id) {
    return a.rating_id - b.rating_id;
  } else if (a.feedbacktype !== b.feedbacktype) {
    return a.feedbacktype.localeCompare(b.feedbacktype);
  } else {
    return a.order - b.order;
  }
}
