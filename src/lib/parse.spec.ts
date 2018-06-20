// tslint:disable:no-expression-statement
import { test } from 'ava';
import { parseConfig } from './parse';

test('get config (passed URL string)', t => {
  const url = 'redis://localhost:6542';
  const parsed = parseConfig(url);

  t.deepEqual(parsed, {
    host: 'localhost',
    port: 6542
  });
});

test('get config (passed object)', t => {
  const url = {
    host: 'localhost',
    port: 6542
  };

  const parsed = parseConfig(url);

  t.deepEqual(parsed, {
    host: 'localhost',
    port: 6542
  });
});

test('get config (passed port)', t => {
  const url = 6542;

  const parsed = parseConfig(url);

  t.deepEqual(parsed, {
    port: 6542
  });
});

test('get config (passed URL string, SSL)', t => {
  const url = 'rediss://localhost:6542';
  const parsed = parseConfig(url);

  t.deepEqual(parsed, {
    host: 'localhost',
    port: 6542,
    tls: true
  });
});

test('get config (passed URL string, password)', t => {
  const url = 'redis://:bar@localhost:6542';
  const parsed = parseConfig(url);

  t.deepEqual(parsed, {
    host: 'localhost',
    password: 'bar',
    port: 6542
  });
});

test('get config (passed URL string, query params)', t => {
  const url =
    'redis://:bar@localhost:6542?tls=true&family=4&noDelay=1&keepAlive=0&dropBufferSupport=false&enableReadyCheck=1&enableOfflineQueue=1&connectTimeout=10000&autoResubscribe=1&autoResendUnfulfilledCommands=1&lazyConnect=0';
  const parsed = parseConfig(url);

  t.deepEqual(parsed, {
    autoResendUnfulfilledCommands: true,
    autoResubscribe: true,
    connectTimeout: 10000,
    dropBufferSupport: false,
    enableOfflineQueue: true,
    enableReadyCheck: true,
    family: 4,
    host: 'localhost',
    keepAlive: 0,
    lazyConnect: false,
    noDelay: true,
    password: 'bar',
    port: 6542,
    tls: true
  });
});
