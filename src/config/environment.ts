import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  PORT,
  ORIGIN,
  LOG_DIR,
  NODE_ENV,
  ENVIRONMENT,
  LOG_FORMAT,
  JWT_KEY,
} = process.env;
