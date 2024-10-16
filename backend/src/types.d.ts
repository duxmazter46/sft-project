import session from 'express-session';

declare module 'express-session' {
  interface Session {
    isNew: boolean;
    user?: { id: string; username: string; role?: string; name?:string; email?:string };
  }
}
