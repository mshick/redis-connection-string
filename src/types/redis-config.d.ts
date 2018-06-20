interface RedisConfig {
  host?: string;
  port?: number;
  path?: string;
  db?: number;
  password?: string;
  tls?: boolean;
  family?: number;
  keepAlive?: number;
  noDelay?: boolean;
  connectionName?: string;
  dropBufferSupport?: boolean;
  enableReadyCheck?: boolean;
  enableOfflineQueue?: boolean;
  connectTimeout?: number;
  autoResubscribe?: boolean;
  autoResendUnfulfilledCommands?: boolean;
  lazyConnect?: boolean;
}
