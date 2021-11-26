import {json} from 'd3';

export const loadRemoteJsonData = async ({urls}) => {
  // TODO: Handle response errors
  return await Promise.all(urls.map(async (url) => {
    return json(url);
  }));
}
