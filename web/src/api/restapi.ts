/** @format */

import { EventEmitter } from 'events';
import { APIError, APIArray, ImageData } from './models';

const PREFIX =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

export enum APIEvent {
  ERROR = 'err',
  AUTH_ERROR = 'auth-err',
}

export default class RestAPI {
  public static events = new EventEmitter();

  // --------------------------------------------------------------------------------
  // -- PUBLIC FUNCTIONS

  public static async authLogin(password: string): Promise<any> {
    return this.post('/api/auth/login', { password });
  }

  public static async authValidate(): Promise<any> {
    return this.post('/api/auth/validate');
  }

  public static async images(
    offset: number = 0,
    n: number = 100
  ): Promise<APIArray<ImageData>> {
    return this.get(`/api/images?offset=${offset}&n=${n}`);
  }

  public static async imagesCount(): Promise<{ count: string }> {
    return this.get(`/api/images?count=true`);
  }

  public static async deleteImage(imageName: string): Promise<any> {
    return this.delete(`/api/images/${imageName}`);
  }

  // --------------------------------------------------------------------------------
  // -- PRIVATE FUNCTIONS

  /**
   * Perform asynchronous GET REST request to given
   * path.
   *
   * @param path relative API path
   */
  private static async get<T>(path: string): Promise<T> {
    return this.req<T>(path, 'GET');
  }

  /**
   * Perform asynchronous POST REST request to given
   * path with passed payload data.
   *
   * @param path   relative API path
   * @param [data] payload *(optional)*
   */
  private static async post<T>(path: string, data: any = null): Promise<T> {
    return this.req<T>(path, 'POST', data);
  }

  /**
   * Perform asynchronous DELETE REST request to given
   * path with passed payload data.
   *
   * @param path   relative API path
   * @param [data] payload *(optional)*
   */
  private static async delete<T>(path: string, data: any = null): Promise<T> {
    return this.req<T>(path, 'DELETE', data);
  }

  /**
   * Perform asynchronous REST request qith given
   * path, method and optional body element which
   * will be encoded and sent as JSON body.
   * The response body will be, when successfully,
   * pasrsed as JSON object and returned.
   * If the request failed or the response code was
   * larger 2xx, an error will be thrown and the event
   * emitter 'event' emits the 'err' event.
   * If the error was 401, an 'auth-err' is
   * emitted.
   *
   * @param path    relative API path
   * @param method  request method
   * @param [data]  request body payload *(optional)*
   */
  private static async req<T>(
    path: string,
    method: string,
    data: any = null
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
      this.events.emit(APIEvent.ERROR, body as APIError);
      if (res.status === 401) {
        this.events.emit(APIEvent.AUTH_ERROR);
      }
      // eslint-disable-next-line
      throw body as APIError;
    }
    return (body ?? {}) as T;
  }
}
