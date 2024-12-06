import Redis, { RedisOptions } from 'ioredis'

export const redisOptions: RedisOptions = {
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_HOST_PASSWORD,
  host: process.env.REDIS_HOST,
}

export const KV = new Redis(redisOptions)
