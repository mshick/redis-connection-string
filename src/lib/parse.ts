import { defaults, isNumber, isObject, isString } from 'lodash/fp';
import { parse as parseUrl } from 'url';
import { RedisConfig } from './types';
import {
  castQueryParams,
  cleanObject,
  getDb,
  getHost,
  getPassword,
  getPath,
  getPort,
  getTls
} from './utils';

export function parseConfig(url: any): RedisConfig {
  switch (true) {
    case isObject(url):
      return url;
    case isNumber(url):
      return { port: url };
    case isString(url):
      const parsed = parseUrl(url, true, true);
      const safeUrl =
        parsed.slashes === false && url[0] !== '/' ? '//' + url : url;
      const parsedUrl = parseUrl(safeUrl, true, true);
      const queryParams = castQueryParams(parsedUrl);
      const result = {
        db: getDb(parsedUrl),
        host: getHost(parsedUrl),
        password: getPassword(parsedUrl),
        path: getPath(parsedUrl),
        port: getPort(parsedUrl),
        tls: getTls(parsedUrl)
      };
      return cleanObject(defaults(result, queryParams));
    default:
      return undefined;
  }
}
