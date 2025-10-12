import { Skill } from '../../../../services/skill/model/skill.model';
import { isArrayAndHasItems } from '../../../../shared/lib/array-helpers.lib';
import { createHttpParams } from '../../../../shared/functions/http-params';

export interface IGetAvailableOpenRequestsParams {
  review_queue?: boolean;
  filter?: Skill[];
  page?: number;
  limit?: number;
}

export const convertIntoHttpParams = (
  params: IGetAvailableOpenRequestsParams = {},
) => {
  const filter = isArrayAndHasItems(params.filter)
    ? params.filter.map((_) => _.id).join(',')
    : null;
  return createHttpParams({
    review_queue: params.review_queue,
    filter,
    page: params.page,
    limit: params.limit,
  });
};
