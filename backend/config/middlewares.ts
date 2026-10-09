import type { Core } from '@strapi/strapi';

const allowedOrigins = (process.env.FRONTEND_URLS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      includeUnparsed: true,
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::rate-limit',
];

export default config;
