import 'express-session';

declare module 'express-session' {
  interface SessionData {
    errors: Record<string, string[]>,
    olds: Record<string, any>,
  }
}
