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
