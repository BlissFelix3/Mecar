import * as dotenv from 'dotenv';

dotenv.config();

const env = (key: string, defaultVal: any = undefined) => {
  return process.env[key] || defaultVal;
};

env.require = (key: string, defaultVal: any = undefined) => {
  const value = process.env[key] || defaultVal;
  if (!value) {
    throw new Error(`Environment variable '${key}' is missing!`);
  }

  return value;
};

const config = {
  environment: env.require('NODE_ENV', 'production'),
  app: {
    name: 'mecar_api',
    port: parseInt(env('APP_PORT', 3001)),
    hostname: env('APP_HOSTNAME', '0.0.0.0'),
    host: env(
      'APP_HOST',
      `http://localhost:${parseInt(env('APP_PORT', 3333))}`,
    ),
    api: {
      version: env('APP_API_VERSION', 'api/v1'),
    },
  },
  db: {
    database: env.require('DB_DATABASE'),
    host: env.require('DB_HOST'),
    port: env.require('DB_PORT'),
    password: env.require('DB_PASSWORD'),
    username: env.require('DB_USERNAME'),
  },

  redis: {
    url: env.require('REDIS_URL'),
  },
  jwt: {
    secret: env.require('JWT_SECRET'),
    signOptions: {
      expiresIn: parseInt(env('JWT_EXPIRES', 30 * 60)),
    },
    refreshTokenExpiresIn: parseInt(
      env('JWT_REFRESH_TOKEN_EXPIRES', 6 * 60 * 60),
    ),
    expiresIn: env.require('EXPIRES_IN'),
  },
  cloudinary: {
    folder: env.require('NODE_ENV', 'production'),
    subfolder: env
      .require(
        'APP_HOST',
        `http://localhost:${parseInt(env('APP_PORT', 3333))}`,
      )
      .replace(/\//g, ''),
  },
};

export default () => config;
