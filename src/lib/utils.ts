import { isUndefined, pickBy } from 'lodash/fp';
import { UrlWithParsedQuery } from 'url';
import { RedisConfig } from './types';

export const cleanObject = pickBy(x => !isUndefined(x));

export const isTruthy = x =>
  !isUndefined(x) && (x === true || x === 1 || x === 'true' || x === '1');

export const isFalsey = x =>
  !isUndefined(x) && (x === false || x === 0 || x === 'false' || x === '0');

export const toBoolean = (param: any): boolean => {
  switch (true) {
    case isFalsey(param):
      return false;
    case isTruthy(param):
      return true;
    default:
      return undefined;
  }
};

export const isRedisProtocol = (protocol: string): boolean => {
  const redisRe = /^rediss?:/;
  return redisRe.test(protocol);
};

export const isSecureRedisProtocol = (protocol: string): boolean => {
  const redisRe = /^rediss:/;
  return redisRe.test(protocol);
};

export const getPort = (parsed: UrlWithParsedQuery): number => {
  return Number(parsed.port);
};

export const getHost = (parsed: UrlWithParsedQuery): string => {
  return parsed.hostname;
};

export const getPassword = (parsed: UrlWithParsedQuery): string => {
  return parsed.auth ? parsed.auth.split(':')[1] : undefined;
};

export const getDb = (parsed: UrlWithParsedQuery): string => {
  return isRedisProtocol(parsed.protocol) &&
    parsed.pathname &&
    parsed.pathname.length > 1
    ? parsed.pathname.slice(1)
    : undefined;
};

export const getPath = (parsed: UrlWithParsedQuery): string => {
  return !isRedisProtocol(parsed.protocol) && parsed.pathname
    ? parsed.pathname
    : undefined;
};

export const getTls = (parsed: UrlWithParsedQuery): boolean => {
  return isSecureRedisProtocol(parsed.protocol) || undefined;
};

export const castQueryParams = (parsed: UrlWithParsedQuery): RedisConfig => {
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
