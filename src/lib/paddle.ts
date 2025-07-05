
import { Paddle, Environment } from '@paddle/paddle-node-sdk';

// This is a server-side only module.
// Do not import it in client-side code.

const PADDLE_API_KEY = process.env.PADDLE_API_KEY;

if (!PADDLE_API_KEY) {
  console.warn("PADDLE_API_KEY is not set. Paddle integration will not work.");
}

// Use Environment.sandbox for testing, and Environment.production for live mode.
const PADDLE_ENVIRONMENT = process.env.PADDLE_ENVIRONMENT === 'production'
  ? Environment.production
  : Environment.sandbox;

export const paddle = PADDLE_API_KEY ? new Paddle(PADDLE_API_KEY, {
    environment: PADDLE_ENVIRONMENT,
}) : undefined;
