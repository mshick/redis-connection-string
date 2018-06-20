import {
  defaults,
  isNumber,
  isObject,
  isString,
  isUndefined,
  pickBy
} from 'lodash/fp';
import { parse as parseUrl, UrlWithParsedQuery } from 'url';

const cleanObject = pickBy(x => !isUndefined(x));

const isTruthy = x =>
  !isUndefined(x) && (x === true || x === 1 || x === 'true' || x === '1');

const isFalsey = x =>
  !isUndefined(x) && (x === false || x === 0 || x === 'false' || x === '0');

const toBoolean = (param: any): boolean => {
  switch (true) {
    case isFalsey(param):
      return false;
    case isTruthy(param):
      return true;
    default:
      return undefined;
  }
};

const isRedisProtocol = (protocol: string): boolean => {
  const redisRe = /^rediss?:/;
  return redisRe.test(protocol);
};

const isSecureRedisProtocol = (protocol: string): boolean => {
  const redisRe = /^rediss:/;
  return redisRe.test(protocol);
};

const getPort = (parsed: UrlWithParsedQuery): number => {
  return Number(parsed.port);
};

const getHost = (parsed: UrlWithParsedQuery): string => {
  return parsed.hostname;
};

const getPassword = (parsed: UrlWithParsedQuery): string => {
  return parsed.auth ? parsed.auth.split(':')[1] : undefined;
};

const getDb = (parsed: UrlWithParsedQuery): string => {
  return isRedisProtocol(parsed.protocol) &&
    parsed.pathname &&
    parsed.pathname.length > 1
    ? parsed.pathname.slice(1)
    : undefined;
};

const getPath = (parsed: UrlWithParsedQuery): string => {
  return !isRedisProtocol(parsed.protocol) && parsed.pathname
    ? parsed.pathname
    : undefined;
};

const getTls = (parsed: UrlWithParsedQuery): boolean => {
  return isSecureRedisProtocol(parsed.protocol) || undefined;
};

const castQueryParams = (parsed: UrlWithParsedQuery): RedisConfig => {
  const { query } = parsed;

  return {
    autoResendUnfulfilledCommands: toBoolean(
      query.autoResendUnfulfilledCommands
    ),
    autoResubscribe: toBoolean(query.autoResubscribe),
    connectTimeout: query.connectTimeout
      ? Number(query.connectTimeout)
      : undefined,
    connectionName: query.connectionName
      ? String(query.connectionName)
      : undefined,
    dropBufferSupport: toBoolean(query.dropBufferSupport),
    enableOfflineQueue: toBoolean(query.enableOfflineQueue),
    enableReadyCheck: toBoolean(query.enableReadyCheck),
    family: query.family ? Number(query.family) : undefined,
    keepAlive: query.keepAlive ? Number(query.keepAlive) : undefined,
    lazyConnect: toBoolean(query.lazyConnect),
    noDelay: toBoolean(query.noDelay),
    tls: toBoolean(query.tls)
  };
};

export interface RedisConfig {
  readonly host?: string;
  readonly port?: number;
  readonly path?: string;
  readonly db?: number;
  readonly password?: string;
  readonly tls?: boolean;
  readonly family?: number;
  readonly keepAlive?: number;
  readonly noDelay?: boolean;
  readonly connectionName?: string;
  readonly dropBufferSupport?: boolean;
  readonly enableReadyCheck?: boolean;
  readonly enableOfflineQueue?: boolean;
  readonly connectTimeout?: number;
  readonly autoResubscribe?: boolean;
  readonly autoResendUnfulfilledCommands?: boolean;
  readonly lazyConnect?: boolean;
}

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
