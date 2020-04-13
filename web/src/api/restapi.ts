/** @format */

import { EventEmitter } from 'events';
import { APIError } from './models';

const PREFIX =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

export default class RestAPI {
  public static events = new EventEmitter();

  public static async login(password: string): Promise<any> {
    return this.post('/api/auth/login', { password });
  }

  public static async validate(): Promise<any> {
    return this.post('/api/auth/validate');
  }

  private static async get<T>(path: string): Promise<T> {
    return this.req<T>(path, 'GET');
  }

  private static async post<T>(path: string, data: any = {}): Promise<T> {
    return this.req<T>(path, 'POST', data);
  }

  private static async req<T>(
    path: string,
    method: string,
    data: any = {}
  ): Promise<T> {
    const res = await window.fetch(`${PREFIX}${path}`, {
      method,
      credentials: 'include',
      body: data ? JSON.stringify(data) : null,
      headers: data
        ? {
            'Content-Type': 'application/json',
          }
        : {},
    });
    const body = await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        this.events.emit('auth-error');
      }
      // eslint-disable-next-line
      throw body as APIError;
    }
    return (body ?? {}) as T;
  }
}
